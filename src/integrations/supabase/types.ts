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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_type: string
          certificate_url: string | null
          exam_id: string | null
          id: string
          issued_at: string | null
          metadata: Json | null
          student_id: string
        }
        Insert: {
          certificate_type: string
          certificate_url?: string | null
          exam_id?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          student_id: string
        }
        Update: {
          certificate_type?: string
          certificate_url?: string | null
          exam_id?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string | null
          id: string
          location: string
          name: string
          state: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          name: string
          state: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          donation_date: string | null
          donation_type: string
          donor_id: string | null
          id: string
          is_recurring: boolean | null
          notes: string | null
          payment_method: string
          receipt_sent: boolean | null
          receipt_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          donation_date?: string | null
          donation_type: string
          donor_id?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_method: string
          receipt_sent?: boolean | null
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          donation_date?: string | null
          donation_type?: string
          donor_id?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_method?: string
          receipt_sent?: boolean | null
          receipt_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_assignments: {
        Row: {
          assigned_date: string | null
          chapter_id: string | null
          created_at: string | null
          event_id: string
          id: string
          school_id: string | null
        }
        Insert: {
          assigned_date?: string | null
          chapter_id?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          school_id?: string | null
        }
        Update: {
          assigned_date?: string | null
          chapter_id?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_assignments_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      event_submissions: {
        Row: {
          admin_comments: string | null
          created_at: string | null
          document_url: string | null
          event_id: string
          id: string
          reviewed_at: string | null
          school_id: string
          score: number | null
          short_description: string | null
          status: string | null
          submitted_at: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          admin_comments?: string | null
          created_at?: string | null
          document_url?: string | null
          event_id: string
          id?: string
          reviewed_at?: string | null
          school_id: string
          score?: number | null
          short_description?: string | null
          status?: string | null
          submitted_at?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_comments?: string | null
          created_at?: string | null
          document_url?: string | null
          event_id?: string
          id?: string
          reviewed_at?: string | null
          school_id?: string
          score?: number | null
          short_description?: string | null
          status?: string | null
          submitted_at?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_submissions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_submissions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_submissions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          location: string | null
          program_type_id: string | null
          start_date: string
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          program_type_id?: string | null
          start_date: string
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          program_type_id?: string | null
          start_date?: string
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_program_type_id_fkey"
            columns: ["program_type_id"]
            isOneToOne: false
            referencedRelation: "program_types"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_attempts: {
        Row: {
          exam_id: string
          id: string
          marks_obtained: number | null
          percentage: number | null
          started_at: string | null
          status: string | null
          student_id: string
          submitted_at: string | null
          total_marks: number | null
        }
        Insert: {
          exam_id: string
          id?: string
          marks_obtained?: number | null
          percentage?: number | null
          started_at?: string | null
          status?: string | null
          student_id: string
          submitted_at?: string | null
          total_marks?: number | null
        }
        Update: {
          exam_id?: string
          id?: string
          marks_obtained?: number | null
          percentage?: number | null
          started_at?: string | null
          status?: string | null
          student_id?: string
          submitted_at?: string | null
          total_marks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          exam_id: string
          id: string
          marks: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_number: number
          question_text: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          exam_id: string
          id?: string
          marks?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_number: number
          question_text: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          exam_id?: string
          id?: string
          marks?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          order_number?: number
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_registrations: {
        Row: {
          exam_id: string
          id: string
          payment_amount: number | null
          payment_status: string | null
          registration_date: string | null
          student_id: string
        }
        Insert: {
          exam_id: string
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          registration_date?: string | null
          student_id: string
        }
        Update: {
          exam_id?: string
          id?: string
          payment_amount?: number | null
          payment_status?: string | null
          registration_date?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_registrations_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number
          end_time: string
          id: string
          passing_marks: number
          start_time: string
          status: string | null
          title: string
          total_marks: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes: number
          end_time: string
          id?: string
          passing_marks: number
          start_time: string
          status?: string | null
          title: string
          total_marks: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          end_time?: string
          id?: string
          passing_marks?: number
          start_time?: string
          status?: string | null
          title?: string
          total_marks?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          submission_id: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          submission_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "event_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          media_name: string | null
          media_type: string
          publication_date: string | null
          submission_id: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          media_name?: string | null
          media_type: string
          publication_date?: string | null
          submission_id: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          media_name?: string | null
          media_type?: string
          publication_date?: string | null
          submission_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "event_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          chapter_id: string | null
          contact_number: string
          created_at: string | null
          email: string
          id: string
          kc_no: string
          kendra_name: string
          onboarding_completed: boolean | null
          principal_name: string
          rejection_reason: string | null
          school_name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          chapter_id?: string | null
          contact_number: string
          created_at?: string | null
          email: string
          id?: string
          kc_no: string
          kendra_name: string
          onboarding_completed?: boolean | null
          principal_name: string
          rejection_reason?: string | null
          school_name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          chapter_id?: string | null
          contact_number?: string
          created_at?: string | null
          email?: string
          id?: string
          kc_no?: string
          kendra_name?: string
          onboarding_completed?: boolean | null
          principal_name?: string
          rejection_reason?: string | null
          school_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schools_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_answers: {
        Row: {
          answered_at: string | null
          attempt_id: string
          id: string
          is_correct: boolean | null
          marks_awarded: number | null
          question_id: string
          selected_answer: string | null
        }
        Insert: {
          answered_at?: string | null
          attempt_id: string
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id: string
          selected_answer?: string | null
        }
        Update: {
          answered_at?: string | null
          attempt_id?: string
          id?: string
          is_correct?: boolean | null
          marks_awarded?: number | null
          question_id?: string
          selected_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "exam_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          mobile: string | null
          name: string
          roll_no: string | null
          school_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name: string
          roll_no?: string | null
          school_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string
          roll_no?: string | null
          school_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          academic_year: string
          created_at: string | null
          email: string
          id: string
          is_current: boolean | null
          mobile: string
          name: string
          school_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          email: string
          id?: string
          is_current?: boolean | null
          mobile: string
          name: string
          school_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          email?: string
          id?: string
          is_current?: boolean | null
          mobile?: string
          name?: string
          school_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "school_admin" | "student" | "evaluator"
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
      app_role: ["admin", "school_admin", "student", "evaluator"],
    },
  },
} as const
