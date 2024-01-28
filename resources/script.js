console.log("Script loading!");

let runningTimer = null;
let pomodoroTimeLeft = 0;
let pauseTimeLeft = 0;
let armsAnimationTimer = null;

// document.getElementById("pomodoro").style.display = "flex";
// document.getElementById("pause").style.display = "none";

window.addEventListener("message", (event) => {
  const message = event.data; // The json data that the extension sent

  switch (message.type) {
    case "update_apm":
      updateAPM(message.value);
      break;
  }
});

let apm = 0;
let hideArmsTimer = null;

const updateAPM = (apmValue) => {
  if (apm !== apmValue) {
    if (apm === 0 && apmValue > 0) {
      clearTimeout(hideArmsTimer);
      showArms();
    }

    if (apm > 0 && apmValue === 0) {
      hideArmsTimer = setTimeout(() => hideArms(), 2500);
    }

    apm = apmValue;
  }
};

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

const showArms = () => {
  console.log("showArms");

  const arms = document.getElementsByClassName("monkey-arm");
  for (const arm of arms) {
    arm.style.transform = "translateY(0px)";
  }

  currentmonkeyArmFrequency = 0;
  clearTimeout(armsAnimationTimer);
  armsAnimationTimer = setTimeout(() => {
    updateMonkeyArmFrequency();
  }, 500);
};

const hideArms = () => {
  console.log("hideArms");

  clearTimeout(armsAnimationTimer);
  updateMonkeyArmFrequency();
  clearTimeout(updateMonkeyArmFrequencyTimer);

  const arms = document.getElementsByClassName("monkey-arm");
  for (const arm of arms) {
    setTimeout(() => {
      arm.style.transform = "translateY(100px)";
    });
  }
};

let updateMonkeyArmFrequencyTimer;
let currentmonkeyArmFrequency = 0;
const armAnimations = document.getElementsByClassName("arm-animation");

const UPDATE_FREQUENCY = 16.666;
let lastUpdate = 0;
let rotation = 0;
const ROTATION_SPEED = 0.003;
let scale = 0;
const SCALE_SPEED = 0.0003;

const updateMonkeyArmFrequency = () => {
  let delta = performance.now() - lastUpdate;
  lastUpdate = performance.now();

  rotation += ROTATION_SPEED * delta;

  scale += SCALE_SPEED * delta;

  //   const animationSpeed = parseInt(100000 / Math.max(apm, 10));

  //   currentmonkeyArmFrequency = lerp(
  //     currentmonkeyArmFrequency,
  //     animationSpeed,
  //     0.033333
  //   );

  //   const i = parseInt(currentmonkeyArmFrequency / 100) * 100;
  //   console.log(i, apm);

  for (const armAnimation of armAnimations) {
    armAnimation.style.transform = `rotate(${wrapInMiddle(
      rotation,
      5
    )}deg) scale(${1 + wrapInMiddle(scale, 0.1)})`;
  }

  clearTimeout(updateMonkeyArmFrequencyTimer);
  updateMonkeyArmFrequencyTimer = setTimeout(
    () => updateMonkeyArmFrequency(),
    UPDATE_FREQUENCY
  );
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
