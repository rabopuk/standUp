import { Notification } from "./Notification.js";
import { getClient, getComedians } from "./api.js";
import { displayBooking, displayClientInfo } from "./display.js";
import { showQRController } from "./showQRController.js";

const getTicketNumber = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  return urlParams.get('t');
};

export const initQrPage = async () => {
  const clientInfo = document.querySelector('.booking__client-info');
  const bookingPerformance = document.querySelector('.booking__performance');

  const ticketNumber = getTicketNumber();

  if (ticketNumber) {
    const clientData = await getClient(ticketNumber);
    displayClientInfo(clientInfo, clientData);

    const comediansData = await getComedians(ticketNumber);
    displayBooking(bookingPerformance, clientData, comediansData);

    showQRController(bookingPerformance);
  } else {
    Notification.getInstance().show('Произошла ошибка, проверьте ссылку');
  }
};