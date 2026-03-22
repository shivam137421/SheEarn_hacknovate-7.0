package com.shearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * SOS Alert model - records emergency alerts from women users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sos_alerts")
public class SosAlert {

    @Id
    private String id;

    private String userId;
    private String userName;
    private String userPhone;

    // Location at time of SOS
    private double latitude;
    private double longitude;
    private String locationDescription;

    // Alert details
    private String message;
    private String status; // "ACTIVE", "RESOLVED", "FALSE_ALARM"

    private LocalDateTime triggeredAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    // Notified contacts
    private String emergencyContact;
    private String emergencyPhone;
    private boolean notificationSent = false;
}
