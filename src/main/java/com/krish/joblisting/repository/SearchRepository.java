package com.krish.joblisting.repository;

import java.util.List;

import com.krish.joblisting.controller.model.Post;

public interface SearchRepository {
    
    List<Post> findByText(String text);
}
