import google.generativeai as gemini
from docx import Document
import json
from flask import session
def atsScoreGenerator(userJobDescription):
    with open("config.json") as f:
        config=json.load(f)
    file=Document(session["file_path"])
    text=""
    for para in file.paragraphs:
        text=text+para.text
    gemini.configure(api_key=config["GOOGLE_API"])
    model=gemini.GenerativeModel("models/gemini-1.5-flash")
    response=model.generate_content("""
    You are an ATS (Applicant Tracking System) simulation engine.  
    The user will provide two inputs:  
    1. A resume (in text or structured JSON form).  
    2. A target job description.  

    Your task is to analyze the resume against the job description and generate the ATS results return **only JSON output**.
    **Strictly to not include Following Things**:
    -no explanations
    -no text
    -no json fences at starting and ending of output.  

    The JSON must strictly follow this structure:  

    {
    "score": {
        "overall": <number between 0-100>,
        "keywords": <number between 0-100>,
        "formatting": <number between 0-100>,
        "structure": <number between 0-100>,
        "content": <number between 0-100>
    },
    "passedATSChecks": [
        {
        "title": "<check title>",
        "description": "<what passed and why>"
        }
    ],
    "issues": [
        {
        "title": "<issue title>",
        "severity": "<low | medium | high>",
        "description": "<clear description of the issue>",
        "impact": "<how it affects ATS parsing>"
        }
    ],
    "suggestions": [
        {
        "title": "<suggestion title>",
        "priority": "<low | medium | high>",
        "description": "<explanation of what to fix>",
        "example": "<sample corrected text or action>"
        }
    ],
    "keywords": {
        "missing": ["<keyword1>", "<keyword2>", "..."],
        "found": ["<keyword3>", "<keyword4>", "..."]
    }
    }

    Rules:
    - If resume has poor formatting, highlight that under issues.  
    - If important keywords from job description are missing, include them under `keywords.missing`.  
    - Suggestions must be **actionable and practical**, with examples.  
    - Scores should be consistent with issues found.  
    - If no issues are found, return empty arrays for "issues" and "suggestions".  
    - Do not output anything outside of the JSON object.  

    User Resume: """+ userJobDescription)
    print(response)
    cleaned = response.text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    output = json.loads(cleaned)

    print(output)
    return output