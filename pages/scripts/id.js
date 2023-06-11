const specialCharacters = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "[",
  "]",
  "=",
  "+",
  "-",
  "/",
  "\\",
  "`",
  '"',
  "|",
  ";",
  ":",
  ",",
  ".",
  "<",
  ">",
];

function generateValues(len = 10, permitSpecialChars = false) {
  let genned = "";
  let proposed;

  while (genned.length < len) {
    proposed = String.fromCharCode(Math.floor(Math.random() * (122 - 48) + 48));
    if (!permitSpecialChars) {
      if (!specialCharacters.includes(proposed)) {
        genned += proposed;
      }
    }

    if (permitSpecialChars) {
      genned += String.fromCharCode(
        Math.floor(Math.random() * (122 - 48) + 48)
      );
    }
  }

  return genned;
}

export {};
