export interface ChairModel {
  name: string;
  desc: string;
  price: number;
  priceStr: string;
  deposit: number;
  depositStr: string;
  image: string;
  features: string[];
}

export const CHAIR_MODELS: Record<string, ChairModel> = {
  comfort: {
    name: "Heli Comfort",
    desc: "Standard AI Wellness",
    price: 15000000,
    priceStr: "15,000,000 VND",
    deposit: 3000000,
    depositStr: "3,000,000 VND",
    image: "/low.avif",
    features: ["6 AI auto-programs", "2D Smart Rollers", "Bluetooth Audio", "Heat Therapy"]
  },
  balance: {
    name: "Heli Balance",
    desc: "Premium Zero-Gravity Wellness",
    price: 30000000,
    priceStr: "30,000,000 VND",
    deposit: 6000000,
    depositStr: "6,000,000 VND",
    image: "/mid.avif",
    features: ["10 AI auto-programs", "3D Smart Rollers", "Zero Gravity Track", "Full-body Airbags", "Heli Health App"]
  },
  luxe: {
    name: "Heli Luxe",
    desc: "Ultimate Biosensor Wellness",
    price: 50000000,
    priceStr: "50,000,000 VND",
    deposit: 10000000,
    depositStr: "10,000,000 VND",
    image: "/high.avif",
    features: ["16 AI auto-programs", "4D Zero-Gravity SLS", "Biosensor Pain Detection", "Graphene Heating", "Voice Control System", "Dolby Audio"]
  }
};

export const getChairDetails = (chairId: string): ChairModel | null => {
  return CHAIR_MODELS[chairId] || null;
};
