package com.linkedin.linkedin.features.feed.repository;

import com.linkedin.linkedin.features.feed.model.Comment;
import com.linkedin.linkedin.features.feed.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long id);
}
