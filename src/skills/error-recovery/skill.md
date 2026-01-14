---
name: error-recovery
description: Implement auto-retry, resume mechanisms, and graceful error recovery. Use when building resilient systems like TikTok Uploader that need to handle failures gracefully.
---

# 🔄 Error Recovery Skill

## Retry Patterns

### Exponential Backoff
```javascript
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.min(1000 * Math.pow(2, i), 30000);
      console.log(`Retry ${i + 1}/${maxRetries} in ${delay}ms`);
      await sleep(delay);
    }
  }
}

// Usage
const result = await retryWithBackoff(() => uploadFile(file));
```

### With Jitter
```javascript
function getDelayWithJitter(attempt) {
  const baseDelay = 1000 * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(baseDelay + jitter, 30000);
}
```

---

## Resume Mechanism

### Save Progress
```javascript
async function uploadWithResume(file, onProgress) {
  const checkpoint = await getCheckpoint(file.id);
  const startByte = checkpoint?.uploadedBytes || 0;
  
  try {
    const result = await uploadChunk(file, startByte, (progress) => {
      saveCheckpoint(file.id, { uploadedBytes: progress });
      onProgress(progress);
    });
    
    clearCheckpoint(file.id);
    return result;
  } catch (error) {
    console.log('Upload paused, can resume from:', startByte);
    throw error;
  }
}
```

### Queue Persistence
```javascript
// Save queue to storage
async function saveQueue(queue) {
  await chrome.storage.local.set({ uploadQueue: queue });
}

// Restore on startup
async function restoreQueue() {
  const { uploadQueue } = await chrome.storage.local.get('uploadQueue');
  return uploadQueue || [];
}
```

---

## Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = 0;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

---

## Error Classification

```javascript
function isRetryable(error) {
  const retryableCodes = [
    'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND',
    'NETWORK_ERROR', 'RATE_LIMIT'
  ];
  
  const retryableStatus = [408, 429, 500, 502, 503, 504];
  
  return retryableCodes.includes(error.code) ||
         retryableStatus.includes(error.status);
}
```

---

## TikTok Uploader Recovery

```javascript
// On page reload
chrome.runtime.onStartup.addListener(async () => {
  const pendingUploads = await restoreQueue();
  if (pendingUploads.length > 0) {
    console.log(`Resuming ${pendingUploads.length} uploads`);
    processQueue(pendingUploads);
  }
});

// On upload failure
async function handleUploadFailure(file, error) {
  if (isRetryable(error)) {
    file.retryCount = (file.retryCount || 0) + 1;
    if (file.retryCount <= 3) {
      await addToQueue(file); // Re-queue
    } else {
      await moveToFailed(file);
    }
  }
}
```
