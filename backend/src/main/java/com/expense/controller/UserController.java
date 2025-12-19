package com.expense.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.expense.dto.BalanceDTO;
import com.expense.model.User;
import com.expense.repository.UserRepository;
import com.expense.service.BalanceService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BalanceService balanceService;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // ✅ THIS FIXES THE 404
    @GetMapping("/{id}/balances")
    public List<BalanceDTO> getUserBalances(@PathVariable Long id) {
        return balanceService.getBalancesForUser(id);
    }
}
