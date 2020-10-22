'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getOffers = async () => (await axios.get(UriApi.OFFERS)).data;

const getMostDiscussed = async () => (await axios.get(`${UriApi.OFFERS}/mostDiscussed`)).data;

const getFreshItems = async () => (await axios.get(`${UriApi.OFFERS}/fresh`)).data;

const getMyOffers = async (userId) => (await axios.get(`${UriApi.OFFERS}/byAuthorId/${userId}`)).data;

const getOffer = async (url) => (await axios.get(encodeURI(`${UriApi.OFFERS}/${url}`))).data;

const postOffer = (data) => axios.post(UriApi.OFFERS, {json: data});

const getSearch = async (search) => (await axios.get(encodeURI(`${UriApi.SEARCH}${search}`))).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

const getCategory = async (categoryId) => (await axios.get(`${UriApi.CATEGORIES}/${categoryId}`)).data;

const getAuth = async () => (await axios.get(UriApi.AUTH)).data;

module.exports = {
  getOffers,
  getMostDiscussed,
  getFreshItems,
  getMyOffers,
  getOffer,
  postOffer,
  getSearch,
  getCategories,
  getCategory,
  getAuth,
};
