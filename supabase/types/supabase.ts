export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  data: {
    Tables: {
      bots: {
        Row: {
          bot_summary: string | null
          bot_summary_embedding_ada_002: string | null
          bot_summary_embedding_jina_v2_base_en: string | null
          created_at: string
          id: string
          organization_id: string
          system_prompt: string
          updated_at: string
          user_id_owner: string
        }
        Insert: {
          bot_summary?: string | null
          bot_summary_embedding_ada_002?: string | null
          bot_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: string
          organization_id: string
          system_prompt?: string
          updated_at?: string
          user_id_owner: string
        }
        Update: {
          bot_summary?: string | null
          bot_summary_embedding_ada_002?: string | null
          bot_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          system_prompt?: string
          updated_at?: string
          user_id_owner?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id_owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bots_p_557d80c6_1f30_421f_a786_d96592230fe1: {
        Row: {
          bot_summary: string | null
          bot_summary_embedding_ada_002: string | null
          bot_summary_embedding_jina_v2_base_en: string | null
          created_at: string
          id: string
          organization_id: string
          system_prompt: string
          updated_at: string
          user_id_owner: string
        }
        Insert: {
          bot_summary?: string | null
          bot_summary_embedding_ada_002?: string | null
          bot_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: string
          organization_id: string
          system_prompt?: string
          updated_at?: string
          user_id_owner: string
        }
        Update: {
          bot_summary?: string | null
          bot_summary_embedding_ada_002?: string | null
          bot_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          system_prompt?: string
          updated_at?: string
          user_id_owner?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          bot_id: string
          conversation_summary: string | null
          conversation_summary_embedding_ada_002: string | null
          conversation_summary_embedding_jina_v2_base_en: string | null
          created_at: string
          id: number
          organization_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bot_id: string
          conversation_summary?: string | null
          conversation_summary_embedding_ada_002?: string | null
          conversation_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: never
          organization_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bot_id?: string
          conversation_summary?: string | null
          conversation_summary_embedding_ada_002?: string | null
          conversation_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: never
          organization_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bot"
            columns: ["organization_id", "bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations_p_34dbaa83_e0d8_40ca_ae17_e1f4674f9445: {
        Row: {
          bot_id: string
          conversation_summary: string | null
          conversation_summary_embedding_ada_002: string | null
          conversation_summary_embedding_jina_v2_base_en: string | null
          created_at: string
          id: number
          organization_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bot_id: string
          conversation_summary?: string | null
          conversation_summary_embedding_ada_002?: string | null
          conversation_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id: number
          organization_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bot_id?: string
          conversation_summary?: string | null
          conversation_summary_embedding_ada_002?: string | null
          conversation_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: number
          organization_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations_p_eba001e1_7a4b_4baf_8731_2ca216c8db19: {
        Row: {
          bot_id: string
          conversation_summary: string | null
          conversation_summary_embedding_ada_002: string | null
          conversation_summary_embedding_jina_v2_base_en: string | null
          created_at: string
          id: number
          organization_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bot_id: string
          conversation_summary?: string | null
          conversation_summary_embedding_ada_002?: string | null
          conversation_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id: number
          organization_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bot_id?: string
          conversation_summary?: string | null
          conversation_summary_embedding_ada_002?: string | null
          conversation_summary_embedding_jina_v2_base_en?: string | null
          created_at?: string
          id?: number
          organization_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id?: never
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: never
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_next_chunk_fkey"
            columns: ["bot_id", "next_chunk"]
            isOneToOne: false
            referencedRelation: "document_chunks"
            referencedColumns: ["bot_id", "id"]
          },
          {
            foreignKeyName: "document_chunks_prev_chunk_fkey"
            columns: ["bot_id", "prev_chunk"]
            isOneToOne: false
            referencedRelation: "document_chunks"
            referencedColumns: ["bot_id", "id"]
          },
          {
            foreignKeyName: "fk_bot"
            columns: ["organization_id", "bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "fk_document"
            columns: ["bot_id", "document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["bot_id", "id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      document_chunks_p_6c712754_df60_4b27_a5e8_e2729f8ac72e: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id: number
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: number
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: []
      }
      document_chunks_p_6e28d716_77fa_4f33_83f5_6fd8c1a8bf76: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id: number
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: number
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: []
      }
      document_chunks_p_a5f7d1f8_cf97_4213_b29f_1a3af3262c33: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id: number
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: number
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: []
      }
      document_chunks_p_c6028ccb_7176_4c67_9df5_52768d6a7444: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id: number
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: number
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: []
      }
      document_chunks_p_dd5d499c_c152_453a_9a5a_b3c6cc0ce344: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id: number
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: number
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: []
      }
      document_chunks_p_ebba5da8_95f4_4445_9d5b_aebfd7ecea7c: {
        Row: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002: string | null
          chunk_content_embedding_jina_v2_base_en: string | null
          document_id: number
          id: number
          next_chunk: number | null
          organization_id: string
          prev_chunk: number | null
        }
        Insert: {
          bot_id: string
          chunk_content: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id: number
          id: number
          next_chunk?: number | null
          organization_id: string
          prev_chunk?: number | null
        }
        Update: {
          bot_id?: string
          chunk_content?: string
          chunk_content_embedding_ada_002?: string | null
          chunk_content_embedding_jina_v2_base_en?: string | null
          document_id?: number
          id?: number
          next_chunk?: number | null
          organization_id?: string
          prev_chunk?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: never
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: never
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bot"
            columns: ["organization_id", "bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      documents_p_6c712754_df60_4b27_a5e8_e2729f8ac72e: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id: number
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: number
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      documents_p_6e28d716_77fa_4f33_83f5_6fd8c1a8bf76: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id: number
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: number
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      documents_p_a5f7d1f8_cf97_4213_b29f_1a3af3262c33: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id: number
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: number
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      documents_p_c6028ccb_7176_4c67_9df5_52768d6a7444: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id: number
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: number
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      documents_p_dd5d499c_c152_453a_9a5a_b3c6cc0ce344: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id: number
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: number
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      documents_p_ebba5da8_95f4_4445_9d5b_aebfd7ecea7c: {
        Row: {
          author: string | null
          bot_id: string
          content: string | null
          content_embedding_ada_002: string | null
          content_embedding_jina_v2_base_en: string | null
          content_size_kb: number | null
          created_at: string
          document_summary: string | null
          document_summary_embedding_ada_002: string | null
          document_summary_embedding_jina_v2_base_en: string | null
          document_type: string | null
          id: number
          last_updated: string
          mime_type: string | null
          num_chunks: number
          organization_id: string
          source_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          bot_id: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id: number
          last_updated?: string
          mime_type?: string | null
          num_chunks: number
          organization_id: string
          source_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          bot_id?: string
          content?: string | null
          content_embedding_ada_002?: string | null
          content_embedding_jina_v2_base_en?: string | null
          content_size_kb?: number | null
          created_at?: string
          document_summary?: string | null
          document_summary_embedding_ada_002?: string | null
          document_summary_embedding_jina_v2_base_en?: string | null
          document_type?: string | null
          id?: number
          last_updated?: string
          mime_type?: string | null
          num_chunks?: number
          organization_id?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          bot_id: string
          conversation_id: number
          created_at: string
          id: number
          message_content: string
          message_content_embedding_ada_002: string | null
          message_content_embedding_jina_v2_base_en: string | null
          message_index: number
          message_type: string
          organization_id: string
          user_id: string
        }
        Insert: {
          bot_id: string
          conversation_id: number
          created_at?: string
          id?: never
          message_content: string
          message_content_embedding_ada_002?: string | null
          message_content_embedding_jina_v2_base_en?: string | null
          message_index: number
          message_type: string
          organization_id: string
          user_id: string
        }
        Update: {
          bot_id?: string
          conversation_id?: number
          created_at?: string
          id?: never
          message_content?: string
          message_content_embedding_ada_002?: string | null
          message_content_embedding_jina_v2_base_en?: string | null
          message_index?: number
          message_type?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bot"
            columns: ["organization_id", "bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "fk_conversation"
            columns: ["user_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["user_id", "id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      messages_p_34dbaa83_e0d8_40ca_ae17_e1f4674f9445: {
        Row: {
          bot_id: string
          conversation_id: number
          created_at: string
          id: number
          message_content: string
          message_content_embedding_ada_002: string | null
          message_content_embedding_jina_v2_base_en: string | null
          message_index: number
          message_type: string
          organization_id: string
          user_id: string
        }
        Insert: {
          bot_id: string
          conversation_id: number
          created_at?: string
          id: number
          message_content: string
          message_content_embedding_ada_002?: string | null
          message_content_embedding_jina_v2_base_en?: string | null
          message_index: number
          message_type: string
          organization_id: string
          user_id: string
        }
        Update: {
          bot_id?: string
          conversation_id?: number
          created_at?: string
          id?: number
          message_content?: string
          message_content_embedding_ada_002?: string | null
          message_content_embedding_jina_v2_base_en?: string | null
          message_index?: number
          message_type?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages_p_eba001e1_7a4b_4baf_8731_2ca216c8db19: {
        Row: {
          bot_id: string
          conversation_id: number
          created_at: string
          id: number
          message_content: string
          message_content_embedding_ada_002: string | null
          message_content_embedding_jina_v2_base_en: string | null
          message_index: number
          message_type: string
          organization_id: string
          user_id: string
        }
        Insert: {
          bot_id: string
          conversation_id: number
          created_at?: string
          id: number
          message_content: string
          message_content_embedding_ada_002?: string | null
          message_content_embedding_jina_v2_base_en?: string | null
          message_index: number
          message_type: string
          organization_id: string
          user_id: string
        }
        Update: {
          bot_id?: string
          conversation_id?: number
          created_at?: string
          id?: number
          message_content?: string
          message_content_embedding_ada_002?: string | null
          message_content_embedding_jina_v2_base_en?: string | null
          message_index?: number
          message_type?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          organization_id: string
          user_id: string
        }
        Insert: {
          organization_id: string
          user_id: string
        }
        Update: {
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          id: string
          user_id_owner: string
        }
        Insert: {
          id?: string
          user_id_owner: string
        }
        Update: {
          id?: string
          user_id_owner?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id_owner"
            columns: ["user_id_owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_bot: {
        Args: {
          p_organization_id: string
          p_user_id_owner: string
          p_system_prompt?: string
        }
        Returns: {
          bot_summary: string | null
          bot_summary_embedding_ada_002: string | null
          bot_summary_embedding_jina_v2_base_en: string | null
          created_at: string
          id: string
          organization_id: string
          system_prompt: string
          updated_at: string
          user_id_owner: string
        }[]
      }
      create_conversation: {
        Args: {
          p_user_id: string
          p_organization_id: string
          p_bot_id: string
        }
        Returns: number
      }
      create_document_with_chunks: {
        Args: {
          p_bot_id: string
          p_organization_id: string
          p_user_id: string
          p_title: string
          p_chunks_info: Json
          p_author?: string
          p_source_url?: string
          p_document_type?: string
          p_content?: string
          p_content_size_kb?: number
          p_content_embedding_ada_002?: string
          p_content_embedding_jina_v2_base_en?: string
          p_document_summary?: string
          p_document_summary_embedding_ada_002?: string
          p_document_summary_embedding_jina_v2_base_en?: string
          p_mime_type?: string
        }
        Returns: boolean
      }
      create_user: {
        Args: {
          p_organization_id: string
        }
        Returns: {
          like: unknown
        }[]
      }
      document_chunk_similarity_search: {
        Args: {
          p_organization_id: string
          p_bot_id: string
          p_user_id: string
          p_threshold: number
          p_k: number
          p_embedding_ada_002?: string
          p_embedding_jina_v2_base_en?: string
        }
        Returns: {
          id: number
          bot_id: string
          organization_id: string
          document_id: number
          chunk_content: string
          prev_chunk: number
          next_chunk: number
          similarity: number
        }[]
      }
      get_user_conversations: {
        Args: {
          p_user_id: string
        }
        Returns: {
          like: unknown
        }[]
      }
      get_users_orgs: {
        Args: {
          p_organization_id?: string
        }
        Returns: {
          user_id: string
          organization_ids: string[]
        }[]
      }
      initialize_user_data_partitions: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
      [_ in never]: never
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
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

