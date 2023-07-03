//from comit
const startBtn = document.querySelector('[data-start]');
const stopeBtn = document.querySelector('[data-stop]');

let timerId = null;

startBtn.addEventListener('click', onColorChanges);
stopeBtn.addEventListener('click', onStopColorCheanged);

function onColorChanges() {
  if (startBtn.disabled) {
    return;
  }
  timerId = setInterval(changeBgColor, 1000);
  startBtn.disabled = true;
}

function changeBgColor() {
  document.body.style.backgroundColor = getRandomHexColor();
}

function onStopColorCheanged() {
  clearInterval(timerId);
  startBtn.disabled = false;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
