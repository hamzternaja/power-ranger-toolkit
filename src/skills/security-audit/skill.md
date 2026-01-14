---
name: security-audit
description: Security best practices including CSP, XSS prevention, input validation, and secrets management. Use when reviewing security or hardening applications.
---

# 🔒 Security Audit Skill

## Security Checklist

### Input Validation
- [ ] All user inputs validated
- [ ] Server-side validation (not just client)
- [ ] Whitelist allowed values
- [ ] Sanitize before storage/display

### Authentication
- [ ] Passwords hashed (bcrypt/argon2)
- [ ] Session tokens secure (httpOnly, secure)
- [ ] Rate limiting on login
- [ ] 2FA available

### Secrets
- [ ] No hardcoded API keys
- [ ] Secrets in env variables
- [ ] .env in .gitignore
- [ ] Secrets rotated regularly

---

## XSS Prevention

### ❌ Vulnerable
```javascript
element.innerHTML = userInput;
document.write(userInput);
```

### ✅ Safe
```javascript
// Use textContent
element.textContent = userInput;

// Sanitize HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Trusted Types (Chrome)
const policy = trustedTypes.createPolicy('safe', {
  createHTML: (input) => DOMPurify.sanitize(input)
});
element.innerHTML = policy.createHTML(userInput);
```

---

## Content Security Policy

### Manifest V3
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### HTTP Header
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

---

## SQL Injection Prevention

### ❌ Vulnerable
```javascript
const query = `SELECT * FROM users WHERE id = '${userId}'`;
```

### ✅ Safe (Parameterized)
```javascript
// Node.js with pg
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Python with psycopg2
cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
```

---

## Secrets Management

### Environment Variables
```bash
# .env (never commit!)
API_KEY=sk-xxxx
DATABASE_URL=postgres://...

# .env.example (commit this)
API_KEY=your-api-key-here
DATABASE_URL=your-database-url
```

### Load in Code
```javascript
// Node.js
require('dotenv').config();
const apiKey = process.env.API_KEY;

// Never log secrets
console.log('API Key:', apiKey); // ❌ BAD
```

---

## Chrome Extension Security

### Message Validation
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Verify sender
  if (!sender.tab || !sender.tab.url.includes('trusted-domain.com')) {
    return;
  }
  
  // Validate message structure
  if (typeof message.type !== 'string') {
    return;
  }
  
  // Process...
});
```

### External Connections
```json
{
  "host_permissions": [
    "https://api.tiktok.com/*"  // Specific, not *
  ]
}
```

---

## Common Vulnerabilities

| Vuln | Prevention |
|------|------------|
| XSS | textContent, Trusted Types |
| SQL Injection | Parameterized queries |
| CSRF | CSRF tokens, SameSite cookies |
| Secrets leak | Env vars, .gitignore |
| Open redirect | Validate redirect URLs |

---

## 🔍 Automated Vulnerability Scanning

### NPM Audit
```bash
# Check vulnerabilities
npm audit

# Auto-fix where possible
npm audit fix

# Force fix (may have breaking changes)
npm audit fix --force

# JSON output for CI
npm audit --json > audit-report.json
```

### Snyk
```bash
# Install
npm install -g snyk

# Authenticate
snyk auth

# Test project
snyk test

# Monitor continuously
snyk monitor
```

### OWASP Dependency-Check
```bash
# Docker
docker run --rm -v $(pwd):/src owasp/dependency-check \
  --scan /src --format HTML --out /src/report
```

---

## 📦 Dependency Audit

### Check Outdated
```bash
# NPM
npm outdated

# Show all deps
npm ls --all

# Check for known issues
npx is-my-node-ok
```

### Security Headers Check
```bash
# Check security headers
curl -I https://example.com | grep -i security
curl -I https://example.com | grep -i x-content-type
curl -I https://example.com | grep -i x-frame-options
```

### Automated CI Check
```yaml
# GitHub Actions
- name: Security Audit
  run: |
    npm audit --audit-level=high
    npx snyk test --severity-threshold=high
```

---

## Audit Checklist

- [ ] Run npm audit
- [ ] Check outdated dependencies
- [ ] Scan with Snyk/OWASP
- [ ] Review security headers
- [ ] Check for hardcoded secrets
- [ ] Validate CSP configuration
- [ ] Test authentication flows
- [ ] Review access controls
