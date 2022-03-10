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
demo5
