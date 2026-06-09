package com.shabuyaki.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.shabuyaki.repository")
public class JpaConfig {
    // Enables @CreatedDate and @LastModifiedDate on BaseEntity
}
