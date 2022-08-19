//My old code

let day;

const menuNavigation = `
<nav class="navbar navbar-dark navbar-expand-lg bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="" id="home">Booking App</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <a class="nav-link" href="" id="home">Home</a>
          <a class="nav-link" href="" id="new-booking">New Booking</a>
          <a class="nav-link" href="">Contact</a>
        </div>
      </div>
    </div>
  </nav>`;

const loadButtonsMenuNavigation = function () {
  const buttonHome = document.getElementById('home');
  const buttonNewBooking = document.getElementById('new-booking');
  buttonNewBooking.addEventListener('click', newBookingForm);
  buttonHome.addEventListener('click', () => window.location.reload());
};

const fetchAllBookings = async function () {
  const response = await fetch('http://localhost:5000/bookings/');
  if (!response.ok) throw new Error('Something  wrong');
  const data = await response.json();
  return data;
};

const fetchOneBookings = async function (id) {
  const response = await fetch(`http://localhost:5000/bookings/${id}`);
  if (!response.ok) throw new Error('Something  wrong');
  const data = await response.json();
  return data;
};

const renderBookingsOfDay = async function (bookingDay) {
  container.innerHTML = '';
  day = bookingDay;
  //console.log(bookingDay);
  const bookingsObj = await fetchAllBookings();
  const renderBookingsForm = `
    <table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">DATE</th>
      <th scope="col">TIME</th>
      <th scope="col">PAX</th>
      <th scope="col">NAME</th>
      <th scope="col">REQUESTS</th>
      <th scope="col">CONTACT</th>
      <th scope="col">EDIT</th>
    </tr>
  </thead>
  <tbody>

${bookingsObj

  .filter((book) => book.date === day)
  .map((book) => {
    return `      <tr>
        <th scope="row">${book.date}</th>
        <td>${book.time}</td>
        <td>${book.amount}</td>
        <td>${book.name}</td>
        <td>${book.requests}</td>
        <td>${book.contact} </td>
        <td> <button class="btn btn-secondary btn-booking" id = ${book._id} >EDIT</button></td></tr>`;
  })
  .join('\n')}
  </tbody>
  </table>
   `;

  container.insertAdjacentHTML(
    'afterbegin',
    menuNavigation + renderBookingsForm
  );
  const buttonsOpen = document.querySelectorAll('.btn-booking');
  loadButtonsMenuNavigation();
  buttonsOpen.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      editBookingForm(event.target.id);
    });
  });
};

const editBookingForm = async function (bookingId) {
  container.innerHTML = '';
  const booking = await fetchOneBookings(bookingId);
  //console.log(booking);
  const editBookingForm = `
        <h2>Edit booking</h2>

    <form id="form">
    <label>Date</label>
    <input class="form-control" type="text" name="date" value = ${booking.date}>
    <label>Time</label>
    <input class="form-control" type="text" name="time" value = ${booking.time}> 
    <label>Amount</label>
    <input class="form-control" type="text" name="amount" value = ${booking.amount}>
    <label>Name</label>
    <input class="form-control" type="text" name="name" value = ${booking.name}>
    <label>Request</label>
    <input class="form-control" type="text" name="requests" value = ${booking.requests}>
    <label>Contact</label>
    <input class="form-control" type="text" name="contact" value = ${booking.contact}>
    <button class="btn btn-primary btn-save" type="submit" id = ${booking._id} >Save</button>
    </form>
    <button class="btn btn-primary btn-delete" type="delete"   id = ${booking._id} >DELETE</button>

   `;
  container.insertAdjacentHTML('afterbegin', menuNavigation + editBookingForm);
  const form = document.getElementById('form');
  const btnDelete = document.querySelector('.btn-delete');
  form.addEventListener('submit', editBookingSubmit);
  btnDelete.addEventListener('click', deleteBookingSubmit);
};

const editBookingSubmit = async function (event) {
  event.preventDefault();
  const id = event.target[6].id;
  const form = event.currentTarget;
  const formData = new FormData(form);
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);

  try {
    const response = await fetch(`http://localhost:5000/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formDataJsonString,
    });
    const data = await response.json();
    // enter you logic when the fetch is successful
    console.log(data);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error);
  }
  container.innerHTML = '';
  renderBookingsOfDay(day);
};

const deleteBookingSubmit = async function (event) {
  event.preventDefault();
  const id = event.target.id;
  try {
    const response = await fetch(`http://localhost:5000/bookings/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    // enter you logic when the fetch is successful
    console.log(data);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error);
  }
  container.innerHTML = '';
  renderBookingsOfDay(day);
};

const newBookingSubmit = async function (event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const plainFormData = Object.fromEntries(formData.entries());
  const formDataJsonString = JSON.stringify(plainFormData);
  try {
    const response = await fetch('http://localhost:5000/bookings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formDataJsonString,
    });
    const data = await response.json();
    renderBookingsOfDay(day);
  } catch (error) {
    console.log(error);
  }
};

const newBookingForm = function (event) {
  event.preventDefault();
  container.innerHTML = '';
  const newBookingForm = `
        <h2> New booking</h2>

  <form id="form">
    <label>Date</label>
    <input class="form-control" type="text" name="date" value="${day}">
    <label>Time</label>
    <input class="form-control" type="text" name="time" value=" " > 
    <label>Amount</label>
    <input class="form-control" type="text" name="amount" value=" " >
    <label>Name</label>
    <input class="form-control" type="text" name="name" value=" " >
    <label>Request</label>
    <input class="form-control" type="text" name="requests" value=" ">
    <label>Contact</label>
    <input class="form-control" type="text" name="contact" value=" ">
    <button class="btn btn-primary btn-save"  type="submit" >Submit</button>
  </form>
   `;
  container.insertAdjacentHTML('afterbegin', menuNavigation + newBookingForm);
  const form = document.getElementById('form');
  form.addEventListener('submit', newBookingSubmit);
  loadButtonsMenuNavigation();
};

//Calendar rendering
let nav = 0;
let clicked = null;

const calendar = document.getElementById('calendar');
const container = document.getElementById('container');

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/* function openModal(date) {
  clicked = date;
  const eventForDay = events.find((e) => e.date === clicked);
  if (eventForDay) {
    console.log('We have booings here');
  } else {
    console.log('Make new booking');
  }
} */

async function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  const allEvents = await fetchAllBookings();
  //const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString(
    'en-us',
    { month: 'long' }
  )} ${year}`;

  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquere = document.createElement('div');
    daySquere.classList.add('day');

    const dayString = `${i - paddingDays}/${month + 1}/${year}`;

    if (i > paddingDays) {
      daySquere.innerText = i - paddingDays;

      //const allEvents = await fetchAllBookings();
      const eventsForDay = allEvents.find((e) => e.date === dayString);
      console.log(eventsForDay);
      if (eventsForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventsForDay.amount;
        daySquere.appendChild(eventDiv);
      }

      daySquere.addEventListener('click', () => renderBookingsOfDay(dayString));
    } else {
      daySquere.classList.add('padding');
    }
    calendar.appendChild(daySquere);
  }
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });
  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
}

initButtons();
load();
