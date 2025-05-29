#!/bin/bash

# Spring Boot 애플리케이션 실행 스크립트
echo "Spring Boot 애플리케이션 시작 중..."

# Maven 의존성 확인 및 다운로드
mvn dependency:copy-dependencies -DoutputDirectory=target/lib -q

# Spring Boot 애플리케이션 실행
java -cp "target/classes:target/lib/*" com.petedu.SimpleSpringBootApp \
  --server.port=5000 \
  --spring.profiles.active=dev \
  --spring.datasource.url=jdbc:h2:mem:petedu \
  --spring.datasource.driver-class-name=org.h2.Driver \
  --spring.datasource.username=sa \
  --spring.datasource.password= \
  --spring.h2.console.enabled=true \
  --spring.jpa.hibernate.ddl-auto=create-drop