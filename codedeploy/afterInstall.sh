#!/bin/bash
cd /tmp
sudo chown -R ec2-user:ec2-user webservice
cd webservice
npm install

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/amazon-cloudwatch-agent.json \
    -s

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a start

#/Users/seeminvasaikar/Documents/ass8/webservice/cloudwatch-config.json
