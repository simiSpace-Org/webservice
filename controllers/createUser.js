const {
    v4: uuidv4
} = require("uuid");

const {
    validateEmail,
    generatePasswordHash
} = require("../utils/helper");

const pool = require("../db");

const createUser = (req, res) => {
    const fieldNeeded = ["first_name", "last_name", "username", "password"];
    const reqKey = req.body ? Object.keys(req.body) : null;

    if (!reqKey || !reqKey.length) {
        return res.status(400).json("No information is provided to create user");
    }

    if (!reqKey || JSON.stringify(fieldNeeded) !== JSON.stringify(reqKey)) {
        return res.status(400).json("Only First Name, Last Name, Username, and Password is required");
    }

    const id = uuidv4();
    const account_created = new Date().toISOString();
    const account_updated = new Date().toISOString();
    const {
        first_name,
        last_name,
        username,
        password
    } = req.body;


    const isEmailCorrect = validateEmail(username);

    if (!password || !first_name || !last_name || !isEmailCorrect || password.length < 8 || !first_name.length || !last_name.length) {
        return res.status(400).json("Data is in incorrect format!");
    }

    generatePasswordHash(password)
        .then((hashPassword) => {
            let queries = "Select * from users where username = $1";
            pool.query(queries, [username], (err, result) => {
                console.log("Verifying is username exists", username)
                if (!result.rowCount) {
                    queries = "INSERT INTO users(first_name, last_name, password, username, account_created, account_updated, id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, username, account_created, account_updated";
                    const values = [first_name, last_name, hashPassword, username, account_created, account_updated, id];
                    console.log("adding data to db", values)
                    pool.query(queries, values, (error, results) => {
                        if (error) {
                            res.status(400).json("Error inserting data to database while creating user");
                        } else {
                            res.status(201).json(results.rows[0]);
                        }
                    })
                } else {
                    return res.status(400).json("Username already in used");
                }
            })
        });
}

module.exports = createUser;