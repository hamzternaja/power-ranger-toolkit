"""
Analyze problems-advanced.md to find uncaptured problems
"""
import re

SOURCE_FILE = r"C:\Users\chawa\.gemini\antigravity\.agent\knowledge\problems-advanced.md"

print("📖 Loading file...")
with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

print("🔍 Finding all problem headers...")

# Find all problem headers (more flexible pattern)
all_headers = re.findall(r'## Problem (\d+):[^\n]+', content)
print(f"   Total problem headers found: {len(all_headers)}")

# Current regex pattern
current_pattern = r'## Problem (\d+): Advanced Problem \d+\s*\n\n\*\*Source:\*\* APPS \| \*\*Difficulty:\*\* (\w+)\s*\n\n### Description\n(.*?)### Sample Solution\n```python\n(.*?)```\s*\n\n### Input/Output Examples'
current_matches = re.findall(current_pattern, content, re.DOTALL)
print(f"   Current regex captured: {len(current_matches)}")

# Find problem numbers that were captured
captured_nums = set(m[0] for m in current_matches)
all_nums = set(all_headers)
missing_nums = sorted([int(n) for n in all_nums - captured_nums])

print(f"\n📊 Analysis:")
print(f"   Captured: {len(captured_nums)}")
print(f"   Missing: {len(missing_nums)}")

# Sample some missing problems to analyze their format
print(f"\n🔬 Sampling first 5 missing problems to analyze format...")

for prob_num in missing_nums[:5]:
    # Find this problem in content
    pattern = rf'## Problem {prob_num}:.*?(?=## Problem \d+:|$)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        sample = match.group(0)[:1500]  # First 1500 chars
        print(f"\n{'='*60}")
        print(f"PROBLEM {prob_num}:")
        print(f"{'='*60}")
        print(sample)
        print("...")

# Try to detect different formats
print(f"\n\n📋 Detecting format variations...")

# Check for different solution block formats
solution_formats = {
    'python': len(re.findall(r'```python\n', content)),
    'cpp': len(re.findall(r'```cpp\n', content)),
    'java': len(re.findall(r'```java\n', content)),
    'c': len(re.findall(r'```c\n', content)),
    'no_lang': len(re.findall(r'```\n[^`]', content)),
}

print("Solution code block formats found:")
for lang, count in solution_formats.items():
    print(f"   {lang}: {count}")

# Check for missing sections
no_sample_solution = len(re.findall(r'## Problem \d+:.*?(?:### Description.*?)(?!### Sample Solution)', content[:500000], re.DOTALL))
print(f"\nProblems without '### Sample Solution': ~{no_sample_solution}")
