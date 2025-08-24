<script lang="ts">
    import { goto } from "$app/navigation";
    import { create_book } from "$lib/api/books";
    import type { NewBook } from "$lib/types";

    let form: NewBook = $state({
        title: "",
        author: "",
        genres: [],
        tags: [],
        rating: 0,
        status: "",
        description: "",
        my_thoughts: "",
        links: {},
        cover_image: "",
        explicit: false,
        color: "",
    });

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

    let genres_input = $state("");
    let tags_input = $state("");
    let links_input = $state("");

    const status_options = ["Reading", "Completed", "On Hold", "Dropped", "Plan to Read"];

    const form_cfg = [
        {
            key: "title" as keyof typeof form,
            label: "Title",
            type: "text",
            required: true,
            placeholder: "Enter book title",
        },
        {
            key: "author" as keyof typeof form,
            label: "Author",
            type: "text",
            required: true,
            placeholder: "Enter author name",
        },
        {
            key: "description" as keyof typeof form,
            label: "Description",
            type: "textarea",
            required: true,
            placeholder: "Describe the book",
        },
        {
            key: "my_thoughts" as keyof typeof form,
            label: "My Thoughts",
            type: "textarea",
            required: false,
            placeholder: "Share your thoughts (optional)",
        },
        {
            key: "rating" as keyof typeof form,
            label: "Rating",
            type: "number",
            required: true,
            min: 1,
            max: 5,
            placeholder: "Rate from 1-5",
        },
        {
            key: "cover_image" as keyof typeof form,
            label: "Cover Image URL",
            type: "url",
            required: true,
            placeholder: "Enter cover image URL",
        },
        {
            key: "color" as keyof typeof form,
            label: "Theme Color",
            type: "color",
            required: false,
            placeholder: "#000000",
        },
    ];

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

        if (!form.title.trim()) {
            errors.title = "Title is required";
            is_valid = false;
        }

        if (!form.author.trim()) {
            errors.author = "Author is required";
            is_valid = false;
        }

        if (!form.description.trim()) {
            errors.description = "Description is required";
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
        form = {
            title: "",
            author: "",
            genres: [],
            tags: [],
            rating: 0,
            status: "",
            description: "",
            my_thoughts: "",
            links: {},
            cover_image: "",
            explicit: false,
            color: "",
        };
        genres_input = "";
        tags_input = "";
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

    const handle_create_book = async () => {
        form.genres = parse_array_input(genres_input);
        form.tags = parse_array_input(tags_input);
        form.links = parse_links_input(links_input);

        if (!validate_form()) {
            return;
        }

        is_submitting = true;
        errors.general = "";

        try {
            const book_data = {
                ...form,
                title: form.title.trim(),
                author: form.author.trim(),
                description: form.description.trim(),
                my_thoughts: form.my_thoughts.trim() || "",
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
</script>

<svelte:head>
    <title>Create a New Book</title>
</svelte:head>

<div class="container">
    <header class="page-header">
        <h1>Create New Book</h1>
        <p>Add a new book to your collection</p>
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

        {#each form_cfg as config}
            <div class="field-group">
                <label
                    for={config.key}
                    class:required={config.required}
                >
                    {config.label}
                    {#if config.required}
                        <span class="required-asterisk">*</span>
                    {/if}
                </label>

                {#if config.type === "textarea"}
                    <textarea
                        id={config.key}
                        bind:value={form[config.key]}
                        placeholder={config.placeholder}
                        required={config.required}
                        disabled={is_submitting}
                        class:error={errors[config.key as keyof typeof errors]}
                        rows="4"
                    ></textarea>
                {:else}
                    <input
                        id={config.key}
                        type={config.type}
                        bind:value={form[config.key]}
                        placeholder={config.placeholder}
                        required={config.required}
                        min={config.min}
                        max={config.max}
                        disabled={is_submitting}
                        class:error={errors[config.key as keyof typeof errors]}
                    />
                {/if}

                {#if errors[config.key as keyof typeof errors]}
                    <span
                        class="error-message"
                        role="alert"
                    >
                        {errors[config.key as keyof typeof errors]}
                    </span>
                {/if}
            </div>
        {/each}

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
                    role="alert"
                >
                    {errors.status}
                </span>
            {/if}
        </div>

        <div class="field-group">
            <label for="genres">
                Genres
                <span class="helper-text">(comma-separated)</span>
            </label>
            <input
                id="genres"
                type="text"
                bind:value={genres_input}
                placeholder="Fantasy, Adventure, Romance"
                disabled={is_submitting}
            />
        </div>

        <div class="field-group">
            <label for="tags">
                Tags
                <span class="helper-text">(comma-separated)</span>
            </label>
            <input
                id="tags"
                type="text"
                bind:value={tags_input}
                placeholder="Magic, Dragons, Epic"
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
                <input
                    id="explicit"
                    type="checkbox"
                    bind:checked={form.explicit}
                    disabled={is_submitting}
                />
                <label
                    for="explicit"
                    class="checkbox-label"
                >
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