#!/bin/bash

sleep 30
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y postgresql

cd /tmp
sudo unzip webservice.zip
sudo mv /tmp/webservice/packer/nodeapp.service /etc/systemd/system/nodeapp.service
sudo chown -R ec2-user:ec2-user webservice
cd webservice
sudo npm install bcrypt
sudo npm install
node server.js
sudo systemctl start nodeapp.service
sudo systemctl status nodeapp.service
sudo systemctl enable nodeapp.service





