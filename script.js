// ================== NAVIGATION ==================
function showSection(section) {
    const sections = [
        "dashboard-section",
        "profile-section",
        "skill-section",
        "roadmap-section",
        "tasks-section",
        "interview-section",
        "resume-section",
        "settings-section"
    ];

    sections.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    let target = document.getElementById(section + "-section");
    if (target) target.style.display = "block";
}

// ================== AI STATUS ==================
function analyzeProfile() {
    let btn = document.getElementById("analyzeBtn");
    let status = document.getElementById("aiStatusText");

    btn.innerHTML = "Analyzing...";
    btn.disabled = true;
    status.innerHTML = "🤖 AI is thinking...";

    setTimeout(() => {
        btn.innerHTML = "Analyze My Profile";
        btn.disabled = false;
        status.innerHTML = "🤖 Ready for AI Analysis";
    }, 1500);
}

// ================== CHAT AI ==================
async function sendMessage() {
    let input = document.getElementById("chatInput");
    let chatBody = document.getElementById("chatBody");

    let message = input.value.trim();
    if (!message) return;

    chatBody.innerHTML += `<p><b>You:</b> ${message}</p>`;
    input.value = "";

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        chatBody.innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;
        chatBody.scrollTop = chatBody.scrollHeight;

    } catch (err) {
        chatBody.innerHTML += `<p><b>AI:</b> Server Error ❌</p>`;
        console.log(err);
    }
}

// ================== PROFILE AI ANALYSIS ==================
async function generateAnalysis() {
    let name = document.getElementById("name").value.trim();
    let degree = document.getElementById("degree").value;

    let skillBoxes = document.querySelectorAll(".skill:checked");
    let goalBoxes = document.querySelectorAll(".goal:checked");

    let skills = [];
    let goals = [];

    skillBoxes.forEach(box => skills.push(box.value));
    goalBoxes.forEach(box => goals.push(box.value));

    if (name === "" || degree === "" || skills.length === 0 || goals.length === 0) {
        alert("Please fill all fields");
        return;
    }

    // LOADING UI
    document.getElementById("output-section").innerHTML =
        "<h3>🤖 AI analyzing your profile...</h3>";

    let prompt = `
You are Career Copilot AI.

Student Details:
Name: ${name}
Degree: ${degree}
Skills: ${skills.join(", ")}
Career Goals: ${goals.join(", ")}

Give:
1. Best Career Recommendation
2. Missing Skills
3. 3 Month Roadmap
4. Interview Preparation Tips
5. Motivation message

Format clearly with headings.
`;

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: prompt })
        });

        const data = await res.json();

        document.getElementById("output-section").innerHTML = `
            <h2>AI Analysis for ${name}</h2>
            <pre style="white-space:pre-wrap">${data.reply}</pre>
        `;

    } catch (err) {
        console.log(err);
        document.getElementById("output-section").innerHTML =
            "❌ AI Error. Try again";
    }

    // ================= UI UPDATES =================
    document.getElementById("welcomeText").innerHTML = `Hey ${name} 👋`;

    document.getElementById("chatBody").innerHTML =
        `<p><b>AI:</b> Hello ${name}! I’m your Career Copilot 🤖</p>`;

    document.getElementById("profileData").innerHTML = `
        <h2>${name}</h2>
        <p>Degree: ${degree}</p>
        <p>Skills: ${skills.join(", ")}</p>
        <p>Goals: ${goals.join(", ")}</p>
    `;

    document.getElementById("skillData").innerHTML =
        `<p>${skills.join(", ")}</p>`;

    document.getElementById("roadmapData").innerHTML =
        `AI Generated roadmap will appear here`;

    document.getElementById("taskData").innerHTML =
        `Complete daily coding + projects`;

    document.getElementById("interviewData").innerHTML =
        `AI will generate interview questions soon`;
    // ================= SKILL PROGRESS =================
let dynamicSkills = document.getElementById("dynamicSkills");
dynamicSkills.innerHTML = "";

skills.forEach(skill => {
    let progress = Math.floor(Math.random() * 41) + 60; // 60-100%

    dynamicSkills.innerHTML += `
        <div class="progress-item">
            <p>${skill.toUpperCase()} - ${progress}%</p>
            <div class="progress-bar">
                <div class="fill" style="width:${progress}%"></div>
            </div>
        </div>
    `;
});

    // ================= CAREERS =================
    let careerGrid = document.getElementById("careerGrid");
    careerGrid.innerHTML = "";

    goals.forEach(g => {
        let title = g.toUpperCase() + " Engineer";
        careerGrid.innerHTML += `
            <div class="career-card">
                <h3>${title}</h3>
                <p>AI Suggested Role</p>
            </div>
        `;
    });
}

// ================== ACCORDION ==================
function toggleAccordion(id) {
    let box = document.getElementById(id);
    box.style.display = box.style.display === "block" ? "none" : "block";
}

// ================== PROFILE UPLOAD ==================
document.getElementById("profilePreview").onclick = function () {
    document.getElementById("profileUpload").click();
};

document.getElementById("profileUpload").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();

    reader.onload = function (event) {
        document.getElementById("profilePreview").innerHTML =
            `<img src="${event.target.result}" style="width:100%;height:100%;border-radius:50%">`;
    };

    reader.readAsDataURL(file);
});

// ================== SEARCH ==================
document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        let value = this.value.toLowerCase();

        if (value.includes("profile")) showSection("profile");
        else if (value.includes("skill")) showSection("skill");
        else if (value.includes("roadmap")) showSection("roadmap");
        else if (value.includes("task")) showSection("tasks");
        else if (value.includes("interview")) showSection("interview");
        else if (value.includes("resume")) showSection("resume");
        else if (value.includes("settings")) showSection("settings");

        this.value = "";
    }
});

// ================== RESUME UPLOAD ==================
function uploadResume() {
    let file = document.getElementById("resumeUpload").files[0];

    if (!file) {
        alert("Please upload resume");
        return;
    }

    document.getElementById("resumeResult").innerHTML = `
        <div class="resume-result-card">
            <h2>📄 Resume Analysis Complete</h2>
            <p><b>File:</b> ${file.name}</p>
            <div class="resume-score-circle">85</div>
            <p>AI Resume Score Generated</p>
        </div>
    `;
}
