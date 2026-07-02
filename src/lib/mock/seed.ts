// Deterministic pseudo-random helper so the demo has stable data.
let _seed = 42;
function rand() {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}
function int(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export type Role = "customer" | "driver" | "admin";

export type ShipmentStatus =
  | "booked"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "near_destination"
  | "delivered"
  | "cancelled";

export type VehicleType =
  | "Motorcycle"
  | "Car"
  | "Mini Van"
  | "Van"
  | "Truck"
  | "Heavy Truck";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  joined: string;
  orders: number;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  city: string;
  experience: number;
  rating: number;
  status: "available" | "on_trip" | "off_duty";
  vehicleId?: string;
  avatar: string;
  deliveries: number;
  earnings: number;
}

export interface Vehicle {
  id: string;
  number: string;
  type: VehicleType;
  capacityKg: number;
  fuel: "Petrol" | "Diesel" | "Electric" | "CNG";
  mileage: number;
  driverId?: string;
  status: "available" | "on_trip" | "maintenance" | "inactive";
  insuranceExpiry: string;
  maintenanceDate: string;
  image: string;
}

export interface Shipment {
  id: string;
  customerId: string;
  driverId?: string;
  vehicleId?: string;
  vehicleType: VehicleType;
  pickup: { address: string; city: string; lat: number; lng: number; date: string; time: string; contact: string; phone: string };
  delivery: { address: string; city: string; lat: number; lng: number; date: string; receiver: string; phone: string };
  package: { name: string; type: string; weight: number; dimensions: string; quantity: number; fragile: boolean; insurance: boolean };
  priority: "standard" | "express" | "same_day";
  status: ShipmentStatus;
  distanceKm: number;
  etaMin: number;
  cost: number;
  paymentStatus: "paid" | "pending" | "cod";
  paymentMethod: "Credit Card" | "Debit Card" | "UPI" | "Net Banking" | "Cash on Delivery";
  createdAt: string;
  timeline: { status: ShipmentStatus; at: string }[];
}

export interface Notification {
  id: string;
  role: Role | "all";
  userId?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  at: string;
  read: boolean;
}

const cities = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
];

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Sai", "Krishna", "Ishaan", "Rohan", "Priya", "Ananya", "Diya", "Aadhya", "Kiara", "Myra", "Sara", "Anika", "Navya", "Riya"];
const lastNames = ["Sharma", "Verma", "Patel", "Gupta", "Iyer", "Nair", "Reddy", "Khan", "Menon", "Shah", "Rao", "Singh", "Kumar", "Das", "Bose"];

function name() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}
function phone() {
  return `+91 ${int(70, 99)}${int(10000000, 99999999)}`;
}
function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}
function iso(daysAgo: number, hoursAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export function buildSeed() {
  _seed = 42;

  const customers: Customer[] = Array.from({ length: 50 }, (_, i) => {
    const n = name();
    return {
      id: `CUS-${1000 + i}`,
      name: n,
      email: `${n.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
      phone: phone(),
      city: pick(cities).name,
      avatar: avatar(n),
      joined: iso(int(30, 365)),
      orders: int(1, 40),
    };
  });

  const vehicleTypes: VehicleType[] = ["Motorcycle", "Car", "Mini Van", "Van", "Truck", "Heavy Truck"];
  const capacities: Record<VehicleType, number> = {
    Motorcycle: 20,
    Car: 200,
    "Mini Van": 500,
    Van: 1200,
    Truck: 5000,
    "Heavy Truck": 15000,
  };
  const vehicleImages: Record<VehicleType, string> = {
    Motorcycle: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
    Car: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
    "Mini Van": "https://images.unsplash.com/photo-1609520505218-7421df17b8a2?w=400",
    Van: "https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400",
    Truck: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400",
    "Heavy Truck": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400",
  };

  const vehicles: Vehicle[] = Array.from({ length: 30 }, (_, i) => {
    const type = vehicleTypes[i % vehicleTypes.length]!;
    return {
      id: `VEH-${2000 + i}`,
      number: `MH${int(10, 99)} ${String.fromCharCode(65 + int(0, 25))}${String.fromCharCode(65 + int(0, 25))} ${int(1000, 9999)}`,
      type,
      capacityKg: capacities[type],
      fuel: pick(["Petrol", "Diesel", "Electric", "CNG"] as const),
      mileage: int(8, 25),
      status: pick(["available", "available", "on_trip", "maintenance", "inactive"] as const),
      insuranceExpiry: iso(-int(30, 365)),
      maintenanceDate: iso(int(1, 90)),
      image: vehicleImages[type],
    };
  });

  const drivers: Driver[] = Array.from({ length: 20 }, (_, i) => {
    const n = name();
    return {
      id: `DRV-${3000 + i}`,
      name: n,
      email: `${n.toLowerCase().replace(/\s+/g, ".")}@fleet.com`,
      phone: phone(),
      license: `DL-${int(10, 99)}-${int(1000, 9999)}-${int(1000, 9999)}`,
      city: pick(cities).name,
      experience: int(1, 15),
      rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
      status: pick(["available", "available", "on_trip", "off_duty"] as const),
      vehicleId: vehicles[i]?.id,
      avatar: avatar(n),
      deliveries: int(20, 400),
      earnings: int(50000, 500000),
    };
  });

  // Attach drivers to vehicles.
  drivers.forEach((d) => {
    const v = vehicles.find((v) => v.id === d.vehicleId);
    if (v) v.driverId = d.id;
  });

  const priorities: Shipment["priority"][] = ["standard", "express", "same_day"];
  const statuses: ShipmentStatus[] = ["booked", "assigned", "picked_up", "in_transit", "near_destination", "delivered", "delivered", "delivered", "cancelled"];
  const packageTypes = ["Documents", "Electronics", "Apparel", "Perishable", "Furniture", "Machinery", "Groceries", "Books"];

  const shipments: Shipment[] = Array.from({ length: 200 }, (_, i) => {
    const cust = customers[int(0, customers.length - 1)]!;
    const from = pick(cities);
    let to = pick(cities);
    while (to.name === from.name) to = pick(cities);
    const distance = int(50, 1800);
    const vtype = pick(vehicleTypes);
    const status = pick(statuses);
    const cost = distance * (vtype === "Motorcycle" ? 6 : vtype === "Car" ? 10 : vtype === "Mini Van" ? 15 : vtype === "Van" ? 22 : vtype === "Truck" ? 35 : 55);
    const createdDaysAgo = int(0, 90);
    const driver = pick(drivers);
    const timeline: Shipment["timeline"] = [];
    const flow: ShipmentStatus[] = ["booked", "assigned", "picked_up", "in_transit", "near_destination", "delivered"];
    const idx = flow.indexOf(status);
    for (let j = 0; j <= (idx === -1 ? 0 : idx); j++) {
      timeline.push({ status: flow[j]!, at: iso(createdDaysAgo, (flow.length - j) * 3) });
    }
    return {
      id: `SHP-${10000 + i}`,
      customerId: cust.id,
      driverId: status === "booked" ? undefined : driver.id,
      vehicleId: status === "booked" ? undefined : driver.vehicleId,
      vehicleType: vtype,
      pickup: {
        address: `${int(1, 200)}, ${pick(["MG Road", "Park Street", "Ring Road", "Church St", "Anna Salai"])}`,
        city: from.name,
        lat: from.lat,
        lng: from.lng,
        date: iso(createdDaysAgo - 1).slice(0, 10),
        time: `${int(8, 18)}:00`,
        contact: cust.name,
        phone: cust.phone,
      },
      delivery: {
        address: `${int(1, 200)}, ${pick(["MG Road", "Park Street", "Ring Road", "Church St", "Anna Salai"])}`,
        city: to.name,
        lat: to.lat,
        lng: to.lng,
        date: iso(createdDaysAgo - 3).slice(0, 10),
        receiver: name(),
        phone: phone(),
      },
      package: {
        name: pick(packageTypes) + " Parcel",
        type: pick(packageTypes),
        weight: int(1, 500),
        dimensions: `${int(10, 80)}×${int(10, 80)}×${int(10, 80)} cm`,
        quantity: int(1, 10),
        fragile: rand() > 0.7,
        insurance: rand() > 0.5,
      },
      priority: pick(priorities),
      status,
      distanceKm: distance,
      etaMin: distance * 2,
      cost,
      paymentStatus: status === "cancelled" ? "pending" : pick(["paid", "paid", "paid", "pending", "cod"] as const),
      paymentMethod: pick(["Credit Card", "UPI", "Debit Card", "Net Banking", "Cash on Delivery"] as const),
      createdAt: iso(createdDaysAgo),
      timeline,
    };
  });

  const notifications: Notification[] = Array.from({ length: 25 }, (_, i) => {
    const ship = shipments[int(0, shipments.length - 1)]!;
    const templates = [
      { title: "Driver assigned", message: `Driver assigned to shipment ${ship.id}`, type: "info" as const },
      { title: "Shipment picked up", message: `${ship.id} has been picked up`, type: "success" as const },
      { title: "Shipment delivered", message: `${ship.id} has been delivered`, type: "success" as const },
      { title: "Payment successful", message: `Payment of ₹${ship.cost.toLocaleString()} received`, type: "success" as const },
      { title: "Vehicle maintenance due", message: `Vehicle needs maintenance soon`, type: "warning" as const },
      { title: "New shipment request", message: `New request from ${ship.pickup.city}`, type: "info" as const },
    ];
    const t = pick(templates);
    return {
      id: `NTF-${5000 + i}`,
      role: "all",
      title: t.title,
      message: t.message,
      type: t.type,
      at: iso(int(0, 7), int(0, 23)),
      read: rand() > 0.6,
    };
  });

  return { customers, drivers, vehicles, shipments, notifications };
}