import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sovereign_file = os.path.join(os.path.dirname(__file__), "..", "src", "context", "sovereignTranslations.ts")

with open(sovereign_file, "r", encoding="utf-8") as f:
    sov_text = f.read()

entries = re.findall(r'\{\s*(?:en:\s*[\'"][^\'"]*[\'"][\s\S]*?)\}', sov_text)
all_langs = ['hi', 'or', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'pa']

missing_found = 0
for idx, entry in enumerate(entries):
    for lang in all_langs:
        match = re.search(rf'\b{lang}:\s*([\'"])(.*?)\1', entry)
        if not match:
            print(f"Missing {lang} in entry #{idx}:")
            print(entry[:200])
            print("...")
            missing_found += 1
            break

if missing_found == 0:
    print(f"SUCCESS: All {len(entries)} sovereign vocabulary entries verified across all 11 official languages!")
else:
    print(f"FAILURE: {missing_found} entries had missing translations.")
