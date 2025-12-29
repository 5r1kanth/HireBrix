package com.crm.hirebrix.auth;

import com.crm.hirebrix.invites.Invite;
import com.crm.hirebrix.invites.InviteRepository;
import com.crm.hirebrix.users.User;
import com.crm.hirebrix.users.UserRepository;
import com.crm.hirebrix.users.UserService;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth/google")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GoogleAuthController {

    private final UserService userService;
    private final InviteRepository inviteRepository;
    private final UserRepository userRepository;

    @Value("${google.client.id}")
    private String clientId;

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @PostMapping("/frontend-callback")
    public ResponseEntity<?> googleFrontendCallback(@RequestBody Map<String, String> payload) {
        try {
            String accessToken = payload.get("accessToken");
            String inviteToken = payload.get("inviteToken");
            String inviteEmail = payload.get("inviteEmail");

            if (accessToken == null || accessToken.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("message", "Missing access token"));

            // Fetch user info from Google
            String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
            Map<String, Object> userInfo = new RestTemplate()
                    .getForObject(userInfoEndpoint + "?access_token=" + accessToken, Map.class);

            if (userInfo == null || !userInfo.containsKey("email"))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Failed to fetch user info"));

            String googleEmail = ((String) userInfo.get("email")).toLowerCase();

            if (inviteToken == null || inviteEmail == null) {
                User user = validatePureLoginUser(googleEmail);
                return ResponseEntity.ok(buildJwtResponse(user));
            }

            User user = userService.registerOrUpdateFromInvite(userInfo, inviteToken, inviteEmail);
            return ResponseEntity.ok(buildJwtResponse(user));

        } catch (Exception e) {
            log.error("Google Auth Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Auth failed: " + e.getMessage()));
        }
    }

    /* =========================
       HELPER: PURE LOGIN VALIDATION
    ========================= */
    private User validatePureLoginUser(String email) {
        Invite invite = inviteRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not invited"));

        if (!"Accepted".equalsIgnoreCase(invite.getStatus()))
            throw new IllegalArgumentException("User not activated yet");

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found"));
    }

    /* =========================
       HELPER: BUILD JWT RESPONSE
    ========================= */
    private Map<String, Object> buildJwtResponse(User user) {
        String jwt = userService.generateJwtToken(user);
        return Map.of(
                "token", jwt,
                "role", user.getRole(),
                "userId", user.getId()
        );
    }
}
