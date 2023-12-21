import { Notification } from './scripts/notification.js';
import './style.css';
import TomSelect from 'tom-select';
import JustValidate from 'just-validate';
import Inputmask from 'inputmask';

const MAX_COMEDIANS = 6;
const bookingComediansList = document.querySelector('.booking__comedians-list');
const bookingForm = document.querySelector('.booking__form');
const notification = Notification.getInstance();

const createComedianBlock = (comedians) => {
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
  bookingHallButton.type = 'button';

  bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
    hideSelected: true,
    placeholder: 'Выбрать комика',
    options: comedians.map(item => ({
      value: item.id,
      text: item.comedian,
    })),
  });

  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    hideSelected: true,
    placeholder: 'Время',
  });

  bookingTomSelectTime.disable();

  bookingTomSelectComedian.on('change', (id) => {
    bookingTomSelectTime.enable();
    bookingTomSelectComedian.blur();

    const { performances } = comedians.find(item => item.id === id);

    bookingTomSelectTime.clear();
    bookingTomSelectTime.clearOptions();
    bookingTomSelectTime.addOptions(performances.map(item => ({
      value: item.time,
      text: item.time,
    })));

    bookingHallButton.remove();
  });

  bookingTomSelectTime.on('change', (time) => {
    if (!time) {
      return;
    }

    const idComedian = bookingTomSelectComedian.getValue();
    const { performances } = comedians.find(item => item.id === idComedian);
    const { hall } = performances.find(item => item.time === time);

    inputHidden.value = `${idComedian}, ${time}`;
    bookingTomSelectTime.blur();
    bookingHallButton.textContent = hall;
    bookingComedian.append(bookingHallButton);
  });

  const createNextBookingComedian = () => {
    if (bookingComediansList.children.length < MAX_COMEDIANS) {
      const nextComedianBlock = createComedianBlock(comedians);
      bookingComediansList.append(nextComedianBlock);
    }

    bookingTomSelectTime.off('change', createNextBookingComedian);
  };

  bookingTomSelectTime.on('change', createNextBookingComedian);

  return bookingComedian;
};

const getComedians = async () => {
  const response = await fetch('http://localhost:8080/comedians');

  return response.json();
};

const init = async () => {
  const quantityOfComedians = document.querySelector('.event__info-item_comedians, .event__info-number');
  const comedians = await getComedians();
  console.log('comedians: ', comedians);

  quantityOfComedians.textContent = comedians.length;

  const comedianBlock = createComedianBlock(comedians);

  bookingComediansList.append(comedianBlock);

  const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: 'booking__input_invalid',
    successFieldCssClass: 'booking__input_valid',
  });

  const bookingInputFullname = document.querySelector('.booking__input_fullname');
  const bookingInputPhone = document.querySelector('.booking__input_phone');
  const bookingInputTicket = document.querySelector('.booking__input_ticket');

  new Inputmask('+7(999)999-99-99').mask(bookingInputPhone);
  new Inputmask('99999999').mask(bookingInputTicket);

  validate
    .addField(bookingInputFullname, [
      {
        rule: 'required',
        errorMessage: 'Заполните имя и фамилию',
      }])
    .addField(bookingInputPhone, [
      {
        rule: 'required',
        errorMessage: 'Заполните номер телефона',
      },
      {
        validator() {
          const phone = bookingInputPhone.inputmask.unmaskedvalue();
          return phone.length === 10 && !!Number(phone);
        },
        errorMessage: 'Некорректный номер телефона',

      }])
    .addField(bookingInputTicket, [
      {
        rule: 'required',
        errorMessage: 'Заполните номер билета',
      },
      {
        validator() {
          const ticket = bookingInputTicket.inputmask.unmaskedvalue();
          return ticket.length === 8 && !!Number(ticket);
        },
        errorMessage: 'Неверный номер билета',
      }
    ]).onFail((fields) => {
      let errorMessage = '';

      for (const key in fields) {
        if (!Object.hasOwnProperty.call(fields, key)) {
          continue;
        }

        const element = fields[key];

        if (!element.isValid) {
          errorMessage += `${element.errorMessage}, `;
        };
      }

      notification.show(errorMessage.slice(0, -2), false);
    });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { booking: [] };
    const times = new Set();

    new FormData(bookingForm).forEach((value, field) => {
      if (field === 'booking') {
        const [comedian, time] = value.split(',');

        if (comedian && time) {
          data.booking.push({ comedian, time });
          times.add(time);
          notification.show('Бронь принята', true);
        }
      } else {
        data[field] = value;
      }

      if (times.size !== data.booking.length) {
        notification.show('Выбраны выступления комиков в одинаковое время', false);
      }
    });
  });
};

init();
