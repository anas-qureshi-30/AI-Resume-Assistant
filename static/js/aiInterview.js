// AI Interview Readiness Report JavaScript

// Global variables
let currentReport = null;
let isGenerating = false;

// Sample job description for demo purposes
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

// Initialize the application
function initializeApp() {
    setupEventListeners();
}

function setupEventListeners() {
    const jobDescTextarea = document.getElementById('job-description');
    const generateBtn = document.getElementById('generate-btn');

    if (jobDescTextarea) {
        jobDescTextarea.addEventListener('input', function () {
            if (this.value.trim().length > 100 && !isGenerating) {
                generateBtn.disabled = false;
                generateBtn.classList.remove('disabled');
            } else if (!isGenerating) {
                generateBtn.disabled = true;
                generateBtn.classList.add('disabled');
            }
        });
    }
}


function loadSampleJD() {
    const jobDescTextarea = document.getElementById('job-description');
    jobDescTextarea.value = sampleJobDescription;

    // Trigger input event to enable generate button
    jobDescTextarea.dispatchEvent(new Event('input'));

    showNotification('Sample job description loaded!', 'success');
}

async function generateReport() {
    if (isGenerating) return;

    const jobDescription = document.getElementById('job-description').value.trim();
    if (jobDescription.length < 50) {
        showNotification('Please provide a more detailed job description (minimum 50 characters)', 'warning');
        return;
    }

    // Set loading state
    setGeneratingState(true);
    try {
        const response = await fetch("/api/aiQuestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "jobDescription": jobDescription })
        })
        const data = await response.json()
        currentReport = data.result;
        updateCounters()
        displayInterviewQuestions()
        displayMockQA()
        const resultsSection = document.getElementById('results-section');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('show');
        showNotification('Interview readiness report generated successfully!', 'success');

    } catch (error) {
        console.error('Report generation error:', error);
        showNotification('Failed to generate report. Please try again.', 'error');
    } finally {
        setGeneratingState(false);
    }
}

// Add window-level function for onclick handler
window.generateReport = generateReport;
window.loadSampleJD = loadSampleJD;
window.downloadReport = downloadReport;
window.generateNewReport = generateNewReport;

function setGeneratingState(generating) {
    isGenerating = generating;
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loadingSpinner = generateBtn.querySelector('.btn-spinner');

    if (generating) {
        generateBtn.disabled = true;
        btnText.textContent = 'Generating Report...';
        loadingSpinner.style.display = 'inline-block';
        generateBtn.classList.add('loading-btn');
    } else {
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Report';
        loadingSpinner.style.display = 'none';
        generateBtn.classList.remove('loading-btn');
    }
}
function displayInterviewQuestions() {
    const container = document.getElementById('questions-container');
    const questions = currentReport.interviewQuestions;
    container.innerHTML = questions.map(q => `
        <div class="question-item slide-in-up">
            <div class="question-category">${q.category}</div>
            <div class="question-text">${q.question}</div>
            <div class="question-difficulty">Difficulty: ${q.difficulty}</div>
        </div>
    `).join('');
    // Add staggered animation
    const questionItems = container.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-in-up');
        }, index * 100);
    });
}

function displayMockQA() {
    const container = document.getElementById('mock-interview-container');
    const qaSet = currentReport.mockInterview;

    container.innerHTML = qaSet.map(qa => `
        <div class="qa-item slide-in-up">
            <div class="qa-question">
                <strong>Q:</strong> ${qa.question}
            </div>
            <div class="qa-answer">
                <h4>Suggested Answer</h4>
                <p>${qa.answer}</p>
            </div>
        </div>
    `).join('');

    // Add staggered animation
    const qaItems = container.querySelectorAll('.qa-item');
    qaItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-in-up');
        }, index * 150);
    });
}

function updateCounters() {
    document.getElementById('question-count').textContent =
        `${currentReport.interviewQuestions.length} questions`;
    document.getElementById('qa-count').textContent =
        `${currentReport.mockInterview.length} practice sets`;
}

function downloadReport() {
    if (!currentReport) {
        showNotification('No report available to download!', 'error');
        return;
    }

    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_Readiness_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Report downloaded successfully!', 'success');
}

function generateReportContent() {
    const report = currentReport;
    const date = new Date().toLocaleDateString();

    return `AI INTERVIEW READINESS REPORT
Generated on: ${date}

LIKELY INTERVIEW QUESTIONS (${report.interviewQuestions.length}):
${report.interviewQuestions.map((q, i) =>
        `${i + 1}. [${q.category}] ${q.question} (${q.difficulty})`
    ).join('\n')}

MOCK INTERVIEW Q&A (${report.mockInterview.length}):
${report.mockInterview.map((qa, i) =>
        `${i + 1}. Q: ${qa.question}\n   A: ${qa.answer}\n`
    ).join('\n')}

---
This report was generated by AI Resume Assistant Interview Prep Tool.
Use these questions to practice and prepare for your upcoming interviews.
`;
}

function generateNewReport() {
    // Reset current report
    currentReport = null;

    // Hide results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('show');

    setTimeout(() => {
        resultsSection.style.display = 'none';
    }, 300);

    // Clear job description
    document.getElementById('job-description').value = '';

    // Scroll to top
    document.querySelector('.input-section').scrollIntoView({
        behavior: 'smooth'
    });

    showNotification('Ready for new report generation!', 'success');
}


function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');

    messageElement.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});
