package com.krish.joblisting.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;

import com.krish.joblisting.controller.model.Post;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

@Component
public class SrearchRepositoryImpl implements SearchRepository {

    @Autowired
    MongoClient client;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Post> findByText(String text) {

        MongoConverter converter = mongoTemplate.getConverter();
        final List<Post> posts = new ArrayList<>();

        MongoDatabase database = client.getDatabase("krish");
        MongoCollection<Document> collection = database.getCollection("joblist");

        AggregateIterable<Document> result =collection.aggregate(Arrays.asList(new Document("$search",
                new Document("text",
                        new Document("query", text)
                                .append("path", Arrays.asList("desc", "techs", "profile")))),
                new Document("$sort",
                        new Document("exp", -1L))));

        result.forEach(doc -> posts.add(converter.read(Post.class, doc)));
        return posts;
    }

}
