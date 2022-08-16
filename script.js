//My old code

let day = '2002-12-09T00:00:00.000Z';

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

//const renderBookings = fetchAllBookings().then((data) => renderBookings2(data));

const renderBookings = async function () {
  container.innerHTML = '';
  const bookingsObj = await fetchAllBookings();
  const markup = `
  <nav class="navbar navbar-dark navbar-expand-lg bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Booking App</a>
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
            <a class="nav-link active" aria-current="page" href="#">Home</a>
            <a class="nav-link" href="#">New Booking</a>
            <a class="nav-link" href="#">Contact</a>
          </div>
        </div>
      </div>
    </nav>
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
  <footer class="bg-light text-center text-lg-start fixed-bottom">
    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.489)">
      © 2022 Copyright:
      <a class="text-dark" href="https://solomka.dev/">solomka.dev</a>
    </div>
    <!-- Copyright -->
  </footer>
   `;
  container.insertAdjacentHTML('afterbegin', markup);
  const buttonsOpen = document.querySelectorAll('.btn-booking');
  buttonsOpen.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      editBooking(event.target.id);
    });
  });
};

const editBooking = async function (bookingId) {
  container.innerHTML = '';
  const booking = await fetchOneBookings(bookingId);
  console.log(booking);
  const markup = `
  <nav class="navbar navbar-dark navbar-expand-lg bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Booking App</a>
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
            <a class="nav-link active" aria-current="page" href="#">Home</a>
            <a class="nav-link" href="#">New Booking</a>
            <a class="nav-link" href="#">Contact</a>
          </div>
        </div>
      </div>
    </nav>
        <h1>Edit booking</h1>
<form class="" action="/bookings/<%=booking._id%>" method="post">
  <div class="form-group">
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

  </div>
  <button class="btn btn-primary" type="submit" name="button">Save</button>
</form>
<form  action="/delete" method="post">
    <button class="btn btn-primary" type="submit" name="delete"  value=${booking._id} >DELETE</button>
</form>

  <footer class="bg-light text-center text-lg-start fixed-bottom">
    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.489)">
      © 2022 Copyright:
      <a class="text-dark" href="https://solomka.dev/">solomka.dev</a>
    </div>
    <!-- Copyright -->
  </footer>
   `;
  container.insertAdjacentHTML('afterbegin', markup);
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

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
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

    if (i > paddingDays) {
      daySquere.innerText = i - paddingDays;

      daySquere.addEventListener('click', renderBookings);
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
