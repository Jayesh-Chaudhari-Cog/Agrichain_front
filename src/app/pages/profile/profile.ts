import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';
import { User } from '../../models/user.model';
import { UserRole, UserStatus } from '../../models/enum.model';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { currentUser } from '../../elements/constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  faEdit = faEdit;

  isEditing = signal(false);
  userData = signal<User | null>(null);
  editForm: User = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    role: UserRole.FARMER,
    status: UserStatus.ACTIVE
  };

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const currentUser = getCurrentUser();
    if (currentUser && Object.keys(currentUser).length > 0) {
      this.userData.set(currentUser);
      this.editForm = { ...currentUser };
    }
  }

  toggleEdit() {
    if (this.isEditing()) {
      const currentData = this.userData();
      if (currentData) {
        this.editForm = { ...currentData };
      }
    }
    this.isEditing.set(!this.isEditing());
  }

  onSave() {
    this.authService.updateUser(this.editForm).subscribe({
      next: () => {
        this.userData.set({ ...this.editForm });
        this.isEditing.set(false);
        this.toast.show('Profile updated successfully!', 'success');
      },
      error: (err) => {
        console.error('Update failed', err);
        this.toast.show('Failed to update profile. Please try again.', 'alert');
      }
    });
  }
}
