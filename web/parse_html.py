import re

with open('master.html', 'r') as f:
    content = f.read()

sections = content.split("<body")
print(f"Found {len(sections)-1} body tags.")

for i, section in enumerate(sections[1:]):
    section_html = "<body" + section
    m = re.findall(r'<!-- (.*?) -->', section_html[:1000])
    print(f"\n--- Page {i+1} ---")
    print(f"Comments: {m}")
    text_preview = re.sub(r'<[^>]+>', ' ', section_html[:2000])
    text_preview = re.sub(r'\s+', ' ', text_preview).strip()
    print(f"Preview: {text_preview[:150]}...")
