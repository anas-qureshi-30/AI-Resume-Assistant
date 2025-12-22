from flask import Flask, render_template, jsonify, request, session
import os

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

# SECRET KEY (set in Vercel → Environment Variables)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

# Vercel-safe temp folder
UPLOAD_FOLDER = "/tmp"
app.config["UPLOADED_RESUME_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def homePage():
    return render_template("homePage.html")


@app.route("/resumeInput", methods=["GET", "POST"])
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
    import aiJDResumeGenerator
    data = request.get_json()
    result = aiJDResumeGenerator.aiJDResumeGen(data.get("userInput"))
    return jsonify({"result": result})


@app.route("/templateGenerator")
def templateGeneratorPage():
    return render_template("templateGenerator.html")


@app.route("/api/templateGeneratorAI", methods=["POST"])
def aiTemplateGenerator():
    import templateGenerator
    data = request.get_json()
    result = templateGenerator.generateTemplate(
        data.get("jobDescription")
    )
    return jsonify({"result": result})


@app.route("/resumeGenerator")
def resumeGeneratorPage():
    return render_template("resumeGenerator.html")


@app.route("/api/resumeGenerator", methods=["POST"])
def aiResumeGenerator():
    import resumeGenerator
    data = request.get_json()
    result = resumeGenerator.aiResumeGenerator(
        data.get("resumeData")
    )
    return jsonify({"aiResponse": result})


@app.route("/jdParser")
def jdParser():
    if "file_path" in session:
        return render_template("JDParser.html")
    return render_template("homePage.html", alertMsg="Please upload resume first")


@app.route("/api/jdParser", methods=["POST"])
def jdParserApi():
    import compareResume
    data = request.get_json()
    result = compareResume.compareResume(
        data.get("jobDescription")
    )
    return jsonify({"aiCompareResume": result})


@app.route("/skillGap")
def skillGapPage():
    if "file_path" in session:
        return render_template("skillGap.html")
    return render_template("homePage.html", alertMsg="Please upload resume first")


@app.route("/api/skillGap", methods=["POST"])
def skillGapApi():
    import skillGap
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
    return render_template("homePage.html", alertMsg="Please upload resume first")


@app.route("/api/resumeRanking")
def resumeRankingApi():
    import resumeRanking
    result = resumeRanking.rankResume()
    return jsonify({"rankingdata": result})


@app.route("/atsSimulator")
def atsSimulator():
    if "file_path" in session:
        return render_template("atsSimulator.html")
    return render_template("homePage.html", alertMsg="Please upload resume first")


@app.route("/api/atsSimulator", methods=["POST"])
def atsSimulatorApi():
    import atsSimulatorGenerator
    data = request.get_json()
    result = atsSimulatorGenerator.atsScoreGenerator(
        data.get("jobDescription")
    )
    return jsonify({"atsData": result})


@app.route("/aiInterview")
def aiInterview():
    if "file_path" in session:
        return render_template("aiInterview.html")
    return render_template("homePage.html", alertMsg="Please upload resume first")


@app.route("/api/aiQuestion", methods=["POST"])
def aiQuestionApi():
    import aiQuestion
    data = request.get_json()
    result = aiQuestion.aiQuestionGenerator(
        data.get("jobDescription")
    )
    return jsonify({"result": result})
