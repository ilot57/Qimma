export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      credit_transactions: {
        Row: {
          amount: number;
          created_at: string | null;
          description: string | null;
          exam_id: string | null;
          id: string;
          stripe_transaction_id: string | null;
          transaction_type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          description?: string | null;
          exam_id?: string | null;
          id?: string;
          stripe_transaction_id?: string | null;
          transaction_type: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          description?: string | null;
          exam_id?: string | null;
          id?: string;
          stripe_transaction_id?: string | null;
          transaction_type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'credit_transactions_exam_id_fkey';
            columns: ['exam_id'];
            isOneToOne: false;
            referencedRelation: 'exams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'credit_transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      exams: {
        Row: {
          created_at: string | null;
          description: string | null;
          grade_level: string;
          id: string;
          reference_file_url: string | null;
          status: string | null;
          subject: string;
          teacher_id: string;
          title: string;
          total_points: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          grade_level: string;
          id?: string;
          reference_file_url?: string | null;
          status?: string | null;
          subject: string;
          teacher_id: string;
          title: string;
          total_points?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          grade_level?: string;
          id?: string;
          reference_file_url?: string | null;
          status?: string | null;
          subject?: string;
          teacher_id?: string;
          title?: string;
          total_points?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exams_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      student_submissions: {
        Row: {
          ai_feedback: Json | null;
          created_at: string | null;
          exam_id: string;
          file_url: string;
          id: string;
          max_score: number | null;
          processing_status: string | null;
          student_name: string;
          total_score: number | null;
          updated_at: string | null;
        };
        Insert: {
          ai_feedback?: Json | null;
          created_at?: string | null;
          exam_id: string;
          file_url: string;
          id?: string;
          max_score?: number | null;
          processing_status?: string | null;
          student_name: string;
          total_score?: number | null;
          updated_at?: string | null;
        };
        Update: {
          ai_feedback?: Json | null;
          created_at?: string | null;
          exam_id?: string;
          file_url?: string;
          id?: string;
          max_score?: number | null;
          processing_status?: string | null;
          student_name?: string;
          total_score?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'student_submissions_exam_id_fkey';
            columns: ['exam_id'];
            isOneToOne: false;
            referencedRelation: 'exams';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          clerk_user_id: string;
          created_at: string | null;
          credits_remaining: number | null;
          email: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          role: string | null;
          subscription_tier: string | null;
          updated_at: string | null;
        };
        Insert: {
          clerk_user_id: string;
          created_at?: string | null;
          credits_remaining?: number | null;
          email: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          role?: string | null;
          subscription_tier?: string | null;
          updated_at?: string | null;
        };
        Update: {
          clerk_user_id?: string;
          created_at?: string | null;
          credits_remaining?: number | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          role?: string | null;
          subscription_tier?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
