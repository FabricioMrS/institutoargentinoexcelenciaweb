export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      biblioteca_archivos: {
        Row: {
          archivo_nombre: string
          archivo_path: string
          categoria: string
          created_at: string | null
          descripcion: string | null
          id: string
          tamano_bytes: number | null
          tipo_archivo: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          archivo_nombre: string
          archivo_path: string
          categoria: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          tamano_bytes?: number | null
          tipo_archivo?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          archivo_nombre?: string
          archivo_path?: string
          categoria?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          tamano_bytes?: number | null
          tipo_archivo?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          apellido: string
          cargo: string | null
          ciudad: string | null
          created_at: string | null
          direccion: string | null
          email: string
          empresa: string | null
          estado: string
          etiquetas: string[] | null
          id: string
          nombre: string
          notas: string | null
          pais: string | null
          telefono: string
          ultimo_contacto: string | null
          updated_at: string | null
          vendedor_id: string | null
        }
        Insert: {
          apellido: string
          cargo?: string | null
          ciudad?: string | null
          created_at?: string | null
          direccion?: string | null
          email: string
          empresa?: string | null
          estado?: string
          etiquetas?: string[] | null
          id?: string
          nombre: string
          notas?: string | null
          pais?: string | null
          telefono: string
          ultimo_contacto?: string | null
          updated_at?: string | null
          vendedor_id?: string | null
        }
        Update: {
          apellido?: string
          cargo?: string | null
          ciudad?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string
          empresa?: string | null
          estado?: string
          etiquetas?: string[] | null
          id?: string
          nombre?: string
          notas?: string | null
          pais?: string | null
          telefono?: string
          ultimo_contacto?: string | null
          updated_at?: string | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_financing_options: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          installments: number
          interest_rate: number
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          installments: number
          interest_rate: number
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          installments?: number
          interest_rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_financing_options_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          id: string
          order_number: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          id?: string
          order_number: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          id?: string
          order_number?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_materials: {
        Row: {
          course_id: string
          created_at: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          lesson_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          lesson_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          lesson_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_messages: {
        Row: {
          course_id: string
          created_at: string
          id: string
          message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          message: string
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          message?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_messages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          default_financing_option: number | null
          description: string | null
          duration: number
          enabled: boolean | null
          enrollment_password: string | null
          featured: boolean | null
          id: string
          image: string
          main_category: string | null
          modality: string
          price: number
          schedule: string
          slug: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          default_financing_option?: number | null
          description?: string | null
          duration: number
          enabled?: boolean | null
          enrollment_password?: string | null
          featured?: boolean | null
          id?: string
          image: string
          main_category?: string | null
          modality: string
          price: number
          schedule: string
          slug: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          default_financing_option?: number | null
          description?: string | null
          duration?: number
          enabled?: boolean | null
          enrollment_password?: string | null
          featured?: boolean | null
          id?: string
          image?: string
          main_category?: string | null
          modality?: string
          price?: number
          schedule?: string
          slug?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_users: {
        Row: {
          activo: boolean | null
          apellido: string
          created_at: string | null
          email: string
          fecha_creacion: string | null
          id: string
          nombre: string
          password_hash: string | null
          role: string
          updated_at: string | null
          vendedor_id: string | null
        }
        Insert: {
          activo?: boolean | null
          apellido: string
          created_at?: string | null
          email: string
          fecha_creacion?: string | null
          id?: string
          nombre: string
          password_hash?: string | null
          role: string
          updated_at?: string | null
          vendedor_id?: string | null
        }
        Update: {
          activo?: boolean | null
          apellido?: string
          created_at?: string | null
          email?: string
          fecha_creacion?: string | null
          id?: string
          nombre?: string
          password_hash?: string | null
          role?: string
          updated_at?: string | null
          vendedor_id?: string | null
        }
        Relationships: []
      }
      lesson_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_comments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      pending_testimonials: {
        Row: {
          approved: boolean | null
          content: string
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          content: string
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          role: string
          specialties: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          role: string
          specialties?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          role?: string
          specialties?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      sales_opportunities: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          descripcion: string | null
          etapa: string
          fecha_cierre_estimada: string | null
          fecha_cierre_real: string | null
          id: string
          notas: string | null
          probabilidad: number | null
          titulo: string
          updated_at: string | null
          valor: number
          vendedor_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          etapa?: string
          fecha_cierre_estimada?: string | null
          fecha_cierre_real?: string | null
          id?: string
          notas?: string | null
          probabilidad?: number | null
          titulo: string
          updated_at?: string | null
          valor: number
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          etapa?: string
          fecha_cierre_estimada?: string | null
          fecha_cierre_real?: string | null
          id?: string
          notas?: string | null
          probabilidad?: number | null
          titulo?: string
          updated_at?: string | null
          valor?: number
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_opportunities_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_opportunities_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          asignado_a: string | null
          asignado_por: string | null
          categoria: string | null
          cliente_id: string | null
          cliente_nombre: string | null
          creado_por: string | null
          creado_por_id: string | null
          created_at: string | null
          descripcion: string | null
          estado: string
          fecha_completada: string | null
          fecha_creacion: string | null
          fecha_vencimiento: string | null
          id: string
          notas: string | null
          oportunidad_id: string | null
          prioridad: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          asignado_a?: string | null
          asignado_por?: string | null
          categoria?: string | null
          cliente_id?: string | null
          cliente_nombre?: string | null
          creado_por?: string | null
          creado_por_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string
          fecha_completada?: string | null
          fecha_creacion?: string | null
          fecha_vencimiento?: string | null
          id?: string
          notas?: string | null
          oportunidad_id?: string | null
          prioridad?: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          asignado_a?: string | null
          asignado_por?: string | null
          categoria?: string | null
          cliente_id?: string | null
          cliente_nombre?: string | null
          creado_por?: string | null
          creado_por_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string
          fecha_completada?: string | null
          fecha_creacion?: string | null
          fecha_vencimiento?: string | null
          id?: string
          notas?: string | null
          oportunidad_id?: string | null
          prioridad?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_creado_por_id_fkey"
            columns: ["creado_por_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_oportunidad_id_fkey"
            columns: ["oportunidad_id"]
            isOneToOne: false
            referencedRelation: "sales_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          photo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      armor: {
        Args: { "": string }
        Returns: string
      }
      authenticate_user: {
        Args: { email_input: string; password_input: string }
        Returns: {
          id: string
          nombre: string
          apellido: string
          email: string
          role: string
          vendedor_id: string
          activo: boolean
        }[]
      }
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_password_reset_token: {
        Args: { email_input: string }
        Returns: {
          token: string
          user_found: boolean
        }[]
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      reset_password_with_token: {
        Args: { token_input: string; new_password: string }
        Returns: boolean
      }
      set_current_user_context: {
        Args: { _user_id: string }
        Returns: undefined
      }
      verify_password: {
        Args: { password: string; hash: string }
        Returns: boolean
      }
      verify_reset_token: {
        Args: { token_input: string }
        Returns: {
          user_id: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "user" | "admin"
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
      app_role: ["user", "admin"],
    },
  },
} as const
