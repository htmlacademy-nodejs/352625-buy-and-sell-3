'use strict';

const {PathName} = require(`./constants.js`);

const {
  getOffers,
  getMostDiscussed,
  getFreshItems,
  getMyOffers,
  getOffer,
  postOffer,
  getSearch,
  getCategories,
  getCategory,
  getAuth
} = require(`./../axios.js`);

const {getHumanDate} = require(`./../utils.js`);

const {getLogger} = require(`./../../service/logger.js`);

const logger = getLogger();

const render404Page = (req, res) => {
  res.status(404).render(`errors/404`);
  logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);
};

const renderHomePage = async (req, res) => {
  try {
    const offers = await getOffers();
    const categories = await getCategories();
    const auth = await getAuth();

    res.render(`main`, {
      auth,
      offers,
      categories,
      freshItems: await getFreshItems(),
      mostDiscussedItems: await getMostDiscussed(),
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCategoryPage = async (req, res) => {
  try {
    const activeCategoryId = req.params.categoryId;
    const activeCategory = await getCategory(activeCategoryId);
    const categories = await getCategories();
    const auth = await getAuth();

    res.render(`category`, {
      auth,
      categories,
      activeCategory,
      activeCategoryId,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketPage = async (req, res) => {
  try {
    const auth = await getAuth();
    const offer = await getOffer(req.params.offerId);

    res.render(`ticket`, {
      auth,
      offer,
      getHumanDate,
    });
    logger.debug(`${req.method} ${PathName.OFFERS}${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    render404Page(req, res);
    logger.error(`Error occurs: ${error}`);
  }
};

const renderTicketEditPage = async (req, res) => {
  try {
    const categories = await getCategories();
    const offer = await getOffer(req.params.offerId);
    const auth = await getAuth();

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

const renderMyTicketsPage = async (req, res) => {
  try {
    const auth = await getAuth();
    const reqUrl = req.originalUrl;

    if (!auth.status || typeof auth.user.id !== `number`) {
      render404Page(req, res);
    } else {
      const myOffers = await getMyOffers(auth.user.id);

      res.render(`my-tickets`, {
        reqUrl,
        auth,
        myOffers,
        getHumanDate,
      });
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderCommentsPage = async (req, res) => {
  try {
    const auth = await getAuth();
    const reqUrl = req.originalUrl;

    if (!auth.status || typeof auth.user.id !== `number`) {
      render404Page(req, res);
    } else {
      const myOffers = await getMyOffers(auth.user.id);

      res.render(`comments`, {
        reqUrl,
        auth,
        myOffers,
      });
    }

    // const quantity = auth.userOffers.length < 3
    //   ? auth.userOffers.length
    //   : 3;
    // const offersForRender = auth.userOffers.slice(0, quantity);
    //
    // res.render(`comments`, {
    //   reqUrl: req.originalUrl,
    //   auth,
    //   offersForRender,
    // });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderNewTicketPage = async (req, res) => {
  try {
    const auth = await getAuth();
    const categories = await getCategories();

    res.render(`new-ticket`, {
      auth,
      categories,
    });
    logger.debug(`${req.method} ${req.url} --> res status code ${res.statusCode}`);

  } catch (error) {
    logger.error(`Error occurs: ${error}`);
  }
};

const renderSearchResultsPage = async (req, res) => {
  try {
    const auth = await getAuth();
    const offers = await getOffers();
    const result = await getSearch(req.query.search);

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

const postFormDataToService = (req, res) => {
  try {
    postOffer(req.body);

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
