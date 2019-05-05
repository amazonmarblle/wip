import { LineItem } from './line_item';
import { Address } from './address';
import { Payment } from './payment';

export class Order {
  id: number;
  number: string;
  adjustments: [];
  credit_cards: [];
  line_items: [];
  item_total: string;
  total: string;
  ship_total: string;
  state: string;
  adjustment_total: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  payment_total: string;
  shipment_state: string;
  payment_state: string;
  email: string;
  special_instructions: string;
  channel: string;
  included_tax_total: string;
  additional_tax_total: string;
  display_included_tax_total: string;
  display_additional_tax_total: string;
  tax_total: string;
  currency: string;
  considered_risky: boolean;
  canceler_id: string;
  total_quantity: number;
  token: string;
  display_item_total: string;
  display_total: string;
  display_ship_total: string;
  display_tax_total: string;
  display_adjustment_total: string;
  bill_address: [Address];
  ship_address: [Address];
  payments: [];
  checkout_steps: string[];
  permissions: any;
  shipments: []

}

export class LightOrder {
  number: string;
  payment_state: string;
  completed_at: string;
  state: string;
  total: string;
  shipment_state: string;
}
