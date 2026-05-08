import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';
import { user } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  isEditing = signal(false);
  userData = signal<user | null>(null);
  editForm: user = {
    name: '',
    email: '',
    phone: '',
    role: ''
  };

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      this.userData.set(parsedUser);
      this.editForm = { ...parsedUser };
    }
  }

  toggleEdit() {
    if (this.isEditing()) {
      // Revert changes if cancelling
      if (this.userData()) {
        this.editForm = { ...this.userData()! };
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
