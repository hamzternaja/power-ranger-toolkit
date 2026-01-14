"""
Sync ALL remaining APPS Problems from problems-advanced.md
"""
import re
import sys

# Configuration
SOURCE_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems-advanced.md"
PROBLEMS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems.md"
SOLUTIONS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\solutions.md"
START_PROBLEM_ID = 1102  # Continue from last sync
START_SOLUTION_ID = 2128  # Continue from last sync
SKIP_FIRST = 100  # Skip first 100 (already synced)

print(f"📖 Reading ALL problems from problems-advanced.md...")
print(f"   This may take a few minutes due to 1.2GB file size...")

# Read entire source file
with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"   File loaded successfully!")

# Parse problems using regex
problem_pattern = r'## Problem (\d+): Advanced Problem \d+\s*\n\n\*\*Source:\*\* APPS \| \*\*Difficulty:\*\* (\w+)\s*\n\n### Description\n(.*?)### Sample Solution\n```python\n(.*?)```\s*\n\n### Input/Output Examples'
matches = re.findall(problem_pattern, content, re.DOTALL)

print(f"   Found {len(matches)} total problems")
print(f"   Skipping first {SKIP_FIRST} (already synced)")

# Skip already synced problems
remaining_matches = matches[SKIP_FIRST:]
print(f"   Processing {len(remaining_matches)} new problems...")

# Generate problems entries
problems_entries = []
solutions_entries = []

for i, (num, difficulty, description, solution) in enumerate(remaining_matches):
    problem_id = START_PROBLEM_ID + i
    solution_id = START_SOLUTION_ID + i
    
    # Clean description (first 300 chars for summary)
    desc_clean = description.strip().replace('\n', ' ')[:300].strip()
    if len(desc_clean) >= 297:
        desc_clean = desc_clean[:297] + "..."
    
    # Problem entry
    problems_entries.append(f"""
## Problem {problem_id}: APPS Advanced {SKIP_FIRST + i + 1}
- **Status**: ✅ Solved
- **Type**: APPS
- **Difficulty**: {difficulty.capitalize()}
- **Description**: {desc_clean}

---""")
    
    # Solution entry (shorter format to save space)
    solutions_entries.append(f"""
## Solution #{solution_id}: APPS Advanced {SKIP_FIRST + i + 1}

### 📋 Metadata
| Field | Value |
|-------|-------|
| **Project** | Practice (APPS #{SKIP_FIRST + i + 1}) |
| **Date** | 2026-01-12 |
| **Tags** | `{difficulty}`, `python` |

### ✅ Solution
```python
{solution.strip()[:2000]}
```

---""")
    
    # Progress indicator
    if (i + 1) % 500 == 0:
        print(f"   Generated {i + 1}/{len(remaining_matches)} entries...")

print(f"✅ Generated {len(problems_entries)} problem entries")
print(f"✅ Generated {len(solutions_entries)} solution entries")

# Append to problems.md
print(f"📝 Appending to problems.md...")
with open(PROBLEMS_FILE, 'a', encoding='utf-8') as f:
    f.write("".join(problems_entries))

# Append to solutions.md (before the template section)
print(f"📝 Updating solutions.md...")
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
print(f"   Total problems in problems.md: {1101 + len(problems_entries)}")
print(f"   Total solutions in solutions.md: {2127 + len(solutions_entries)}")
