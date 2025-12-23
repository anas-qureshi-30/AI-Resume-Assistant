import google.generativeai as gemini
import os
import json
def aiJDResumeGen(userData):
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    gemini.configure(api_key=GOOGLE_API_KEY)
    model=gemini.GenerativeModel("models/gemini-2.5-flash")
    respone=model.generate_content("""
    You are a professional Resume Builder AI specialized in creating ATS-friendly resumes.  
    You are a professional Resume Builder AI specialized in creating **ATS-friendly and highly detailed resumes**.  
    The user will provide only these inputs:  
    - Job Description  

    Your task:  
    1. Generate a **fully detailed, professional resume** tailored to the job description.  
    2. AI should **automatically fill in any missing sections** such as professional summary, career objective, technical skills, soft skills, work experience, projects, certifications, achievements, and additional info if the user did not provide them.  
    3. Resume must be **ATS optimized** (extract keywords from the job description, emphasize relevant skills, and format properly).  
    4. Every section must be **elaborate and human-written**:
        - Professional summary and career objective should be specific to the user's role and job description.  
        - Experience should include **responsibilities, achievements, and measurable results**.  
        - Projects should describe **technology, purpose, and outcomes**.  
        - Skills should explain **level of expertise or relevance to the role**.  
        - Achievements and certifications should be described in **full sentences**.  
    5. Resume must follow a **professional layout** and appear human-written.  

    **Formatting Rules:**  
    - Output only in **HTML format**, inside a single `<div>` block.  
    - Use **inline CSS** only for font size, font weight, and text alignment.  
    - Use `<strong>` for headings.  
    - Use `<ul>` and `<li>` for bullet points.  
    - Use `<a href="">` for links like LinkedIn, Portfolio, or projects.  
    - Do not include `<html>`, `<head>`, `<body>`, or any template code.  

    **Important Notes:**  
    - AI should **generate realistic content** for sections not provided by the user.  
    - Any generic info should be professional and relevant to the job description.  
    - Do not output explanations or extra text outside the `<div>`.  
    - The resume must **look complete, human-written, and pass ATS parsing easily**.  
    - Elaborate everything to make it as detailed as possible while remaining relevant to the job description.
    - In place of name write "Your Name" place of education write "Your College"
    
    User Input (JSON): """+json.dumps(userData))
    cleaned = respone.text.strip()
    if cleaned.startswith("```html"):
        cleaned = cleaned[len("```html"):].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    return cleaned