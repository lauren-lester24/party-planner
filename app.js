// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/";
const COHORT = "2506-ftb-ct-web-pt"; // This has been changed and is up to date.
const API = BASE + COHORT;

// State
let events = [];
let selectedEvents;
let guest = [];
let rsvps = [];



/** Updates state with all events from the API */
async function getEvents() {
  try {
   const response = await fetch(`${API}/events`);
    const result = await response.json();
    events = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single event from the API */
async function getEvent(id) {
  try {
    const response = await fetch(`${API}/events/${id}`);
const result = await response.json();
    selectedEvents = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

async function getGuests() {
  try {
    const res = await fetch(`${API}/guests`);
    const result = await response.json();
    guests = result.data;
  } catch (error) {
    console.error("Failed to fetch guests:", error);
  }
}


// === Components ===

/** Event name that shows more details about the Event when clicked */
function EventListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `
    <a href="#selected">${event.name}</a>
  `;
  $li.addEventListener("click", () => getEvent(event.id));
  return $li;
}
async function getRSVPs() {
  try {
    const res = await fetch(`${API}/rsvps`);
    const result = await response.json();
    rsvps = result.data;
  } catch (error) {
    console.error("Failed to fetch RSVPs:", error);
  }
}




/** A list of names of all events */
function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  const $events = events.map(EventListItem);
  $ul.replaceChildren(...$events);

  return $ul;
}

/** Detailed information about the selected event */
function EventDetails() {
  if (!selectedEvents) {
    const $p = document.createElement("p");
    $p.textContent = "Please select an event to learn more.";
    return $p;
  }

  const $event = document.createElement("section");
  $event.classList.add("event");
  $event.innerHTML = `
    <h3>${selectedEvents.name} #${selectedEvents.id}</h3>

   <p>${selectedEvents.date}</p>
   <p>${selectedEvents.location}</p>

    <p>${selectedEvents.description}</p>
  
  `;



  return $event;
}



// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <EventList></EventList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <EventDetails></EventDetails>
      </section>
    </main>
  `;
  $app.querySelector("EventList").replaceWith(EventList());
  $app.querySelector("EventDetails").replaceWith(EventDetails());
}

async function init() {
  await getEvents();
   await getRSVPs();
  await getGuests();
 
  render();
}

init();