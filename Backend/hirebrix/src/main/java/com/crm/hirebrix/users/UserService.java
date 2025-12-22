package com.crm.hirebrix.users;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create a new user
    public User createUser(User user) {
        if (!StringUtils.hasText(user.getEmail()) || !StringUtils.hasText(user.getCompanyId())) {
            throw new IllegalArgumentException("Email and Company ID are required");
        }

        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmailAndCompanyId(user.getEmail(), user.getCompanyId());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User with this email already exists in the company");
        }

        // Set createdAt timestamp
        user.setCreatedAt(Instant.now());

        // Build fullName from first, middle, last names
        String fullName = user.getFirstName() +
                (user.getMiddleName() != null && !user.getMiddleName().isEmpty() ? " " + user.getMiddleName() : "") +
                " " + user.getLastName();
        user.setFullName(fullName.trim());

        return userRepository.save(user);
    }

    // Get all users for a company
    public List<User> getUsersByCompany(String companyId) {
        return userRepository.findByCompanyId(companyId);
    }

    // Get users by role within a company
    public List<User> getUsersByCompanyAndRole(String companyId, String role) {
        return userRepository.findByCompanyIdAndRole(companyId, role);
    }
}
