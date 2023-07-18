export interface CartAttrs {
  userId: string;
  products: [
    {
      productId: string;
      quantity: number;
    }
  ];
}

export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Returned = "returned",
  Refunded = "refunded",
}

export interface OrderAttrs {
  userId: string;
  cartId: string;
  totalPrice: number;
  address: Object;
  status: OrderStatus;
}

export interface FlashSale {
  active: boolean;
  discount: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface ProductAttrs {
  available?: boolean;
  title: string;
  img: string;
  description: string;
  category: string;
  sizes: Array<string>;
  gender: string;
  inStock: number;
  color: Array<string>;
  price: string;
  avaliableQuantity: number;
  flashSale: FlashSale;
  reservedQuantity?: number;
  ratings?: Array<number>;
}

export interface Address {
  street: string;
  houseNumber?: number;
  zipCode: string;
  state: string;
  country: string;
  phoneNumber: string;
  additionalInfo?: string;
}

export interface UserAttrs {
  username: string;
  email: string;
  password: string;
  gender: string;
  resetToken?: string;
  resetTokenExpiration?: number;
  isAdmin: boolean;
  address: Address;
}
