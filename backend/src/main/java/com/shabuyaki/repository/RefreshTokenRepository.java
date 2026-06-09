package com.shabuyaki.repository;

import com.shabuyaki.entity.AdminUser;
import com.shabuyaki.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    void deleteByAdminUser(AdminUser adminUser);
    void deleteByExpiresAtBefore(LocalDateTime now);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.adminUser = :user AND rt.expiresAt > :now")
    List<RefreshToken> findValidTokensByUser(@Param("user") AdminUser user,
                                             @Param("now") LocalDateTime now);
}
