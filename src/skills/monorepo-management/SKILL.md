---
name: monorepo-management
description: Nx, Turborepo, and Lerna workflows for monorepo management. Use for large-scale projects with multiple packages.
---

# 📦 Monorepo Management Skill

## Tools Comparison

| Feature | Nx | Turborepo | Lerna |
|---------|----| ----------|-------|
| Caching | ✅ Local + Remote | ✅ Local + Remote | ❌ |
| Affected | ✅ Built-in | ⚠️ Manual | ⚠️ Limited |
| Generators | ✅ Rich | ❌ None | ❌ None |
| Learning | Steep | Easy | Easy |

---

## Turborepo Setup

```bash
npx create-turbo@latest
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Commands
```bash
turbo run build           # Build all packages
turbo run build --filter=web  # Build specific package
turbo run lint test       # Run multiple tasks
```

---

## Nx Setup

```bash
npx create-nx-workspace@latest myorg
```

### nx.json
```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
```

### Commands
```bash
nx build web              # Build specific project
nx affected:build         # Build affected only
nx graph                  # Visualize dependencies
nx generate @nx/react:component button --project=ui
```

---

## Package Structure

```
monorepo/
├── apps/
│   ├── web/               # Next.js app
│   ├── admin/             # Admin dashboard
│   └── api/               # Backend API
├── packages/
│   ├── ui/                # Shared components
│   ├── utils/             # Shared utilities
│   └── config/            # Shared configs
├── turbo.json
└── package.json
```

---

## Workspace Setup

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Internal Packages
```json
// packages/ui/package.json
{
  "name": "@myorg/ui",
  "main": "./src/index.ts"
}

// apps/web/package.json
{
  "dependencies": {
    "@myorg/ui": "workspace:*"
  }
}
```

---

## Checklist

- [ ] Choose monorepo tool
- [ ] Set up workspace config
- [ ] Configure build pipeline
- [ ] Enable caching (local/remote)
- [ ] Set up affected builds
- [ ] Configure CI/CD integration
