
        let startTime;
        let elapsedTime = 0;
        let timerInterval;
        let isRunning = false;
        let laps = [];
        
        const minutesDisplay = document.getElementById('minutes');
        const secondsDisplay = document.getElementById('seconds');
        const millisecondsDisplay = document.getElementById('milliseconds');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapBtn = document.getElementById('lapBtn');
        const lapList = document.getElementById('lapList');
        const lapCount = document.getElementById('lapCount');
        const noLapsMessage = document.getElementById('noLapsMessage');
        
        function formatTime(time) {
            const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
            const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
            return { minutes, seconds, milliseconds };
        }
        
        function updateDisplay(time) {
            const formattedTime = formatTime(time);
            minutesDisplay.textContent = formattedTime.minutes;
            secondsDisplay.textContent = formattedTime.seconds;
            millisecondsDisplay.textContent = formattedTime.milliseconds;
        }
        
        function startTimer() {
            if (!isRunning) {
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(() => {
                    elapsedTime = Date.now() - startTime;
                    updateDisplay(elapsedTime);
                }, 10);
                
                isRunning = true;
                toggleButtons();
            }
        }
        
        function pauseTimer() {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
                toggleButtons();
            }
        }
        
        function resetTimer() {
            clearInterval(timerInterval);
            elapsedTime = 0;
            updateDisplay(elapsedTime);
            isRunning = false;
            laps = [];
            renderLaps();
            toggleButtons();
            noLapsMessage.style.display = 'block';
        }
        
        function recordLap() {
            if (isRunning && elapsedTime > 0) {
                // Record lap time relative to previous lap or start
                const lapTime = laps.length > 0 ? 
                    elapsedTime - laps[laps.length - 1].totalTime : 
                    elapsedTime;
                    
                laps.push({
                    lapNumber: laps.length + 1,
                    lapTime: lapTime,
                    totalTime: elapsedTime
                });
                
                renderLaps();
                noLapsMessage.style.display = 'none';
            }
        }
        
        function renderLaps() {
            lapList.innerHTML = '';
            
            if (laps.length === 0) {
                noLapsMessage.style.display = 'block';
                lapCount.textContent = '0 laps';
                return;
            }
            
            // Find fastest and slowest laps
            let fastestIndex = 0;
            let slowestIndex = 0;
            
            laps.forEach((lap, index) => {
                if (lap.lapTime < laps[fastestIndex].lapTime) fastestIndex = index;
                if (lap.lapTime > laps[slowestIndex].lapTime) slowestIndex = index;
            });
            
            laps.forEach((lap, index) => {
                const formattedLapTime = formatTime(lap.lapTime);
                const formattedTotalTime = formatTime(lap.totalTime);
                
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item p-3 flex justify-between items-center';
                
                if (index === fastestIndex) lapItem.classList.add('fastest-lap');
                if (index === slowestIndex) lapItem.classList.add('slowest-lap');
                
                lapItem.innerHTML = `
                    <span class="font-medium">Lap ${lap.lapNumber}</span>
                    <div class="text-right">
                        <div class="text-sm opacity-80">
                            ${formattedLapTime.minutes}:${formattedLapTime.seconds}.${formattedLapTime.milliseconds}
                        </div>
                        <div class="text-xs opacity-60">
                            Total: ${formattedTotalTime.minutes}:${formattedTotalTime.seconds}.${formattedTotalTime.milliseconds}
                        </div>
                    </div>
                `;
                
                lapList.appendChild(lapItem);
            });
            
            lapCount.textContent = `${laps.length} ${laps.length === 1 ? 'lap' : 'laps'}`;
        }
        
        function toggleButtons() {
            startBtn.disabled = isRunning;
            pauseBtn.disabled = !isRunning;
            resetBtn.disabled = isRunning && elapsedTime === 0;
            lapBtn.disabled = !isRunning;
        }
        
        // Event listeners
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
        lapBtn.addEventListener('click', recordLap);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (isRunning) pauseTimer();
                else startTimer();
            } else if (e.code === 'KeyL') {
                e.preventDefault();
                if (isRunning) recordLap();
            } else if (e.code === 'KeyR') {
                e.preventDefault();
                if (!isRunning || elapsedTime > 0) resetTimer();
            }
        });
  