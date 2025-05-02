# Supabase Setup & Row Level Security (RLS) for Blogs

## Table Schema

The `blogs` table should have the following columns:

- `id` (integer, primary key)
- `author` (text)
- `content` (jsonb)

All blog details (title, slug, content, etc.) are stored inside the `content` JSONB column. The `author` column stores the author's identifier (e.g., user id or username).

## Row Level Security (RLS)

Supabase/Postgres RLS allows you to control which users can read or write rows in your tables. **RLS must be enabled for your table.**

### Enabling RLS

In the Supabase dashboard, go to the `blogs` table and enable RLS.

### Writing Policies

- For **SELECT, UPDATE, DELETE**: use `USING (expression)`
- For **INSERT**: use `WITH CHECK (expression)` (**not** `USING`)

#### Example: Allow All Inserts (Development Only)

```sql
CREATE POLICY "Allow all inserts" ON blogs
FOR INSERT
WITH CHECK (true);
```

#### Example: Allow Only Authenticated Users to Insert

```sql
CREATE POLICY "Allow authenticated insert" ON blogs
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

#### Example: Allow Only the Author to Insert Their Own Blog

If your `author` column is the user's UID:

```sql
CREATE POLICY "Allow author insert" ON blogs
FOR INSERT
WITH CHECK (author = auth.uid());
```

### Common Errors & Troubleshooting

- **"only WITH CHECK expression allowed for INSERT"**
  - For INSERT policies, always use `WITH CHECK`, not `USING`.
- **"violates row-level security policy"**
  - Your policy does not allow the current user to insert/update/delete. Adjust your policy as needed.
- **"Could not find the 'authorId' column"**
  - Your table must use `author`, not `authorId`. Store all other blog fields in the `content` JSONB column.

### Example Insert Payload

When inserting a blog, use this structure:

```json
{
  "author": "user-1",
  "content": {
    "title": "Blog Title",
    "slug": "blog-title",
    "content": "Blog content..."
    // ...other fields
  }
}
```

### Example Update Query

```sql
UPDATE blogs
SET author = 'user-1',
    content = '{"title": "New Title", "body": "New Content"}'::jsonb
WHERE id = 123;
```

---

## Summary

- Use `WITH CHECK` for INSERT RLS policies.
- Store all blog details in the `content` JSONB column.
- Use the `author` column for the author's identifier.
- Adjust RLS policies for your security needs.

For more, see the [Supabase RLS documentation](https://supabase.com/docs/guides/auth/row-level-security).
