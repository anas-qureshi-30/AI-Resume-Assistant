function updateCharCount() {
    const textarea = document.getElementById('job-description');
    const counter = document.getElementById('char-counter');
    const current = textarea.value.length;
    const max = textarea.maxLength;
    counter.textContent = `${current} / ${max}`;
}

async function generateTemplate() {
    const jobDescription = document.getElementById('job-description').value.trim();

    if (!jobDescription) {
        showNotification('Please enter a job description', 'error');
        return;
    }

    if (jobDescription.length < 50) {
        showNotification('Please provide a more detailed job description (at least 50 characters)', 'error');
        return;
    }

    const generateBtn = document.getElementById('generate-btn');
    const btnText = document.getElementById('btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    try {
        generateBtn.disabled = true;
        btnText.textContent = 'Generating...';
        loadingSpinner.style.display = 'inline-block';
        await displayTemplate()
    } catch (error) {
        console.log(error)
    } finally {
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Template';
        loadingSpinner.style.display = 'none';

        showNotification('Output is ready!');

        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


async function displayTemplate() {
    const resultSection = document.getElementById('result-section');
    const resumeTemplate = document.getElementById('resume-template');
    const jobDescription = document.getElementById('job-description').value.trim();
    const jsonData = {
        "jobDescription": jobDescription
    }
    const response = await fetch('/api/templateGeneratorAI', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
    })
    const data = await response.json()
    const output = data.result
    console.log(output)
    resumeTemplate.innerHTML = output;
    console.log(resumeTemplate.textContent)
    console.log(resumeTemplate.innerHTML)
    resultSection.classList.add('active');
}

function copyTemplate() {
    const template = document.getElementById('resume-template').innerText;
    navigator.clipboard.writeText(template).then(() => {
        showNotification('Template copied to clipboard!');
    });
}

async function downloadTemplate() {
    const template = document.getElementById('resume-template').innerHTML;
    const response=await fetch("/wordDownload",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({"htlmCode":template})
    })
    const data=await response
    if(data.result=="true"){
       showNotification('Template downloaded successfully!'); 
    }else{
        showNotification('Error downloaded template!');
    }
}

function editTemplate() {
    const templateDiv = document.getElementById('resume-template');
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

function clearForm() {
    document.getElementById('job-description').value = '';
    document.getElementById('result-section').classList.remove('active');
    updateCharCount();
    showNotification('Form cleared');
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

document.addEventListener('DOMContentLoaded', function () {
    updateCharCount();
});