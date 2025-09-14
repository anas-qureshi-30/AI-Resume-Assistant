let currentStep = 1;
let totalSteps = 5;
let skills = [];
let softSkills = [];
let languages = [];
let experienceCount = 1;
let educationCount = 1;
let projectCount = 1;

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressFillSelf').style.width = progress + '%';
    document.getElementById('stepInfo').textContent = `Step ${currentStep} of ${totalSteps}`;

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Update navigation buttons
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'block';
    document.getElementById('generateBtn').style.display = currentStep === totalSteps ? 'block' : 'none';
}

function showStep(step) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function validateCurrentStep() {
    const currentSection = document.getElementById(`step${currentStep}`);
    const requiredFields = currentSection.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger)';
            isValid = false;
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }

    return isValid;
}

// Skill management functions
function addSkill(skillType) {
    const input = document.getElementById(`${skillType}Input`);
    const tagsContainer = document.getElementById(`${skillType}Tags`);
    const skillValue = input.value.trim();

    if (skillValue) {
        const skillArray = skillType === 'skill' ? skills :
            skillType === 'softSkill' ? softSkills : languages;

        if (!skillArray.includes(skillValue)) {
            skillArray.push(skillValue);

            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                        ${skillValue}
                        <button type="button" onclick="removeSkill('${skillType}', '${skillValue}', this.parentElement)">x</button>
                    `;
            tagsContainer.appendChild(tag);
        }
        input.value = '';
    }
}

function removeSkill(skillType, skillValue, element) {
    const skillArray = skillType === 'skill' ? skills :
        skillType === 'softSkill' ? softSkills : languages;
    const index = skillArray.indexOf(skillValue);
    if (index > -1) {
        skillArray.splice(index, 1);
    }
    element.remove();
}

// Dynamic list management
function addExperience() {
    const list = document.getElementById('experienceList');
    const newItem = document.createElement('div');
    newItem.className = 'list-item';
    newItem.setAttribute('data-index', experienceCount);

    newItem.innerHTML = `
                <button type="button" class="remove-item" onclick="removeListItem(this)">x</button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Job Title <span class="required">*</span></label>
                        <input type="text" name="experience[${experienceCount}][title]" placeholder="e.g., Software Engineer" required>
                    </div>
                    <div class="form-group">
                        <label>Company Name <span class="required">*</span></label>
                        <input type="text" name="experience[${experienceCount}][company]" placeholder="e.g., Google" required>
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" name="experience[${experienceCount}][startDate]">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" name="experience[${experienceCount}][endDate]" placeholder="Leave blank if current position">
                    </div>
                    <div class="form-group full-width">
                        <label>Location</label>
                        <input type="text" name="experience[${experienceCount}][location]" placeholder="e.g., San Francisco, CA">
                    </div>
                    <div class="form-group full-width">
                        <label>Key Responsibilities & Achievements</label>
                        <textarea name="experience[${experienceCount}][description]" 
                                placeholder="• Developed and maintained web applications using React and Node.js
• Led a team of 5 developers on project delivery
• Improved application performance by 40%"></textarea>
                    </div>
                </div>
            `;

    list.appendChild(newItem);
    experienceCount++;
}

function addEducation() {
    const list = document.getElementById('educationList');
    const newItem = document.createElement('div');
    newItem.className = 'list-item';
    newItem.setAttribute('data-index', educationCount);

    newItem.innerHTML = `
                <button type="button" class="remove-item" onclick="removeListItem(this)">×</button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Degree/Certification <span class="required">*</span></label>
                        <input type="text" name="education[${educationCount}][degree]" placeholder="e.g., Bachelor of Science in Computer Science" required>
                    </div>
                    <div class="form-group">
                        <label>Institution <span class="required">*</span></label>
                        <input type="text" name="education[${educationCount}][school]" placeholder="e.g., Stanford University" required>
                    </div>
                    <div class="form-group">
                        <label>Graduation Year</label>
                        <input type="number" name="education[${educationCount}][year]" min="1950" max="2030" placeholder="2023">
                    </div>
                    <div class="form-group">
                        <label>GPA (Optional)</label>
                        <input type="text" name="education[${educationCount}][gpa]" placeholder="3.8/4.0">
                    </div>
                    <div class="form-group full-width">
                        <label>Relevant Coursework/Honors</label>
                        <textarea name="education[${educationCount}][details]" 
                                placeholder="Relevant coursework, honors, dean's list, etc."></textarea>
                    </div>
                </div>
            `;

    list.appendChild(newItem);
    educationCount++;
}

function addProject() {
    const list = document.getElementById('projectsList');
    const newItem = document.createElement('div');
    newItem.className = 'list-item';
    newItem.setAttribute('data-index', projectCount);

    newItem.innerHTML = `
                <button type="button" class="remove-item" onclick="removeListItem(this)">x</button>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" name="projects[${projectCount}][name]" placeholder="e.g., E-commerce Website">
                    </div>
                    <div class="form-group">
                        <label>Technologies Used</label>
                        <input type="text" name="projects[${projectCount}][tech]" placeholder="e.g., React, Node.js, MongoDB">
                    </div>
                    <div class="form-group full-width">
                        <label>Project Description</label>
                        <textarea name="projects[${projectCount}][description]" 
                                placeholder="Brief description of the project, your role, and key achievements"></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label>Project URL (Optional)</label>
                        <input type="url" name="projects[${projectCount}][url]" placeholder="https://github.com/yourproject">
                    </div>
                </div>
            `;

    list.appendChild(newItem);
    projectCount++;
}

function removeListItem(button) {
    button.parentElement.remove();
}

// Event listeners for skill inputs
document.addEventListener('DOMContentLoaded', function () {
    const skillInputs = ['skillInput', 'softSkillInput', 'languageInput'];

    skillInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const skillType = inputId.replace('Input', '');
                    addSkill(skillType);
                }
            });
        }
    });

    updateProgress();
});

async function generateResume() {
    if (!validateCurrentStep()) return;

    // Show loading screen
    document.querySelector('.form-container').style.display = 'none';
    document.getElementById('loadingSection').classList.add('active');

    // Collect all form data
    const formData = new FormData(document.getElementById('resumeForm'));
    const resumeData = {
        personalInfo: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            state: formData.get('state'),
            linkedIn: formData.get('linkedIn'),
            portfolio: formData.get('portfolio')
        },
        professionalProfile: {
            targetRole: formData.get('targetRole'),
            professionalSummary: formData.get('professionalSummary'),
            careerObjective: formData.get('careerObjective')
        },
        skills: {
            technical: skills,
            soft: softSkills,
            languages: languages
        },
        resumeStyle: formData.get('resumeStyle'),
        achievements: formData.get('achievements'),
        additionalInfo: formData.get('additionalInfo')
    };

    // Collect experience data
    resumeData.experience = [];
    for (let i = 0; i < experienceCount; i++) {
        const title = formData.get(`experience[${i}][title]`);
        if (title) {
            resumeData.experience.push({
                title: title,
                company: formData.get(`experience[${i}][company]`),
                startDate: formData.get(`experience[${i}][startDate]`),
                endDate: formData.get(`experience[${i}][endDate]`),
                location: formData.get(`experience[${i}][location]`),
                description: formData.get(`experience[${i}][description]`)
            });
        }
    }

    // Collect education data
    resumeData.education = [];
    for (let i = 0; i < educationCount; i++) {
        const degree = formData.get(`education[${i}][degree]`);
        if (degree) {
            resumeData.education.push({
                degree: degree,
                school: formData.get(`education[${i}][school]`),
                year: formData.get(`education[${i}][year]`),
                gpa: formData.get(`education[${i}][gpa]`),
                details: formData.get(`education[${i}][details]`)
            });
        }
    }

    // Collect project data
    resumeData.projects = [];
    for (let i = 0; i < projectCount; i++) {
        const name = formData.get(`projects[${i}][name]`);
        if (name) {
            resumeData.projects.push({
                name: name,
                tech: formData.get(`projects[${i}][tech]`),
                description: formData.get(`projects[${i}][description]`),
                url: formData.get(`projects[${i}][url]`)
            });
        }
    }
    try {
        const response = await fetch("/api/resumeGenerator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "resumeData": resumeData })
        })
        const data = await response.json()
        const dataObj = data.aiResponse
        console.log(dataObj)
        generateResumePreview(dataObj)
    } catch (error) {
        console.log(error)
    } finally {
        showNotification("Resume generated successfully!!")
        document.getElementById('loadingSection').classList.remove('active');
        document.getElementById('generatedResume').classList.add('active');
    }
}

function generateResumePreview(data) {
    const preview = document.getElementById('resumePreview');
    preview.innerHTML = data
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

async function downloadWord() {
    const resumeText = document.getElementById('resumePreview').innerHTML;
    const response = await fetch("/wordDownload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "htlmCode": resumeText })
    })
    const data = await response.json()
    if (data.result == "true") {
        showNotification("Word file downloaded successfully!!")
    } else {
        showNotification("Error downloading word file!!")
    }
}

function copyToClipboard() {
    const resumeText = document.getElementById('resumePreview').innerText;
    navigator.clipboard.writeText(resumeText).then(() => {
        showNotification('Resume text copied to clipboard!');
    });
}

function editTemplate() {
    const templateDiv = document.getElementById('resumePreview');
    const isEditable = templateDiv.contentEditable === 'true';

    if (isEditable) {
        templateDiv.contentEditable = 'false';
        templateDiv.style.border = 'none';
        showNotification('Editing disabled. Changes saved!');
    } else {
        templateDiv.contentEditable = 'true';
        templateDiv.style.border = '2px dashed #6366f1';
        templateDiv.focus();
        showNotification('You can now edit the template. Click Edit again to save.');
    }
}
