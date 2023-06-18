// const htmlSkeleton = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>

// </body>
// </html>
// `;

export class Page {
  constructor(postTitle, postBody, cssStyles, jsScripts) {
    this.postTitle = postTitle;
    this.postBody = postBody;
    this.cssStyles = cssStyles;
    this.jsScripts = jsScripts;
  }

  #setCSSStyles = () => {
    let tags = [];

    for (let cssPath of this.cssStyles) {
      tags.push(`<link rel="stylesheet" href="${cssPath}" />`);
    }

    return tags;
  };

  getCSSStyles = () => {
    return this.#setCSSStyles();
  };

  #setJSScripts = () => {
    let tags = [];

    for (let jsPath of this.jsScripts) {
      tags.push(`<script defer src="${jsPath}" type="module"></script>`);
    }

    return tags;
  };

  getJSScripts = () => {
    return this.#setJSScripts();
  };

  #setHeaderTags = () => {
    let headerTags = this.#setCSSStyles().concat(this.#setJSScripts());

    return headerTags.join("\n");
  };

  getHeaderTags = () => {
    return this.#setHeaderTags();
  };

  getPostTitle = () => {
    return this.postTitle;
  };

  getPostBody = () => {
    return this.postBody;
  };

  #composeHTML = () => {
    let html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${this.getHeaderTags()}
    <title>${this.getPostTitle()}</title>
</head>
<body>
    ${this.getPostBody()}
</body>
</html>
    `;

    return html;
  };

  html = () => this.#composeHTML();
  // styles = this.cssStyles;
  // title = this.postTitle;
}
