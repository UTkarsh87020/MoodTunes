// MoodTunes - Main Application Script

// DOM Elements
const sections = {
    landing: document.getElementById('landing'),
    moodInput: document.getElementById('moodInput'),
    loading: document.getElementById('loading'),
    results: document.getElementById('results')
};

const buttons = {
    start: document.getElementById('startBtn'),
    analyze: document.getElementById('analyzeBtn'),
    back: document.getElementById('backBtn'),
    newSearch: document.getElementById('newSearchBtn')
};

const moodTextArea = document.getElementById('moodText');
const languageSelect = document.getElementById('language');
const moodResult = document.getElementById('moodResult');
const recommendationsGrid = document.getElementById('recommendations');

// Show specific section
function showSection(sectionName) {
    Object.values(sections).forEach(section => section.classList.remove('active'));
    sections[sectionName].classList.add('active');
}

// Event Listeners
buttons.start?.addEventListener('click', () => {
    showSection('moodInput');
});

buttons.back?.addEventListener('click', () => {
    showSection('landing');
});

buttons.newSearch?.addEventListener('click', () => {
    moodTextArea.value = '';
    showSection('moodInput');
});

buttons.analyze?.addEventListener('click', async () => {
    const moodText = moodTextArea.value.trim();
    const language = languageSelect.value;

    if (!moodText) {
        alert('Please describe your mood!');
        return;
    }

    showSection('loading');

    try {
        // Analyze mood
        const moodResponse = await fetch('/api/analyze-mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: moodText, language })
        });

        if (!moodResponse.ok) {
            throw new Error('Failed to analyze mood');
        }

        const moodData = await moodResponse.json();

        // Get recommendations
        const recsResponse = await fetch('/api/get-recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mood: moodData.mood })
        });

        if (!recsResponse.ok) {
            throw new Error('Failed to get recommendations');
        }

        const recommendations = await recsResponse.json();

        // Display results
        displayResults(moodData, recommendations);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
        showSection('moodInput');
    }
});

function displayResults(moodData, recommendations) {
    // Display mood analysis
    moodResult.innerHTML = `
        <h2>Your Mood: ${moodData.mood}</h2>
        <p>Sentiment Score: ${moodData.score.toFixed(2)}</p>
        <p>Magnitude: ${moodData.magnitude.toFixed(2)}</p>
    `;

    // Display recommendations
    recommendationsGrid.innerHTML = recommendations.tracks.map(track => `
        <div class="track-card">
            <img src="${track.album.images[0]?.url || ''}" alt="${track.name}">
            <h3>${track.name}</h3>
            <p>${track.artists.map(a => a.name).join(', ')}</p>
            ${track.preview_url ? 
                `<audio controls><source src="${track.preview_url}" type="audio/mpeg"></audio>` : 
                '<p>Preview not available</p>'
            }
            <a href="${track.external_urls.spotify}" target="_blank">Open in Spotify</a>
        </div>
    `).join('');

    showSection('results');
}

// Initialize
console.log('MoodTunes loaded successfully!');
console.log('Vercel Speed Insights is active and tracking performance metrics.');
