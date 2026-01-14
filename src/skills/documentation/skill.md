---
name: documentation
description: Create clear and comprehensive documentation including README, API docs, code comments, and changelogs. Use this skill when writing or improving project documentation.
---

# 📝 Documentation Skill

## README Template

```markdown
# Project Name

Brief description of what this project does.

## Features
- Feature 1
- Feature 2

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`javascript
// Example code
\`\`\`

## Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## License
MIT
```

## API Documentation Format

```markdown
### Endpoint Name

**POST** `/api/endpoint`

**Description:** What this endpoint does

**Headers:**
| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | Bearer token |

**Request Body:**
\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

**Error Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
```

## Code Comments (JSDoc)

```javascript
/**
 * Calculates the total price with tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {number} Total price with tax
 * @example
 * calculateTotal(100, 0.07) // returns 107
 */
function calculateTotal(price, taxRate) {
  return price * (1 + taxRate);
}
```

## Changelog Format

```markdown
## [1.2.0] - 2026-01-14

### Added
- New feature X

### Changed
- Updated behavior of Y

### Fixed
- Bug in Z

### Removed
- Deprecated function W
```

## Best Practices

1. **Write for newcomers** - อย่าสมมติว่าคนอ่านรู้ทุกอย่าง
2. **Include examples** - ตัวอย่างดีกว่าคำอธิบาย
3. **Keep updated** - Docs ต้อง sync กับ code
4. **Use diagrams** - รูปภาพช่วยให้เข้าใจง่าย
