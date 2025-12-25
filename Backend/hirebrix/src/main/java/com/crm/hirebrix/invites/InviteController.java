package com.crm.hirebrix.invites;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InviteService inviteService;

    /* =========================
       CREATE INVITE (ADMIN)
    ========================= */
    @PostMapping
    public Map<String, String> createInvite(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String companyId = payload.get("companyId");

        String rawToken = InviteService.generateToken(); // generate secure token
        // TODO: Save token in DB (hash) with email, companyId, role, department
        // TODO: Send email with link https://app.hirebrix.com/activate?token=RAW_TOKEN

        return Map.of("message", "Invite created successfully", "token", rawToken);
    }
}
