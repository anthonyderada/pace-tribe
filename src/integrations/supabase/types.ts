export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accolades: {
        Row: {
          created_at: string
          id: string
          pb_10k: string | null
          pb_5k: string | null
          pb_half_marathon: string | null
          pb_marathon: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          pb_10k?: string | null
          pb_5k?: string | null
          pb_half_marathon?: string | null
          pb_marathon?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          pb_10k?: string | null
          pb_5k?: string | null
          pb_half_marathon?: string | null
          pb_marathon?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accolades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_label_assignments: {
        Row: {
          club_id: string | null
          created_at: string
          id: string
          label_id: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          id?: string
          label_id?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string
          id?: string
          label_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_label_assignments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_label_assignments_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "club_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      club_labels: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      club_members: {
        Row: {
          club_id: string | null
          created_at: string
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_free: boolean | null
          location: string | null
          name: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean | null
          location?: string | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean | null
          location?: string | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          club_id: string | null
          created_at: string
          date: string
          description: string | null
          distance: number | null
          id: string
          is_free: boolean | null
          is_recurring: boolean | null
          location: string | null
          pace: string | null
          recurrence_schedule: string | null
          title: string
          updated_at: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          distance?: number | null
          id?: string
          is_free?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          pace?: string | null
          recurrence_schedule?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          club_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          distance?: number | null
          id?: string
          is_free?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          pace?: string | null
          recurrence_schedule?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          comfortable_pace: string | null
          created_at: string
          id: string
          location: string | null
          preferred_distance: string | null
          preferred_shoe_brand: string[] | null
          seeking_casual_meetups: boolean | null
          seeking_coach: boolean | null
          seeking_race_pacers: boolean | null
          seeking_training_partners: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          comfortable_pace?: string | null
          created_at?: string
          id: string
          location?: string | null
          preferred_distance?: string | null
          preferred_shoe_brand?: string[] | null
          seeking_casual_meetups?: boolean | null
          seeking_coach?: boolean | null
          seeking_race_pacers?: boolean | null
          seeking_training_partners?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          comfortable_pace?: string | null
          created_at?: string
          id?: string
          location?: string | null
          preferred_distance?: string | null
          preferred_shoe_brand?: string[] | null
          seeking_casual_meetups?: boolean | null
          seeking_coach?: boolean | null
          seeking_race_pacers?: boolean | null
          seeking_training_partners?: boolean | null
          updated_at?: string
          username?: string | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
