//My old code

let day = '2002-12-09T00:00:00.000Z';

const fetchAllBookings = async function () {
  const response = await fetch('http://localhost:5000/bookings/');
  if (!response.ok) throw new Error('Something  wrong');
  const data = await response.json();
  return data;
};

//const renderBookings = fetchAllBookings().then((data) => renderBookings2(data));

const renderBookings = async function () {
  container.innerHTML = '';
  const bookingsObj = await fetchAllBookings();
  console.log(bookingsObj);
  const markup = `<table class="table table-striped">
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
        <td> <button class="btn btn-secondary btn-booking id = ${book._id}" >OPEN</button></td></tr>`;
  })
  .join('\n')}
  </tbody>
  </table> `;
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

//fetchAllBookings();
initButtons();
load();

/* const renderCalendar = function () {
  const calendar = `<table class="table table-dark">
  <thead>
    ...
  </thead>
  <tbody>
    <tr class="table-active">
      ...
    </tr>
    <tr>
      ...
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2" class="table-active">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>`;

  afterNavDiv.insertAdjacentHTML("afterbegin", calendar);
}; */

//fetchAllBookings().then((data) => renderCalendar(data));
//fetchAllBookings().then((data) => renderBookings(data));
