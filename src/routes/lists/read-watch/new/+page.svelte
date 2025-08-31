<script lang="ts">
  import { goto } from "$app/navigation";
  import { create_book } from "$lib/api/books";
  import { getLocale } from "$lib/paraglide/runtime";
  import type { NewBook, LocalizedString, LocalizedStringArray } from "$lib/types";

  const SUPPORTED_LOCALES = [
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
    { code: "ar", name: "Arabic" },
  ];

  let selected_locales = $state(["en"]);
  let primary_locale = $state(getLocale());

  let form: NewBook = $state({
    title: {} as LocalizedString,
    author: {} as LocalizedString,
    genres: [] as LocalizedStringArray,
    tags: [] as LocalizedStringArray,
    rating: 0,
    status: "",
    description: {} as LocalizedString,
    my_thoughts: {} as LocalizedString,
    links: {},
    cover_image: "",
    explicit: false,
    color: "",
  });

  let title_inputs = $state<Record<string, string>>({ en: "" });
  let author_inputs = $state<Record<string, string>>({ en: "" });
  let description_inputs = $state<Record<string, string>>({ en: "" });
  let thoughts_inputs = $state<Record<string, string>>({ en: "" });
  let genres_inputs = $state<Record<string, string>>({ en: "" });
  let tags_inputs = $state<Record<string, string>>({ en: "" });

  let is_submitting = $state(false);
  let errors = $state({
    title: "",
    author: "",
    rating: "",
    status: "",
    description: "",
    cover_image: "",
    general: "",
  });

  let links_input = $state("");

  const status_options = ["Reading", "Completed", "On Hold", "Dropped", "Plan to Read"];

  const add_locale = () => {
    const available_locales = SUPPORTED_LOCALES.filter(
      (locale) => !selected_locales.includes(locale.code),
    );

    if (available_locales.length > 0) {
      const new_locale = available_locales[0].code;
      selected_locales = [...selected_locales, new_locale];

      title_inputs[new_locale] = "";
      author_inputs[new_locale] = "";
      description_inputs[new_locale] = "";
      thoughts_inputs[new_locale] = "";
      genres_inputs[new_locale] = "";
      tags_inputs[new_locale] = "";
    }
  };

  const remove_locale = (locale: string) => {
    if (selected_locales.length > 1 && locale !== primary_locale) {
      selected_locales = selected_locales.filter((l) => l !== locale);

      delete title_inputs[locale];
      delete author_inputs[locale];
      delete description_inputs[locale];
      delete thoughts_inputs[locale];
      delete genres_inputs[locale];
      delete tags_inputs[locale];
    }
  };

  const change_locale = (old_locale: string, new_locale: string) => {
    if (selected_locales.includes(new_locale)) return;

    const index = selected_locales.indexOf(old_locale);
    selected_locales[index] = new_locale;

    title_inputs[new_locale] = title_inputs[old_locale] || "";
    author_inputs[new_locale] = author_inputs[old_locale] || "";
    description_inputs[new_locale] = description_inputs[old_locale] || "";
    thoughts_inputs[new_locale] = thoughts_inputs[old_locale] || "";
    genres_inputs[new_locale] = genres_inputs[old_locale] || "";
    tags_inputs[new_locale] = tags_inputs[old_locale] || "";

    if (old_locale !== new_locale) {
      delete title_inputs[old_locale];
      delete author_inputs[old_locale];
      delete description_inputs[old_locale];
      delete thoughts_inputs[old_locale];
      delete genres_inputs[old_locale];
      delete tags_inputs[old_locale];
    }

    if (old_locale === primary_locale) {
      primary_locale = new_locale as any;
    }
  };

  const validate_form = (): boolean => {
    errors = {
      title: "",
      author: "",
      rating: "",
      status: "",
      description: "",
      cover_image: "",
      general: "",
    };

    let is_valid = true;

    if (!title_inputs[primary_locale]?.trim()) {
      errors.title = `Title is required in ${primary_locale}`;
      is_valid = false;
    }

    if (!author_inputs[primary_locale]?.trim()) {
      errors.author = `Author is required in ${primary_locale}`;
      is_valid = false;
    }

    if (!description_inputs[primary_locale]?.trim()) {
      errors.description = `Description is required in ${primary_locale}`;
      is_valid = false;
    }

    if (!form.rating || form.rating < 1 || form.rating > 10) {
      errors.rating = "Rating is required and must be between 1-10";
      is_valid = false;
    }

    if (!form.status) {
      errors.status = "Status is required";
      is_valid = false;
    }

    if (!form.cover_image.trim()) {
      errors.cover_image = "Cover image URL is required";
      is_valid = false;
    }

    return is_valid;
  };

  const reset_form = () => {
    selected_locales = ["en"];
    primary_locale = "en";

    title_inputs = { en: "" };
    author_inputs = { en: "" };
    description_inputs = { en: "" };
    thoughts_inputs = { en: "" };
    genres_inputs = { en: "" };
    tags_inputs = { en: "" };

    form = {
      title: {},
      author: {},
      genres: [],
      tags: [],
      rating: 0,
      status: "",
      description: {},
      my_thoughts: {},
      links: {},
      cover_image: "",
      explicit: false,
      color: "",
    };

    links_input = "";
    errors = {
      title: "",
      author: "",
      rating: "",
      status: "",
      description: "",
      cover_image: "",
      general: "",
    };
  };

  const parse_array_input = (input: string): string[] => {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const parse_links_input = (input: string): Record<string, string> => {
    const links: Record<string, string> = {};
    const pairs = input
      .split(",")
      .map((pair) => pair.trim())
      .filter((pair) => pair.length > 0);

    for (const pair of pairs) {
      const [key, value] = pair.split(":").map((item) => item.trim());
      if (key && value) {
        links[key] = value;
      }
    }

    return links;
  };

  const build_localized_string = (inputs: Record<string, string>): LocalizedString => {
    const filled_inputs = Object.entries(inputs)
      .filter(([_, value]) => value.trim())
      .reduce(
        (acc, [locale, value]) => {
          acc[locale] = value.trim();
          return acc;
        },
        {} as Record<string, string>,
      );

    if (Object.keys(filled_inputs).length === 1 && filled_inputs[primary_locale]) {
      return filled_inputs[primary_locale];
    }

    return filled_inputs as LocalizedString;
  };

  const build_localized_array = (inputs: Record<string, string>): LocalizedStringArray => {
    const has_localized_content = Object.entries(inputs).some(
      ([locale, value]) => locale !== primary_locale && value.trim(),
    );

    if (!has_localized_content && inputs[primary_locale]) {
      return parse_array_input(inputs[primary_locale]);
    }

    const result: LocalizedString[] = [];
    const all_items = new Set<string>();

    Object.values(inputs).forEach((input) => {
      if (input.trim()) {
        parse_array_input(input).forEach((item) => all_items.add(item));
      }
    });

    Array.from(all_items).forEach((item) => {
      const localized_item: Record<string, string> = {};
      let has_translations = false;

      Object.entries(inputs).forEach(([locale, input]) => {
        const items = parse_array_input(input);
        const matching_item = items.find((i) => i.toLowerCase() === item.toLowerCase());
        if (matching_item) {
          localized_item[locale] = matching_item;
          if (locale !== primary_locale) has_translations = true;
        }
      });

      if (has_translations || Object.keys(localized_item).length > 1) {
        result.push(localized_item as LocalizedString);
      } else {
        result.push(localized_item[primary_locale] || item);
      }
    });

    return result;
  };

  const handle_create_book = async () => {
    form.title = build_localized_string(title_inputs);
    form.author = build_localized_string(author_inputs);
    form.description = build_localized_string(description_inputs);
    form.my_thoughts = build_localized_string(thoughts_inputs);
    form.genres = build_localized_array(genres_inputs);
    form.tags = build_localized_array(tags_inputs);
    form.links = parse_links_input(links_input);

    if (!validate_form()) {
      return;
    }

    is_submitting = true;
    errors.general = "";

    try {
      const book_data = {
        ...form,
        cover_image: form.cover_image.trim(),
        rating: form.rating!,
        color: form.color || undefined,
      };

      const createdBook = await create_book(book_data);
      console.log("Book created successfully!");
      goto(`/lists/read-watch/${createdBook._id.$oid}`);
    } catch (err) {
      console.error(err);
      errors.general = `${err}`;
    } finally {
      is_submitting = false;
    }
  };

  const handle_submit = (event: Event) => {
    event.preventDefault();
    handle_create_book();
  };

  const get_locale_name = (code: string) => {
    return SUPPORTED_LOCALES.find((l) => l.code === code)?.name || code;
  };

  const available_locale_options = (current_locale: string) => {
    return SUPPORTED_LOCALES.filter(
      (locale) => !selected_locales.includes(locale.code) || locale.code === current_locale,
    );
  };
</script>

<svelte:head>
  <title>Create a New Book</title>
</svelte:head>

<div
  class="container"
  style="border-color: {form.color || '#FF00BB'}"
>
  <header class="page-header">
    <h1>Create New Book</h1>
  </header>

  <form
    onsubmit={handle_submit}
    class="book-form"
  >
    {#if errors.general}
      <div
        class="error-banner"
        role="alert"
      >
        {errors.general}
      </div>
    {/if}

    <!-- Locale Management -->
    <div class="locale-management">
      <div class="locale-header">
        <h3>Languages</h3>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          onclick={add_locale}
          disabled={selected_locales.length >= SUPPORTED_LOCALES.length || is_submitting}
        >
          Add Language
        </button>
      </div>

      <div class="primary-locale">
        <label for="primary-locale">Primary Language:</label>
        <select
          id="primary-locale"
          bind:value={primary_locale}
          disabled={is_submitting}
        >
          {#each selected_locales as locale}
            <option value={locale}>{get_locale_name(locale)}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Localized Title -->
    <div class="field-group localized-field">
      <label class="field-label required">
        Title
        <span class="required-asterisk">*</span>
      </label>

      {#each selected_locales as locale}
        <div class="locale-input-group">
          <div class="locale-selector">
            <select
              bind:value={selected_locales[selected_locales.indexOf(locale)]}
              onchange={(e) => change_locale(locale, e.currentTarget.value)}
              disabled={is_submitting}
            >
              {#each available_locale_options(locale) as option}
                <option value={option.code}>{option.name}</option>
              {/each}
            </select>

            {#if selected_locales.length > 1 && locale !== primary_locale}
              <button
                type="button"
                class="remove-locale-btn"
                onclick={() => remove_locale(locale)}
                disabled={is_submitting}
                title="Remove this language"
              >
                ✕
              </button>
            {/if}
          </div>

          <input
            type="text"
            bind:value={title_inputs[locale]}
            placeholder={`Enter title in ${get_locale_name(locale)}`}
            required={locale === primary_locale}
            disabled={is_submitting}
            class:error={errors.title && locale === primary_locale}
          />
        </div>
      {/each}

      {#if errors.title}
        <span
          class="error-message"
          role="alert">{errors.title}</span
        >
      {/if}
    </div>

    <!-- Localized Author -->
    <div class="field-group localized-field">
      <label class="field-label required">
        Author
        <span class="required-asterisk">*</span>
      </label>

      {#each selected_locales as locale}
        <div class="locale-input-group">
          <div class="locale-indicator">
            {get_locale_name(locale)}
            {#if locale === primary_locale}<span class="primary-badge">Primary</span>{/if}
          </div>

          <input
            type="text"
            bind:value={author_inputs[locale]}
            placeholder={`Enter author in ${get_locale_name(locale)}`}
            required={locale === primary_locale}
            disabled={is_submitting}
            class:error={errors.author && locale === primary_locale}
          />
        </div>
      {/each}

      {#if errors.author}
        <span
          class="error-message"
          role="alert">{errors.author}</span
        >
      {/if}
    </div>

    <!-- Localized Description -->
    <div class="field-group localized-field">
      <label class="field-label required">
        Description
        <span class="required-asterisk">*</span>
      </label>

      {#each selected_locales as locale}
        <div class="locale-input-group">
          <div class="locale-indicator">
            {get_locale_name(locale)}
            {#if locale === primary_locale}<span class="primary-badge">Primary</span>{/if}
          </div>

          <textarea
            bind:value={description_inputs[locale]}
            placeholder={`Describe the book in ${get_locale_name(locale)}`}
            required={locale === primary_locale}
            disabled={is_submitting}
            class:error={errors.description && locale === primary_locale}
            rows="4"
          ></textarea>
        </div>
      {/each}

      {#if errors.description}
        <span
          class="error-message"
          role="alert">{errors.description}</span
        >
      {/if}
    </div>

    <!-- Localized My Thoughts -->
    <div class="field-group localized-field">
      <label class="field-label">My Thoughts</label>

      {#each selected_locales as locale}
        <div class="locale-input-group">
          <div class="locale-indicator">
            {get_locale_name(locale)}
            {#if locale === primary_locale}<span class="primary-badge">Primary</span>{/if}
          </div>

          <textarea
            bind:value={thoughts_inputs[locale]}
            placeholder={`Share your thoughts in ${get_locale_name(locale)} (optional)`}
            disabled={is_submitting}
            rows="4"
          ></textarea>
        </div>
      {/each}
    </div>

    <!-- Localized Genres -->
    <div class="field-group localized-field">
      <label class="field-label">
        Genres
        <span class="helper-text">(comma-separated)</span>
      </label>

      {#each selected_locales as locale}
        <div class="locale-input-group">
          <div class="locale-indicator">
            {get_locale_name(locale)}
            {#if locale === primary_locale}<span class="primary-badge">Primary</span>{/if}
          </div>

          <input
            type="text"
            bind:value={genres_inputs[locale]}
            placeholder={`Fantasy, Adventure, Romance (in ${get_locale_name(locale)})`}
            disabled={is_submitting}
          />
        </div>
      {/each}
    </div>

    <!-- Localized Tags -->
    <div class="field-group localized-field">
      <label class="field-label">
        Tags
        <span class="helper-text">(comma-separated)</span>
      </label>

      {#each selected_locales as locale}
        <div class="locale-input-group">
          <div class="locale-indicator">
            {get_locale_name(locale)}
            {#if locale === primary_locale}<span class="primary-badge">Primary</span>{/if}
          </div>

          <input
            type="text"
            bind:value={tags_inputs[locale]}
            placeholder={`Magic, Dragons, Epic (in ${get_locale_name(locale)})`}
            disabled={is_submitting}
          />
        </div>
      {/each}
    </div>

    <!-- Non-localized fields -->
    <div class="field-group">
      <label
        for="rating"
        class="required"
      >
        Rating
        <span class="required-asterisk">*</span>
      </label>
      <input
        id="rating"
        type="number"
        bind:value={form.rating}
        placeholder="Rate from 1-10"
        required
        min="1"
        max="10"
        disabled={is_submitting}
        class:error={errors.rating}
      />
      {#if errors.rating}
        <span
          class="error-message"
          role="alert">{errors.rating}</span
        >
      {/if}
    </div>

    <div class="field-group">
      <label
        for="status"
        class="required"
      >
        Status
        <span class="required-asterisk">*</span>
      </label>
      <select
        id="status"
        bind:value={form.status}
        required
        disabled={is_submitting}
        class:error={errors.status}
      >
        <option value="">Select status</option>
        {#each status_options as status}
          <option value={status}>{status}</option>
        {/each}
      </select>
      {#if errors.status}
        <span
          class="error-message"
          role="alert">{errors.status}</span
        >
      {/if}
    </div>

    <div class="field-group">
      <label
        for="cover_image"
        class="required"
      >
        Cover Image URL
        <span class="required-asterisk">*</span>
      </label>
      <input
        id="cover_image"
        type="url"
        bind:value={form.cover_image}
        placeholder="Enter cover image URL"
        required
        disabled={is_submitting}
        class:error={errors.cover_image}
      />
      {#if errors.cover_image}
        <span
          class="error-message"
          role="alert">{errors.cover_image}</span
        >
      {/if}
    </div>

    <div class="field-group">
      <label for="color">Theme Color</label>
      <input
        id="color"
        type="color"
        bind:value={form.color}
        disabled={is_submitting}
      />
    </div>

    <div class="field-group">
      <label for="links">
        Links
        <span class="helper-text">(format: name:url, name:url)</span>
      </label>
      <input
        id="links"
        type="text"
        bind:value={links_input}
        placeholder="Goodreads:https://goodreads.com/book/123, Amazon:https://amazon.com/book/456"
        disabled={is_submitting}
      />
    </div>

    <div class="field-group">
      <div class="checkbox-group">
        <label
          for="explicit"
          class="checkbox-label"
        >
          <input
            id="explicit"
            type="checkbox"
            bind:checked={form.explicit}
            disabled={is_submitting}
          />
          <span></span>
          Explicit content
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        onclick={reset_form}
        disabled={is_submitting}
      >
        Reset
      </button>

      <button
        type="submit"
        class="btn btn-primary"
        disabled={is_submitting}
      >
        {is_submitting ? "Creating..." : "Create Book"}
      </button>
    </div>
  </form>
</div>

<style>
  .container {
    background-color: var(--rp-surface);
    color: var(--rp-text);
    padding: 2rem;
    padding-bottom: 5rem;
    border: 4px solid var(--rp-gold);
    border-radius: 12px;
  }

  .locale-management {
    background: var(--rp-surface-variant, rgba(255, 255, 255, 0.05));
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid var(--rp-outline, rgba(255, 255, 255, 0.1));
  }

  .locale-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .locale-header h3 {
    margin: 0;
    color: var(--rp-primary, #ff00bb);
  }

  .primary-locale {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .localized-field {
    border: 1px solid var(--rp-outline, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    padding: 1.5rem;
    background: var(--rp-surface-variant, rgba(255, 255, 255, 0.02));
  }

  .field-label {
    display: block;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--rp-on-surface, #fff);
  }

  .locale-input-group {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .locale-input-group:last-child {
    margin-bottom: 0;
  }

  .locale-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 160px;
  }

  .locale-selector select {
    flex: 1;
  }

  .remove-locale-btn {
    background: var(--rp-error, #ff4444);
    color: white;
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s;
  }

  .remove-locale-btn:hover {
    background: var(--rp-error-dark, #cc0000);
  }

  .locale-indicator {
    min-width: 120px;
    font-size: 0.9rem;
    color: var(--rp-on-surface-variant, rgba(255, 255, 255, 0.7));
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .primary-badge {
    background: var(--rp-primary, #ff00bb);
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .locale-input-group input,
  .locale-input-group textarea {
    flex: 1;
  }

  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .required-asterisk {
    color: var(--rp-error, #ff4444);
  }

  .helper-text {
    color: var(--rp-on-surface-variant, rgba(255, 255, 255, 0.6));
    font-weight: normal;
    font-size: 0.9rem;
  }

  .error-message {
    color: var(--rp-error, #ff4444);
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: block;
  }

  .error {
    border-color: var(--rp-error, #ff4444) !important;
  }
</style>
