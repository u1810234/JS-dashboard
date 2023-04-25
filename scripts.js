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
  linkedin: "LinkedIn",
  telegram: "Telegram",
  other: "Other",
};

const loader = document.createElement("div");
loader.classList.add("loader");

const modal = document.querySelector("div");

let contactsQuantity = 0;
let currentStep = 0;

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

// Input

const createInput = (
  classes,
  nameFor,
  label,
  placeholder,
  value = "",
  required = true,
  helpTextValue
) => {
  const inputBox = document.createElement("div");
  inputBox.classList.add("form__input", "my__3");

  const input = document.createElement("input");
  input.classList.add(...classes);
  input.type = "text";
  input.name = nameFor;
  input.value = value;
  input.placeholder = placeholder;
  input.required = required;

  const inputLabel = document.createElement("label");
  inputLabel.for = nameFor;
  inputLabel.innerText = label;

  const helpText = document.createElement("span");
  helpText.innerHTML = helpTextValue;

  inputBox.append(input, inputLabel, helpText);

  return inputBox;
};

// Input

const createClientContact = (
  currentDropdownSelectValue,
  currentContactInfo,
  contactID
) => {
  const contactDataField = document.createElement("div");
  contactDataField.classList.add("contact__dataField");

  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown__container");

  const dropdown = document.createElement("select");
  dropdown.innerHTML = `
    <option value="${currentDropdownSelectValue}" selected disabled hidden>${OPTION__VALUES[currentDropdownSelectValue]}</option>
    <option value="phone">Phone</option>
    <option value="email">Email</option>
    <option value="linkedin">LinkedIn</option>
    <option value="telegram">Telegram</option>
    <option value="other">other</option>
  `;

  dropdownContainer.append(dropdown);

  const input = createInput(
    ["input", "formInput__name"],
    `contact__${contactID}`,
    "Enter contact detail",
    "",
    "",
    true,
    ""
  );

  const deleteButtonContainer = document.createElement("div");
  deleteButtonContainer.classList.add("deleteButton__container");

  const deleteButton = createButton(
    ["btn", "btn__outlined", "btn__text", "btn__icon"],
    "delete",
    "",
    () => console.log("contact will be deleted")
  );

  deleteButtonContainer.append(deleteButton);

  contactDataField.append(dropdownContainer, input, deleteButtonContainer);

  return contactDataField;
};

// Modal

const closeModal = () => {
  document.querySelector(".modal__content").remove();
  document.querySelector(".modal__header").remove();
  document.querySelector(".modal").remove();
  document.querySelector(".modal__container").remove();

  contactsQuantity = 0;
};

const openModal = (title, content) => {
  const modal__container = document.createElement("div");
  const modal = document.createElement("div");
  const modal__content = document.createElement("div");
  const modal__header = document.createElement("div");
  const modal__footer = document.createElement("div");
  const modalBtn__close = createButton(
    ["btn", "btn__outlined", "btn__text", "btn__icon"],
    "exit",
    "",
    () => closeModal()
  );

  const modalBtn__save = createButton(
    ["btn", "btn__outlined", "btn__text"],
    "",
    "Save",
    () => console.log("Save")
  );

  const modalBtn__cancel = createButton(
    ["btn", "btn__outlined", "btn__text"],
    "",
    "Cancel",
    () => closeModal()
  );

  modal__container.classList.add("modal__container");
  modal.classList.add("modal");
  modal__header.classList.add("modal__header");

  modal__header.innerHTML = `
    <span class="modalHeader__text">${title}</span>
  `;
  modal__header.append(modalBtn__close);

  modal__content.classList.add("modal__content");
  modal__content.append(content);

  modal__footer.classList.add("modal__footer");
  modal__footer.append(modalBtn__save, modalBtn__cancel);

  modal.append(modal__header, modal__content, modal__footer);
  modal__container.append(modal);

  document.body.append(modal__container);
};

// Modal

// Button

const createNewClientContact = (element, id, type, value) => {
  const contact = createClientContact(type, value, id);

  element.append(contact);
};

const createFormContent = () => {
  const firstNameInputBox = createInput(
    ["input", "formInput__name"],
    "inputField__name",
    "First name (required)",
    "",
    "",
    true,
    ""
  );

  const lastNameInputBox = createInput(
    ["input", "formInput__name"],
    "inputField__last",
    "Last name (required)",
    "",
    "",
    true,
    ""
  );

  const middleNameInputBox = createInput(
    ["input", "formInput__name"],
    "inputField__middle",
    "Middle name (optional)",
    "",
    "",
    true,
    ""
  );

  return { firstNameInputBox, lastNameInputBox, middleNameInputBox };
};

const addNewClientContact = (button, element) => {
  if (contactsQuantity < 9) {
    button.classList.remove("invisible");
    createNewClientContact(element, new Date().getTime(), "phone", "");
    contactsQuantity += 1;
  } else {
    button.classList.add("invisible");
  }
};

const createStepper = (
  firstNameInputBox,
  lastNameInputBox,
  middleNameInputBox,
  contacts
) => {
  const stepper = document.createElement("div");
  stepper.classList.add("stepper");

  const stepperGeneralInfo = document.createElement("div");
  stepperGeneralInfo.classList.add("stepper__ge");

  stepperGeneralInfo.innerHTML = `
    <div class="stepperHeader__content">
      <div class="stepperHeaderContent__circle">1</div>
      <span class="stepperHeaderContent__text">General</span>
    </div>
  `;

  const stepperGeneralInfoContent = document.createElement("div");
  stepperGeneralInfoContent.classList.add("stepper__content");
  stepperGeneralInfoContent.append(
    firstNameInputBox,
    lastNameInputBox,
    middleNameInputBox
  );

  stepperGeneralInfo.append(stepperGeneralInfoContent);

  const stepperContacts = document.createElement("div");
  stepperContacts.classList.add("stepper__c");

  stepperContacts.innerHTML = `
    <div class="stepperHeader__content">
      <div class="stepperHeaderContent__circle">2</div>
      <span class="stepperHeaderContent__text">Contacts</span>
    </div>
  `;

  const stepperContactsContentList = document.createElement("div");
  stepperContactsContentList.classList.add("stepperContent__list");

  const stepperContactsContent = document.createElement("div");
  stepperContactsContent.classList.add("stepper__content", "my__3");

  const newClientContact = createButton(
    ["btn", "btn__text"],
    "plus",
    "Add A New Contact",
    () => addNewClientContact(newClientContact, stepperContactsContentList)
  );

  stepperContactsContent.append(stepperContactsContentList, newClientContact);

  stepperContacts.append(stepperContactsContent);

  stepper.append(stepperGeneralInfo, stepperContacts);

  return stepper;
};

const createClient = () => {
  const form = document.createElement("form");
  form.classList.add("form");

  const { firstNameInputBox, lastNameInputBox, middleNameInputBox } =
    createFormContent();

  const stepper = createStepper(
    firstNameInputBox,
    lastNameInputBox,
    middleNameInputBox,
    []
  );

  form.append(stepper);

  openModal("Create A Client", form);
};

const updateClient = (id) => {
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
  iconElement.classList.add("icon__image");
  buttonText.classList.add("btn__text");

  if (icon.length > 0) {
    iconElement.src = `./assets/icons/${icon}.svg`;
    button.append(iconElement);
  }

  if (label.length > 0) {
    buttonText.innerText = label;
    button.append(buttonText);
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
        () => updateClient(client.id)
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

      tableDataClientActions.append(tableDataClientActionsContent);

      row.append(tableDataClientContacts, tableDataClientActions);

      tbody.append(row);
    });

    loader.remove();
  });
};

loadContacts("id", "asc", "");

const addNewClientBtn = createButton(
  ["btn", "btn__outlined"],
  "add__client",
  "Add client",
  () => createClient()
);

mainActionSection.append(addNewClientBtn);

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
