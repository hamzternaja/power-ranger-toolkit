"""
Sync APPS Problems from problems-advanced.md to problems.md and solutions.md
"""
import re

# Configuration
SOURCE_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems-advanced.md"
PROBLEMS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems.md"
SOLUTIONS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\solutions.md"
NUM_PROBLEMS = 100  # Number of problems to sync
START_PROBLEM_ID = 1002  # Starting ID in problems.md
START_SOLUTION_ID = 2028  # Starting ID in solutions.md

print(f"📖 Reading first {NUM_PROBLEMS} problems from problems-advanced.md...")

# Read source file (only first portion)
with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    content = ""
    lines_read = 0
    max_lines = 15000  # Read enough for ~100 problems
    for line in f:
        content += line
        lines_read += 1
        if lines_read >= max_lines:
            break

print(f"   Read {lines_read} lines")

# Parse problems using regex
problem_pattern = r'## Problem (\d+): Advanced Problem \d+\s*\n\n\*\*Source:\*\* APPS \| \*\*Difficulty:\*\* (\w+)\s*\n\n### Description\n(.*?)### Sample Solution\n```python\n(.*?)```\s*\n\n### Input/Output Examples'
matches = re.findall(problem_pattern, content, re.DOTALL)

print(f"   Found {len(matches)} problems")

# Generate problems entries
problems_entries = []
solutions_entries = []

for i, (num, difficulty, description, solution) in enumerate(matches[:NUM_PROBLEMS]):
    problem_id = START_PROBLEM_ID + i
    solution_id = START_SOLUTION_ID + i
    
    # Clean description (first 200 chars for summary)
    desc_clean = description.strip().replace('\n', ' ')[:300].strip()
    if len(desc_clean) >= 297:
        desc_clean = desc_clean[:297] + "..."
    
    # Problem entry
    problems_entries.append(f"""
## Problem {problem_id}: APPS Advanced {i+1}
- **Status**: ✅ Solved
- **Type**: APPS
- **Difficulty**: {difficulty.capitalize()}
- **Description**: {desc_clean}

---""")
    
    # Solution entry
    solutions_entries.append(f"""
## Solution #{solution_id}: APPS Advanced {i+1}

### 📋 Metadata
| Field | Value |
|-------|-------|
| **Project** | Practice (APPS #{i+1}) |
| **Date** | 2026-01-12 |
| **Tags** | `algorithm`, `{difficulty}`, `python` |
| **Difficulty** | {difficulty.capitalize()} |

### ✅ Solution
```python
{solution.strip()}
```

---""")

print(f"✅ Generated {len(problems_entries)} problem entries")
print(f"✅ Generated {len(solutions_entries)} solution entries")

# Append to problems.md
print(f"📝 Appending to problems.md...")
with open(PROBLEMS_FILE, 'a', encoding='utf-8') as f:
    f.write("\n\n# 🆕 APPS Advanced Problems (Synced)\n")
    f.write("".join(problems_entries))

# Append to solutions.md (before the template section)
print(f"📝 Appending to solutions.md...")
with open(SOLUTIONS_FILE, 'r', encoding='utf-8') as f:
    solutions_content = f.read()

# Find the template section and insert before it
template_marker = "## 📝 Solution Template"
if template_marker in solutions_content:
    insert_pos = solutions_content.find(template_marker)
    new_content = solutions_content[:insert_pos] + "".join(solutions_entries) + "\n\n" + solutions_content[insert_pos:]
    with open(SOLUTIONS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    with open(SOLUTIONS_FILE, 'a', encoding='utf-8') as f:
        f.write("".join(solutions_entries))

print(f"")
print(f"🎉 SYNC COMPLETE!")
print(f"   Problems added: {len(problems_entries)}")
print(f"   Solutions added: {len(solutions_entries)}")
