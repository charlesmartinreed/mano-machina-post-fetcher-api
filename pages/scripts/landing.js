const btnGuestModeEl = document.getElementById("btn__guest");

btnGuestModeEl.addEventListener("click", async (e) => {
  await initGuestMode();
});

async function initGuestMode() {
  let searchParams = new URLSearchParams({
    userMode: "guest",
  });
  let URL = `http://${window.location.host}/editor/${searchParams}`;

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
  //   console.log(newLocation);
  window.location.href = newLocation;
}

window.addEventListener("DOMContentLoaded", initLocalStorage());
