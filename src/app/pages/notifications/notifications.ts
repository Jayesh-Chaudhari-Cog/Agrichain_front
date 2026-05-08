import { Component, signal, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebNameElement } from "../../elements/web-name";
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast-service';
import { Notification } from '../../models/dto.model';
import { USER_INFO } from '../../elements/constants';
import { Loader } from '../../common-components/loader/loader';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NotificationStatus } from '../../models/enum.model';
import { faBullhorn, faTriangleExclamation, faCircleCheck, faClose, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'notifications-pop',
    standalone: true,
    imports: [CommonModule, Loader, FaIconComponent],
    templateUrl: './notifications.html',
    styleUrl: './notifications.css'
})
export class NotificationPop {
    private notificationService = inject(NotificationService);
    private toast = inject(ToastService);
    user = JSON.parse(localStorage.getItem(USER_INFO) || '{}');

    faClose = faClose;
    faBoardcast = faBullhorn;
    faAlert = faTriangleExclamation;
    faVerification = faCircleCheck;
    faRead = faCheckDouble;

    notifications = signal<Notification[]>([]);
    loading = signal(false);

    @Output() close = new EventEmitter<void>();

    onCloseClick() {
        this.close.emit();
    }

    ngOnInit(): void {
        this.fetchNotifications();
    }

    fetchNotifications() {
        this.loading.set(true);
        this.notificationService.getAllNotifications().subscribe({
            next: (data) => {
                const broadcasts = data.filter(n => {
                    if (n.userId == null) {
                        return this.user.role === n.role || n.role == null;
                    }
                    return n.userId === this.user.id;
                });
                this.notifications.set(broadcasts);
                this.loading.set(false);
            },
            error: (err) => {
                this.toast.show('Error fecthing notificaitons', 'alert');
                console.error('Error fetching notifications', err);
                this.loading.set(false);
            }
        });
    }

    markAsRead(id: number) {
        this.notificationService.updateStatus(id).subscribe({
            next: (updatedNoti) => {
                this.notifications.update(list =>
                    list.map(n => n.notificationID === id ? { ...n, status: NotificationStatus.READ } : n)
                );
                this.toast.show('Marked as read', 'success');
            },
            error: (err) => {
                this.toast.show('Failed to update status', 'alert');
            }
        });
    }
}