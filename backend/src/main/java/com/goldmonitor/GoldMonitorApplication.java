package com.goldmonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GoldMonitorApplication {
    public static void main(String[] args) {
        SpringApplication.run(GoldMonitorApplication.class, args);
    }
}
