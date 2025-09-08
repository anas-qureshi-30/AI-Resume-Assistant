from flask import Flask,render_template,jsonify, request,session
import os
import templateGenerator,compareResume,resumeRanking,skillGap
app=Flask(__name__)

@app.route("/")
def homePage():
    return render_template("homePage.html")

@app.route("/generator")
def generator():
    return render_template("templateGenerator.html")

@app.route("/api/templateGeneratorAI",methods=["POST"])
def aiTemplateGenerator():
    userInput=request.get_json()
    aiGeneratedTemplate=templateGenerator.generateTemplate(userInput.get("jobDescription"))
    return jsonify({"result":aiGeneratedTemplate})

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

if __name__=='__main__':
    app.run(debug=True)