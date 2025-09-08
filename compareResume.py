import google.generativeai as gemini
from docx import Document
import json
def compareResume(userJobDescription):
    with open("config.json") as f:
        config=json.load(f)
    file=Document("C:\\Users\\saymaqureshi27\\Desktop\\Project's\\AI Resume Assistant\\RESUME.docx")
    text=""
    for para in file.paragraphs:
        text=text+para.text
    gemini.configure(api_key=config["GOOGLE_API"])
    model=gemini.GenerativeModel("models/gemini-1.5-flash")

    response=model.generate_content(
    "You are a strict resume analysis AI. Your task is to compare a candidate's resume with a given job description and provide a detailed, structured analysis. "
    "Follow these rules: "
    "1. Never write introductions, explanations, or conclusions. Output must be concise, clear, and structured. "
    "2. Analyze the resume against the job description and provide: "
    "- Overall match percentage (0-100%) between resume and job description. "
    "- List of keywords from the job description that are matched in the resume. "
    "- List of keywords from the job description that are missing in the resume. "
    "- Skill analysis: which skills from the job description are present in the resume and which are missing. "
    "- Requirement analysis: which requirements are fulfilled and which are not. "
    "- Suggested actions to improve the resume. For each action, provide a priority (High, Medium, Low) indicating its importance. "
    "- Impact of each suggested action on the overall match or alignment with the job description. "
    "3. Always output in structured JSON format with keys: 'match_percentage', 'matched_keywords', 'missing_keywords', 'skill_analysis', 'requirement_analysis', 'suggested_actions'. "
    "4. The 'suggested_actions' key must be an array of objects, each object containing: 'action', 'priority', 'impact'. "
    "5. Only provide the JSON output. No extra text, explanations, or comments. "
    "6.  Output must be in JSON format only. Do NOT include any code fences like ```json``` or ``` ``` around your response. "
    "Resume: " + text + " "
    "Job Description: " + userJobDescription)

    output=json.loads(response.text)
    return output