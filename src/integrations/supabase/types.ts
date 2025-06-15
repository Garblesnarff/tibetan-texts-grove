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
      achievements: {
        Row: {
          achievement_category: string
          category: string
          description: string
          icon: string | null
          id: string
          is_hidden: boolean
          name: string
          requirements: Json | null
          tier: string
          xp_reward: number
        }
        Insert: {
          achievement_category?: string
          category: string
          description: string
          icon?: string | null
          id?: string
          is_hidden?: boolean
          name: string
          requirements?: Json | null
          tier?: string
          xp_reward?: number
        }
        Update: {
          achievement_category?: string
          category?: string
          description?: string
          icon?: string | null
          id?: string
          is_hidden?: boolean
          name?: string
          requirements?: Json | null
          tier?: string
          xp_reward?: number
        }
        Relationships: []
      }
      agent_communications: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          message_type: string
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          message_type: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_communications_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "agent_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "agent_states"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_states: {
        Row: {
          agent_role: string
          agent_type: string
          configuration: Json | null
          created_at: string | null
          id: string
          last_active: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_role: string
          agent_type: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_role?: string
          agent_type?: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string | null
          id: string
          is_seasonal: boolean | null
          name: string
          requirements: Json | null
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          is_seasonal?: boolean | null
          name: string
          requirements?: Json | null
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_seasonal?: boolean | null
          name?: string
          requirements?: Json | null
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      birds: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          scientific_name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          scientific_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          scientific_name?: string | null
        }
        Relationships: []
      }
      book_pages: {
        Row: {
          background_color: string | null
          book_id: string
          created_at: string
          font_color: string | null
          font_family: string | null
          font_size: number | null
          id: string
          image_settings: Json | null
          image_style: string | null
          image_url: string | null
          is_bold: boolean | null
          is_italic: boolean | null
          layout: string
          narration_url: string | null
          page_number: number
          text: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          book_id: string
          created_at?: string
          font_color?: string | null
          font_family?: string | null
          font_size?: number | null
          id?: string
          image_settings?: Json | null
          image_style?: string | null
          image_url?: string | null
          is_bold?: boolean | null
          is_italic?: boolean | null
          layout?: string
          narration_url?: string | null
          page_number: number
          text?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          book_id?: string
          created_at?: string
          font_color?: string | null
          font_family?: string | null
          font_size?: number | null
          id?: string
          image_settings?: Json | null
          image_style?: string | null
          image_url?: string | null
          is_bold?: boolean | null
          is_italic?: boolean | null
          layout?: string
          narration_url?: string | null
          page_number?: number
          text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          height: number
          id: string
          orientation: string
          title: string
          updated_at: string
          user_id: string | null
          width: number
        }
        Insert: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          height?: number
          id?: string
          orientation?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          width?: number
        }
        Update: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          height?: number
          id?: string
          orientation?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          width?: number
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          atmosphere: string | null
          campaign_length: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          era: string | null
          genre: string | null
          id: string
          location: string | null
          name: string
          setting_details: Json | null
          status: string | null
          thematic_elements: Json | null
          tone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          atmosphere?: string | null
          campaign_length?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          era?: string | null
          genre?: string | null
          id?: string
          location?: string | null
          name: string
          setting_details?: Json | null
          status?: string | null
          thematic_elements?: Json | null
          tone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          atmosphere?: string | null
          campaign_length?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          era?: string | null
          genre?: string | null
          id?: string
          location?: string | null
          name?: string
          setting_details?: Json | null
          status?: string | null
          thematic_elements?: Json | null
          tone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      character_equipment: {
        Row: {
          character_id: string | null
          created_at: string | null
          description: string | null
          equipped: boolean | null
          id: string
          item_name: string
          item_type: string
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          character_id?: string | null
          created_at?: string | null
          description?: string | null
          equipped?: boolean | null
          id?: string
          item_name: string
          item_type: string
          quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          character_id?: string | null
          created_at?: string | null
          description?: string | null
          equipped?: boolean | null
          id?: string
          item_name?: string
          item_type?: string
          quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_equipment_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_stats: {
        Row: {
          armor_class: number
          character_id: string | null
          charisma: number
          constitution: number
          created_at: string | null
          current_hit_points: number
          dexterity: number
          id: string
          initiative_bonus: number | null
          intelligence: number
          max_hit_points: number
          speed: number | null
          strength: number
          temporary_hit_points: number | null
          updated_at: string | null
          wisdom: number
        }
        Insert: {
          armor_class: number
          character_id?: string | null
          charisma: number
          constitution: number
          created_at?: string | null
          current_hit_points: number
          dexterity: number
          id?: string
          initiative_bonus?: number | null
          intelligence: number
          max_hit_points: number
          speed?: number | null
          strength: number
          temporary_hit_points?: number | null
          updated_at?: string | null
          wisdom: number
        }
        Update: {
          armor_class?: number
          character_id?: string | null
          charisma?: number
          constitution?: number
          created_at?: string | null
          current_hit_points?: number
          dexterity?: number
          id?: string
          initiative_bonus?: number | null
          intelligence?: number
          max_hit_points?: number
          speed?: number | null
          strength?: number
          temporary_hit_points?: number | null
          updated_at?: string | null
          wisdom?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_stats_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          alignment: string | null
          background: string | null
          class: string
          created_at: string | null
          description: string | null
          experience_points: number | null
          id: string
          level: number | null
          name: string
          race: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alignment?: string | null
          background?: string | null
          class: string
          created_at?: string | null
          description?: string | null
          experience_points?: number | null
          id?: string
          level?: number | null
          name: string
          race: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alignment?: string | null
          background?: string | null
          class?: string
          created_at?: string | null
          description?: string | null
          experience_points?: number | null
          id?: string
          level?: number | null
          name?: string
          race?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      combat_actions: {
        Row: {
          action_data: Json
          action_type: string
          created_at: string | null
          dice_rolls: Json | null
          encounter_id: string | null
          id: string
          participant_id: string | null
          result: Json | null
          round_number: number
          target_participant_id: string | null
          turn_order: number
        }
        Insert: {
          action_data?: Json
          action_type: string
          created_at?: string | null
          dice_rolls?: Json | null
          encounter_id?: string | null
          id?: string
          participant_id?: string | null
          result?: Json | null
          round_number?: number
          target_participant_id?: string | null
          turn_order?: number
        }
        Update: {
          action_data?: Json
          action_type?: string
          created_at?: string | null
          dice_rolls?: Json | null
          encounter_id?: string | null
          id?: string
          participant_id?: string | null
          result?: Json | null
          round_number?: number
          target_participant_id?: string | null
          turn_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "combat_actions_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "combat_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_actions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "combat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_actions_target_participant_id_fkey"
            columns: ["target_participant_id"]
            isOneToOne: false
            referencedRelation: "combat_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      combat_conditions: {
        Row: {
          condition_data: Json | null
          condition_name: string
          created_at: string | null
          duration_rounds: number | null
          expires_at_round: number | null
          id: string
          participant_id: string | null
          save_ability: string | null
          save_dc: number | null
        }
        Insert: {
          condition_data?: Json | null
          condition_name: string
          created_at?: string | null
          duration_rounds?: number | null
          expires_at_round?: number | null
          id?: string
          participant_id?: string | null
          save_ability?: string | null
          save_dc?: number | null
        }
        Update: {
          condition_data?: Json | null
          condition_name?: string
          created_at?: string | null
          duration_rounds?: number | null
          expires_at_round?: number | null
          id?: string
          participant_id?: string | null
          save_ability?: string | null
          save_dc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "combat_conditions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "combat_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      combat_encounters: {
        Row: {
          combat_log: Json | null
          created_at: string | null
          current_participant_id: string | null
          current_round: number | null
          current_turn: number | null
          description: string | null
          difficulty: string | null
          encounter_type: string | null
          id: string
          initiative_order: Json | null
          location_id: string | null
          session_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          combat_log?: Json | null
          created_at?: string | null
          current_participant_id?: string | null
          current_round?: number | null
          current_turn?: number | null
          description?: string | null
          difficulty?: string | null
          encounter_type?: string | null
          id?: string
          initiative_order?: Json | null
          location_id?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          combat_log?: Json | null
          created_at?: string | null
          current_participant_id?: string | null
          current_round?: number | null
          current_turn?: number | null
          description?: string | null
          difficulty?: string | null
          encounter_type?: string | null
          id?: string
          initiative_order?: Json | null
          location_id?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "combat_encounters_current_participant_id_fkey"
            columns: ["current_participant_id"]
            isOneToOne: false
            referencedRelation: "combat_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_encounters_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_encounters_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      combat_participants: {
        Row: {
          armor_class: number
          conditions: Json | null
          created_at: string | null
          current_hp: number
          encounter_id: string | null
          id: string
          initiative: number
          initiative_modifier: number
          is_active: boolean | null
          max_hp: number
          participant_id: string
          participant_type: string
          position_x: number | null
          position_y: number | null
          temporary_hp: number | null
          updated_at: string | null
        }
        Insert: {
          armor_class?: number
          conditions?: Json | null
          created_at?: string | null
          current_hp: number
          encounter_id?: string | null
          id?: string
          initiative?: number
          initiative_modifier?: number
          is_active?: boolean | null
          max_hp: number
          participant_id: string
          participant_type: string
          position_x?: number | null
          position_y?: number | null
          temporary_hp?: number | null
          updated_at?: string | null
        }
        Update: {
          armor_class?: number
          conditions?: Json | null
          created_at?: string | null
          current_hp?: number
          encounter_id?: string | null
          id?: string
          initiative?: number
          initiative_modifier?: number
          is_active?: boolean | null
          max_hp?: number
          participant_id?: string
          participant_type?: string
          position_x?: number | null
          position_y?: number | null
          temporary_hp?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "combat_participants_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "combat_encounters"
            referencedColumns: ["id"]
          },
        ]
      }
      completed_problems: {
        Row: {
          attempt_count: number | null
          completed_at: string
          completion_time_seconds: number | null
          course_id: string | null
          difficulty: string
          id: string
          problem_id: string
          topic_id: string | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          attempt_count?: number | null
          completed_at?: string
          completion_time_seconds?: number | null
          course_id?: string | null
          difficulty: string
          id?: string
          problem_id: string
          topic_id?: string | null
          user_id: string
          xp_earned: number
        }
        Update: {
          attempt_count?: number | null
          completed_at?: string
          completion_time_seconds?: number | null
          course_id?: string | null
          difficulty?: string
          id?: string
          problem_id?: string
          topic_id?: string | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "completed_problems_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_problems_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_problems_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_accessed_timestamp: string | null
          problems_completed: number | null
          total_problems: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_timestamp?: string | null
          problems_completed?: number | null
          total_problems?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_timestamp?: string | null
          problems_completed?: number | null
          total_problems?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          is_active: boolean | null
          learning_objectives: string[] | null
          prerequisite_course_ids: string[] | null
          sequence_number: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[] | null
          prerequisite_course_ids?: string[] | null
          sequence_number: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string[] | null
          prerequisite_course_ids?: string[] | null
          sequence_number?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          bonus_xp: number
          challenge_date: string
          created_at: string
          difficulty: string
          id: string
          problem_id: string
        }
        Insert: {
          bonus_xp?: number
          challenge_date?: string
          created_at?: string
          difficulty: string
          id?: string
          problem_id: string
        }
        Update: {
          bonus_xp?: number
          challenge_date?: string
          created_at?: string
          difficulty?: string
          id?: string
          problem_id?: string
        }
        Relationships: []
      }
      dialogue_history: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string
          session_id: string | null
          speaker_id: string | null
          speaker_type: string | null
          timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message: string
          session_id?: string | null
          speaker_id?: string | null
          speaker_type?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          session_id?: string | null
          speaker_id?: string | null
          speaker_type?: string | null
          timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dialogue_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: Database["public"]["Enums"]["timeline_category"]
          confidence_score: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          impact_analysis: string | null
          timeline_id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["timeline_category"]
          confidence_score: number
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          impact_analysis?: string | null
          timeline_id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["timeline_category"]
          confidence_score?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          impact_analysis?: string | null
          timeline_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          campaign_id: string | null
          character_id: string | null
          created_at: string | null
          end_time: string | null
          id: string
          session_number: number | null
          start_time: string | null
          status: string | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          character_id?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          session_number?: number | null
          start_time?: string | null
          status?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          character_id?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          session_number?: number | null
          start_time?: string | null
          status?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      historical_media: {
        Row: {
          content: string
          event_id: string
          generated_at: string | null
          id: string
          type: Database["public"]["Enums"]["media_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          event_id: string
          generated_at?: string | null
          id?: string
          type: Database["public"]["Enums"]["media_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          event_id?: string
          generated_at?: string | null
          id?: string
          type?: Database["public"]["Enums"]["media_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historical_media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          icon: string | null
          id: string
          is_active: boolean | null
          prerequisite_paths: string[] | null
          sequence_number: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          prerequisite_paths?: string[] | null
          sequence_number?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          prerequisite_paths?: string[] | null
          sequence_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          description: string | null
          id: string
          location_type: string | null
          name: string
          parent_location_id: string | null
          updated_at: string | null
          world_id: string | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_type?: string | null
          name: string
          parent_location_id?: string | null
          updated_at?: string | null
          world_id?: string | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_type?: string | null
          name?: string
          parent_location_id?: string | null
          updated_at?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          category: string | null
          content: string
          context_id: string | null
          created_at: string | null
          embedding: string | null
          id: string
          importance: number | null
          metadata: Json | null
          related_memories: string[] | null
          session_id: string | null
          subcategory: string | null
          tags: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          context_id?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          metadata?: Json | null
          related_memories?: string[] | null
          session_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          context_id?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          metadata?: Json | null
          related_memories?: string[] | null
          session_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      message_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          attempts: number | null
          created_at: string | null
          error: string | null
          id: string
          last_attempt: string | null
          message_id: string | null
          metadata: Json | null
          status: string
          timeout_at: string | null
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          attempts?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          last_attempt?: string | null
          message_id?: string | null
          metadata?: Json | null
          status?: string
          timeout_at?: string | null
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          attempts?: number | null
          created_at?: string | null
          error?: string | null
          id?: string
          last_attempt?: string | null
          message_id?: string | null
          metadata?: Json | null
          status?: string
          timeout_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_acknowledgments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "agent_communications"
            referencedColumns: ["id"]
          },
        ]
      }
      message_sequences: {
        Row: {
          created_at: string | null
          id: string
          message_id: string
          sequence_number: number
          updated_at: string | null
          vector_clock: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id: string
          sequence_number: number
          updated_at?: string | null
          vector_clock?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string
          sequence_number?: number
          updated_at?: string | null
          vector_clock?: Json
        }
        Relationships: [
          {
            foreignKeyName: "message_sequences_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: true
            referencedRelation: "agent_communications"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs: {
        Row: {
          class: string | null
          created_at: string | null
          current_location_id: string | null
          description: string | null
          id: string
          level: number | null
          name: string
          personality: string | null
          race: string | null
          stats: Json | null
          updated_at: string | null
          world_id: string | null
        }
        Insert: {
          class?: string | null
          created_at?: string | null
          current_location_id?: string | null
          description?: string | null
          id?: string
          level?: number | null
          name: string
          personality?: string | null
          race?: string | null
          stats?: Json | null
          updated_at?: string | null
          world_id?: string | null
        }
        Update: {
          class?: string | null
          created_at?: string | null
          current_location_id?: string | null
          description?: string | null
          id?: string
          level?: number | null
          name?: string
          personality?: string | null
          race?: string | null
          stats?: Json | null
          updated_at?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "npcs_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "npcs_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      Oversight: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      path_nodes: {
        Row: {
          content_id: string | null
          created_at: string
          description: string | null
          id: string
          node_type: string
          path_id: string
          prerequisite_nodes: string[] | null
          sequence_number: number
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          node_type: string
          path_id: string
          prerequisite_nodes?: string[] | null
          sequence_number?: number
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          content_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          node_type?: string
          path_id?: string
          prerequisite_nodes?: string[] | null
          sequence_number?: number
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "path_nodes_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          category: string
          created_at: string
          id: string
          prompt: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          prompt: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          prompt?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quest_progress: {
        Row: {
          character_id: string | null
          created_at: string | null
          current_objective: string | null
          id: string
          progress_data: Json | null
          quest_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          character_id?: string | null
          created_at?: string | null
          current_objective?: string | null
          id?: string
          progress_data?: Json | null
          quest_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          character_id?: string | null
          created_at?: string | null
          current_objective?: string | null
          id?: string
          progress_data?: Json | null
          quest_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_progress_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          prerequisites: Json | null
          quest_type: string | null
          rewards: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          prerequisites?: Json | null
          quest_type?: string | null
          rewards?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          prerequisites?: Json | null
          quest_type?: string | null
          rewards?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quests_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      rule_validations: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          rule_category: string
          rule_conditions: Json | null
          rule_description: string | null
          rule_exceptions: Json | null
          rule_references: Json | null
          rule_requirements: Json | null
          rule_source: string | null
          rule_type: string
          updated_at: string | null
          validation_data: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_category: string
          rule_conditions?: Json | null
          rule_description?: string | null
          rule_exceptions?: Json | null
          rule_references?: Json | null
          rule_requirements?: Json | null
          rule_source?: string | null
          rule_type: string
          updated_at?: string | null
          validation_data: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_category?: string
          rule_conditions?: Json | null
          rule_description?: string | null
          rule_exceptions?: Json | null
          rule_references?: Json | null
          rule_requirements?: Json | null
          rule_source?: string | null
          rule_type?: string
          updated_at?: string | null
          validation_data?: Json
        }
        Relationships: []
      }
      search_suggestions: {
        Row: {
          created_at: string | null
          id: string
          original_term: string
          relevance_score: number | null
          suggested_term: string
          type: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          original_term: string
          relevance_score?: number | null
          suggested_term: string
          type: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          original_term?: string
          relevance_score?: number | null
          suggested_term?: string
          type?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      suggestion_analytics: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          suggestion_id: string | null
          user_ip: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          suggestion_id?: string | null
          user_ip?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          suggestion_id?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_analytics_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "search_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_status: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          last_sync_timestamp: string
          sync_state: Json
          updated_at: string | null
          vector_clock: Json
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          last_sync_timestamp?: string
          sync_state?: Json
          updated_at?: string | null
          vector_clock?: Json
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          last_sync_timestamp?: string
          sync_state?: Json
          updated_at?: string | null
          vector_clock?: Json
        }
        Relationships: [
          {
            foreignKeyName: "sync_status_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agent_states"
            referencedColumns: ["id"]
          },
        ]
      }
      task_queue: {
        Row: {
          assigned_agent_id: string | null
          completed_at: string | null
          created_at: string | null
          data: Json
          error: string | null
          id: string
          priority: number | null
          result: Json | null
          status: string
          task_type: string
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json
          error?: string | null
          id?: string
          priority?: number | null
          result?: Json | null
          status?: string
          task_type: string
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json
          error?: string | null
          id?: string
          priority?: number | null
          result?: Json | null
          status?: string
          task_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_queue_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agent_states"
            referencedColumns: ["id"]
          },
        ]
      }
      timelines: {
        Row: {
          base_timeline_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_timeline_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_timeline_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timelines_base_timeline_id_fkey"
            columns: ["base_timeline_id"]
            isOneToOne: false
            referencedRelation: "timelines"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          sequence_number: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          sequence_number: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          sequence_number?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          tibetan_title: string | null
          title: string
          translation_id: string
          version_number: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          tibetan_title?: string | null
          title: string
          translation_id: string
          version_number: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          tibetan_title?: string | null
          title?: string
          translation_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "translation_versions_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "translation_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_versions_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "translations"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_views: {
        Row: {
          id: string
          translation_id: string
          viewed_at: string | null
          viewer_ip: string
        }
        Insert: {
          id?: string
          translation_id: string
          viewed_at?: string | null
          viewer_ip: string
        }
        Update: {
          id?: string
          translation_id?: string
          viewed_at?: string | null
          viewer_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "translation_views_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "translation_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_views_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "translations"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          featured: boolean | null
          id: string
          metadata: Json | null
          search_vector: unknown | null
          source_author: string | null
          source_file_path: string | null
          source_url: string | null
          tags: string[] | null
          tibetan_title: string | null
          title: string
          translation_file_path: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          metadata?: Json | null
          search_vector?: unknown | null
          source_author?: string | null
          source_file_path?: string | null
          source_url?: string | null
          tags?: string[] | null
          tibetan_title?: string | null
          title: string
          translation_file_path?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          metadata?: Json | null
          search_vector?: unknown | null
          source_author?: string | null
          source_file_path?: string | null
          source_url?: string | null
          tags?: string[] | null
          tibetan_title?: string | null
          title?: string
          translation_file_path?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          showcased: boolean | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          showcased?: boolean | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          showcased?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_birds: {
        Row: {
          bird_id: string
          captured_at: string | null
          created_at: string | null
          id: string
          location: Json | null
          photo_url: string | null
          user_id: string
        }
        Insert: {
          bird_id: string
          captured_at?: string | null
          created_at?: string | null
          id?: string
          location?: Json | null
          photo_url?: string | null
          user_id: string
        }
        Update: {
          bird_id?: string
          captured_at?: string | null
          created_at?: string | null
          id?: string
          location?: Json | null
          photo_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_birds_bird_id_fkey"
            columns: ["bird_id"]
            isOneToOne: false
            referencedRelation: "birds"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_challenges: {
        Row: {
          challenge_id: string
          completed_at: string
          id: string
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          id?: string
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          id?: string
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_path_node_progress: {
        Row: {
          attempts: number | null
          completed_at: string
          id: string
          node_id: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          completed_at?: string
          id?: string
          node_id: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          completed_at?: string
          id?: string
          node_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_path_node_progress_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "path_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_path_progress: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean | null
          last_accessed: string | null
          nodes_completed: string[] | null
          path_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_accessed?: string | null
          nodes_completed?: string[] | null
          path_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean | null
          last_accessed?: string | null
          nodes_completed?: string[] | null
          path_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_path_progress_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          best_challenge_streak: number | null
          created_at: string
          daily_challenge_streak: number | null
          id: string
          last_active_date: string | null
          last_daily_challenge_date: string | null
          level: number
          streak_days: number
          total_badges_earned: number | null
          total_paths_completed: number | null
          updated_at: string
          username: string | null
          xp: number
          xp_to_next_level: number
        }
        Insert: {
          best_challenge_streak?: number | null
          created_at?: string
          daily_challenge_streak?: number | null
          id: string
          last_active_date?: string | null
          last_daily_challenge_date?: string | null
          level?: number
          streak_days?: number
          total_badges_earned?: number | null
          total_paths_completed?: number | null
          updated_at?: string
          username?: string | null
          xp?: number
          xp_to_next_level?: number
        }
        Update: {
          best_challenge_streak?: number | null
          created_at?: string
          daily_challenge_streak?: number | null
          id?: string
          last_active_date?: string | null
          last_daily_challenge_date?: string | null
          level?: number
          streak_days?: number
          total_badges_earned?: number | null
          total_paths_completed?: number | null
          updated_at?: string
          username?: string | null
          xp?: number
          xp_to_next_level?: number
        }
        Relationships: []
      }
      world_factions: {
        Row: {
          created_at: string | null
          description: string | null
          faction_type: string | null
          id: string
          influence_level: number | null
          name: string
          relationships: Json | null
          updated_at: string | null
          world_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          faction_type?: string | null
          id?: string
          influence_level?: number | null
          name: string
          relationships?: Json | null
          updated_at?: string | null
          world_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          faction_type?: string | null
          id?: string
          influence_level?: number | null
          name?: string
          relationships?: Json | null
          updated_at?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "world_factions_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      world_history: {
        Row: {
          affected_factions: Json | null
          created_at: string | null
          description: string | null
          event_date: string | null
          event_name: string
          id: string
          significance_level: number | null
          updated_at: string | null
          world_id: string | null
        }
        Insert: {
          affected_factions?: Json | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_name: string
          id?: string
          significance_level?: number | null
          updated_at?: string | null
          world_id?: string | null
        }
        Update: {
          affected_factions?: Json | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_name?: string
          id?: string
          significance_level?: number | null
          updated_at?: string | null
          world_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "world_history_world_id_fkey"
            columns: ["world_id"]
            isOneToOne: false
            referencedRelation: "worlds"
            referencedColumns: ["id"]
          },
        ]
      }
      worlds: {
        Row: {
          campaign_id: string | null
          climate_type: string | null
          created_at: string | null
          description: string | null
          id: string
          magic_level: string | null
          name: string
          technology_level: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          climate_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          magic_level?: string | null
          name: string
          technology_level?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          climate_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          magic_level?: string | null
          name?: string
          technology_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worlds_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      translation_scores: {
        Row: {
          base_score: number | null
          category_id: string | null
          created_at: string | null
          featured: boolean | null
          id: string | null
          title: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_relevance_score: {
        Args: {
          title_match_score: number
          tag_match_score: number
          days_old: number
          view_count: number
          is_featured: boolean
          category_match_score: number
        }
        Returns: number
      }
      calculate_suggestion_score: {
        Args: {
          original_term: string
          suggested_term: string
          category_match: boolean
          tag_similarity: number
          view_count_proximity: number
          historical_usage: number
        }
        Returns: number
      }
      create_tools_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      media_type: "Newspaper" | "Document" | "Photo" | "Video" | "Audio"
      memory_subcategory:
        | "current_location"
        | "previous_location"
        | "npc"
        | "player"
        | "player_action"
        | "npc_action"
        | "dialogue"
        | "description"
        | "environment"
        | "item"
        | "general"
      timeline_category:
        | "Technology"
        | "Political"
        | "Cultural"
        | "Economic"
        | "Military"
        | "Scientific"
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
  public: {
    Enums: {
      media_type: ["Newspaper", "Document", "Photo", "Video", "Audio"],
      memory_subcategory: [
        "current_location",
        "previous_location",
        "npc",
        "player",
        "player_action",
        "npc_action",
        "dialogue",
        "description",
        "environment",
        "item",
        "general",
      ],
      timeline_category: [
        "Technology",
        "Political",
        "Cultural",
        "Economic",
        "Military",
        "Scientific",
      ],
    },
  },
} as const
