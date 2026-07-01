export type FormState = {
  fullName: string;
  email: string;
  phone: string;
  bookingType: "order" | "experience"; // "order" for purchasing, "experience" for showroom booking
  chairId?: string; // 'comfort' | 'balance' | 'luxe'
  quantity?: number;
  shippingAddress?: string;
  preferredDate?: string;
  preferredTime?: string;
  showroomLocation?: string; // "Hanoi" | "HCMC"
  details?: string;
};
