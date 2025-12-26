package com.crm.hirebrix.auth;

import com.crm.hirebrix.invites.UserInvite;
import com.crm.hirebrix.invites.UserInviteRepository;
import com.crm.hirebrix.users.User;
import com.crm.hirebrix.users.UserRepository;
import com.crm.hirebrix.users.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/auth/google")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GoogleAuthController {

    private final UserService userService;
    private final UserInviteRepository inviteRepository;
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
            String name = (String) userInfo.get("name");

            // =============================
            // A) PURE LOGIN FLOW (No token)
            // =============================
            if (inviteToken == null || inviteEmail == null) {

                Optional<UserInvite> inviteOpt = inviteRepository.findByEmail(googleEmail);

                if (inviteOpt.isEmpty())
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("message", "User not invited"));

                UserInvite invite = inviteOpt.get();

                if (!"Accepted".equalsIgnoreCase(invite.getStatus()))
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("message", "User not activated yet"));

                Optional<User> userOpt = userRepository.findByEmail(googleEmail);

                if (userOpt.isEmpty())
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("message", "User account not found"));

                User user = userOpt.get();
                String jwt = userService.generateJwtToken(user);

                return ResponseEntity.ok(Map.of(
                        "token", jwt,
//                        "email", googleEmail,
//                        "name", name,
                        "role", user.getRole(),
//                        "companyId", user.getCompanyId(),
                        "userId", user.getId()
                ));

            }

            // =============================
            // B) INVITE FLOW (WITH TOKEN)
            // =============================
            User user = userService.registerOrUpdateFromInvite(userInfo, inviteToken, inviteEmail);
            String jwt = userService.generateJwtToken(user);

            return ResponseEntity.ok(Map.of(
                    "token", jwt,
//                    "email", googleEmail,
//                    "name", name,
                    "role", user.getRole(),
//                    "companyId", user.getCompanyId(),
                    "userId", user.getId()
            ));


        } catch (Exception e) {
            log.error("Google Auth Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Auth failed: " + e.getMessage()));
        }
    }


}
