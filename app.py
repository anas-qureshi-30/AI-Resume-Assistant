from flask import Flask, render_template, jsonify, request, session
import os
import json

import templateGenerator
import compareResume
import resumeRanking
import skillGap
import resumeGenerator
import atsSimulatorGenerator
import aiQuestion
import aiJDResumeGenerator

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

# ✅ SECRET KEY (SAFE)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

# ✅ Vercel-safe temp folder
UPLOAD_FOLDER = "/tmp"
app.config["UPLOADED_RESUME_FOLDER"] = UPLOAD_FOLDER

@app.route("/")
def homePage():
    return render_template("homePage.html")

@app.route("/resumeInput", methods=["POST", "GET"])
def fileInput():
    if request.method == "POST":
        file = request.files.get("resume")
        if file:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            session["file_path"] = file_path
    return render_template("homePage.html")

@app.route("/resumeGeneratorJD")
def resumeGeneratorJDPage():
    return render_template("resumeGeneratorJD.html")

@app.route("/api/resumeGeneratorJD", methods=["POST"])
def aiResumeJDGen():
    data = request.get_json()
    aiResponse = aiJDResumeGenerator.aiJDResumeGen(data.get("userInput"))
    return jsonify({"result": aiResponse})

@app.route("/templateGenerator")
def tempGenerator():
    return render_template("templateGenerator.html")

@app.route("/api/templateGeneratorAI", methods=["POST"])
def aiTemplateGenerator():
    userInput = request.get_json()
    aiGeneratedTemplate = templateGenerator.generateTemplate(
        userInput.get("jobDescription")
    )
    return jsonify({"result": aiGeneratedTemplate})

@app.route("/resumeGenerator")
def resumeGen():
    return render_template("resumeGenerator.html")

@app.route("/api/resumeGenerator", methods=["POST"])
def aiResumeGenerator():
    userInput = request.get_json()
    aiResponse = resumeGenerator.aiResumeGenerator(
        userInput.get("resumeData")
    )
    return jsonify({"aiResponse": aiResponse})

@app.route("/jdParser")
def jdParser():
    if "file_path" in session:
        return render_template("JDParser.html")
    return render_template("homePage.html", alertMsg="Please Upload a Resume First.")

@app.route("/api/jdParser", methods=["POST"])
def jdParserApi():
    userInput = request.get_json()
    result = compareResume.compareResume(
        userInput.get("jobDescription")
    )
    return jsonify({"aiCompareResume": result})

@app.route("/skillGap")
def skillGapPage():
    if "file_path" in session:
        return render_template("skillGap.html")
    return render_template("homePage.html", alertMsg="Please Upload a Resume First.")

@app.route("/api/skillGap", methods=["POST"])
def skillGapApi():
    data = request.get_json()
    result = skillGap.skillGapOutput(
        data.get("targetRole"),
        data.get("experienceLevel")
    )
    return jsonify({"skillGapData": result})

@app.route("/resumeRankingPredictor")
def resumeRankingPredictor():
    if "file_path" in session:
        return render_template("resumeRankingPredictor.html")
    return render_template("homePage.html", alertMsg="Please Upload a Resume First.")

@app.route("/api/resumeRanking")
def resumeRankingApi():
    rankingdata = resumeRanking.rankResume()
    return jsonify({"rankingdata": rankingdata})

@app.route("/atsSimulator")
def atsSimulator():
    if "file_path" in session:
        return render_template("atsSimulator.html")
    return render_template("homePage.html", alertMsg="Please Upload a Resume First.")

@app.route("/api/atsSimulator", methods=["POST"])
def apiAtsSimulator():
    userData = request.get_json()
    atsData = atsSimulatorGenerator.atsScoreGenerator(
        userData.get("jobDescription")
    )
    return jsonify({"atsData": atsData})

@app.route("/aiInterview")
def aiInterview():
    if "file_path" in session:
        return render_template("aiInterview.html")
    return render_template("homePage.html", alertMsg="Please Upload a Resume First.")

@app.route("/api/aiQuestion", methods=["POST"])
def aiGenQuestion():
    data = request.get_json()
    result = aiQuestion.aiQuestionGenerator(
        data.get("jobDescription")
    )
    return jsonify({"result": result})
