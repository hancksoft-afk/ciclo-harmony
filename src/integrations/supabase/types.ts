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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
          name: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          order_index: number | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_published?: boolean
          order_index?: number | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          order_index?: number | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      payment_preferences: {
        Row: {
          country: string
          created_at: string
          id: string
          is_active: boolean
          is_preferred: boolean
          payment_method: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_preferred?: boolean
          payment_method: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_preferred?: boolean
          payment_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_settings: {
        Row: {
          code_id: string
          created_at: string
          id: string
          is_active: boolean
          price_cop: number | null
          price_usd: number | null
          qr_image_url: string | null
          qr_image_url2: string | null
          remaining_time: number
          type: string
          updated_at: string
        }
        Insert: {
          code_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          price_cop?: number | null
          price_usd?: number | null
          qr_image_url?: string | null
          qr_image_url2?: string | null
          remaining_time: number
          type: string
          updated_at?: string
        }
        Update: {
          code_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          price_cop?: number | null
          price_usd?: number | null
          qr_image_url?: string | null
          qr_image_url2?: string | null
          remaining_time?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      register: {
        Row: {
          binance_id: string | null
          binance_id_step2: string | null
          binance_id_step3: string | null
          codigo_full: string | null
          codigo_masked: string | null
          country: string
          created_at: string
          has_money: boolean
          id: string
          invitee: string
          name: string
          nequi_phone: string | null
          order_id_1: string | null
          order_id_2: string | null
          payment_method: string
          phone: string
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          binance_id?: string | null
          binance_id_step2?: string | null
          binance_id_step3?: string | null
          codigo_full?: string | null
          codigo_masked?: string | null
          country: string
          created_at?: string
          has_money: boolean
          id?: string
          invitee: string
          name: string
          nequi_phone?: string | null
          order_id_1?: string | null
          order_id_2?: string | null
          payment_method: string
          phone: string
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          binance_id?: string | null
          binance_id_step2?: string | null
          binance_id_step3?: string | null
          codigo_full?: string | null
          codigo_masked?: string | null
          country?: string
          created_at?: string
          has_money?: boolean
          id?: string
          invitee?: string
          name?: string
          nequi_phone?: string | null
          order_id_1?: string | null
          order_id_2?: string | null
          payment_method?: string
          phone?: string
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      register150: {
        Row: {
          binance_id: string | null
          binance_id_step2: string | null
          binance_id_step3: string | null
          codigo_full: string | null
          codigo_masked: string | null
          country: string
          created_at: string
          has_money: boolean
          id: string
          invitee: string
          name: string
          nequi_phone: string | null
          order_id_1: string | null
          order_id_2: string | null
          payment_method: string
          phone: string
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          binance_id?: string | null
          binance_id_step2?: string | null
          binance_id_step3?: string | null
          codigo_full?: string | null
          codigo_masked?: string | null
          country: string
          created_at?: string
          has_money: boolean
          id?: string
          invitee: string
          name: string
          nequi_phone?: string | null
          order_id_1?: string | null
          order_id_2?: string | null
          payment_method: string
          phone: string
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          binance_id?: string | null
          binance_id_step2?: string | null
          binance_id_step3?: string | null
          codigo_full?: string | null
          codigo_masked?: string | null
          country?: string
          created_at?: string
          has_money?: boolean
          id?: string
          invitee?: string
          name?: string
          nequi_phone?: string | null
          order_id_1?: string | null
          order_id_2?: string | null
          payment_method?: string
          phone?: string
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_actions_history: {
        Row: {
          action_type: string
          admin_action_by: string | null
          created_at: string
          id: string
          updated_at: string
          user_country: string
          user_id: string
          user_name: string
          user_phone: string
        }
        Insert: {
          action_type: string
          admin_action_by?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_country: string
          user_id: string
          user_name: string
          user_phone: string
        }
        Update: {
          action_type?: string
          admin_action_by?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_country?: string
          user_id?: string
          user_name?: string
          user_phone?: string
        }
        Relationships: []
      }
      user_actions_history2: {
        Row: {
          action_type: string
          admin_action_by: string | null
          created_at: string
          id: string
          updated_at: string
          user_country: string
          user_id: string
          user_name: string
          user_phone: string
        }
        Insert: {
          action_type: string
          admin_action_by?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_country: string
          user_id: string
          user_name: string
          user_phone: string
        }
        Update: {
          action_type?: string
          admin_action_by?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_country?: string
          user_id?: string
          user_name?: string
          user_phone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_qr_setting: {
        Args: { qr_type: string }
        Returns: {
          code_id: string
          qr_image_url: string
          remaining_time: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
