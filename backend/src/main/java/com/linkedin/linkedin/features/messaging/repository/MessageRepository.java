package com.linkedin.linkedin.features.messaging.repository;

import com.linkedin.linkedin.features.messaging.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
