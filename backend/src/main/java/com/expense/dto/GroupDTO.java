package com.expense.dto;

import java.util.List;

public class GroupDTO {

    private Long id;
    private String name;
    private List<Long> memberIds;

    public GroupDTO(Long id, String name, List<Long> memberIds) {
        this.id = id;
        this.name = name;
        this.memberIds = memberIds;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<Long> getMemberIds() {
        return memberIds;
    }
}
