package wontouch.api.domain.notification.model.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wontouch.api.domain.notification.entity.Notification;
import wontouch.api.domain.notification.model.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationMonitoringService {

    private final NotificationRepository notificationRepository;

    // 새벽 4시에 2주 지난 알림 삭제 진행
    @Scheduled(cron = "0 0 4 * * *")
    @Transactional
    public void deleteNotification() {
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);

        // 알림이 많을 경우 성능을 위해 배치 삭제
        List<Notification> oldNotifications;
        do {
            oldNotifications = notificationRepository.findByCreateAtBefore(twoWeeksAgo, PageRequest.of(0, 100));
            notificationRepository.deleteAll(oldNotifications);
        } while (!oldNotifications.isEmpty());
    }
}
