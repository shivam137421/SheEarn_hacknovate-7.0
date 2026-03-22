package com.shearn.security;
import javax.crypto.SecretKey;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Base64;

/**
 * JWT Utility - handles token generation, validation, and extraction
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /** Generate JWT token for authenticated user */
    public String generateToken(String userId, String email, String role) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /** Extract user ID from token */
    public String getUserIdFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /** Extract role from token */
    public String getRoleFromToken(String token) {
        return (String) parseClaims(token).get("role");
    }

    /** Extract email from token */
    public String getEmailFromToken(String token) {
        return (String) parseClaims(token).get("email");
    }

    /** Validate token - returns true if valid */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())   // ✅ correct key
                .build()
                .parseSignedClaims(token)      // returns Jws<Claims>
                .getPayload();                 // ✅ extract claims
    }
    }

