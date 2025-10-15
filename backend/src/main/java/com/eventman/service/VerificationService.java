package com.eventman.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class VerificationService {

    private static final String CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateVerificationCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }

    public String generateExpirationTime() {
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
        return expirationTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public boolean isCodeExpired(String expirationTime) {
        if (expirationTime == null) {
            return true;
        }
        
        try {
            LocalDateTime expiration = LocalDateTime.parse(expirationTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            return LocalDateTime.now().isAfter(expiration);
        } catch (Exception e) {
            return true;
        }
    }
}
