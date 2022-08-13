const afterNavDiv = document.querySelector('.after-nav-div');
const bookingsHead = document.querySelector('.bookings_head');

let day = '2002-12-09T00:00:00.000Z';

const fetchAllBookings = async function () {
  const response = await fetch('http://localhost:5000/bookings/');
  if (!response.ok) throw new Error('Something  wrong');
  const data = await response.json();
  return data;
};

const renderBookings = function (bookingsObj) {
  afterNavDiv.innerHTML = '';
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
  afterNavDiv.insertAdjacentHTML('afterbegin', markup);
};

const renderCalendar = function () {
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

  afterNavDiv.insertAdjacentHTML('afterbegin', calendar);
};

//fetchAllBookings().then((data) => renderCalendar(data));
//fetchAllBookings().then((data) => renderBookings(data));
