
interface BicycleParkingInterface {
  amenity?: "bicycle_parking";
  capacity?: string;
  covered?: "yes" | "no";
  lit?: "yes" | "no";
  bicycle_parking?:
    | "stands"
    | "wall_loops"
    | "rack"
    | "safe_loops"
    | "shed"
    | "bollard"
    | "lockers"
    | "building";
}

export interface RawOverpassNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags?: BicycleParkingInterface;
}
export interface RawOverpassWay {
  type: "way";
  id: number;
  nodes: number[],
  tags?: BicycleParkingInterface;
}

export type OverpassResponse  = (RawOverpassNode | RawOverpassWay)[];