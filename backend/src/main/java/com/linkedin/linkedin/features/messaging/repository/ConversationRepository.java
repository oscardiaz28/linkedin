package com.linkedin.linkedin.features.messaging.repository;

import com.linkedin.linkedin.features.authentication.model.AuthenticationUser;
import com.linkedin.linkedin.features.messaging.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByAuthorAndRecipient(AuthenticationUser user, AuthenticationUser recipient);
    List<Conversation> findByAuthorOrRecipient(AuthenticationUser userOne, AuthenticationUser userTwo);

}
