import zipfile
import re
import os
import shutil

docx_path = 'public/Vasanthaganesh_R_Resume.docx'
backup_path = 'public/Vasanthaganesh_R_Resume.docx.bak'

if not os.path.exists(backup_path):
    shutil.copyfile(docx_path, backup_path)

with zipfile.ZipFile(docx_path, 'r') as zin:
    file_map = {item.filename: zin.read(item.filename) for item in zin.infolist()}

xml = file_map['word/document.xml'].decode('utf-8')

# 1. Update Title
xml = xml.replace('Full-Stack Software Developer', 'Backend Java Engineer · Enterprise Microservices &amp; Scalable Systems')

# 2. Update Phone & Email
xml = xml.replace('8220499437', '7871029435')
xml = xml.replace('vasanthaganeshraja@gmail.com', 'vasanthaganesh11@gmail.com')
xml = xml.replace('vasanthaganesh-portfolio.vercel.app', 'vasanthaganesh-portfolio-2026.vercel.app')
xml = xml.replace('vasanthaganesh- portfolio.vercel.app', 'vasanthaganesh-portfolio-2026.vercel.app')

# 3. Update Summary
old_summary_fragment = 'Full-Stack Software Developer with 2+ years of professional experience at Virtusa'
if old_summary_fragment in xml:
    new_summary = (
        'Backend Java Engineer with 2+ years of professional enterprise experience at Virtusa engineering '
        'high-throughput Spring Boot microservices and transactional banking workflows for Citi&#39;s global banking platform. '
        'Deep expertise in Core Java (8/17), ACID compliance, relational query optimization, and contract-first REST APIs '
        'where zero data loss and 99.99% availability are non-negotiable. Oracle Certified Associate (OCA) Java Programmer '
        'and Claude AI Certified, combining battle-tested BFSI engineering rigor with modern AI-augmented developer velocity '
        'and full-stack product execution.'
    )
    # replace text within summary paragraph
    xml = re.sub(
        r'(<w:p[^>]*>.*?PROFESSIONAL SUMMARY.*?</w:p>\s*<w:p[^>]*>).*?(</w:p>)',
        r'\1<w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t>' + new_summary + r'</w:t></w:r>\2',
        xml,
        flags=re.DOTALL
    )

# 4. Update Certifications to include Claude AI
if 'Oracle Certified Associate, Java SE 8 Programmer' in xml and 'Claude AI Certified' not in xml:
    claude_cert_p = (
        '<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>'
        '<w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
        '<w:t>Claude AI Certified</w:t></w:r>'
        '<w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
        '<w:t> — Anthropic Prompt Engineering &amp; Generative Workflows</w:t></w:r></w:p>'
    )
    xml = xml.replace(
        'Oracle Certified Associate, Java SE 8 Programmer</w:t></w:r></w:p>',
        'Oracle Certified Associate, Java SE 8 Programmer (Core Java &amp; Concurrency) — Flagship Backend Credential</w:t></w:r></w:p>' + claude_cert_p
    )

# 5. Add 3D Virtual Campus Project and AI Projects under KEY PROJECTS
projects_to_insert = (
    '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
    '<w:t>AI Reflection Journal · React · TypeScript · AI Prompts · Privacy</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    '<w:t>Introspective digital sanctuary for introverts and overthinkers with guided cognitive restructuring prompts (GitHub: github.com/vasanthaganesh/AI-Reflection-Journal).</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
    '<w:t>AI Companion · Python · LLM Workflows · Persistent Context Memory · TypeScript</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    '<w:t>Empathetic conversational agent with persistent context memory across sessions to combat social isolation (GitHub: github.com/vasanthaganesh/AI_Companion).</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
    '<w:t>3D Interactive Virtual Campus Visualization · Blender · Unity · 3D Modeling · C#</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    '<w:t>Final Year Capstone Project: Full-scale 3D interactive virtual campus exploration platform showcasing complete college infrastructure with complex 3D meshes, collision camera physics, and spatial POI triggers for immersive walkthroughs.</w:t></w:r></w:p>'
)

if 'KEY PROJECTS' in xml and '3D Interactive Virtual Campus' not in xml:
    xml = xml.replace(
        '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="262626"/></w:rPr><w:t>KEY PROJECTS</w:t></w:r></w:p>',
        '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="262626"/></w:rPr><w:t>KEY PROJECTS</w:t></w:r></w:p>' + projects_to_insert
    )

file_map['word/document.xml'] = xml.encode('utf-8')

# Write back zip
with zipfile.ZipFile(docx_path, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
    for fname, data in file_map.items():
        zout.writestr(fname, data)

if os.path.exists('out'):
    shutil.copyfile(docx_path, 'out/Vasanthaganesh_R_Resume.docx')

print('[SUCCESS] Updated', docx_path, 'with full portfolio content!')
