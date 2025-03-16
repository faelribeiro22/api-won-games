/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game.game', ({ strapi }) => ({
  async populate(ctx) {
    console.log('Rodando');
    await strapi.service("api::game.game").populate(ctx.query);
    ctx.send('finish');
  }
}));
