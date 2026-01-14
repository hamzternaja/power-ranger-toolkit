"""
Sync REMAINING APPS Problems with FLEXIBLE regex patterns
"""
import re

SOURCE_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems-advanced.md"
PROBLEMS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems.md"
SOLUTIONS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\solutions.md"

# Already synced problem numbers (1-100 from first sync, then 101-8570 from second sync)
# Total synced = 8570 problems (Advanced Problem 1-8570)
ALREADY_SYNCED = set(range(1, 8571))
START_PROBLEM_ID = 9572  # Continue from current count in problems.md
START_SOLUTION_ID = 10598  # Continue from current count in solutions.md

print("📖 Loading file...")
with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

print("🔍 Using multiple regex patterns to capture all problems...")

# Pattern 1: Original (with ```python)
pattern1 = r'## Problem (\d+): Advanced Problem \d+\s*\n\n\*\*Source:\*\* APPS \| \*\*Difficulty:\*\* (\w+)\s*\n\n### Description\n(.*?)### Sample Solution\n```python\n(.*?)```\s*\n\n### Input/Output Examples'

# Pattern 2: With ``` (no language specified)
pattern2 = r'## Problem (\d+): Advanced Problem \d+\s*\n\n\*\*Source:\*\* APPS \| \*\*Difficulty:\*\* (\w+)\s*\n\n### Description\n(.*?)### Sample Solution\n```\n(.*?)```\s*\n\n### Input/Output Examples'

# Pattern 3: Flexible whitespace
pattern3 = r'## Problem (\d+): Advanced Problem \d+\s*\n+\*\*Source:\*\* APPS \| \*\*Difficulty:\*\* (\w+)\s*\n+### Description\s*\n(.*?)### Sample Solution\s*\n```(?:python)?\n(.*?)```'

# Pattern 4: Very flexible - just grab problem number, difficulty, and any code block
pattern4 = r'## Problem (\d+): Advanced Problem \d+.*?\*\*Difficulty:\*\* (\w+).*?### Description\s*\n(.*?)(?:### Sample Solution|### Solution)\s*\n```(?:\w*)\n(.*?)```'

all_matches = {}

# Try each pattern
for i, pattern in enumerate([pattern1, pattern2, pattern3, pattern4], 1):
    matches = re.findall(pattern, content, re.DOTALL)
    print(f"   Pattern {i}: captured {len(matches)} problems")
    for match in matches:
        prob_num = int(match[0])
        if prob_num not in all_matches:
            all_matches[prob_num] = match

print(f"\n📊 Total unique problems captured: {len(all_matches)}")

# Filter out already synced problems
new_problems = {k: v for k, v in all_matches.items() if k not in ALREADY_SYNCED}
print(f"   Already synced: {len(ALREADY_SYNCED)}")
print(f"   New to sync: {len(new_problems)}")

if not new_problems:
    print("\n✅ No new problems to sync!")
    exit(0)

# Sort by problem number
sorted_nums = sorted(new_problems.keys())
print(f"   New problem numbers: {sorted_nums[:10]}... to {sorted_nums[-10:]}")

# Generate entries
problems_entries = []
solutions_entries = []

for i, prob_num in enumerate(sorted_nums):
    num_str, difficulty, description, solution = new_problems[prob_num]
    
    problem_id = START_PROBLEM_ID + i
    solution_id = START_SOLUTION_ID + i
    
    # Clean description
    desc_clean = description.strip().replace('\n', ' ')[:300].strip()
    if len(desc_clean) >= 297:
        desc_clean = desc_clean[:297] + "..."
    
    # Problem entry
    problems_entries.append(f"""
## Problem {problem_id}: APPS Advanced {prob_num}
- **Status**: ✅ Solved
- **Type**: APPS
- **Difficulty**: {difficulty.capitalize()}
- **Description**: {desc_clean}

---""")
    
    # Solution entry
    sol_code = solution.strip()[:2000]  # Limit code length
    solutions_entries.append(f"""
## Solution #{solution_id}: APPS Advanced {prob_num}

### 📋 Metadata
| Field | Value |
|-------|-------|
| **Project** | Practice (APPS #{prob_num}) |
| **Date** | 2026-01-12 |
| **Tags** | `{difficulty}`, `python` |

### ✅ Solution
```python
{sol_code}
```

---""")
    
    if (i + 1) % 200 == 0:
        print(f"   Generated {i + 1}/{len(sorted_nums)} entries...")

print(f"\n✅ Generated {len(problems_entries)} new problem entries")
print(f"✅ Generated {len(solutions_entries)} new solution entries")

# Append to problems.md
print(f"📝 Appending to problems.md...")
with open(PROBLEMS_FILE, 'a', encoding='utf-8') as f:
    f.write("\n\n# 🆕 APPS Additional Problems (Flexible Regex)\n")
    f.write("".join(problems_entries))

# Append to solutions.md
print(f"📝 Updating solutions.md...")
with open(SOLUTIONS_FILE, 'r', encoding='utf-8') as f:
    solutions_content = f.read()

template_marker = "## 📝 Solution Template"
if template_marker in solutions_content:
    insert_pos = solutions_content.find(template_marker)
    new_content = solutions_content[:insert_pos] + "".join(solutions_entries) + "\n\n" + solutions_content[insert_pos:]
    with open(SOLUTIONS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    with open(SOLUTIONS_FILE, 'a', encoding='utf-8') as f:
        f.write("".join(solutions_entries))

print(f"\n🎉 SYNC COMPLETE!")
print(f"   New problems added: {len(problems_entries)}")
print(f"   New solutions added: {len(solutions_entries)}")
