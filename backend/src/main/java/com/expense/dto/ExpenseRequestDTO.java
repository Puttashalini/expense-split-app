package com.expense.dto;

import java.util.List;

public class ExpenseRequestDTO {

    private Long groupId;
    private Double amount;
    private String description;
    private Long paidBy;        // ✅ ID only
    private String splitType;
    private List<SplitDTO> splits;

    public Long getGroupId() { return groupId; }
    public Double getAmount() { return amount; }
    public String getDescription() { return description; }
    public Long getPaidBy() { return paidBy; }
    public String getSplitType() { return splitType; }
    public List<SplitDTO> getSplits() { return splits; }
}
