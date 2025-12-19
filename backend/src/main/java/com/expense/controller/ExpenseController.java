package com.expense.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.expense.dto.ExpenseRequestDTO;
import com.expense.service.ExpenseService;
@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public void addExpense(@RequestBody ExpenseRequestDTO req) {
        expenseService.createExpense(req);
    }
}
