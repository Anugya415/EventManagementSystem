package com.eventman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class EventManApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventManApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "EventMan Backend is running!";
    }

    @GetMapping("/api/test/public")
    public String test() {
        return "EventMan Backend is running! - Public endpoint";
    }
}
