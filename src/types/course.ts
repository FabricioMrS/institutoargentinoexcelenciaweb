
export interface Course {
  id: string;
  title: string;
  category: string;
  main_category: string | null;
  image: string;
  price: number;
  slug: string;
  featured: boolean | null;
  enabled: boolean | null;
  duration: number;
  modality: string;
  schedule: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  default_financing_option: number | null;
  enrollment_password: string | null;
}
