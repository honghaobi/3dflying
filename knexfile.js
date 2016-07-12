module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/intro_to_knex'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
