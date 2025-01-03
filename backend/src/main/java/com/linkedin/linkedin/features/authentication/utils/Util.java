package com.linkedin.linkedin.features.authentication.utils;

import java.security.SecureRandom;
import java.util.UUID;

public class Util {
    public static String generateEmailVerificationToken(){
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder(5);
        for(int i = 0; i < 5; i++){
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

}
