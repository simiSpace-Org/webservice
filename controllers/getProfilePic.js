const client = require("../db");
require('dotenv').config();
const multer = require('multer');
//var upload = multer({ dest: 'images/' })


const Buffer = require('buffer');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs')

const SDC = require('statsd-client');
sdc = new SDC({host: 'localhost', port: 8125});
const logger = require('../logger');

const {
    basicAuth,
    comparePassword
} = require("../utils/helper");

const {
    v4: uuidv4
} = require('uuid');

var AWS = require("aws-sdk");

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
    region
})

//Controller to Get User Pic

const getUserPic = (req, res) => {
    //authenticateUser
    const [username, password] = basicAuth(req);
    //const profilePic = req.file;

    if (!username || !password) {
        return res.status(403).json({
            message: "Forbidden Request"
        });
    }

    let queries = "SELECT * from users where username = $1";
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
                            const data = result.rows[0];
                            delete data["password"];
                            console.log("Authenticated User");
                            logger.info('Get Profile Pic api call has been hit');
                            sdc.increment('getProfilePic_counter');
                            const userId = result.rows[0].id;
                            client.query(`Select path from photos where user_id = $1`, [userId], (err, result) => {
                                if (result.rows.length) {
                                    const downloadParams = {
                                        Bucket: process.env.AWS_BUCKET_NAME,
                                        Key: result.rows[0].path
                                    }

                                    s3Obj = s3.getObject(downloadParams);
                                    console.log("s3Obj Path",s3Obj.params.Key);
                                   // const data = result.rows[0];
                                    //res.status(201).json(data);

                                }

                            });
                            client.query(`Select id, verified from users where username = $1`, [userId], (err, result) => {
                                if (result.rows.length) {
        
                                   const data = result.rows[0];
                                   res.status(201).json(data);

                                }

                            });
                            
                        } else if(!result.rows[0].verified){
                            logger.info('User not Verified to perform delete pic operation');
                            return res.status(400).json("Unverified User");
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
module.exports = getUserPic;
