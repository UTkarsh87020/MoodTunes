/**
 * MoodTunes - Frontend JavaScript
 * Handles UI interactions, API calls, and music playback
 */

// Global state
let currentAudio = null;
let currentTrack = null;
let isPlaying = false;

// Track registry to safely pass track data without inline JSON in onclick
const trackRegistry = {};

// API endpoints (relative paths for Vercel)
const API_BASE = window.location.origin;

// Reliable fallback image (no deprecated via.placeholder.com)
const FALLBACK_IMAGE = 'https://placehold.co/300x300/1a1a2e/6366f1?text=🎵';
const FALLBACK_IMAGE_SMALL = 'https://placehold.co/60x60/1a1a2e/6366f1?text=🎵';

/**
 * Navigation Functions
 */
function showLanding() {
    hideAllSections();
    document.getElementById('landing').classList.add('active');
}

function showMoodInput() {
    hideAllSections();
    document.getElementById('mood-input').classList.add('active');
    document.getElementById('mood-text').focus();
}

function showResults() {
    hideAllSections();
    document.getElementById('results').classList.add('active');
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}

/**
 * Mood Input Functions
 */
function setMoodText(text) {
    document.getElementById('mood-text').value = text;
}

/**
 * Main Mood Analysis Function
 */
async function analyzeMood() {
    const moodText = document.getElementById('mood-text').value.trim();
    const language = document.getElementById('language').value;

    // Validation
    if (!moodText) {
        alert('Please describe your mood first!');
        return;
    }

    // Show loading state
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnLoader = analyzeBtn.querySelector('.btn-loader');

    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    analyzeBtn.disabled = true;

    try {
        // Step 1: Analyze mood using Google NLP API
        const moodResponse = await fetch(`${API_BASE}/api/analyze-mood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: moodText,
                language: language
            })
        });

        if (!moodResponse.ok) {
            const errorData = await moodResponse.json();
            throw new Error(errorData.error || 'Failed to analyze mood');
        }

        const moodData = await moodResponse.json();
        console.log('Mood Analysis:', moodData);

        // Step 2: Get music recommendations
        await getMusicRecommendations(moodData, language);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Something went wrong. Please try again.');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

/**
 * Get Music Recommendations from Spotify
 */
async function getMusicRecommendations(moodData, language) {
    // Show loading BEFORE switching sections to avoid layout flash
    const loadingEl = document.getElementById('loading-tracks');
    const tracksGrid = document.getElementById('tracks-grid');
    const errorEl = document.getElementById('error-message');

    loadingEl.style.display = 'block';
    tracksGrid.innerHTML = '';
    errorEl.style.display = 'none';

    // Now switch to results section
    showResults();

    // Display mood result
    document.getElementById('detected-mood').textContent = moodData.mood;
    document.getElementById('mood-description').textContent =
        `Based on your input, we detected a ${moodData.mood} mood with a sentiment score of ${moodData.sentiment.score.toFixed(2)}.`;

    try {
        const response = await fetch(`${API_BASE}/api/get-recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                genres: moodData.genres,
                mood: moodData.mood,
                language: language
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get recommendations');
        }

        const data = await response.json();
        console.log('Recommendations:', data);

        // Hide loading
        loadingEl.style.display = 'none';

        // Apply Dynamic Theme
        applyMoodTheme(moodData.mood);

        // Display tracks
        displayTracks(data.tracks);

    } catch (error) {
        console.error('Error getting recommendations:', error);
        loadingEl.style.display = 'none';
        showError(error.message || 'Failed to load music recommendations');
    }
}

/**
 * Display Track Cards
 */
function displayTracks(tracks) {
    const tracksGrid = document.getElementById('tracks-grid');
    tracksGrid.innerHTML = '';

    if (!tracks || tracks.length === 0) {
        const msg = document.createElement('p');
        msg.style.cssText = 'text-align: center; color: var(--text-secondary);';
        msg.textContent = 'No tracks found. Try a different mood!';
        tracksGrid.appendChild(msg);
        return;
    }

    tracks.forEach(track => {
        const trackCard = createTrackCard(track);
        tracksGrid.appendChild(trackCard);
    });
}

/**
 * Create Track Card Element (XSS-safe, no innerHTML for user data)
 */
function createTrackCard(track) {
    // Register track safely by ID
    trackRegistry[track.id] = track;

    const albumArt = track.albumArt || FALLBACK_IMAGE;

    const card = document.createElement('div');
    card.className = 'track-card';

    // Build image element safely
    const img = document.createElement('img');
    img.src = albumArt;
    img.alt = track.name; // alt is safe here (not injected as raw HTML)
    img.className = 'track-card-image';
    img.onerror = () => { img.src = FALLBACK_IMAGE; };

    // Build content container
    const content = document.createElement('div');
    content.className = 'track-card-content';

    const nameEl = document.createElement('div');
    nameEl.className = 'track-name';
    nameEl.title = track.name;
    nameEl.textContent = track.name; // textContent prevents XSS

    const artistEl = document.createElement('div');
    artistEl.className = 'track-artist';
    artistEl.title = track.artist;
    artistEl.textContent = track.artist; // textContent prevents XSS

    const moodTag = document.createElement('span');
    moodTag.className = 'track-mood-tag';
    moodTag.textContent = track.mood;

    content.appendChild(nameEl);
    content.appendChild(artistEl);
    content.appendChild(moodTag);

    // Build play overlay
    const overlay = document.createElement('div');
    overlay.className = 'track-play-overlay';

    const playBtn = document.createElement('button');
    playBtn.className = 'play-button';
    playBtn.textContent = '▶️';
    // Use track.id reference instead of inlining JSON — safe from XSS and quote issues
    playBtn.addEventListener('click', () => playTrackById(track.id));

    overlay.appendChild(playBtn);

    card.appendChild(img);
    card.appendChild(content);
    card.appendChild(overlay);

    // Add 3D Tilt Effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.zIndex = 10;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.zIndex = 1;
    });

    return card;
}

/**
 * Play Track by registry ID (avoids inline JSON / XSS)
 */
function playTrackById(trackId) {
    const track = trackRegistry[trackId];
    if (!track) return;
    playTrack(track);
}

/**
 * Play Track Function
 */
function playTrack(track) {
    // Check if preview URL is available
    if (!track.previewUrl) {
        alert('Preview not available for this track. Opening in Spotify...');
        window.open(track.spotifyUrl, '_blank');
        return;
    }

    // Stop current playback if any
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    // Create new audio element
    currentAudio = new Audio(track.previewUrl);
    currentTrack = track;

    // Play the track
    currentAudio.play()
        .then(() => {
            isPlaying = true;
            showNowPlaying(track);
            updatePlayPauseButton();
            document.getElementById('np-visualizer').classList.add('active');
        })
        .catch(error => {
            console.error('Playback error:', error);
            alert('Could not play this track. Opening in Spotify...');
            window.open(track.spotifyUrl, '_blank');
        });

    // Handle track end
    currentAudio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
        document.getElementById('np-visualizer').classList.remove('active');
    });
}

/**
 * Show Now Playing Bar
 */
function showNowPlaying(track) {
    const nowPlayingBar = document.getElementById('now-playing');
    const albumArt = track.albumArt || FALLBACK_IMAGE_SMALL;

    document.getElementById('np-album-art').src = albumArt;
    document.getElementById('np-track-name').textContent = track.name;
    document.getElementById('np-artist-name').textContent = track.artist;

    nowPlayingBar.style.display = 'block';
}

/**
 * Toggle Play/Pause
 */
function togglePlayPause() {
    if (!currentAudio) return;

    const visualizer = document.getElementById('np-visualizer');

    if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
        visualizer.classList.remove('active');
    } else {
        currentAudio.play();
        isPlaying = true;
        visualizer.classList.add('active');
    }

    updatePlayPauseButton();
}

/**
 * Update Play/Pause Button Icon
 */
function updatePlayPauseButton() {
    const playIcon = document.getElementById('play-icon');
    playIcon.textContent = isPlaying ? '⏸️' : '▶️';
}

/**
 * Stop Playback
 */
function stopPlayback() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    isPlaying = false;
    currentTrack = null;

    document.getElementById('now-playing').style.display = 'none';
    document.getElementById('np-visualizer').classList.remove('active');
}

/**
 * Apply Dynamic Theme based on mood
 */
function applyMoodTheme(mood) {
    const root = document.documentElement;
    const moodLower = mood.toLowerCase();

    if (moodLower === 'happy') {
        root.style.setProperty('--primary', '#f59e0b');
        root.style.setProperty('--secondary', '#ec4899');
        root.style.setProperty('--accent', '#fbbf24');
        root.style.setProperty('--primary-rgb', '245, 158, 11');
        root.style.setProperty('--secondary-rgb', '236, 72, 153');
    } else if (moodLower === 'energetic') {
        root.style.setProperty('--primary', '#10b981');
        root.style.setProperty('--secondary', '#3b82f6');
        root.style.setProperty('--accent', '#14b8a6');
        root.style.setProperty('--primary-rgb', '16, 185, 129');
        root.style.setProperty('--secondary-rgb', '59, 130, 246');
    } else if (moodLower === 'calm') {
        root.style.setProperty('--primary', '#0ea5e9');
        root.style.setProperty('--secondary', '#8b5cf6');
        root.style.setProperty('--accent', '#38bdf8');
        root.style.setProperty('--primary-rgb', '14, 165, 233');
        root.style.setProperty('--secondary-rgb', '139, 92, 246');
    } else if (moodLower === 'sad') {
        root.style.setProperty('--primary', '#3b82f6');
        root.style.setProperty('--secondary', '#1e3a8a');
        root.style.setProperty('--accent', '#60a5fa');
        root.style.setProperty('--primary-rgb', '59, 130, 246');
        root.style.setProperty('--secondary-rgb', '30, 58, 138');
    } else if (moodLower === 'intense') {
        root.style.setProperty('--primary', '#ef4444');
        root.style.setProperty('--secondary', '#991b1b');
        root.style.setProperty('--accent', '#f87171');
        root.style.setProperty('--primary-rgb', '239, 68, 68');
        root.style.setProperty('--secondary-rgb', '153, 27, 27');
    } else {
        // Reset to default
        root.style.setProperty('--primary', '#6366f1');
        root.style.setProperty('--secondary', '#ec4899');
        root.style.setProperty('--accent', '#8b5cf6');
        root.style.setProperty('--primary-rgb', '99, 102, 241');
        root.style.setProperty('--secondary-rgb', '236, 72, 153');
    }
}

/**
 * Show Error Message
 */
function showError(message) {
    const errorContainer = document.getElementById('error-message');
    const errorText = errorContainer.querySelector('.error-text');

    errorText.textContent = message;
    errorContainer.style.display = 'block';
    document.getElementById('loading-tracks').style.display = 'none';
    document.getElementById('tracks-grid').innerHTML = '';
}

/**
 * Keyboard Shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Enter key in mood textarea
    if (e.key === 'Enter' && e.target.id === 'mood-text' && !e.shiftKey) {
        e.preventDefault();
        analyzeMood();
    }

    // Space bar to play/pause
    if (e.key === ' ' && currentAudio && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayPause();
    }
});

/**
 * Initialize App
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('MoodTunes initialized');
    showLanding();
});
