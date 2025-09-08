import google.generativeai as gemini
from docx import Document
import json
def skillGapOutput(targetRole,experienceLevel):
    with open("config.json") as f:
        config=json.load(f)
    file=Document("C:\\Users\\saymaqureshi27\\Desktop\\Project's\\AI Resume Assistant\\RESUME.docx")
    text=""
    for para in file.paragraphs:
        text=text+para.text
    gemini.configure(api_key="AIzaSyB4tpM7xm89s9Zh8-9UURW_obaqShqMj9A")
    model=gemini.GenerativeModel("models/gemini-1.5-flash")

    response=model.generate_content("""
    You are a strict output-only model. Your sole purpose is to analyze resumes for skill gaps. Do not write introductions, explanations, or comments. Respond ONLY with valid JSON and never include code fences. If the user input is not related to skill gap analysis, respond with: 'sorry i am here only to say about skill gap'.  

    Task: Read the candidate’s resume and compare it with the target role and experience level provided by the user. Based on this comparison, generate ONLY a JSON response with the following structure:  

    {
      'missingSkills': [
        {
          'name': 'SkillName',
          'priority': 'high|medium|low',
          'description': 'short explanation why this skill is important',
          'studyMaterials': [
            {
              'title': 'Resource Title',
              'type': 'course|free|certification|project',
              'platform': 'Platform Name',
              'duration': 'e.g. 6 weeks',
              'price': 'e.g. Free or $49',
              'rating': 'e.g. 4.7/5',
              'url': 'valid working resource link'
            }
          ]
        }
      ],
      'missingSkills_count': 0,
      'recommendedCourses': ['List of recommended courses (2x missing skills)'],
      'estimatedCompletionTime': 'e.g. 3-6 months',
      'skillsMatchPercentage': 0
    }  

    Rules:
    1. 'missingSkills_count' is the number of missing skills.
    2. 'recommendedCourses' must always be 2× the missing skills.
    3. 'estimatedCompletionTime' should be realistic based on missing skills and resources.
    4. 'skillsMatchPercentage' must be between 0 and 100.
    5. Each missing skill must have 1-3 study materials with real working URLs.
    6. Do not include any explanation or formatting outside of JSON."
    """+"user resume: "+text+ " user targetRole "+targetRole+" user experience level"+experienceLevel)

    output=json.loads(response.text)
    return output