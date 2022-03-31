#!/bin/bash
pm2 kill
cd /tmp
sudo unzip webservice.zip
sudo mv /tmp/webservice/packer/nodeapp.service /etc/systemd/system/nodeapp.service
sudo chown -R ec2-user:ec2-user webservice
cd webservice
npm install
