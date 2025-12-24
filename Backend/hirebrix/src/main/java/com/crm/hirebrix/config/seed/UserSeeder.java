package com.crm.hirebrix.config.seed;

import com.crm.hirebrix.users.User;
import com.crm.hirebrix.users.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("dev") // 🚨 Runs ONLY in dev profile
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public UserSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {

        // Prevent duplicate seeding
        if (userRepository.count() >= 100) {
            System.out.println("Users already seeded. Skipping...");
            return;
        }

        String companyId = "69480f669bf6de88219dd7be";

        List<User> users = new ArrayList<>();

        String[] roles = {
                "Admin",
                "Manager",
                "Team Lead",
                "Recruiter",
                "Consultant"
        };

        String[] departments = {
                "Hyderabad",
                "Bangalore",
                "Chennai",
                "Pune"
        };

        for (int i = 1; i <= 100; i++) {
            User user = new User();

            user.setCompanyId(companyId);
            user.setEmail("user" + i + "@gmail.com");
            user.setRole(roles[i % roles.length]);
            user.setStatus("Active");

            user.setFirstName("User" + i);
            user.setLastName("Last" + i);
            user.setFullName("User" + i + " Last" + i);

            user.setDepartment(departments[i % departments.length]);
            user.setDeleted(false);

            user.setCreatedAt(Instant.now());
            user.setUpdatedAt(Instant.now());

            users.add(user);
        }

        userRepository.saveAll(users);
        System.out.println("✅ Seeded 100 users successfully");
    }
}
