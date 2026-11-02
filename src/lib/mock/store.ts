import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildSeed, type Customer, type Driver, type Notification, type Shipment, type ShipmentStatus, type Vehicle } from "./seed";

const initial = buildSeed();

interface DataState {
  customers: Customer[];
  drivers: Driver[];
  vehicles: Vehicle[];
  shipments: Shipment[];
  notifications: Notification[];
  addShipment: (s: Shipment) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus) => void;
  assign: (shipmentId: string, driverId: string, vehicleId: string) => void;
  cancelShipment: (id: string) => void;
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  addDriver: (d: Driver) => void;
  updateDriver: (id: string, patch: Partial<Driver>) => void;
  removeDriver: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<Notification, "id" | "at" | "read">) => void;
  reset: () => void;
}

export const useData = create<DataState>()(
  persist(
    (set) => ({
      ...initial,
      addShipment: (s) =>
        set((state) => ({ shipments: [s, ...state.shipments] })),
      updateShipmentStatus: (id, status) =>
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status,
                  timeline: [...s.timeline, { status, at: new Date().toISOString() }],
                }
              : s,
          ),
        })),
      assign: (shipmentId, driverId, vehicleId) =>
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === shipmentId
              ? {
                  ...s,
                  driverId,
                  vehicleId,
                  status: "assigned",
                  timeline: [...s.timeline, { status: "assigned", at: new Date().toISOString() }],
                }
              : s,
          ),
        })),
      cancelShipment: (id) =>
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id ? { ...s, status: "cancelled" } : s,
          ),
        })),
      addVehicle: (v) => set((state) => ({ vehicles: [v, ...state.vehicles] })),
      updateVehicle: (id, patch) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      removeVehicle: (id) =>
        set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) })),
      addDriver: (d) => set((state) => ({ drivers: [d, ...state.drivers] })),
      updateDriver: (id, patch) =>
        set((state) => ({
          drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      removeDriver: (id) =>
        set((state) => ({ drivers: state.drivers.filter((d) => d.id !== id) })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      pushNotification: (n) =>
        set((state) => ({
          notifications: [
            { ...n, id: `NTF-${Date.now()}`, at: new Date().toISOString(), read: false },
            ...state.notifications,
          ],
        })),
      reset: () => set(buildSeed()),
    }),
    { name: "swiftship-data", version: 1 },
  ),
);