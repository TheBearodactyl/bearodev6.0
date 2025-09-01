<script lang="ts">
  import { browser } from "$app/environment";
  import { API_BASE } from "$lib/types";
  import { onMount } from "svelte";

  let api_key = $state("");
  let validation_status = $state<{
    is_checking: boolean;
    is_valid: boolean | null;
    is_admin: boolean;
    error: string | null;
    user_info: any;
  }>({
    is_checking: false,
    is_valid: null,
    is_admin: false,
    error: null,
    user_info: null,
  });

  const save_api_key = () => {
    if (browser) {
      localStorage.setItem("api-key", api_key);
      check_api_key_validity();
    }
  };

  const check_api_key_validity = async () => {
    if (!api_key.trim()) {
      validation_status = {
        is_checking: false,
        is_valid: null,
        is_admin: false,
        error: null,
        user_info: null,
      };
      return;
    }

    validation_status.is_checking = true;
    validation_status.error = null;

    try {
      const response = await fetch(`${API_BASE}/misc/check-login`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${api_key}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        validation_status = {
          is_checking: false,
          is_valid: true,
          is_admin: data.is_admin,
          error: null,
          user_info: data,
        };
      } else {
        validation_status = {
          is_checking: false,
          is_valid: false,
          is_admin: false,
          error: `${response.statusText} (${response.status})`,
          user_info: null,
        };
      }
    } catch (error: any) {
      validation_status = {
        is_checking: false,
        is_valid: false,
        is_admin: false,
        error: `Network error: ${error.message}`,
        user_info: null,
      };
    }
  };

  $effect(() => {
    if (api_key.length > 0) {
      const timeout_id = setTimeout(() => {
        check_api_key_validity();
      }, 500);

      return () => clearTimeout(timeout_id);
    } else {
      validation_status.is_valid = null;
    }
  });

  onMount(() => {
    if (browser) {
      const stored_key = localStorage.getItem("api-key");
      if (stored_key && stored_key.trim() !== "") {
        api_key = stored_key;
        check_api_key_validity();
      }
    }
  });
</script>

<h2>Login:</h2>
<div>
  <input
    bind:value={api_key}
    placeholder="Insert API key here..."
  />
  <button onclick={save_api_key}>Save</button>

  <span class="status-indicator">
    {#if validation_status.is_checking}
      <span class="status-dot checking"></span>
      <span>Checking...</span>
    {:else if validation_status.is_valid === true}
      <span class="status-dot valid"></span>
      <span>Valid</span>
      {#if validation_status.is_admin}
        <span class="admin-badge">ADMIN</span>
      {/if}
    {:else if validation_status.is_valid === false}
      <span class="status-dot invalid"></span>
      <span>Invalid</span>
    {:else}
      <span class="status-dot neutral"></span>
      <span>Not checked</span>
    {/if}
  </span>
</div>

{#if validation_status.error}
  <div class="error-message">{validation_status.error}</div>
{/if}

{#if validation_status.is_valid && validation_status.user_info}
  <div class="user-info">
    <strong>User Information:</strong><br />
    <strong>User ID:</strong>
    {validation_status.user_info.user_id}<br />
    <strong>Admin:</strong>
    {validation_status.user_info.is_admin ? "Yes" : "No"}<br />
    <strong>Created:</strong>
    {validation_status.user_info.created_at}<br />
    <strong>Last Used:</strong>
    {validation_status.user_info.last_used_at || "Never"}
  </div>
{/if}

<style>
  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
    font-size: 0.9rem;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .valid {
    background-color: #22c55e;
  }
  .invalid {
    background-color: #ef4444;
  }
  .checking {
    background-color: #f59e0b;
    animation: pulse 1s infinite;
  }
  .neutral {
    background-color: #6b7280;
  }

  .admin-badge {
    background-color: #3b82f6;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .user-info {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    background-color: var(--rp-surface);
    width: 300px;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-left: 0.5rem;
  }

  button:hover {
    background-color: #2563eb;
  }
</style>
