#!/bin/bash

sleep 30
sudo yum update -y
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
chown ec2-user:ec2-user /tmp/pgdg.repo
sudo mv /tmp/pgdg.repo /etc/yum.repos.d/pgdg.repo
sudo yum install -y postgresql12

cd /tmp
sudo unzip webservice.zip
sudo mv /tmp/webservice/packer/nodeapp.service /etc/systemd/system/nodeapp.service
sudo chown -R ec2-user:ec2-user webservice
cd webservice
sudo npm install bcrypt
sudo npm install





