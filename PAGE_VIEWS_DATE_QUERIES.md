# Page Views Date Query Guide

This guide shows you how to query page views by date using both the API endpoint and direct SQL queries.

## API Endpoint: `/api/page-views`

### Query Parameters

- `date` - Filter by specific date (format: `YYYY-MM-DD`)
- `start_date` - Start of date range (format: `YYYY-MM-DD`)
- `end_date` - End of date range (format: `YYYY-MM-DD`)
- `days` - Last N days (e.g., `7`, `30`)
- `limit` - Number of results to return (default: 20)

### Examples

**Get views for a specific date:**
```
https://wheeleat-xp5.pages.dev/api/page-views?date=2025-01-15
```

**Get views for a date range:**
```
https://wheeleat-xp5.pages.dev/api/page-views?start_date=2025-01-01&end_date=2025-01-31
```

**Get views for last 7 days:**
```
https://wheeleat-xp5.pages.dev/api/page-views?days=7
```

**Get views for last 30 days with custom limit:**
```
https://wheeleat-xp5.pages.dev/api/page-views?days=30&limit=50
```

## Direct SQL Queries (D1 Database)

### Query by Specific Date

```sql
-- Get all page views for January 15, 2025
SELECT 
  *,
  datetime(timestamp, 'unixepoch') as date_time
FROM page_views
WHERE DATE(datetime(timestamp, 'unixepoch')) = '2025-01-15'
ORDER BY timestamp DESC;
```

### Query by Date Range

```sql
-- Get page views between two dates
SELECT 
  *,
  datetime(timestamp, 'unixepoch') as date_time
FROM page_views
WHERE timestamp >= strftime('%s', '2025-01-01T00:00:00Z')
  AND timestamp <= strftime('%s', '2025-01-31T23:59:59Z')
ORDER BY timestamp DESC;
```

### Query Last N Days

```sql
-- Get page views from last 7 days
SELECT 
  *,
  datetime(timestamp, 'unixepoch') as date_time
FROM page_views
WHERE timestamp > strftime('%s', 'now', '-7 days')
ORDER BY timestamp DESC;
```

### Daily Summary by Date

```sql
-- Get daily page view counts for a specific date range
SELECT 
  DATE(datetime(timestamp, 'unixepoch')) as date,
  COUNT(*) as views,
  COUNT(DISTINCT COALESCE(user_id, user_agent)) as unique_visitors
FROM page_views
WHERE timestamp >= strftime('%s', '2025-01-01T00:00:00Z')
  AND timestamp <= strftime('%s', '2025-01-31T23:59:59Z')
GROUP BY date
ORDER BY date DESC;
```

### Today's Views

```sql
-- Get all page views from today
SELECT 
  *,
  datetime(timestamp, 'unixepoch') as date_time
FROM page_views
WHERE DATE(datetime(timestamp, 'unixepoch')) = DATE('now')
ORDER BY timestamp DESC;
```

### This Week's Views

```sql
-- Get page views from this week (last 7 days)
SELECT 
  DATE(datetime(timestamp, 'unixepoch')) as date,
  COUNT(*) as views
FROM page_views
WHERE timestamp > strftime('%s', 'now', '-7 days')
GROUP BY date
ORDER BY date DESC;
```

### This Month's Views

```sql
-- Get page views from this month
SELECT 
  DATE(datetime(timestamp, 'unixepoch')) as date,
  COUNT(*) as views
FROM page_views
WHERE timestamp >= strftime('%s', 'now', 'start of month')
GROUP BY date
ORDER BY date DESC;
```

### Views by Hour (for a specific date)

```sql
-- Get hourly breakdown for a specific date
SELECT 
  strftime('%H:00', datetime(timestamp, 'unixepoch')) as hour,
  COUNT(*) as views
FROM page_views
WHERE DATE(datetime(timestamp, 'unixepoch')) = '2025-01-15'
GROUP BY hour
ORDER BY hour;
```

### Most Active Dates

```sql
-- Get dates with most page views (top 10)
SELECT 
  DATE(datetime(timestamp, 'unixepoch')) as date,
  COUNT(*) as views,
  COUNT(DISTINCT COALESCE(user_id, user_agent)) as unique_visitors
FROM page_views
GROUP BY date
ORDER BY views DESC
LIMIT 10;
```

### Views by Path for a Specific Date

```sql
-- Get page views by path for a specific date
SELECT 
  path,
  COUNT(*) as views
FROM page_views
WHERE DATE(datetime(timestamp, 'unixepoch')) = '2025-01-15'
GROUP BY path
ORDER BY views DESC;
```

## Response Format

The API returns JSON with the following structure:

```json
{
  "success": true,
  "filters": {
    "date": "2025-01-15",
    "start_date": null,
    "end_date": null,
    "days": null
  },
  "summary": {
    "total_views": 150,
    "unique_visitors": 45,
    "average_views_per_visitor": "3.33"
  },
  "statistics": {
    "views_by_path": [
      { "path": "/", "count": 120 },
      { "path": "/leaderboard", "count": 30 }
    ],
    "daily_views": [
      { "date": "2025-01-15", "count": 150 }
    ],
    "recent_views": [
      {
        "id": "...",
        "path": "/",
        "user_id": "...",
        "timestamp": 1736985600,
        "created_at": 1736985600,
        "date_time": "2025-01-15 12:00:00"
      }
    ]
  }
}
```

## Tips

1. **Unix Timestamps**: The `timestamp` column stores Unix timestamps (seconds since epoch)
2. **Date Conversion**: Use `datetime(timestamp, 'unixepoch')` to convert to readable date/time
3. **Date Extraction**: Use `DATE(datetime(timestamp, 'unixepoch'))` to get just the date part
4. **Time Zones**: All timestamps are stored in UTC. Adjust for your timezone if needed.
5. **Performance**: Queries with date filters are faster when you have an index on `timestamp` (which should already exist)

