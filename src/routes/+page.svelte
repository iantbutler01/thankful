<script lang="ts">
  import { onMount } from 'svelte';
  import DOMPurify from 'dompurify';
  import { supabase } from '$lib/supabase';
  import type { Database } from '../types/supabase';

  let gratitudeMessage = '';
  let name = '';
  let messages: Database['public']['Tables']['gratitude_messages']['Row'][] = [];
  let loading = false;
  let error: string | null = null;
  const MAX_MESSAGE_LENGTH = 500;

  // Load messages from Supabase on mount
  onMount(() => {
    let subscription: any;

    const loadMessages = async () => {
      try {
        loading = true;
        const { data, error: err } = await supabase
          .from('gratitude_messages')
          .select('*')
          .order('timestamp', { ascending: false });

        if (err) throw err;
        messages = data || [];

        // Set up real-time subscription
        subscription = supabase
          .channel('gratitude_messages')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'gratitude_messages' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                messages = [payload.new as Database['public']['Tables']['gratitude_messages']['Row'], ...messages];
              }
            }
          )
          .subscribe();

      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load messages';
      } finally {
        loading = false;
      }
    };

    loadMessages();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });

  // Handle form submission
  async function handleSubmit() {
    try {
      // Validate input
      if (!gratitudeMessage.trim()) {
        error = 'Please enter a gratitude message';
        return;
      }

      if (gratitudeMessage.length > MAX_MESSAGE_LENGTH) {
        error = `Message must be ${MAX_MESSAGE_LENGTH} characters or less`;
        return;
      }

      loading = true;
      error = null;

      // Sanitize input
      const sanitizedMessage = DOMPurify.sanitize(gratitudeMessage);
      const sanitizedName = DOMPurify.sanitize(name);

      // Create new message object
      const newMessage = {
        message: sanitizedMessage,
        author: sanitizedName || 'Anonymous',
        timestamp: new Date().toISOString()
      };

      // Insert into Supabase
      const { error: err } = await supabase
        .from('gratitude_messages')
        .insert([newMessage]);

      if (err) throw err;

      // Reset form
      gratitudeMessage = '';
      name = '';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save message';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen p-4">
  <!-- Turkey decoration -->
  <div class="absolute top-4 right-4 w-16 h-16 md:w-24 md:h-24">
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D35400'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/%3E%3C/svg%3E" 
         alt="Turkey decoration" 
         class="w-full h-full opacity-50" />
  </div>

  <h1 class="thanksgiving-header">
    Gratitude Wall
  </h1>

  <!-- Gratitude Form -->
  <form class="gratitude-form" on:submit|preventDefault={handleSubmit}>
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium mb-2">Your Name (Optional)</label>
      <input
        type="text"
        id="name"
        bind:value={name}
        class="gratitude-input"
        placeholder="Anonymous"
        maxlength="50"
      />
    </div>

    <div class="mb-4">
      <label for="message" class="block text-sm font-medium mb-2">Your Gratitude Message*</label>
      <textarea
        id="message"
        bind:value={gratitudeMessage}
        class="gratitude-input"
        rows="4"
        placeholder="Share what you're thankful for..."
        maxlength={MAX_MESSAGE_LENGTH}
        required
      ></textarea>
      <div class="text-sm text-right">
        {gratitudeMessage.length}/{MAX_MESSAGE_LENGTH}
      </div>
    </div>

    <button type="submit" class="submit-button">
      Share Gratitude
    </button>
  </form>

  <!-- Messages Display -->
  <div class="max-w-2xl mx-auto mt-8">
    {#if loading}
      <div class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-autumn-brown mx-auto"></div>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {error}</span>
      </div>
    {:else}
      {#each messages as { message, author, timestamp }}
      <div class="gratitude-message">
        <div class="leaf-decoration top-2 right-2"></div>
        <p class="text-lg mb-2">{message}</p>
        <div class="text-sm text-autumn-brown opacity-75">
          Shared by {author} on {new Date(timestamp).toLocaleDateString()}
        </div>
      </div>
    {/each}
    {/if}
  </div>
</div>

<style>
  /* Additional component-specific styles can go here */
  :global(body) {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D35400' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>