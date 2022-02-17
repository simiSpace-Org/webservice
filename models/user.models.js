module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {

        first_name: {
          type: Sequelize.STRING,
          allowNull:false
        },  
        last_name: {
          type: Sequelize.STRING,
        },  
        username: {
          type: Sequelize.STRING,
          allowNull:false
        },
        password: {
          type: Sequelize.STRING,
          allowNull:false
        },
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        }
      });
    return User;
  };
 // first_name, last_name, hashPassword, username, account_created, account_updated, id