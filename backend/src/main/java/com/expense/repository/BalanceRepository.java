package com.expense.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.model.Balance;
import com.expense.model.User;

public interface BalanceRepository extends JpaRepository<Balance, Long> {

    List<Balance> findByFromUserOrToUser(User from, User to);

    Optional<Balance> findByFromUserAndToUser(User from, User to);
}
