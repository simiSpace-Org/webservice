const client = require("../db");

const {
    generatePasswordHash,
    basicAuth,
    comparePassword
} = require("../utils/helper");

const SDC = require('statsd-client');
sdc = new SDC({host: 'localhost', port: 8125});
const logger = require('../logger');

const updateUser = (req, res) => {
    const [username, password] = basicAuth(req);

    if (!username || !password) {
        return res.status(403).json({
            message: "Forbidden Request"
        });
    }

    let queries = "SELECT password from users where username = $1";
    let values = [username];

    client.query(queries, values)
        .then(result => {
            if (result.rowCount) {
                const {
                    password: hashPassword
                } = result.rows[0];
                comparePassword(hashPassword, password)
                    .then(compareValue => {
                        if (compareValue) {
                            updateData(req, res, username);
                            logger.info('User Info Update api call has been hit');
                            sdc.increment('updateUser_counter');
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

const updateData = (req, res, username) => {
    const fieldNeeded = ["first_name", "last_name", "password"];
    const reqKey = req.body ? Object.keys(req.body) : null;
    let checking = true;

    reqKey.forEach(val => {
        if (fieldNeeded.indexOf(val) < 0) {
            checking = false;
        }
    })

    if (!checking) {
        return res.status(400).json("Only First Name, Last Name, and Password is required");
    }

    const account_updated = new Date().toISOString();
    const {
        first_name,
        last_name,
        password
    } = req.body;
    if ((password && password.length < 8) || (first_name && !first_name.length) || (last_name && !last_name.length)) {
        return res.status(400).json("Incorrect data format");
    }

    if (password) {
        generatePasswordHash(password)
            .then((hashPassword) => {
                req.body.password = hashPassword;
                updatingQuery(req, res, username, account_updated);
            })
    } else {
        updatingQuery(req, res, username, account_updated);
    }
}

const updatingQuery = (req, res, username, account_updated) => {
    const dKeys = Object.keys(req.body);
    dKeys.push("account_updated");
    const dataTuples = dKeys.map((k, index) => `${k} = $${index + 1}`);
    const updates = dataTuples.join(", ");

    const queries = `UPDATE users SET ${updates} where username = $${dKeys.length +  1}`;
    const values = [...Object.values(req.body), account_updated, username];
    
    client.query(queries, values, (err, result) => {
        if (err) {
            res.status(400).json("Error updating data to database while creating user");
        } else {
            const data = result.rows[0]
            res.json("Updated User successfully");
            //return res.status(204).json("Updated User successfully");
            return res.json(data);
        
        }
    })
}
module.exports = updateUser;