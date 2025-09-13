from flask import Flask,render_template,jsonify, request,session
import os
import templateGenerator,compareResume,resumeRanking,skillGap,resumeGenerator,atsSimulatorGenerator
import json
import pypandoc
import io

with open("config.json") as f:
    config=json.load(f)

app=Flask(__name__)
app.secret_key=config["SECRET_KEY"]

UPLOADED_RESUME_FOLDER='./uploadedResumeFolder'
app.config["UPLOADED_RESUME_FOLDER"]=UPLOADED_RESUME_FOLDER
os.makedirs(UPLOADED_RESUME_FOLDER,exist_ok=True)

@app.route("/")
def homePage():
    return render_template("homePage.html")

@app.route('/resumeInput',methods=["POST","GET"])
def fileInput():
    if request.method=="POST":
        file=request.files["resume"]
        if file:
            file_path = os.path.join(app.config['UPLOADED_RESUME_FOLDER'], file.filename)
            file.save(file_path)
            session['file_path'] = file_path
            return render_template("homePage.html")        
    return render_template("homePage.html")
        

@app.route("/templateGenerator")
def tempGenerator():
    return render_template("templateGenerator.html")

@app.route("/api/templateGeneratorAI",methods=["POST"])
def aiTemplateGenerator():
    userInput=request.get_json()
    aiGeneratedTemplate=templateGenerator.generateTemplate(userInput.get("jobDescription"))
    return jsonify({"result":aiGeneratedTemplate})

@app.route("/resumeGenerator")
def resumeGen():
    return render_template("resumeGenerator.html")

@app.route("/api/resumeGenerator",methods=["POST"])
def aiResumeGenerator():
    userInput=request.get_json()
    userData=userInput.get("resumeData")
    aiResponse=resumeGenerator.aiResumeGenerator(userData)
    return jsonify({"aiResponse":aiResponse})

@app.route('/jdParser')
def jdParser():
    return render_template('JDParser.html')

@app.route('/api/jdParser',methods=["POST"])
def jdParserApi():
    userInput=request.get_json()
    aiCompareResume=compareResume.compareResume(userInput.get("jobDescription"))
    return jsonify({"aiCompareResume":aiCompareResume})


@app.route('/skillGap')
def skillGapPage():
    return render_template('skillGap.html')

@app.route("/api/skillGap",methods=["POST"])
def skillGapApi():
    userData=request.get_json()
    targetRole=userData.get("targetRole")
    experienceLevel=userData.get("experienceLevel")
    skillGapData=skillGap.skillGapOutput(targetRole,experienceLevel)
    return jsonify({"skillGapData":skillGapData})

@app.route('/resumeRankingPredictor')
def resumeRankingPredictor():
    return render_template('resumeRankingPredictor.html')

@app.route('/api/resumeRanking')
def resumeRankingApi():
    rankingdata=resumeRanking.rankResume()
    return jsonify({"rankingdata":rankingdata})

@app.route('/atsSimulator')
def atsSimulator():
    return render_template('atsSimulator.html')

@app.route("/api/atsSimulator",methods=["POST"])
def apiAtsSimulator():
    userData=request.get_json()
    userInput=userData.get("jobDescription")
    atsData=atsSimulatorGenerator.atsScoreGenerator(userInput)
    return jsonify({"atsData":atsData})

@app.route("/wordDownload",methods=["POST"])
def downloadWOrd():
    data=request.get_json()
    print("here")
    pypandoc.convert_text(data.get("htlmCode"),
        "docx",
        format="html",
        outputfile="output.docx",
        extra_args=["--standalone"]
    )
    return jsonify({"result":"true"})
if __name__=='__main__':
    app.run(debug=True)