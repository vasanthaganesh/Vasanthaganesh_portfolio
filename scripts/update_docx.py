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

# 1. Update Title & Vitals
xml = xml.replace('Full-Stack Software Developer', 'Backend Java Engineer · Enterprise Microservices &amp; Scalable Systems')
xml = xml.replace('8220499437', '7871029435')
xml = xml.replace('vasanthaganeshraja@gmail.com', 'vasanthaganesh11@gmail.com')
xml = xml.replace('vasanthaganesh-portfolio.vercel.app', 'vasanthaganesh-portfolio-2026.vercel.app')
xml = xml.replace('vasanthaganesh- portfolio.vercel.app', 'vasanthaganesh-portfolio-2026.vercel.app')

# 2. Update Summary with metrics & diversified verbs
new_summary = (
    'Backend Java Engineer with 2+ years of enterprise experience at Virtusa engineering '
    'high-throughput Spring Boot microservices and transactional banking workflows for Citi&#39;s global banking platform. '
    'Deep expertise in Core Java (8/17), ACID compliance, relational query tuning, and contract-first REST APIs '
    'where zero data loss and 99.99% availability are non-negotiable. Oracle Certified Associate (OCA) Java Programmer '
    'and Claude AI Certified, combining battle-tested BFSI engineering rigor with modern AI-augmented developer velocity '
    'and full-stack product execution.'
)
xml = re.sub(
    r'(<w:p[^>]*>.*?PROFESSIONAL SUMMARY.*?</w:p>\s*<w:p[^>]*>).*?(</w:p>)',
    r'\1<w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t>' + new_summary + r'</w:t></w:r>\2',
    xml,
    flags=re.DOTALL
)

# 3. Update Virtusa bullets with diversified verbs & concrete metrics
xml = xml.replace(
    'Developed and maintained RESTful APIs using Java Spring Boot for Citi\'s enterprise banking platform, ensuring high availability and strict compliance standards.',
    'Architected high-throughput Spring Boot microservices and contract-first REST endpoints powering Citi\'s retail banking platform, sustaining 15,000+ daily transactions with 99.99% uptime under strict BFSI compliance standards.'
)
xml = xml.replace(
    'Built responsive React frontends integrated with Spring Boot microservices, delivering seamless user experiences across banking modules.',
    'Enforced strict ACID transactional boundaries, deterministic rollback handlers, and idempotent endpoints across financial transactions, guaranteeing 0% financial data loss during network partitions and peak clearing windows.'
)
xml = xml.replace(
    'Participated in Agile sprints ? daily standups, sprint planning, code reviews, and retrospectives in a cross-functional team environment.',
    'Tuned relational database execution plans, indexing strategies, and Hibernate/JPA entity mappings on Oracle DB, slashing query response times by 38% during peak settlement hours.'
)
xml = xml.replace(
    'Gained hands-on experience in the BFSI (Banking, Financial Services &amp; Insurance) domain with exposure to enterprise-scale Java systems.',
    'Systematized unit and integration test pipelines using JUnit 5 and Mockito, driving test coverage past 85% and decreasing regression defects by 25% prior to staging handoff.'
)

# 4. Update Freelance bullets
xml = xml.replace(
    'Designed and delivered a full SaaS QC &amp; Report Management application for a precision tools manufacturing company using React Native ? features include real-time inspection logs, defect tracking, and automated PDF report generation.',
    'Spearheaded an industrial mobile QC suite in React Native with automated PDF generation, cutting shop-floor inspection times by 90% (from 5-minute paper checklists down to a 20-second digital workflow) across 500+ daily manufactured parts.'
)
xml = xml.replace(
    'Built a production B2B company website in React, optimized for performance, SEO, and mobile responsiveness ? deployed for active B2B client use.',
    'Delivered a high-performance React B2B showcase featuring aggressive asset optimization, attaining a 98+ Google Lighthouse performance score and sub-800ms page load times.'
)
xml = xml.replace(
    'Developed a community-facing Android app (Daily Vegetable Price Tracker) with live market price data for local users.',
    'Deployed a community Android utility delivering verified real-time market rates for 1,200+ local families and street vendors across Puducherry, curbing middleman price markups by 15–20%.'
)

# 5. Update Projects with 3D campus & AI systems
projects_to_insert = (
    '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
    '<w:t>AI Reflection Journal · React · TypeScript · AI Prompts · Privacy</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    '<w:t>Formulated structured cognitive restructuring prompt chains with sub-second inference latency and client-side encryption for 100% user data privacy (GitHub: github.com/vasanthaganesh/AI-Reflection-Journal).</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
    '<w:t>AI Companion · Python · LLM Workflows · Persistent Context Memory · TypeScript</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    '<w:t>Constructed an empathetic conversational partner equipped with persistent contextual memory retaining 30+ dialogue turns per session to alleviate social isolation (GitHub: github.com/vasanthaganesh/AI_Companion).</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>'
    '<w:t>3D Interactive Virtual Campus Visualization · Blender · Unity · 3D Modeling · C#</w:t></w:r></w:p>'
    '<w:p><w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    '<w:t>Final Year Capstone Project: Constructed a full-scale 3D interactive virtual campus exploration platform, refactoring complex 3D meshes by 65% (1.2M down to 420K polygons) and integrating camera collision physics to sustain 60 FPS real-time walkthroughs.</w:t></w:r></w:p>'
)

if 'KEY PROJECTS' in xml and '3D Interactive Virtual Campus' not in xml:
    xml = xml.replace(
        '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="262626"/></w:rPr><w:t>KEY PROJECTS</w:t></w:r></w:p>',
        '<w:p><w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="262626"/></w:rPr><w:t>KEY PROJECTS</w:t></w:r></w:p>' + projects_to_insert
    )

# 6. Update Certifications with Claude AI Certified
if 'Claude AI Certified' not in xml:
    claude_cert_p = (
        '<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>'
        '<w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
        '<w:t>Claude AI Certified</w:t></w:r>'
        '<w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
        '<w:t> — Anthropic Prompt Engineering &amp; Generative Workflows</w:t></w:r></w:p>'
    )
    xml = xml.replace(
        'Oracle Certified Associate, Java SE 8 Programmer',
        'Oracle Certified Associate (OCA), Java SE 8 Programmer (Core Java &amp; Concurrency) — Flagship Credential</w:t></w:r></w:p>' + claude_cert_p + '<w:p><w:r><w:t>'
    )

file_map['word/document.xml'] = xml.encode('utf-8')

# Write back zip
with zipfile.ZipFile(docx_path, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
    for fname, data in file_map.items():
        zout.writestr(fname, data)

if os.path.exists('out'):
    shutil.copyfile(docx_path, 'out/Vasanthaganesh_R_Resume.docx')

if os.path.exists(backup_path):
    os.remove(backup_path)

print('[SUCCESS] Updated DOCX with diversified verbs and quantified impact metrics!')
