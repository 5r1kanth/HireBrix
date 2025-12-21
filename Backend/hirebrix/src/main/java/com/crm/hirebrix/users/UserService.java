package com.crm.hirebrix.users;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        user.setCreatedAt(Instant.now());
        return userRepository.save(user);
    }

    public List<User> getUsersByCompany(String companyId) {
        return userRepository.findByCompanyId(companyId);
    }
}
