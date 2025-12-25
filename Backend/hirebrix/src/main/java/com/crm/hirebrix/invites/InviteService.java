package com.crm.hirebrix.invites;

import com.crm.hirebrix.users.User;
import com.crm.hirebrix.users.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Base64;

@Service
public class InviteService {

    private final UserInviteRepository inviteRepo;
    private final UserRepository userRepo;

    public InviteService(UserInviteRepository inviteRepo, UserRepository userRepo) {
        this.inviteRepo = inviteRepo;
        this.userRepo = userRepo;
    }

    /* =========================
       VALIDATE INVITE
    ========================= */
    public UserInvite validateInvite(String rawToken, String email) {
        return inviteRepo.findAll().stream()
                .filter(inv -> BCrypt.checkpw(rawToken, inv.getTokenHash()))
                .filter(inv -> inv.getEmail().equalsIgnoreCase(email))
                .filter(inv -> inv.getStatus().equals("Pending"))
                .filter(inv -> inv.getExpiresAt().isAfter(Instant.now()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired invite token"));
    }

    /* =========================
       MARK INVITE ACCEPTED
    ========================= */
    public void markInviteAccepted(UserInvite invite) {
        invite.setStatus("Accepted");
        invite.setAcceptedAt(Instant.now());
        inviteRepo.save(invite);
    }

    /* =========================
       GENERATE SECURE TOKEN
    ========================= */
    public static String generateToken() {
        byte[] tokenBytes = new byte[32];
        new java.security.SecureRandom().nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }
}
