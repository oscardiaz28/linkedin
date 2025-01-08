package com.linkedin.linkedin.features.authentication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.linkedin.linkedin.features.feed.model.Post;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "users")
public class AuthenticationUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    private String emailVerificationToken;
    private Boolean emailVerified = false;
    private LocalDateTime emailVerificationTokenExpiryDate = null;
    @JsonIgnore
    private String password;
    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiryDate = null;

    private String firstName = null;
    private String lastName = null;
    private String company = null;
    private String position = null;
    private String location = null;
    private Boolean profileCompleted = false;
    private String profilePicture = null;

    @OneToMany(
            cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "author"
    )
    @JsonIgnore
    private List<Post> posts;

    public AuthenticationUser(String email, String password){
        this.email = email;
        this.password = password;
    }

    public AuthenticationUser(){}

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateProfileCompletionStatus();
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateProfileCompletionStatus();
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
        updateProfileCompletionStatus();
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
        updateProfileCompletionStatus();
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
        updateProfileCompletionStatus();
    }

    public Boolean getProfileCompleted() {
        return profileCompleted;
    }

    public void setProfileCompleted(Boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmailVerificationToken() {
        return emailVerificationToken;
    }

    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getPasswordResetToken() {
        return passwordResetToken;
    }

    public void setPasswordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
    }

    public LocalDateTime getEmailVerificationTokenExpiryDate() {
        return emailVerificationTokenExpiryDate;
    }

    public void setEmailVerificationTokenExpiryDate(LocalDateTime emailVerificationTokenExpiryDate) {
        this.emailVerificationTokenExpiryDate = emailVerificationTokenExpiryDate;
    }

    public LocalDateTime getPasswordResetTokenExpiryDate() {
        return passwordResetTokenExpiryDate;
    }

    public void setPasswordResetTokenExpiryDate(LocalDateTime passwordResetTokenExpiryDate) {
        this.passwordResetTokenExpiryDate = passwordResetTokenExpiryDate;
    }

    private void updateProfileCompletionStatus(){
        this.profileCompleted = (this.firstName != null && this.lastName != null && this.company != null
        && this.position != null && this.location != null);
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    @Override
    public boolean equals(Object o){
        if(this == o){
            return true;
        }
        if(o == null || getClass() != o.getClass() ){
            return false;
        }
        AuthenticationUser that = (AuthenticationUser) o;
        return Objects.equals(id, that.id);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
