'use strict';

const axios = require(`axios`);

const {URL_API} = require(`../service/cli/constants.js`);
const {PathName} = require(`../service/constants.js`);

const TIMEOUT = 1000;
const defaultURL = `${URL_API}`;

class Api {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers() {
    return this._load(`/${PathName.OFFERS}`);
  }

  getCategories() {
    return this._load(`${PathName.CATEGORIES}`);
  }

  getCategory(categoryId) {
    return this._load(`${PathName.CATEGORIES}/${categoryId}`);
  }

  getAuth() {
    return this._load(`${PathName.AUTH}`);
  }

  getOffer(offerId) {
    return this._load(`/${PathName.OFFERS}/${offerId}`);
  }

  postOffer(data) {
    return this._load(`/${PathName.OFFERS}/add`, {
      method: `POST`,
      data
    });
  }

  // editOffer(data, offerId) {
  //   return this._load(`/${PathName.OFFERS}/${offerId}`, {
  //     method: `PUT`,
  //     data
  //   });
  // }

  // deleteOffer(offerId) {
  //   return this._load(`/${PathName.OFFERS}/${offerId}}`, {
  //     method: `DELETE`
  //   });
  // }

  getMyOffers(authorId) {
    return this._load(`/${PathName.OFFERS}/byAuthorId/${authorId}`);
  }

  getMostDiscussed() {
    return this._load(`${PathName.OFFERS}/mostDiscussed`);
  }

  getFreshItems() {
    return this._load(`${PathName.OFFERS}/fresh`);
  }

  // postComment(data, offerId) {
  //   return this._load(`/${PathName.OFFERS}/${offerId}/comments`, {
  //     method: `POST`,
  //     data
  //   });
  // }

  // deleteComment(commentId) {
  //   return this._load(`/${PathName.COMMENTS}/${commentId}}`, {
  //     method: `DELETE`
  //   });
  // }

  search(query) {
    return this._load(`/${PathName.SEARCH}`, {params: {query}});
  }
}

const defaultApi = new Api(defaultURL, TIMEOUT);

module.exports = {
  Api,
  getApi: () => defaultApi
};
