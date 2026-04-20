// Application-wide constants

export const REQUEST_CATEGORIES = [
  { value: 'rescue', label: 'Rescue', icon: 'life-buoy' },
  { value: 'medical', label: 'Medical', icon: 'heart-pulse' },
  { value: 'food', label: 'Food & Water', icon: 'utensils' },
  { value: 'shelter', label: 'Shelter', icon: 'home' },
  { value: 'clothing', label: 'Clothing', icon: 'shirt' },
  { value: 'transport', label: 'Transport', icon: 'truck' },
  { value: 'other', label: 'Other', icon: 'help-circle' },
];

export const PRIORITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: '#ff4757' },
  { value: 'high', label: 'High', color: '#ff8c42' },
  { value: 'medium', label: 'Medium', color: '#ffc542' },
  { value: 'low', label: 'Low', color: '#26de81' },
];

export const REQUEST_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const VOLUNTEER_SKILLS = [
  'First Aid', 'Medical', 'Driving', 'Cooking', 'Construction',
  'Counseling', 'Search & Rescue', 'Communication', 'Logistics',
  'Child Care', 'Elder Care', 'Translation', 'IT Support',
];

export const RESOURCE_TYPES = [
  { value: 'food', label: 'Food Packets', unit: 'packets' },
  { value: 'water', label: 'Water Bottles', unit: 'liters' },
  { value: 'medicine', label: 'Medicine Kits', unit: 'kits' },
  { value: 'blankets', label: 'Blankets', unit: 'pieces' },
  { value: 'tents', label: 'Tents', unit: 'units' },
  { value: 'clothing', label: 'Clothing', unit: 'sets' },
  { value: 'hygiene', label: 'Hygiene Kits', unit: 'kits' },
  { value: 'tools', label: 'Tools & Equipment', unit: 'sets' },
];

export const USER_ROLES = {
  ADMIN: 'admin',
  VOLUNTEER: 'volunteer',
  CITIZEN: 'citizen',
};
