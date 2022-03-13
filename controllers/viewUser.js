const pool = require("../db");

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

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