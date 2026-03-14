export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stars: number;
  reviewCount: number;
  category?: string;
  slug?: string;
  createdAt?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  paymentMethod?: string;
  paymentStatus: string;
  createdAt: number;
  date: string;
}
