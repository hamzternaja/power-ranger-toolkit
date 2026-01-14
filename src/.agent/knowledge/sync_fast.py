"""
Fast line-by-line parser for remaining APPS problems
Uses streaming approach instead of loading entire file
"""
import re

SOURCE_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems-advanced.md"
PROBLEMS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems.md"
SOLUTIONS_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\solutions.md"

ALREADY_SYNCED = set(range(1, 8571))
START_PROBLEM_ID = 9572
START_SOLUTION_ID = 10598

print("📖 Streaming file line by line...")

# Parse problems using state machine approach
problems = {}
current_problem = None
current_section = None
current_content = []

with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    line_count = 0
    for line in f:
        line_count += 1
        
        # Check for problem header
        header_match = re.match(r'## Problem (\d+): Advanced Problem', line)
        if header_match:
            # Save previous problem if exists
            if current_problem and current_problem['num'] not in ALREADY_SYNCED:
                if 'solution' in current_problem and current_problem['solution'].strip():
                    problems[current_problem['num']] = current_problem
            
            # Start new problem
            current_problem = {
                'num': int(header_match.group(1)),
                'difficulty': 'interview',
                'description': '',
                'solution': ''
            }
            current_section = 'header'
            continue
        
        if current_problem is None:
            continue
        
        # Check for difficulty
        diff_match = re.search(r'\*\*Difficulty:\*\* (\w+)', line)
        if diff_match:
            current_problem['difficulty'] = diff_match.group(1)
            continue
        
        # Check for sections
        if '### Description' in line:
            current_section = 'description'
            continue
        elif '### Sample Solution' in line or '### Solution' in line:
            current_section = 'solution_header'
            continue
        elif '### Input/Output' in line:
            current_section = 'io'
            continue
        elif line.startswith('## Problem') or line.startswith('---'):
            current_section = None
            continue
        
        # Handle code blocks
        if current_section == 'solution_header':
            if line.startswith('```'):
                current_section = 'solution_code'
                continue
        
        if current_section == 'solution_code':
            if line.startswith('```'):
                current_section = 'after_solution'
                continue
            current_problem['solution'] += line
        
        if current_section == 'description':
            current_problem['description'] += line
        
        if line_count % 100000 == 0:
            print(f"   Processed {line_count:,} lines, found {len(problems)} new problems...")

# Save last problem
if current_problem and current_problem['num'] not in ALREADY_SYNCED:
    if 'solution' in current_problem and current_problem['solution'].strip():
        problems[current_problem['num']] = current_problem

print(f"\n📊 Results:")
print(f"   Total lines processed: {line_count:,}")
print(f"   New problems found: {len(problems)}")

if not problems:
    print("\n✅ No new problems to sync!")
    exit(0)

# Generate entries
sorted_nums = sorted(problems.keys())
print(f"   Problem numbers: {sorted_nums[:5]}... to {sorted_nums[-5:]}")

problems_entries = []
solutions_entries = []

for i, prob_num in enumerate(sorted_nums):
    prob = problems[prob_num]
    problem_id = START_PROBLEM_ID + i
    solution_id = START_SOLUTION_ID + i
    
    desc = prob['description'].strip().replace('\n', ' ')[:300]
    if len(desc) >= 297:
        desc = desc[:297] + "..."
    
    problems_entries.append(f"""
## Problem {problem_id}: APPS Advanced {prob_num}
- **Status**: ✅ Solved
- **Type**: APPS
- **Difficulty**: {prob['difficulty'].capitalize()}
- **Description**: {desc}

---""")
    
    sol = prob['solution'].strip()[:2000]
    solutions_entries.append(f"""
## Solution #{solution_id}: APPS Advanced {prob_num}

### 📋 Metadata
| Field | Value |
|-------|-------|
| **Project** | Practice (APPS #{prob_num}) |
| **Tags** | `{prob['difficulty']}`, `python` |

### ✅ Solution
```python
{sol}
```

---""")

print(f"\n✅ Generated {len(problems_entries)} entries")

# Append to files
print("📝 Appending to problems.md...")
with open(PROBLEMS_FILE, 'a', encoding='utf-8') as f:
    f.write("\n\n# 🆕 APPS Additional Problems (Fast Parse)\n")
    f.write("".join(problems_entries))

print("📝 Updating solutions.md...")
with open(SOLUTIONS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

marker = "## 📝 Solution Template"
if marker in content:
    pos = content.find(marker)
    new_content = content[:pos] + "".join(solutions_entries) + "\n\n" + content[pos:]
    with open(SOLUTIONS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    with open(SOLUTIONS_FILE, 'a', encoding='utf-8') as f:
        f.write("".join(solutions_entries))

print(f"\n🎉 DONE! Added {len(problems_entries)} new problems")
