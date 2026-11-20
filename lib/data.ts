import { formatPrice } from "@/lib/currency";

export type Company = {
  // number for the seeded demo catalogue, uuid string for real worker_profiles rows.
  id: number | string;
  /**
   * True for the seeded example catalogue below. The UI badges these so a
   * visitor is never shown an example as though it were a real business, and
   * `lib/workers.ts` retires them once real listings exist.
   */
  isDemo?: boolean;
  name: string;
  type: string;
  desc: string;
  aboutUs: string;
  services: string[];
  availableDays: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  city: string;
  isVerified?: boolean;
};

const DEMO_CATALOGUE: Omit<Company, "isDemo">[] = [
  {
    id: 1,
    name: "AquaFix Plumbing",
    type: "Plumber",
    desc: "Emergency repairs, pipe fitting & full bathroom installs. Available 24/7.",
    aboutUs: "AquaFix Plumbing has been serving the community for over 15 years. We pride ourselves on quick response times and high-quality workmanship.",
    services: ["Emergency Leak Repair", "Pipe Fitting", "Bathroom Remodeling", "Water Heater Installation"],
    availableDays: "Monday - Sunday (24/7)",
    rating: 4.9,
    reviews: 312,
    price: "900",
    city: "Skopje",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "BrightWire Electrical",
    type: "Electrician",
    desc: "Certified electricians for rewiring, panels & smart home setups.",
    aboutUs: "BrightWire Electrical specializes in modernizing homes. From simple fixture swaps to full panel upgrades, we ensure safety and efficiency.",
    services: ["Full Home Rewiring", "Smart Home Setup", "Panel Upgrades", "Lighting Design"],
    availableDays: "Monday - Saturday",
    rating: 4.8,
    reviews: 278,
    price: "1100",
    city: "Skopje",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Colour & Co. Painters",
    type: "Painter",
    desc: "Interior & exterior painting with premium eco-friendly paints.",
    aboutUs: "We bring color to your life. Our team uses only the highest quality, low-VOC paints to ensure a beautiful and safe environment for your family.",
    services: ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Wallpaper Removal"],
    availableDays: "Monday - Friday",
    rating: 4.7,
    reviews: 214,
    price: "800",
    city: "Bitola",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Oak & Timber Carpentry",
    type: "Carpenter",
    desc: "Custom built-ins, doors, decking & structural woodwork.",
    aboutUs: "Master craftsmen dedicated to creating beautiful, enduring woodwork. We build custom solutions tailored precisely to your space.",
    services: ["Custom Built-ins", "Deck Construction", "Door Installation", "Structural Framing"],
    availableDays: "Monday - Saturday",
    rating: 4.9,
    reviews: 189,
    price: "1200",
    city: "Skopje",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "GreenThumb Gardens",
    type: "Gardener",
    desc: "Landscaping, lawn care, hedge trimming & seasonal planting.",
    aboutUs: "Transforming outdoor spaces into lush retreats. Whether you need regular maintenance or a complete landscape redesign, we can help.",
    services: ["Lawn Maintenance", "Landscape Design", "Hedge Trimming", "Seasonal Planting"],
    availableDays: "Tuesday - Sunday",
    rating: 4.6,
    reviews: 301,
    price: "700",
    city: "Tetovo",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "TopSeal Roofing",
    type: "Roofer",
    desc: "Roof repairs, full replacements, gutters & waterproofing.",
    aboutUs: "Protecting your home from the top down. We provide comprehensive roofing services with an iron-clad warranty on all full replacements.",
    services: ["Leak Repairs", "Full Roof Replacement", "Gutter Cleaning & Installation", "Skylight Installation"],
    availableDays: "Monday - Friday",
    rating: 4.8,
    reviews: 156,
    price: "1500",
    city: "Bitola",
    image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Perfect Tile Co.",
    type: "Tiler",
    desc: "Bathroom, kitchen & floor tiling with precision cutting.",
    aboutUs: "Meticulous tile setting for kitchens, bathrooms, and living areas. We handle everything from standard ceramics to large-format porcelain.",
    services: ["Bathroom Tiling", "Kitchen Backsplashes", "Floor Tiling", "Grout Restoration"],
    availableDays: "Monday - Saturday",
    rating: 4.7,
    reviews: 245,
    price: "950",
    city: "Skopje",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "CoolAir HVAC Services",
    type: "HVAC",
    desc: "Heating, cooling & ventilation installs, servicing & gas safety checks.",
    aboutUs: "Keeping your home comfortable year-round. Our certified technicians handle all major brands of AC units and furnaces.",
    services: ["AC Repair", "Furnace Installation", "Duct Cleaning", "Annual Maintenance Contracts"],
    availableDays: "Monday - Sunday",
    rating: 4.5,
    reviews: 198,
    price: "1300",
    city: "Kumanovo",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Elite Masonry Works",
    type: "Mason",
    desc: "Stone walls, concrete work, patios & brick restoration services.",
    aboutUs: "Building strong foundations and beautiful stone facades. We blend traditional masonry techniques with modern durability.",
    services: ["Brick Restoration", "Concrete Patios", "Stone Retaining Walls", "Chimney Repair"],
    availableDays: "Monday - Friday",
    rating: 4.8,
    reviews: 173,
    price: "1150",
    city: "Bitola",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "SafeLock Solutions",
    type: "Locksmith",
    desc: "24/7 emergency lockouts, smart locks & full security upgrades.",
    aboutUs: "Your security is our priority. We provide fast, reliable locksmith services, including cutting-edge smart lock installations.",
    services: ["Emergency Lockouts", "Smart Lock Installation", "Key Duplication", "Security Audits"],
    availableDays: "Monday - Sunday (24/7)",
    rating: 4.9,
    reviews: 142,
    price: "850",
    city: "Skopje",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 11,
    name: "SparkClean Services",
    type: "Cleaner",
    desc: "Deep home cleaning, office cleaning & post-renovation cleanup.",
    aboutUs: "We don't just clean; we revitalize spaces. Our thorough cleaning protocols ensure every corner shines.",
    services: ["Deep Residential Cleaning", "Move-in/Move-out Cleaning", "Post-renovation Cleanup", "Office Cleaning"],
    availableDays: "Monday - Saturday",
    rating: 4.6,
    reviews: 388,
    price: "550",
    city: "Tetovo",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 12,
    name: "Precision Flooring",
    type: "Flooring",
    desc: "Laminate, hardwood & luxury vinyl floor installation experts.",
    aboutUs: "Transform the look of your home from the ground up. We provide flawless installation of all types of modern flooring.",
    services: ["Hardwood Installation", "Laminate Flooring", "Vinyl Plank Installation", "Floor Refinishing"],
    availableDays: "Monday - Friday",
    rating: 4.8,
    reviews: 221,
    price: "1050",
    city: "Kumanovo",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  },
];

/**
 * Example listings, shown so the marketplace does not look broken before the
 * first tradespeople sign up. Every entry is marked `isDemo`, which is what the
 * UI badges and what `shouldIncludeDemoListings` keys off. These are invented
 * businesses with stock photography: never present one as a real company, and
 * never copy a rating or review count out of here.
 */
export const COMPANIES: Company[] = DEMO_CATALOGUE.map((company) => ({
  ...company,
  isDemo: true,
  // Real listings get their currency in `rowToCompany`; these need it too, or
  // the marketplace would show "900" beside "900 ден".
  price: formatPrice(company.price),
}));

export const TRADE_CATEGORIES = [
  "Plumber",
  "Electrician",
  "Painter",
  "Carpenter",
  "Gardener",
  "Roofer",
  "Tiler",
  "HVAC",
  "Mason",
  "Locksmith",
  "Cleaner",
  "Flooring",
] as const;

export type TradeCategory = (typeof TRADE_CATEGORIES)[number];

export const TYPES =["All Types", ...TRADE_CATEGORIES];

/**
 * Maps a `?type=` URL value (e.g. from a footer or home-page link) to a known
 * trade category, case-insensitively. Unknown or missing values mean no filter.
 */
export function tradeCategoryFromParam(value: string | null | undefined): TradeCategory | null {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return null
  return TRADE_CATEGORIES.find((trade) => trade.toLowerCase() === normalized) ?? null
}

export const CITIES = [
  "Skopje",
  "Bitola",
  "Kumanovo",
  "Prilep",
  "Tetovo",
  "Veles",
  "Ohrid",
  "Gostivar",
  "Štip",
  "Strumica",
  "Kavadarci",
  "Kočani",
  "Kičevo",
  "Struga",
  "Radoviš",
  "Gevgelija",
  "Debar",
  "Kriva Palanka",
  "Sveti Nikole",
  "Negotino",
  "Delčevo",
  "Vinica",
  "Resen",
  "Berovo",
  "Probištip",
] as const;


