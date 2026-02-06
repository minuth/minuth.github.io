# Safety Database Migration Rules

## Never "Rename" or "Delete" in one step

**Unsafe Example:**

```sql
ALTER TABLE users RENAME COLUMN name TO full_name;
```

### Safe Migration Steps

To rename or delete a column safely, follow these incremental steps:

1.  **Safe Step 1:** Add the new column `full_name`. (Old code still uses `name`).
2.  **Safe Step 2:** Deploy code that writes to _both_ columns but reads from the _old_ one (`name`).
3.  **Safe Step 3:** Migrate (Backfill) data from the old column `name` to the new column `full_name`.
4.  **Safe Step 4:** Deploy code that reads from the _new_ one (`full_name`).
5.  **Safe Step 5:** (Weeks later) Delete the `name` column.
