//My old code

let day;

const menuNavigation = `
<nav> 
<input type="checkbox" id="check">
<label for="check" class="checkbtn" >
<i class="fas fa-bars" ></i>
</label>

<label class ="logo">BookingApp</label> 
<ul>
  <li><a class ="active" href="" id="month-view">Month view</a></li>
  <li><a href="" id="new-booking">New Booking</a></li>
  <li><a href="" href="">Contact</a></li>
</ul>   
</nav>`;

const loadButtonsMenuNavigation = function () {
  document.querySelector('link[href$="calendar.css"]').remove();
  const btnMonthView = document.getElementById('month-view');
  const btnonNewBooking = document.getElementById('new-booking');
  btnonNewBooking.addEventListener('click', newBookingForm);
  btnMonthView.addEventListener('click', () => window.location.reload());
};

const fetchAllBookings = async function () {
  const response = await fetch('https://bookingsapi.herokuapp.com/bookings/');
  if (!response.ok) throw new Error('Something  wrong');
  const data = await response.json();
  return data;
};

const fetchOneBookings = async function (id) {
  const response = await fetch(
    `https://bookingsapi.herokuapp.com/bookings/${id}`
  );
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
   

  <table>
  <caption>Bookings for : ${day}</caption>
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
    return `      
        <tr>
      <td scope="row" data-label="Date">${book.date}</td>
      <td data-label="Time">${book.time}</td>
      <td data-label="Amount">${book.amount}</td>
      <td data-label="Name">${book.name}</td>
      <td data-label="Requests">${book.requests}</td>
      <td data-label="Contact">${book.contact}</td>
      <td ><button class=" btn-booking" id = ${book._id} >EDIT</button></td>
    </tr>
    `;
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
    const response = await fetch(
      `https://bookingsapi.herokuapp.com/bookings/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formDataJsonString,
      }
    );
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
    const response = await fetch(
      `https://bookingsapi.herokuapp.com/bookings/${id}`,
      {
        method: 'DELETE',
      }
    );
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
    const response = await fetch(
      'https://bookingsapi.herokuapp.com/bookings/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formDataJsonString,
      }
    );
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

async function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  const allEvents = await fetchAllBookings();
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

  // Making summ of all amount of people per individual day
  let result = [];
  allEvents.reduce(function (res, value) {
    let onlyDate = value.date;

    if (!res[onlyDate]) {
      res[onlyDate] = { date: onlyDate, amount: 0 };
      result.push(res[onlyDate]);
    }
    res[onlyDate].amount += value.amount;
    return res;
  }, {});
  //
  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquere = document.createElement('div');
    daySquere.classList.add('day');

    const dayString = `${i - paddingDays}/${month + 1}/${year}`;

    if (i > paddingDays) {
      daySquere.innerText = i - paddingDays;
      const eventsForDay = result.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquere.id = 'currentDay';
      }
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
