package com.expense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.expense.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {}
