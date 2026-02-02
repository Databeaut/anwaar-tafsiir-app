export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      access_keys: {
        Row: {
          access_code: string
          created_at: string
          id: string
          is_active: boolean
          phone: string | null
          role: string | null
          student_name: string
        }
        Insert: {
          access_code: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          student_name: string
        }
        Update: {
          access_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          student_name?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          id: string
          password: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          id: string
          student_access_key_id: string
          lesson_id: number
          last_position: number
          is_completed: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          student_access_key_id: string
          lesson_id: number
          last_position?: number
          is_completed?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          student_access_key_id?: string
          lesson_id?: number
          last_position?: number
          is_completed?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_student_access_key_id_fkey"
            columns: ["student_access_key_id"]
            isOneToOne: false
            referencedRelation: "access_keys"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
