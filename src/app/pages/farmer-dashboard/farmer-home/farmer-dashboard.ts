import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { API_URL, FARMER_REGI } from '../../../elements/constants';
import { VerifyPending } from '../../../common-components/verify-pending/verify-pending';
import { UserService } from '../../../services/user-service';
import { Farmer } from '../../../models/user.model';
import { faL } from '@fortawesome/free-solid-svg-icons';

// Interface to match your Backend CropListingDTO
interface CropListing {
	listingId?: number | string;
	cropType: string;
	quantity: number;
	price: number;
	location: string;
	status: string;
}

@Component({
	selector: 'app-farmer-dashboard',
	standalone: true,
	imports: [CommonModule, FormsModule, VerifyPending],
	templateUrl: './farmer-dashboard.html',
	styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage implements OnInit {
	private authService = inject(AuthService);
	private http = inject(HttpClient);

	isApproved = signal(false);

	farmerName = signal('');
	status = signal('');

	ngOnInit() {
		this.loadFarmerData();
	}

	listedCropsCount = signal(0);
	totalEarnings = signal(45200.50);
	activeAlerts = signal(3);

	activeTab = signal('dashboard');

	showAddForm = signal(false);
	newCrop = {
		cropType: '',
		quantity: 0,
		price: 0,
		location: ''
	};

	recentListings = signal<CropListing[]>([]);

	loadFarmerData() {
		const user = this.authService.currentUser();
		if (user) {
			this.farmerName.set(user.name);

			this.http.get<Farmer>(`${API_URL}farmers/get-by-userid/${user.id}`)
				.subscribe({
					next: (data) => {
						this.status.set(data.status);
						this.isApproved.set(data.status === "APPROVED");
					},
					error: (err) => {
						this.isApproved.set(false);
					}
				});

			if (user.id) {
				this.http.get<CropListing[]>(`${API_URL}market/listings/farmer/${user.id}`)
					.subscribe({
						next: (data) => {
							this.recentListings.set(data);
							this.listedCropsCount.set(data.length);
						},
						error: (err) => {
							console.error("Failed to load listings:", err);
						}
					});
			}
		}
	}

	setActiveTab(tab: string) {
		this.activeTab.set(tab);
	}

	onAddCrop() {
		this.showAddForm.set(true);
	}

	onApplySubsidy() { console.log("Opening Subsidy Program List..."); }

	submitCrop() {
		const user = this.authService.currentUser();

		if (!user || !user.id) {
			alert("Please log in first!");
			return;
		}

		const payload = {
			...this.newCrop,
			farmerId: user.id // Links listing to Harini's account
		};

		this.http.post('http://localhost:8090/market/createlisting', payload)
			.subscribe({
				next: (res) => {
					alert("Crop listed successfully!");
					this.showAddForm.set(false);
					this.newCrop = { cropType: '', quantity: 0, price: 0, location: '' };

					// REFRESH the list immediately after adding a new crop
					this.loadFarmerData();
				},
				error: (err) => {
					console.error("Listing failed", err);
					alert("Error: Check if your Market Microservice is running.");
				}
			});
	}
}