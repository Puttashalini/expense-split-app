package com.expense.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.expense.model.Balance;
import com.expense.repository.BalanceRepository;

@RestController
@RequestMapping("/balances")
@CrossOrigin(origins = "http://localhost:5173")

public class BalanceController {

    @Autowired
    private BalanceRepository balanceRepo;

    @GetMapping
    public List<Balance> getAllBalances() {
        return balanceRepo.findAll();
    }
}
