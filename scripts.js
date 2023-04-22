document.addEventListener("DOMContentLoaded", function () {
  const current__theme = localStorage.getItem("theme") || "theme__light";

  document.body.classList.add(current__theme);
});

const theme__switcher = document.querySelector(".theme__btn");

const searchInput = document.querySelector(".header__input");
let currentSearchParam = "";
let searchInputTimer;

const id = document.getElementById("id");
const clientName = document.getElementById("clientName");
const createdAt = document.getElementById("createdAt");
const updatedAt = document.getElementById("updatedAt");

let currentSortType = "id";
let currentSortOrder = "asc";

const tbody = document.getElementById("tbody");

const mainActionSection = document.querySelector(".main__action");

const snackbar = document.getElementById("snackbar");

const OPTION__VALUES = {
  phone: "Phone",
  email: "Email",
  facebook: "Facebook",
  telegram: "Telegram",
  other: "Other",
};

const loader = document.createElement("div");
loader.classList.add("loader");

// Request

const getRequest = async (id = "", searchParam = "") => {
  tbody.append(loader);
  let url = "https://js-dashboard-api.onrender.com/api/clients";

  if (id) {
    url += `/${id}`;
  }

  if (searchParam) {
    url += `?search=${searchParam}`;
  }

  try {
    const response = await fetch(url);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      error: "Error fetching data. Please try again later.",
    };
  }
};

// Request

// Button

const editClient = (id) => {
  console.log(id);
};

const deleteClient = (id) => {
  console.log(id);
};

const createButton = (classes, icon, label, onClick) => {
  const button = document.createElement("button");
  const iconElement = document.createElement("img");
  const buttonText = document.createElement("span");

  button.classList.add(...classes);
  iconElement.classList.add("icon__image")
  iconElement.src = `./assets/icons/${icon}.svg`;
  buttonText.classList.add("btn__text");

  if (label.length > 0) {
    buttonText.innerText = label;
  }

  if (icon.length > 0 || label.length > 0) {
    button.append(iconElement, buttonText);
  }

  button.addEventListener("click", onClick);

  return button;
};

// Button

const cleanTable = () => {
  const rows = document.querySelectorAll(".row");

  rows.forEach((row) => {
    row.remove();
  });
};

const compareByField = (field, sortOrder) => (a, b) => {
  const fa = a[field];
  const fb = b[field];

  if (sortOrder === "asc") {
    return fa.localeCompare(fb);
  }

  return fb.localeCompare(fa);
};

const sortClients = (sortBy, sortOrder, clients = []) => {
  let clientsList = clients;

  if (sortBy === "id") {
    clientsList.sort(compareByField("id", sortOrder));
  } else if (sortBy === "surname") {
    clientsList.sort(compareByField("surname", sortOrder));
  } else {
    clientsList.sort(compareByField(sortBy, sortOrder));
  }
};

const formatedDate = (date) => {
  let day = date.getDate();
  if (day < 10) dd = `0${day}`;

  let month = date.getMonth() + 1;
  if (month < 10) month = `0${month}`;

  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const formatedTime = (time) => {
  let resultTime = time;
  if (time < 10) resultTime = `0${resultTime}`;

  return resultTime;
};

const createContactIcon = (contact) => {
  const contactElementWithToolTip = document.createElement("a");
  let link = contact.value;
  let hostStyle = "invisible";
  let hostText = contact.type;

  if (contact.type === "Phone") link = `tel:${link}`;
  if (contact.type === "Email") link = `mailto:${link}`;
  if (contact.type === "Other") {
    const url = contact.value;
    const { host } = new URL(url);

    hostText = host.split(".")[0];
    hostStyle = "";
  }

  contactElementWithToolTip.href = link;
  contactElementWithToolTip.classList.add("contact");

  const contactElement = document.createElement("img");
  contactElement.src = `./assets/icons/${contact.type}.svg`;
  contactElementWithToolTip.append(contactElement);

  const contactToolTip = document.createElement("div");
  contactToolTip.classList.add("contact__tooltip");
  contactToolTip.innerHTML = `
    <div class="tooltip__textWrapper">
      <span class="tooltip__text ${hostStyle}">
      ${hostText}: 
      </span>
      <span class="tooltip__textLink">
      ${contact.value}
      </span>
    </div>
    <div class="tooltip__arrow"></div>
  `;

  contactElementWithToolTip.append(contactToolTip);

  return contactElementWithToolTip;
};



const placeContacts = (
  contacts,
  contactsClass,
  clientsQuantity,
  contactsWrapper,
  tableDataCell
) => {
  let counter = 0;

  let max = Math.min(clientsQuantity, contacts.length);

    if (contacts.length > 0) {
      while (counter < max) {
        const clientContact = createContactIcon(contacts[counter]);
        clientContact.classList.add(contactsClass);

        contactsWrapper.append(clientContact);
        tableDataCell.append(contactsWrapper);

        counter++;
      }
    }
};

const handleExpandContacts = (
  expandElement,
  contacts,
  previousContactsClass,
  contactsWrapper,
  tableDataCell
) => {
  const contactsElements = document.getElementsByClassName(
    previousContactsClass
  );

  expandElement.remove();

  Array.from(contactsElements).forEach((contactElement) => {
    contactElement.remove();
  });

  placeContacts(
    contacts,
    previousContactsClass,
    10,
    contactsWrapper,
    tableDataCell
  );
};


const loadContacts = (sortBy, sortOrder, searchParam) => {
  getRequest("", searchParam).then((clients) => {
    sortClients(sortBy, sortOrder, clients);

    cleanTable();

    clients.forEach((client) => {
      const createdDate = new Date(client.createdAt);

      const createdDateHour = formatedTime(createdDate.getHours());
      const createdDateMinute = formatedTime(createdDate.getMinutes());

      const updatedDate = new Date(client.updatedAt);

      const updatedDateHour = formatedTime(updatedDate.getHours());
      const updatedDateMinute = formatedTime(updatedDate.getMinutes());

      const row = document.createElement("tr");
      row.classList.add("row");

      row.innerHTML = `
                <td>
                    <a class="table__dataLink" href = "./client/index.html?id=${
                      client.id
                    }">${client.id}</a>
                </td>

                <td>
                    <a class="table__dataLink" href = "./client/index.html?id=${
                      client.id
                    }">${client.surname} ${client.name} ${client.lastName}</a>
                </td>

                <td>
                    <span class="table__data client__creationDate">${formatedDate(
                      createdDate
                    )}</span>
                    <span class="table__data client__creationTime">${createdDateHour}:${createdDateMinute}</span>
                </td>

                <td>
                    <span class="table__data client__lastChangeDate">${formatedDate(
                      updatedDate
                    )}</span>
                    <span class="table__data client__lastChangeTime">${updatedDateHour}:${updatedDateMinute}</span>
                </td>
        `;

      const tableDataClientContacts = document.createElement("td");
      const tableDataClientContactsContent = document.createElement("div");
      tableDataClientContactsContent.classList.add("table__dataContent");

      placeContacts(
        client.contacts,
        client.id,
        4,
        tableDataClientContactsContent,
        tableDataClientContacts
      );

      const expandButton = document.createElement("div");

      if (client.contacts.length >= 5) {
        expandButton.classList.add("table__contactsExpand");
        expandButton.innerText = `+${client.contacts.length - 4}`;

        tableDataClientContactsContent.append(expandButton);
        tableDataClientContacts.append(tableDataClientContactsContent);

        expandButton.addEventListener("click", () =>
          handleExpandContacts(
            expandButton,
            client.contacts,
            client.id,
            tableDataClientContactsContent,
            tableDataClientContacts
          )
        );
      }

      const tableDataClientActions = document.createElement("td");
      tableDataClientActions.classList.add("table__dataActions");

      const tableDataClientActionsContent = document.createElement("div");

      const editClientButton = createButton(
        ["btn", "btn__text"],
        "edit",
        "Edit",
        () => editClient(client.id)
      );

      const deleteClientButton = createButton(
        ["btn", "btn__text"],
        "delete",
        "Delete",
        () => deleteClient(client.id)
      );

      tableDataClientActionsContent.append(
        editClientButton,
        deleteClientButton
      );

      tableDataClientActions.append(tableDataClientActionsContent)

      row.append(tableDataClientContacts, tableDataClientActions);

      tbody.append(row);
    });

    loader.remove();
  });
};

loadContacts("id", "asc", "");

theme__switcher.addEventListener("click", function () {
  const active__icon = document.querySelector(".active");
  const inactive__icon = document.querySelector(".inactive");

  active__icon.classList.toggle("active");
  active__icon.classList.toggle("inactive");

  inactive__icon.classList.toggle("inactive");
  inactive__icon.classList.toggle("active");

  document.body.classList.toggle("theme__light");
  document.body.classList.toggle("theme__dark");

  localStorage.setItem("theme", document.body.classList.value);
});
