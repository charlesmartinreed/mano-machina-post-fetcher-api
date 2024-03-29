const btnGuestModeEl = document.getElementById("btn__guest");

import * as Navbar from "../scripts/navbar.js";

btnGuestModeEl.addEventListener("click", async (e) => {
  await initGuestMode();
});

async function initGuestMode() {
  let searchParams = new URLSearchParams({
    userMode: "guest",
  });
  let URL = `https://${window.location.host}/editor/${searchParams}`;

  try {
    updateLocalStorage("userMode", "guest");

    let res = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
      redirect: "follow",
    });
    moveToNewPage(res.url);
  } catch (e) {
    alert("Error:", e);
  }
}

function initLocalStorage() {
  if (window.localStorage) {
    if (!window.localStorage.getItem("userMode")) {
      window.localStorage.setItem("userMode", JSON.stringify(null));
    }
  }
}

function updateLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
}

function moveToNewPage(newLocation) {
  window.location.href = newLocation;
}

window.addEventListener("DOMContentLoaded", (e) => {
  initLocalStorage();
  Navbar.toggleDarkModeClassesOnElements();
});
