'use strict';

const axios = require(`axios`).default;
const {UriApi} = require(`./utils.js`);

const getOffers = async () => (await axios.get(UriApi.OFFERS)).data;

const getOffer = async (url) => (await axios.get(encodeURI(`${UriApi.OFFERS}/${url}`))).data;

const postOffer = (data) => axios.post(UriApi.OFFERS, {json: data});

const getSearch = async (search) => (await axios.get(encodeURI(`${UriApi.SEARCH}${search}`))).data;

const getCategories = async () => (await axios.get(UriApi.CATEGORIES)).data;

const getAuth = async () => (await axios.get(UriApi.AUTH)).data;

module.exports = {
  getOffers,
  getOffer,
  postOffer,
  getSearch,
  getCategories,
  getAuth,
};
