package com.crm.hirebrix.email;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public static void sendInvite(String email, String token) {
        // Example: build the frontend URL
        String inviteUrl = "http://localhost:5173/login?email=" + email + "&token=" + token;

        // TODO: Implement your SMTP / SendGrid / SES logic
        System.out.println("Send invite to " + email + " with link: " + inviteUrl);
    }
}
