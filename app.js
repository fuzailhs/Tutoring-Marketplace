const tutors = [
  {
    id: 1,
    name: "Aisha Patel",
    subject: "Mathematics",
    level: "High School",
    format: "Online",
    price: 28,
    bio: "Helps students build confidence in algebra, geometry, and exam prep with friendly step-by-step explanations.",
    initials: "AP",
    photo: null,
    available: true,
  },
  {
    id: 2,
    name: "Marcus Lee",
    subject: "Physics",
    level: "University",
    format: "Hybrid",
    price: 45,
    bio: "Supports STEM learners with mechanics, electricity, and practical problem-solving strategy.",
    initials: "ML",
    photo: null,
    available: true,
  },
  {
    id: 3,
    name: "Sofia Rivera",
    subject: "Writing",
    level: "Middle School",
    format: "Online",
    price: 22,
    bio: "Guides students through essays, structure, grammar, and reading comprehension with feedback that is easy to apply.",
    initials: "SR",
    photo: null,
    available: false,
  },
  {
    id: 4,
    name: "Daniel Kim",
    subject: "Chemistry",
    level: "High School",
    format: "In Person",
    price: 35,
    bio: "Offers lab prep, formulas, and practice review for test readiness and deeper concept understanding.",
    initials: "DK",
    photo: null,
    available: true,
  },
  {
    id: 5,
    name: "Nadia Hassan",
    subject: "English",
    level: "Elementary",
    format: "Online",
    price: 18,
    bio: "Builds confidence in reading fluency, vocabulary, and writing fundamentals for younger students.",
    initials: "NH",
    photo: null,
    available: true,
  },
  {
    id: 6,
    name: "Jordan Osei",
    subject: "Computer Science",
    level: "University",
    format: "Online",
    price: 52,
    bio: "Mentors students in programming basics, problem-solving, and project planning for coursework support.",
    initials: "JO",
    photo: null,
    available: true,
  },
];

const userRoleMap = {
  learner: {
    name: "Priya Singh",
    label: "Learner",
    note: "Looking for math and writing support",
  },
  tutor: {
    name: "Aisha Patel",
    label: "Tutor",
    note: "Available for math and science sessions",
  },
  admin: {
    name: "Maya Chen",
    label: "Administrator",
    note: "Moderation and profile oversight",
  },
};

const sessions = [
  {
    id: 101,
    learner: "Priya Singh",
    tutor: "Aisha Patel",
    subject: "Mathematics",
    date: "2026-11-08",
    time: "15:00",
    duration: 60,
    format: "Online",
    note: "Need help preparing for a calculus quiz and reviewing practice questions.",
    status: "pending",
  },
  {
    id: 102,
    learner: "Priya Singh",
    tutor: "Marcus Lee",
    subject: "Physics",
    date: "2026-11-10",
    time: "18:30",
    duration: 90,
    format: "Hybrid",
    note: "Need support with mechanics and a short lab write-up review.",
    status: "accepted",
  },
  {
    id: 103,
    learner: "Alex Morgan",
    tutor: "Sofia Rivera",
    subject: "Writing",
    date: "2026-11-06",
    time: "12:00",
    duration: 60,
    format: "Online",
    note: "Draft feedback for an essay and revision planning.",
    status: "declined",
  },
  {
    id: 104,
    learner: "Noah Brown",
    tutor: "Daniel Kim",
    subject: "Chemistry",
    date: "2026-11-12",
    time: "14:00",
    duration: 120,
    format: "In Person",
    note: "Need support with balancing equations and lab questions.",
    status: "completed",
  },
];

const users = [
  { id: 1, name: "Aisha Patel", role: "Tutor", status: "Active" },
  { id: 2, name: "Marcus Lee", role: "Tutor", status: "Active" },
  { id: 3, name: "Sofia Rivera", role: "Tutor", status: "Inactive" },
  { id: 4, name: "Priya Singh", role: "Learner", status: "Active" },
  { id: 5, name: "Maya Chen", role: "Admin", status: "Active" },
];

const state = {
  role: "learner",
  search: "",
  subject: "all",
  level: "all",
  format: "all",
  priceLimit: 60,
  selectedTutorId: null,
};

const tutorGrid = document.getElementById("tutorGrid");
const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const levelFilter = document.getElementById("levelFilter");
const formatFilter = document.getElementById("formatFilter");
const priceFilter = document.getElementById("priceFilter");
const sessionList = document.getElementById("sessionList");
const userSummary = document.getElementById("userSummary");
const adminPanel = document.getElementById("adminPanel");
const requestModal = document.getElementById("requestModal");
const requestForm = document.getElementById("requestForm");
const requestTutor = document.getElementById("requestTutor");
const loginToggle = document.getElementById("loginToggle");

function getFilteredTutors() {
  return tutors.filter((tutor) => {
    const matchesQuery =
      state.search === "" ||
      `${tutor.name} ${tutor.subject} ${tutor.level}`
        .toLowerCase()
        .includes(state.search.toLowerCase());

    const matchesSubject = state.subject === "all" || tutor.subject === state.subject;
    const matchesLevel = state.level === "all" || tutor.level === state.level;
    const matchesFormat = state.format === "all" || tutor.format === state.format ||
      (state.format === "Hybrid" && (tutor.format === "Hybrid" || tutor.format === "Online" || tutor.format === "In Person"));
    const matchesPrice = tutor.price <= state.priceLimit;

    return matchesQuery && matchesSubject && matchesLevel && matchesFormat && matchesPrice;
  });
}

function populateFilters() {
  const subjects = [...new Set(tutors.map((t) => t.subject))];
  const levels = [...new Set(tutors.map((t) => t.level))];
  const formats = [...new Set(tutors.map((t) => t.format))];

  subjectFilter.innerHTML = `<option value="all">All subjects</option>` +
    subjects.map((subject) => `<option value="${subject}">${subject}</option>`).join("");

  levelFilter.innerHTML = `<option value="all">All levels</option>` +
    levels.map((level) => `<option value="${level}">${level}</option>`).join("");

  formatFilter.innerHTML = `<option value="all">All formats</option>` +
    formats.map((format) => `<option value="${format}">${format}</option>`).join("");

  subjectFilter.value = state.subject;
  levelFilter.value = state.level;
  formatFilter.value = state.format;
  priceFilter.value = state.priceLimit;
}

function renderTutors() {
  const filteredTutors = getFilteredTutors();

  if (!filteredTutors.length) {
    tutorGrid.innerHTML = `
      <div class="card tutor-card">
        <h3>No tutors match your filters</h3>
        <p>Try increasing the hourly max or broadening your subject search.</p>
      </div>
    `;
    return;
  }

  tutorGrid.innerHTML = filteredTutors
    .map(
      (tutor) => `
        <article class="card tutor-card">
          <div class="tutor-top">
            <div class="avatar">${tutor.initials}</div>
            <div class="price-tag">$${tutor.price}/hr</div>
          </div>

          <h3>${tutor.name}</h3>
          <div class="meta">
            <span>${tutor.subject}</span>
            <span>${tutor.level}</span>
            <span>${tutor.format}</span>
          </div>
          <p>${tutor.bio}</p>

          <div class="card-actions">
            <span class="badge">${tutor.available ? "Available" : "Booked"}</span>
            <button class="primary-btn" data-tutor-id="${tutor.id}">Request</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-tutor-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number(event.currentTarget.dataset.tutorId);
      openRequestModal(id);
    });
  });
}

function getStatusClass(status) {
  return `status-${status}`;
}

function formatDateLabel(dateString) {
  const date = new Date(dateString + "T00:00:00Z");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function renderUserSummary() {
  const profile = userRoleMap[state.role];
  userSummary.innerHTML = `
    <strong>${profile.name}</strong>
    <small>${profile.label}</small>
    <p>${profile.note}</p>
  `;
}

function renderSessions() {
  const visibleSessions =
    state.role === "learner"
      ? sessions.filter((session) => session.learner === userRoleMap.learner.name)
      : state.role === "tutor"
      ? sessions.filter((session) => session.tutor === userRoleMap.tutor.name)
      : sessions;

  if (!visibleSessions.length) {
    sessionList.innerHTML = "<div class='card session-item'><p>No sessions found for this role.</p></div>";
    return;
  }

  sessionList.innerHTML = visibleSessions
    .map(
      (session) => `
        <div class="session-item">
          <div class="session-head">
            <div>
              <strong>${session.subject}</strong>
              <div>${state.role === "admin" ? `${session.learner} → ${session.tutor}` : `${session.tutor}`}</div>
            </div>
            <span class="status-pill ${getStatusClass(session.status)}">${session.status}</span>
          </div>

          <div class="session-meta">
            <div><strong>Date:</strong> ${formatDateLabel(session.date)}</div>
            <div><strong>Time:</strong> ${session.time} UTC</div>
            <div><strong>Format:</strong> ${session.format}</div>
          </div>

          <p>${session.note}</p>

          <div class="session-actions">
            ${
              state.role === "tutor"
                ? `
                  <button class="btn-accept" data-action="accept" data-id="${session.id}">Accept</button>
                  <button class="btn-decline" data-action="decline" data-id="${session.id}">Decline</button>
                `
                : state.role === "learner"
                ? `
                  <button class="btn-cancel" data-action="cancel" data-id="${session.id}">Cancel</button>
                  <button class="btn-complete" data-action="complete" data-id="${session.id}">Mark complete</button>
                `
                : `
                  <button class="btn-cancel" data-action="deactivate" data-id="${session.id}">Deactivate profile</button>
                `
            }
          </div>
        </div>
      `
    )
    .join("");

  attachSessionActions();
}

function attachSessionActions() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.currentTarget.dataset.action;
      const id = Number(event.currentTarget.dataset.id);
      updateSessionStatus(action, id);
    });
  });
}

function updateSessionStatus(action, id) {
  const session = sessions.find((item) => item.id === id);
  if (!session) return;

  if (action === "accept") session.status = "accepted";
  if (action === "decline") session.status = "declined";
  if (action === "cancel") session.status = "cancelled";
  if (action === "complete") session.status = "completed";
  if (action === "deactivate") {
    const userToToggle = users.find((u) => u.name === session.tutor);
    if (userToToggle) userToToggle.status = "Inactive";
  }

  renderSessions();
  renderAdminPanel();
}

function renderAdminPanel() {
  adminPanel.innerHTML = `
    <h3>Profiles overview</h3>
    <table class="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user) => `
              <tr>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                  <button class="activate-btn" data-user-id="${user.id}">
                    ${user.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;

  document.querySelectorAll("[data-user-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = Number(button.dataset.userId);
      const target = users.find((u) => u.id === userId);
      if (target) {
        target.status = target.status === "Active" ? "Inactive" : "Active";
        renderAdminPanel();
      }
    });
  });
}

function openRequestModal(tutorId) {
  const tutor = tutors.find((item) => item.id === tutorId);
  if (!tutor) return;

  state.selectedTutorId = tutorId;
  requestTutor.value = tutor.name;
  requestForm.reset();
  document.getElementById("requestDuration").value = "60";
  document.getElementById("requestFormat").value = "Online";
  requestModal.classList.remove("hidden");
}

function closeRequestModal() {
  requestModal.classList.add("hidden");
  state.selectedTutorId = null;
}

function updateUserRole(role) {
  state.role = role;

  document.querySelectorAll(".chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === role);
  });

  renderUserSummary();
  renderSessions();
}

function bindEvents() {
  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderTutors();
  });

  subjectFilter.addEventListener("change", (event) => {
    state.subject = event.target.value;
    renderTutors();
  });

  levelFilter.addEventListener("change", (event) => {
    state.level = event.target.value;
    renderTutors();
  });

  formatFilter.addEventListener("change", (event) => {
    state.format = event.target.value;
    renderTutors();
  });

  priceFilter.addEventListener("input", (event) => {
    state.priceLimit = Number(event.target.value);
    renderTutors();
  });

  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => updateUserRole(button.dataset.role));
  });

  document.getElementById("closeModal").addEventListener("click", closeRequestModal);
  document.getElementById("cancelRequest").addEventListener("click", closeRequestModal);
  document.getElementById("requestModal").addEventListener("click", (event) => {
    if (event.target === requestModal) closeRequestModal();
  });

  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedTutor = tutors.find((tutor) => tutor.id === state.selectedTutorId);
    if (!selectedTutor) return;

    const requestedSession = {
      id: Date.now(),
      learner: userRoleMap.learner.name,
      tutor: selectedTutor.name,
      subject: selectedTutor.subject,
      date: document.getElementById("requestDate").value,
      time: document.getElementById("requestTime").value,
      duration: Number(document.getElementById("requestDuration").value),
      format: document.getElementById("requestFormat").value,
      note: document.getElementById("requestNote").value || "No additional notes provided.",
      status: "pending",
    };

    sessions.unshift(requestedSession);
    closeRequestModal();
    renderSessions();
  });

  loginToggle.addEventListener("click", () => {
    const roles = Object.keys(userRoleMap);
    const currentIndex = roles.indexOf(state.role);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    updateUserRole(nextRole);
  });
}

function updateStats() {
  document.getElementById("statTutors").textContent = String(tutors.length);
  document.getElementById("statSessions").textContent = String(sessions.length);
}

function init() {
  populateFilters();
  renderTutors();
  renderUserSummary();
  renderSessions();
  renderAdminPanel();
  updateStats();
  bindEvents();
}

init();
