console.log("Script loading!");

let runningTimer = null;
let pomodoroTimeLeft = 0;
let pauseTimeLeft = 0;

// document.getElementById("pomodoro").style.display = "flex";
// document.getElementById("pause").style.display = "none";

window.addEventListener("message", (event) => {
  const { actionsPerMinute, actionsPerPeriod, timeSinceLastAction } =
    event.data;
  updateAPM(actionsPerMinute, actionsPerPeriod, timeSinceLastAction);
});

let actionsPerMinute = 0;
let actionsPerPeriod = 0;

const updateAPM = (
  _actionsPerMinute,
  _actionsPerPeriod,
  timeSinceLastAction
) => {
  actionsPerMinute = _actionsPerMinute;
  actionsPerPeriod = _actionsPerPeriod;

  if (isArmsShowing && timeSinceLastAction > 2000) {
    hideArms();
  } else if (!isArmsShowing && timeSinceLastAction < 1000) {
    showArms();
  }
};

/**
 * POMODORO TIMER
 */

document.body.addEventListener("click", () => {
  return;
  console.log("click");

  if (runningTimer) {
    clearRunLoop();
  } else {
    startPomodoro();
  }
});

const resetTimeLeftValues = () => {
  console.log("resetTimeLeftValues");

  pomodoroTimeLeft = 25 * 60;
  pauseTimeLeft = 5 * 60;

  updatePomodoroTimer();
  updatePauseTimer();
};

const clearRunLoop = () => {
  console.log("clearRunLoop");

  clearTimeout(runningTimer);
  runningTimer = null;

  resetTimeLeftValues();

  hideArms();

  document.getElementById("pomodoro").style.display = "flex";
  document.getElementById("pause").style.display = "none";
};

const startPomodoro = () => {
  console.log("startPomodoro");

  resetTimeLeftValues();

  showArms();

  document.getElementById("pomodoro").style.display = "flex";
  document.getElementById("pause").style.display = "none";

  runPomodoro();
};

const runPomodoro = () => {
  console.log("runPomodoro");

  pomodoroTimeLeft--;
  updatePomodoroTimer();
  updateMonkeyArmFrequency();

  if (pomodoroTimeLeft <= 0) {
    startPause();
  } else {
    runningTimer = setTimeout(() => runPomodoro(), 10);
  }
};

const startPause = () => {
  console.log("startPause");

  hideArms();

  console.log("Rain bananas!");

  document.getElementById("pomodoro").style.display = "none";
  document.getElementById("pause").style.display = "flex";

  runPause();
};

const runPause = () => {
  console.log("runPause");

  pauseTimeLeft--;
  updatePauseTimer();

  if (pauseTimeLeft <= 0) {
    clearRunLoop();
  } else {
    runningTimer = setTimeout(() => runPause(), 10);
  }
};

const updatePomodoroTimer = () => {
  const firstMinute = document.getElementById("pomodoro-first-minute");
  const secondMinute = document.getElementById("pomodoro-second-minute");
  const firstSecond = document.getElementById("pomodoro-first-second");
  const secondSecond = document.getElementById("pomodoro-second-second");

  const minutes = parseInt((pomodoroTimeLeft / 60) % 60);
  firstMinute.innerHTML = parseInt((minutes % 60) / 10);
  secondMinute.innerHTML = minutes % 10;

  firstSecond.innerHTML = parseInt((pomodoroTimeLeft % 60) / 10);
  secondSecond.innerHTML = pomodoroTimeLeft % 10;
};

const updatePauseTimer = () => {
  const firstMinute = document.getElementById("pause-first-minute");
  const secondMinute = document.getElementById("pause-second-minute");
  const firstSecond = document.getElementById("pause-first-second");
  const secondSecond = document.getElementById("pause-second-second");

  const minutes = parseInt((pauseTimeLeft / 60) % 60);
  firstMinute.innerHTML = parseInt((minutes % 60) / 10);
  secondMinute.innerHTML = minutes % 10;

  firstSecond.innerHTML = parseInt((pauseTimeLeft % 60) / 10);
  secondSecond.innerHTML = pauseTimeLeft % 10;
};

/**
 * ANIMATIONS
 */

let isArmsShowing = false;
let updateMonkeyArmFrequencyTimer;

let showArmsTimer = null;
const showArms = () => {
  console.log("showArms");

  isArmsShowing = true;

  const arms = document.getElementsByClassName("monkey-arm");
  for (const arm of arms) {
    arm.style.transform = "translateY(0px)";
  }

  clearTimeout(hideArmsTimer);
  clearTimeout(showArmsTimer);
  // showArmsTimer = setTimeout(() => {
  lastUpdate = performance.now();
  updateMonkeyArmFrequency();
  // }, 500);
};

let hideArmsTimer = null;
const hideArms = () => {
  console.log("hideArms");

  isArmsShowing = false;

  clearTimeout(updateMonkeyArmFrequencyTimer);

  clearTimeout(showArmsTimer);
  clearTimeout(hideArmsTimer);
  hideArmsTimer = setTimeout(() => {
    const arms = document.getElementsByClassName("monkey-arm");
    for (const arm of arms) {
      setTimeout(() => {
        arm.style.transform = "translateY(100px)";
      });
    }
  }, 500);
};

const UPDATE_FREQUENCY = 16.666;
let lastUpdate = 0;
let rotation = 0;
const ROTATION_SPEED = 0.003;
let scale = 0;
const SCALE_SPEED = 0.0003;

const updateMonkeyArmFrequency = () => {
  let delta = performance.now() - lastUpdate;
  lastUpdate = performance.now();

  rotation += ROTATION_SPEED * (actionsPerPeriod / 10) * delta;
  scale += SCALE_SPEED * (actionsPerPeriod / 10) * delta;
  updateArmAnimation();

  updateMonkeyArmFrequencyTimer = setTimeout(
    updateMonkeyArmFrequency,
    UPDATE_FREQUENCY
  );
};

const leftArmAnimation = document.getElementById("arm-animation-left");
const rightArmAnimation = document.getElementById("arm-animation-right");
const updateArmAnimation = () => {
  leftArmAnimation.style.transform = `rotate(${wrapInMiddle(
    rotation,
    5
  )}deg) scale(${1 + wrapInMiddle(scale, 0.1)})`;
  rightArmAnimation.style.transform = `rotate(${wrapInMiddle(
    rotation * 0.99,
    5
  )}deg) scale(${1 + wrapInMiddle(scale * 0.99, 0.1)})`;
};

function lerp(from, to, delta) {
  return from + delta * (to - from);
}

function wrapInMiddle(_value, maxValue) {
  const value = _value % maxValue;
  const wrap = maxValue / 2;
  return value >= wrap ? wrap - (value % wrap) : value;
}

hideArms();

console.log("Script loaded successfully!");
