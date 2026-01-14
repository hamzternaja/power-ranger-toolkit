---
name: git-workflow
description: Git workflows including branching, merging, PR review, and conflict resolution. Use when managing version control, reviewing changes, or fixing merge conflicts.
---

# 🌿 Git Workflow Skill

## Branching Strategy

```
main (production)
├── develop (integration)
│   ├── feature/upload-queue
│   ├── feature/multi-folder
│   └── bugfix/round-robin
```

---

## Common Commands

### Branch Management
```bash
# Create and switch
git checkout -b feature/new-feature

# List branches
git branch -a

# Delete branch
git branch -d feature/old-feature
```

### Commit
```bash
# Stage and commit
git add .
git commit -m "feat: add upload queue"

# Amend last commit
git commit --amend -m "feat: add upload queue with retry"
```

### Sync
```bash
# Pull with rebase
git pull --rebase origin main

# Push
git push origin feature/new-feature
```

---

## Commit Message Format

```
<type>(<scope>): <subject>

[body]

[footer]
```

| Type | Usage |
|------|-------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting |
| refactor | Code restructure |
| test | Adding tests |
| chore | Maintenance |

**Examples:**
```
feat(uploader): add round-robin folder selection
fix(socket): resolve connection timeout issue
docs(readme): update installation steps
```

---

## Conflict Resolution

### 1. Identify Conflicts
```bash
git status
# Look for "both modified" files
```

### 2. Open Conflicted File
```
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name
```

### 3. Resolve & Complete
```bash
# After fixing manually
git add resolved-file.js
git rebase --continue
# or
git merge --continue
```

---

## PR Review Checklist

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] No console.log/debug code
- [ ] Documentation updated
- [ ] No hardcoded secrets
- [ ] Commit messages clear

---

## Recovery Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- file.js

# Stash changes
git stash
git stash pop

# View history
git log --oneline -10
```
