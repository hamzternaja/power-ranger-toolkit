# 📋 Changelog Generator Skill

---
name: changelog-generator
description: Generate changelogs automatically from git commits following conventional changelog format
---

## 🎯 Purpose

สร้าง changelogs อัตโนมัติจาก git commits ตาม conventional changelog format

## 📋 When to Use

- Release version ใหม่
- Update changelog หลัง merge
- Document changes สำหรับ users
- Prepare release notes

## 🔧 Changelog Format

### Keep a Changelog Format
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature for users

### Changed
- Improved performance of...

### Fixed
- Bug that caused...

### Removed
- Deprecated feature...

## [1.0.0] - 2024-01-15

### Added
- Initial release
```

## 📝 Generation Process

```
1. GET commits since last release
   git log v1.0.0..HEAD --oneline

2. PARSE conventional commits
   feat: → Added
   fix: → Fixed
   docs: → Documentation (optional)
   refactor: → Changed
   perf: → Changed (Performance)
   BREAKING CHANGE: → Breaking

3. GROUP by type
   - Added (feat)
   - Changed (refactor, perf)
   - Fixed (fix)
   - Removed
   - Security

4. FORMAT output
   - Markdown format
   - Links to commits/PRs
   - Version and date

5. UPDATE CHANGELOG.md
   - Prepend new section
   - Keep history
```

## 📊 Commit Type Mapping

| Commit Type | Changelog Section |
|-------------|-------------------|
| `feat` | ✨ Added |
| `fix` | 🐛 Fixed |
| `perf` | ⚡ Performance |
| `refactor` | ♻️ Changed |
| `docs` | 📝 Documentation |
| `style` | 💄 Styling |
| `test` | ✅ Tests |
| `build` | 📦 Build |
| `ci` | 👷 CI |
| `chore` | 🔧 Chores |
| `revert` | ⏪ Reverted |
| `BREAKING` | 💥 Breaking Changes |

## 📋 Generated Changelog Example

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### ✨ Added
- Add user authentication with OAuth2 ([#45](link))
- Add dark mode support ([#48](link))
- Add export to CSV feature ([#52](link))

### 🐛 Fixed
- Fix login redirect loop ([#44](link))
- Fix mobile menu not closing ([#47](link))

### ⚡ Performance
- Optimize database queries for user list ([#50](link))

### 💥 Breaking Changes
- Changed login API response format
  - Before: `{ data: { user, token } }`
  - After: `{ user, token }`

---

## [1.1.0] - 2024-01-01

### ✨ Added
- Add password reset functionality
- Add email notifications

### 🐛 Fixed
- Fix timezone issues in date picker
```

## 🔧 Automation Tools

### conventional-changelog
```bash
npm install -D conventional-changelog-cli

# Generate changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

### release-please (GitHub)
```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
```

### standard-version
```bash
npm install -D standard-version

# Create release
npx standard-version
```

## 📝 Manual Generation Template

```markdown
## [{version}] - {date}

### ✨ Added
{for each feat commit}
- {description} ([#{pr}](link))

### 🐛 Fixed
{for each fix commit}
- {description} ([#{pr}](link))

### ♻️ Changed
{for each refactor/perf commit}
- {description} ([#{pr}](link))

### 💥 Breaking Changes
{for each BREAKING CHANGE}
- {description}
  {migration guide if needed}
```

## 🔧 Git Commands for History

```bash
# Commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Commits with conventional format
git log --oneline | grep -E "^[a-f0-9]+ (feat|fix|docs|style|refactor|perf|test|build|ci|chore)"

# PRs merged
git log --merges --oneline

# Contributors
git log --format='%aN' | sort -u
```

## ✅ Changelog Checklist

- [ ] Version number correct
- [ ] Date is release date
- [ ] All notable changes included
- [ ] Breaking changes documented
- [ ] Migration guide provided (if breaking)
- [ ] Links to PRs/issues
- [ ] User-friendly language
- [ ] Sorted by importance

## 🔗 Related Skills

- `commit-message` - Generate commits
- `git-workflow` - Git operations
- `documentation` - Document changes
