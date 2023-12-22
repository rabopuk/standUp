import { createComedianBlock } from "./comedians.js";

export const initChangeSection = (
  event,
  booking,
  eventButtonReserve,
  eventButtonEdit,
  bookingTitle,
  bookingForm,
  comedians,
  bookingComediansList
) => {
  eventButtonReserve.style.transition = 'opacity .4s, visibility .4s';
  eventButtonEdit.style.transition = 'opacity .4s, visibility .4s';

  eventButtonReserve.classList.remove('event__button_hidden');
  eventButtonEdit.classList.remove('event__button_hidden');

  const changeSection = () => {
    event.classList.toggle('event_hidden');
    booking.classList.toggle('booking_hidden');

    if (!booking.classList.contains('booking_hidden')) {
      const comedianBlock = createComedianBlock(comedians, bookingComediansList);
      bookingComediansList.append(comedianBlock);
    }
  };

  eventButtonReserve.addEventListener('click', () => {
    changeSection();
    bookingTitle.textContent = 'Забронируйте место в зале';
    bookingForm.method = 'POST';
  });

  eventButtonEdit.addEventListener('click', () => {
    changeSection();
    bookingTitle.textContent = 'Редактирование брони';
    bookingForm.method = 'PATCH';
  });

  return changeSection;
};
