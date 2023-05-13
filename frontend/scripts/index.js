let richTextBtns = document.querySelectorAll(".btn__richtext__ui");
const richTextOperations = {
  bold: ".text-is-bolded",
  emphasis: ".text-is-emphasized",
  underline: ".text-is-underlined",
  strikethrough: ".text-is-stricken",
};

richTextBtns.forEach((btn) =>
  addEventListener("click", (e) => {
    let classToApply = richTextOperations[e.target.id.split("_").pop()];
    console.log(classToApply);
  })
);

