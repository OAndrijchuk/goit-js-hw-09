import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let deadLineDate = null;

const startBtnRef = document.querySelector('[data-start]');
const inputFromDateRef = document.querySelector('#datetime-picker');
startBtnRef.disabled = true;

startBtnRef.addEventListener('click', onTimer);
function onTimer({ target }) {
  timer.start(deadLineDate, target);
}

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);

    if (Date.now() >= selectedDates[0]) {
      Report.failure(
        'Be attentive!!!',
        'Please choose a date in the future',
        'Ok'
      );
    } else {
      inputFromDateRef.disabled = true;
      startBtnRef.disabled = false;
      deadLineDate = selectedDates[0];
    }
  },
});

const timer = {
  intervalId: null,

  start(finishDate, startBtn) {
    this.intervalId = setInterval(() => {
      const timeLeft = finishDate - Date.now();
      if (Math.floor(timeLeft / 1000) % 60 <= 0) {
        this.stop();
      }
      this.drawTime(this.convertMs(timeLeft));
    }, 1000);
    startBtn.disabled = true;
  },
  stop() {
    clearInterval(this.intervalId);
    Notify.failure(`❌ Sorry, but time is up!`);
    // Так буде працювати без перезавантаження але тільки коли таймер стане 0!
    // inputFromDateRef.disabled = false;
  },
  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  addLeadingZero(value) {
    return String(value).padStart(2, 0);
  },
  drawTime(obj) {
    Object.keys(obj).forEach(
      el =>
        (document.querySelector(`[data-${el}]`).textContent =
          this.addLeadingZero(obj[el]))
    );
  },
};
