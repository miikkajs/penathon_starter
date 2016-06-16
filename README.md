# Penathon starter kit
    Penathon starter kit is NodeJS project template. Starter kit idea
    is to provide basic tools for building (REST) API with authentication.
     
## Project structure
* /
    * Run app.js with `npm start` to start your server.
* /api/{version}/{name}
    * Controllers and routes for model
    * route.js files are required automatically to app routes.
* /config
    * Database config
* /migrations
    * Database migrations
    * Run `node_modules/.bin/sequelize help` for more details.
* /models
    * Models for sequelize.
    * Run `node_modules/.bin/sequelize help:model:create`  for more details.
* /seeder
    * Seeders
    * Run `node_modules/.bin/sequelize help:db:seed`  for more details.
* /public
    * Public static files.
* /tests
    * require initdb.js in tests to initialize your db before test and drop after. 
    * /controllers
        * Tests for controllers
        
    
    
## Libraries
* [Sequalize](http://docs.sequelizejs.com/en/latest/)

    Sequalize is ORM for SQL-database. You can use `sequalize-cli` from
    `node_modules/.bin/sequalize`. For usage check it's docs.
    
    
    Configure your database connection in `config/config.json`. 
    Default DB is sqlite for development. 
    
## How to run?
`npm install && npm start`


When developing you can use `npm run dev` for automatic deployment.

## How to test
`npm run test` to run tests inside /test