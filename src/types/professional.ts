
export interface Professional {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url?: string;
  specialties: string[];
}

export interface ProfessionalFormData {
  name: string;
  role: string;
  description: string;
  specialties: string;
}
