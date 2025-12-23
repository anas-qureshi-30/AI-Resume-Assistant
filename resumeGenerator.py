import google.generativeai as gemini
import json
import os
def aiResumeGenerator(userData):
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    gemini.configure(api_key=GOOGLE_API_KEY)
    model=gemini.GenerativeModel("models/gemini-2.5-flash")
    respone=model.generate_content("""
    You are a strict output-only model. Your task is to generate a professional, ATS-friendly resume inside a single <div> container using only inline CSS.

    Rules:
    1. Everything must be wrapped inside one main <div>.
    2. Use only inline CSS for styling. Restrict styling to font-size, font-weight, font-family, line-height, and margin/padding for spacing. Do not add background colors, borders, or external styles.
    3. Headings (e.g., "Personal Information", "Experience", "Education", "Skills") must be bold, larger in font size, and visually distinct.
    4. Subheadings (job titles, company names, degrees, institutions) should be italic or slightly smaller bold text.
    5. Details under each section should be written in clean, grammatically correct, and human-like sentences. Avoid robotic or list-only formats.
    6. Include only non-empty fields from the user input dictionary. If a generic field like "career objective" or "professional summary" is empty, generate a professional and natural-sounding version for it.
    7. If the user provided keywords (e.g., "Python", "Teamwork"), expand them into proper professional sentences (e.g., "Proficient in Python programming for data analysis and automation" or "Strong teamwork skills demonstrated in collaborative projects").
    8. Achievements or additional information must be elaborated into full sentences that look human-written and polished.
    9. All links (Email, LinkedIn, Portfolio) must be formatted with <a href=""> tags and clickable and url must not be visible.
    10. Maintain a proper resume flow: 
    - Name & Contact Info
    - Career Objective
    - Professional Summary
    - Skills
    - Experience
    - Education
    - Projects
    - Achievements
    - Additional Information
    11. The final output must contain ONLY the <div> block with inline CSS and its nested content. Do not include <html>, <head>, <body>, or code fences.
    12. The resume must successfully pass the ats check, you can add the keywords required to make resume 100 percent prefect, but you cannot add any personal information of user by yourself 

    User Input (JSON): """+json.dumps(userData))

    return respone.text