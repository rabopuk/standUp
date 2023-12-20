import './style.css';
import TomSelect from 'tom-select';

const bookingComediansList = document.querySelector('.booking__comedians-list');

const createComediansBlock = () => {
  const bookingComedian = document.createElement('li');
  bookingComedian.classList.add('booking__comedian');

  const bookingSelectComedian = document.createElement('select');
  bookingSelectComedian.classList.add('booking__select', 'booking__select_comedian');

  const bookingSelectTime = document.createElement('select');
  bookingSelectTime.classList.add('booking__select', 'booking__select_time');

  const inputHidden = document.createElement('input');
  inputHidden.type = 'hidden';
  inputHidden.name = 'booking';

  const bookingHallButton = document.createElement('button');
  bookingHallButton.classList.add('booking__hall');

  bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
    hideSelected: true,
    placeholder: 'Выбрать комика',
    options: [{
      value: 1,
      text: 'Белый',
    },
    {
      value: 2,
      text: 'Чёрный',
    }]
  });

  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    hideSelected: true,
    placeholder: 'Время',
  });

  bookingTomSelectTime.disable();

  bookingTomSelectComedian.on('change', () => {
    bookingTomSelectTime.enable();
    bookingTomSelectComedian.blur();

    bookingTomSelectTime.addOptions([{
      value: 1,
      text: '12:00',
    },
    {
      value: 2,
      text: '13:00',
    }])
  });

  bookingTomSelectTime.on('change', () => {
    bookingTomSelectTime.blur();
    bookingHallButton.textContent = 'Зал 1';
    bookingComedian.append(bookingHallButton)
  });

  return bookingComedian;
};

const init = () => {
  const comediansBlock = createComediansBlock();

  bookingComediansList.append(comediansBlock);
};

init();



/*
  <li class="booking__comedian">
    <select name="comedian" class="booking__select booking__select_comedian">
      <option value="1">Юлия Ахмедова</option>
      <option value="2">Слава Комиссаренко</option>
    </select>

    <select name="time" class="booking__select booking__select_time">
      <option value="16:00">16:00</option>
      <option value="20:00">20:00</option>
    </select>

    <button class="booking__hall">Зал 1</button>
  </li>
*/
