let analysisResults = null;
let dataObj = null
async function analyzeMatch() {
    const jobDescription = document.getElementById('job-description').value.trim();

    if (!jobDescription) {
        showNotification('Please enter a job description', 'error');
        return;
    }

    if (jobDescription.length < 50) {
        showNotification('Please provide a more detailed job description (at least 50 characters)', 'error');
        return;
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = document.getElementById('btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    try {
        analyzeBtn.disabled = true;
        btnText.textContent = 'Analyzing...';
        loadingSpinner.style.display = 'inline-block';
        await displayResults()
    } catch (error) {
        console.log(error)
    } finally {
        analyzeBtn.disabled = false;
        btnText.textContent = '🔍 Analyze Match';
        loadingSpinner.style.display = 'none';
        showNotification('Analysis complete! Your match score is ' + analysisResults.matchScore + '%');
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

async function displayResults() {
    const jobDescription = document.getElementById('job-description').value.trim();
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.add('active');
    const response = await fetch("/api/jdParser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "jobDescription": jobDescription })
    });
    const data = await response.json()
    dataObj = data.aiCompareResume
    const percentage = dataObj.match_percentage;
    analysisResults = dataObj.match_percentage;
    document.getElementById('match-percentage').textContent = percentage + '%';

    const circle = document.getElementById('score-circle-fill');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    const scoreDesc = document.getElementById('score-description');
    if (percentage >= 80) {
        scoreDesc.textContent = "Your resume shows a strong match for this position";
    } else if (percentage >= 50) {
        scoreDesc.textContent = "Your resume matches moderately, improvements needed";
    } else {
        scoreDesc.textContent = "Your resume has a low match, update required";
    }

    const matchedContainer = document.getElementById('matched-keywords');
    const missingContainer = document.getElementById('missing-keywords');
    matchedContainer.innerHTML = '';
    missingContainer.innerHTML = '';

    dataObj.matched_keywords.forEach(k => {
        const span = document.createElement('span');
        span.className = 'tag tag-success';
        span.textContent = k;
        matchedContainer.appendChild(span);

    });

    dataObj.missing_keywords.forEach(k => {
        const span = document.createElement('span');
        span.className = 'tag tag-danger';
        span.textContent = k;
        missingContainer.appendChild(span);
    });

    document.getElementById('matched-progress').style.width =
        `${(dataObj.matched_keywords.length / (dataObj.matched_keywords.length + dataObj.missing_keywords.length)) * 100}%`;
    document.getElementById('missing-progress').style.width =
        `${(dataObj.missing_keywords.length / (dataObj.matched_keywords.length + dataObj.missing_keywords.length)) * 100}%`;

    document.getElementById('matched-count').textContent = dataObj.matched_keywords.length;
    document.getElementById('total-keywords').textContent = dataObj.matched_keywords.length + dataObj.missing_keywords.length;

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    dataObj.skill_analysis.present.forEach(skill => {
        const li = document.createElement('li');
        li.className = `requirement-item requirement-met`;
        li.textContent = skill;
        skillsList.appendChild(li);
    });
    dataObj.skill_analysis.missing.forEach(skill => {
        const li = document.createElement('li');
        li.className = `requirement-item requirement-missing`;
        li.textContent = skill;
        skillsList.appendChild(li);
    });

    const reqList = document.getElementById('requirements-list');
    reqList.innerHTML = '';
    dataObj.requirement_analysis.fulfilled.forEach(req => {
        const li = document.createElement('li');
        li.className = `requirement-item requirement-met`;
        li.textContent = req;
        reqList.appendChild(li);
    });
    dataObj.requirement_analysis.not_fulfilled.forEach(req => {
        const li = document.createElement('li');
        li.className = `requirement-item requirement-missing`;
        li.textContent = req;
        reqList.appendChild(li);
    });

    // Recommendations
    const recContainer = document.getElementById('recommendations-list');
    recContainer.innerHTML = '';
    dataObj.suggested_actions.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recommendation-item';
        div.innerHTML = `
                    <div class="recommendation-priority">${rec.priority} Priority</div>
                    <div>${rec.action}</div>
                    <small style="opacity:0.8;">Impact: ${rec.impact}</small>
                `;
        recContainer.appendChild(div);
    });
}

function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    notif.querySelector('#notification-message').textContent = message;

    notif.classList.remove('error');
    if (type === 'error') notif.classList.add('error');

    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

function improveResume() {
    showNotification('Feature coming soon: Resume optimization suggestions!');
}

function downloadReport() {
if (!dataObj) {
        showNotification('No JD analysis results to generate link!', 'error');
        return;
    }

    const date = new Date().toLocaleDateString();
    const results=dataObj
    const reportContent = `
JOB DESCRIPTION MATCH REPORT
Generated on: ${date}

MATCH PERCENTAGE: ${results.match_percentage}%

-------------------------------------
KEYWORD ANALYSIS
-------------------------------------
Matched Keywords (${results.matched_keywords.length}):
${results.matched_keywords.join(', ')}

Missing Keywords (${results.missing_keywords.length}):
${results.missing_keywords.join(', ')}

-------------------------------------
REQUIREMENT ANALYSIS
-------------------------------------
Fulfilled (${results.requirement_analysis.fulfilled.length}):
${results.requirement_analysis.fulfilled.map((r, i) => `${i+1}. ${r}`).join('\n')}

Not Fulfilled (${results.requirement_analysis.not_fulfilled.length}):
${results.requirement_analysis.not_fulfilled.map((r, i) => `${i+1}. ${r}`).join('\n')}

-------------------------------------
SKILL ANALYSIS
-------------------------------------
Present Skills (${results.skill_analysis.present.length}):
${results.skill_analysis.present.join(', ')}

Missing Skills (${results.skill_analysis.missing.length}):
${results.skill_analysis.missing.join(', ')}

-------------------------------------
SUGGESTED ACTIONS (${results.suggested_actions.length})
-------------------------------------
${results.suggested_actions.map((s, i) => 
    `${i+1}. [${s.priority}] ${s.action}\n   Impact: ${s.impact}`
).join('\n\n')}

-------------------------------------
This report was generated by AI Resume Assistant JD Analyzer.
`;

    // Create Blob & Link
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JDParser_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('JD match report link generated!', 'success');
}