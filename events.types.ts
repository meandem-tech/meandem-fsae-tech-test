import z from "zod";

type AnalyticsEventPayload = z.infer<typeof AnalyticsEventPayloadSchema>;

export interface Event {
  timestamp: number;
  payload: AnalyticsEventPayload;
}

export interface Events {
  [endpoint: string]: Event[];
}
