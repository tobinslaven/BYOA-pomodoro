class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.totalTime = 25 * 60; // 25 minutes in seconds
        this.sessionCount = 1;
        this.isFocusSession = true;
        this.isWorkMode = true;
        this.interval = null;
        this.rings = []; // Array to store all rings
        this.currentRingIndex = -1; // Index of current active ring
        
        // Settings
        this.settings = {
            focusTime: 25,
            shortBreak: 5,
            longBreak: 15,
            sessionsBeforeLongBreak: 4
        };
        
        this.initializeElements();
        this.loadSettings();
        this.updateDisplay();
        this.setupEventListeners();
        this.initializeRings();
        
        // Set initial mode button text
        this.modeBtn.textContent = 'Time For A Break?';
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('time');
        this.sessionTypeDisplay = document.getElementById('sessionType');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.nextBreakDisplay = document.getElementById('nextBreak');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modeBtn = document.getElementById('modeBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeModal = document.getElementById('closeModal');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.ringContainer = document.getElementById('ringContainer');
        this.timerContainer = document.querySelector('.timer-container');
    }
    
    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.modeBtn.addEventListener('click', () => this.toggleMode());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeModal.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        // Close modal when clicking outside
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.settingsModal.classList.contains('modal-show')) {
                e.preventDefault();
                this.toggleTimer();
            }
            if (e.code === 'Escape') {
                this.closeSettings();
            }
        });
    }
    
    initializeRings() {
        // Clear any existing rings
        this.ringContainer.innerHTML = '';
        this.rings = [];
        this.currentRingIndex = -1;
    }
    
    restoreAllRingsProgress() {
        // Restore visual progress for all rings
        for (let i = 0; i < this.rings.length; i++) {
            const ring = this.rings[i];
            const progress = ring.currentTime / ring.totalTime;
            const offset = ring.circumference - (progress * ring.circumference);
            ring.element.style.strokeDashoffset = offset;
        }
    }
    
    createNewRing(sessionType) {
        const ringIndex = this.rings.length;
        const ringSize = this.getRingSize(ringIndex);
        const ringId = `ring-${ringIndex}`;
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `ring-svg ring-${ringIndex + 1}`);
        svg.setAttribute('width', ringSize);
        svg.setAttribute('height', ringSize);
        svg.setAttribute('viewBox', `0 0 ${ringSize} ${ringSize}`);
        
        // Create background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('class', 'ring-circle-bg');
        bgCircle.setAttribute('cx', ringSize / 2);
        bgCircle.setAttribute('cy', ringSize / 2);
        bgCircle.setAttribute('r', (ringSize / 2) - 30);
        
        // Create progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('class', `ring-circle ring-${sessionType}`);
        progressCircle.setAttribute('id', ringId);
        progressCircle.setAttribute('cx', ringSize / 2);
        progressCircle.setAttribute('cy', ringSize / 2);
        progressCircle.setAttribute('r', (ringSize / 2) - 30);
        
        // Set up stroke dash array
        const radius = (ringSize / 2) - 30;
        const circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
        
        // Append circles to SVG
        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);
        
        // Append SVG to container
        this.ringContainer.appendChild(svg);
        
        // Store ring data
        const ringData = {
            id: ringId,
            element: progressCircle,
            sessionType: sessionType,
            circumference: circumference,
            totalTime: this.totalTime,
            currentTime: 0,
            completed: false
        };
        
        this.rings.push(ringData);
        this.currentRingIndex = ringIndex;
        
        return ringData;
    }
    
    getRingSize(ringIndex) {
        const sizes = [300, 250, 200, 150, 100];
        return sizes[Math.min(ringIndex, sizes.length - 1)];
    }
    
    getSessionType() {
        if (this.isWorkMode) {
            return 'focus';
        } else {
            const isLongBreak = this.sessionCount % (this.settings.sessionsBeforeLongBreak + 1) === 0;
            return isLongBreak ? 'long-break' : 'short-break';
        }
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        if (!this.isRunning) {
            const sessionType = this.getSessionType();
            
            // Check if there's an existing ring of the same type that's not completed
            let shouldResume = false;
            for (let i = 0; i < this.rings.length; i++) {
                const ring = this.rings[i];
                if (ring.sessionType === sessionType && !ring.completed) {
                    shouldResume = true;
                    this.currentRingIndex = i;
                    this.currentTime = ring.currentTime;
                    break;
                }
            }
            
            if (!shouldResume) {
                // Create new ring for concentric ordering
                this.createNewRing(sessionType);
            }
            
            this.isRunning = true;
            this.isPaused = false;
            this.toggleBtn.textContent = 'Pause';
            this.toggleBtn.classList.remove('btn-primary');
            this.toggleBtn.classList.add('btn-secondary');
            this.timerContainer.classList.add('timer-running');
            
            // Add running class to current ring and restore visual progress
            if (this.currentRingIndex >= 0) {
                const currentRing = this.rings[this.currentRingIndex];
                currentRing.element.classList.add('running');
                // Restore the visual progress using the ring's totalTime
                const progress = this.currentTime / currentRing.totalTime;
                const offset = currentRing.circumference - (progress * currentRing.circumference);
                currentRing.element.style.strokeDashoffset = offset;
            }
            
            this.interval = setInterval(() => {
                this.currentTime++;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.currentTime >= this.rings[this.currentRingIndex].totalTime) {
                    this.completeSession();
                }
            }, 1000);
        }
    }
    
    pauseTimer() {
        if (this.isRunning) {
            // Save current progress to the current ring
            if (this.currentRingIndex >= 0) {
                const currentRing = this.rings[this.currentRingIndex];
                currentRing.currentTime = this.currentTime;
                // Update the ring's visual progress
                const progress = this.currentTime / this.totalTime;
                const offset = currentRing.circumference - (progress * currentRing.circumference);
                currentRing.element.style.strokeDashoffset = offset;
            }
            
            this.isRunning = false;
            this.isPaused = true;
            this.toggleBtn.textContent = 'Start';
            this.toggleBtn.classList.remove('btn-secondary');
            this.toggleBtn.classList.add('btn-primary');
            this.timerContainer.classList.remove('timer-running');
            
            // Remove running class from current ring
            if (this.currentRingIndex >= 0) {
                const currentRing = this.rings[this.currentRingIndex];
                currentRing.element.classList.remove('running');
            }
            
            // Restore all rings' visual progress
            this.restoreAllRingsProgress();
            
            clearInterval(this.interval);
        }
    }
    
    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.toggleBtn.textContent = 'Start';
        this.toggleBtn.classList.remove('btn-secondary');
        this.toggleBtn.classList.add('btn-primary');
        this.timerContainer.classList.remove('timer-running');
        
        clearInterval(this.interval);
        this.updateDisplay();
        this.updateProgress();
    }
    
    toggleMode() {
        // Save current progress to the current ring before switching
        if (this.currentRingIndex >= 0 && this.currentTime > 0) {
            const currentRing = this.rings[this.currentRingIndex];
            currentRing.currentTime = this.currentTime;
            // Update the ring's visual progress
            const progress = this.currentTime / this.totalTime;
            const offset = currentRing.circumference - (progress * currentRing.circumference);
            currentRing.element.style.strokeDashoffset = offset;
        }
        
        this.isWorkMode = !this.isWorkMode;
        
        // Reset timer to new mode
        this.resetTimer();
        
        if (this.isWorkMode) {
            this.totalTime = this.settings.focusTime * 60;
            this.sessionTypeDisplay.textContent = 'Focus Time';
            this.modeBtn.textContent = 'Time For A Break?';
        } else {
            this.totalTime = this.settings.shortBreak * 60;
            this.sessionTypeDisplay.textContent = 'Break Time';
            this.modeBtn.textContent = 'Ready To Work?';
        }
        
        // Restore all rings' visual progress
        this.restoreAllRingsProgress();
        
        this.updateDisplay();
    }
    
    completeSession() {
        this.isRunning = false;
        this.isPaused = false;
        this.toggleBtn.textContent = 'Start';
        this.toggleBtn.classList.remove('btn-secondary');
        this.toggleBtn.classList.add('btn-primary');
        this.timerContainer.classList.remove('timer-running');
        
        clearInterval(this.interval);
        
        // Mark current ring as completed
        if (this.currentRingIndex >= 0) {
            const currentRing = this.rings[this.currentRingIndex];
            currentRing.completed = true;
            currentRing.element.classList.add('ring-completed');
            currentRing.element.classList.remove('running');
        }
        
        // Play notification sound
        this.playNotification();
        
        // Show notification
        this.showNotification();
        
        // Handle session completion
        if (this.isWorkMode) {
            this.sessionCount++;
            this.currentTime = 0;
            this.updateDisplay();
            this.updateProgress();
        } else {
            this.currentTime = 0;
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor((this.totalTime - this.currentTime) / 60);
        const seconds = (this.totalTime - this.currentTime) % 60;
        
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.sessionCountDisplay.textContent = this.sessionCount;
        
        // Update page title with timer
        this.updatePageTitle(minutes, seconds);
    }
    
    updatePageTitle(minutes, seconds) {
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const modeText = this.isWorkMode ? 'Work' : 'Break';
        const statusText = this.isRunning ? 'Running' : (this.isPaused ? 'Paused' : 'Ready');
        
        document.title = `${timeString} - ${modeText} Mode (${statusText}) - Pomodoro Timer`;
    }
    
    updateProgress() {
        if (this.currentRingIndex >= 0) {
            const currentRing = this.rings[this.currentRingIndex];
            const progress = this.currentTime / currentRing.totalTime;
            const offset = currentRing.circumference - (progress * currentRing.circumference);
            currentRing.element.style.strokeDashoffset = offset;
        }
    }
    
    playNotification() {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    showNotification() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                const title = this.isWorkMode ? 'Work Session Complete!' : 'Break Session Complete!';
                const body = this.isWorkMode ? 
                    'Great work! Time for a well-deserved break!' : 
                    'Break time is over! Ready to get back to work?';
                
                new Notification(title, {
                    body: body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
            }
        }
    }
    
    openSettings() {
        this.settingsModal.style.display = 'block';
        this.settingsModal.classList.add('modal-show');
        
        // Populate settings form
        document.getElementById('focusTime').value = this.settings.focusTime;
        document.getElementById('shortBreak').value = this.settings.shortBreak;
        document.getElementById('longBreak').value = this.settings.longBreak;
        document.getElementById('sessionsBeforeLongBreak').value = this.settings.sessionsBeforeLongBreak;
    }
    
    closeSettings() {
        this.settingsModal.style.display = 'none';
        this.settingsModal.classList.remove('modal-show');
    }
    
    saveSettings() {
        this.settings.focusTime = parseInt(document.getElementById('focusTime').value);
        this.settings.shortBreak = parseInt(document.getElementById('shortBreak').value);
        this.settings.longBreak = parseInt(document.getElementById('longBreak').value);
        this.settings.sessionsBeforeLongBreak = parseInt(document.getElementById('sessionsBeforeLongBreak').value);
        
        // Save to localStorage
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
        
        // Update current session if it's a focus session
        if (this.isFocusSession) {
            this.totalTime = this.settings.focusTime * 60;
        }
        
        this.updateDisplay();
        this.closeSettings();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.totalTime = this.settings.focusTime * 60;
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

// Request notification permission on page load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}