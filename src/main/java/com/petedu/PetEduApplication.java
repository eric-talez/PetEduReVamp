package com.petedu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.petedu.repository")
@EntityScan(basePackages = "com.petedu.entity")
@EnableAsync
@EnableScheduling
public class PetEduApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetEduApplication.class, args);
    }
}