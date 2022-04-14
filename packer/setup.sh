#!/bin/bash
sleep 30
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

cd /tmp
sudo unzip webservice.zip
sudo chown -R ec2-user:ec2-user webservice
cd webservice
sudo npm install bcrypt
sudo npm install
sudo npm install pm2@latest -g
sudo pm2 startup systemd --service-name nodeapp
sudo pm2 start server.js
sudo pm2 save