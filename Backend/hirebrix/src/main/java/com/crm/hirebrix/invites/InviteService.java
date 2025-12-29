package com.crm.hirebrix.invites;

import com.crm.hirebrix.email.EmailService;
import com.crm.hirebrix.users.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Service
public class InviteService {

    private final InviteRepository inviteRepo;
    private final UserRepository userRepo;

    public InviteService(InviteRepository inviteRepo, UserRepository userRepo) {
        this.inviteRepo = inviteRepo;
        this.userRepo = userRepo;
    }

    /* =========================
      CREATE AND SEND INVITE
   ========================= */
    public void createAndSendInvite(String email, String companyId, String role, String department) {
        // Create Invite object
        Invite invite = inviteRepo.findByEmailAndCompanyId(email.toLowerCase(), companyId)
                .orElse(new Invite());

        // Generate secure token
        String rawToken = generateToken();
        String hashedToken = BCrypt.hashpw(rawToken, BCrypt.gensalt());

        invite.setCompanyId(companyId);
        invite.setEmail(email.toLowerCase());
        invite.setRole(role);
        invite.setDepartment(department);
        invite.setTokenHash(hashedToken);
        invite.setStatus("Pending");
        invite.setSentAt(Instant.now());
        invite.setExpiresAt(Instant.now().plusSeconds(7 * 24 * 3600)); // 7 days expiry

        // Save invite
        inviteRepo.save(invite);

        // Send email
        EmailService.sendInvite(email, rawToken);
    }

    /* =========================
       VALIDATE INVITE
    ========================= */
    public Invite validateInvite(String rawToken, String email) {
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
    public void markInviteAccepted(Invite invite) {
        invite.setStatus("Accepted");
        invite.setAcceptedAt(Instant.now());
        inviteRepo.save(invite);
    }

    @Scheduled(cron = "0 0 * * * ?") // every hour
    public void cleanupExpiredInvites() {
        Instant now = Instant.now();
        List<Invite> expiredInvites = inviteRepo.findByExpiresAtBeforeAndStatus(now, "Pending");

        System.out.println("Expired Executed");
        for (Invite inv : expiredInvites) {
            userRepo.findByEmail(inv.getEmail()).ifPresent(user -> {
                user.setStatus("Expired"); // mark user as failed onboarding
                userRepo.save(user);
            });

            inv.setStatus("Expired"); // keep tracking or directly delete
            inviteRepo.delete(inv); // final cleanup
        }
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
