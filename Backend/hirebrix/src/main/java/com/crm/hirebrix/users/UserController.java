package com.crm.hirebrix.users;

import com.crm.hirebrix.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<User> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return new ApiResponse<>(true, created);
    }

    @GetMapping
    public ApiResponse<List<User>> getUsers(@RequestParam String companyId) {
        List<User> users = userService.getUsersByCompany(companyId);
        return new ApiResponse<>(true, users);
    }
}

