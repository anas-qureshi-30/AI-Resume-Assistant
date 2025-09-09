import google.generativeai as gemini
from docx import Document
import json
from flask import session
def rankResume():
    with open("config.json") as f:
        config=json.load(f)
    file=Document(session["file_path"])
    text=""
    for para in file.paragraphs:
        text=text+para.text
    gemini.configure(api_key=config["GOOGLE_API"])
    model=gemini.GenerativeModel("models/gemini-1.5-flash")

    response=model.generate_content(
    "You are an AI resume ranking system. Compare the candidate's resume against 100-120 other resumes and provide a structured evaluation. "
    "Rules: "
    "Never write introductions, explanations, or conclusions. Output must be concise, clear, and structured. Only provide the JSON output. No extra text, explanations, or comments. "
    "1. Output must be in JSON format only. Do NOT include any code fences or explanations. "
    "2. JSON must contain the following keys: "
    "'no_of_compared_resumes', 'overall_score', 'percentile', 'rank', 'category_scores', 'insights'. "
    "3. 'category_scores' must have keys: 'skills', 'experience', 'education', 'keywords', 'soft_skill'. "
    "4. 'category_comparison' must include for each category: 'your_score', 'average_score', 'top_10_percent_score'"
    "5. 'insights' must include: 'strengths', 'weaknesses', 'recommendations'. "
    "6. All values must be realistic and consistent. "
    "7.  Output must be in JSON format only. Do NOT include any code fences like ```json``` or ``` ``` around your response. "
    "Candidate Resume: " + text
    )

    output=json.loads(response.text)
    return output