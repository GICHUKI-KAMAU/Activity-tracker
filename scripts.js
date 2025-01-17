// DOM Elements
const addModal = document.getElementById('addModal');
const viewModal = document.getElementById('viewModal');
const addActivityBtn = document.getElementById('addActivityBtn');
const activityForm = document.getElementById('activityForm');
const activitiesContainer = document.getElementById('activitiesContainer');
const noActivities = document.getElementById('noActivities');
const notification = document.getElementById('notification');


let activities = [];

// date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Close buttons
document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = function() {
        addModal.style.display = 'none';
        viewModal.style.display = 'none';
    }
});


addActivityBtn.onclick = function() {
    addModal.style.display = 'block';
}

// hide when clicking outside
window.onclick = function(event) {
    if (event.target === addModal) {
        addModal.style.display = 'none';
    }
    if (event.target === viewModal) {
        viewModal.style.display = 'none';
    }
}

// Calculate streak days from the day the streak started
function calculateStreak(startDate) {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Show notification for 5000 ms
function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}


function renderActivities() {
    if (activities.length === 0) {
        noActivities.style.display = 'block';
        return;
    }

    noActivities.style.display = 'none';
    activitiesContainer.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <img src="${activity.imageUrl}" alt="${activity.name}" onerror="this.src='https://via.placeholder.com/150'">
            <h3>${activity.name}</h3>
            <p>Streak: ${calculateStreak(activity.startDate)} days</p>
            <div class="activity-actions">
                <button class="btn-view" onclick="viewActivity('${activity.id}')">View</button>
                <button class="btn-delete" onclick="deleteActivity('${activity.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new activity
activityForm.onsubmit = function(e) {
    e.preventDefault();
    
    const newActivity = {
        id: Date.now().toString(),
        name: document.getElementById('activityName').value,
        imageUrl: document.getElementById('imageUrl').value,
        startDate: document.getElementById('startDate').value
    };

    activities.push(newActivity);
    renderActivities();
    showNotification('Activity added successfully!');
    
    addModal.style.display = 'none';
    activityForm.reset();
}

// View activity details
function viewActivity(id) {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    document.getElementById('viewActivityContent').innerHTML = `
        <img src="${activity.imageUrl}" alt="${activity.name}" >
        <h3>${activity.name}</h3>
        <p>Start Date: ${formatDate(activity.startDate)}</p>
        <p>Current Streak: ${calculateStreak(activity.startDate)} days</p>
    `;

    viewModal.style.display = 'block';
}

// Deleting  an activity
function deleteActivity(id) {
    if (confirm('Are you sure you want to delete this activity?')) {
        activities = activities.filter(a => a.id !== id);
        renderActivities();
        showNotification('Activity deleted successfully!');
    }
}

renderActivities();