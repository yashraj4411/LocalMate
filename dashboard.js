document.addEventListener("DOMContentLoaded", () => {
  /* ===================== CONSTANTS ===================== */
  const THEME_KEY = "localmate_theme";
  const SESSION_KEY = "localmate_loggedInUser";

  /* ===================== ELEMENTS ===================== */
  const themeToggle = document.getElementById("themeToggle");
  const logoutBtn = document.getElementById("logoutBtn");
  const resetBtn = document.getElementById("resetBtn");
  const welcomeMsg = document.getElementById("welcomeMsg");

  const modal = document.getElementById("modal");
  const modalCancel = document.getElementById("modalCancel");
  const modalForm = document.getElementById("modalForm");

  const jobList = document.getElementById("jobList");
  const allJobsBtn = document.getElementById("allJobsBtn");
  const myPostsBtn = document.getElementById("myPostsBtn");
  const postForm = document.getElementById("postForm");

  /* ===================== AUTH GUARD ===================== */
  const user = JSON.parse(localStorage.getItem(SESSION_KEY));

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  welcomeMsg.textContent = `Welcome ${user.email} — ${user.role}`;

  /* ===================== ROLE UI LOGIC ===================== */
const roleBadge = document.getElementById("roleBadge");
const seekerSection = document.getElementById("seekerSection");
const hirerSection = document.getElementById("hirerSection");

if (roleBadge) roleBadge.textContent = user.role;

if (user.role && user.role.toLowerCase().includes("seeker")) {
  if (hirerSection) {
    hirerSection.style.display = "none";
    postForm.style.display = "none";
    myPostsBtn.style.display = "none";
  }
}

if (user.role === "Hirer") {
  if (seekerSection) seekerSection.style.display = "block";
}

  // Load user location
  const userLocationInput = document.getElementById("userLocation");
  userLocationInput.value = user.location || "";

  // Save location on change
  userLocationInput.addEventListener("change", () => {
    user.location = userLocationInput.value;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    // Also update the stored user
    const key = "localmate_user_" + user.email;
    const storedUser = JSON.parse(localStorage.getItem(key));
    storedUser.location = user.location;
    localStorage.setItem(key, JSON.stringify(storedUser));
  });

  /* ===================== THEME ===================== */
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function updateThemeIcon(theme) {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
    }
  }

  applyTheme(localStorage.getItem(THEME_KEY) || "light");
  updateThemeIcon(localStorage.getItem(THEME_KEY) || "light");

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    applyTheme(newTheme);
    updateThemeIcon(newTheme);
  });

  /* ===================== LOGOUT ===================== */
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });

  /* ===================== RESET ===================== */
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset demo data? This will clear all jobs.")) {
      localStorage.removeItem("jobs");
      jobs = [
        { title: "Driver Needed", location: "Mumbai", salary: "₹15,000" },
        { title: "Home Tutor", location: "Delhi", salary: "₹20,000" },
      ];
      localStorage.setItem("jobs", JSON.stringify(jobs));
      renderJobs();
      showNotification("Demo data reset!");
    }
  });

  /* ===================== JOB DATA ===================== */
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [
    { title: "Driver Needed", location: "Mumbai", salary: "₹15,000" },
    { title: "Home Tutor", location: "Delhi", salary: "₹20,000" },
  ];

  let currentTab = "all"; // "all" or "myPosts"

  function renderJobs() {
    jobList.innerHTML = "";

    const jobsToShow =
      currentTab === "all"
        ? jobs
        : jobs.filter((job) => job.postedBy === user.email);

    jobsToShow.forEach((job, index) => {
      const card = document.createElement("div");
      card.className = "card p-4 cursor-pointer";
      card.innerHTML = `
        <h3 class="font-semibold">${job.title}</h3>
        <p>${job.location}</p>
        <p>${job.salary}</p>
        <button class="apply-btn mt-2 bg-indigo-600 text-white px-3 py-1 rounded">
          Apply
        </button>
      `;
      const applyBtn = card.querySelector(".apply-btn");

      if (user.role === "Hirer") {
        applyBtn.style.display = "none";
      }

      // OPEN MODAL
      card.querySelector(".apply-btn").addEventListener("click", () => {
        modal.style.display = "flex";
      });

      jobList.appendChild(card);
    });
  }

  // Tab switching
  allJobsBtn.addEventListener("click", () => {
    currentTab = "all";
    allJobsBtn.className = "tab-btn tab-active";
    myPostsBtn.className = "tab-btn tab-inactive";
    renderJobs();
  });

  myPostsBtn.addEventListener("click", () => {
    currentTab = "myPosts";
    myPostsBtn.className = "tab-btn tab-active";
    allJobsBtn.className = "tab-btn tab-inactive";
    renderJobs();
  });

  // Post job form
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const jobTitle = document.getElementById("jobTitle").value;
    const location = document.getElementById("location").value;
    const timing = document.getElementById("timing").value;
    const salary = document.getElementById("salary").value;

    const newJob = {
      title: jobTitle,
      location: location,
      timing: timing,
      salary: salary,
      postedBy: user.email,
    };

    jobs.push(newJob);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    postForm.reset();
    renderJobs();
    showNotification("Job posted successfully!");
  });

  renderJobs();

  /* ===================== NOTIFICATION ===================== */
  function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");
    const closeBtn = document.getElementById("closeNotification");

    notificationText.textContent = message;
    notification.style.display = "flex";

    closeBtn.addEventListener("click", () => {
      notification.style.display = "none";
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  /* ===================== MODAL ===================== */

  // ❌ CANCEL BUTTON FIX (THIS WAS MISSING)
  modalCancel.addEventListener("click", () => {
    modal.style.display = "none";
    modalForm.reset();
  });

  // FORM SUBMIT
  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Application submitted!");
    modal.style.display = "none";
    modalForm.reset();
  });
});
