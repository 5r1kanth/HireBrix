package com.crm.hirebrix.users;

import com.crm.hirebrix.common.ApiResponse;
import com.crm.hirebrix.users.dto.BulkUserUpdateRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /* =========================
       CREATE USER
    ========================= */
    @PostMapping
    public ApiResponse<User> createUser(@RequestBody User user) {
        return new ApiResponse<>(true, userService.createUserAndSendInvite(user));
    }

    /* =========================
       GET ACTIVE USERS BY COMPANY
    ========================= */
    @GetMapping
    public ApiResponse<List<User>> getUsers(
            @RequestParam String companyId,
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.isEmpty()) {
            return new ApiResponse<>(true, userService.searchUsers(companyId, search));
        }
        return new ApiResponse<>(true, userService.getUsersByCompany(companyId));
    }

    /* =========================
       GET USER BY ID
    ========================= */
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return new ApiResponse<>(false, null);
        }
        return new ApiResponse<>(true, user);
    }

    /* =========================
       UPDATE USER
    ========================= */
    @PutMapping("/{id}")
    public ApiResponse<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        return new ApiResponse<>(true, updated);
    }

    @PostMapping("/bulk-update")
    public ApiResponse<String> bulkUpdateUsers(
            @RequestParam String companyId,
            @RequestBody BulkUserUpdateRequest request
    ) {
        int updated = userService.bulkUpdateUsers(companyId, request);
        return new ApiResponse<>(true, updated + " users updated successfully");
    }


    /* =========================
        RESEND INVITE
    ========================= */
    @PostMapping("/{id}/resend-invite")
    public ApiResponse<String> resendInvite(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return new ApiResponse<>(false, "User not found");
        }
        if ("Active".equalsIgnoreCase(user.getStatus())) {
            return new ApiResponse<>(false, "User is already active. Invite not required.");
        }
        if (user.isDeleted()){
            userService.restoreUser(id);
        }

        // Reuse your existing service method
        userService.createUserAndSendInvite(user);

        return new ApiResponse<>(true, "Invite resent successfully");
    }

    /* =========================
       SOFT DELETE USER
       (Deactivate, NOT remove)
    ========================= */
    @PatchMapping("/{id}/delete")
    public ApiResponse<String> softDeleteUser(@PathVariable String id) {
        userService.softDeleteUser(id);
        return new ApiResponse<>(true, "User deleted successfully");
    }

    /* =========================
       RESTORE DELETED USER
    ========================= */
    @PatchMapping("/{id}/restore")
    public ApiResponse<String> restoreUser(@PathVariable String id) {
        userService.restoreUser(id);
        return new ApiResponse<>(true, "User restored successfully");
    }

    /* =========================
       GET DELETED USERS
    ========================= */
    @GetMapping("/deleted")
    public ApiResponse<List<User>> getDeletedUsers(@RequestParam String companyId) {
        return new ApiResponse<>(true, userService.getDeletedUsersByCompany(companyId));
    }

}
