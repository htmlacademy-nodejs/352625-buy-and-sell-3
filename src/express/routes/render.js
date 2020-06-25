'use strict';

const axios = require(`axios`).default;

const {
  getOffersByCategory,
  getCategoryById,
  getFreshItems,
  getMostDiscussedItems,
} = require(`./utils.js`);

const {PathName} = require(`./constants.js`);

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const render404Page = (req, res) => {
  res.status(404).render(`errors/404`);
  logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
};

const renderHomePage = async (req, res, urlAuth, urlOffers, urlCategories) => {
  try {
    const offers = (await axios.get(urlOffers)).data;
    const categories = (await axios.get(urlCategories)).data;
    const auth = (await axios.get(urlAuth)).data;

    res.render(`main`, {
      auth,
      offers,
      categories,
      getOffersByCategory,
      freshItems: getFreshItems(offers),
      mostDiscussedItems: getMostDiscussedItems(offers),
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res, urlAuth, urlOffers, urlCategories) => {
  try {
    const activeCategoryId = req.params.categoryId;
    const offers = (await axios.get(urlOffers)).data;
    const categories = (await axios.get(urlCategories)).data;
    const auth = (await axios.get(urlAuth)).data;

    if (!categories.find((item) => item.id === activeCategoryId)) {
      render404Page(req, res);

    } else {
      res.render(`category`, {
        auth,
        offers,
        categories,
        activeCategoryId,
        getCategoryById,
        getOffersByCategory,
      });
      logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
    }

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketPage = async (req, res, urlAuth, urlOffers) => {
  try {
    const auth = (await axios.get(urlAuth)).data;
    const offer = (await axios.get(encodeURI(`${urlOffers}${req.url}`))).data;

    res.render(`ticket`, {
      auth,
      offer,
    });
    logger.debug(`${req.method} ${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketEditPage = async (req, res, urlAuth, urlOffers, urlCategories) => {
  try {
    const categories = (await axios.get(urlCategories)).data;
    const offer = (await axios.get(encodeURI(`${urlOffers}/${req.params.offerId}`))).data;
    const auth = (await axios.get(urlAuth)).data;

    res.render(`ticket-edit`, {
      auth,
      offer,
      categories,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderMyTicketsPage = async (req, res, urlAuth, reqUrl) => {
  try {
    const auth = (await axios.get(urlAuth)).data;

    res.render(`my-tickets`, {
      reqUrl,
      auth,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCommentsPage = async (req, res, urlAuth, reqUrl) => {
  try {
    const auth = (await axios.get(urlAuth)).data;
    const quantity = auth.userOffers.length < 3
      ? auth.userOffers.length
      : 3;
    const offersForRender = auth.userOffers.slice(0, quantity);

    res.render(`comments`, {
      reqUrl,
      auth,
      offersForRender,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderNewTicketPage = async (req, res, urlAuth, urlCategories) => {
  try {
    const auth = (await axios.get(urlAuth)).data;
    const categories = (await axios.get(urlCategories)).data;

    res.render(`new-ticket`, {
      auth,
      categories,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderSearchResultsPage = async (req, res, urlAuth, urlSearch, urlOffers) => {
  try {
    const auth = (await axios.get(urlAuth)).data;
    const offers = (await axios.get(urlOffers)).data;
    const result = (await axios.get(encodeURI(`${urlSearch}${req.query.search}`))).data;

    res.render(`search-result`, {
      auth,
      result,
      freshItems: getFreshItems(offers),
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const postFormDataToService = (req, res, urlOffers) => {
  try {
    axios.post(urlOffers, {json: req.body});

    res.redirect(`/my`);
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);

    res.redirect(`/offers/add`);
  }
};

module.exports = {
  render404Page,
  renderHomePage,
  renderCategoryPage,
  renderTicketPage,
  renderTicketEditPage,
  renderMyTicketsPage,
  renderCommentsPage,
  renderNewTicketPage,
  renderSearchResultsPage,
  postFormDataToService,
};
