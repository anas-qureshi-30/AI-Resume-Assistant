// ATS Simulator JavaScript

// Global variables
let currentResumeData = null;
let atsAnalysisResults = null;
let currentResultTab = 'passed';

const sampleJobDescription = `Senior Software Engineer - Full Stack

We are seeking an experienced Senior Software Engineer to join our growing development team. The ideal candidate will have 5+ years of experience building scalable web applications using modern technologies.

Key Requirements:
• 5+ years of professional software development experience
• Strong proficiency in Python, JavaScript, and React
• Experience with cloud platforms (AWS, Azure, or GCP)
• Knowledge of containerization technologies (Docker, Kubernetes)
• Familiarity with agile methodologies and CI/CD pipelines
• Experience with databases (PostgreSQL, MongoDB)
• Strong problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

Preferred Qualifications:
• Experience with microservices architecture
• Knowledge of machine learning frameworks
• DevOps experience with infrastructure as code
• Experience mentoring junior developers
• Open source contributions

Responsibilities:
• Design and develop scalable web applications
• Collaborate with cross-functional teams in agile environment
• Participate in code reviews and technical discussions
• Mentor junior team members
• Ensure code quality and best practices`;

// Initialize ATS Simulator
function initializeATS() {
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Job description input events
    const jobDescTextarea = document.getElementById('job-description');
    if (jobDescTextarea) {
        jobDescTextarea.addEventListener('input', function() {
            const analyzeBtn = document.getElementById('analyze-btn');
            if (this.value.trim().length > 50) {
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('disabled');
            } else {
                analyzeBtn.disabled = true;
                analyzeBtn.classList.add('disabled');
            }
        });
    }
}

// Load sample job description
function loadSampleJD() {
    const jobDescTextarea = document.getElementById('job-description');
    jobDescTextarea.value = sampleJobDescription;
    
    // Trigger input event to enable analyze button if resume is ready
    jobDescTextarea.dispatchEvent(new Event('input'));
    
    showNotification('Sample job description loaded!', 'success');
}

// Main ATS Analysis Function
async function runATSAnalysis() {
    const jobDescription = document.getElementById('job-description').value.trim();
    if (jobDescription.length < 50) {
        showNotification('Please provide a more detailed job description!', 'warning');
        return;
    }
    
    // Show loading state
    setAnalysisLoading(true);
    
    try {
        const respone=await fetch('/api/atsSimulator',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({"jobDescription":jobDescription})
        })
        const data= await respone.json()
        atsAnalysisResults = data.atsData;
        // Display results
        displayATSResults();
    
    } catch (error) {
        console.error('ATS Analysis Error:', error);
        showNotification('Analysis failed. Please try again.', 'error');
    } finally {
        showNotification('ATS analysis completed successfully!', 'success');
        setAnalysisLoading(false);
    }
}

function setAnalysisLoading(isLoading) {
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const spinner = analyzeBtn.querySelector('.btn-spinner'); 
    
    if (isLoading) {
        analyzeBtn.disabled = true;
        btnText.textContent = 'Analyzing...';
        spinner.style.display = 'inline-block';
        analyzeBtn.classList.add('loading-btn');
    } else {
        analyzeBtn.disabled = false;
        btnText.textContent = 'Run ATS Analysis';
        spinner.style.display = 'none';
        analyzeBtn.classList.remove('loading-btn');
    }
}



// Display ATS Results
function displayATSResults() {
    if (!atsAnalysisResults) return;
    
    // Show results sections
    document.getElementById('score-section').style.display = 'block';
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('actions-section').style.display = 'block';
    
    // Update score visualization
    updateScoreVisualization();
    
    // Update tab content
    updateResultsContent();
    
    // Scroll to results
    document.getElementById('score-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Add animation classes
    setTimeout(() => {
        document.getElementById('score-section').classList.add('slide-in-up');
    }, 100);
}

function updateScoreVisualization() {
    const scores = atsAnalysisResults.score;
    
    // Update main score with animation
    animateScore('ats-score', scores.overall);
    
    // Update breakdown scores
    updateBreakdownScore('keywords', scores.keywords);
    updateBreakdownScore('formatting', scores.formatting);
    updateBreakdownScore('structure', scores.structure);
    updateBreakdownScore('content', scores.content);
    
    // Update score circle
    const scoreCircle = document.querySelector('.score-circle');
    const angle = (scores.overall / 100) * 360;
    scoreCircle.style.setProperty('--final-angle', `${angle}deg`);
    scoreCircle.classList.add('animate');
    
    // Update interpretation
    updateScoreInterpretation(scores.overall);
}

function animateScore(elementId, targetScore) {
    const element = document.getElementById(elementId);
    let currentScore = 0;
    const increment = targetScore / 50; // 50 steps for smooth animation
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentScore);
    }, 40);
}

function updateBreakdownScore(category, score) {
    const fillElement = document.getElementById(`${category}-score`);
    const valueElement = document.getElementById(`${category}-value`);
    
    // Animate the progress bar
    setTimeout(() => {
        fillElement.style.width = `${score}%`;
        valueElement.textContent = `${score}%`;
    }, 500);
}

function updateScoreInterpretation(score) {
    const interpretationElement = document.getElementById('score-interpretation');
    let interpretation;
    
    if (score >= 85) {
        interpretation = {
            icon: '🌟',
            title: 'Excellent ATS Compatibility',
            description: 'Your resume should easily pass through ATS systems and reach human recruiters.'
        };
    } else if (score >= 70) {
        interpretation = {
            icon: '🎯',
            title: 'Good ATS Compatibility', 
            description: 'Your resume should pass most ATS systems with minor optimizations.'
        };
    } else if (score >= 50) {
        interpretation = {
            icon: '⚠️',
            title: 'Moderate ATS Risk',
            description: 'Some ATS systems may have difficulty parsing your resume. Optimization recommended.'
        };
    } else {
        interpretation = {
            icon: '🚨',
            title: 'High ATS Risk',
            description: 'Your resume may be filtered out by most ATS systems. Significant changes needed.'
        };
    }
    
    interpretationElement.innerHTML = `
        <span class="interpretation-icon">${interpretation.icon}</span>
        <div class="interpretation-text">
            <strong>${interpretation.title}</strong>
            <p>${interpretation.description}</p>
        </div>
    `;
}

// Update results content in tabs
function updateResultsContent() {
    updatePassedChecks();
    updateIssuesFound();
    updateSuggestions();
    updateKeywordsAnalysis();
    updateTabCounts();
}

function updatePassedChecks() {
    const container = document.getElementById('passed-checks');
    const checks = atsAnalysisResults.passedATSChecks;
    
    container.innerHTML = checks.map(check => `
        <div class="check-item">
            <div class="check-icon">✅</div>
            <div class="check-content">
                <h4>${check.title}</h4>
                <p>${check.description}</p>
            </div>
        </div>
    `).join('');
}

function updateIssuesFound() {
    const container = document.getElementById('issues-list');
    const issues = atsAnalysisResults.issues;
    
    container.innerHTML = issues.map(issue => `
        <div class="issue-item">
            <div class="check-icon">⚠️</div>
            <div class="check-content">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <h4>${issue.title}</h4>
                    <span class="issue-severity severity-${issue.severity}">${issue.severity}</span>
                </div>
                <p><strong>Issue:</strong> ${issue.description}</p>
                <p><strong>Impact:</strong> ${issue.impact}</p>
            </div>
        </div>
    `).join('');
}

function updateSuggestions() {
    const container = document.getElementById('suggestions-list');
    const suggestions = atsAnalysisResults.suggestions;
    
    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <div class="check-icon">💡</div>
            <div class="check-content">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <h4>${suggestion.title}</h4>
                    <span class="suggestion-priority priority-${suggestion.priority}">${suggestion.priority}</span>
                </div>
                <p><strong>Recommendation:</strong> ${suggestion.description}</p>
                <p><strong>Example:</strong></p>
                <pre style="background: #f8f9fa; padding: 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; margin-top: 0.5rem; white-space: pre-wrap;">${suggestion.example}</pre>
            </div>
        </div>
    `).join('');
}

function updateKeywordsAnalysis() {
    const foundContainer = document.getElementById('found-keywords');
    const missingContainer = document.getElementById('missing-keywords');
    
    // Found keywords
    foundContainer.innerHTML = atsAnalysisResults.keywords.found.map(keyword => 
        `<span class="keyword-tag keyword-found">${keyword}</span>`
    ).join('');
    
    // Missing keywords
    missingContainer.innerHTML = atsAnalysisResults.keywords.missing.map(keyword => 
        `<span class="keyword-tag keyword-missing">${keyword}</span>`
    ).join('');
}

function updateTabCounts() {
    document.getElementById('passed-count').textContent = atsAnalysisResults.passedATSChecks.length;
    document.getElementById('issues-count').textContent = atsAnalysisResults.issues.length;
    document.getElementById('suggestions-count').textContent = atsAnalysisResults.suggestions.length;
}

// Tab switching for results
function switchResultTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');
    
    currentResultTab = tabName;
}

// Action functions
function downloadReport() {
    if (!atsAnalysisResults) {
        showNotification('No analysis results to download!', 'error');
        return;
    }
    
    // Generate report content
    const reportContent = generateReportContent();
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATS_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully!', 'success');
}

function generateReportContent() {
    const results = atsAnalysisResults;
    const date = new Date().toLocaleDateString();
    
    return `ATS COMPATIBILITY ANALYSIS REPORT
Generated on: ${date}
OVERALL SCORE: ${results.score.overall}/100

SCORE BREAKDOWN:
- Keywords: ${results.score.keywords}%
- Formatting: ${results.score.formatting}%
- Structure: ${results.score.structure}%
- Content: ${results.score.content}%

PASSED CHECKS (${results.passedATSChecks.length}):
${results.passedATSChecks.map((check, i) => `${i+1}. ${check.title}: ${check.description}`).join('\n')}

ISSUES FOUND (${results.issues.length}):
${results.issues.map((issue, i) => `${i+1}. [${issue.severity.toUpperCase()}] ${issue.title}: ${issue.description}\n   Impact: ${issue.impact}`).join('\n\n')}

OPTIMIZATION SUGGESTIONS (${results.suggestions.length}):
${results.suggestions.map((suggestion, i) => `${i+1}. [${suggestion.priority.toUpperCase()}] ${suggestion.title}: ${suggestion.description}\n   Example: ${suggestion.example.replace(/\n/g, ' ')}`).join('\n\n')}

KEYWORDS ANALYSIS:
Found Keywords (${results.keywords.found.length}): ${results.keywords.found.join(', ')}
Missing Keywords (${results.keywords.missing.length}): ${results.keywords.missing.join(', ')}

---
This report was generated by AI Resume Assistant ATS Simulator.
`;
}

function runNewAnalysis() {
    // Reset results
    atsAnalysisResults = null;
    currentResultTab = 'passed';
    
    // Hide results sections
    document.getElementById('score-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('actions-section').style.display = 'none';
    
    // Clear job description
    document.getElementById('job-description').value = '';
    
    // Scroll to top
    document.querySelector('.ats-setup-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    showNotification('Ready for new analysis!', 'success');
}


// Notification system (reused from homepage)
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');

    messageElement.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeATS();
});