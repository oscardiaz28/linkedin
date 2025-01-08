package com.linkedin.linkedin.features.feed.service;

import com.linkedin.linkedin.exception.LinkedinException;
import com.linkedin.linkedin.exception.UserNotFoundException;
import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.linkedin.features.feed.mapper.PostMapper;
import com.linkedin.linkedin.features.feed.model.Comment;
import com.linkedin.linkedin.features.feed.model.CommentDto;
import com.linkedin.linkedin.features.feed.model.Post;
import com.linkedin.linkedin.features.feed.model.PostDto;
import com.linkedin.linkedin.features.feed.repository.CommentRepository;
import com.linkedin.linkedin.features.feed.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final AuthenticationUserRepository userRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository, PostMapper postMapper,
                       AuthenticationUserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.postMapper = postMapper;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public Post createPost(PostDto postDto, AuthenticationUser user) {
        AuthenticationUser author = userRepository.findById(user.getId())
                .orElseThrow( () -> new UserNotFoundException("Usuario no encontrado"));
        Post post = postMapper.dtoToPost(postDto, author);
        return postRepository.save(post);
    }

    public Post editPost(Long id, PostDto postDto, AuthenticationUser user) {
        Post post = postRepository.findById(id).orElseThrow( () -> new LinkedinException("Post no encontrado"));
        if(!post.getAuthor().getId().equals(user.getId())){
            throw new LinkedinException("El usuario no es el autor del post");
        }
        post.setContent(postDto.getContent());
        post.setPicture(postDto.getPicture());
        return postRepository.save(post);
    }


    public List<Post> getFeedPosts(AuthenticationUser user) {
        return postRepository.findByAuthorIdNotOrderByCreationDateDesc(user.getId());
    }


    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreationDateDesc();
    }

    public ResponseEntity<Void> deletePost(Long id, AuthenticationUser user) {
        Post post = postRepository.findById(id).orElseThrow( () -> new LinkedinException("Post no encontrado"));
        if(!post.getAuthor().getId().equals(user.getId())){
            throw new LinkedinException("El usuario no es el autor del post");
        }
        postRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByAuthorId(userId);
    }

    public Post likeUnlikePost(Long postId, AuthenticationUser user) {
        Post post = postRepository.findById(postId)
                .orElseThrow( () -> new LinkedinException("Post no encontrado") );
        AuthenticationUser author = userRepository.findById(user.getId())
                .orElseThrow( () -> new UserNotFoundException("Usuario no encontrado") );
        String mensaje = "";
        if(post.getLikes().contains(user)){
            post.getLikes().remove(user);
            mensaje = "Se ha quitado el like del post";
        }else{
            post.getLikes().add(user);
            mensaje = "Se ha dado like al post";
        }
        System.out.println(mensaje);
        return postRepository.save(post);
    }

    public ResponseEntity<?> getOnePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow( () -> new LinkedinException("Post no encontrado") );
        return ResponseEntity.ok().body(post);
    }


    public Comment addComent(Long postId, CommentDto commentDto, AuthenticationUser user) {
        Post post = postRepository.findById(postId)
                .orElseThrow( () -> new LinkedinException("Post no encontrado"));
        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setAuthor(user);
        comment.setPost(post);
        return commentRepository.save(comment);
    }


    public Comment editComment(Long commentId, CommentDto commentDto, AuthenticationUser user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow( () -> new LinkedinException("Comentario no encontrado") );
        AuthenticationUser author = userRepository.findById(user.getId())
                .orElseThrow( () -> new LinkedinException("Usuario no encontrado") );
        if(!comment.getAuthor().equals(author)){
            throw new LinkedinException("El usuario no es el autor del comentario");
        }
        comment.setContent(commentDto.getContent());
        return commentRepository.save(comment);
    }


    public void deleteComment(Long commentId, AuthenticationUser user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow( () -> new LinkedinException("Comentario no encontrado") );
        AuthenticationUser author = userRepository.findById(user.getId())
                .orElseThrow( () -> new LinkedinException("Usuario no encontrado") );
        if(!comment.getAuthor().equals(author)){
            throw new LinkedinException("El usuario no es el autor del comentario");
        }
        commentRepository.delete(comment);
    }
}
