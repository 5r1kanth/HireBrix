package com.crm.hirebrix.invites;

import com.crm.hirebrix.email.EmailService;
import com.crm.hirebrix.users.User;
import com.crm.hirebrix.users.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class InviteService {

    private static final Logger log = LoggerFactory.getLogger(InviteService.class);

    private final InviteRepository inviteRepo;
    private final UserRepository userRepo;
    private final MongoTemplate mongoTemplate;

    public InviteService(InviteRepository inviteRepo, UserRepository userRepo, MongoTemplate mongoTemplate) {
        this.inviteRepo = inviteRepo;
        this.userRepo = userRepo;
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void ensureTokenLookupIndex() {
        try {
            mongoTemplate.indexOps(Invite.class).ensureIndex(
                    new Index().on("tokenLookup", Sort.Direction.ASC)
                            .unique()
                            .sparse()
                            .named("invite_token_lookup_unique")
            );
        } catch (DataAccessException e) {
            log.error("Unable to create the invite token lookup index", e);
        }
    }

    /* =========================
      CREATE AND SEND INVITE
   ========================= */
    public void createAndSendInvite(String email, String companyId, String role, String department) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        // Create Invite object
        Invite invite = inviteRepo.findByEmailAndCompanyId(normalizedEmail, companyId).orElse(null);
        if (invite == null) {
            if (inviteRepo.findByEmail(normalizedEmail).isPresent()) {
                throw new IllegalArgumentException("Invite email is already associated with another company");
            }
            invite = new Invite();
        }

        // Generate secure token
        String rawToken = generateToken();
        String hashedToken = BCrypt.hashpw(rawToken, BCrypt.gensalt());

        invite.setCompanyId(companyId);
        invite.setEmail(normalizedEmail);
        invite.setRole(role);
        invite.setDepartment(department);
        invite.setTokenHash(hashedToken);
        invite.setTokenLookup(tokenLookup(rawToken));
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
        String lookup = tokenLookup(rawToken);
        Invite invite = inviteRepo.findByTokenLookup(lookup).orElse(null);

        if (invite != null) {
            return validateInviteDetails(invite, rawToken, email);
        }

        // Check legacy invites once while they are being migrated to indexed lookups.
        return inviteRepo.findByTokenLookupIsNull().stream()
                .filter(candidate -> matchesInvite(candidate, rawToken, email))
                .findFirst()
                .map(candidate -> {
                    candidate.setTokenLookup(lookup);
                    inviteRepo.save(candidate);
                    return candidate;
                })
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired invite token"));
    }

    private Invite validateInviteDetails(Invite invite, String rawToken, String email) {
        if (!matchesInvite(invite, rawToken, email)) {
            throw new IllegalArgumentException("Invalid or expired invite token");
        }
        return invite;
    }

    private boolean matchesInvite(Invite invite, String rawToken, String email) {
        return invite.getTokenHash() != null
                && BCrypt.checkpw(rawToken, invite.getTokenHash())
                && invite.getEmail() != null
                && invite.getEmail().equalsIgnoreCase(email)
                && "Pending".equalsIgnoreCase(invite.getStatus())
                && invite.getExpiresAt() != null
                && invite.getExpiresAt().isAfter(Instant.now());
    }

    private String tokenLookup(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
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

        if (expiredInvites.isEmpty()) return;

        List<String> emails = expiredInvites.stream()
                .map(Invite::getEmail)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        List<User> users = emails.isEmpty() ? List.of() : userRepo.findByEmailIn(emails);
        users.forEach(user -> user.setStatus("Expired"));
        if (!users.isEmpty()) {
            userRepo.saveAll(users);
        }

        List<String> inviteIds = expiredInvites.stream()
                .map(Invite::getId)
                .filter(Objects::nonNull)
                .toList();
        if (!inviteIds.isEmpty()) {
            mongoTemplate.remove(Query.query(Criteria.where("_id").in(inviteIds)), Invite.class);
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
