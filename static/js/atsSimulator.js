// ATS Simulator JavaScript

// Global variables
let currentResumeData = null;
let atsAnalysisResults = null;
let currentResultTab = 'passed';

// Mock data for demonstration
const mockATSData = {
    scores: {
        overall: 78,
        keywords: 65,
        formatting: 90,
        structure: 85,
        content: 72
    },
    passedChecks: [
        {
            title: "Standard Section Headers",
            description: "Resume uses recognized section titles like 'Experience', 'Education', 'Skills'"
        },
        {
            title: "Clean File Format", 
            description: "PDF format is ATS-friendly and maintains formatting across systems"
        },
        {
            title: "Consistent Date Formatting",
            description: "All dates follow MM/YYYY format throughout the resume"
        },
        {
            title: "Contact Information Present",
            description: "Email, phone number, and location are clearly visible"
        },
        {
            title: "No Tables or Text Boxes",
            description: "Content is in simple text format, avoiding complex layouts"
        },
        {
            title: "Standard Font Usage",
            description: "Uses ATS-friendly fonts like Arial, Calibri, or Times New Roman"
        }
    ],
    issues: [
        {
            severity: "high",
            title: "Missing Action Verbs",
            description: "Many bullet points don't start with strong action verbs that ATS systems look for",
            impact: "Reduces keyword matching and impact scoring"
        },
        {
            severity: "medium", 
            title: "Inconsistent Bullet Points",
            description: "Mix of different bullet point styles may confuse parsing algorithms",
            impact: "Could cause section content to be misinterpreted"
        },
        {
            severity: "high",
            title: "Lack of Quantified Achievements",
            description: "Most accomplishments lack specific numbers, percentages, or metrics",
            impact: "ATS systems and recruiters look for measurable results"
        },
        {
            severity: "medium",
            title: "Skills Section Format",
            description: "Skills are grouped in categories rather than listed individually",
            impact: "May reduce individual keyword matching scores"
        }
    ],
    suggestions: [
        {
            priority: "high",
            title: "Add Quantified Metrics",
            description: "Include specific numbers: 'Increased sales by 25%' instead of 'Improved sales performance'",
            example: "Instead of: 'Managed team projects'\nTry: 'Managed 5 cross-functional team projects, delivering 100% on time'"
        },
        {
            priority: "high",
            title: "Use Job-Specific Keywords",
            description: "Incorporate exact keywords from the job description naturally throughout your resume",
            example: "If JD mentions 'agile methodologies', use this exact phrase instead of 'agile practices'"
        },
        {
            priority: "medium",
            title: "Standardize Bullet Points", 
            description: "Use consistent bullet point symbols (•) and formatting throughout all sections",
            example: "Replace dashes, arrows, or mixed symbols with standard round bullets"
        },
        {
            priority: "medium",
            title: "Expand Skills Section",
            description: "List technical skills individually rather than grouping them",
            example: "Instead of: 'Languages: Python, Java, JavaScript'\nTry: Individual lines for Python, Java, JavaScript"
        },
        {
            priority: "low",
            title: "Add Certifications Section",
            description: "Create a dedicated section for relevant certifications and licenses",
            example: "Include certification names, issuing organizations, and dates"
        }
    ]
};

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
    // Check if we have resume data from localStorage or session
    checkResumeStatus();
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Job description input events
    const jobDescTextarea = document.getElementById('job-description');
    if (jobDescTextarea) {
        jobDescTextarea.addEventListener('input', function() {
            const analyzeBtn = document.getElementById('analyze-btn');
            if (this.value.trim().length > 50 && hasResumeData()) {
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('disabled');
            } else {
                analyzeBtn.disabled = true;
                analyzeBtn.classList.add('disabled');
            }
        });
    }
}

// Check resume status
function checkResumeStatus() {
    // Mock check for uploaded resume - in real implementation, this would check server/localStorage
    const mockResumeUploaded = Math.random() > 0.3; // 70% chance of having resume
    
    const statusIndicator = document.getElementById('resume-status');
    const resumeInfo = document.getElementById('resume-info');
    
    if (mockResumeUploaded) {
        // Simulate having an uploaded resume
        currentResumeData = {
            filename: 'john_doe_resume.pdf',
            uploadDate: new Date(),
            content: 'Mock resume content for ATS analysis'
        };
        
        statusIndicator.innerHTML = '<span class="status-dot success"></span><span>Resume Ready</span>';
        statusIndicator.className = 'status-indicator success';
        resumeInfo.textContent = `Resume: ${currentResumeData.filename} (uploaded ${formatDate(currentResumeData.uploadDate)})`;
    } else {
        statusIndicator.innerHTML = '<span class="status-dot error"></span><span>No resume uploaded</span>';
        statusIndicator.className = 'status-indicator error';
        resumeInfo.textContent = 'Please upload a resume on the homepage first.';
    }
}

function hasResumeData() {
    return currentResumeData !== null;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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
    if (!hasResumeData()) {
        showNotification('Please upload a resume first!', 'error');
        return;
    }
    
    const jobDescription = document.getElementById('job-description').value.trim();
    if (jobDescription.length < 50) {
        showNotification('Please provide a more detailed job description!', 'warning');
        return;
    }
    
    // Show loading state
    setAnalysisLoading(true);
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate mock results based on job description
        atsAnalysisResults = await generateATSResults(jobDescription);
        
        // Display results
        displayATSResults();
        
        showNotification('ATS analysis completed successfully!', 'success');
        
    } catch (error) {
        console.error('ATS Analysis Error:', error);
        showNotification('Analysis failed. Please try again.', 'error');
    } finally {
        setAnalysisLoading(false);
    }
}

function setAnalysisLoading(isLoading) {
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const loadingSpinner = analyzeBtn.querySelector('.loading');
    
    if (isLoading) {
        analyzeBtn.disabled = true;
        btnText.textContent = 'Analyzing...';
        loadingSpinner.style.display = 'inline-block';
        analyzeBtn.classList.add('loading');
    } else {
        analyzeBtn.disabled = false;
        btnText.textContent = 'Run ATS Analysis';
        loadingSpinner.style.display = 'none';
        analyzeBtn.classList.remove('loading');
    }
}

// Generate ATS results based on job description
async function generateATSResults(jobDescription) {
    // Extract keywords from job description
    const extractedKeywords = extractKeywordsFromJD(jobDescription);
    
    // Create dynamic results based on the job description
    const results = {
        ...mockATSData,
        jobDescription: jobDescription,
        extractedKeywords: extractedKeywords,
        foundKeywords: generateFoundKeywords(extractedKeywords),
        missingKeywords: generateMissingKeywords(extractedKeywords)
    };
    
    // Adjust scores based on keyword matching
    const keywordMatchRatio = results.foundKeywords.length / extractedKeywords.length;
    results.scores.keywords = Math.round(keywordMatchRatio * 100);
    results.scores.overall = Math.round(
        (results.scores.keywords * 0.4 + 
         results.scores.formatting * 0.2 + 
         results.scores.structure * 0.2 + 
         results.scores.content * 0.2)
    );
    
    return results;
}

function extractKeywordsFromJD(jobDescription) {
    // Simple keyword extraction - in real implementation, this would be more sophisticated
    const commonTechKeywords = [
        'python', 'javascript', 'react', 'aws', 'docker', 'kubernetes', 
        'postgresql', 'mongodb', 'agile', 'ci/cd', 'microservices',
        'machine learning', 'devops', 'git', 'rest api', 'sql',
        'node.js', 'angular', 'vue.js', 'azure', 'gcp', 'jenkins'
    ];
    
    const jobDescLower = jobDescription.toLowerCase();
    const foundKeywords = commonTechKeywords.filter(keyword => 
        jobDescLower.includes(keyword)
    );
    
    // Add some job-specific keywords based on content
    if (jobDescLower.includes('senior') || jobDescLower.includes('lead')) {
        foundKeywords.push('leadership', 'mentoring');
    }
    if (jobDescLower.includes('full stack') || jobDescLower.includes('fullstack')) {
        foundKeywords.push('full-stack development');
    }
    
    return foundKeywords;
}

function generateFoundKeywords(allKeywords) {
    // Simulate that we found 60-80% of keywords
    const foundRatio = 0.6 + Math.random() * 0.2;
    const foundCount = Math.floor(allKeywords.length * foundRatio);
    
    return allKeywords.slice(0, foundCount);
}

function generateMissingKeywords(allKeywords) {
    const foundKeywords = generateFoundKeywords(allKeywords);
    return allKeywords.filter(keyword => !foundKeywords.includes(keyword));
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
    const scores = atsAnalysisResults.scores;
    
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
    const checks = atsAnalysisResults.passedChecks;
    
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
    foundContainer.innerHTML = atsAnalysisResults.foundKeywords.map(keyword => 
        `<span class="keyword-tag keyword-found">${keyword}</span>`
    ).join('');
    
    // Missing keywords
    missingContainer.innerHTML = atsAnalysisResults.missingKeywords.map(keyword => 
        `<span class="keyword-tag keyword-missing">${keyword}</span>`
    ).join('');
}

function updateTabCounts() {
    document.getElementById('passed-count').textContent = atsAnalysisResults.passedChecks.length;
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
Resume: ${currentResumeData.filename}

OVERALL SCORE: ${results.scores.overall}/100

SCORE BREAKDOWN:
- Keywords: ${results.scores.keywords}%
- Formatting: ${results.scores.formatting}%
- Structure: ${results.scores.structure}%
- Content: ${results.scores.content}%

PASSED CHECKS (${results.passedChecks.length}):
${results.passedChecks.map((check, i) => `${i+1}. ${check.title}: ${check.description}`).join('\n')}

ISSUES FOUND (${results.issues.length}):
${results.issues.map((issue, i) => `${i+1}. [${issue.severity.toUpperCase()}] ${issue.title}: ${issue.description}\n   Impact: ${issue.impact}`).join('\n\n')}

OPTIMIZATION SUGGESTIONS (${results.suggestions.length}):
${results.suggestions.map((suggestion, i) => `${i+1}. [${suggestion.priority.toUpperCase()}] ${suggestion.title}: ${suggestion.description}\n   Example: ${suggestion.example.replace(/\n/g, ' ')}`).join('\n\n')}

KEYWORDS ANALYSIS:
Found Keywords (${results.foundKeywords.length}): ${results.foundKeywords.join(', ')}
Missing Keywords (${results.missingKeywords.length}): ${results.missingKeywords.join(', ')}

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

function shareResults() {
    if (!atsAnalysisResults) {
        showNotification('No results to share!', 'error');
        return;
    }
    
    const shareText = `My resume scored ${atsAnalysisResults.scores.overall}/100 on ATS compatibility! 🎯\n\nAnalyzed with AI Resume Assistant ATS Simulator`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My ATS Analysis Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Results copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to share results', 'error');
        });
    }
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