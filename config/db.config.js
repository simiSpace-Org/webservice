module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Coco@786",
    DB: "cloud_database",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };