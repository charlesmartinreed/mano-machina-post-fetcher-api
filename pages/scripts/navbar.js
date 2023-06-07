let toggleBtn = document.getElementById("btn__dark__mode__toggle");

toggleBtn.addEventListener("click", (e) => {
  let currentMode = checkCurrentDarkModeStatus();
  let scheme = toggleDarkMode(currentMode);

  let elements = [document.querySelector("body")];

  toggleDarkModeClassesOnElements(scheme, elements);
});

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

function toggleDarkModeClassesOnElements(scheme, elements) {
  console.log("toggling", scheme, "on", elements);

  elements.forEach((el) => {
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

export {
  checkCurrentDarkModeStatus,
  toggleDarkMode,
  toggleDarkModeClassesOnElements,
};
