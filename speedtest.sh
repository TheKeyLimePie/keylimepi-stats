#!/bin/bash
date >> /home/pi/speedlog.txt
python /home/pi/speedtest/speedtest_cli.py >> /home/pi/speedlog.txt
printf '\n' >> /home/pi/speedlog.txt