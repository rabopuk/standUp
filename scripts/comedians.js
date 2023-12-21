import TomSelect from 'tom-select';

const MAX_COMEDIANS = 6;

export const createComedianBlock = (comedians, bookingComediansList) => {
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
      const nextComedianBlock = createComedianBlock(comedians, bookingComediansList);

      bookingComediansList.append(nextComedianBlock);
    }

    bookingTomSelectTime.off('change', createNextBookingComedian);
  };

  bookingTomSelectTime.on('change', createNextBookingComedian);

  return bookingComedian;
};
