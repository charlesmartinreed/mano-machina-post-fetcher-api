const toggleBtn = document.getElementById("btn__dark__mode__toggle");

const siteWideElements = [
  document.querySelector("body"),
  document.querySelector("html"),
  ...document.querySelectorAll(".btn"),
];

function checkCurrentCredentials() {
  // TODO: Integrate Credentials on server side
  if (window.localStorage) {
    let authToken = window.localStorage.getItem("authToken");
    if (authToken) {
      // login here
      console.log("user auth token");
    } else {
      enableGuestMode();
    }
  }
}

function enableGuestMode() {
  if (window.localStorage) {
    let guestStatus = window.localStorage.getItem("userIsGuest");

    if (!guestStatus) {
      window.localStorage.setItem("userIsGuest", JSON.stringify(true));
    }
  }

  let userpageLinkEl = document.getElementById("navbar__userpage__link");

  userpageLinkEl.textContent = "Guest Mode";
  userpageLinkEl.setAttribute("href", "#");
  document.getElementById("btn__publish__post").disabled = "true";
}

function checkCurrentDarkModeStatus() {
  if (!window.localStorage) return undefined;

  if (window.localStorage) {
    if (!window.localStorage.getItem("preferredColorScheme")) {
      let preferredScheme =
        window.matchMedia("(prefers-color-scheme: dark)").matches === true
          ? "dark"
          : "light";
      window.localStorage.setItem("preferredColorScheme", preferredScheme);
    }
    return window.localStorage.getItem("preferredColorScheme");
  }
}

function toggleDarkMode(currentMode) {
  let toggledColorScheme = currentMode === "dark" ? "light" : "dark";

  window.localStorage.setItem("preferredColorScheme", toggledColorScheme);

  return toggledColorScheme;
}

function toggleDarkModeClassesOnElements() {
  let scheme = checkCurrentDarkModeStatus();
  let localElements = enumeratePageContents();

  let allElements = [...siteWideElements, ...localElements];

  console.log("local elements", localElements);
  console.log("all elements", allElements);
  console.log("toggling", scheme, "on", allElements);

  allElements.forEach((el) => {
    switch (scheme) {
      case "dark":
        el.classList.remove("light");
        el.classList.add("dark");
        break;
      case "light":
        el.classList.remove("dark");
        el.classList.add("light");
        break;
      default:
        break;
    }
  });
}

function enumeratePageContents() {
  let pageSkeleton = Array.from(document.querySelector("body").children);
  let pageElements = [];

  for (const el of pageSkeleton) {
    if (el.children) {
      for (const innerChild of el.children) {
        if (
          innerChild.classList.contains("dark") ||
          innerChild.classList.contains("light")
        ) {
          pageElements = [...pageElements, innerChild];
        }
      }
    } else {
      if (el.classList.contains("dark") || el.classList.contains("light")) {
        pageElements = [...pageElements, el];
      }
    }
  }

  return pageElements;
}

function systemDarkModePrefChanged() {
  let scheme = toggleDarkMode(checkCurrentDarkModeStatus());

  let pageElements = enumeratePageContents();

  pageElements.length > 0
    ? toggleDarkModeClassesOnElements(scheme, [
        siteWideElements,
        ...pageElements,
      ])
    : toggleDarkModeClassesOnElements(scheme, siteWideElements);
}

toggleBtn.addEventListener("click", (e) => {
  let currentMode = checkCurrentDarkModeStatus();
  let scheme = toggleDarkMode(currentMode);

  let elements = [...siteWideElements];

  toggleDarkModeClassesOnElements(scheme, elements);
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    let currentScheme = checkCurrentDarkModeStatus();

    if (
      currentScheme === "dark" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      console.log("already dark, no change");
      return;
    }

    systemDarkModePrefChanged();
  });

export {
  checkCurrentDarkModeStatus,
  toggleDarkModeClassesOnElements,
  systemDarkModePrefChanged,
  checkCurrentCredentials,
};
