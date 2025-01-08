package com.linkedin.linkedin.features.feed.controller;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.utils.ResponseBuilder;
import com.linkedin.linkedin.features.feed.model.Comment;
import com.linkedin.linkedin.features.feed.model.CommentDto;
import com.linkedin.linkedin.features.feed.model.Post;
import com.linkedin.linkedin.features.feed.model.PostDto;
import com.linkedin.linkedin.features.feed.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feed")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService){
        this.postService = postService;
    }

    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(@RequestBody PostDto postDto,
                                           @RequestAttribute("authenticatedUser")AuthenticationUser user){
        Post postSaved = postService.createPost(postDto, user);
        return ResponseEntity.ok().body(postSaved);
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<Post> editPost(@PathVariable(name = "postId") Long id,
                                         @Valid @RequestBody PostDto postDto,
                                         @RequestAttribute("authenticatedUser") AuthenticationUser user){
        Post postUpdated = postService.editPost(id, postDto, user);
        return ResponseEntity.ok().body(postUpdated);
    }

    @GetMapping
    public ResponseEntity<List<Post>> getFeedPosts(@RequestAttribute("authenticatedUser") AuthenticationUser user ){
        List<Post> posts = postService.getFeedPosts(user);
        return ResponseEntity.ok().body(posts);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts(){
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok().body(posts);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getOnePost(@PathVariable(name = "postId") Long id){
        return postService.getOnePost(id);
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable(name = "postId") Long id,
                                           @RequestAttribute("authenticatedUser") AuthenticationUser user ){
        return postService.deletePost(id, user);
    }

    @GetMapping("/posts/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable(name = "userId") Long id){
        List<Post> posts = postService.getPostsByUser(id);
        return ResponseEntity.ok().body(posts);
    }

    @PutMapping("/posts/{postId}/like")
    public ResponseEntity<?> likeUnlikePost(@PathVariable(name = "postId") Long id,
                                            @RequestAttribute("authenticatedUser") AuthenticationUser user){
        Post post = postService.likeUnlikePost(id, user);
        return ResponseEntity.ok().body(post);
    }

    @PostMapping("/posts/{postId}/comment")
    public ResponseEntity<?> addComment(@PathVariable(name = "postId") Long id,
                                        @RequestBody CommentDto commentDto,
                                        @RequestAttribute("authenticatedUser") AuthenticationUser user){
        Comment commentSaved = postService.addComent(id, commentDto, user);
        return ResponseEntity.ok().body(commentSaved);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> editComment(@PathVariable(name = "commentId") Long id,
                                         @RequestBody CommentDto commentDto,
                                         @RequestAttribute("authenticatedUser") AuthenticationUser user ){
        Comment comment = postService.editComment(id, commentDto, user);
        return ResponseEntity.ok().body(comment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable(name = "commentId") Long id,
                                              @RequestAttribute("authenticatedUser") AuthenticationUser user){
        postService.deleteComment(id, user);
        return ResponseEntity.noContent().build();
    }

}
