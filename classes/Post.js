module.exports = class Post {
  constructor(postTitle, postBody) {
    this.postTitle = postTitle;
    this.postBody = postBody;
    this.postId = this.getPostId();
    this.postTimestamp = this.getTimestamp();
  }

  #setPostId = (idLen = 16) => {
    const randomizeRanges = [
      () => {
        return Math.floor(Math.random() * (122 - 97) + 97);
      },
      () => {
        return Math.floor(Math.random() * (90 - 65) + 65);
      },
      () => {
        return Math.floor(Math.random(57 - 48) + 48);
      },
    ];

    let generatedIDValues = [];

    for (let i = 0; i < idLen; i++) {
      let m =
        randomizeRanges[
          Math.floor(Math.random() * (randomizeRanges.length - 0) + 0)
        ]();

      generatedIDValues = [...generatedIDValues, String.fromCharCode(m)];
    }

    return generatedIDValues.join("");
  };

  #setPostTimestamp = () => {
    let currentDateArr = String(new Date()).split(" ");
    let [day, month, date, year, time] = currentDateArr;

    return `${day}day, ${month} ${date}, ${year}, ${time}`;
  };

  getPostId() {
    return this.#setPostId();
  }

  getTimestamp() {
    return this.#setPostTimestamp();
  }
};
