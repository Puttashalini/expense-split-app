package com.expense.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expense.dto.ExpenseRequestDTO;
import com.expense.dto.SplitDTO;
import com.expense.model.Balance;
import com.expense.model.Expense;
import com.expense.model.GroupEntity;
import com.expense.model.User;
import com.expense.repository.BalanceRepository;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.GroupRepository;
import com.expense.repository.UserRepository;

@Service
public class ExpenseService {


    @Autowired private ExpenseRepository expenseRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private GroupRepository groupRepo;
    @Autowired private BalanceRepository balanceRepo;

    public void createExpense(ExpenseRequestDTO req) {

        GroupEntity group = groupRepo.findById(req.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User paidBy = userRepo.findById(req.getPaidBy())
        	    .orElseThrow(() -> new RuntimeException("PaidBy user not found"));


        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setPaidBy(paidBy);
        expense.setAmount(req.getAmount());
        expense.setDescription(req.getDescription());

        expenseRepo.save(expense);

        int count = req.getSplits().size();
        double equalShare = req.getAmount() / count;

        for (SplitDTO split : req.getSplits()) {

            if (split.getUserId().equals(req.getPaidBy())) {
                continue; // payer doesn't owe himself
            }

            User user = userRepo.findById(split.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            double share = equalShare;

            if ("EXACT".equals(req.getSplitType())) {
                share = split.getAmount();
            } else if ("PERCENTAGE".equals(req.getSplitType())) {
                share = req.getAmount() * split.getPercentage() / 100;
            }

            Balance balance = balanceRepo
                    .findByFromUserAndToUser(user, paidBy)
                    .orElse(new Balance(user, paidBy, 0.0));

            balance.setAmount(balance.getAmount() + share);
            balanceRepo.save(balance);
        }
    }
}
