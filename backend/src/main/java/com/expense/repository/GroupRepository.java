package com.expense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.expense.model.GroupEntity;

public interface GroupRepository extends JpaRepository<GroupEntity, Long> {
}
