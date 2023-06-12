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

function generatePostID() {
  let postIDArr = [...generateValues(20, false)];
  let slicedArr = [];
  let lastIndex = 0;

  for (let i = 0; i <= postIDArr.length; i++) {
    if (i > 0 && i % 4 === 0) {
      slicedArr.push(postIDArr.slice(lastIndex, i));
      lastIndex = i;
    }
  }

  return slicedArr.map((arr) => arr.join("")).join("-");
}

function generateUserID() {
  return generateValues(14, false);
}

export { generateUserID, generatePostID };
