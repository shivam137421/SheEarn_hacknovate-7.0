package com.shearn.service;

import com.shearn.model.SosAlert;
import com.shearn.model.User;
import com.shearn.repository.SosAlertRepository;
import com.shearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

/**
 * SOS Safety Service - handles emergency alerts
 * In production: integrate with SMS gateway (Twilio) or push notifications
 */
@Service
public class SosService {

    @Autowired private SosAlertRepository sosAlertRepository;
    @Autowired private UserRepository userRepository;

    /** Trigger an SOS alert from a woman user */
    public SosAlert triggerSos(String userId, double latitude, double longitude,
                               String locationDescription, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SosAlert alert = new SosAlert();
        alert.setUserId(userId);
        alert.setUserName(user.getName());
        alert.setUserPhone(user.getPhone());
        alert.setLatitude(latitude);
        alert.setLongitude(longitude);
        alert.setLocationDescription(locationDescription);
        alert.setMessage(message != null ? message : "Emergency! I need help.");
        alert.setStatus("ACTIVE");
        alert.setEmergencyContact(user.getEmergencyContact());
        alert.setEmergencyPhone(user.getEmergencyPhone());

        SosAlert saved = sosAlertRepository.save(alert);

        // Simulate notification (log to console; replace with Twilio/FCM in production)
        System.out.println("🚨 SOS ALERT TRIGGERED!");
        System.out.println("User: " + user.getName() + " | Phone: " + user.getPhone());
        System.out.println("Location: " + latitude + ", " + longitude);
        System.out.println("Emergency Contact: " + user.getEmergencyContact()
                + " (" + user.getEmergencyPhone() + ")");
        System.out.println("Message: " + alert.getMessage());

        // Mark notification as sent (mock)
        saved.setNotificationSent(true);
        return sosAlertRepository.save(saved);
    }

    /** Resolve an SOS alert */
    public SosAlert resolveSos(String alertId, String userId) {
        SosAlert alert = sosAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to resolve this alert");
        }

        alert.setStatus("RESOLVED");
        alert.setResolvedAt(LocalDateTime.now());
        return sosAlertRepository.save(alert);
    }

    /** Get SOS history for a user */
    public List<SosAlert> getUserAlerts(String userId) {
        return sosAlertRepository.findByUserId(userId);
    }

    /** Get all active alerts (admin use) */
    public List<SosAlert> getActiveAlerts() {
        return sosAlertRepository.findByStatus("ACTIVE");
    }
}
