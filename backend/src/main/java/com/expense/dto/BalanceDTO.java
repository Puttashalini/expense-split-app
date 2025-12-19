package com.expense.dto;

public class BalanceDTO {

    private Long userId;
    private String userName;
    private double amount;
    private String type; // OWE or OWED

    public BalanceDTO(Long userId, String userName, double amount, String type) {
        this.userId = userId;
        this.userName = userName;
        this.amount = amount;
        this.type = type;
    }

    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public double getAmount() { return amount; }
    public String getType() { return type; }
}
