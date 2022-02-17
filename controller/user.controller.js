const models = require('../models/index');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

    const account_created = new Date().toISOString();
    const account_updated = new Date().toISOString();
    //"account_created":account_created,
    //"account_updated":account_updated,
    
function createUser(req,res){
    models.User.findOne({where:{username:req.body.username}}).then(result => {
        if(result){
            res.status(400).json({
                message: "Email exists, Bad Request",
            });
        }else{   
            bcryptjs.genSalt(10, function(err, salt){
                bcryptjs.hash(req.body.password, salt, function(err, hash){
                    const user = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        username:req.body.username,
                        password: hash
                    }
                
                    models.User.create(user).then(result => {
                        res.status(201).json({
                            message: "User created successfully",
                            "first_name": user.first_name,
                            "last_name" :user.last_name,
                            "password" :user.password,
                            "username" :user.username

                        });
                    }).catch(error => {
                        console.log(error)
                        res.status(500).json({
                            message: "Something went wrong!",
                        });
                    });
                });
            });
       }
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
    
}
         
function loginUser(req, res){
        models.User.findOne({where:{username: req.body.username}}).then(user => {
            if(user === null){
                res.status(401).json({
                    message: "Invalid credentials!",
                });
            }else{
                bcryptjs.compare(req.body.password, user.password, function(err, result){
                    if(result){
                        const token = jwt.sign({
                            username: user.username,
                            userId: user.id
                        }, "secret", function(err, token){
                            res.status(200).json({
                                message: "Authentication successful!",
                                token: token,
                                "id":user.id,
                                "first_name": user.first_name,
                                "last_name" :user.last_name,
                                "password" :user.password,
                                "username" :user.username,
                                "account_created":account_created,
                                "account_updated":account_updated,

                            });
                        });
                    }else{
                        res.status(401).json({
                            message: "Invalid credentials!",
                        });
                    }
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong!",
            });
        });
    }

 
    function viewUser(req, res){
        models.User.findOne({where:{username: req.body.username}}).then(user => {
            if(user === null){
                res.status(401).json({
                    message: "Invalid credentials!",
                });
            }else{
                bcryptjs.compare(req.body.password, user.password, function(err, result){
                    if(result){
                        const token = jwt.sign({
                            username: user.username,
                            userId: user.id
                        }, "secret", function(err, token){
                            res.status(200).json({ 
                                "id":user.id,
                                "first_name": user.first_name,
                                "last_name" :user.last_name,
                                "username" :user.username,
                                "account_created":account_created,
                                "account_updated":account_updated,
                            });
                        });
                    }else{
                        res.status(401).json({
                            message: "Invalid credentials!",
                        });
                    }
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong!",
            });
        });
    }

    function updateUser(req, res){
        models.User.findOne({where:{username: req.body.username}}).then(user => {
            if(user === null){
                res.status(401).json({
                    message: "Invalid credentials!",
                });
            }else{
                bcryptjs.genSalt(10, function(err, salt){
                    bcryptjs.hash(req.body.password, salt, function(err, hash){

                        const updateUser = {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            username:req.body.username,
                            password: hash
                        }
                        //models.Locale.update(objectToUpdate, { where: {username: req.body.username }})
                        models.User.update(updateUser,{returning:true, where: {username: req.body.username }})
                        .then(result => {
                            res.status(201).json({
                                message: "User Deets Updated successfully",
                                "first_name": updateUser.first_name,
                                "last_name" :updateUser.last_name,
                                "password" :updateUser.password,
                                "username" :updateUser.username
                            });
                        }).catch(error => {
                            console.log(error)
                            res.status(400).json({
                                message: "Bad Request",
                            });
                        });
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: "Something went wrong!",
            });
        });
    }

module.exports = {
    createUser: createUser,
    viewUser:viewUser,
    loginUser:loginUser,
    updateUser: updateUser
} 

/*update db and send json res
const objectToUpdate = {
    "first_name":req.body.first_name,
"last_name":req.body.last_name,
"password":req.body.password
    }
    
    models.Locale.update(objectToUpdate, { where: {username: req.body.username }})
 */

/* "id":user.id,
"first_name": user.first_name,
"last_name" :user.last_name,
"password" :user.password,
"username" :user.username,
"account_created":user.account_created,
"account_updated":user.account_updated  

*/