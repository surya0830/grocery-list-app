export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  category: string;
  description: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
}

export interface Order {
  id: string;
  date: string;
  store: Store;
  deliveryAddress: string;
  status: 'pending' | 'processing' | 'delivering' | 'delivered' | 'cancelled';
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  shopper?: {
    name: string;
    phone: string;
    rating: number;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
} 