import google.generativeai as gemini
import json
import os
def generateTemplate(userDescription):
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    gemini.configure(api_key=GOOGLE_API_KEY)
    model=gemini.GenerativeModel("models/gemini-2.5-flash")
    response=model.generate_content("You are a strict output-only model. "
    "Your only purpose is to generate detailed resume templates in HTML format. "
    "Rules you must follow: "
    "1. Never write introductions, explanations, or conclusions. "
    "2. Never use code fences like ```html or ``` in your response. "
    "3. If the user provides a job description, generate ONLY a complete, detailed, and professional HTML resume template that matches the job description. "
    "4. The HTML must be properly structured, styled, and ready to use as a template. "
    "5. If the user asks for anything else that is not a resume template request, respond only with: 'Sorry, I am built to generate resume templates only.' "
    "6. Output must always be ONLY the raw HTML code without any extra text. "
    "7. Template must be like that resume must clear ats check easily."
    "8. Html code must not have title tag it must be without <title></title> tag"
    "User input: " + userDescription)
    return response.text