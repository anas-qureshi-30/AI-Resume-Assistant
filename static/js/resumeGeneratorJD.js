let generatedResumeData = null;

document.getElementById('resume-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    await generateResume();
});

async function generateResume() {
    const generateBtn = document.getElementById('generate-btn');
    const formData = {
        jobDescription: document.getElementById('job-description').value
    };
    // Validate required fields
    if (!formData.jobDescription) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="loading"></div>Generating Resume...';

    try {
        const response = await fetch("/api/resumeGeneratorJD", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "userInput": formData })
        });
        const data = await response.json()
        // Generate resume content
        const resumeContent = data.result;
        displayResume(resumeContent);
        generatedResumeData = resumeContent;

        showNotification('Resume generated successfully!');
        document.getElementById('download-section').style.display = 'block';

    } catch (error) {
        showNotification('Error generating resume. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Generate Resume';
    }
}
function displayResume(content) {
    const preview = document.getElementById('resume-preview');

    let html = content

    preview.innerHTML = html;
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
    const resumeText = document.getElementById('resume-preview').innerHTML;
    console.log("Here")
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
    const resumeText = document.getElementById('resume-preview').innerText;
    navigator.clipboard.writeText(resumeText).then(() => {
        showNotification('Resume text copied to clipboard!');
    });
}

function editTemplate() {
    const templateDiv = document.getElementById('resume-preview');
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

// Auto-resize textarea
document.getElementById('job-description').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.max(200, this.scrollHeight) + 'px';
});
