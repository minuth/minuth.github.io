# Managing SigNoz Storage: How to Fix the 200GB "System" Database Mystery

If you are running SigNoz and suddenly notice your disk space disappearing, you are not alone. Many users find that while their application logs and traces are small, the internal ClickHouse `system` database has grown to hundreds of gigabytes.

This guide explains why this happens and how to reclaim your storage in minutes.

---

## The Story: A Deceptive Storage Issue

Imagine you are carefully monitoring your SigNoz instance and everything looks healthy. Your application logs, traces, and metrics are all being collected and only consuming a modest **1GB** of space. However, you suddenly receive a disk space alert and discover that your server is nearly out of storage.

Upon investigation, you find a giant lurking in the background: the ClickHouse `system` database has ballooned to over **190GB**. 

This scenario is exactly why understanding ClickHouse's internal telemetry is critical for anyone managing a SigNoz instance. It is the story of how internal "diary" entries can overwhelm your actual application data.

---

## 1. The Mystery: Why is the `system` database so large?

ClickHouse (the engine behind SigNoz) is a high-performance database that records its own internal telemetry. By default, it "diaries" every query, every background task, and every CPU stack trace. 

In a high-traffic environment, these internal logs can consume **99% of your storage** if they don't have a retention policy. The main culprits are:
*   **`system.trace_log`**: Records stack traces for profiling (often the largest).
*   **`system.query_log`**: Records the history of every SQL query executed.
*   **`system.processors_profile_log`**: Stores internal processing data.

**The good news:** You don't need years of this data. For most users, keeping just **1 to 3 days** of internal logs is more than enough for troubleshooting.

---

## 2. Step 1: Diagnosis

First, confirm which database is consuming the most space. You can check all databases or specifically your SigNoz data databases.

### A. Check Storage across all Databases
```sql
SELECT
    database,
    ((sum(bytes_on_disk) / 1024) / 1024) / 1024 AS size_gb
FROM system.parts
GROUP BY database
ORDER BY size_gb DESC
```

### B. Check specifically for SigNoz Data Databases
```sql
SELECT
    database,
    ((sum(bytes_on_disk) / 1024) / 1024) / 1024 AS size_gb
FROM system.parts
WHERE database IN ('signoz_logs', 'signoz_metrics', 'signoz_traces')
GROUP BY database
```

### C. Identify the Culprit Tables in the `system` Database
Once you confirm `system` is the largest, identify exactly which tables within it are eating your space:
```sql
SELECT
    `table`,
    formatReadableSize(sum(data_compressed_bytes)) AS compressed_size,
    formatReadableSize(sum(data_uncompressed_bytes)) AS uncompressed_size,
    round(sum(data_uncompressed_bytes) / sum(data_compressed_bytes), 2) AS compression_ratio,
    sum(rows) AS total_rows,
    count() AS part_count
FROM system.parts
WHERE (database = 'system') AND (active = 1)
GROUP BY `table`
ORDER BY sum(data_compressed_bytes) DESC
```

---

## 3. Step 2: Immediate Recovery (The Wipe)

If your disk is critically full, you can instantly wipe these internal logs. ClickHouse has a safety limit that prevents dropping tables larger than 50GB, so we use a special setting to bypass it.

**Run these commands to immediately free up space:**
```sql
TRUNCATE TABLE system.trace_log;
TRUNCATE TABLE system.query_log;
TRUNCATE TABLE system.processors_profile_log;
TRUNCATE TABLE system.part_log;
TRUNCATE TABLE system.metric_log;
```
*Note: This only deletes internal database logs. Your application traces, logs, and metrics remain untouched. If you get an error saying the table is too large to drop, add the safety override like this:*
```sql
TRUNCATE TABLE system.trace_log SETTINGS max_table_size_to_drop = 0;
```

---

## 4. Step 3: Permanent Prevention (TTL)

To prevent the storage from filling up again, you must set a **TTL (Time To Live)**. This tells ClickHouse to automatically delete data older than X days.

**Apply a 1-day retention policy to internal logs:**
```sql
ALTER TABLE system.trace_log MODIFY TTL event_date + INTERVAL 1 DAY;
ALTER TABLE system.query_log MODIFY TTL event_date + INTERVAL 1 DAY;
ALTER TABLE system.processors_profile_log MODIFY TTL event_date + INTERVAL 1 DAY;
ALTER TABLE system.part_log MODIFY TTL event_date + INTERVAL 1 DAY;
ALTER TABLE system.metric_log MODIFY TTL event_date + INTERVAL 1 DAY;
```

---

## 5. Step 4: Verification

After running the cleanup commands, verify that the space has been recovered by re-running the database size query. You should see the `system` database at a much lower size (likely under 1GB).

```sql
SELECT
    database,
    ((sum(bytes_on_disk) / 1024) / 1024) / 1024 AS size_gb
FROM system.parts
GROUP BY database
ORDER BY size_gb DESC
```

---

## 6. Troubleshooting SigNoz Retention Issues

"I updated my retention policy in the SigNoz UI, but old data is still appearing in my queries."

SigNoz manages retention by applying TTLs to ClickHouse. If it's not working, use these queries to troubleshoot:

### A. Check the actual table TTL configuration
```sql
SELECT name, engine_full FROM system.tables WHERE database = 'signoz_logs'
```

### B. Verify the actual range of logs stored
```sql
SELECT
    min(timestamp) as oldest_log,
    max(timestamp) as newest_log,
    count() as total_rows
FROM signoz_logs.logs
```

### C. Manual Fix
If the UI failed to update the table, you can apply the retention manually:
```sql
ALTER TABLE signoz_logs.logs MODIFY TTL toDateTime(timestamp) + INTERVAL 7 DAY;
```

---

## Conclusion

Managing SigNoz storage is mostly about managing the ClickHouse "diary." By setting a strict TTL on the `system` database, you can keep your monitoring stack lean, fast, and stable without sacrificing any visibility into your application.
