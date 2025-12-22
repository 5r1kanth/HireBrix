package com.crm.hirebrix.users;

import com.crm.hirebrix.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Create a new user
     */
    @PostMapping
    public ApiResponse<User> createUser(@RequestBody User user) {
        // Set timestamps
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        // Optional: build fullName from first/middle/last
        StringBuilder fullName = new StringBuilder();
        if (user.getFirstName() != null) fullName.append(user.getFirstName());
        if (user.getMiddleName() != null && !user.getMiddleName().isEmpty())
            fullName.append(" ").append(user.getMiddleName());
        if (user.getLastName() != null) fullName.append(" ").append(user.getLastName());
        user.setFullName(fullName.toString().trim());

        User created = userService.createUser(user);
        return new ApiResponse<>(true, created);
    }

    /**
     * Get all users for a company
     */
    @GetMapping
    public ApiResponse<List<User>> getUsers(@RequestParam String companyId) {
        List<User> users = userService.getUsersByCompany(companyId);
        return new ApiResponse<>(true, users);
    }
}
