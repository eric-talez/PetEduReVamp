package com.petedu.domain.user.entity;

public enum UserRole {
    USER("user"),
    PET_OWNER("pet-owner"),
    TRAINER("trainer"),
    INSTITUTE_ADMIN("institute-admin"),
    ADMIN("admin");
    
    private final String value;
    
    UserRole(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static UserRole fromValue(String value) {
        for (UserRole role : UserRole.values()) {
            if (role.value.equals(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + value);
    }
}