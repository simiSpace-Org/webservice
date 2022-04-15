const {v4: uuidv4} = require("uuid");
const {client} = require("../db");

const SDC = require('statsd-client');
const AWS = require("aws-sdk");

sdc = new SDC({host: 'localhost', port: 8125});
const logger = require('../logger');

var dynamo = new AWS.DynamoDB({ region: 'us-east-1'})
var DynamoDB = new AWS.DynamoDB.DocumentClient({service: dynamo});
AWS.config.update({region: 'REGION'});
const SNS = new AWS.SNS({apiVersion: '2010-03-31'});

const Str = require('@supercharge/strings')


const {
    validateEmail,
    generatePasswordHash
} = require("../utils/helper");



const createUser = (req, res) => {
    const fieldNeeded = ["first_name", "last_name", "username", "password"];
    const reqKey = req.body ? Object.keys(req.body) : null;
    //const data = Object.keys(req.body);

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
            const get_user_start_time = Date.now();
            let queries = "Select * from users where username = $1";
            client.query(queries, [username], (err, result) => {
                const get_user_end_time = Date.now();
                let get_user_time_elapsed = get_user_end_time - get_user_start_time;
                sdc.timing('query.user.get.post', get_user_time_elapsed);
                console.log("Verifying is username exists", username)
                logger.info('User creation api call has been hit');
                if (!result.rowCount) {
                    queries = "INSERT INTO users(first_name, last_name, password, username, account_created, account_updated, id, verified, verified_on) VALUES($1, $2,  $3, $4, $5, $6, $7, $8, $9) RETURNING id, first_name, last_name, username, account_created, account_updated";
                    logger.info('New user Created');
                    const values = [first_name, last_name, hashPassword, username, account_created, account_updated, id, false, account_updated];
                    console.log("Database has been updated")
                    client.query(queries, values, (error, results) => {
                        if (error) {
                            res.status(400).json("Error inserting data to database while creating user");
                        } else {
                            const current = Math.floor(Date.now() / 1000)
                            let ttl = 60 * 5
                            const expiresIn = ttl + current
                            const token = Str.random(50)
                            
                            const dynamoData = {
                                Item: {
                                    token,
                                    username,
                                    ttl: expiresIn,
                                },
                                TableName: "dynamo_db"
                            }
                            logger.info({token: token, msg: 'token for dynamo'});
                            DynamoDB.put(dynamoData, function (error, reqKey) {
                                if (error){
                                    logger.error('error');
                                    console.log("Error in putting item in DynamoDB ", error);
                                }
                                else {
                                    logger.info('successfully added in dynamo DB');
                                }
                            });
                            //publish notification to SNS to activate lambda function to send email 
                            const params = {
                                Message: JSON.stringify({username, token, messageType: "Notification", first_name: first_name, verified: false}),
                                TopicArn: demo-topic
                                //process.env.TOPIC_ARN,
                            }
                            let publishTextPromise = SNS.publish(params).promise();
                            publishTextPromise.then(
                                function(reqKey) {
                                    logger.info('promise dynamo');
                                    console.log(`Message sent to the topic ${params.TopicArn}`);
                                    console.log("MessageID is " + reqKey.MessageId);           
                                }).catch(
                                function(err) {
                                    logger.error({errorMsg: 'promise dynamo db', err: err});
                                    console.error(err, err.stack);
                                }); 

                            logger.info('User successfully created');
                            res.status(200).json({
                                status: 200,
                                result: result.rows[0]
                            });

                            res.status(201).json(results.rows[0]);
                        }
                    })
                } else {
                    logger.error('Username already in use');
                    return res.status(400).json("Username already in use");
                    
                }
            })
        });
}

module.exports = createUser;