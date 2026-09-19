import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette matching project branding
    DARK_BG     = RGBColor(11, 15, 25)      # #0B0F19 Deep Navy
    CARD_BG     = RGBColor(21, 28, 44)      # #151C2C Slate Blue Card
    CARD_BORDER = RGBColor(38, 48, 74)      # #26304A Border
    WHITE       = RGBColor(255, 255, 255)   # Pure White
    LIGHT_TEXT  = RGBColor(226, 232, 240)   # Slate 200
    MUTED_TEXT  = RGBColor(148, 163, 184)   # Slate 400
    PRIMARY     = RGBColor(56, 189, 248)    # Cyan Accent #38BDF8
    ROYAL_BLUE  = RGBColor(37, 99, 235)     # #2563EB
    EMERALD     = RGBColor(16, 185, 129)    # Green Accent #10B981
    AMBER       = RGBColor(245, 158, 11)    # Warning #F59E0B
    PURPLE      = RGBColor(168, 85, 247)    # #A855F7

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = DARK_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, slide_num, title, subtitle, presenter_name, presenter_role):
        # Header banner bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.15))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = CARD_BG
        top_bar.line.color.rgb = CARD_BORDER
        top_bar.line.width = Pt(1)

        # Cyan accent line below banner
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.15), Inches(13.333), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = PRIMARY
        line.line.fill.background()

        # Title text
        txBox = slide.shapes.add_textbox(Inches(0.6), Inches(0.12), Inches(8.5), Inches(0.6))
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(20)
        p.font.color.rgb = WHITE
        p.font.name = "Calibri"

        # Subtitle text
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(12)
        p2.font.color.rgb = PRIMARY
        p2.font.name = "Calibri"

        # Presenter Badge on top right
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.5), Inches(0.2), Inches(3.2), Inches(0.75))
        badge.fill.solid()
        badge.fill.fore_color.rgb = DARK_BG
        badge.line.color.rgb = PRIMARY
        badge.line.width = Pt(1)

        btf = badge.text_frame
        btf.word_wrap = True
        btf.margin_top = Inches(0.1)
        bp1 = btf.paragraphs[0]
        bp1.alignment = PP_ALIGN.CENTER
        bp1.text = f"🎤 Presenter: {presenter_name}"
        bp1.font.bold = True
        bp1.font.size = Pt(12)
        bp1.font.color.rgb = WHITE
        bp1.font.name = "Calibri"

        bp2 = btf.add_paragraph()
        bp2.alignment = PP_ALIGN.CENTER
        bp2.text = presenter_role
        bp2.font.size = Pt(10)
        bp2.font.color.rgb = PRIMARY
        bp2.font.name = "Calibri"

        # Slide Number Badge at bottom
        ftBox = slide.shapes.add_textbox(Inches(0.6), Inches(7.1), Inches(12.133), Inches(0.3))
        ftf = ftBox.text_frame
        ftf.margin_left = ftf.margin_top = ftf.margin_right = ftf.margin_bottom = 0
        fp = ftf.paragraphs[0]
        fp.text = "AI-Powered Resume Analyzer  •  BBD University Academic Capstone 2026"
        fp.font.size = Pt(10)
        fp.font.color.rgb = MUTED_TEXT

        fp2 = ftf.add_paragraph()
        fp2.text = f"Slide {slide_num} of 18"
        fp2.font.size = Pt(10)
        fp2.font.bold = True
        fp2.font.color.rgb = PRIMARY
        fp2.alignment = PP_ALIGN.RIGHT
        ftBox.top = Inches(7.1)

    def add_card(slide, left, top, width, height, title=None, border_color=CARD_BORDER, fill_color=CARD_BG):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = fill_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.4))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.bold = True
            p.font.size = Pt(14)
            p.font.color.rgb = PRIMARY
            p.font.name = "Calibri"
        return card

    def add_speaker_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE (Shivansh Mishra)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Decorative hero container
    hero = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(11.733), Inches(6.3))
    hero.fill.solid()
    hero.fill.fore_color.rgb = CARD_BG
    hero.line.color.rgb = PRIMARY
    hero.line.width = Pt(2)

    # University & Project Header
    tb = s1.shapes.add_textbox(Inches(1.2), Inches(0.9), Inches(10.9), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "BABU BANARASI DAS UNIVERSITY, LUCKNOW"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY
    p.alignment = PP_ALIGN.CENTER

    p = tf.add_paragraph()
    p.text = "Department of Computer Science & Engineering  •  Academic Capstone 2026"
    p.font.size = Pt(11)
    p.font.color.rgb = MUTED_TEXT
    p.alignment = PP_ALIGN.CENTER

    p = tf.add_paragraph()
    p.text = "🚀 AI-Powered Resume Analyzer"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    p = tf.add_paragraph()
    p.text = "Hybrid Multi-Model Career Intelligence Platform & Deep ATS Heuristic Engine"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = PRIMARY
    p.alignment = PP_ALIGN.CENTER

    # 4 Team Members Grid on Title Slide
    team_data = [
        ("Shivansh Mishra", "Team Leader & Principal Architect", "Backend, Multi-Model AI & System Design", PRIMARY, "assets/team/shivansh_circle.png"),
        ("Harshvardhan Sisodiya", "Frontend Architect & UI/UX Lead", "React 19, Nebula Aurora Glassmorphism & UX", PURPLE, "assets/team/harshvardhan_circle.png"),
        ("Vishal Patel", "QA Lead & Security Specialist", "92 Automated Tests, Benchmarks & Hardening", EMERALD, "assets/team/vishal_circle.png"),
        ("Sujeet Kannaujiya", "Research Lead & Documentation", "Research Dossier, ATS Specs & Presentation", AMBER, "assets/team/sujeet_circle.png")
    ]

    card_w = Inches(2.6)
    gap = Inches(0.24)
    start_x = Inches(1.2)
    top_y = Inches(3.4)

    for i, (name, role, desc, color, img_path) in enumerate(team_data):
        cx = start_x + i * (card_w + gap)
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, Inches(2.8))
        c.fill.solid()
        c.fill.fore_color.rgb = DARK_BG
        c.line.color.rgb = color
        c.line.width = Pt(1.5)

        # Try to add circular photo
        if os.path.exists(img_path):
            s1.shapes.add_picture(img_path, cx + Inches(0.8), top_y + Inches(0.2), Inches(1.0), Inches(1.0))

        tx = s1.shapes.add_textbox(cx + Inches(0.1), top_y + Inches(1.25), card_w - Inches(0.2), Inches(1.4))
        ctf = tx.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = ctf.margin_bottom = 0

        cp1 = ctf.paragraphs[0]
        cp1.text = name
        cp1.font.bold = True
        cp1.font.size = Pt(13)
        cp1.font.color.rgb = WHITE
        cp1.alignment = PP_ALIGN.CENTER

        cp2 = ctf.add_paragraph()
        cp2.text = role
        cp2.font.bold = True
        cp2.font.size = Pt(9.5)
        cp2.font.color.rgb = color
        cp2.alignment = PP_ALIGN.CENTER

        cp3 = ctf.add_paragraph()
        cp3.text = desc
        cp3.font.size = Pt(8.5)
        cp3.font.color.rgb = MUTED_TEXT
        cp3.alignment = PP_ALIGN.CENTER

    # Live demo URL footnote
    fn = s1.shapes.add_textbox(Inches(1.2), Inches(6.3), Inches(10.9), Inches(0.4))
    fntf = fn.text_frame
    fnp = fntf.paragraphs[0]
    fnp.text = "🌐 Live Production Application: https://ai-powered-resume-analyzer-pi.vercel.app  •  ⚡ API: https://resume-analyzer-api.onrender.com"
    fnp.font.size = Pt(10)
    fnp.font.color.rgb = PRIMARY
    fnp.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s1, """[SLIDE 1 - PRESENTER: SHIVANSH MISHRA | TIME: 30 SECONDS]
'Good morning respected Dean Sir, faculty members, and fellow classmates.
I am Shivansh Mishra, Team Leader and Principal Architect of this project.
Along with my talented team members Harshvardhan, Vishal, and Sujeet, we are proud to present our final year capstone project:
The AI-Powered Resume Analyzer — an enterprise-grade platform that solves one of the biggest bottlenecks in modern hiring: candidate rejection by rigid Applicant Tracking Systems.
Over the next 12 minutes, we will walk you through how our system works, how we built it together as a team, and demonstrate our live production deployment.'""")

    # -------------------------------------------------------------
    # SLIDE 2: TL;DR SLIDE (Shivansh Mishra)
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, 2, "PROJECT AT A GLANCE (TL;DR)", "The Core Problem, Our Innovation, and Measurable Outcomes in 30 Seconds", "Shivansh Mishra", "Team Leader & Architect")

    # 3 Big Impact Pillars
    p_data = [
        ("❌ THE CRITICAL PROBLEM", 
         ["• 75% of qualified resumes are rejected before any human recruiter reads them.",
          "• Legacy ATS algorithms rely on rigid, exact keyword matching (e.g., 'K8s' vs 'Kubernetes').",
          "• Candidates receive zero feedback on why they were rejected or what skills they missed.",
          "• Pure cloud AI solutions are expensive, hit rate limits, and suffer from downtime."],
         RGBColor(239, 68, 68)),

        ("⚡ OUR HYBRID SOLUTION", 
         ["• Dual-Engine Architecture: Multi-Model AI (Gemini, GPT-4o, Claude) + sub-5ms rule fallback.",
          "• Proprietary 440+ Skills Taxonomy Graph with smart alias and synonym resolution.",
          "• Deep ATS Heuristic Engine evaluating section integrity, action verbs, and quantified metrics.",
          "• Dynamic Interview Question Kit tailored specifically to candidate skill gaps."],
         PRIMARY),

        ("🏆 MEASURABLE OUTCOMES", 
         ["• 100% Zero-Disk Privacy: File streams parsed in volatile RAM with zero disk writes.",
          "• Sub-5ms response time for deterministic evaluation; ~780ms for cloud AI analysis.",
          "• 92 of 92 Automated Tests Passing (100% test pass rate across 13 modules).",
          "• Live in production on Vercel & Render with zero server hosting costs."],
         EMERALD)
    ]

    col_w = Inches(3.8)
    col_gap = Inches(0.3)
    for i, (title, points, color) in enumerate(p_data):
        x = Inches(0.6) + i * (col_w + col_gap)
        add_card(s2, x, Inches(1.4), col_w, Inches(5.4), title, color)
        
        tb = s2.shapes.add_textbox(x + Inches(0.2), Inches(2.0), col_w - Inches(0.4), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        for pt in points:
            p = tf.add_paragraph()
            p.text = pt
            p.font.size = Pt(12)
            p.font.color.rgb = LIGHT_TEXT
            p.space_after = Pt(12)

    add_speaker_notes(s2, """[SLIDE 2 - PRESENTER: SHIVANSH MISHRA | TIME: 45 SECONDS]
'Dean Sir, to give you the high-level summary in 30 seconds:
The problem is that 75% of qualified job seekers get filtered out automatically because traditional ATS systems can only search for exact keywords, and candidates never know why.
Our solution is a hybrid platform: we don't rely blindly on AI. We built a dual-engine system. If the candidate provides an AI key, we run multi-model semantic matching using Gemini, GPT-4o, or Claude. If no key is provided or the network fails, our deterministic engine evaluates the resume in under 5 milliseconds with zero downtime.
Our outcome: 92 out of 92 passing automated tests, 100% user privacy with zero disk storage, and a live web application already deployed.'""")

    # -------------------------------------------------------------
    # SLIDE 3: TEAM & ROLES (Shivansh Mishra -> Hand off to Harshvardhan)
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, 3, "TEAM COLLABORATION & DIVISION OF OWNERSHIP", "How 4 Engineers Built a Complete Production Platform End-to-End", "Shivansh Mishra", "Team Leader & Architect")

    t_cols = [
        ("Shivansh Mishra", "Team Leader & Principal Architect", PRIMARY, "assets/team/shivansh_circle.png",
         ["• Conceived & led entire project architecture",
          "• Engineered FastAPI REST Gateway & routing",
          "• Multi-Provider AI (Gemini, GPT-4o, Claude)",
          "• 440+ Skills Taxonomy Graph & Synonym Engine",
          "• PyMuPDF In-Memory Stream Parser & Exporter"]),

        ("Harshvardhan Sisodiya", "Frontend Architect & UI/UX Lead", PURPLE, "assets/team/harshvardhan_circle.png",
         ["• React 19 Single Page Application architecture",
          "• Nebula Aurora GPU-accelerated Glassmorphism",
          "• 60/120 FPS requestAnimationFrame physics",
          "• 180px SVG Radial Match Gauge & count-up",
          "• Mobile-responsive Bento Grid & BYOK Vault"]),

        ("Vishal Patel", "QA Lead & Security Specialist", EMERALD, "assets/team/vishal_circle.png",
         ["• 92 Automated Tests (100% passing across 13 modules)",
          "• Concurrency & Latency Benchmark Runner",
          "• OWASP API Top 10 Security Hardening",
          "• Prompt injection, XSS & SQLi sanitization",
          "• Synthetic candidate evaluation dataset"]),

        ("Sujeet Kannaujiya", "Research & Documentation Lead", AMBER, "assets/team/sujeet_circle.png",
         ["• Academic Capstone Dossier & Technical Specs",
          "• ATS Heuristic Parsing Algorithm Specification",
          "• LLM Model Benchmarking Study & Trade-offs",
          "• Ethical AI Fairness & Bias Mitigation Rubric",
          "• OpenAPI reference & presentation design"])
    ]

    card_w = Inches(2.8)
    col_gap = Inches(0.24)
    for i, (name, role, color, img_path, duties) in enumerate(t_cols):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s3, x, Inches(1.4), card_w, Inches(5.4), None, color)

        if os.path.exists(img_path):
            s3.shapes.add_picture(img_path, x + Inches(0.9), Inches(1.6), Inches(1.0), Inches(1.0))

        tb = s3.shapes.add_textbox(x + Inches(0.15), Inches(2.7), card_w - Inches(0.3), Inches(3.9))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = name
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

        p2 = tf.add_paragraph()
        p2.text = role
        p2.font.bold = True
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = color
        p2.alignment = PP_ALIGN.CENTER
        p2.space_after = Pt(10)

        for d in duties:
            dp = tf.add_paragraph()
            dp.text = d
            dp.font.size = Pt(10)
            dp.font.color.rgb = LIGHT_TEXT
            dp.space_after = Pt(6)

    add_speaker_notes(s3, """[SLIDE 3 - PRESENTER: SHIVANSH MISHRA | TIME: 45 SECONDS]
'Dean Sir, this project was not built in silos; it was executed with professional software engineering ownership:
- I led the project and engineered the backend services, the multi-model AI routing, and the taxonomy graph.
- Harshvardhan owned the frontend, building an ultra-fast React 19 interface with hardware-accelerated animations.
- Vishal took full charge of Quality Assurance, creating our 92 automated tests and security audits.
- Sujeet spearheaded the research documentation, benchmark analysis, and ethical AI auditing.
Every team member has made substantial, verified contributions to the codebase.'""")

    # -------------------------------------------------------------
    # SLIDE 4: PROBLEM & MOTIVATION (Shivansh Mishra)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, 4, "PROBLEM STATEMENT & MOTIVATION", "Why Real Candidates Are Being Silently Filtered Out by Traditional Systems", "Shivansh Mishra", "Team Leader & Architect")

    p_cards = [
        ("1. The Keyword Mismatch Trap",
         ["• Traditional ATS only matches exact spelling: 'Docker', 'Postgres', 'FastAPI'.",
          "• If a candidate writes 'Containerization', 'RDBMS', or 'RESTful Python Services', legacy ATS awards 0 points.",
          "• Qualified candidates with deep practical skills get falsely rejected due to vocabulary differences."],
         RGBColor(239, 68, 68)),

        ("2. The Unquantified Bullet Dilemma",
         ["• Most resumes describe duties ('Responsible for bug fixes') instead of impact ('Reduced latency by 40%').",
          "• Recruiters spend an average of only 6 seconds per resume skimming for measurable business ROI.",
          "• Existing tools do not mathematically score bullet point quantification or action verb diversity."],
         AMBER),

        ("3. The Blind AI / Privacy Black Box",
         ["• Commercial AI platforms require uploading resumes to third-party databases, violating user privacy.",
          "• Pure LLM wrappers fail completely when rate-limited or offline, leaving users stranded.",
          "• No automated system generates interview prep tailored directly to candidate-specific weaknesses."],
         PURPLE)
    ]

    card_w = Inches(3.8)
    col_gap = Inches(0.3)
    for i, (title, points, color) in enumerate(p_cards):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s4, x, Inches(1.4), col_w, Inches(5.4), title, color)

        tb = s4.shapes.add_textbox(x + Inches(0.2), Inches(2.2), col_w - Inches(0.4), Inches(4.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        for pt in points:
            p = tf.add_paragraph()
            p.text = pt
            p.font.size = Pt(12)
            p.font.color.rgb = LIGHT_TEXT
            p.space_after = Pt(14)

    add_speaker_notes(s4, """[SLIDE 4 - PRESENTER: SHIVANSH MISHRA | TIME: 50 SECONDS]
'Dean Sir, why did we choose this problem?
First, modern hiring is broken. Traditional ATS uses crude exact keyword matching. A student might write 'Container orchestration' or 'K8s', but the job description asks for 'Kubernetes'. A legacy system marks this as a 0% match.
Second, students write passive bullet points like 'worked on website' instead of quantified impact like 'scaled website to 10,000 daily users'.
Third, commercial tools store student data on cloud databases and crash whenever their AI quota runs out.
We wanted to build an intelligent, private, and resilient platform that solves all three problems.'""")

    # -------------------------------------------------------------
    # SLIDE 5: GOALS & SUCCESS CRITERIA (Shivansh Mishra)
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, 5, "PROJECT GOALS & SUCCESS CRITERIA", "Clear Engineering Benchmarks Defined Before Writing Any Code", "Shivansh Mishra", "Team Leader & Architect")

    # Left Column: Must-Have Goals vs Right Column: Measurable Success Criteria
    add_card(s5, Inches(0.6), Inches(1.4), Inches(5.9), Inches(5.4), "🎯 Primary Objectives (Must-Have)", PRIMARY)
    tb_l = s5.shapes.add_textbox(Inches(0.85), Inches(2.1), Inches(5.4), Inches(4.5))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    
    must_haves = [
        ("Zero-Disk In-Memory Parsing", "Process PDF/DOCX entirely in volatile RAM buffers. No files ever written to server disk or database."),
        ("Hybrid Dual-Engine Processing", "Multi-provider AI (Gemini, GPT-4o, Claude) with seamless sub-5ms fallback to deterministic rules."),
        ("Comprehensive ATS Heuristics", "Audit 7 standard resume sections, calculate action verb density, and measure bullet quantification ratios."),
        ("Executive 2-Page PDF Export", "Generate publication-grade, print-ready PDF dossiers signed with deterministic SHA-256 digital seals."),
        ("Targeted Technical Interview Kit", "Automatically generate customized technical questions probing the candidate's exact identified skill gaps.")
    ]
    for heading, desc in must_haves:
        p = tf_l.add_paragraph()
        p.text = f"✔ {heading}:"
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = WHITE
        p2 = tf_l.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(8)

    add_card(s5, Inches(6.8), Inches(1.4), Inches(5.9), Inches(5.4), "📊 Measurable Verification Benchmarks", EMERALD)
    tb_r = s5.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.4), Inches(4.5))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    benchmarks = [
        ("Automated Test Suite", "Target: 100% pass rate  ➔  Achieved: 92/92 Passing Tests across 13 modules."),
        ("Deterministic Fallback Latency", "Target: < 20ms  ➔  Achieved: < 5ms average response time."),
        ("AI Cloud Latency", "Target: < 2000ms  ➔  Achieved: ~780ms with Gemini 2.5/3.6 Flash."),
        ("Frontend Render Performance", "Target: 60 FPS  ➔  Achieved: 60/120 FPS hardware-accelerated animations."),
        ("Cloud Infrastructure Cost", "Target: $0.00/month  ➔  Achieved: 100% free-tier deployment on Render & Vercel.")
    ]
    for heading, desc in benchmarks:
        p = tf_r.add_paragraph()
        p.text = f"📈 {heading}:"
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = EMERALD
        p2 = tf_r.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(12)

    add_speaker_notes(s5, """[SLIDE 5 - PRESENTER: SHIVANSH MISHRA | TIME: 45 SECONDS]
'Before writing a single line of code, our team established clear, measurable success criteria.
We committed to zero disk storage to protect candidate privacy.
We set a performance target of under 5 milliseconds for our rule-based engine and under 2 seconds for cloud AI.
And for quality assurance, we required 100% test pass rate on every single commit.
As shown on the right, every single benchmark was met or exceeded.'""")

    # -------------------------------------------------------------
    # SLIDE 6: SOLUTION OVERVIEW (Shivansh Mishra)
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, 6, "SOLUTION OVERVIEW & DATA PIPELINE", "The 4-Stage End-to-End Analysis Architecture from Upload to Executive Report", "Shivansh Mishra", "Team Leader & Architect")

    pipeline_steps = [
        ("STAGE 1: INGESTION", "Memory-Safe Extraction",
         ["• Upload PDF/DOCX (≤ 5MB)",
          "• In-Memory PyMuPDF stream",
          "• Geometric block sorting",
          "• Scanned image rejection",
          "• Regex text cleaning"],
         PRIMARY),

        ("STAGE 2: ROUTING", "Hybrid Dual-Engine",
         ["• Inspect BYOK API Key header",
          "• Detects Gemini / GPT / Claude",
          "• AI Primary: Structured rubric",
          "• Fallback: Sub-5ms rule engine",
          "• Zero downtime guarantee"],
         PURPLE),

        ("STAGE 3: ENRICHMENT", "Heuristics & Taxonomy",
         ["• 440+ Skills Taxonomy Graph",
          "• 12 Domain classification",
          "• ATS Section Integrity audit",
          "• 150+ Action Verb density",
          "• Metric quantification %"],
         EMERALD),

        ("STAGE 4: PRESENTATION", "Interactive & Export",
         ["• React 19 glassmorphism UI",
          "• 180px SVG match gauge",
          "• 2-Page Executive PDF Dossier",
          "• Recruiter interview kit",
          "• SHA-256 digital security seal"],
         AMBER)
    ]

    card_w = Inches(2.8)
    col_gap = Inches(0.24)
    for i, (stage, subtitle, bullets, color) in enumerate(pipeline_steps):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s6, x, Inches(1.4), card_w, Inches(5.4), stage, color)

        tb = s6.shapes.add_textbox(x + Inches(0.15), Inches(2.0), card_w - Inches(0.3), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = subtitle
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.space_after = Pt(12)

        for b in bullets:
            bp = tf.add_paragraph()
            bp.text = b
            bp.font.size = Pt(10.5)
            bp.font.color.rgb = LIGHT_TEXT
            bp.space_after = Pt(10)

    add_speaker_notes(s6, """[SLIDE 6 - PRESENTER: SHIVANSH MISHRA | TIME: 50 SECONDS]
'Dean Sir, this diagram illustrates how our system processes a resume in 4 stages:
Stage 1 is Ingestion: PyMuPDF parses the file directly from memory with geometric sorting.
Stage 2 is Routing: We check for a multi-provider key. If valid, Gemini evaluates semantics; if absent or rate-limited, our rule engine takes over instantly.
Stage 3 is Enrichment: We map skills into our 12-domain taxonomy graph, audit standard sections, count action verbs, and calculate metric quantification.
Stage 4 is Presentation: The React frontend displays an interactive dashboard, and the backend generates a 2-page PDF with an immutable SHA-256 digital seal.'""")

    # -------------------------------------------------------------
    # SLIDE 7: ARCHITECTURE & TECH STACK (Shivansh & Harshvardhan)
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, 7, "SYSTEM ARCHITECTURE & TECH STACK", "Modern, Production-Proven Technologies Selected for Speed, Privacy & Scale", "Shivansh & Harshvardhan", "Backend & Frontend Leads")

    tech_categories = [
        ("⚙️ BACKEND CORE", "FastAPI & Python 3.13",
         ["• FastAPI: Asynchronous REST API framework with native OpenAPI docs.",
          "• Python 3.13: Modern memory management and high performance.",
          "• Pydantic v2: Strict data contracts & request validation.",
          "• PyMuPDF (fitz): High-speed vector PDF text extraction and PDF generation.",
          "• Hosted on Render Cloud (Zero-cost free tier container)."],
         PRIMARY),

        ("🤖 AI & SEMANTICS", "Multi-Provider BYOK",
         ["• Google Gemini 2.5/3.6 Flash: Primary low-latency semantic analysis.",
          "• OpenAI GPT-4o: Fallback and cross-evaluation model.",
          "• Anthropic Claude 3.5 Sonnet: High-accuracy deep reasoning.",
          "• Deterministic Rule Engine: Pure mathematical set-intersection fallback.",
          "• Prompt Engineering: Rubric-grounded structured JSON schema."],
         PURPLE),

        ("🎨 FRONTEND & UI", "React 19 & Vite",
         ["• React 19: Latest React architecture with optimized rendering.",
          "• Vite 6: Lightning-fast HMR and 340ms production bundle builds.",
          "• Vanilla CSS + Tailwind: GPU-accelerated glassmorphism & gradients.",
          "• requestAnimationFrame: 60/120 FPS hardware-synced counter animations.",
          "• Hosted on Vercel Edge Network (Global CDN deployment)."],
         EMERALD)
    ]

    card_w = Inches(3.8)
    col_gap = Inches(0.3)
    for i, (title, subtitle, bullets, color) in enumerate(tech_categories):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s7, x, Inches(1.4), col_w, Inches(5.4), title, color)

        tb = s7.shapes.add_textbox(x + Inches(0.2), Inches(2.0), col_w - Inches(0.4), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = subtitle
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = WHITE
        p.space_after = Pt(12)

        for b in bullets:
            bp = tf.add_paragraph()
            bp.text = b
            bp.font.size = Pt(11)
            bp.font.color.rgb = LIGHT_TEXT
            bp.space_after = Pt(12)

    add_speaker_notes(s7, """[SLIDE 7 - PRESENTERS: SHIVANSH MISHRA & HARSHVARDHAN SISODIYA | TIME: 60 SECONDS]
SHIVANSH: 'On the backend, we selected FastAPI with Python 3.13 because of its native async performance and strict Pydantic schemas. For PDF parsing and report generation, we chose PyMuPDF because it operates entirely in RAM without needing LibreOffice or external heavy binaries.
For AI, we implemented Bring-Your-Own-Key supporting Gemini, OpenAI, and Claude.
Now I'll let Harshvardhan explain the frontend choices.'
HARSHVARDHAN: 'For the frontend, we used React 19 bundled with Vite 6. This allows our production app to compile in just 340 milliseconds and deploy globally on Vercel's edge network. We avoided heavy animation libraries, using pure CSS and browser requestAnimationFrame for 60 to 120 FPS performance on all screens.'""")

    # -------------------------------------------------------------
    # SLIDE 8: BACKEND IMPLEMENTATION (Shivansh Mishra)
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, 8, "BACKEND IMPLEMENTATION & MICROSERVICES", "Clean Modular Architecture with 5 Enterprise Backend Engines", "Shivansh Mishra", "Team Leader & Architect")

    add_card(s8, Inches(0.6), Inches(1.4), Inches(6.0), Inches(5.4), "📦 5 Specialized Backend Engines", PRIMARY)
    tb_b = s8.shapes.add_textbox(Inches(0.85), Inches(2.1), Inches(5.5), Inches(4.5))
    tf_b = tb_b.text_frame
    tf_b.word_wrap = True

    engines = [
        ("1. In-Memory Resume Parser (resume_parser.py)", "Extracts text from PDF/DOCX bytes in RAM using PyMuPDF geometric sorting. Detects scanned image PDFs under 50 characters."),
        ("2. Skills Taxonomy Engine (taxonomy_service.py)", "Curated database of 440+ canonical technologies across 12 domains. Automatically resolves synonyms like 'k8s' ➔ 'Kubernetes'."),
        ("3. Deep ATS Audit Engine (ats_audit_service.py)", "Detects standard sections (Contact, Experience, Education, Projects). Scans 150+ action verbs and computes quantification ratios."),
        ("4. Executive Report Exporter (report_exporter.py)", "Generates 2-Page print-ready executive PDF dossiers, Markdown, HTML, and JSON with cryptographic SHA-256 seals."),
        ("5. Interview Question Generator (interview_generator.py)", "Dynamically creates seniority-tiered technical and behavioral questions targeted at the candidate's exact missing skills.")
    ]
    for title, desc in engines:
        p = tf_b.add_paragraph()
        p.text = title
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p2 = tf_b.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(8)

    add_card(s8, Inches(6.9), Inches(1.4), Inches(5.8), Inches(5.4), "⚡ Code Snippet: In-Memory Stream Processing", EMERALD)
    tb_c = s8.shapes.add_textbox(Inches(7.15), Inches(2.1), Inches(5.3), Inches(4.5))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    code_snippet = """# Zero-Disk In-Memory Parsing & Fallback Route
@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    x_gemini_api_key: Optional[str] = Header(None)
):
    # 1. Read bytes in-memory (No disk write)
    contents = await resume.read()
    
    # 2. Extract text with PyMuPDF
    raw_text = resume_parser.extract_text(
        contents, resume.filename
    )
    
    # 3. Clean and sanitize input
    clean_resume = text_cleaner.clean(raw_text)
    
    # 4. Route: AI Engine with Rule Fallback
    result = await analysis_router.evaluate(
        clean_resume, job_description, key=x_gemini_api_key
    )
    return result"""

    cp = tf_c.add_paragraph()
    cp.text = code_snippet
    cp.font.name = "Consolas"
    cp.font.size = Pt(9.5)
    cp.font.color.rgb = PRIMARY

    add_speaker_notes(s8, """[SLIDE 8 - PRESENTER: SHIVANSH MISHRA | TIME: 60 SECONDS]
'Dean Sir, our backend is structured around 5 dedicated engines:
1. The parser: handles file ingestion strictly in RAM.
2. The taxonomy engine: organizes 440 skills across 12 domains.
3. The ATS audit engine: analyzes section layout, action verbs, and quantified achievements.
4. The exporter: creates our 2-page PDF dossiers.
5. The interview generator: creates custom interview question kits.
As you can see in the code snippet on the right, the endpoint takes the upload stream directly into memory and passes it to the analysis router with zero temporary files on disk.'""")

    # -------------------------------------------------------------
    # SLIDE 9: AI INTEGRATION & FALLBACK (Shivansh Mishra)
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, 9, "MULTI-PROVIDER AI INTEGRATION & RELIABILITY", "Prompt Engineering, Structured JSON Schemas & Zero-Downtime Fallback", "Shivansh Mishra", "Team Leader & Architect")

    ai_cards = [
        ("🤖 Multi-Provider BYOK", 
         ["• Users provide their own API key (Bring Your Own Key).",
          "• Automatic key prefix detection: 'AQ.'/'AIza' ➔ Google Gemini, 'sk-' ➔ OpenAI, 'sk-ant-' ➔ Claude.",
          "• Keys are never logged, stored in databases, or sent to analytics.",
          "• Candidate privacy is mathematically guaranteed."],
         PRIMARY),

        ("📑 Strict JSON Rubric Schema", 
         ["• LLMs are forced to output strict Pydantic-validated JSON.",
          "• Eliminates hallucinations by anchoring scoring to a rigorous evaluation rubric.",
          "• Custom extractors handle raw markdown fences (```json ... ```) gracefully.",
          "• Validates matched skills, gap skills, strengths, weaknesses, and actionable advice."],
         PURPLE),

        ("🛡️ Zero-Downtime Fallback", 
         ["• If the user has no key, or the AI quota is exhausted, the system DOES NOT fail.",
          "• Transparent fallback to deterministic rule engine in under 5 milliseconds.",
          "• Set-intersection math ensures accurate skill identification even offline.",
          "• Honest transparency: result contains is_ai_powered: false indicator."],
         EMERALD)
    ]

    card_w = Inches(3.8)
    col_gap = Inches(0.3)
    for i, (title, points, color) in enumerate(ai_cards):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s9, x, Inches(1.4), col_w, Inches(5.4), title, color)

        tb = s9.shapes.add_textbox(x + Inches(0.2), Inches(2.1), col_w - Inches(0.4), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        for pt in points:
            p = tf.add_paragraph()
            p.text = pt
            p.font.size = Pt(11.5)
            p.font.color.rgb = LIGHT_TEXT
            p.space_after = Pt(14)

    add_speaker_notes(s9, """[SLIDE 9 - PRESENTER: SHIVANSH MISHRA | TIME: 50 SECONDS]
'On the AI side, we solved two major industry problems:
First, privacy and cost: By using a Bring-Your-Own-Key model, the university or user doesn't face high API hosting bills. The user brings their own key, and it stays only in their browser session.
Second, reliability: What happens if OpenAI is down or Gemini reaches a rate limit? Most college projects crash. Our system catches any AI failure, logs a warning, and immediately runs our sub-5ms deterministic rule engine. The user never sees an error screen.'""")

    # -------------------------------------------------------------
    # SLIDE 10: FRONTEND IMPLEMENTATION (Harshvardhan Sisodiya)
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, 10, "FRONTEND ARCHITECTURE & UX EXCELLENCE", "React 19 Single Page Application with GPU-Accelerated Nebula Glassmorphism", "Harshvardhan Sisodiya", "Frontend Architect")

    add_card(s10, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.4), "🎨 Frontend Design Highlights", PURPLE)
    tb_fe = s10.shapes.add_textbox(Inches(0.85), Inches(2.1), Inches(5.3), Inches(4.5))
    tf_fe = tb_fe.text_frame
    tf_fe.word_wrap = True

    fe_points = [
        ("React 19 + Vite 6 Architecture", "Ultra-fast single page application. Modular component hierarchy with custom hooks for state and session storage."),
        ("Nebula Aurora Glassmorphism", "Bespoke CSS gradient mesh with dark-mode elegance. Subtle backdrop blurs and fluid borders without heavy CSS frameworks."),
        ("180px SVG Radial Match Gauge", "Calculates match percentage with animated SVG stroke-dashoffset physics and count-up telemetry synchronized via requestAnimationFrame."),
        ("Bento Grid Responsive Layout", "Adaptive grid that organizes match score, skill tags, ATS metrics, and strengths/weaknesses seamlessly across 4K, laptop, and mobile screens."),
        ("Silent Server Warmup", "Automatically pings the Render backend on page load to eliminate free-tier spin-up delay before the user uploads their resume.")
    ]
    for title, desc in fe_points:
        p = tf_fe.add_paragraph()
        p.text = title
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p2 = tf_fe.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(8)

    # Show dashboard mockup image
    if os.path.exists("assets/dashboard.jpg"):
        s10.shapes.add_picture("assets/dashboard.jpg", Inches(6.8), Inches(1.4), Inches(5.9), Inches(5.4))
    else:
        add_card(s10, Inches(6.8), Inches(1.4), Inches(5.9), Inches(5.4), "🖥️ UI Showcase", PRIMARY)

    add_speaker_notes(s10, """[SLIDE 10 - PRESENTER: HARSHVARDHAN SISODIYA | TIME: 60 SECONDS]
'Respected Dean Sir and teachers, I am Harshvardhan Sisodiya, Frontend Architect.
Our goal on the frontend was to create an interface that looks like a world-class enterprise SaaS product, not a typical college assignment.
Key features of my implementation:
1. React 19 single-page architecture that builds in under 350ms.
2. Nebula Aurora glassmorphism: modern dark mode with fluid CSS gradients and zero lag.
3. A custom 180px SVG radial score gauge that animates smoothly at 60 to 120 FPS using browser requestAnimationFrame.
4. Full mobile responsiveness: whether viewed on a phone, tablet, or 4K monitor, the bento grid reshapes automatically.
5. And silent server warmup: as soon as you open the website, we ping Render in the background so the backend is warm and ready before you upload.'""")

    # -------------------------------------------------------------
    # SLIDE 11: TESTING STRATEGY & QA (Vishal Patel)
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, 11, "TESTING STRATEGY & SECURITY HARDENING", "92/92 Passing Automated Tests across 13 Modules & OWASP Compliance", "Vishal Patel", "QA Lead & Security")

    add_card(s11, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.4), "🧪 Automated Test Coverage (92 Tests)", EMERALD)
    tb_qa = s11.shapes.add_textbox(Inches(0.85), Inches(2.1), Inches(5.3), Inches(4.5))
    tf_qa = tb_qa.text_frame
    tf_qa.word_wrap = True

    qa_modules = [
        ("Multi-Provider AI Service (9 tests)", "Validates Gemini 2.5/3.6, GPT-4o, Claude API keys, retry logic, and fallback routines."),
        ("Analysis Routing & Fallback (4 tests)", "Tests seamless switching between AI and rule engine under transient errors."),
        ("ATS Heuristics & Scoring (9 tests)", "Verifies section detection, action verb counts, and quantification ratios."),
        ("Skills Taxonomy & Synonyms (9 tests)", "Tests alias resolution across all 12 domains (e.g. k8s ➔ Kubernetes)."),
        ("Candidate Interview Generator (8 tests)", "Ensures dynamic question synthesis based on candidate skill gaps."),
        ("Executive Report Exporter (8 tests)", "Validates PDF binary validity, 2-page pagination, and SHA-256 seal integrity."),
        ("Security & Sanitization (7 tests)", "Tests XSS, SQLi, prompt injection defenses, and zero-disk memory buffers.")
    ]
    for title, desc in qa_modules:
        p = tf_qa.add_paragraph()
        p.text = f"✔ {title}"
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = WHITE
        p2 = tf_qa.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(5)

    add_card(s11, Inches(6.8), Inches(1.4), Inches(5.9), Inches(5.4), "🛡️ Security & Performance Metrics", PRIMARY)
    tb_qm = s11.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.4), Inches(4.5))
    tf_qm = tb_qm.text_frame
    tf_qm.word_wrap = True

    sec_metrics = [
        ("Zero-Disk Persistence", "No candidate file, resume text, or API key is ever written to physical disk. Memory buffers are freed immediately after response completion."),
        ("SHA-256 Digital Provenance", "Every generated report receives a deterministic 64-character cryptographic hash seal ensuring audit authenticity."),
        ("OWASP Top 10 API Hardening", "Strict request validation, 5MB file upload cap, 15,000 character resume limits, and 5,000 character JD limits prevent denial-of-service."),
        ("Hermetic Unit Testing", "All external AI calls are fully mocked in pytest. Tests run completely offline in 1.4 seconds with zero network dependency.")
    ]
    for title, desc in sec_metrics:
        p = tf_qm.add_paragraph()
        p.text = f"🔒 {title}"
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = PRIMARY
        p2 = tf_qm.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(10)

    add_speaker_notes(s11, """[SLIDE 11 - PRESENTER: VISHAL PATEL | TIME: 55 SECONDS]
'Respected Dean Sir, I am Vishal Patel, QA Lead and Security Specialist.
My mission was to ensure this platform never breaks and never leaks candidate data.
We built a hermetic automated test suite using pytest containing 92 test cases across 13 distinct modules.
Every pull request is automatically verified:
- We test AI failure handling, schema validation, and PDF binary output.
- On security: we adhere to OWASP API guidelines. We test against prompt injection, malicious file types, and XSS attacks.
- Everything runs in RAM; no files are saved to disk.
As of today, all 92 tests pass with 100% success.'""")

    # -------------------------------------------------------------
    # SLIDE 12: DOCUMENTATION & PRESENTATION (Sujeet Kannaujiya)
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, 12, "DOCUMENTATION & ACADEMIC RIGOR", "10 Engineering Specifications, API References & Ethical AI Audits", "Sujeet Kannaujiya", "Research & Documentation")

    add_card(s12, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.4), "📚 10 Core Documentation Deliverables", AMBER)
    tb_doc = s12.shapes.add_textbox(Inches(0.85), Inches(2.1), Inches(5.3), Inches(4.5))
    tf_doc = tb_doc.text_frame
    tf_doc.word_wrap = True

    doc_files = [
        ("ARCHITECTURE.md", "Complete architectural diagram, data flow pipelines, and microservice responsibilities."),
        ("API_REFERENCE.md", "Full REST API documentation covering all 7 endpoints, schemas, headers, and error codes."),
        ("CAPSTONE_PROJECT_DOSSIER.md", "Official BBD University capstone report, team deliverables, and academic metrics."),
        ("ATS_PARSER_HEURISTICS_SPEC.md", "Algorithmic specification for section integrity, action verbs, and quantification math."),
        ("ETHICAL_AI_AND_BIAS_AUDIT.md", "Fairness framework: stripping PII (gender, age, ethnicity) to prevent algorithmic hiring bias."),
        ("RESEARCH_LLM_BENCHMARKS.md", "Comparative study benchmarking Gemini, GPT-4o, and Claude on latency, cost, and accuracy."),
        ("SECURITY_AUDIT_REPORT.md", "OWASP API Top 10 compliance audit, vulnerability matrix, and hardening measures.")
    ]
    for title, desc in doc_files:
        p = tf_doc.add_paragraph()
        p.text = f"📄 {title}"
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = WHITE
        p2 = tf_doc.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(4)

    add_card(s12, Inches(6.8), Inches(1.4), Inches(5.9), Inches(5.4), "🔍 Reproducibility & Open Source Standards", PRIMARY)
    tb_rep = s12.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.4), Inches(4.5))
    tf_rep = tb_rep.text_frame
    tf_rep.word_wrap = True

    rep_points = [
        ("Full Developer Reproducibility", "Any evaluator or engineer can clone the repository, run 3 simple terminal commands, and have the full platform running locally in under 60 seconds."),
        ("Interactive OpenAPI / Swagger UI", "Live interactive documentation accessible at /docs on our production backend, allowing examiners to test every endpoint directly in the browser."),
        ("Ethical AI & Bias Mitigation", "We audited our AI prompts to ensure candidate scoring is strictly competence-based, ignoring names, demographic data, and formatting quirks."),
        ("Standardized Code Guidelines", "Clean directory organization, PEP 8 Python standards, ESLint configuration, and centralized environment variables.")
    ]
    for title, desc in rep_points:
        p = tf_rep.add_paragraph()
        p.text = f"⭐ {title}"
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = PRIMARY
        p2 = tf_rep.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(8)

    add_speaker_notes(s12, """[SLIDE 12 - PRESENTER: SUJEET KANNAUJIYA | TIME: 50 SECONDS]
'Respected Dean Sir and faculty, I am Sujeet Kannaujiya, Research and Documentation Lead.
For an engineering project to be successful, its documentation must be as rigorous as its code.
I authored 10 comprehensive technical specifications:
- An API Reference with full request/response schemas.
- An Ethical AI and Bias Audit, ensuring our prompts strip candidate PII like gender and age to prevent algorithmic discrimination.
- An LLM Benchmark Study comparing Gemini, GPT-4o, and Claude across latency, token costs, and accuracy.
- And our Capstone Project Dossier documenting our team's academic journey.
Anyone can clone our repository and run the full application in under 60 seconds.'""")

    # -------------------------------------------------------------
    # SLIDE 13: LIVE DEMO (Shivansh leads, Harshvardhan UI, Vishal test)
    # -------------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)
    add_header(s13, 13, "LIVE APPLICATION DEMONSTRATION", "Real-Time Walkthrough of the User Flow, Heuristic Audit & PDF Export", "Shivansh Mishra", "Leading Live Demo")

    demo_steps = [
        ("Step 1: Upload & Input", 
         ["• Drag-and-drop resume PDF/DOCX.",
          "• Paste target Job Description (e.g. AI Engineer).",
          "• Optional: Provide multi-provider API key in BYOK vault.",
          "• Instant file validation and in-memory text parsing."],
         PRIMARY),

        ("Step 2: Semantic Match & ATS Audit", 
         ["• 180px SVG Radial Gauge animates match score.",
          "• Green tags: Verified Matched Skills.",
          "• Red tags: Critical Missing Gaps (e.g., PyTorch).",
          "• Composite ATS scores: Section Health, Action Verbs, Quantification."],
         PURPLE),

        ("Step 3: Interview Kit & PDF Export", 
         ["• Dynamic Technical Interview Questions probing missing skills.",
          "• Recruiter evaluation signals for each question.",
          "• 1-Click download of 2-Page Executive PDF Report.",
          "• Cryptographic SHA-256 seal guarantees document provenance."],
         EMERALD)
    ]

    card_w = Inches(3.8)
    col_gap = Inches(0.3)
    for i, (title, points, color) in enumerate(demo_steps):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s13, x, Inches(1.4), col_w, Inches(5.4), title, color)

        tb = s13.shapes.add_textbox(x + Inches(0.2), Inches(2.1), col_w - Inches(0.4), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        for pt in points:
            p = tf.add_paragraph()
            p.text = pt
            p.font.size = Pt(11.5)
            p.font.color.rgb = LIGHT_TEXT
            p.space_after = Pt(14)

    add_speaker_notes(s13, """[SLIDE 13 - PRESENTER: SHIVANSH MISHRA & TEAM | TIME: 2-3 MINUTES]
'Now, Dean Sir, we would like to show you the live product running in real-time.
[Shivansh opens https://ai-powered-resume-analyzer-pi.vercel.app]
Notice how fast the page loads.
Harshvardhan, please drag and drop our sample AI Engineer resume.
Now we click Analyze.
Watch the animated 180px gauge — in less than one second, the score appears!
Notice the breakdown:
- On the left: verified matched skills in emerald chips, and missing skills in red.
- In the center: our deep ATS audit showing section health and action verbs.
- At the bottom: our custom interview prep kit.
Now we click Export PDF Report — within one second, a clean, 2-page white executive audit report downloads directly with our cryptographic SHA-256 seal.'""")

    # -------------------------------------------------------------
    # SLIDE 14: RESULTS & METRICS (Shivansh & Vishal)
    # -------------------------------------------------------------
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14)
    add_header(s14, 14, "MEASURED RESULTS & SYSTEM METRICS", "Empirical Proof of High Performance, Accuracy, and Engineering Reliability", "Shivansh & Vishal", "Architect & QA Lead")

    metrics_grid = [
        ("92 / 92", "Automated Tests Passing", "100% pass rate across 13 modules with zero regressions.", EMERALD),
        ("< 5 ms", "Deterministic Latency", "Sub-5ms response time for rule-based matching without external API.", PRIMARY),
        ("~780 ms", "AI Cloud Latency", "Fast semantic analysis using Google Gemini 2.5/3.6 Flash.", PURPLE),
        ("440+", "Canonical Technologies", "Cataloged across 12 distinct software engineering domains.", AMBER),
        ("150+", "Action Verbs Indexed", "Categorized into leadership, technical, and operational verbs.", PRIMARY),
        ("$0.00", "Monthly Hosting Cost", "100% free-tier architecture utilizing Render and Vercel Edge.", EMERALD)
    ]

    card_w = Inches(3.8)
    card_h = Inches(2.55)
    row_gap = Inches(0.25)
    col_gap = Inches(0.3)

    for i, (big_num, label, desc, color) in enumerate(metrics_grid):
        col = i % 3
        row = i // 3
        x = Inches(0.6) + col * (card_w + col_gap)
        y = Inches(1.4) + row * (card_h + row_gap)

        c = add_card(s14, x, y, card_w, card_h, None, color)

        tb = s14.shapes.add_textbox(x + Inches(0.2), y + Inches(0.15), card_w - Inches(0.4), card_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        p1.text = big_num
        p1.font.bold = True
        p1.font.size = Pt(28)
        p1.font.color.rgb = color
        p1.alignment = PP_ALIGN.CENTER

        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.bold = True
        p2.font.size = Pt(12)
        p2.font.color.rgb = WHITE
        p2.alignment = PP_ALIGN.CENTER
        p2.space_after = Pt(6)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(10)
        p3.font.color.rgb = MUTED_TEXT
        p3.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s14, """[SLIDE 14 - PRESENTERS: SHIVANSH MISHRA & VISHAL PATEL | TIME: 45 SECONDS]
SHIVANSH: 'Dean Sir, these are our verified engineering numbers:
- 92 out of 92 automated tests passing.
- Under 5 millisecond latency on our local rule engine.
- 780 milliseconds on our cloud AI engine.
- 440 canonical skills cataloged across 12 tech domains.
- 150 action verbs tracked.
- And zero monthly hosting costs. We deployed a production-grade system with zero infrastructure budget.'""")

    # -------------------------------------------------------------
    # SLIDE 15: CHALLENGES & LESSONS LEARNED (All 4 Members)
    # -------------------------------------------------------------
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15)
    add_header(s15, 15, "ENGINEERING CHALLENGES & LESSONS LEARNED", "How Our Team Navigated Real Technical Roadblocks and Grew as Engineers", "All 4 Team Members", "Team Retrospective")

    challenges = [
        ("Shivansh (Backend & AI)", "Challenge: AI API Schema Drift & Rate Limits",
         ["• Challenge: Gemini API updates occasionally injected additionalProperties or returned unstructured markdown.",
          "• Solution: Built a multi-stage regex JSON repair utility and Pydantic validator with automatic rule-based fallback.",
          "• Lesson: Never trust raw LLM outputs in production without strict structural validation."],
         PRIMARY),

        ("Harshvardhan (Frontend)", "Challenge: High-Performance Animations & Zero Lag",
         ["• Challenge: Heavy CSS animations caused jank and dropped frames on low-end laptops and mobile devices.",
          "• Solution: Migrated all animations to GPU-composited CSS transforms and requestAnimationFrame physics.",
          "• Lesson: Clean CSS architecture often outperforms heavy third-party animation libraries."],
         PURPLE),

        ("Vishal (Testing & QA)", "Challenge: Hermetic Unit Testing Without AI Costs",
         ["• Challenge: Running automated tests against live AI APIs exhausted rate quotas and made tests flaky.",
          "• Solution: Implemented unittest.mock fixtures simulating all LLM success, error, and timeout states.",
          "• Lesson: Hermetic offline unit testing guarantees rapid, reproducible CI/CD runs."],
         EMERALD),

        ("Sujeet (Research & Docs)", "Challenge: Algorithmic Fairness & Bias Mitigation",
         ["• Challenge: Standard AI prompts could inadvertently favor certain demographic patterns in resumes.",
          "• Solution: Implemented an automated PII stripping rubric in prompt design to focus purely on technical competencies.",
          "• Lesson: Ethical AI governance must be engineered from day one, not treated as an afterthought."],
         AMBER)
    ]

    card_w = Inches(5.8)
    card_h = Inches(2.55)
    row_gap = Inches(0.25)
    col_gap = Inches(0.4)

    for i, (member, title, bullets, color) in enumerate(challenges):
        col = i % 2
        row = i // 2
        x = Inches(0.6) + col * (card_w + col_gap)
        y = Inches(1.4) + row * (card_h + row_gap)

        add_card(s15, x, y, card_w, card_h, f"🛠️ {member}", color)

        tb = s15.shapes.add_textbox(x + Inches(0.2), y + Inches(0.55), card_w - Inches(0.4), card_h - Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.space_after = Pt(4)

        for b in bullets:
            bp = tf.add_paragraph()
            bp.text = b
            bp.font.size = Pt(9.5)
            bp.font.color.rgb = LIGHT_TEXT
            bp.space_after = Pt(3)

    add_speaker_notes(s15, """[SLIDE 15 - PRESENTERS: ALL 4 MEMBERS | TIME: 60 SECONDS]
SHIVANSH: 'We faced real engineering challenges. For backend, handling LLM schema changes taught us to never trust raw AI outputs without strict Pydantic validation.'
HARSHVARDHAN: 'On frontend, optimizing animations taught me how GPU compositing and requestAnimationFrame prevent UI lag.'
VISHAL: 'For QA, mocking cloud AI APIs taught me how to keep test suites hermetic, fast, and 100% reliable.'
SUJEET: 'And on research, auditing AI bias taught me that ethical AI must be designed into the prompt architecture from day one.'""")

    # -------------------------------------------------------------
    # SLIDE 16: FUTURE ROADMAP (Shivansh Mishra)
    # -------------------------------------------------------------
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_background(s16)
    add_header(s16, 16, "FUTURE ROADMAP & SCALABILITY", "Architectural Evolution: What We Plan to Build in Phase 2", "Shivansh Mishra", "Team Leader & Architect")

    roadmap = [
        ("PHASE 2.1 (Near Term)", "Recruiter Multi-Candidate Portal",
         ["• Bulk resume processing: Rank hundreds of resumes simultaneously against a single job description.",
          "• Interactive Candidate Comparison Matrix for hiring managers.",
          "• Export comparative candidate ranking spreadsheets and charts."],
         PRIMARY),

        ("PHASE 2.2 (Mid Term)", "Voice AI Mock Interview Simulations",
         ["• Convert our technical interview kit into an interactive voice agent.",
          "• Real-time speech-to-text with AI evaluating answers on technical depth and communication.",
          "• Instant scoring on candidate audio responses."],
         PURPLE),

        ("PHASE 2.3 (Long Term)", "Enterprise ATS Integrations",
         ["• Direct bi-directional API plugins for Greenhouse, Workday, and Lever.",
          "• LinkedIn and GitHub profile auto-ingestion for multi-source candidate verification.",
          "• Self-hosted open-source Docker container distribution."],
         EMERALD)
    ]

    card_w = Inches(3.8)
    col_gap = Inches(0.3)
    for i, (phase, title, points, color) in enumerate(roadmap):
        x = Inches(0.6) + i * (card_w + col_gap)
        add_card(s16, x, Inches(1.4), col_w, Inches(5.4), phase, color)

        tb = s16.shapes.add_textbox(x + Inches(0.2), Inches(2.1), col_w - Inches(0.4), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = WHITE
        p.space_after = Pt(14)

        for pt in points:
            p = tf.add_paragraph()
            p.text = pt
            p.font.size = Pt(11.5)
            p.font.color.rgb = LIGHT_TEXT
            p.space_after = Pt(14)

    add_speaker_notes(s16, """[SLIDE 16 - PRESENTER: SHIVANSH MISHRA | TIME: 45 SECONDS]
'Looking forward, this project has immense real-world commercial potential.
In Phase 2, we plan to add:
1. A Recruiter Portal allowing companies to upload 500 resumes at once and rank them instantly.
2. An interactive Voice Mock Interviewer where candidates can practice answering the generated interview questions verbally.
3. Direct plugins for enterprise ATS systems like Workday and Greenhouse.'""")

    # -------------------------------------------------------------
    # SLIDE 17: APPENDIX & BACKUP SLIDES (Team Q&A Reference)
    # -------------------------------------------------------------
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_background(s17)
    add_header(s17, 17, "APPENDIX & DEEP TECHNICAL REFERENCE", "Microservice Endpoints, Cryptographic Provenance & Schema Specifications", "Team Reference", "For Deep Technical Inquiries")

    add_card(s17, Inches(0.6), Inches(1.4), Inches(5.8), Inches(5.4), "📡 Production REST API Endpoints", PRIMARY)
    tb_ep = s17.shapes.add_textbox(Inches(0.85), Inches(2.1), Inches(5.3), Inches(4.5))
    tf_ep = tb_ep.text_frame
    tf_ep.word_wrap = True

    endpoints = [
        ("GET /health", "Health check & cold-start container warmup trigger."),
        ("POST /analyze", "Multipart upload (PDF/DOCX + JD + BYOK Key) -> Semantic score."),
        ("GET /taxonomy/domains", "Lists all 12 tech domains and 440+ canonical skill counts."),
        ("POST /taxonomy/categorize", "Resolves skill synonyms (e.g. k8s ➔ Kubernetes)."),
        ("POST /audit/ats", "Heuristic ATS score, action verbs count, bullet quantification %."),
        ("POST /interview/generate", "Generates targeted interview questions for identified skill gaps."),
        ("POST /export/pdf", "Generates 2-page print-ready executive PDF with SHA-256 seal.")
    ]
    for ep, desc in endpoints:
        p = tf_ep.add_paragraph()
        p.text = ep
        p.font.bold = True
        p.font.name = "Consolas"
        p.font.size = Pt(10)
        p.font.color.rgb = PRIMARY
        p2 = tf_ep.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(4)

    add_card(s17, Inches(6.8), Inches(1.4), Inches(5.9), Inches(5.4), "🔐 SHA-256 Digital Provenance Mechanism", EMERALD)
    tb_sh = s17.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.4), Inches(4.5))
    tf_sh = tb_sh.text_frame
    tf_sh.word_wrap = True

    prov_info = [
        ("Deterministic Serialization", "Payload keys are canonicalized and sorted deterministically, omitting volatile timestamps, to guarantee identical hashes for identical audits."),
        ("Cryptographic Digest", "Uses standard hashlib.sha256(payload.encode('utf-8')).hexdigest() to create an unforgeable 64-character digital seal embedded directly in the PDF."),
        ("Academic Provenance Verification", "The seal certifies that the resume was audited by the AI-Powered Resume Analyzer Suite developed at BBD University."),
        ("Tamper-Proof Audit Trail", "Any alteration to candidate score or matched skills invalidates the verification hash instantly.")
    ]
    for title, desc in prov_info:
        p = tf_sh.add_paragraph()
        p.text = f"🔒 {title}:"
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = WHITE
        p2 = tf_sh.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = LIGHT_TEXT
        p2.space_after = Pt(8)

    add_speaker_notes(s17, """[SLIDE 17 - PRESENTERS: TEAM AS NEEDED | BACKUP SLIDE FOR Q&A]
'This slide is reserved for deep technical questions from Dean Sir or examiners regarding our API specifications or cryptographic SHA-256 implementation.'""")

    # -------------------------------------------------------------
    # SLIDE 18: THANK YOU & Q&A (Shivansh & Team)
    # -------------------------------------------------------------
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_background(s18)

    # Hero card
    hero18 = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(0.8), Inches(10.933), Inches(5.9))
    hero18.fill.solid()
    hero18.fill.fore_color.rgb = CARD_BG
    hero18.line.color.rgb = PRIMARY
    hero18.line.width = Pt(2)

    tb18 = s18.shapes.add_textbox(Inches(1.5), Inches(1.2), Inches(10.3), Inches(5.1))
    tf18 = tb18.text_frame
    tf18.word_wrap = True

    p = tf18.paragraphs[0]
    p.text = "Thank You, Respected Dean Sir & Faculty!"
    p.font.bold = True
    p.font.size = Pt(28)
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(6)

    p = tf18.add_paragraph()
    p.text = "We are now open for your Questions, Feedback & Evaluation"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = PRIMARY
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(24)

    p = tf18.add_paragraph()
    p.text = "🔗 Live Application: https://ai-powered-resume-analyzer-pi.vercel.app"
    p.font.size = Pt(13)
    p.font.color.rgb = LIGHT_TEXT
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(6)

    p = tf18.add_paragraph()
    p.text = "💻 GitHub Repository: https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
    p.font.size = Pt(13)
    p.font.color.rgb = LIGHT_TEXT
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(6)

    p = tf18.add_paragraph()
    p.text = "⚡ Backend API Documentation: https://resume-analyzer-api.onrender.com/docs"
    p.font.size = Pt(13)
    p.font.color.rgb = LIGHT_TEXT
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(24)

    p = tf18.add_paragraph()
    p.text = "👑 Shivansh Mishra (Backend & AI)  •  🎨 Harshvardhan Sisodiya (Frontend)  •  🛡️ Vishal Patel (QA)  •  📑 Sujeet Kannaujiya (Docs)"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = EMERALD
    p.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s18, """[SLIDE 18 - PRESENTER: SHIVANSH MISHRA | TIME: REMAINING TIME FOR Q&A]
'Respected Dean Sir and faculty members, thank you very much for your valuable time and mentorship throughout this capstone project.
Our entire team is now ready to answer any questions you have about our backend architecture, frontend implementation, testing strategy, or research benchmarks.'""")

    # Save to presentation directory and root
    os.makedirs("presentation", exist_ok=True)
    ppt_path = "presentation/AI_Powered_Resume_Analyzer_Presentation.pptx"
    prs.save(ppt_path)
    print(f"Presentation saved successfully to {ppt_path}")

    root_ppt_path = "AI_Powered_Resume_Analyzer_Presentation.pptx"
    prs.save(root_ppt_path)
    print(f"Presentation copy saved successfully to {root_ppt_path}")

if __name__ == "__main__":
    build_presentation()
