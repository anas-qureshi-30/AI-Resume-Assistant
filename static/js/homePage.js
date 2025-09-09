let currentTab = 'overview';
let uploadedResume = null;

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
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

async function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        uploadedResume = file;
        const formData = new FormData()
        formData.append("resume", uploadedResume)
        await fetch("/resumeInput", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(closeModal('upload-modal'),
                showNotification(`Resume "${file.name}" uploaded successfully!`),
                document.getElementById("filename").innerHTML = `Uploaded File: ${file.name}`,
                document.getElementById("filename").style.display = "block"
            )
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.querySelector('.upload-area');

    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            uploadArea.classList.add('dragover');
        }

        function unhighlight(e) {
            uploadArea.classList.remove('dragover');
        }

        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                handleFileUpload({ files: files });
            }
        }
    }
});

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    currentTab = tabName;
}

function updateDashboardMetrics() {
    const metrics = ['match-score', 'applications', 'interviews', 'skills'];
    metrics.forEach(metric => {
        const element = document.getElementById(metric);
        if (element) {
            let currentValue = parseInt(element.textContent);
            let increment = Math.floor(Math.random() * 5) + 1;
            element.textContent = (currentValue + increment) + (metric === 'match-score' ? '%' : '');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }, 1000);
});

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

setInterval(updateDashboardMetrics, 30000);

setTimeout(() => {
    if (Math.random() > 0.5) {
        showNotification('Welcome! Upload your resume to get started.', 'warning');
    }
}, 2000);
