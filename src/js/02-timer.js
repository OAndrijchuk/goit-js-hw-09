import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Report } from 'notiflix/build/notiflix-report-aio';

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
  drawTime({ days, hours, minutes, seconds }) {
    document.querySelector('[data-days]').textContent =
      this.addLeadingZero(days);
    document.querySelector('[data-hours]').textContent =
      this.addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      this.addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      this.addLeadingZero(seconds);
  },
};
