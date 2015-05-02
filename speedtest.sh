#!/bin/bash
date >> /home/pi/speedlog.txt
speedtest-cli >> /home/pi/speedlog.txt
printf '\n' >> /home/pi/speedlog.txt