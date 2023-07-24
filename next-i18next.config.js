const COUNTRY = {
  vietnam: 'vn',
  english: 'en',
}

module.exports = {
  COUNTRY,
  i18n: {
    defaultLocale: process.env.LOCALE || COUNTRY.vietnam,
    locales: Object.values(COUNTRY),
  },
}
