import google.generativeai as gemini
import json
from flask import session
import zipfile

def atsScoreGenerator(userJobDescription):
    with open("config.json") as f:
        config=json.load(f)
    file=session["file_path"]
    text=""
    with zipfile.ZipFile(file) as resume:
        text=resume.read("word/document.xml").decode("utf-8")
    gemini.configure(api_key=config["GOOGLE_API"])
    model=gemini.GenerativeModel("models/gemini-1.5-flash")
    response=model.generate_content("""
    You are an ATS (Applicant Tracking System) simulation engine.
    The user will provide two inputs:
    1. A resume in WordprocessingML (DOCX XML format).
    2. A target job description in plain text. 

    Your Task
        Analyze the resume against the job description and generate the ATS evaluation. You must:
        Treat XML tags as formatting markers (e.g., <w:b> = bold, <w:p> = paragraph, <w:tbl> = table).
        Extract and analyze text content for keyword and content checks.
        Check formatting consistency using XML tags (headings, bold, tables, bullet points).

    Return only JSON output in the following structure:

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

    JobDescription: """+ userJobDescription+" User Resume: "+text)
    cleaned = response.text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    output = json.loads(cleaned)
    return output