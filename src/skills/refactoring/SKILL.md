---
name: refactoring
description: AI-powered code refactoring and modernization. Use this skill for code cleanup, technical debt reduction, framework migration, and improving code quality.
---

# 🔄 Refactoring Skill

## Refactoring Patterns

### 1. Extract Method/Function
```javascript
// Before ❌
function processOrder(order) {
  // 50 lines of validation
  // 30 lines of calculation
  // 20 lines of formatting
}

// After ✅
function processOrder(order) {
  const validated = validateOrder(order);
  const calculated = calculateTotal(validated);
  return formatOutput(calculated);
}
```

### 2. Simplify Conditionals
```javascript
// Before ❌
if (user && user.role === 'admin' || user && user.role === 'superadmin') {
  if (user.permissions && user.permissions.includes('write')) { ... }
}

// After ✅
const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
const canWrite = user?.permissions?.includes('write');
if (isAdmin && canWrite) { ... }
```

### 3. Remove Code Smells
| Code Smell | Solution |
|------------|----------|
| Magic Numbers | Extract to named constants |
| Long Parameters | Use object/options pattern |
| Duplicate Code | Extract to shared function |
| Dead Code | Delete unused code |
| Deep Nesting | Early return pattern |

---

## Framework Migration

### React Class → Functional
```javascript
// Before (Class)
class Counter extends Component {
  state = { count: 0 };
  increment = () => this.setState({ count: this.state.count + 1 });
  render() { return <button onClick={this.increment}>{this.state.count}</button> }
}

// After (Functional)
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return <button onClick={increment}>{count}</button>;
}
```

### CommonJS → ESM
```javascript
// Before (CommonJS)
const fs = require('fs');
module.exports = { readFile };

// After (ESM)
import fs from 'fs';
export { readFile };
```

---

## Refactoring Checklist

- [ ] มีหน่วยทดสอบก่อน refactor
- [ ] Refactor ทีละขั้น commit บ่อยๆ
- [ ] ไม่เปลี่ยน behavior เดิม
- [ ] Run tests หลังทุกการเปลี่ยนแปลง
- [ ] Code review อีกรอบ

## Commands

```powershell
# Find duplicate code
npx jscpd ./src

# Find unused exports
npx ts-unused-exports tsconfig.json

# Check complexity
npx eslint --rule 'complexity: ["error", 10]' ./src
```
