import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Message event types
export type MessageEvent = {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  message: Database['public']['Tables']['gratitude_messages']['Row']
}

// Initialize and export realtime subscription for messages
export const messageChannel = supabase.channel('gratitude_messages')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'gratitude_messages'
    },
    (payload) => {
      console.log('Message change received!', payload)
      // Payload is properly typed and can be used by subscribers
      return {
        type: payload.eventType,
        message: payload.new
      } as MessageEvent
    }
  )
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Successfully subscribed to message updates')
    } else {
      console.error('Failed to subscribe to message updates:', status)
    }
  })