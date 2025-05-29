#!/bin/bash
export JAVA_HOME=/nix/store/zmj3m7wrgqf340vqd4v90w8dw371vhjg-openjdk-17.0.7+7
export PATH=$JAVA_HOME/bin:$PATH

echo "Starting Spring Boot application..."
java -jar target/simple-spring-1.0.0.jar \
  --server.port=8081 \
  --logging.level.org.springframework=INFO \
  --spring.main.web-application-type=servlet