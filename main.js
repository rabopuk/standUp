import './style.css';
import { getComedians } from './scripts/api.js';
import { initForm } from './scripts/form.js';
import { initChangeSection } from './scripts/changeSection.js';
import { initQrPage } from './scripts/qrPage.js';

const init = async () => {
  if (window.location.pathname.endsWith('qr.html')) {
    initQrPage();
    return;
  }

  const bookingComediansList = document.querySelector('.booking__comedians-list');
  const bookingForm = document.querySelector('.booking__form');
  const quantityOfComedians = document.querySelector('.event__info-item_comedians, .event__info-number');
  const bookingInputFullname = document.querySelector('.booking__input_fullname');
  const bookingInputPhone = document.querySelector('.booking__input_phone');
  const bookingInputTicket = document.querySelector('.booking__input_ticket');
  const event = document.querySelector('.event');
  const booking = document.querySelector('.booking');
  const eventButtonReserve = document.querySelector('.event__button_reserve');
  const eventButtonEdit = document.querySelector('.event__button_edit');
  const bookingTitle = document.querySelector('.booking__title');

  const comedians = await getComedians();

  if (comedians) {
    quantityOfComedians.textContent = comedians.length;

    const changeSection = initChangeSection(
      event,
      booking,
      eventButtonReserve,
      eventButtonEdit,
      bookingTitle,
      bookingForm,
      comedians,
      bookingComediansList
    );

    initForm(
      bookingForm,
      bookingInputFullname,
      bookingInputPhone,
      bookingInputTicket,
      bookingComediansList,
      changeSection
    );
  }
};

init();
