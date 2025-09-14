let analysisResults = null;
let chartInstance = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    initializeAnalysisDate();
});

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

async function startAnalysis() {
    // Show loading state
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.querySelector('.btn-text').style.display = 'none';
    analyzeBtn.querySelector('.btn-loading').style.display = 'flex';
    analyzeBtn.disabled = true;

    try {
        await displayAnalysisResults();
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

async function displayAnalysisResults() {
    const response = await fetch('/api/resumeRanking')
    const dataObj = await response.json()
    analysisResults = dataObj.rankingdata
    document.getElementById('results-panel').style.display = 'block';
    document.getElementById('analysis-pool').textContent =
        `Compared against ${analysisResults.no_of_compared_resumes} similar resumes`;

    // Animate score display
    animateScore(analysisResults.overall_score);

    // Update percentile and rank
    document.getElementById('percentile-rank').textContent =
        `${analysisResults.percentile}th`;
    document.getElementById('rank-position').textContent =
        `#${analysisResults.rank}`;
    document.querySelector('.ranking-label').textContent =
        `out of ${analysisResults.no_of_compared_resumes} resumes`;

    // Update category scores
    updateCategoryScores(analysisResults.category_scores);

    // Update insights
    updateInsights(analysisResults.insights);

    // Create comparison chart
    createComparisonChart(analysisResults.category_comparison);

    // Scroll to results
    document.getElementById('results-panel').scrollIntoView({
        behavior: 'smooth'
    });
}

function animateScore(finalScore) {
    const scoreElement = document.getElementById('final-score');
    const progressElement = document.getElementById('score-progress');

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
    const categories = ['skills', 'experience', 'education', 'keywords', 'soft_skill'];

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
    const categories = Object.keys(data);
    const barWidth = width / (categories.length * 4);
    const maxScore = 100;

    ctx.clearRect(0, 0, width, height);

    categories.forEach((category, index) => {
        const x = (index * 4 + 1) * barWidth;
        const scores = data[category]; // Access object for this category

        const yourHeight = (scores.your_score / maxScore) * (height - 40);
        const avgHeight = (scores.average_score / maxScore) * (height - 40);
        const topHeight = (scores.top_10_percent_score / maxScore) * (height - 40);

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
    if (!analysisResults) {
        showNotification('No analysis results to generate link!', 'error');
        return;
    }
    const results=analysisResults
    const date = new Date().toLocaleDateString();

    // Generate report text
    const reportContent = `
RESUME ANALYSIS REPORT
Generated on: ${date}

OVERALL SCORE: ${results.overall_score}/100
Percentile: ${results.percentile}%
Rank: ${results.rank} out of ${results.no_of_compared_resumes}

-------------------------------------
CATEGORY COMPARISON
-------------------------------------
Education: Your Score ${results.category_comparison.education.your_score} 
  • Average: ${results.category_comparison.education.average_score} 
  • Top 10%: ${results.category_comparison.education.top_10_percent_score}

Experience: Your Score ${results.category_comparison.experience.your_score} 
  • Average: ${results.category_comparison.experience.average_score} 
  • Top 10%: ${results.category_comparison.experience.top_10_percent_score}

Keywords: Your Score ${results.category_comparison.keywords.your_score} 
  • Average: ${results.category_comparison.keywords.average_score} 
  • Top 10%: ${results.category_comparison.keywords.top_10_percent_score}

Skills: Your Score ${results.category_comparison.skills.your_score} 
  • Average: ${results.category_comparison.skills.average_score} 
  • Top 10%: ${results.category_comparison.skills.top_10_percent_score}

Soft Skills: Your Score ${results.category_comparison.soft_skill.your_score} 
  • Average: ${results.category_comparison.soft_skill.average_score} 
  • Top 10%: ${results.category_comparison.soft_skill.top_10_percent_score}

-------------------------------------
INSIGHTS
-------------------------------------
Strengths (${results.insights.strengths.length}):
${results.insights.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Weaknesses (${results.insights.weaknesses.length}):
${results.insights.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Recommendations (${results.insights.recommendations.length}):
${results.insights.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

-------------------------------------
This report was generated by AI Resume Assistant.
`;

    // Create Blob & Link
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ranking_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Detailed report link generated!', 'success');
}
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');

    messageElement.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function reanalyze() {
    if (analysisResults) {
        startAnalysis();
    }
}

// Add CSS gradient for score circle
const style = document.createElement('style');
style.textContent = `
            .score-fill {
                stroke: url(#scoreGradient);
            }
        `;
document.head.appendChild(style);