package com.krish.joblisting.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.krish.joblisting.controller.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    
}
