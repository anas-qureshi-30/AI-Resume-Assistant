// Resume Ranking Predictor JavaScript

let resumeData = null;
let analysisResults = null;
let chartInstance = null;

// Job roles data
const jobRolesData = {
    software: [
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'fullstack', label: 'Full Stack Developer' },
        { value: 'mobile', label: 'Mobile Developer' },
        { value: 'devops', label: 'DevOps Engineer' },
        { value: 'sre', label: 'Site Reliability Engineer' }
    ],
    data: [
        { value: 'data-scientist', label: 'Data Scientist' },
        { value: 'data-analyst', label: 'Data Analyst' },
        { value: 'ml-engineer', label: 'ML Engineer' },
        { value: 'data-engineer', label: 'Data Engineer' },
        { value: 'research-scientist', label: 'Research Scientist' }
    ],
    product: [
        { value: 'product-manager', label: 'Product Manager' },
        { value: 'senior-pm', label: 'Senior Product Manager' },
        { value: 'product-owner', label: 'Product Owner' },
        { value: 'growth-pm', label: 'Growth Product Manager' }
    ],
    design: [
        { value: 'ux-designer', label: 'UX Designer' },
        { value: 'ui-designer', label: 'UI Designer' },
        { value: 'product-designer', label: 'Product Designer' },
        { value: 'visual-designer', label: 'Visual Designer' }
    ],
    marketing: [
        { value: 'digital-marketing', label: 'Digital Marketing Manager' },
        { value: 'content-marketing', label: 'Content Marketing Manager' },
        { value: 'growth-marketing', label: 'Growth Marketing Manager' },
        { value: 'performance-marketing', label: 'Performance Marketing Manager' }
    ],
    finance: [
        { value: 'financial-analyst', label: 'Financial Analyst' },
        { value: 'investment-banker', label: 'Investment Banker' },
        { value: 'corporate-finance', label: 'Corporate Finance Manager' },
        { value: 'risk-analyst', label: 'Risk Analyst' }
    ]
};

// Mock AI analysis engine
class ResumeAnalyzer {
    constructor() {
        this.skillsDatabase = {
            software: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Git'],
            data: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Statistics', 'R', 'Tableau'],
            product: ['Product Strategy', 'Roadmapping', 'Analytics', 'A/B Testing', 'User Research', 'Agile'],
            design: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
            marketing: ['Google Analytics', 'SEO', 'Content Strategy', 'Social Media', 'Email Marketing', 'PPC'],
            finance: ['Excel', 'Financial Modeling', 'Valuation', 'Risk Management', 'Bloomberg', 'SQL']
        };
    }

    async analyzeResume(resumeFile, jobCategory, jobRole, experienceLevel) {
        // Simulate API call delay
        await this.delay(3000);

        // Mock analysis based on job category and role
        const baseScore = this.generateBaseScore(jobCategory, experienceLevel);
        const categoryScores = this.generateCategoryScores(jobCategory, baseScore);
        const insights = this.generateInsights(jobCategory, categoryScores);
        
        return {
            overallScore: baseScore,
            percentile: this.calculatePercentile(baseScore),
            rank: this.calculateRank(baseScore),
            categoryScores,
            insights,
            comparisonData: this.generateComparisonData(baseScore),
            poolSize: Math.floor(Math.random() * 50) + 100 // 100-150 resumes
        };
    }

    generateBaseScore(jobCategory, experienceLevel) {
        let baseScore = Math.floor(Math.random() * 30) + 60; // 60-90 base
        
        // Adjust based on experience level
        if (experienceLevel === 'entry') baseScore -= 5;
        if (experienceLevel === 'senior') baseScore += 8;
        if (experienceLevel === 'lead') baseScore += 12;
        
        return Math.min(Math.max(baseScore, 45), 95);
    }

    generateCategoryScores(jobCategory, baseScore) {
        const variance = 15;
        return {
            skills: this.clampScore(baseScore + (Math.random() - 0.5) * variance),
            experience: this.clampScore(baseScore + (Math.random() - 0.5) * variance),
            education: this.clampScore(baseScore + (Math.random() - 0.5) * variance),
            keywords: this.clampScore(baseScore + (Math.random() - 0.5) * variance),
            format: this.clampScore(baseScore + (Math.random() - 0.5) * (variance / 2))
        };
    }

    generateInsights(jobCategory, scores) {
        const strengthsPool = [
            'Strong technical skills alignment',
            'Excellent keyword optimization',
            'Well-structured experience section',
            'ATS-friendly formatting',
            'Relevant project showcase',
            'Industry-specific certifications',
            'Leadership experience highlighted',
            'Quantified achievements'
        ];

        const weaknessesPool = [
            'Missing key technical skills',
            'Limited keyword usage',
            'Gaps in work history',
            'Formatting issues detected',
            'Insufficient project details',
            'Outdated technology stack',
            'Weak action verbs',
            'No quantified results'
        ];

        const recommendationsPool = [
            'Add missing technical skills',
            'Include more industry keywords',
            'Quantify your achievements',
            'Improve ATS formatting',
            'Add relevant projects',
            'Update technology stack',
            'Strengthen action verbs',
            'Optimize section ordering'
        ];

        return {
            strengths: this.selectRandomItems(strengthsPool, 3),
            weaknesses: this.selectRandomItems(weaknessesPool, 3),
            recommendations: this.selectRandomItems(recommendationsPool, 3)
        };
    }

    generateComparisonData(userScore) {
        const categories = ['Skills', 'Experience', 'Education', 'Keywords', 'Format'];
        const data = {
            categories,
            yourScore: [],
            averageScore: [],
            top10Score: []
        };

        categories.forEach(() => {
            data.yourScore.push(userScore + (Math.random() - 0.5) * 10);
            data.averageScore.push(65 + Math.random() * 15);
            data.top10Score.push(85 + Math.random() * 10);
        });

        return data;
    }

    calculatePercentile(score) {
        if (score >= 90) return Math.floor(Math.random() * 5) + 95;
        if (score >= 80) return Math.floor(Math.random() * 10) + 85;
        if (score >= 70) return Math.floor(Math.random() * 15) + 70;
        if (score >= 60) return Math.floor(Math.random() * 20) + 50;
        return Math.floor(Math.random() * 30) + 20;
    }

    calculateRank(score) {
        const totalResumes = Math.floor(Math.random() * 50) + 100;
        const percentile = this.calculatePercentile(score);
        return Math.floor((100 - percentile) / 100 * totalResumes) + 1;
    }

    clampScore(score) {
        return Math.min(Math.max(Math.round(score), 40), 95);
    }

    selectRandomItems(array, count) {
        return array.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const analyzer = new ResumeAnalyzer();

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkForUploadedResume();
    setupEventListeners();
    initializeAnalysisDate();
});

function checkForUploadedResume() {
    // Check if resume was uploaded from home page
    if (window.uploadedResume || localStorage.getItem('uploadedResume')) {
        const resumeFile = window.uploadedResume || JSON.parse(localStorage.getItem('uploadedResume'));
        if (resumeFile) {
            displayUploadedResume(resumeFile);
        }
    }
}

function setupEventListeners() {
    const fileInput = document.getElementById('resume-file');
    if (fileInput) {
        fileInput.addEventListener('change', handleResumeUpload);
    }
}

function initializeAnalysisDate() {
    const dateElement = document.getElementById('analysis-date');
    if (dateElement) {
        const today = new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        dateElement.textContent = `Analyzed on ${today}`;
    }
}

function handleResumeUpload(input) {
    const file = input.files ? input.files[0] : input;
    if (file) {
        resumeData = {
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        };

        displayUploadedResume(resumeData);
        checkAnalyzeButton();
        showNotification(`Resume "${file.name}" uploaded successfully!`);
        closeModal('upload-modal');
    }
}

function displayUploadedResume(resumeFile) {
    const statusElement = document.getElementById('resume-status');
    const fileName = resumeFile.name || 'uploaded-resume.pdf';
    const fileSize = resumeFile.size ? (resumeFile.size / 1024 / 1024).toFixed(1) + ' MB' : '2.1 MB';
    
    statusElement.innerHTML = `
        <div class="status-uploaded">
            <div class="upload-icon">📄</div>
            <div class="file-info">
                <div class="file-name">${fileName}</div>
                <div class="file-size">${fileSize}</div>
            </div>
            <button class="btn-small btn-outline" onclick="openModal('upload-modal')">Change</button>
        </div>
    `;
    
    resumeData = resumeFile;
    checkAnalyzeButton();
}

function updateJobRoles() {
    const category = document.getElementById('job-category').value;
    const roleSelect = document.getElementById('job-role');
    
    roleSelect.innerHTML = '<option value="">Select Specific Role</option>';
    
    if (category && jobRolesData[category]) {
        roleSelect.disabled = false;
        jobRolesData[category].forEach(role => {
            const option = document.createElement('option');
            option.value = role.value;
            option.textContent = role.label;
            roleSelect.appendChild(option);
        });
    } else {
        roleSelect.disabled = true;
    }
    
    checkAnalyzeButton();
}

function checkAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const hasResume = resumeData !== null;
    const hasCategory = document.getElementById('job-category').value !== '';
    const hasRole = document.getElementById('job-role').value !== '';
    
    if (hasResume && hasCategory && hasRole) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.add('btn-primary');
    } else {
        analyzeBtn.disabled = true;
        analyzeBtn.classList.remove('btn-primary');
    }
}

async function startAnalysis() {
    if (!resumeData) {
        showNotification('Please upload a resume first', 'error');
        return;
    }

    const jobCategory = document.getElementById('job-category').value;
    const jobRole = document.getElementById('job-role').value;
    const experienceLevel = document.getElementById('experience-level').value;

    if (!jobCategory || !jobRole) {
        showNotification('Please select job category and role', 'error');
        return;
    }

    // Show loading state
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.querySelector('.btn-text').style.display = 'none';
    analyzeBtn.querySelector('.btn-loading').style.display = 'flex';
    analyzeBtn.disabled = true;

    try {
        // Perform analysis
        analysisResults = await analyzer.analyzeResume(
            resumeData.file, 
            jobCategory, 
            jobRole, 
            experienceLevel
        );

        // Show results
        displayAnalysisResults();
        
        showNotification('Analysis completed successfully!');
        
    } catch (error) {
        showNotification('Analysis failed. Please try again.', 'error');
        console.error('Analysis error:', error);
    } finally {
        // Reset button state
        analyzeBtn.querySelector('.btn-text').style.display = 'inline';
        analyzeBtn.querySelector('.btn-loading').style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

function displayAnalysisResults() {
    if (!analysisResults) return;

    // Show results panel
    document.getElementById('results-panel').style.display = 'block';

    // Update pool size info
    document.getElementById('analysis-pool').textContent = 
        `Compared against ${analysisResults.poolSize} similar resumes`;

    // Animate score display
    animateScore(analysisResults.overallScore);
    
    // Update percentile and rank
    document.getElementById('percentile-rank').textContent = 
        `${analysisResults.percentile}th`;
    document.getElementById('rank-position').textContent = 
        `#${analysisResults.rank}`;
    document.querySelector('.ranking-label').textContent = 
        `out of ${analysisResults.poolSize} resumes`;

    // Update category scores
    updateCategoryScores(analysisResults.categoryScores);

    // Update insights
    updateInsights(analysisResults.insights);

    // Create comparison chart
    createComparisonChart(analysisResults.comparisonData);

    // Scroll to results
    document.getElementById('results-panel').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function animateScore(finalScore) {
    const scoreElement = document.getElementById('final-score');
    const progressElement = document.getElementById('score-progress');
    
    // Add gradient definition to SVG
    const svg = document.querySelector('.score-svg');
    if (!svg.querySelector('#scoreGradient')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'scoreGradient';
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#6366f1');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#8b5cf6');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);
    }

    // Animate number
    let currentScore = 0;
    const increment = finalScore / 60; // 60 frames for smooth animation
    const scoreTimer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= finalScore) {
            currentScore = finalScore;
            clearInterval(scoreTimer);
        }
        scoreElement.textContent = Math.round(currentScore);
    }, 33); // ~30fps

    // Animate progress circle
    const circumference = 2 * Math.PI * 80; // radius = 80
    const offset = circumference - (finalScore / 100) * circumference;
    
    setTimeout(() => {
        progressElement.style.strokeDashoffset = offset;
    }, 500);
}

function updateCategoryScores(scores) {
    const categories = ['skills', 'experience', 'education', 'keywords', 'format'];
    
    categories.forEach(category => {
        const scoreElement = document.getElementById(`${category}-score`);
        const fillElement = document.getElementById(`${category}-fill`);
        const score = scores[category];
        
        if (scoreElement && fillElement) {
            scoreElement.textContent = `${score}%`;
            
            // Animate with delay
            setTimeout(() => {
                fillElement.style.width = `${score}%`;
            }, 1000 + Math.random() * 1000);
        }
    });
}

function updateInsights(insights) {
    // Update strengths
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = insights.strengths
        .map(strength => `<li>${strength}</li>`)
        .join('');

    // Update weaknesses
    const weaknessesList = document.getElementById('weaknesses-list');
    weaknessesList.innerHTML = insights.weaknesses
        .map(weakness => `<li>${weakness}</li>`)
        .join('');

    // Update recommendations
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = insights.recommendations
        .map(rec => `<li>${rec}</li>`)
        .join('');
}

function createComparisonChart(data) {
    const canvas = document.getElementById('comparison-chart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Simple chart implementation (you could use Chart.js here)
    drawComparisonChart(ctx, data);
}

function drawComparisonChart(ctx, data) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const categories = data.categories;
    const barWidth = width / (categories.length * 4);
    const maxScore = 100;

    ctx.clearRect(0, 0, width, height);

    // Draw chart
    categories.forEach((category, index) => {
        const x = (index * 4 + 1) * barWidth;
        const yourHeight = (data.yourScore[index] / maxScore) * (height - 40);
        const avgHeight = (data.averageScore[index] / maxScore) * (height - 40);
        const topHeight = (data.top10Score[index] / maxScore) * (height - 40);

        // Your score (blue)
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(x, height - yourHeight - 20, barWidth * 0.8, yourHeight);

        // Average score (gray)
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + barWidth, height - avgHeight - 20, barWidth * 0.8, avgHeight);

        // Top 10% (green)
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x + barWidth * 2, height - topHeight - 20, barWidth * 0.8, topHeight);

        // Category labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(category, x + barWidth, height - 5);
    });
}

// Action functions
function downloadReport() {
    showNotification('Report download will be available in the full version');
}

function optimizeResume() {
    showNotification('Redirecting to resume optimizer...');
    // Could redirect to resume generator with pre-filled data
}

function findCourses() {
    showNotification('Skill-based course recommendations coming soon');
}

function reanalyze() {
    if (analysisResults) {
        startAnalysis();
    }
}

// Event listeners for job selection
document.addEventListener('DOMContentLoaded', function() {
    const jobCategorySelect = document.getElementById('job-category');
    const jobRoleSelect = document.getElementById('job-role');
    
    if (jobCategorySelect) {
        jobCategorySelect.addEventListener('change', updateJobRoles);
    }
    
    if (jobRoleSelect) {
        jobRoleSelect.addEventListener('change', checkAnalyzeButton);
    }
});

// Add CSS gradient for score circle
const style = document.createElement('style');
style.textContent = `
    .score-fill {
        stroke: url(#scoreGradient);
    }
`;
document.head.appendChild(style);