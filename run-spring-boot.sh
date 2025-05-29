#!/bin/bash

echo "=== PetEdu Spring Boot Platform 시작 ==="
echo "Maven 컴파일 및 Spring Boot 애플리케이션 실행"

# 환경 변수 설정
export JAVA_HOME=${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk}
export MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=256m"
export PORT=${PORT:-8080}

# Maven을 사용해 Spring Boot 애플리케이션 실행
echo "Spring Boot 애플리케이션을 포트 $PORT에서 시작합니다..."

# 개발 환경에서는 H2 인메모리 데이터베이스 사용
mvn spring-boot:run \
  -Dspring-boot.run.profiles=dev \
  -Dspring.datasource.url=jdbc:h2:mem:petedu \
  -Dspring.datasource.driver-class-name=org.h2.Driver \
  -Dspring.jpa.hibernate.ddl-auto=create-drop \
  -Dspring.h2.console.enabled=true \
  -Dserver.port=$PORT \
  -Dlogging.level.com.petedu=INFO \
  -Dspring.security.user.name=admin \
  -Dspring.security.user.password=admin123