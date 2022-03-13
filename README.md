
# webservice

1. Prerequisites for building and deploying your application locally:
    "git clone" -> your namespace repo into your local machine and load it into Visual Code Studio. 
    "git remote -v" -> verify that your organization is setup as your upstream repo
    "git remote add upstream git@github.com:simiSpace-Org/webservice.git" -> add upstream
    

2. Build and Deploy instructions for the web application
   "npm init -y" -> initialize server
   "npm install" -> to install server dependencies
  
   "npm test" -> to test the test cases
   
3. Install Postman to send api calls to server

4. Github Commands to add changes to all repos and sync them: 
    git checkout assign1
    git add .
    git commit -m "msg"
    git push origin assign1
    -->create and merge pr from github ui
    git checkout main
    git pull upstream main
    git push origin main
    git checkout assign1
    git pull origin main
    git push origin assign1 test

   demo4
=======
# Webservice
``Rest API - Node.js``

## About the project
Created an node application to perform CRUD operations on S3 Bucket  

## Teach Stack
NodeJs
ExpressJs Framework
PostgreSQL

## Features
Packer to build AWS Ami
Objects upload to S3
Base Authentication
Password Encryption

# Packer Commands

export PACKER_LOG=1

```
//go to folder location of packer and run the following commands
cd Desktop/demoadd3/infrastructure/packer 
packer build -var-file='dev_vars.json' ami.json

# Validate packer
    ./packer validate ami.json

```
packerupdate
