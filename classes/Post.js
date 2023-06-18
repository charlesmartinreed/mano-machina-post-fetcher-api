export class Post {
  constructor(postTitle, postBody) {
    this.postTitle = postTitle;
    this.postBody = postBody;
    this.postId = this.getPostId();
    this.postCreatedAt = this.getTimestamp();
    this.postUpdatedAt = null;
  }

  #setPostId = (idLen = 16) => {
    const randomizeRanges = [
      () => {
        return Math.round(Math.random() * (122 - 97) + 97);
      },
      () => {
        return Math.round(Math.random() * (90 - 65) + 65);
      },
      () => {
        return Math.round(Math.random() * (57 - 48) + 48);
      },
    ];

    const maxRangeValue = randomizeRanges.length - 1;
    let generatedIDValues = [];

    for (let i = 0; i < idLen; i++) {
      let idxToUse = Math.round(Math.random() * (maxRangeValue - 0) + 0);
      let idChar = String.fromCharCode(randomizeRanges[idxToUse]());

      generatedIDValues = [...generatedIDValues, idChar];
    }

    return generatedIDValues.join("");
  };

  #setPostTimestamp = () => {
    let currentDateArr = String(new Date()).split(" ");
    let [day, month, date, year, time] = currentDateArr;

    return { day, month, date, year, time };
  };

  #setPostUpdateTimestamp = () => {
    if (this.postCreatedAt !== null) {
      this.postUpdatedAt = this.getTimestamp();
    } else {
      return;
    }
  };

  getPostId() {
    return this.#setPostId();
  }

  getTimestamp() {
    let rawDate = this.#setPostTimestamp();

    return `${rawDate.day}day, ${rawDate.month} ${rawDate.date}, ${rawDate.year}, ${rawDate.time}`;
  }
}
