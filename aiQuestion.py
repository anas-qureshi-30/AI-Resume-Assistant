import google.generativeai as gemini
from docx import Document
from flask import session
import os
import json
def aiQuestionGenerator(jobDescription):
    file=Document(session["file_path"])
    text=""
    for para in file.paragraphs:
        text=text+para.text
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    gemini.configure(api_key=GOOGLE_API_KEY)
    model=gemini.GenerativeModel("models/gemini-2.5-flash")
    resposne=model.generate_content("""
    You are a strict output-only model. Your sole purpose is to analyze resumes for interview questions. Do not write introductions, explanations, or comments. Respond ONLY with valid JSON and never include code fences. 
    The user will provide two inputs:
        A resume (candidate’s details).
        A job description (target role).
                                   
    Your task is to analyze both inputs and generate:
                                   
    1. Interview Questions
    At least 10 questions in total.
    Categories:
    Technical (skills, tools, coding, domain knowledge)
    Behavioral (soft skills, teamwork, communication, problem-solving)
    Role-Specific (directly related to the target job description and responsibilities)
    Each question must have a difficulty level: "easy" | "medium" | "hard".

    2. Mock Interview (Q&A)
    At least 5 questions with answers.
    Use the candidate’s resume + job description context to generate realistic answers.
    Answers should reflect a professional, concise, and role-aligned style.
    Output Format (Strictly JSON Only, No Explanations, No Extra Text):
    {
    "interviewQuestions": [
    {
    "category": "<Technical | Behavioral | Role-Specific>",
    "difficulty": "<Easy | Medium | Hard>",
    "question": "<the question text>"
    }
    ],
    "mockInterview": [
    {
    "question": "<the question text>",
    "answer": "<a realistic and professional answer>"
    }
    ]
    }
    Rules:
        Always produce more than 10 interviewQuestions.
        Always produce more than 5 mockInterview Q&A.
        Do not include any explanations outside the JSON.
        Keep answers natural, realistic, and aligned to both resume + job description.
    Job Description"""+jobDescription+" User Resume: "+text)
    cleaned = resposne.text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()
    output=json.loads(cleaned)
    return output