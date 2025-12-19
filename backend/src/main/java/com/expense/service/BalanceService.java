package com.expense.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expense.dto.BalanceDTO;
import com.expense.model.Balance;
import com.expense.model.User;
import com.expense.repository.BalanceRepository;
import com.expense.repository.UserRepository;

@Service
public class BalanceService {

    @Autowired
    private BalanceRepository balanceRepo;

    @Autowired
    private UserRepository userRepo;

    public List<BalanceDTO> getBalancesForUser(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Balance> balances = balanceRepo.findByFromUserOrToUser(user, user);

        return balances.stream().map(balance -> {
            boolean owedToUser = balance.getToUser().getId().equals(userId);

            return new BalanceDTO(
                    owedToUser
                        ? balance.getFromUser().getId()
                        : balance.getToUser().getId(),
                    owedToUser
                        ? balance.getFromUser().getName()
                        : balance.getToUser().getName(),
                    balance.getAmount(),
                    owedToUser ? "OWED" : "OWE"
            );
        }).collect(Collectors.toList());
    }
}
