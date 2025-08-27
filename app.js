const BASE_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api"

const COHORT = "2506-FTB-CT-WEB-PT"

const API = `${BASE_URL}/${COHORT}`

console.log(API);


// State
let events = [];


// GET ALL THE RECIEPES
async function getEvents(){
try {
  const response = await fetch(`${API}/events`);
  const events = await response.json();

  return events.data;
render();

} catch (error) {
  console.error("There was an error /GET Event", error);
}
}

// AWAIT response.JSON - turns body into javascript object
async function getSingleEvent() {
  try {
    const response = await fetch(`${API}/events/${id}`)
    const singleEvent = await response.json();
console.log(singleEvent);
    return singleEvent.data;


  } catch (error) {
    console.error("There was an error /GET Event", error);
  }
}






function EventCard(event){

const $card = document.createElement("article");
$card.classList.add("event");

$card.innerHTML = `
 <h2>${event.name}</h2>
            <figure>
                <img src=${event.imageUrl} alt={event.name}>
            </figure>
            <p>${event.description}</p>
`;
return $card;
}


function EventCollection() {
  const $collection = document.createElement("article");
  $collection.classList.add("events");
  const $events = events.map(EventCard);
  $collection.replaceChildren(...$events);
  return $events;
}

function render(){
  const $app = document.querySelector("#app");
  $app.innerHTML = `
  <h1>Events</h1>
<EventCollection></EventCollection>
  `;
  $app.querySelector("EventCollection").replaceWith(EventCollection());
}

async function init() {
  await getEvents();
  render();
}
init();