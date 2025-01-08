package com.linkedin.linkedin.configuration;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.authentication.repository.AuthenticationUserRepository;
import com.linkedin.linkedin.features.authentication.utils.Encoder;
import com.linkedin.linkedin.features.feed.model.Post;
import com.linkedin.linkedin.features.feed.repository.PostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.List;
import java.util.Random;

@Configuration
public class LoadDatabaseConfiguration {

    private final Encoder encoder;
    private final PostRepository postRepository;

    public LoadDatabaseConfiguration(Encoder encoder, PostRepository postRepository){
        this.encoder = encoder;
        this.postRepository = postRepository;
    }

    @Bean
    public CommandLineRunner initDatabase(AuthenticationUserRepository repository){
        return args -> {
            List<AuthenticationUser> users = createUsers(repository);
            //createConnections(connectionRepository, users);
            createPosts(postRepository, users);
        };
    }

    private List<AuthenticationUser> createUsers(AuthenticationUserRepository userRepository) {
        List<AuthenticationUser> users = List.of(
                createUser("john.doe@example.com", "john", "John", "Doe", "Software Engineer", "Docker Inc.",
                        "San Francisco, CA",
                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("anne.claire@example.com", "anne", "Anne", "Claire", "HR Manager", "eToro", "Paris, Fr",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("arnauld.manner@example.com", "arnauld", "Arnauld", "Manner", "Product Manager", "Arc",
                        "Dakar, SN",
                        "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?q=80&w=2725&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("moussa.diop@example.com", "moussa", "Moussa", "Diop", "Software Engineer", "Orange",
                        "Bordeaux, FR",
                        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("awa.diop@example.com", "awa", "Awa", "Diop", "Data Scientist", "Zoho", "New Delhi, IN",
                        "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"));

        userRepository.saveAll(users);
        return users;
    }

    private AuthenticationUser createUser(String email, String password, String firstName, String lastName,
                            String position, String company, String location, String profilePicture) {
        AuthenticationUser user = new AuthenticationUser(email, encoder.encode(password));
        user.setEmailVerified(true);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPosition(position);
        user.setCompany(company);
        user.setLocation(location);
        user.setProfilePicture(profilePicture);
        return user;
    }

    private void createPosts(PostRepository postRepository, List<AuthenticationUser> users) {
        Random random = new Random();
        String[] postContents = {
                "Exploring the latest in AI technology!",
                "Team building event was a huge success.",
                "Sharing insights from my latest project.",
                "Reflecting on the importance of work-life balance.",
                "Here's a book recommendation for all leaders.",
                "Attended an amazing workshop on cloud computing.",
                "Excited to announce a new role at an incredible company.",
                "Key takeaways from the industry conference this week.",
                "Here's how to effectively lead remote teams.",
                "Grateful for the opportunities to learn and grow this year."
        };

        for (int j = 1; j <= 20; j++) {
            String content = postContents[random.nextInt(postContents.length)];
            AuthenticationUser author = users.get(random.nextInt(users.size()));
            Post post = new Post(content, author);
            post.setLikes(generateLikes(users, random));
            if (j == 2) {
                post.setPicture("https://images.unsplash.com/photo-1731176497854-f9ea4dd52eb6?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
            }
            postRepository.save(post);
        }
    }

    private HashSet<AuthenticationUser> generateLikes(List<AuthenticationUser> users, Random random) {
        HashSet<AuthenticationUser> likes = new HashSet<>();
        int likesCount = random.nextInt(users.size()) / 2;

        while (likes.size() < likesCount) {
            likes.add(users.get(random.nextInt(users.size())));
        }
        return likes;
    }


}
