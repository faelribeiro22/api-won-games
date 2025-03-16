/**
 * game service
 */
import axios from 'axios';
import { JSDOM } from 'jsdom';
import slugify from 'slugify';
import { factories } from '@strapi/strapi';

const gameService = "api::game.game";
const publisherService = "api::publisher.publisher";
const developerService = "api::developer.developer";
const catergoryService = "api::category.category";
const platformService = "api::platform.platform";

async function getGameInfo(slug: string) {
  const gogSlug = slug.replace('-', '_').toLowerCase();

  console.log(`https://www.gog.com/game/${gogSlug}`);
  const body = await axios.get(`https://www.gog.com/game/${gogSlug}`);
  const dom = new JSDOM(body.data);

  const raw_description = dom.window.document.querySelector(".description");

  const description = raw_description.innerHTML;
  const short_description = raw_description.textContent.slice(0, 160);

  const ratingElement = dom.window.document.querySelector(
    ".age-restrictions__icon use"
  )


  return {
    description,
    short_description,
    rating: ratingElement ? ratingElement
    .getAttribute('xlink:href')
    .replace(/_/g, ' ')
    .replace("#", "") : 'BR0'
  }
}

async function getByName(name, entityService) {
  const item = await strapi.service(entityService).find({
    filters: {
      name
    },
  });

  return item.results.length > 0 ? item.results[0] : null;
}

async function create(name, entityService) {
  const item = await getByName(name, entityService);

  if (!item) {
    console.log(name);
    await strapi.service(entityService).create({
        data: {
          name,
          slug: slugify(name, { strict: true, lower: true })
        },
      });
  }
}

async function createManyToMany(products) {
  const developersSet = new Set();
  const publishersSet = new Set();
  const categoriesSet = new Set();
  const platformsSet = new Set();

  products.forEach((product) => {
    const { developers, publishers, genres, operatingSystems } = product;

    genres?.forEach(({ name }) => {
      categoriesSet.add(name);
    });

    operatingSystems?.forEach((item) => {
      platformsSet.add(item);
    });

    developers?.forEach((developer) => {
      developersSet.add(developer);
    });

    publishers?.forEach((publisher) => {
      publishersSet.add(publisher);
    });
  })

  const createCall = (set, entityName) => Array.from(set).map(name => create(name, entityName));

  return Promise.all([
    ...createCall(Array.from(developersSet), developerService),
    ...createCall(Array.from(publishersSet), publisherService),
    ...createCall(Array.from(categoriesSet), catergoryService),
    ...createCall(Array.from(platformsSet), platformService),
  ]);
}


export default factories.createCoreService('api::game.game', () => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending`;

    const {
      data: { products }
    } = await axios.get(gogApiUrl);

    await createManyToMany([products[0], products[1]]);

  }
}));
