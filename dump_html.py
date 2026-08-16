import re

with open('master.html', 'r') as f:
    content = f.read()

sections = content.split("<!-- ")

page_idx = 1
for section in sections[1:]:
    if section.strip().startswith("System Overview") or section.strip().startswith("Login |") or section.strip().startswith("Create/Edit Mission") or section.strip().startswith("Register Operative") or section.strip().startswith("Heroes List") or section.strip().startswith("Missions/Operations") or section.strip().startswith("Confirmation Modal") or section.strip().startswith("Hero Detail"):
        # This is a good heuristic, but let's just split by <!DOCTYPE html>
        pass

# Better approach: split by <!DOCTYPE html>
docs = content.split("<!DOCTYPE html>")
for i, doc in enumerate(docs[1:]):
    with open(f'page_{i+1}.html', 'w') as out:
        out.write("<!DOCTYPE html>\n" + doc)
print(f"Dumped {len(docs)-1} pages.")
