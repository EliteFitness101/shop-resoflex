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
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          parts: Json
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          parts: Json
          role: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          path: string | null
          rsid: string | null
          sku: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          path?: string | null
          rsid?: string | null
          sku?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          path?: string | null
          rsid?: string | null
          sku?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      asset_download_logs: {
        Row: {
          asset_id: string | null
          created_at: string
          id: string
          ip_hash: string | null
          order_reference: string | null
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          order_reference?: string | null
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          order_reference?: string | null
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_download_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "digital_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_sync_audit: {
        Row: {
          action: string
          created_at: string
          entity: string
          error_message: string | null
          id: string
          performed_by: string | null
          rows_failed: number
          rows_processed: number
          rows_succeeded: number
          source: string
          status: string
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          error_message?: string | null
          id?: string
          performed_by?: string | null
          rows_failed?: number
          rows_processed?: number
          rows_succeeded?: number
          source: string
          status?: string
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          error_message?: string | null
          id?: string
          performed_by?: string | null
          rows_failed?: number
          rows_processed?: number
          rows_succeeded?: number
          source?: string
          status?: string
        }
        Relationships: []
      }
      ceo_tasks: {
        Row: {
          category: string | null
          created_at: string
          deep_work: boolean | null
          id: string
          is_done: boolean | null
          notes: string | null
          priority: number | null
          task_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deep_work?: boolean | null
          id?: string
          is_done?: boolean | null
          notes?: string | null
          priority?: number | null
          task_date?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deep_work?: boolean | null
          id?: string
          is_done?: boolean | null
          notes?: string | null
          priority?: number | null
          task_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          active: boolean
          banner_url: string | null
          chatb2k_priority: number
          collection_code: string
          created_at: string
          description: string | null
          featured_products: Json
          id: string
          landing_page_slug: string | null
          meta_description: string | null
          name: string
          open_graph_image: string | null
          parent_collection: string | null
          seo_title: string | null
          shopify_collection_id: string | null
          sort_order: number
          thumbnail_image: string | null
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          banner_url?: string | null
          chatb2k_priority?: number
          collection_code: string
          created_at?: string
          description?: string | null
          featured_products?: Json
          id?: string
          landing_page_slug?: string | null
          meta_description?: string | null
          name: string
          open_graph_image?: string | null
          parent_collection?: string | null
          seo_title?: string | null
          shopify_collection_id?: string | null
          sort_order?: number
          thumbnail_image?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          banner_url?: string | null
          chatb2k_priority?: number
          collection_code?: string
          created_at?: string
          description?: string | null
          featured_products?: Json
          id?: string
          landing_page_slug?: string | null
          meta_description?: string | null
          name?: string
          open_graph_image?: string | null
          parent_collection?: string | null
          seo_title?: string | null
          shopify_collection_id?: string | null
          sort_order?: number
          thumbnail_image?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          calories: number | null
          carbs_g: number | null
          created_at: string
          fat_g: number | null
          id: string
          log_date: string
          mood: string | null
          notes: string | null
          protein_g: number | null
          sleep_hours: number | null
          updated_at: string
          user_id: string
          water_ml: number | null
          weight_kg: number | null
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          protein_g?: number | null
          sleep_hours?: number | null
          updated_at?: string
          user_id: string
          water_ml?: number | null
          weight_kg?: number | null
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          protein_g?: number | null
          sleep_hours?: number | null
          updated_at?: string
          user_id?: string
          water_ml?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      digital_assets: {
        Row: {
          active: boolean
          bucket: string
          content_type: string | null
          created_at: string
          id: string
          name: string
          product_id: string
          storage_path: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          bucket?: string
          content_type?: string | null
          created_at?: string
          id?: string
          name: string
          product_id: string
          storage_path: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          bucket?: string
          content_type?: string | null
          created_at?: string
          id?: string
          name?: string
          product_id?: string
          storage_path?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
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
      habit_logs: {
        Row: {
          count: number
          created_at: string
          habit_id: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          habit_id: string
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          active: boolean | null
          created_at: string
          icon: string | null
          id: string
          name: string
          streak: number | null
          target_per_day: number | null
          updated_at: string
          user_id: string
          xp: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          streak?: number | null
          target_per_day?: number | null
          updated_at?: string
          user_id: string
          xp?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          streak?: number | null
          target_per_day?: number | null
          updated_at?: string
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      health_profiles: {
        Row: {
          age: number | null
          ai_summary: string | null
          body_fat_pct: number | null
          budget_ngn: number | null
          created_at: string
          daily_schedule: string | null
          equipment: string | null
          food_allergies: string | null
          foods_to_avoid: string | null
          full_name: string | null
          gender: string | null
          goal: string | null
          height_cm: number | null
          id: string
          location: string | null
          medical_conditions: string | null
          occupation: string | null
          preferred_foods: string | null
          religious_restrictions: string | null
          sleep_time: string | null
          stress_level: string | null
          target_date: string | null
          target_weight_kg: number | null
          training_venue: string | null
          updated_at: string
          user_id: string
          wake_time: string | null
          weight_kg: number | null
          workout_experience: string | null
        }
        Insert: {
          age?: number | null
          ai_summary?: string | null
          body_fat_pct?: number | null
          budget_ngn?: number | null
          created_at?: string
          daily_schedule?: string | null
          equipment?: string | null
          food_allergies?: string | null
          foods_to_avoid?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          location?: string | null
          medical_conditions?: string | null
          occupation?: string | null
          preferred_foods?: string | null
          religious_restrictions?: string | null
          sleep_time?: string | null
          stress_level?: string | null
          target_date?: string | null
          target_weight_kg?: number | null
          training_venue?: string | null
          updated_at?: string
          user_id: string
          wake_time?: string | null
          weight_kg?: number | null
          workout_experience?: string | null
        }
        Update: {
          age?: number | null
          ai_summary?: string | null
          body_fat_pct?: number | null
          budget_ngn?: number | null
          created_at?: string
          daily_schedule?: string | null
          equipment?: string | null
          food_allergies?: string | null
          foods_to_avoid?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          location?: string | null
          medical_conditions?: string | null
          occupation?: string | null
          preferred_foods?: string | null
          religious_restrictions?: string | null
          sleep_time?: string | null
          stress_level?: string | null
          target_date?: string | null
          target_weight_kg?: number | null
          training_venue?: string | null
          updated_at?: string
          user_id?: string
          wake_time?: string | null
          weight_kg?: number | null
          workout_experience?: string | null
        }
        Relationships: []
      }
      inventory_ledger: {
        Row: {
          created_at: string
          delta: number
          id: string
          product_id: string | null
          reason: string
          reference: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          product_id?: string | null
          reason?: string
          reference?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          product_id?: string | null
          reason?: string
          reference?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ledger_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
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
      meal_plans: {
        Row: {
          created_at: string
          estimated_cost_ngn: number | null
          id: string
          plan: Json
          plan_date: string
          total_calories: number | null
          total_protein_g: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost_ngn?: number | null
          id?: string
          plan: Json
          plan_date?: string
          total_calories?: number | null
          total_protein_g?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost_ngn?: number | null
          id?: string
          plan?: Json
          plan_date?: string
          total_calories?: number | null
          total_protein_g?: number | null
          user_id?: string
        }
        Relationships: []
      }
      migration_runs: {
        Row: {
          error_message: string | null
          executed_at: string
          id: string
          migration_name: string
          status: string
        }
        Insert: {
          error_message?: string | null
          executed_at?: string
          id?: string
          migration_name: string
          status?: string
        }
        Update: {
          error_message?: string | null
          executed_at?: string
          id?: string
          migration_name?: string
          status?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          total_ngn: number
          unit_price_ngn: number
          variant: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total_ngn?: number
          unit_price_ngn?: number
          variant?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total_ngn?: number
          unit_price_ngn?: number
          variant?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
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
      payments: {
        Row: {
          amount_ngn: number
          created_at: string
          currency: string
          id: string
          order_id: string | null
          provider: string
          raw: Json | null
          reference: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_ngn?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string | null
          provider?: string
          raw?: Json | null
          reference: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_ngn?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string | null
          provider?: string
          raw?: Json | null
          reference?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
      product_assets: {
        Row: {
          alt_text: string | null
          asset_type: string
          cdn_url: string | null
          created_at: string
          file_name: string
          file_size_kb: number | null
          format: string | null
          height: number | null
          id: string
          is_hero: boolean
          open_graph_asset: boolean
          relative_path: string | null
          seo_title: string | null
          sku: string
          updated_at: string
          variant_sku: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          asset_type?: string
          cdn_url?: string | null
          created_at?: string
          file_name: string
          file_size_kb?: number | null
          format?: string | null
          height?: number | null
          id?: string
          is_hero?: boolean
          open_graph_asset?: boolean
          relative_path?: string | null
          seo_title?: string | null
          sku: string
          updated_at?: string
          variant_sku?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          asset_type?: string
          cdn_url?: string | null
          created_at?: string
          file_name?: string
          file_size_kb?: number | null
          format?: string | null
          height?: number | null
          id?: string
          is_hero?: boolean
          open_graph_asset?: boolean
          relative_path?: string | null
          seo_title?: string | null
          sku?: string
          updated_at?: string
          variant_sku?: string | null
          width?: number | null
        }
        Relationships: []
      }
      product_collection_mappings: {
        Row: {
          collection_code: string | null
          collection_id: string
          created_at: string
          id: string
          position: number
          product_id: string
          product_sku: string | null
        }
        Insert: {
          collection_code?: string | null
          collection_id: string
          created_at?: string
          id?: string
          position?: number
          product_id: string
          product_sku?: string | null
        }
        Update: {
          collection_code?: string | null
          collection_id?: string
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          product_sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_collection_mappings_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collection_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          color: string | null
          compare_price_ngn: number | null
          created_at: string
          id: string
          price_ngn: number
          product_id: string
          size: string | null
          sku: string
          status: string
          stock_qty: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string | null
          compare_price_ngn?: number | null
          created_at?: string
          id?: string
          price_ngn?: number
          product_id: string
          size?: string | null
          sku: string
          status?: string
          stock_qty?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string | null
          compare_price_ngn?: number | null
          created_at?: string
          id?: string
          price_ngn?: number
          product_id?: string
          size?: string | null
          sku?: string
          status?: string
          stock_qty?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_view_events: {
        Row: {
          created_at: string
          id: string
          product_slug: string
          referrer: string | null
          rsid: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_slug: string
          referrer?: string | null
          rsid?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_slug?: string
          referrer?: string | null
          rsid?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          badge: string | null
          bulk_price_ngn: number | null
          bulk_threshold: number
          category: string | null
          chatb2k_enabled: boolean
          commission_pct: number
          compare_price_ngn: number | null
          created_at: string
          description: string | null
          digital_product: boolean
          hero_image_asset: string | null
          hero_url: string | null
          id: string
          image_url: string | null
          name: string
          price_ngn: number
          recommendation_priority: number
          requires_shipping: boolean
          sku: string | null
          slug: string
          status: string
          sub_assets: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge?: string | null
          bulk_price_ngn?: number | null
          bulk_threshold?: number
          category?: string | null
          chatb2k_enabled?: boolean
          commission_pct?: number
          compare_price_ngn?: number | null
          created_at?: string
          description?: string | null
          digital_product?: boolean
          hero_image_asset?: string | null
          hero_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_ngn?: number
          recommendation_priority?: number
          requires_shipping?: boolean
          sku?: string | null
          slug: string
          status?: string
          sub_assets?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge?: string | null
          bulk_price_ngn?: number | null
          bulk_threshold?: number
          category?: string | null
          chatb2k_enabled?: boolean
          commission_pct?: number
          compare_price_ngn?: number | null
          created_at?: string
          description?: string | null
          digital_product?: boolean
          hero_image_asset?: string | null
          hero_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_ngn?: number
          recommendation_priority?: number
          requires_shipping?: boolean
          sku?: string | null
          slug?: string
          status?: string
          sub_assets?: Json
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
      recommendations: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          score: number
          sku: string
          surface: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          score?: number
          sku: string
          surface?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          score?: number
          sku?: string
          surface?: string | null
          user_id?: string
        }
        Relationships: []
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
      workout_plans: {
        Row: {
          created_at: string
          duration_min: number | null
          estimated_calories: number | null
          id: string
          plan: Json
          plan_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_min?: number | null
          estimated_calories?: number | null
          id?: string
          plan: Json
          plan_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_min?: number | null
          estimated_calories?: number | null
          id?: string
          plan?: Json
          plan_date?: string
          user_id?: string
        }
        Relationships: []
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
      can_manage_catalog: { Args: { _user_id: string }; Returns: boolean }
      can_manage_content: { Args: { _user_id: string }; Returns: boolean }
      can_manage_ops: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role_text: {
        Args: { _role: string; _user_id: string }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "operator"
        | "recruit"
        | "manager"
        | "editor"
        | "customer"
        | "super_admin"
        | "catalog_admin"
        | "operations_admin"
        | "finance_admin"
        | "support_admin"
        | "content_admin"
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
      app_role: [
        "admin",
        "operator",
        "recruit",
        "manager",
        "editor",
        "customer",
        "super_admin",
        "catalog_admin",
        "operations_admin",
        "finance_admin",
        "support_admin",
        "content_admin",
      ],
      order_status: ["pending", "paid", "failed", "refunded"],
      plan_type: ["meal", "workout"],
      wallet_tx_kind: ["commission", "withdrawal", "adjustment", "bonus"],
    },
  },
} as const
