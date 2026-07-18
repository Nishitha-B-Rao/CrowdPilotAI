export type AILogEntry = {
  timestamp: string;
  input_type: string;
  model: string;
  latency_ms: number;
  confidence: string;
  status: string;
};

export type Recommendation = {
  id: string;
  timestamp: string;
  observation: string;
  reasoning: string[];
  prediction: string;
  recommendation: string;
  expectedImpact: string;
  priority: "low" | "medium" | "high" | "critical";
  confidence: string;
  affectedZones: string[];
};

export type Gate = {
  id: string;
  name: string;
  occupancy_percentage: number;
  queue_time_minutes: number;
};

export type StadiumState = {
  total_occupancy: number;
  active_incidents: number;
  avg_queue_time: number;
  gates: Gate[];
};

export type IncidentItem = {
  time: string;
  incident: string;
  gate: string;
  priority: string;
  reasoning: string;
  response: string;
  announcement: string;
};
