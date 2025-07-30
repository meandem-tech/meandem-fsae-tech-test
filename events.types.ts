import z from "zod";
import { AddToCartPayloadSchema, AnalyticsEventPayloadSchema, CheckoutSuccessPayloadSchema, PageViewPayloadSchema } from "./mock-server";

type PageViewPayload = z.infer<typeof PageViewPayloadSchema>;
type AddToCartPayload = z.infer<typeof AddToCartPayloadSchema>;
type CheckoutSuccessPayload = z.infer<typeof CheckoutSuccessPayloadSchema>;
type AnalyticsEventPayload = z.infer<typeof AnalyticsEventPayloadSchema>;



export interface Event {
  timestamp: number;
  payload: AnalyticsEventPayload;
}

export interface Events {
  [endpoint: string]: Event[];
}
