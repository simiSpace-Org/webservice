'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = {};

const config = require("../config/db.config.js");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("../models/user.models.js")(sequelize, Sequelize);
module.exports = db;
