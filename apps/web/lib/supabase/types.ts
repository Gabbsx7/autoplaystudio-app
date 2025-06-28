export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      autoplaystudio_copilot: {
        Row: {
          created_at: string
          design_id: string | null
          element_id: string | null
          id: string
          instructions: Json | null
          message: string | null
          node_id: string | null
        }
        Insert: {
          created_at?: string
          design_id?: string | null
          element_id?: string | null
          id?: string
          instructions?: Json | null
          message?: string | null
          node_id?: string | null
        }
        Update: {
          created_at?: string
          design_id?: string | null
          element_id?: string | null
          id?: string
          instructions?: Json | null
          message?: string | null
          node_id?: string | null
        }
        Relationships: []
      }
      client_users: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_primary: boolean | null
          role_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_primary?: boolean | null
          role_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_primary?: boolean | null
          role_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          changes_description: string | null
          created_at: string | null
          created_by: string | null
          document_id: string | null
          file_url: string
          id: string
          version: number
        }
        Insert: {
          changes_description?: string | null
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          file_url: string
          id?: string
          version: number
        }
        Update: {
          changes_description?: string | null
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          file_url?: string
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          file_url: string
          id: string
          metadata: Json | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string
          due_date: string | null
          id: string
          paid_date: string | null
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by: string
          due_date?: string | null
          id?: string
          paid_date?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string
          due_date?: string | null
          id?: string
          paid_date?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          aspect_ratio: string | null
          created_at: string | null
          description: string | null
          id: number
          media_collection: string | null
          media_type: string
          metadata: Json | null
          milestone_id: string | null
          thumbnail_url: string | null
          title: string
          url: string
          user_id: string
        }
        Insert: {
          aspect_ratio?: string | null
          created_at?: string | null
          description?: string | null
          id?: never
          media_collection?: string | null
          media_type: string
          metadata?: Json | null
          milestone_id?: string | null
          thumbnail_url?: string | null
          title: string
          url: string
          user_id?: string
        }
        Update: {
          aspect_ratio?: string | null
          created_at?: string | null
          description?: string | null
          id?: never
          media_collection?: string | null
          media_type?: string
          metadata?: Json | null
          milestone_id?: string | null
          thumbnail_url?: string | null
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_media_collection_fkey"
            columns: ["media_collection"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      media_collections: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_collections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string
          username: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
          username: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      milestone_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          milestone_id: string
          name: string
          status: Database["public"]["Enums"]["task_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_id: string
          name: string
          status?: Database["public"]["Enums"]["task_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_id?: string
          name?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestone_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          assignee_id: string | null
          checklist_items: Json | null
          client_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          goals: string | null
          id: string
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["milestone_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          checklist_items?: Json | null
          client_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          goals?: string | null
          id?: string
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["milestone_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          checklist_items?: Json | null
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          goals?: string | null
          id?: string
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["milestone_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          is_read: boolean
          project_id: string | null
          recipient_id: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          project_id?: string | null
          recipient_id?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          project_id?: string | null
          recipient_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "project_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          parent_id: string | null
          project_id: string | null
          rate_limit_metadata: Json | null
          resolution_metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          updated_at: string | null
          user_avatar: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          parent_id?: string | null
          project_id?: string | null
          rate_limit_metadata?: Json | null
          resolution_metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          parent_id?: string | null
          project_id?: string | null
          rate_limit_metadata?: Json | null
          resolution_metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          updated_at?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "project_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          collection_id: string | null
          created_at: string | null
          created_by: string
          id: string
          media_id: number | null
        }
        Insert: {
          collection_id?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          media_id?: number | null
        }
        Update: {
          collection_id?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          media_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_media_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          project_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          category: string | null
          company_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          project_media_id: string | null
          slug: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          project_media_id?: string | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          project_media_id?: string | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_media_id_fkey"
            columns: ["project_media_id"]
            isOneToOne: false
            referencedRelation: "project_media"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          img_profile: Json | null
          job_title: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          img_profile?: Json | null
          job_title?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          img_profile?: Json | null
          job_title?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      client_user_view: {
        Row: {
          client_id: string | null
          client_name: string | null
          client_user_id: string | null
          cu_created_at: string | null
          cu_updated_at: string | null
          img_profile: Json | null
          is_primary: boolean | null
          logo_url: string | null
          role_id: string | null
          user_email: string | null
          user_id: string | null
          user_job_title: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_comment_with_validation: {
        Args: { p_project_id: string; p_content: string; p_parent_id?: string }
        Returns: string
      }
      add_project_feedback: {
        Args: { p_project_id: string; p_content: string }
        Returns: string
      }
      assign_user_to_client: {
        Args: {
          p_client_id: string
          p_user_id: string
          p_role: string
          p_is_primary?: boolean
        }
        Returns: string
      }
      can_delete_project: {
        Args: { project_id: string }
        Returns: boolean
      }
      check_project_access: {
        Args: { user_id: string; project_id: string }
        Returns: boolean
      }
      check_user_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
      }
      create_project_comment: {
        Args: { p_project_id: string; p_content: string; p_parent_id?: string }
        Returns: string
      }
      create_project_feedback: {
        Args: {
          p_project_id: string
          p_content: string
          p_feedback_type?: string
        }
        Returns: string
      }
      edit_comment: {
        Args: { p_comment_id: string; p_content: string }
        Returns: boolean
      }
      get_all_clients: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_id: string
          client_name: string
          client_description: string
          client_logo_url: string
          is_active: boolean
          assigned_users: Json
        }[]
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          roles: Json
          client_assignments: Json
        }[]
      }
      get_client_dashboard_data: {
        Args: { client_id: string }
        Returns: Json
      }
      get_client_user_details: {
        Args: { p_client_id: string }
        Returns: {
          user_id: string
          email: string
          role: string
          is_primary: boolean
          assigned_at: string
          assigned_by: string
        }[]
      }
      get_client_users: {
        Args: { p_client_id: string }
        Returns: {
          user_id: string
          email: string
          role: string
          is_primary: boolean
        }[]
      }
      get_complete_schema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_formatted_project_milestones: {
        Args: { p_project_id: string }
        Returns: {
          milestone_number: number
          title: string
          description: string
          status: Database["public"]["Enums"]["milestone_status"]
          start_date: string
          deadline: string
          assignee_id: string
          is_overdue: boolean
        }[]
      }
      get_milestone_accordion_data: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          title: string
          description: string
          due_date: string
          status: string
          completion_percentage: number
          total_tasks: number
          completed_tasks: number
          checklist_items: Json
          assignee_info: Json
        }[]
      }
      get_milestone_list: {
        Args: { p_project_id?: string }
        Returns: {
          id: string
          milestone_number: number
          title: string
          description: string
          status: Database["public"]["Enums"]["milestone_status"]
          start_date: string
          deadline: string
          is_overdue: boolean
          project_name: string
          project_id: string
          assignee_email: string
          assignee_id: string
        }[]
      }
      get_milestone_overview: {
        Args: Record<PropertyKey, never>
        Returns: {
          milestone_id: string
          title: string
          description: string
          due_date: string
          status: string
          is_overdue: boolean
          completion_percentage: number
          project_name: string
          project_id: string
          assignee_name: string
        }[]
      }
      get_milestone_tasks: {
        Args: { p_milestone_id: string }
        Returns: {
          id: string
          name: string
          description: string
          due_date: string
          status: Database["public"]["Enums"]["task_status"]
          assignee_email: string
          created_at: string
          updated_at: string
        }[]
      }
      get_paginated_comments: {
        Args: { p_project_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          comments: Json
          total_count: number
          has_more: boolean
        }[]
      }
      get_project_analytics: {
        Args: { project_id: string }
        Returns: Json
      }
      get_project_comments: {
        Args: { p_project_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          content: string
          created_at: string
          updated_at: string
          user_id: string
          user_avatar: string
          user_name: string
          parent_id: string
          metadata: Json
          total_count: number
        }[]
      }
      get_project_feedback: {
        Args: { p_project_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          content: string
          created_at: string
          user_name: string
          feedback_type: string
        }[]
      }
      get_project_id: {
        Args: { project_name: string }
        Returns: string
      }
      get_project_milestone_details: {
        Args: { p_project_id: string }
        Returns: {
          milestone_number: number
          title: string
          description: string
          status: Database["public"]["Enums"]["milestone_status"]
          start_date: string
          deadline: string
          assignee_id: string
          is_overdue: boolean
          assignee_email: string
        }[]
      }
      get_project_milestones: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          milestone_titles: string[]
          milestone_descriptions: string[]
          milestone_statuses: Database["public"]["Enums"]["milestone_status"][]
          milestone_deadlines: string[]
          milestone_start_dates: string[]
          assignee_ids: string[]
          goals: string
          tasks: string[]
        }[]
      }
      get_project_overview: {
        Args: { p_project_id: string }
        Returns: Json
      }
      get_resolved_comments: {
        Args: { p_project_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          content: string
          created_at: string
          user_name: string
          resolved_at: string
          resolved_by_name: string
          resolution_metadata: Json
        }[]
      }
      get_unresolved_comments: {
        Args: { p_project_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          id: string
          content: string
          created_at: string
          user_name: string
        }[]
      }
      get_user_active_projects: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          name: string
          status: string
          company_id: string
          created_at: string
          role_name: string
        }[]
      }
      get_user_project_feedback: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          content: string
          created_at: string
          user_name: string
        }[]
      }
      get_user_project_role: {
        Args: { user_id: string; project_id: string }
        Returns: string
      }
      get_user_projects: {
        Args: { p_user_id: string }
        Returns: {
          budget: number | null
          category: string | null
          company_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          project_media_id: string | null
          slug: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }[]
      }
      is_project_owner: {
        Args: { user_id: string; project_id: string }
        Returns: boolean
      }
      search_media_items: {
        Args: { q: string; page: number; per_page: number }
        Returns: {
          aspect_ratio: string | null
          created_at: string | null
          description: string | null
          id: number
          media_collection: string | null
          media_type: string
          metadata: Json | null
          milestone_id: string | null
          thumbnail_url: string | null
          title: string
          url: string
          user_id: string
        }[]
      }
      search_media_items_all: {
        Args: { q: string }
        Returns: {
          aspect_ratio: string | null
          created_at: string | null
          description: string | null
          id: number
          media_collection: string | null
          media_type: string
          metadata: Json | null
          milestone_id: string | null
          thumbnail_url: string | null
          title: string
          url: string
          user_id: string
        }[]
      }
      toggle_comment_resolution: {
        Args: { p_comment_id: string; p_resolution_status: boolean }
        Returns: boolean
      }
    }
    Enums: {
      milestone_status: "pending" | "in_progress" | "completed"
      priority_level: "low" | "medium" | "high" | "urgent"
      project_status:
        | "draft"
        | "planning"
        | "in_progress"
        | "review"
        | "completed"
        | "on_hold"
        | "cancelled"
      task_status: "todo" | "in_progress" | "review" | "completed" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_legacy_v1: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v1_optimised: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v2: {
        Args: {
          prefix: string
          bucket_name: string
          limits?: number
          levels?: number
          start_after?: string
        }
        Returns: {
          key: string
          name: string
          id: string
          updated_at: string
          created_at: string
          metadata: Json
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      milestone_status: ["pending", "in_progress", "completed"],
      priority_level: ["low", "medium", "high", "urgent"],
      project_status: [
        "draft",
        "planning",
        "in_progress",
        "review",
        "completed",
        "on_hold",
        "cancelled",
      ],
      task_status: ["todo", "in_progress", "review", "completed", "blocked"],
    },
  },
  storage: {
    Enums: {},
  },
} as const

