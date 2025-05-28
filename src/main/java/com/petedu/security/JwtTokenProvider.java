package com.petedu.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    private final SecretKey jwtSecret;
    private final int jwtExpirationInMs;
    private final int refreshExpirationInMs;
    
    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String jwtSecretString,
            @Value("${app.jwt.expiration}") int jwtExpirationInMs,
            @Value("${app.jwt.refresh-expiration}") int refreshExpirationInMs) {
        this.jwtSecret = Keys.hmacShaKeyFor(jwtSecretString.getBytes());
        this.jwtExpirationInMs = jwtExpirationInMs;
        this.refreshExpirationInMs = refreshExpirationInMs;
    }
    
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);
        
        return Jwts.builder()
                .subject(Long.toString(userPrincipal.getId()))
                .issuedAt(new Date())
                .expiration(expiryDate)
                .signWith(jwtSecret)
                .compact();
    }
    
    public String generateRefreshToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date expiryDate = new Date(System.currentTimeMillis() + refreshExpirationInMs);
        
        return Jwts.builder()
                .subject(Long.toString(userPrincipal.getId()))
                .issuedAt(new Date())
                .expiration(expiryDate)
                .signWith(jwtSecret)
                .compact();
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(jwtSecret)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        
        return Long.parseLong(claims.getSubject());
    }
    
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(jwtSecret)
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (SecurityException ex) {
            // Invalid JWT signature
        } catch (MalformedJwtException ex) {
            // Invalid JWT token
        } catch (ExpiredJwtException ex) {
            // Expired JWT token
        } catch (UnsupportedJwtException ex) {
            // Unsupported JWT token
        } catch (IllegalArgumentException ex) {
            // JWT claims string is empty
        }
        return false;
    }
}