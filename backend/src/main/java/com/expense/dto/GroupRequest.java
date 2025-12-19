package com.expense.dto;

import java.util.List;

public class GroupRequest {

    private String name;
    private List<Long> memberIds;

    public GroupRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<Long> memberIds) {
        this.memberIds = memberIds;
    }
}
