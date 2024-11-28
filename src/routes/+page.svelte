<script>
  import { onMount } from 'svelte';
  import DOMPurify from 'dompurify';

  let gratitudeMessage = '';
  let name = '';
  let messages = [];
  const MAX_MESSAGE_LENGTH = 500;

  // Load messages from local storage on mount
  onMount(() => {
    const storedMessages = localStorage.getItem('gratitudeMessages');
    if (storedMessages) {
      messages = JSON.parse(storedMessages);
    }
  });

  // Save messages to local storage
  function saveMessages() {
    localStorage.setItem('gratitudeMessages', JSON.stringify(messages));
  }

  // Handle form submission
  function handleSubmit() {
    // Validate input
    if (!gratitudeMessage.trim()) {
      alert('Please enter a gratitude message');
      return;
    }

    if (gratitudeMessage.length > MAX_MESSAGE_LENGTH) {
      alert(`Message must be ${MAX_MESSAGE_LENGTH} characters or less`);
      return;
    }

    // Sanitize input
    const sanitizedMessage = DOMPurify.sanitize(gratitudeMessage);
    const sanitizedName = DOMPurify.sanitize(name);

    // Create new message object
    const newMessage = {
      id: Date.now(),
      message: sanitizedMessage,
      name: sanitizedName || 'Anonymous',
      timestamp: new Date().toISOString()
    };

    // Add message to array and sort by timestamp
    messages = [...messages, newMessage].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Save to local storage
    saveMessages();

    // Reset form
    gratitudeMessage = '';
    name = '';
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
    {#each messages as { message, name, timestamp }}
      <div class="gratitude-message">
        <div class="leaf-decoration top-2 right-2"></div>
        <p class="text-lg mb-2">{message}</p>
        <div class="text-sm text-autumn-brown opacity-75">
          Shared by {name} on {new Date(timestamp).toLocaleDateString()}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* Additional component-specific styles can go here */
  :global(body) {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D35400' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
