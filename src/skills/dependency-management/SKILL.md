# 📦 Dependency Management Skill

---
name: dependency-management
description: Manage project dependencies including installation, updates, conflict resolution, and security audits
---

## 🎯 Purpose

จัดการ dependencies ทั้งหมดของ project: ติดตั้ง, อัพเดท, แก้ conflicts, และตรวจสอบ security vulnerabilities

## 📋 When to Use

- ติดตั้ง packages ใหม่
- อัพเดท dependencies
- แก้ไข version conflicts
- ตรวจสอบ security issues
- Reduce bundle size
- Cleanup unused packages

## 🔧 Core Operations

### 1. Install Dependencies
```bash
# Install single package
npm install package-name

# Install dev dependency
npm install -D package-name

# Install specific version
npm install package-name@1.2.3

# Install from git
npm install github:user/repo
```

### 2. Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update single package
npm update package-name

# Update all (within semver)
npm update

# Update to latest (ignore semver)
npm install package-name@latest
```

### 3. Remove Dependencies
```bash
# Remove single package
npm uninstall package-name

# Find unused packages
npx depcheck

# Clean install
rm -rf node_modules && npm install
```

## 📊 Dependency Analysis

### Check Outdated
```bash
npm outdated
```
| Package | Current | Wanted | Latest |
|---------|---------|--------|--------|
| react | 18.2.0 | 18.2.0 | 18.3.1 |
| next | 14.0.0 | 14.1.4 | 14.2.0 |

### Check Vulnerabilities
```bash
npm audit
```
| Severity | Package | Recommendation |
|----------|---------|----------------|
| High | lodash | Update to 4.17.21+ |
| Critical | axios | Update to 1.6.0+ |

### Analyze Bundle Size
```bash
# Bundle analyzer
npm install -D @next/bundle-analyzer
npx vite-bundle-visualizer
```

## 🔄 Conflict Resolution

### Common Conflicts

#### Peer Dependency Conflicts
```bash
# Error: Could not resolve peer dependency
# Solutions:
npm install --legacy-peer-deps
npm install --force

# Better: Find compatible versions
npm info package-name peerDependencies
```

#### Version Mismatch
```json
// package.json - use resolutions
{
  "resolutions": {
    "package-name": "1.2.3"
  }
}

// Or overrides (npm 8.3+)
{
  "overrides": {
    "package-name": "1.2.3"
  }
}
```

## 📝 Dependency Audit Process

```
1. ANALYZE current state
   npm outdated
   npm audit

2. IDENTIFY issues
   - Outdated packages
   - Security vulnerabilities
   - Unused packages

3. PRIORITIZE updates
   - Security fixes first
   - Major version updates carefully
   - Breaking changes with caution

4. UPDATE safely
   - Update one at a time
   - Run tests after each update
   - Check for breaking changes

5. VERIFY
   - All tests pass
   - App works correctly
   - No new vulnerabilities
```

## 📦 Package.json Best Practices

### Version Ranges
```json
{
  "dependencies": {
    // Exact version (recommended for apps)
    "react": "18.2.0",
    
    // Patch updates only
    "lodash": "~4.17.21",
    
    // Minor updates only
    "axios": "^1.6.0"
  }
}
```

### Recommended Structure
```json
{
  "dependencies": {
    // Runtime dependencies only
  },
  "devDependencies": {
    // Build tools, testing, types
  },
  "peerDependencies": {
    // For libraries only
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

## 🛡️ Security Practices

### Regular Audits
```bash
# Run security audit
npm audit

# Auto-fix safe issues
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

### Lock Files
```bash
# Always commit lock files
git add package-lock.json  # npm
git add pnpm-lock.yaml     # pnpm
git add yarn.lock          # yarn
```

## 📋 Useful Commands

| Task | Command |
|------|---------|
| Install all | `npm install` |
| Install package | `npm install pkg` |
| Install dev | `npm install -D pkg` |
| Uninstall | `npm uninstall pkg` |
| Check outdated | `npm outdated` |
| Update all | `npm update` |
| Audit security | `npm audit` |
| Auto-fix | `npm audit fix` |
| Find unused | `npx depcheck` |
| Why installed | `npm why pkg` |
| List all | `npm list` |
| View info | `npm info pkg` |

## ✅ Management Checklist

- [ ] All packages have specific versions
- [ ] No high/critical vulnerabilities
- [ ] No unused packages
- [ ] Lock file committed
- [ ] Dev and prod dependencies separated
- [ ] Node version specified in engines

## 🔗 Related Skills

- `project-setup` - Initial project setup
- `security-audit` - Security analysis
- `ci-cd-pipeline` - Automated dependency updates
