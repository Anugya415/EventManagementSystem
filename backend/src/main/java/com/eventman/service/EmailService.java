package com.eventman.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Email Verification - Event Management System");
        message.setText(
            "Welcome to Event Management System!\n\n" +
            "Please verify your email address by entering the following verification code:\n\n" +
            "Verification Code: " + verificationCode + "\n\n" +
            "This code will expire in 15 minutes.\n\n" +
            "If you did not create an account with us, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Event Management System Team"
        );
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String resetCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset - Event Management System");
        message.setText(
            "You have requested to reset your password.\n\n" +
            "Please use the following code to reset your password:\n\n" +
            "Reset Code: " + resetCode + "\n\n" +
            "This code will expire in 15 minutes.\n\n" +
            "If you did not request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Event Management System Team"
        );
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }
}
