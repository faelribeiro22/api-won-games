export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ['https://cdn.ckeditor.com', "'self'", "'unsafe-inline'", "apollo-server-landing-page.cdn.apollographql.com"],
          'connect-src': ['https://proxy-event.ckeditor.com', "'self'", "https:", "apollo-server-landing-page.cdn.apollographql.com"],
          "img-src": ["'self'", "data:", "blob:", "apollo-server-landing-page.cdn.apollographql.com"],
          "style-src": ["'self'", "'unsafe-inline'", "apollo-server-landing-page.cdn.apollographql.com"],
          "frame-src": ["sandbox.embed.apollographql.com"]
        },
      },
    },
  },
];
