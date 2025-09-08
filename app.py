from flask import Flask,render_template,jsonify, request,session
import os
import templateGenerator,compareResume
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
if __name__=='__main__':
    app.run(debug=True)