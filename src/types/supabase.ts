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
      gratitude_messages: {
        Row: {
          id: number
          message: string
          author: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: number
          message: string
          author: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: number
          message?: string
          author?: string
          timestamp?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}