---
name: prompt-engineering
description: LLM prompt optimization and design patterns. Use for crafting effective prompts, chain-of-thought, and AI integration.
---

# 🎯 Prompt Engineering Skill

## Prompt Patterns

### Zero-Shot
```
Translate the following text to Thai: "Hello, how are you?"
```

### Few-Shot
```
Examples:
Input: "Good morning" → Output: "สวัสดีตอนเช้า"
Input: "Thank you" → Output: "ขอบคุณ"
Input: "Goodbye" → Output: ?
```

### Chain-of-Thought (CoT)
```
Let's solve this step by step:
1. First, identify the problem
2. Break down the components
3. Apply relevant formula
4. Calculate the answer
5. Verify the result
```

---

## Prompting Best Practices

### Structure
```markdown
# Role
You are an expert Python developer.

# Context
We are building a REST API using FastAPI.

# Task
Create a user registration endpoint.

# Requirements
- Validate email format
- Hash password with bcrypt
- Return JWT token

# Output Format
Return complete, working code with comments.
```

### Be Specific ✅
```
❌ "Write code for a button"
✅ "Create a React button component that:
   - Has primary and secondary variants
   - Accepts onClick handler
   - Shows loading spinner when isLoading is true
   - Uses Tailwind CSS for styling"
```

---

## Advanced Techniques

### Self-Consistency
```
Generate 3 different solutions, then pick the best one.
```

### Tree-of-Thought
```
Consider multiple approaches:
Approach A: [describe]
Approach B: [describe]
Approach C: [describe]
Compare and select optimal solution.
```

### RAG Pattern
```
Context: [Retrieved documents]
Question: [User query]
Answer based ONLY on the context provided.
```

---

## Temperature Guide

| Temperature | Use Case |
|-------------|----------|
| 0.0 - 0.3 | Factual, code generation |
| 0.4 - 0.7 | Balanced creativity |
| 0.8 - 1.0 | Creative writing |

---

## Checklist

- [ ] Define clear role/persona
- [ ] Provide sufficient context
- [ ] Be specific about output format
- [ ] Use examples when helpful
- [ ] Iterate and refine prompts
