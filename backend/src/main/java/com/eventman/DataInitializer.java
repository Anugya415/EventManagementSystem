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
        // Initialize sample data if database is empty
        if (userRepository.count() == 0) {
            System.out.println("📊 Initializing sample data for Event Management System...");
            initializeSampleUsers();
            initializeSampleEvents();
            System.out.println("✅ Sample data initialization completed!");
        } else {
            System.out.println("ℹ️  Database already contains data. Skipping initialization.");
        }
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
