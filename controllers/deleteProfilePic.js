const pool = require("../db");
require('dotenv').config();
const multer = require('multer');
//var upload = multer({ dest: 'images/' })

const Buffer = require('buffer');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs')

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
    region,
    accessKeyId,
    secretAccessKey
})

//Controller to Delete Pic
const deleteProfilePic = (req, res) => {
    //authenticateUser
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
                            console.log("ThisUsername", username);
                            
                            //delete pic post authentication
                            const userId = result.rows[0].id;
                            pool.query(`Select path from photos where user_id = $1`, [userId], (err, result) => {
                                if (result.rows.length) {
                                    s3.deleteObject({
                                        Bucket: process.env.AWS_BUCKET_NAME,
                                        Key: result.rows[0].path
                                    }, function (err, data) {
                                        if (data) {
                                            pool.query(`DELETE FROM photos WHERE user_id = $1`, [userId], (error, r) => {
                                                console.log("deleted pic from db and s3");
                                                return res.status(201).json("Profile Pic Deleted Successfully!");
                                            })
                                        }
                                    })
                                }else{
                                    return res.status(204).json("No Content to Delete");
                                }
                                
                            });

                        } 
                    })
            } else {
                return res.status(401).json("Unauthorized User");
            }
        })
        .catch(err => {
            return res.status(404).json(err.message)
        })


}
module.exports = deleteProfilePic;
///Users/seeminvasaikar/Desktop/Assign2WebApp/controllers/deleteProfilePic.js