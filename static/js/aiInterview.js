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

// Mock interview questions database
const questionTemplates = {
    technical: [
        "Explain the difference between {tech1} and {tech2} and when you would use each.",
        "How would you optimize a {system_type} for high performance and scalability?",
        "Walk me through your approach to debugging a {issue_type} in production.",
        "Describe how you would implement {feature} using {technology}.",
        "What are the trade-offs between {approach1} and {approach2} for {use_case}?"
    ],
    behavioral: [
        "Tell me about a time when you had to work with a difficult team member.",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "How do you prioritize tasks when working on multiple projects simultaneously?",
        "Give an example of when you had to learn a new technology quickly.",
        "Tell me about a time when you disagreed with a technical decision."
    ],
    roleSpecific: [
        "How would you approach system design for a {system_scale} application?",
        "Describe your experience with {key_technology} and specific challenges you've faced.",
        "How do you ensure code quality and maintainability in {development_context}?",
        "What's your approach to {responsibility} in a team environment?",
        "How do you stay current with {field} trends and best practices?"
    ]
};

// Mock answers database
const answerTemplates = {
    technical: [
        "I would start by analyzing the requirements and constraints. Based on my experience with {technology}, I'd approach this by... [providing specific technical details and examples from past projects]",
        "In my previous role, I faced a similar challenge where... [concrete example with metrics and outcomes]",
        "The key considerations here are performance, scalability, and maintainability. I'd implement... [detailed technical approach]"
    ],
    behavioral: [
        "In my experience at {company}, I encountered a similar situation where... [STAR method: Situation, Task, Action, Result]",
        "I believe in {principle} when dealing with {scenario}. For example, when I... [specific example with positive outcome]",
        "My approach to this type of challenge is... [methodology with real examples and measurable results]"
    ],
    roleSpecific: [
        "Based on my {experience_years} years of experience with {domain}, I would... [specific approach with technical depth]",
        "In my role as {previous_role}, I successfully... [relevant achievement with metrics and impact]",
        "I follow a structured approach: first... then... finally... [step-by-step methodology with examples]"
    ]
};

// Initialize the application
function initializeApp() {
    checkResumeStatus();
    setupEventListeners();
}

function setupEventListeners() {
    const jobDescTextarea = document.getElementById('job-description');
    const generateBtn = document.getElementById('generate-btn');
    
    if (jobDescTextarea) {
        jobDescTextarea.addEventListener('input', function() {
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

function checkResumeStatus() {
    // Mock resume status - in real implementation, check server/localStorage
    const hasResume = Math.random() > 0.2; // 80% chance of having resume
    
    const statusIndicator = document.getElementById('resume-status');
    const resumeInfo = document.getElementById('resume-info');
    
    if (hasResume) {
        statusIndicator.innerHTML = '<span class="status-dot success"></span><span>Resume Ready</span>';
        statusIndicator.className = 'status-indicator success';
        resumeInfo.textContent = 'Using uploaded resume: john_doe_resume.pdf';
    } else {
        statusIndicator.innerHTML = '<span class="status-dot error"></span><span>No Resume Found</span>';
        statusIndicator.className = 'status-indicator error';
        resumeInfo.textContent = 'Please upload a resume first to get personalized questions.';
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
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock report
        currentReport = await generateMockReport(jobDescription);
        
        // Display results
        displayReport();
        
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
window.shareReport = shareReport;

function setGeneratingState(generating) {
    isGenerating = generating;
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loadingSpinner = generateBtn.querySelector('.loading');
    
    if (generating) {
        generateBtn.disabled = true;
        btnText.textContent = 'Generating Report...';
        loadingSpinner.style.display = 'inline-block';
        generateBtn.classList.add('loading');
    } else {
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Report';
        loadingSpinner.style.display = 'none';
        generateBtn.classList.remove('loading');
    }
}

async function generateMockReport(jobDescription) {
    // Extract key information from job description
    const keywords = extractKeywords(jobDescription);
    const role = extractRole(jobDescription);
    const experience = extractExperienceLevel(jobDescription);
    
    // Generate questions based on job description
    const interviewQuestions = generateInterviewQuestions(keywords, role, experience);
    const mockQA = generateMockQA(keywords, role, experience);
    
    return {
        role: role,
        experience: experience,
        keywords: keywords,
        interviewQuestions: interviewQuestions,
        mockQA: mockQA,
        generatedAt: new Date()
    };
}

function extractKeywords(jobDescription) {
    const commonTechKeywords = [
        'python', 'javascript', 'react', 'aws', 'docker', 'kubernetes',
        'postgresql', 'mongodb', 'microservices', 'agile', 'ci/cd',
        'node.js', 'angular', 'vue.js', 'machine learning', 'devops',
        'system design', 'rest api', 'graphql', 'redis', 'elasticsearch'
    ];
    
    const jobDescLower = jobDescription.toLowerCase();
    return commonTechKeywords.filter(keyword => 
        jobDescLower.includes(keyword)
    );
}

function extractRole(jobDescription) {
    const roles = {
        'senior software engineer': /senior.*software.*engineer/i,
        'full stack developer': /full.*stack.*developer/i,
        'backend developer': /backend.*developer/i,
        'frontend developer': /frontend.*developer/i,
        'data scientist': /data.*scientist/i,
        'devops engineer': /devops.*engineer/i,
        'software engineer': /software.*engineer/i
    };
    
    for (const [role, pattern] of Object.entries(roles)) {
        if (pattern.test(jobDescription)) {
            return role;
        }
    }
    
    return 'software engineer';
}

function extractExperienceLevel(jobDescription) {
    const jobDescLower = jobDescription.toLowerCase();
    if (jobDescLower.includes('senior') || jobDescLower.includes('5+ years')) {
        return 'senior';
    } else if (jobDescLower.includes('junior') || jobDescLower.includes('entry')) {
        return 'junior';
    }
    return 'mid-level';
}

function generateInterviewQuestions(keywords, role, experience) {
    const questions = [];
    
    // Technical questions
    const techQuestions = generateTechnicalQuestions(keywords, role);
    questions.push(...techQuestions.slice(0, 4));
    
    // Behavioral questions
    const behavioralQuestions = generateBehavioralQuestions(experience);
    questions.push(...behavioralQuestions.slice(0, 3));
    
    // Role-specific questions
    const roleQuestions = generateRoleSpecificQuestions(keywords, role);
    questions.push(...roleQuestions.slice(0, 3));
    
    return questions;
}

function generateTechnicalQuestions(keywords, role) {
    const questions = [];
    const templates = questionTemplates.technical;
    
    templates.forEach((template, index) => {
        if (index < 4) {
            let question = template;
            
            // Replace placeholders with relevant terms
            question = question.replace('{tech1}', keywords[0] || 'React');
            question = question.replace('{tech2}', keywords[1] || 'Angular');
            question = question.replace('{technology}', keywords[Math.floor(Math.random() * keywords.length)] || 'JavaScript');
            question = question.replace('{system_type}', getSystemType(role));
            question = question.replace('{issue_type}', getIssueType());
            question = question.replace('{feature}', getFeatureType());
            question = question.replace('{approach1}', 'REST API');
            question = question.replace('{approach2}', 'GraphQL');
            question = question.replace('{use_case}', 'data fetching');
            
            questions.push({
                category: 'Technical',
                text: question,
                difficulty: getDifficulty(index)
            });
        }
    });
    
    return questions;
}

function generateBehavioralQuestions(experience) {
    const questions = [];
    const templates = questionTemplates.behavioral;
    
    templates.forEach((template, index) => {
        if (index < 3) {
            questions.push({
                category: 'Behavioral',
                text: template,
                difficulty: 'Medium'
            });
        }
    });
    
    return questions;
}

function generateRoleSpecificQuestions(keywords, role) {
    const questions = [];
    const templates = questionTemplates.roleSpecific;
    
    templates.forEach((template, index) => {
        if (index < 3) {
            let question = template;
            
            // Replace placeholders
            question = question.replace('{key_technology}', keywords[0] || 'JavaScript');
            question = question.replace('{system_scale}', getSystemScale(role));
            question = question.replace('{development_context}', 'agile teams');
            question = question.replace('{responsibility}', getResponsibility(role));
            question = question.replace('{field}', getTechField(role));
            
            questions.push({
                category: 'Role-Specific',
                text: question,
                difficulty: getDifficulty(index)
            });
        }
    });
    
    return questions;
}

function generateMockQA(keywords, role, experience) {
    const qaSet = [];
    
    // Generate 5 Q&A pairs
    for (let i = 0; i < 5; i++) {
        const questionType = ['technical', 'behavioral', 'roleSpecific'][i % 3];
        const question = generateSingleQuestion(questionType, keywords, role, experience);
        const answer = generateSingleAnswer(questionType, keywords, role, experience);
        
        qaSet.push({
            question: question,
            answer: answer,
            type: questionType
        });
    }
    
    return qaSet;
}

function generateSingleQuestion(type, keywords, role, experience) {
    const templates = questionTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let question = template;
    
    // Replace placeholders based on context
    if (type === 'technical') {
        question = question.replace('{tech1}', keywords[0] || 'React');
        question = question.replace('{tech2}', keywords[1] || 'Vue.js');
        question = question.replace('{technology}', keywords[Math.floor(Math.random() * keywords.length)] || 'Node.js');
        question = question.replace('{system_type}', getSystemType(role));
        question = question.replace('{issue_type}', getIssueType());
        question = question.replace('{feature}', getFeatureType());
    } else if (type === 'roleSpecific') {
        question = question.replace('{key_technology}', keywords[0] || 'JavaScript');
        question = question.replace('{system_scale}', getSystemScale(role));
        question = question.replace('{development_context}', 'large-scale applications');
        question = question.replace('{responsibility}', getResponsibility(role));
        question = question.replace('{field}', getTechField(role));
    }
    
    return question;
}

function generateSingleAnswer(type, keywords, role, experience) {
    const templates = answerTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let answer = template;
    
    // Replace placeholders with contextual information
    answer = answer.replace('{technology}', keywords[0] || 'JavaScript');
    answer = answer.replace('{company}', 'TechCorp');
    answer = answer.replace('{experience_years}', experience === 'senior' ? '7' : experience === 'junior' ? '2' : '4');
    answer = answer.replace('{previous_role}', role);
    answer = answer.replace('{domain}', getTechField(role));
    answer = answer.replace('{principle}', 'clear communication and collaboration');
    answer = answer.replace('{scenario}', 'challenging technical problems');
    
    return answer;
}

// Helper functions
function getSystemType(role) {
    const types = {
        'senior software engineer': 'distributed system',
        'full stack developer': 'web application',
        'backend developer': 'API service',
        'frontend developer': 'user interface',
        'data scientist': 'data pipeline',
        'devops engineer': 'deployment pipeline'
    };
    return types[role] || 'web application';
}

function getSystemScale(role) {
    return role.includes('senior') ? 'large-scale distributed' : 'medium-scale';
}

function getIssueType() {
    const issues = ['performance bottleneck', 'memory leak', 'race condition', 'scaling issue'];
    return issues[Math.floor(Math.random() * issues.length)];
}

function getFeatureType() {
    const features = ['authentication system', 'real-time messaging', 'search functionality', 'payment processing'];
    return features[Math.floor(Math.random() * features.length)];
}

function getResponsibility(role) {
    const responsibilities = {
        'senior software engineer': 'architectural decisions',
        'full stack developer': 'end-to-end development',
        'backend developer': 'API design',
        'frontend developer': 'user experience optimization',
        'data scientist': 'model deployment',
        'devops engineer': 'infrastructure management'
    };
    return responsibilities[role] || 'code quality';
}

function getTechField(role) {
    const fields = {
        'senior software engineer': 'software engineering',
        'full stack developer': 'full-stack development',
        'backend developer': 'backend technologies',
        'frontend developer': 'frontend frameworks',
        'data scientist': 'machine learning',
        'devops engineer': 'infrastructure and deployment'
    };
    return fields[role] || 'software development';
}

function getDifficulty(index) {
    const difficulties = ['Medium', 'Hard', 'Medium', 'Hard', 'Very Hard'];
    return difficulties[index % difficulties.length];
}

function displayReport() {
    if (!currentReport) return;
    
    // Show results section with animation
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    setTimeout(() => {
        resultsSection.classList.add('show');
    }, 100);
    
    // Display interview questions
    displayInterviewQuestions();
    
    // Display mock Q&A
    displayMockQA();
    
    // Update counters
    updateCounters();
    
    // Scroll to results
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function displayInterviewQuestions() {
    const container = document.getElementById('questions-container');
    const questions = currentReport.interviewQuestions;
    
    container.innerHTML = questions.map(question => `
        <div class="question-item slide-in-up">
            <div class="question-category">${question.category}</div>
            <div class="question-text">${question.text}</div>
            <div class="question-difficulty">Difficulty: ${question.difficulty}</div>
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
    const qaSet = currentReport.mockQA;
    
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
        `${currentReport.mockQA.length} practice sets`;
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
Role: ${report.role}
Experience Level: ${report.experience}

KEY TECHNOLOGIES:
${report.keywords.join(', ')}

LIKELY INTERVIEW QUESTIONS (${report.interviewQuestions.length}):
${report.interviewQuestions.map((q, i) => 
    `${i+1}. [${q.category}] ${q.text} (${q.difficulty})`
).join('\n')}

MOCK INTERVIEW Q&A (${report.mockQA.length}):
${report.mockQA.map((qa, i) => 
    `${i+1}. Q: ${qa.question}\n   A: ${qa.answer}\n`
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

function shareReport() {
    if (!currentReport) {
        showNotification('No report available to share!', 'error');
        return;
    }
    
    const shareText = `I just generated my AI Interview Readiness Report! 🎯\n\n${currentReport.interviewQuestions.length} personalized questions for ${currentReport.role} role.\n\nGenerated with AI Resume Assistant`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Interview Readiness Report',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Report summary copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to share report', 'error');
        });
    }
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
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});