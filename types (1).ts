export type Project = {
  id: string;
  title: string;
  category: "Wedding" | "Commercial" | "Music Video" | "Reel" | "YouTube" | "Event" | "Custom";
  client: string;
  year: number;
  software: string[];
  description: string;
  thumbnail_url: string;
  video_url: string;
  before_url: string | null;
  after_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  price_label: string;
  description: string;
  features: string[];
  featured: boolean;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_role: string;
  quote: string;
  avatar_url: string | null;
  rating: number;
  sort_order: number;
};

export type SiteSettings = {
  id: number;
  hero_name: string;
  hero_tagline: string;
  about_bio: string;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  email: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  availability_status: "Available" | "Booking Fast" | "Fully Booked";
};

export type Message = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget: string;
  message: string;
  read: boolean;
  created_at: string;
};
