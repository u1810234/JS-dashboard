document.addEventListener("DOMContentLoaded", function () {
  const current__theme = localStorage.getItem("theme") || "theme__light";

  document.body.classList.add(current__theme);
});

const theme__switcher = document.querySelector(".theme__btn");

const client__photoWrapper = document.querySelector(".client__photoWrapper");
const client__name = document.querySelector(".client__name");
const extraInfoWrappers = document.querySelectorAll(".extraInfo__wrapper");
const client__age = document.getElementById("client__age");
const client__gender = document.getElementById("client__gender");
const client__country = document.getElementById("client__country");
const contacts__wrapper = document.querySelector(".contacts__wrapper");
const bought__courses = document.querySelector(".bought__courses");
const completed__courses = document.querySelector(".completed__courses");

const skeletonCards = (elementToAttach) => {
  for (let i = 0; i < 6; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    const thumbIcon = document.createElement("div");
    thumbIcon.classList.add("skeleton", "skeleton__thumbIcon");

    const cardText = document.createElement("div");
    cardText.classList.add("skeleton", "skeleton__text");

    card.append(thumbIcon, cardText);

    elementToAttach.append(card);
  }
};

const createSkeleton = () => {
  const skeletonImage = document.createElement("div");
  skeletonImage.classList.add("skeleton", "skeleton__image");

  const skeletonNameText = document.createElement("div");
  skeletonNameText.classList.add("skeleton", "skeleton__text");

  extraInfoWrappers.forEach((extraInfoWrapper) => {
    const extraInfoData = document.createElement("div");
    extraInfoData.classList.add("skeleton", "skeleton__text");

    extraInfoWrapper.prepend(extraInfoData);
  });

  skeletonCards(contacts__wrapper);
  skeletonCards(bought__courses);
  skeletonCards(completed__courses);

  client__photoWrapper.append(skeletonImage);
  client__name.append(skeletonNameText);
};

const removeSkeleton = () => {
  const allSkeleton = document.querySelectorAll(".skeleton");
  const allcards = document.querySelectorAll(".card");

  const skeletons = Array.from(allSkeleton);
  const cards = Array.from(allcards);

  skeletons.forEach((skeleton) => {
    skeleton.remove();
  });

  cards.forEach((card) => {
    card.remove();
  });
};

const getAge = (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

const getClient = async (id = "") => {
  const response = await fetch(
    `https://js-dashboard-api.onrender.com/api/clients/${id}`
  );

  const data = await response.json();

  return data;
};

const getExtraInfo = async (id) => {
  const response = await fetch(
    `https://fakerapi.it/api/v1/companies?_seed=${id}&_quantity=1`
  );

  const data = await response.json();

  return data;
};

const fillClientData = (id) => {
  Promise.all([getClient(id), getExtraInfo(id)]).then((results) => {
    removeSkeleton();

    const client__photo = document.createElement("img");
    client__photo.classList.add("client__photo");
    client__photo.src = results[1].data[0].contact.image;

    const client__nameText = document.createElement("span");
    client__nameText.classList.add("client__name");
    client__nameText.innerText = `${results[0].surname} ${results[0].name} ${results[0].lastName}`;

    const age = getAge(results[1].data[0].contact.birthday);
    client__age.innerText = age;

    const gender = results[1].data[0].contact.gender === "male" ? "М" : "F";
    client__gender.innerText = gender;

    const country = results[1].data[0].country;
    client__country.innerText = country;

    results[0].contacts.forEach((contact) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const thumbIcon = document.createElement("img");
      thumbIcon.classList.add("thumbIcon");
      thumbIcon.src = `../assets/icons/${contact.type}.svg`;

      const cardText = document.createElement("span");
      cardText.classList.add("card__text");
      cardText.innerText = contact.value;

      card.append(thumbIcon, cardText);

      contacts__wrapper.append(card);
    });

    client__photoWrapper.append(client__photo);
    client__name.append(client__nameText);
  });
};

const pageParams = new URLSearchParams(window.location.search);

const currentClientID = parseInt(pageParams.get("id"), 10);

createSkeleton();

fillClientData(currentClientID);

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
