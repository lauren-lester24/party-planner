const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/";
const COHORT = "2506-ct-web-pt";
const API = BASE + COHORT;
console.log(API);

// State
let events = [];
let selectedEvent = null;


//Actions
//GET ALL THE RECIEPES
//AWAIT response.JSON - turns body into javascript object
async function getEvents() {
  try {
    const response = await fetch(`${API}/events`);
    const result = await response.json();
    events = result.data;

    render();


  } catch (error) {
    console.error(error, "/There was an error /GET Event");
  }
}

async function addEvents(eventObj) {
  try {
    await fetch(`${API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventObj),
    });
    await getEvents(); // Mutation refresh the the api
  } catch (error) {
    console.error("Error with /POST", error);
  }
}


async function getSingleEvent(id) {
  try {
    const response = await fetch(`${API}/events/${id}`);
    const result = await response.json();
    selectedEvent = result.data;
    render();
    
  } catch (error) {
    console.error("There was an error /GET Event", error);
  }
}


async function deleteEvent(id) {
  try {
    await fetch(`${API}/events/${id}`, { method: "DELETE" });
    if (selectedEvent && selectedEvent.id === id) {
      selectedEvent = null;
    }
    await getEvents(); // Mutation refresh the api
  } catch (error) {
    console.error("There was an error with /DELETE", error);
  }
}

async function updateEvents(id, updatedEventObj) {
  try {
    await fetch(`${API}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEventsObj),
    });
    // If we're in single view of this event, refresh that; otherwise refresh list
    if (selectedEvents && selectedEvents.id === id) {
      await getEvent(id);
    } else {
      await getEvent();
    }
  } catch (error) {
    console.error("There was an Error /PUT", error);
  }
}


// Components
// Single Event detail view
function SingleEvent() {
  const event = selectedEvent;
  const $view = document.createElement("article");
  $view.classList.add("single-event");

  $view.innerHTML = `
     <a href="#" class="back">Back</a>
            <h2>${event.name} #${event.id}</h2>
            <figure>
                <img src=${event.imageUrl} alt=${event.name}>
                <p class="desc">${event.description}</p>
            </figure>
            <form class="edit-form" hidden>
                <label for="name">Name</label>
                <input type="text" name="name" type="name" id="name" value="${event.name}" required>
                <label for="description">Description</label>
                <input type="text" name="description" id="description" value="${event.description}">
                <label for="imageUrl">ImageUrl</label>
                <input type="text" name="imageUrl" id="imageUrl" value="${event.imageUrl}">
            </form>

            <div class="single-actions">
                <button class="action" data-action="edit" data-id=${event.id}>Edit</button>
                <a href="#" class="delete" data-id=${event.id}>Delete</a>
            </div>
    
    `;

  const $back = $view.querySelector(".back");
  const $btn = $view.querySelector(".action");
  const $form = $view.querySelector(".edit-form");
  const $del = $view.querySelector(".delete");

  //back to list
  $back.addEventListener("click", function (event) {
    event.preventDefault();
    selectedEvent = null;
    render();
  });

  $btn.addEventListener("click", async function (event) {
    const id = Number(event.currentTarget.dataset.id);
    const action = event.currentTarget.dataset.action;

    if (action === "edit") {
      $form.hidden = false;
      event.currentTarget.dataset.action = "save";
      event.currentTarget.textContent = "Save";
      return;
    }
    if (action === "save") {
      const data = new FormData($form);
      const updatedObj = {
        name: data.get("name"),
        description: data.get("description"),
        imageUrl: data.get("imageUrl"),
      };
      await updateEvent(id, updatedObj);
      $form.hidden = true;
      event.currentTarget.dataset.action = "edit";
      event.currentTarget.textContent = "Edit";
    }
  });

  $del.addEventListener("click", async function (event) {
    event.preventDefault();
    const id = Number(event.currentTarget.dataset.id);
    await deleteEvent(id);
  });

  return $view;
}




function EventCollection() {
  const $collection = document.createElement("article");
  $collection.classList.add("events");
  if (!events || events.length === 0) {
    $collection.innerHTML = `<p>No Events yet...</p>`;
  } 
   const $event = events.map(EventCard);
   $collection.replaceChildren(...$event);
   console.log("$$collection", $collection);
  return $collection;
}





function EventCard(event) {
  const $card = document.createElement("article");
  $card.classList.add("event");

  $card.innerHTML = `
 <h2>${event.name}</h2>
            <figure>
                <img src=${event.imageUrl} alt={event.name}>
            </figure>
            <p>${event.description}</p>

<button class="action" data-action="view" data-id=${event.id}>
                View
            </button>
`;

  //TODO: View Button Logic
  $card
    .querySelector(".action")
    .addEventListener("click", async function (event) {
      const action = event.currentTarget.dataset.action;
      const id = Number(event.currentTarget.dataset.id);
      if (action === "view") {
        await getEvent(id);
      }
    });

  return $card;
}

function NewEventForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
            <label for="name">Name</label>
            <input type="text" name="name" type="name" id="name" required>
            <label for="description">Description</label>
            <input type="text" name="description" id="description">
             <label for="imageUrl">ImageUrl</label>
            <input type="text" name="imageUrl" id="imageUrl">
            <button>Add new event</button>
  `;
  $form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = new FormData($form);
    const newEventObj = {
      name: data.get("name"),
      imageUrl: data.get("imageUrl"),
      description: data.get("description"),
    };
    await addEvent(newEventObj);
    $form.reset();
  });
  return $form;
}


// Render - VIEW
function render() {
  const $app = document.querySelector("#app");

  if (selectedEvent) {
    $app.innerHTML = `<h1>Event</h1>
                      <SingleEvent></SingleEvent>
    
    `;
    $app.querySelector("SingleEvent").replaceWith(SingleEvent());
  } else {
    $app.innerHTML = `
    <h1>Events</h1>
    <NewEventForm></NewEventForm>
    <EventCollection></EventCollection>`;
    $app.querySelector("NewEventForm").replaceWith(NewEventForm());
    $app.querySelector("EventCollection").replaceWith(EventCollection());
  }
}


getEvents();

async function init() {
  await getEvents();
  render();
}
init();
