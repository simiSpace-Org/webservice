const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

const SDC = require('statsd-client');
sdc = new SDC({host: 'localhost', port: 8125});
const logger = require('../logger');

const viewUser = (req, res) => {
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json({
            message: "Forbidden Request"
        });
    }

    let queries = "SELECT * from users where username = $1";
    let values = [username];
    
    pool.query(queries, values)
        .then(result => {
            if (result.rowCount) {
                const {
                    password: hashPassword
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            const data = result.rows[0];
                            delete data["password"];
                            logger.info('View User Pic api call has been hit');
                            sdc.increment('viewUser_counter');
                            return res.status(200).json(data);
                            
                        } else {
                            return res.status(400).json("Incorrect Password");
                        }
                    })
            } else {
                return res.status(400).json("Username Incorrect");
            }
        })
        .catch(err => {
            return res.status(400).json(err.message)
        })
}

module.exports = viewUser;

//const data = result.rows[0];