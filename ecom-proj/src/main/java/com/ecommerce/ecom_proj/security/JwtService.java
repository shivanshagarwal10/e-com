package com.ecommerce.ecom_proj.security;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String base64Secret;

    @Value("${app.jwt.expiration-ms:3600000}") // 1 hour default
    private long expirationMs;

    private SecretKey key() {
        // SECRET MUST BE BASE64
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
    }

    // keep a 1-arg method
    public String generateToken(String subject) {
        return generateToken(subject, Map.of());
    }

    // add a 2-arg overload (so your service can pass claims)
    public String generateToken(String subject, Map<String, ?> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(subject)
            .claims(claims)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(expirationMs)))
            .signWith(key(), Jwts.SIG.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(key()).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token, String expectedSubject) {
        var payload = Jwts.parser().verifyWith(key()).build()
            .parseSignedClaims(token).getPayload();
        return payload.getExpiration().after(new Date())
            && expectedSubject.equals(payload.getSubject());
    }
}
