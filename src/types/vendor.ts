export interface Vendor {
  id: number;
  name: string;
  contact: string;
  location: string;
  category: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorCategory {
  id: string;
  name: string;
  icon: string;
  route: string;
  color: string;
}