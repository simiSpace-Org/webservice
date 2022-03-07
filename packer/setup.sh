#!/bin/bash

sleep 30

sudo yum update -y

sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

sudo rpm -Uvh https://repo.mysql.com/mysql80-community-release-el7-3.noarch.rpm
sudo sed -i 's/enabled=1/enabled=0/' /etc/yum.repos.d/mysql-community.repo
sudo yum --enablerepo=mysql80-community install mysql-community-server -y
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo yum --enablerepo=mysql80-community install mysql-community-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo service mysqld stop
pass=$(sudo grep 'temporary password' /var/log/mysqld.log | awk {'print $13'})
sudo service mysqld start
mysql --connect-expired-password -u root -p$pass -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Coco@786'";
sudo mysqladmin -u root -pCoco@786 create cloud_database;
cd /tmp
sudo mv /tmp/nodeapp.service /etc/systemd/system/nodeapp.service
sudo unzip webservice-main.zip
sudo chown -R ec2-user:ec2-user webservice-main
cd webservice-main
sudo npm install bcrypt
sudo npm install
sudo systemctl start nodeapp.service
sudo systemctl enable nodeapp.service
sudo systemctl enable mysqld



