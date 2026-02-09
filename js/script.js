const focusMeter = document.querySelector(".focus-meter");
const startBtn = document.querySelector(".start");
const resetBtn = document.querySelector(".reset");
const pauseBtn = document.querySelector(".pause");
const pomodoroLabel = document.querySelector(".pomodoro-label");
const pomodoroSelect = document.querySelector("#min-select");
const alertText = document.querySelector(".alert-text");
const timerScreen = document.querySelector(".timer-screen");

const defaultMin = 25;
let defaultBreak = 5;
let pomodoroHour = 0;
let pomodoroMin = defaultMin;
let pomodoroSec = 0;
let startInterval;
let prevSelectedMin = defaultMin;
let prevSelectedBreak = defaultBreak;
let totalfocusedTime = 0;
let totalfocusedHours = 0;
let totalfocusedMins = 0;

pomodoroSelect.addEventListener("change", (e) => {
  const selectedValue = parseInt(e.target.value);
  if (isNaN(selectedValue)) {
    pomodoroMin = 25;
    pomodoroSec = 0;
    alertText.textContent = "Please select a valid option.";
    alertText.style.display = "block";
    setTimeout(() => {
      alertText.textContent = "";
      alertText.style.display = "none";
    }, 1500);
    updateUi();
    resetPomodoro();
    return;
  }

  pomodoroHour = Math.floor(selectedValue / 60);
  pomodoroMin = selectedValue % 60;
  pomodoroSec = 0;
  prevSelectedMin = selectedValue;
  if (selectedValue === 25) {
    defaultBreak = 5;
    prevSelectedBreak = 5;
  } else if (selectedValue === 50) {
    defaultBreak = 10;
    prevSelectedBreak = 10;
  } else if (selectedValue === 90) {
    defaultBreak = 15;
    prevSelectedBreak = 15;
  }
  updateUi();
  resetPomodoro();
});

window.addEventListener("DOMContentLoaded", () => {
  updateUi();
  pomodoroLabel.textContent = "Idle";
});

startBtn.addEventListener("click", () => {
  startPomodoro();
});

pauseBtn.addEventListener("click", pausePomodoro);
resetBtn.addEventListener("click", resetPomodoro);

function updateUi() {
  totalfocusedHours = Math.floor(totalfocusedTime / 60);
  totalfocusedMins = totalfocusedTime % 60;
  if (pomodoroHour > 0) {
    timerScreen.classList.remove("font-size-1");
    timerScreen.classList.add("font-size-2");
    timerScreen.innerHTML = `<span>${String(pomodoroHour).padStart(2, "0")}</span> : <span class="min-container">${String(pomodoroMin).padStart(2, "0")}</span> : <span class="sec-container">${String(pomodoroSec).padStart(2, "0")}</span>`;
  } else {
    timerScreen.classList.remove("font-size-2");
    timerScreen.classList.add("font-size-1");
    timerScreen.innerHTML = `<span class="min-container">${String(pomodoroMin).padStart(2, "0")}</span> : <span class="sec-container">${String(pomodoroSec).padStart(2, "0")}</span>`;
  }

  if (totalfocusedHours > 0) {
    focusMeter.innerHTML = `<span>${String(totalfocusedHours).padStart(2, "0")}h : ${String(totalfocusedMins).padStart(2, "0")}m</span>`;
  } else {
    focusMeter.innerHTML = `<span>${String(totalfocusedMins).padStart(2, "0")}m</span>`;
  }
}

function startPomodoro() {
  if (startInterval) return;
  pomodoroLabel.textContent = "Focused";
  startBtn.disabled = true;
  let totalSecs = pomodoroMin * 60 + pomodoroSec + pomodoroHour * 3600;
  startInterval = setInterval(() => {
    if (totalSecs <= 0) {
      clearInterval(startInterval);
      startInterval = null;
      totalfocusedTime += prevSelectedMin;
      breakTimer();
      return;
    }
    totalSecs -= 1;
    pomodoroHour = Math.floor(totalSecs / 3600);
    pomodoroMin = Math.floor((totalSecs % 3600) / 60);
    pomodoroSec = totalSecs % 60;
    updateUi();
  }, 1000);
}

function pausePomodoro() {
  pomodoroLabel.textContent = "Paused";
  startBtn.disabled = false;
  clearInterval(startInterval);
  startInterval = null;
}

function resetPomodoro() {
  clearInterval(startInterval);
  startInterval = null;
  pomodoroHour = Math.floor(prevSelectedMin / 60);
  pomodoroMin = prevSelectedMin % 60;
  defaultBreak = prevSelectedBreak;
  pomodoroSec = 0;
  updateUi();
  pomodoroLabel.textContent = "Idle";
  startBtn.disabled = false;
}

function breakTimer() {
  pomodoroLabel.textContent = "Break";
  let totalSecs = defaultBreak * 60 + pomodoroSec;
  startInterval = setInterval(() => {
    if (totalSecs <= 0) {
      clearInterval(startInterval);
      startInterval = null;
      pomodoroHour = Math.floor(prevSelectedMin / 60);
      pomodoroMin = prevSelectedMin % 60;
      defaultBreak = prevSelectedBreak;
      pomodoroSec = 0;
      startBtn.disabled = false;
      pomodoroLabel.textContent = "Idle";
      updateUi();
      return;
    }
    totalSecs -= 1;
    pomodoroMin = Math.floor(totalSecs / 60);
    pomodoroSec = totalSecs % 60;
    updateUi();
  }, 1000);
}
