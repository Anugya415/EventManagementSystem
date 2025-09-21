package com.eventman;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Sample data is now loaded from data.sql file
        // Commenting out programmatic data initialization to use SQL file instead
        /*
        // Check if data already exists - users must be created before events due to foreign key constraints
        if (userRepository.count() == 0) {
            initializeSampleUsers();
        }

        if (eventRepository.count() == 0) {
            initializeSampleEvents();
        }
        */
    }

    private void initializeSampleEvents() {
        // Demo events removed for security. Add your own events programmatically or through the API.
        System.out.println("ℹ️  No demo events initialized for security purposes.");
    }

    private void initializeSampleUsers() {
        // Demo users removed for security. Add your own users programmatically or through the API.
        System.out.println("ℹ️  No demo users initialized for security purposes.");
    }
}
