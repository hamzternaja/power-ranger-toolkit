---
name: performance-optimization
description: Optimize performance for memory, CPU, network, and rendering. Use when improving FPS, reducing memory usage, or fixing performance bottlenecks.
---

# ⚡ Performance Optimization Skill

## Memory Optimization

### Avoid Memory Leaks
```javascript
// ❌ Bad - listener not removed
element.addEventListener('click', handler);

// ✅ Good - cleanup
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// Later: controller.abort();
```

### Object Pooling
```javascript
class FramePool {
  constructor(size) {
    this.pool = Array(size).fill(null).map(() => new ArrayBuffer(1024 * 1024));
    this.available = [...this.pool];
  }
  
  acquire() {
    return this.available.pop() || new ArrayBuffer(1024 * 1024);
  }
  
  release(buffer) {
    this.available.push(buffer);
  }
}
```

---

## Network Optimization

### Debounce Requests
```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSearch = debounce(searchAPI, 300);
```

### Batch Requests
```javascript
class RequestBatcher {
  constructor(batchFn, delay = 50) {
    this.queue = [];
    this.batchFn = batchFn;
    this.delay = delay;
  }
  
  add(item) {
    this.queue.push(item);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), this.delay);
  }
  
  flush() {
    if (this.queue.length > 0) {
      this.batchFn([...this.queue]);
      this.queue = [];
    }
  }
}
```

---

## Rendering Optimization

### RequestAnimationFrame
```javascript
// ❌ Bad
setInterval(render, 16);

// ✅ Good
function animate() {
  render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Throttle FPS
```javascript
let lastFrame = 0;
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;

function animate(timestamp) {
  if (timestamp - lastFrame >= frameInterval) {
    render();
    lastFrame = timestamp;
  }
  requestAnimationFrame(animate);
}
```

---

## Image/Video Optimization

### Compression
```javascript
// Canvas to JPEG with quality
canvas.toBlob((blob) => {
  sendFrame(blob);
}, 'image/jpeg', 0.5); // 50% quality

// Resize before send
const scale = 0.5;
ctx.drawImage(video, 0, 0, width * scale, height * scale);
```

### Lazy Loading
```html
<img loading="lazy" src="image.jpg">
```

---

## Profiling Tools

| Tool | Use Case |
|------|----------|
| Chrome DevTools → Performance | CPU, rendering |
| Chrome DevTools → Memory | Memory leaks |
| Lighthouse | Overall score |
| console.time() | Measure code blocks |

```javascript
console.time('upload');
await uploadFile(file);
console.timeEnd('upload'); // upload: 1234ms
```

---

## TitanMirror Performance

| Setting | Value | Impact |
|---------|-------|--------|
| Resolution | 480p | -60% bandwidth |
| JPEG Quality | 50% | -50% size |
| Target FPS | 25 | Smooth enough |
| ImageReader Buffer | 5 | Prevent drops |
