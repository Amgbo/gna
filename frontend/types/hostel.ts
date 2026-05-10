export interface Room {
  id: string;
  hostelId: string;
  type: "SINGLE" | "SHARED";
  pricePerSemester: string;
  totalBeds: number;
  availableBeds: number;
}

export interface AmenitySummary {
  id: string;
  name: string;
  category?: string;
  icon?: string | null;
  description?: string | null;
}

export interface Hostel {
  id: string;
  name: string;
  description: string;
  address: string;
  distance_from_campus: number;
  amenities: AmenitySummary[];
  landlordId: string;
  isVerified: boolean;
  rooms: Room[];
}
