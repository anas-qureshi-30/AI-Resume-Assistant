let skillGapGlobalVar = null
async function analyzeSkillGap() {
    const targetRole = document.getElementById('target-role').value;
    const experienceLevel = document.getElementById('experience-level').value;
    if (!targetRole) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    const analyzeBtn = document.querySelector('.analyze-btn');
    const analyzeText = document.getElementById('analyze-text');
    analyzeBtn.disabled = true;
    analyzeText.innerHTML = '<div class="loading"></div>Analyzing your skills...';
    try {
        await displayResults(targetRole, experienceLevel);
    } catch (error) {
        console.log(error)
    } finally {
        analyzeBtn.disabled = false;
        analyzeText.textContent = '🔍 Analyze Skill Gap';
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
                font-weight: 500;
            `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

async function displayResults(targetRole, experienceLevel) {
    const userInput = {
        "targetRole": targetRole,
        "experienceLevel": experienceLevel
    }
    const response = await fetch('/api/skillGap', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInput)
    });
    const data = await response.json()
    skillGapGlobalVar = data.skillGapData
    console.log(skillGapGlobalVar)
    // Update overview stats
    document.getElementById('missing-skills-count').textContent = skillGapGlobalVar.missingSkills_count;
    document.getElementById('recommended-courses').textContent = skillGapGlobalVar.missingSkills_count * 2;

    document.getElementById('estimated-time').textContent = skillGapGlobalVar.estimatedCompletionTime;
    document.getElementById('match-percentage').textContent = skillGapGlobalVar.skillsMatchPercentage + '%';

    // Generate skill gap items with priorities
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';

    // Sort by priority (high first)
    const sortedSkills = skillGapGlobalVar.missingSkills.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    console.log(sortedSkills)
    sortedSkills.forEach(skill => {
        const skillElement = createEnhancedSkillElement(skill, skill.priority, targetRole);
        skillsContainer.appendChild(skillElement);
    });

    // Show results with smooth animation
    document.getElementById('results').classList.add('show');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function createEnhancedSkillElement(skill, priority, targetRole) {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-item';

    const priorityClass = `priority-${priority}`;
    const priorityText = priority.charAt(0).toUpperCase() + priority.slice(1) + ' Priority';

    let resourcesHtml = '';
    skill.studyMaterials.forEach(resource => {
        const typeClass = `type-${resource.type}`;
        const typeIcon = {
            course: '🎓',
            certification: '🏆',
            project: '💻',
            free: '🆓'
        }[resource.type] || '📚';

        resourcesHtml += `
                    <div class="resource-card">
                        <div class="resource-header">
                            <span class="resource-type ${typeClass}">${typeIcon} ${resource.type.toUpperCase()}</span>
                            <span class="resource-title">${resource.title}</span>
                        </div>
                        <div class="resource-details">
                            <div>📍 ${resource.platform}</div>
                            <div>⏱️ ${resource.duration}</div>
                            <div>💰 ${resource.price}</div>
                            <div>⭐ ${resource.rating}</div>
                        </div>
                        <div class="resource-action">
                            <a href="${resource.url}" class="btn-small btn-primary" target="_blank">
                                🚀 Start Learning
                            </a>
                        </div>
                    </div>
                `;
    });

    skillDiv.innerHTML = `
                <div class="skill-header">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-priority ${priorityClass}">${priorityText}</div>
                </div>
                <div class="skill-description">
                    ${skill.description}}
                </div>
                <div class="learning-resources">
                    ${resourcesHtml}
                </div>
            `;

    return skillDiv;
}


// Initialize with sample data on page load
document.addEventListener('DOMContentLoaded', function () {
    // Add some visual enhancements
    const title = document.querySelector('.header h1');
    title.addEventListener('mouseover', function () {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    title.addEventListener('mouseout', function () {
        this.style.transform = 'scale(1)';
    });

});