package com.expense.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.expense.dto.GroupDTO;
import com.expense.dto.GroupRequest;
import com.expense.model.GroupEntity;
import com.expense.model.User;
import com.expense.repository.GroupRepository;
import com.expense.repository.UserRepository;

@RestController
@RequestMapping("/groups")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {

    @Autowired
    private GroupRepository groupRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping
    public GroupEntity createGroup(@RequestBody GroupRequest request) {

        System.out.println("DEBUG name = " + request.getName());
        System.out.println("DEBUG members = " + request.getMemberIds());

        GroupEntity group = new GroupEntity();
        group.setName(request.getName());

        List<User> users = userRepo.findAllById(request.getMemberIds());
        group.setMembers(users);

        return groupRepo.save(group);
    }


    @GetMapping
    public List<GroupDTO> getAllGroups() {
        return groupRepo.findAll()
                .stream()
                .map(group -> new GroupDTO(
                        group.getId(),
                        group.getName(),
                        group.getMembers()
                             .stream()
                             .map(User::getId)
                             .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }
}
