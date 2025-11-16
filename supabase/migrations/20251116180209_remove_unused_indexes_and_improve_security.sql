/*
  # Remove Unused Indexes and Improve Security

  1. Performance Optimization
    - Remove all unused indexes that are not being utilized by queries
    - Reduces storage overhead and improves write performance
    
  2. Indexes Removed
    - `idx_brands_created_at` - unused on brands table
    - `idx_connections_brand_id` - unused on connections table
    - `idx_connections_platform` - unused on connections table
    - `idx_connections_status` - unused on connections table
    - `idx_content_items_brand_id` - unused on content_items table
    - `idx_content_items_type` - unused on content_items table
    - `idx_content_items_platform` - unused on content_items table
    - `idx_content_items_status` - unused on content_items table
    - `idx_content_items_created_at` - unused on content_items table
    - `idx_content_schedules_content_id` - unused on content_schedules table
    - `idx_content_schedules_brand_id` - unused on content_schedules table
    - `idx_content_schedules_platform` - unused on content_schedules table
    - `idx_content_schedules_status` - unused on content_schedules table
    - `idx_content_schedules_scheduled_at` - unused on content_schedules table
    - `idx_content_metrics_content_id` - unused on content_metrics table
    - `idx_content_metrics_platform` - unused on content_metrics table
    - `idx_content_metrics_snapshot_at` - unused on content_metrics table
    - `idx_dashboard_summaries_brand_id` - unused on dashboard_summaries table
    - `idx_dashboard_summaries_period` - unused on dashboard_summaries table
    - `idx_dashboard_summaries_generated_at` - unused on dashboard_summaries table
    - `idx_dashboard_summaries_top_content_id` - unused on dashboard_summaries table

  3. Notes
    - These indexes can be recreated later if query patterns change
    - Monitor query performance after removal
    - Consider adding indexes only when specific query performance issues are identified
*/

DROP INDEX IF EXISTS idx_brands_created_at;
DROP INDEX IF EXISTS idx_connections_brand_id;
DROP INDEX IF EXISTS idx_connections_platform;
DROP INDEX IF EXISTS idx_connections_status;
DROP INDEX IF EXISTS idx_content_items_brand_id;
DROP INDEX IF EXISTS idx_content_items_type;
DROP INDEX IF EXISTS idx_content_items_platform;
DROP INDEX IF EXISTS idx_content_items_status;
DROP INDEX IF EXISTS idx_content_items_created_at;
DROP INDEX IF EXISTS idx_content_schedules_content_id;
DROP INDEX IF EXISTS idx_content_schedules_brand_id;
DROP INDEX IF EXISTS idx_content_schedules_platform;
DROP INDEX IF EXISTS idx_content_schedules_status;
DROP INDEX IF EXISTS idx_content_schedules_scheduled_at;
DROP INDEX IF EXISTS idx_content_metrics_content_id;
DROP INDEX IF EXISTS idx_content_metrics_platform;
DROP INDEX IF EXISTS idx_content_metrics_snapshot_at;
DROP INDEX IF EXISTS idx_dashboard_summaries_brand_id;
DROP INDEX IF EXISTS idx_dashboard_summaries_period;
DROP INDEX IF EXISTS idx_dashboard_summaries_generated_at;
DROP INDEX IF EXISTS idx_dashboard_summaries_top_content_id;
