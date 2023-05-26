const htmlSkeleton = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
`;

module.exports = class Page {
  constructor(postTitle, postBody, cssStyles, jsScripts) {
    this.postTitle = postTitle;
    this.postBody = postBody;
    this.cssStyles = cssStyles;
    this.jsScripts = jsScripts;
  }

  #getCSSStyles = () => {
    let tags = [];

    for (let cssPath of this.cssStyles) {
      headerTags.push(`<link rel="stylesheet" href=${cssPath} />`);
    }

    return tags;
  };

  #getJSScripts = () => {
    let tags = [];

    for (let jsPath of this.jsScripts) {
      headerTags.push(`<script defer src=${jsPath} type="module"></script>`);
    }

    return tags;
  };

  #getPageScripts = () => {
    let headerTags = this.#getCSSStyles().concat(this.#getJSScripts());

    return headerTags.join(`\\n`);
  };

  #composeHTML = () => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${this.#getPageScripts}
    <title>${this.postTitle}</title>
</head>
<body>
    ${this.postBody}
</body>
</html>
    `;
  };

  html = this.#composeHTML();
};
