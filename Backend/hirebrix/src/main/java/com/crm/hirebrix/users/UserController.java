package com.crm.hirebrix.users;

import com.crm.hirebrix.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
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
        return new ApiResponse<>(true, userService.createUser(user));
    }

    /* =========================
       GET ACTIVE USERS BY COMPANY
    ========================= */
    @GetMapping
    public ApiResponse<List<User>> getUsers(@RequestParam String companyId) {
        return new ApiResponse<>(true, userService.getUsersByCompany(companyId));
    }

    /* =========================
       UPDATE USER
    ========================= */
    @PutMapping("/{id}")
    public ApiResponse<User> updateUser(@PathVariable String id, @RequestBody User user) {

        User updated = userService.updateUser(id, user);
        System.out.println(updated);
        return new ApiResponse<>(true, updated);
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
