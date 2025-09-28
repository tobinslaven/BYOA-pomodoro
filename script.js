class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.totalTime = 25 * 60; // 25 minutes in seconds
        this.sessionCount = 1;
        this.isFocusSession = true;
        this.isWorkMode = true; // New property for work/break mode
        this.interval = null;
        
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
        this.setupProgressRing();
        
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
        this.progressCircle = document.getElementById('progressCircle');
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
    
    setupProgressRing() {
        const radius = this.progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        this.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressCircle.style.strokeDashoffset = circumference;
        this.circumference = circumference;
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
            this.isRunning = true;
            this.isPaused = false;
            this.toggleBtn.textContent = 'Pause';
            this.toggleBtn.classList.remove('btn-primary');
            this.toggleBtn.classList.add('btn-secondary');
            this.timerContainer.classList.add('timer-running');
            
            this.interval = setInterval(() => {
                this.currentTime++;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.currentTime >= this.totalTime) {
                    this.completeSession();
                }
            }, 1000);
        }
    }
    
    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.toggleBtn.textContent = 'Start';
            this.toggleBtn.classList.remove('btn-secondary');
            this.toggleBtn.classList.add('btn-primary');
            this.timerContainer.classList.remove('timer-running');
            
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
        
        // Play notification sound
        this.playNotification();
        
        // Show notification
        this.showNotification();
        
        // Handle session completion based on mode
        if (this.isWorkMode) {
            // In work mode, complete the work session
            this.sessionCount++;
            this.currentTime = 0;
            this.updateDisplay();
            this.updateProgress();
        } else {
            // In break mode, complete the break session
            this.currentTime = 0;
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    switchToBreak() {
        this.isFocusSession = false;
        this.sessionCount++;
        
        // Determine break type
        const isLongBreak = this.sessionCount % (this.settings.sessionsBeforeLongBreak + 1) === 0;
        this.totalTime = isLongBreak ? this.settings.longBreak * 60 : this.settings.shortBreak * 60;
        
        this.sessionTypeDisplay.textContent = isLongBreak ? 'Long Break' : 'Short Break';
        this.nextBreakDisplay.textContent = 'Focus Time';
        this.timerContainer.classList.add('timer-break');
    }
    
    switchToFocus() {
        this.isFocusSession = true;
        this.totalTime = this.settings.focusTime * 60;
        
        this.sessionTypeDisplay.textContent = 'Focus Time';
        this.nextBreakDisplay.textContent = this.sessionCount % this.settings.sessionsBeforeLongBreak === 0 ? 
            'Long Break' : 'Short Break';
        this.timerContainer.classList.remove('timer-break');
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
        const progress = this.currentTime / this.totalTime;
        const offset = this.circumference - (progress * this.circumference);
        this.progressCircle.style.strokeDashoffset = offset;
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
