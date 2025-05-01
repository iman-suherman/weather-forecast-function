export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  state?: string;
  population?: number;
}

export const cities: City[] = [
  // Australian Cities
  { name: "Mascot", latitude: -33.9258, longitude: 151.1933, country: "Australia", state: "New South Wales", population: 15000 },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "Australia", state: "New South Wales", population: 5312000 },
  { name: "Melbourne", latitude: -37.8136, longitude: 144.9631, country: "Australia", state: "Victoria", population: 5078000 },
  { name: "Brisbane", latitude: -27.4698, longitude: 153.0251, country: "Australia", state: "Queensland", population: 2487000 },
  { name: "Perth", latitude: -31.9523, longitude: 115.8613, country: "Australia", state: "Western Australia", population: 2081000 },
  { name: "Adelaide", latitude: -34.9285, longitude: 138.6007, country: "Australia", state: "South Australia", population: 1386000 },
  { name: "Gold Coast", latitude: -28.0167, longitude: 153.4000, country: "Australia", state: "Queensland", population: 709000 },
  { name: "Newcastle", latitude: -32.9167, longitude: 151.7500, country: "Australia", state: "New South Wales", population: 322000 },
  { name: "Canberra", latitude: -35.2809, longitude: 149.1300, country: "Australia", state: "Australian Capital Territory", population: 431000 },
  { name: "Hobart", latitude: -42.8806, longitude: 147.3250, country: "Australia", state: "Tasmania", population: 248000 },

  // Major World Cities
  { name: "New York", latitude: 40.7128, longitude: -74.0060, country: "United States", state: "New York", population: 8800000 },
  { name: "London", latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", population: 8982000 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, country: "Japan", population: 37400000 },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, country: "France", population: 2148000 },
  { name: "Singapore", latitude: 1.3521, longitude: 103.8198, country: "Singapore", population: 5686000 },
  { name: "Hong Kong", latitude: 22.3193, longitude: 114.1694, country: "China", population: 7451000 },
  { name: "Dubai", latitude: 25.2048, longitude: 55.2708, country: "United Arab Emirates", population: 3331000 },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, country: "United States", state: "California", population: 3976000 },
  { name: "Chicago", latitude: 41.8781, longitude: -87.6298, country: "United States", state: "Illinois", population: 2716000 },
  { name: "Toronto", latitude: 43.6532, longitude: -79.3832, country: "Canada", state: "Ontario", population: 2930000 },

  // Asian Cities
  { name: "Seoul", latitude: 37.5665, longitude: 126.9780, country: "South Korea", population: 9735000 },
  { name: "Mumbai", latitude: 19.0760, longitude: 72.8777, country: "India", state: "Maharashtra", population: 12478000 },
  { name: "Shanghai", latitude: 31.2304, longitude: 121.4737, country: "China", population: 24183000 },
  { name: "Bangkok", latitude: 13.7563, longitude: 100.5018, country: "Thailand", population: 8281000 },
  { name: "Jakarta", latitude: -6.2088, longitude: 106.8456, country: "Indonesia", population: 10560000 },

  // European Cities
  { name: "Berlin", latitude: 52.5200, longitude: 13.4050, country: "Germany", population: 3769000 },
  { name: "Rome", latitude: 41.9028, longitude: 12.4964, country: "Italy", population: 2873000 },
  { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "Spain", population: 3223000 },
  { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, country: "Netherlands", population: 821000 },
  { name: "Vienna", latitude: 48.2082, longitude: 16.3738, country: "Austria", population: 1897000 },

  // North American Cities
  { name: "Vancouver", latitude: 49.2827, longitude: -123.1207, country: "Canada", state: "British Columbia", population: 675000 },
  { name: "San Francisco", latitude: 37.7749, longitude: -122.4194, country: "United States", state: "California", population: 883000 },
  { name: "Mexico City", latitude: 19.4326, longitude: -99.1332, country: "Mexico", population: 9200000 },
  { name: "Montreal", latitude: 45.5017, longitude: -73.5673, country: "Canada", state: "Quebec", population: 1780000 },
  { name: "Boston", latitude: 42.3601, longitude: -71.0589, country: "United States", state: "Massachusetts", population: 675000 },

  // South American Cities
  { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729, country: "Brazil", state: "Rio de Janeiro", population: 6748000 },
  { name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, country: "Argentina", population: 3075000 },
  { name: "Santiago", latitude: -33.4489, longitude: -70.6693, country: "Chile", population: 6680000 },
  { name: "Lima", latitude: -12.0464, longitude: -77.0428, country: "Peru", population: 9562000 },
  { name: "Bogota", latitude: 4.7110, longitude: -74.0721, country: "Colombia", population: 7181000 },

  // African Cities
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, country: "Egypt", population: 9500000 },
  { name: "Cape Town", latitude: -33.9249, longitude: 18.4241, country: "South Africa", population: 4337000 },
  { name: "Lagos", latitude: 6.5244, longitude: 3.3792, country: "Nigeria", population: 14800000 },
  { name: "Nairobi", latitude: -1.2921, longitude: 36.8219, country: "Kenya", population: 4397000 },
  { name: "Casablanca", latitude: 33.5731, longitude: -7.5898, country: "Morocco", population: 3359000 },

  // Oceania Cities
  { name: "Auckland", latitude: -36.8509, longitude: 174.7645, country: "New Zealand", population: 1650000 },
  { name: "Wellington", latitude: -41.2866, longitude: 174.7756, country: "New Zealand", population: 212000 },
  { name: "Suva", latitude: -18.1416, longitude: 178.4419, country: "Fiji", population: 94000 },
  { name: "Port Moresby", latitude: -9.4780, longitude: 147.1500, country: "Papua New Guinea", population: 410000 },
  { name: "Apia", latitude: -13.8333, longitude: -171.7500, country: "Samoa", population: 36700 },

  // Philippine Cities
  { name: "Manila", latitude: 14.5995, longitude: 120.9842, country: "Philippines", state: "Metro Manila", population: 1780000 },
  { name: "Quezon City", latitude: 14.6760, longitude: 121.0437, country: "Philippines", state: "Metro Manila", population: 2936000 },
  { name: "Cebu City", latitude: 10.3157, longitude: 123.8854, country: "Philippines", state: "Cebu", population: 922000 },
  { name: "Davao City", latitude: 7.1907, longitude: 125.4553, country: "Philippines", state: "Davao", population: 1773000 },
  { name: "Makati", latitude: 14.5547, longitude: 121.0244, country: "Philippines", state: "Metro Manila", population: 629000 },
  { name: "Taguig", latitude: 14.5176, longitude: 121.0509, country: "Philippines", state: "Metro Manila", population: 886000 },
  { name: "Pasig", latitude: 14.5764, longitude: 121.0851, country: "Philippines", state: "Metro Manila", population: 803000 },
  { name: "Pasay", latitude: 14.5378, longitude: 120.9814, country: "Philippines", state: "Metro Manila", population: 440000 },
  { name: "Mandaluyong", latitude: 14.5794, longitude: 121.0359, country: "Philippines", state: "Metro Manila", population: 386000 },
  { name: "Baguio", latitude: 16.4023, longitude: 120.5960, country: "Philippines", state: "Cordillera", population: 366000 },

  // Indonesian Cities
  { name: "Jakarta", latitude: -6.2088, longitude: 106.8456, country: "Indonesia", state: "Jakarta", population: 10560000 },
  { name: "Surabaya", latitude: -7.2575, longitude: 112.7521, country: "Indonesia", state: "East Java", population: 2961000 },
  { name: "Bandung", latitude: -6.9175, longitude: 107.6191, country: "Indonesia", state: "West Java", population: 2487000 },
  { name: "Medan", latitude: 3.5952, longitude: 98.6722, country: "Indonesia", state: "North Sumatra", population: 2395000 },
  { name: "Semarang", latitude: -6.9932, longitude: 110.4229, country: "Indonesia", state: "Central Java", population: 1621000 },
  { name: "Palembang", latitude: -2.9909, longitude: 104.7565, country: "Indonesia", state: "South Sumatra", population: 1612000 },
  { name: "Makassar", latitude: -5.1477, longitude: 119.4327, country: "Indonesia", state: "South Sulawesi", population: 1338000 },
  { name: "Tangerang", latitude: -6.1783, longitude: 106.6319, country: "Indonesia", state: "Banten", population: 1798000 },
  { name: "Depok", latitude: -6.4025, longitude: 106.7942, country: "Indonesia", state: "West Java", population: 1738000 },
  { name: "Bekasi", latitude: -6.2349, longitude: 106.9896, country: "Indonesia", state: "West Java", population: 2381000 }
]; 