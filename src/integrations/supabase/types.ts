export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      funnel_events: {
        Row: {
          created_at: string
          event_type: string
          funnel_origin: string | null
          id: string
          metadata: Json | null
          path: string | null
          rsid: string | null
          sku: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          funnel_origin?: string | null
          id?: string
          metadata?: Json | null
          path?: string | null
          rsid?: string | null
          sku?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          funnel_origin?: string | null
          id?: string
          metadata?: Json | null
          path?: string | null
          rsid?: string | null
          sku?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      meal_plan_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          product_id: string
          storage_path: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          product_id: string
          storage_path: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          product_id?: string
          storage_path?: string
          version?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_ngn: number
          created_at: string
          customer_email: string
          download_expires_at: string | null
          download_url: string | null
          id: string
          paystack_data: Json | null
          product_id: string
          product_name: string
          reference: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_ngn: number
          created_at?: string
          customer_email: string
          download_expires_at?: string | null
          download_url?: string | null
          id?: string
          paystack_data?: Json | null
          product_id: string
          product_name: string
          reference: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          customer_email?: string
          download_expires_at?: string | null
          download_url?: string | null
          id?: string
          paystack_data?: Json | null
          product_id?: string
          product_name?: string
          reference?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      personalized_plans: {
        Row: {
          ai_summary: string | null
          created_at: string
          id: string
          order_id: string | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          product_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          product_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          product_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personalized_plans_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          badge: string | null
          category: string | null
          commission_pct: number
          compare_price_ngn: number | null
          created_at: string
          description: string | null
          hero_url: string | null
          id: string
          image_url: string | null
          name: string
          price_ngn: number
          slug: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge?: string | null
          category?: string | null
          commission_pct?: number
          compare_price_ngn?: number | null
          created_at?: string
          description?: string | null
          hero_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_ngn?: number
          slug: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge?: string | null
          category?: string | null
          commission_pct?: number
          compare_price_ngn?: number | null
          created_at?: string
          description?: string | null
          hero_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_ngn?: number
          slug?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          dietary_pref: string | null
          email: string
          fitness_goal: string | null
          full_name: string | null
          height_cm: number | null
          id: string
          referral_code: string
          referred_by: string | null
          updated_at: string
          wallet_balance_ngn: number
          weight_kg: number | null
          whatsapp_e164: string | null
        }
        Insert: {
          created_at?: string
          dietary_pref?: string | null
          email: string
          fitness_goal?: string | null
          full_name?: string | null
          height_cm?: number | null
          id: string
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
          wallet_balance_ngn?: number
          weight_kg?: number | null
          whatsapp_e164?: string | null
        }
        Update: {
          created_at?: string
          dietary_pref?: string | null
          email?: string
          fitness_goal?: string | null
          full_name?: string | null
          height_cm?: number | null
          id?: string
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
          wallet_balance_ngn?: number
          weight_kg?: number | null
          whatsapp_e164?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_events: {
        Row: {
          amount_ngn: number
          created_at: string
          currency: string
          customer_email: string | null
          funnel_origin: string | null
          id: string
          raw: Json | null
          reference: string | null
          rsid: string | null
          sku: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant: string | null
        }
        Insert: {
          amount_ngn?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          funnel_origin?: string | null
          id?: string
          raw?: Json | null
          reference?: string | null
          rsid?: string | null
          sku?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          funnel_origin?: string | null
          id?: string
          raw?: Json | null
          reference?: string | null
          rsid?: string | null
          sku?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_ngn: number
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["wallet_tx_kind"]
          note: string | null
          order_id: string | null
          user_id: string
        }
        Insert: {
          amount_ngn: number
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["wallet_tx_kind"]
          note?: string | null
          order_id?: string | null
          user_id: string
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["wallet_tx_kind"]
          note?: string | null
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          product_id: string
          storage_path: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          product_id: string
          storage_path: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          product_id?: string
          storage_path?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "operator" | "recruit"
      order_status: "pending" | "paid" | "failed" | "refunded"
      plan_type: "meal" | "workout"
      wallet_tx_kind: "commission" | "withdrawal" | "adjustment" | "bonus"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operator", "recruit"],
      order_status: ["pending", "paid", "failed", "refunded"],
      plan_type: ["meal", "workout"],
      wallet_tx_kind: ["commission", "withdrawal", "adjustment", "bonus"],
    },
  },
} as const
