export interface CropListingDTO {
  listingId?: number;
  farmerId: number;
  cropType: string;
  quantity: number;
  price: number;
  location: string;
  status?: string;
}

export interface OrderDTO {
  orderId?: number;
  listingId: number;
  traderId: number;
  quantity: number;
  orderDate: string;
  orderStatus?: string;
}