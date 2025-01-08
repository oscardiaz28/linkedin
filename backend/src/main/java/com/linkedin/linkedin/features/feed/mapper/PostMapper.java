package com.linkedin.linkedin.features.feed.mapper;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.feed.model.Post;
import com.linkedin.linkedin.features.feed.model.PostDto;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public Post dtoToPost(PostDto dto, AuthenticationUser user){
        Post post = new Post();
        post.setContent(dto.getContent());
        post.setPicture(dto.getPicture());
        post.setAuthor(user);
        return post;
    }

}
