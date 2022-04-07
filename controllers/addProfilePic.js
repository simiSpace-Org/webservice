const pool = require("../db");
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

//Controller to Upload Pic
const addProfilePic = (req, res) => {
    //authenticateUser
    const [username, password] = basicAuth(req);
    const profilePic = req.file;


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
                            //console.log("ThisUsername", username);
                            logger.info('User Profile Pic Added');
                            sdc.increment('profilePic_counter');
                            //add pic post authentication
                            let date = new Date().toISOString().slice(0, 10);
                            const fileStream = fs.createReadStream(profilePic.path);
                            //console.log("Received profilePic File");
                            const userId = result.rows[0].id;
                            const first_name = result.rows[0].first_name
                           // console.log("filename", profilePic.filename)
                            //delete the old pic and upload new one
                            pool.query(`Select path from photos where user_id = $1`, [userId], (err, result) => {
                                if (result.rows.length) {
                                    s3.deleteObject({
                                        Bucket: process.env.AWS_BUCKET_NAME,
                                        Key: result.rows[0].path
                                    }, function (err, data) {
                                        if (data) {
                                            pool.query(`DELETE FROM photos WHERE user_id = $1`, [userId], (error, r) => {
                                            })
                                        }
                                    })
                                }
                            });
                            //upload new pic/update old pic
                            var imgData = `images/${first_name}_${userId}/` + profilePic.filename;
                            const uploadParams = {
                                Bucket: process.env.AWS_BUCKET_NAME,
                                Key: imgData,
                                Body: fileStream,
                                Metadata: {
                                    file_name: profilePic.filename,
                                    id: uuidv4(),
                                    upload_date: date,
                                    user_id: userId
                                },
                            }
                            console.log("Key Name of S3:", imgData);
                            s3.upload(uploadParams, (err, data) => {
                                if (err) {
                                    throw (err);
                                }
                                const text = 'INSERT INTO photos(id, user_id, file_name, url, upload_date, path) VALUES($1, $2,  $3, $4, $5, $6) RETURNING id, user_id, file_name, url, upload_date, path';
                                const values = [uuidv4(), userId, profilePic.filename, data.Location, date, data.Key];
                                pool.query(text, values, (err, result) => {
                                    if (err) {
                                        console.log('Bad Request while inserting for uploading pic');
                                        res.status(400).json({
                                            status: 204,
                                            description: 'Bad Request'
                                        });
                                    } else {
                                        console.log('Photo uploaded successfully');
                                        res.status(201).json({
                                            description: result.rows[0]
                                        }

                                        );
                                    }
                                });
                            })
                            console.log("Uploading User Pic");

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

module.exports = addProfilePic;

