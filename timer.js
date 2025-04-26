document.addEventListener('DOMContentLoaded', () => {
    // Timer elements
    const hoursEl = document.querySelector('.hours');
    const minutesEl = document.querySelector('.minutes');
    const secondsEl = document.querySelector('.seconds');
    const startBtn = document.querySelector('.start-btn');
    const decreaseBtn = document.querySelector('.decrease');
    const increaseBtn = document.querySelector('.increase');
    const progressRing = document.querySelector('.progress-ring-circle');
    const circumference = progressRing.getTotalLength();

    // Timer state
    let isRunning = false;
    let timeLeft;
    let totalTime;
    let timerId = null;
    
    // Set initial progress ring state
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;

    // Update progress ring
    function setProgress(percent) {
        const offset = circumference - (percent / 100 * circumference);
        progressRing.style.strokeDashoffset = offset;
    }

    // Format time
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    // Update timer display
    function updateDisplay(hours, minutes, seconds) {
        hoursEl.textContent = formatTime(hours);
        minutesEl.textContent = formatTime(minutes);
        secondsEl.textContent = formatTime(seconds);
    }

    // Timer controls
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startBtn.textContent = 'Pause';
            startBtn.style.background = '#ff4d4d';
            
            // Calculate total time in seconds
            const hours = parseInt(hoursEl.textContent);
            const minutes = parseInt(minutesEl.textContent);
            const seconds = parseInt(secondsEl.textContent);
            timeLeft = hours * 3600 + minutes * 60 + seconds;
            totalTime = timeLeft;

            timerId = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    const hours = Math.floor(timeLeft / 3600);
                    const minutes = Math.floor((timeLeft % 3600) / 60);
                    const seconds = timeLeft % 60;
                    
                    updateDisplay(hours, minutes, seconds);
                    setProgress((timeLeft / totalTime) * 100);
                } else {
                    clearInterval(timerId);
                    isRunning = false;
                    startBtn.textContent = 'Start Focus';
                    startBtn.style.background = 'var(--accent-color)';
                    showCompletionMessage();
                }
            }, 1000);
        } else {
            clearInterval(timerId);
            isRunning = false;
            startBtn.textContent = 'Resume';
            startBtn.style.background = 'var(--accent-color)';
        }
    }

    // Time adjustment
    function adjustTime(amount) {
        if (!isRunning) {
            let minutes = parseInt(minutesEl.textContent);
            minutes = Math.max(1, Math.min(60, minutes + amount));
            updateDisplay(0, minutes, 0);
        }
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    decreaseBtn.addEventListener('click', () => adjustTime(-5));
    increaseBtn.addEventListener('click', () => adjustTime(5));

    // Music controls
    const playBtns = document.querySelectorAll('.play-btn');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    
    // Audio contexts and sources
    const audioContexts = new Map();
    const audioSources = new Map();
    const gainNodes = new Map();

    // Audio files (would normally be hosted on a server)
    const audioFiles = {
        'Ocean Waves': 'ocean.mp3',
        'Rain Sounds': 'rain.mp3',
        'White Noise': 'white-noise.mp3',
        'Fireplace': 'fireplace.mp3'
    };

    // Initialize audio for each music card
    playBtns.forEach((btn, index) => {
        const musicCard = btn.closest('.music-card');
        const soundType = musicCard.querySelector('h3').textContent;
        const volumeSlider = musicCard.querySelector('.volume-slider');

        btn.addEventListener('click', () => {
            if (!audioContexts.has(soundType)) {
                // Create new audio context
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const gainNode = audioContext.createGain();
                gainNode.connect(audioContext.destination);
                
                audioContexts.set(soundType, audioContext);
                gainNodes.set(soundType, gainNode);

                // Simulate loading audio file
                const oscillator = audioContext.createOscillator();
                oscillator.connect(gainNode);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                
                audioSources.set(soundType, oscillator);
                oscillator.start();
                
                btn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                // Stop and cleanup existing audio
                const source = audioSources.get(soundType);
                source.stop();
                audioContexts.get(soundType).close();
                
                audioContexts.delete(soundType);
                audioSources.delete(soundType);
                gainNodes.delete(soundType);
                
                btn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Volume control
        volumeSlider.addEventListener('input', () => {
            if (gainNodes.has(soundType)) {
                gainNodes.get(soundType).gain.value = volumeSlider.value / 100;
            }
        });
    });

    // Focus monitoring
    let focusBreaks = 0;
    const focusBreaksEl = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const timeFocusedEl = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const focusScoreEl = document.querySelector('.stat-card:nth-child(3) .stat-value');
    
    // Update focus stats
    function updateFocusStats() {
        if (isRunning) {
            const timeSpent = totalTime - timeLeft;
            const minutes = Math.floor(timeSpent / 60);
            const seconds = timeSpent % 60;
            timeFocusedEl.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
            
            const score = Math.max(0, Math.round(100 - (focusBreaks * 10)));
            focusScoreEl.textContent = score + '%';
        }
    }

    // Simulate focus break
    document.addEventListener('visibilitychange', () => {
        if (isRunning && document.hidden) {
            focusBreaks++;
            focusBreaksEl.textContent = focusBreaks;
            showFailureOverlay();
            updateFocusStats();
        }
    });

    // Failure overlay
    const failureOverlay = document.querySelector('.failure-overlay');
    const resumeBtn = document.querySelector('.resume-btn');

    function showFailureOverlay() {
        failureOverlay.style.display = 'flex';
        clearInterval(timerId);
        isRunning = false;
        startBtn.textContent = 'Resume';
        startBtn.style.background = 'var(--accent-color)';
    }

    resumeBtn.addEventListener('click', () => {
        failureOverlay.style.display = 'none';
        startTimer();
    });

    // Settings toggles animation
    const settingCards = document.querySelectorAll('.setting-card');
    settingCards.forEach(card => {
        const toggle = card.querySelector('input[type="checkbox"]');
        const icon = card.querySelector('.setting-icon i');
        
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                icon.style.color = 'var(--accent-color)';
                gsap.from(icon, {
                    rotate: 360,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else {
                icon.style.color = 'rgba(255, 255, 255, 0.5)';
                gsap.from(icon, {
                    rotate: -360,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    });
});
// Preset URLs functionality
function initPresetUrls() {
    console.log('Initializing preset URLs functionality');

    // Get DOM elements
    const urlInput = document.getElementById('urlInput');
    const addUrlBtn = document.getElementById('addUrlBtn');
    const urlList = document.getElementById('urlList');
    const emptyUrlState = document.getElementById('emptyUrlState');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const urlGroups = document.getElementById('urlGroups');
    const emptyGroupState = document.getElementById('emptyGroupState');
    const emergencyButton = document.getElementById('emergencyButton');
    const emergencyOverlay = document.getElementById('emergencyOverlay');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const cancelEmergencyBtn = document.getElementById('cancelEmergencyBtn');

    if (!urlInput || !addUrlBtn) {
        console.error('URL input elements not found!');
        return;
    }

    console.log('URL input elements found, setting up event listeners');

    // Load preset URLs
    loadPresetUrls();

    // Add URL event listener
    addUrlBtn.addEventListener('click', () => {
        console.log('Add URL button clicked');
        const url = urlInput.value.trim();
        if (url) {
            console.log('Adding URL:', url);
            addPresetUrl(url);
            urlInput.value = '';
        }
    });

    // Also add enter key event listener to URL input
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed in URL input');
            const url = urlInput.value.trim();
            if (url) {
                console.log('Adding URL:', url);
                addPresetUrl(url);
                urlInput.value = '';
            }
        }
    });

    // Create group event listener
    createGroupBtn.addEventListener('click', () => {
        const groupName = prompt('Enter a name for the URL group:');
        if (groupName && groupName.trim()) {
            createUrlGroup(groupName.trim());
        }
    });

    // Emergency button event listener
    emergencyButton.addEventListener('click', () => {
        showEmergencyOverlay();
    });

    // Verify OTP button event listener
    verifyOtpBtn.addEventListener('click', () => {
        const otpInput = document.getElementById('otpInput');
        const otp = otpInput.value.trim();
        if (otp) {
            verifyOtp(otp);
        } else {
            document.getElementById('otpError').textContent = 'Please enter the OTP';
        }
    });

    // Resend OTP button event listener
    resendOtpBtn.addEventListener('click', () => {
        sendEmergencyOtp();
    });

    // Cancel emergency button event listener
    cancelEmergencyBtn.addEventListener('click', () => {
        hideEmergencyOverlay();
    });
}

// Load preset URLs from database
async function loadPresetUrls() {
    console.log('Loading preset URLs from database');

    if (!currentSession) {
        console.error('No active session, cannot load URLs');
        return;
    }

    try {
        console.log('Loading URLs for user:', currentSession.user.id);

        // Load URLs
        const { data: urlData, error: urlError } = await supabase
            .from('preset_urls')
            .select('*')
            .eq('user_id', currentSession.user.id);

        if (urlError) throw urlError;

        console.log('Loaded URLs:', urlData);
        presetUrls = urlData || [];

        // Load groups
        const { data: groupData, error: groupError } = await supabase
            .from('preset_url_groups')
            .select('*')
            .eq('user_id', currentSession.user.id);

        if (groupError) throw groupError;

        console.log('Loaded groups:', groupData);
        urlGroups = groupData || [];

        // Display URLs and groups
        displayPresetUrls();
        displayUrlGroups();

    } catch (error) {
        console.error('Error loading preset URLs:', error);
        alert('Error loading URLs: ' + error.message);
    }
}

// Display preset URLs
function displayPresetUrls() {
    console.log('Displaying preset URLs');

    const urlList = document.getElementById('urlList');
    const emptyUrlState = document.getElementById('emptyUrlState');

    if (!urlList || !emptyUrlState) {
        console.error('URL list elements not found!');
        return;
    }

    console.log('Total URLs:', presetUrls.length);
    console.log('URLs data:', JSON.stringify(presetUrls));

    // Clear list
    urlList.innerHTML = '';

    // Filter URLs that don't belong to a group
    const ungroupedUrls = presetUrls.filter(url => !url.group_name);
    console.log('Ungrouped URLs:', ungroupedUrls.length);

    if (ungroupedUrls.length === 0) {
        console.log('No ungrouped URLs, showing empty state');
        emptyUrlState.style.display = 'flex';
        return;
    }

    emptyUrlState.style.display = 'none';

    // Create URL items
    ungroupedUrls.forEach(url => {
        console.log('Creating URL item:', url);
        const li = document.createElement('li');
        li.className = 'url-item';
        li.dataset.id = url.id;

        li.innerHTML = `
            <div class="url-text">${url.title || url.name || url.url}</div>
            <div class="url-actions">
                <button class="url-action-btn edit-url" title="Edit URL"><i class="fas fa-edit"></i></button>
                <button class="url-action-btn delete-url" title="Delete URL"><i class="fas fa-trash"></i></button>
                <button class="url-action-btn select-url" title="Select for Focus Session"><i class="fas fa-check-circle"></i></button>
            </div>
        `;

        // Add event listeners
        li.querySelector('.edit-url').addEventListener('click', (e) => {
            e.stopPropagation();
            editPresetUrl(url.id);
        });

        li.querySelector('.delete-url').addEventListener('click', (e) => {
            e.stopPropagation();
            deletePresetUrl(url.id);
        });

        li.querySelector('.select-url').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUrlSelection(url.id);
            li.classList.toggle('selected');
        });

        urlList.appendChild(li);
    });
}

// Display URL groups
function displayUrlGroups() {
    const urlGroupsContainer = document.getElementById('urlGroups');
    const emptyGroupState = document.getElementById('emptyGroupState');

    // Clear container
    urlGroupsContainer.innerHTML = '';

    if (urlGroups.length === 0) {
        emptyGroupState.style.display = 'flex';
        return;
    }

    emptyGroupState.style.display = 'none';

    // Create group items
    urlGroups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'url-group';
        groupDiv.dataset.id = group.id;

        // Get URLs in this group
        const groupUrls = presetUrls.filter(url => url.group_name === group.name);

        groupDiv.innerHTML = `
            <div class="url-group-title">
                <span>${group.name}</span>
                <div class="url-actions">
                    <button class="url-action-btn edit-group" title="Edit Group"><i class="fas fa-edit"></i></button>
                    <button class="url-action-btn delete-group" title="Delete Group"><i class="fas fa-trash"></i></button>
                    <button class="url-action-btn select-group" title="Select Group for Focus Session"><i class="fas fa-check-circle"></i></button>
                </div>
            </div>
            <div class="url-group-urls">
                ${groupUrls.length > 0 ?
                    groupUrls.map(url => `<div class="group-url">${url.title || url.name || url.url}</div>`).join('') :
                    '<div class="empty-group">No URLs in this group</div>'}
            </div>
        `;

        // Add event listeners
        groupDiv.querySelector('.edit-group').addEventListener('click', (e) => {
            e.stopPropagation();
            editUrlGroup(group.id);
        });

        groupDiv.querySelector('.delete-group').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteUrlGroup(group.id);
        });

        groupDiv.querySelector('.select-group').addEventListener('click', (e) => {
            e.stopPropagation();
            selectUrlGroup(group.id);
            document.querySelectorAll('.url-group').forEach(g => g.classList.remove('selected'));
            groupDiv.classList.add('selected');
        });

        urlGroupsContainer.appendChild(groupDiv);
    });
}

// Add preset URL
async function addPresetUrl(url) {
    if (!currentSession) return;

    // Validate URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    const domain = extractDomain(url);

    try {
        const { data, error } = await supabase
            .from('preset_urls')
            .insert({
                user_id: currentSession.user.id,
                url: url,
                name: domain,
                title: domain
            })
            .select();

        if (error) throw error;

        console.log('URL added successfully:', data[0]);

        // Add to local array
        presetUrls.push(data[0]);

        // Update display
        displayPresetUrls();

    } catch (error) {
        console.error('Error adding preset URL:', error);
        alert('Error adding URL: ' + error.message);
    }
}

// Edit preset URL
async function editPresetUrl(id) {
    const url = presetUrls.find(u => u.id === id);
    if (!url) return;

    const newUrl = prompt('Edit URL:', url.url);
    const newTitle = prompt('Edit title (leave empty to use domain):', url.title || url.name);

    if (!newUrl) return;

    const domain = extractDomain(newUrl);

    try {
        const { error } = await supabase
            .from('preset_urls')
            .update({
                url: newUrl,
                name: domain,
                title: newTitle || domain,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;

        console.log('URL updated successfully');

        // Update local array
        const index = presetUrls.findIndex(u => u.id === id);
        if (index !== -1) {
            presetUrls[index].url = newUrl;
            presetUrls[index].name = domain;
            presetUrls[index].title = newTitle || domain;
        }

        // Update display
        displayPresetUrls();
        displayUrlGroups();

    } catch (error) {
        console.error('Error updating preset URL:', error);
        alert('Error updating URL: ' + error.message);
    }
}

// Delete preset URL
async function deletePresetUrl(id) {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
        const { error } = await supabase
            .from('preset_urls')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Remove from local array
        presetUrls = presetUrls.filter(url => url.id !== id);

        // Remove from selected URLs
        selectedUrls = selectedUrls.filter(urlId => urlId !== id);

        // Update display
        displayPresetUrls();
        displayUrlGroups();

    } catch (error) {
        console.error('Error deleting preset URL:', error);
    }
}

// Create URL group
async function createUrlGroup(name) {
    if (!currentSession) return;

    try {
        const { data, error } = await supabase
            .from('preset_url_groups')
            .insert({
                user_id: currentSession.user.id,
                name: name
            })
            .select();

        if (error) throw error;

        // Add to local array
        urlGroups.push(data[0]);

        // Update display
        displayUrlGroups();

    } catch (error) {
        console.error('Error creating URL group:', error);
    }
}

// Edit URL group
async function editUrlGroup(id) {
    const group = urlGroups.find(g => g.id === id);
    if (!group) return;

    const newName = prompt('Edit group name:', group.name);
    if (!newName || !newName.trim()) return;

    try {
        const { error } = await supabase
            .from('preset_url_groups')
            .update({
                name: newName.trim(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;

        // Update URLs in this group
        const oldName = group.name;
        const { error: urlError } = await supabase
            .from('preset_urls')
            .update({
                group_name: newName.trim(),
                updated_at: new Date().toISOString()
            })
            .eq('group_name', oldName);

        if (urlError) throw urlError;

        // Update local arrays
        const index = urlGroups.findIndex(g => g.id === id);
        if (index !== -1) {
            const oldName = urlGroups[index].name;
            urlGroups[index].name = newName.trim();

            // Update group name in URLs
            presetUrls.forEach(url => {
                if (url.group_name === oldName) {
                    url.group_name = newName.trim();
                }
            });
        }

        // Update display
        displayUrlGroups();

    } catch (error) {
        console.error('Error updating URL group:', error);
    }
}

// Delete URL group
async function deleteUrlGroup(id) {
    if (!confirm('Are you sure you want to delete this group? URLs in this group will not be deleted.')) return;

    const group = urlGroups.find(g => g.id === id);
    if (!group) return;

    try {
        const { error } = await supabase
            .from('preset_url_groups')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Remove group name from URLs
        const { error: urlError } = await supabase
            .from('preset_urls')
            .update({
                group_name: null,
                updated_at: new Date().toISOString()
            })
            .eq('group_name', group.name);

        if (urlError) throw urlError;

        // Update local arrays
        urlGroups = urlGroups.filter(g => g.id !== id);

        // Remove group name from URLs
        presetUrls.forEach(url => {
            if (url.group_name === group.name) {
                url.group_name = null;
            }
        });

        // Reset selected group if it was this one
        if (selectedGroup === id) {
            selectedGroup = null;
        }

        // Update display
        displayPresetUrls();
        displayUrlGroups();

    } catch (error) {
        console.error('Error deleting URL group:', error);
    }
}

// Toggle URL selection
function toggleUrlSelection(id) {
    const index = selectedUrls.indexOf(id);
    if (index === -1) {
        selectedUrls.push(id);
    } else {
        selectedUrls.splice(index, 1);
    }
}

// Select URL group
function selectUrlGroup(id) {
    const group = urlGroups.find(g => g.id === id);
    if (!group) return;

    // Deselect previous group
    if (selectedGroup !== null && selectedGroup !== id) {
        document.querySelector(`.url-group[data-id="${selectedGroup}"]`)?.classList.remove('selected');
    }

    // Toggle selection
    if (selectedGroup === id) {
        selectedGroup = null;
        selectedUrls = selectedUrls.filter(urlId => {
            const url = presetUrls.find(u => u.id === urlId);
            return !url || url.group_name !== group.name;
        });
    } else {
        selectedGroup = id;

        // Add all URLs in this group to selected URLs
        const groupUrls = presetUrls.filter(url => url.group_name === group.name);
        groupUrls.forEach(url => {
            if (!selectedUrls.includes(url.id)) {
                selectedUrls.push(url.id);
            }
        });
    }

    // Update URL items selection state
    document.querySelectorAll('.url-item').forEach(item => {
        const urlId = item.dataset.id;
        if (selectedUrls.includes(urlId)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Open selected URLs using the Python backend
async function openSelectedUrls() {
    if (selectedUrls.length === 0 && selectedGroup === null) {
        alert('No URLs selected. Please select URLs or a group before starting the timer.');
        return;
    }

    // Get URLs to open
    const urlsToOpen = [];

    // Add individually selected URLs
    selectedUrls.forEach(id => {
        const url = presetUrls.find(u => u.id === id);
        if (url) {
            urlsToOpen.push(url.url);
        }
    });

    if (urlsToOpen.length === 0) {
        alert('No valid URLs selected.');
        return;
    }

    try {
        // Start a focus session with the Python backend
        const response = await fetch('http://localhost:5000/api/session/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urls: urlsToOpen,
                session_id: currentSessionId
            })
        });

        const data = await response.json();

        if (data.status === 'starting') {
            console.log('Focus session started with Python backend');

            // Start a status check interval
            startSessionStatusCheck();
        } else {
            console.error('Failed to start focus session:', data.message);
            alert('Failed to start focus session. Please make sure the Python server is running.');
        }
    } catch (error) {
        console.error('Error starting focus session:', error);
        alert('Failed to connect to the Python server. Please make sure it\'s running by executing the start_focus_server.bat file.');

        // Fallback to opening URLs in new tabs
        console.log('Falling back to opening URLs in browser tabs');
        urlsToOpen.forEach(url => {
            window.open(url, '_blank');
        });
    }
}

// Check focus session status
function startSessionStatusCheck() {
    // Check status every 10 seconds
    const statusCheckInterval = setInterval(async () => {
        if (!isRunning) {
            clearInterval(statusCheckInterval);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/session/status');
            const data = await response.json();

            if (!data.active) {
                // Session ended on the Python side
                clearInterval(statusCheckInterval);

                // If our timer is still running, stop it
                if (isRunning) {
                    clearInterval(timerId);
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    startBtn.style.background = 'var(--accent-color)';

                    // Complete session as abandoned
                    if (currentSessionId) {
                        completeSession(false);
                    }
                }
            } else if (data.status === 'break') {
                // Show break notification if not already shown
                if (!document.querySelector('.break-notification')) {
                    showBreakNotification();
                }
            }
        } catch (error) {
            console.error('Error checking session status:', error);
        }
    }, 10000);
}
    