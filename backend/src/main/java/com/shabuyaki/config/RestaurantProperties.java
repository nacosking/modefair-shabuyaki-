package com.shabuyaki.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.restaurant")
public class RestaurantProperties {
    private String receiptPrefix;
    private String name;
    private String address;
    private String phone;
}
