# LinkedIn Post Generator Database Schema Documentation

## Overview

This document describes the database schema enhancements for the LinkedIn post generator, including all tables, relationships, and data flow from the UI to the database.

## Database Relationships Map

```
auth.users
  ├── profiles (1:1) - User details
  │
  ├── brands (1:many) - Website details
  │   ├── content_items (1:many) - Posts
  │   │   ├── media_assets (1:many) - Images/Videos
  │   │   ├── carousel_slides (1:many) - Carousel content
  │   │   └── content_schedules (1:many) - Publishing schedule
  │   │       └── connections (via platform) - LinkedIn auth for auto-posting
  │   │
  │   └── connections (1:many) - Platform integrations
  │       └── linkedin_oauth_tokens (1:1) - LinkedIn OAuth credentials
  │
  └── media_assets (1:many) - User's media library
```

## Table Descriptions

### 1. Enhanced `content_items` Table

**Purpose**: Stores all generated content including LinkedIn posts.

**New Fields Added**:
- `post_type` (TEXT): The selected post type (e.g., 'thought-leadership', 'authority', 'storytelling')
- `topic` (TEXT): The post topic/idea entered by the user
- `context_details` (TEXT): Optional context, audience, tone, goal
- `post_type_id` (TEXT): Reference to the post type selection

**Existing Fields** (relevant to LinkedIn posts):
- `id`: Primary key
- `user_id`: Foreign key to auth.users
- `brand_id`: Foreign key to brands
- `type`: Content type ('linkedin_post', 'newsletter', etc.)
- `platform`: Platform ('linkedin', 'email', etc.)
- `body`: The actual post content
- `status`: Content status ('generated', 'edited', 'scheduled', 'published', 'failed')
- `metadata`: JSONB for additional platform-specific data

**Relationships**:
- Belongs to: `brands`, `auth.users`
- Has many: `media_assets`, `carousel_slides`, `content_schedules`

### 2. `media_assets` Table

**Purpose**: Stores all media files (images, videos) with references to Supabase Storage.

**Key Fields**:
- `id`: Primary key
- `user_id`: Foreign key to auth.users
- `brand_id`: Foreign key to brands
- `content_id`: Foreign key to content_items (nullable - can be suggested but not attached)
- `asset_type`: Type of asset ('image' or 'video')
- `storage_bucket`: Supabase Storage bucket name (default: 'media-assets')
- `storage_path`: Path to file in Supabase Storage bucket
- `file_name`: Original file name
- `file_size`: File size in bytes
- `mime_type`: MIME type of the file
- `thumbnail_path`: Path to thumbnail in storage (for videos)
- `label`: Human-readable label (e.g., 'Brand Aesthetic', 'Data Visualization')
- `is_suggested`: Boolean - AI suggested but not yet attached
- `is_attached`: Boolean - Actually attached to a post
- `order_index`: Order for multiple media items
- `metadata`: JSONB for additional metadata

**Storage Structure**:
```
media-assets/
  {user_id}/
    {brand_id}/
      {content_id?}/
        {filename}
```

**Relationships**:
- Belongs to: `auth.users`, `brands`
- Optional: `content_items` (when attached)
- Referenced by: `carousel_slides`

### 3. `carousel_slides` Table

**Purpose**: Stores individual slides for carousel posts.

**Key Fields**:
- `id`: Primary key
- `content_id`: Foreign key to content_items (required)
- `slide_number`: Sequential slide number
- `title`: Slide title
- `body`: Slide body text
- `media_asset_id`: Foreign key to media_assets (optional)
- `storage_path`: Direct path to media if not using media_assets
- `media_type`: Type of media ('image' or 'video')
- `order_index`: Order of slide in carousel (unique per content_id)
- `metadata`: JSONB for additional slide metadata

**Constraints**:
- `unique_content_slide_order`: Ensures no duplicate order_index per content_id

**Relationships**:
- Belongs to: `content_items` (required)
- Optional: `media_assets`

### 4. `linkedin_oauth_tokens` Table

**Purpose**: Stores encrypted LinkedIn OAuth tokens for automatic posting.

**Key Fields**:
- `id`: Primary key
- `connection_id`: Foreign key to connections (unique - one token per connection)
- `user_id`: Foreign key to auth.users
- `brand_id`: Foreign key to brands
- `access_token_encrypted`: Encrypted access token (using pgcrypto)
- `refresh_token_encrypted`: Encrypted refresh token
- `token_expires_at`: When the access token expires
- `refresh_token_expires_at`: When the refresh token expires
- `oauth_scopes`: Array of granted OAuth scopes
- `linkedin_user_id`: LinkedIn user/company URN
- `linkedin_profile_url`: LinkedIn profile URL
- `profile_name`: Display name from LinkedIn
- `profile_picture_url`: Profile picture URL
- `company_page_id`: Company page ID if posting as company
- `company_page_name`: Company page name
- `last_token_refresh_at`: Last time token was refreshed

**Security**:
- Tokens are encrypted using pgcrypto
- RLS ensures users can only access their own tokens
- Tokens are automatically deleted when connection is removed (CASCADE)

**Relationships**:
- Belongs to: `connections` (1:1), `auth.users`, `brands`

### 5. `post_type_catalog` Table

**Purpose**: Reference table for available post types.

**Key Fields**:
- `id`: Primary key (text, e.g., 'thought-leadership')
- `title`: Display title
- `description`: Description of the post type
- `icon_name`: Icon identifier for UI
- `color_gradient`: Tailwind CSS gradient classes
- `is_active`: Whether this post type is currently available

**Default Post Types**:
- thought-leadership
- authority
- storytelling
- value-tips
- case-study
- announcement
- event
- trending
- carousel

**Relationships**:
- Referenced by: `content_items.post_type_id`

## Data Flow Mapping

### Step 1: Website Details → `brands` table

**UI Input**: User enters website name and URL in LinkedInPostGenerator Step 1

**Database Action**:
```sql
INSERT INTO brands (user_id, name, website_url)
VALUES (auth.uid(), 'Acme Inc.', 'https://acme.com');
```

**Fields Mapped**:
- `name` → brands.name
- `url` → brands.website_url

### Step 2: User Details → `profiles` table

**UI Input**: User is authenticated

**Database Action**: 
- Already handled via auth trigger (handle_new_user)
- Profile created automatically on signup

### Step 3: Type of Post → `content_items.post_type`

**UI Input**: User selects post type in LinkedInPostGenerator Step 2

**Database Action**:
```sql
-- When creating content_item
INSERT INTO content_items (..., post_type, post_type_id)
VALUES (..., 'thought-leadership', 'thought-leadership');
```

**Fields Mapped**:
- Selected post type ID → content_items.post_type
- Selected post type ID → content_items.post_type_id

### Step 4: About Post Topic → `content_items`

**UI Input**: User enters topic and optional context in LinkedInPostGenerator Step 3

**Database Action**:
```sql
UPDATE content_items
SET topic = 'Why most startups fail at brand visibility',
    context_details = 'Target audience: founders, tone: professional, goal: educate'
WHERE id = content_id;
```

**Fields Mapped**:
- Topic → content_items.topic
- Context/details → content_items.context_details

### Step 5-7: Images/Videos/Carousel → `media_assets` + `carousel_slides`

#### Suggested Media (Step 4 - Suggested Assets)

**UI Input**: AI suggests images/videos (displayed but not yet attached)

**Database Action**:
```sql
-- Upload file to Supabase Storage first, then:
INSERT INTO media_assets (
  user_id, brand_id, asset_type, storage_path, 
  file_name, label, is_suggested, is_attached
)
VALUES (
  auth.uid(), brand_id, 'image', 
  '{user_id}/{brand_id}/suggested/image1.jpg',
  'image1.jpg', 'Brand Aesthetic', true, false
);
```

**Fields Mapped**:
- File → Uploaded to Supabase Storage
- Storage path → media_assets.storage_path
- Label → media_assets.label
- `is_suggested=true`, `is_attached=false`, `content_id=NULL`

#### Attached Media

**UI Input**: User selects suggested media or uploads new media

**Database Action**:
```sql
-- Update existing suggested media
UPDATE media_assets
SET content_id = content_id,
    is_attached = true,
    is_suggested = false
WHERE id = media_asset_id;

-- OR create new attached media
INSERT INTO media_assets (
  user_id, brand_id, content_id, asset_type,
  storage_path, file_name, is_attached
)
VALUES (...);
```

**Fields Mapped**:
- Selected media → media_assets.is_attached=true
- Linked to → media_assets.content_id

#### Carousel Slides

**UI Input**: User creates carousel with multiple slides

**Database Action**:
```sql
INSERT INTO carousel_slides (
  content_id, slide_number, title, body,
  media_asset_id, order_index
)
VALUES 
  (content_id, 1, 'Slide 1 Title', 'Slide 1 Body', asset_id_1, 0),
  (content_id, 2, 'Slide 2 Title', 'Slide 2 Body', asset_id_2, 1),
  ...;
```

**Fields Mapped**:
- Each slide → carousel_slides row
- Slide order → carousel_slides.order_index
- Media reference → carousel_slides.media_asset_id

### Step 8-9: Published/Scheduled → `content_schedules` + `content_items.status` + `linkedin_oauth_tokens`

#### LinkedIn Connection Setup

**UI Input**: User connects LinkedIn account in PublishModal

**Database Action**:
```sql
-- 1. Create or update connection
INSERT INTO connections (user_id, brand_id, platform, status)
VALUES (auth.uid(), brand_id, 'linkedin', 'connected')
ON CONFLICT (brand_id, platform) DO UPDATE SET status = 'connected';

-- 2. Store encrypted OAuth tokens
INSERT INTO linkedin_oauth_tokens (
  connection_id, user_id, brand_id,
  access_token_encrypted, refresh_token_encrypted,
  token_expires_at, oauth_scopes, linkedin_user_id
)
VALUES (
  connection_id, auth.uid(), brand_id,
  encrypt_token(access_token), encrypt_token(refresh_token),
  expires_at, ARRAY['w_member_social'], linkedin_user_id
);
```

**Fields Mapped**:
- OAuth tokens → linkedin_oauth_tokens (encrypted)
- Connection → connections table
- Profile info → linkedin_oauth_tokens (profile_name, etc.)

#### Publishing Now

**UI Input**: User clicks "Publish Now" in PublishModal

**Database Action**:
```sql
-- 1. Update content status
UPDATE content_items
SET status = 'published'
WHERE id = content_id;

-- 2. Create schedule record (for tracking)
INSERT INTO content_schedules (
  content_id, user_id, brand_id, platform,
  scheduled_at, status, published_at
)
VALUES (
  content_id, auth.uid(), brand_id, 'linkedin',
  now(), 'published', now()
);

-- 3. Background job uses linkedin_oauth_tokens to post via LinkedIn API
-- 4. Update schedule with external_post_id after successful post
UPDATE content_schedules
SET external_post_id = linkedin_post_id
WHERE id = schedule_id;
```

**Fields Mapped**:
- Publish action → content_items.status='published'
- Schedule → content_schedules (with published_at)
- LinkedIn post ID → content_schedules.external_post_id

#### Scheduling for Later

**UI Input**: User selects date/time in PublishModal

**Database Action**:
```sql
-- 1. Update content status
UPDATE content_items
SET status = 'scheduled'
WHERE id = content_id;

-- 2. Create schedule record
INSERT INTO content_schedules (
  content_id, user_id, brand_id, platform,
  scheduled_at, timezone, status, ai_recommended
)
VALUES (
  content_id, auth.uid(), brand_id, 'linkedin',
  '2024-11-21 09:12:00+00', 'UTC', 'scheduled', true
);

-- 3. Background job checks content_schedules at scheduled_at time
-- 4. Uses linkedin_oauth_tokens to post via LinkedIn API
-- 5. Updates status to 'published' after successful post
```

**Fields Mapped**:
- Scheduled date/time → content_schedules.scheduled_at
- Content status → content_items.status='scheduled'
- Schedule status → content_schedules.status='scheduled'

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Foreign key relationships are respected
- Tokens are never exposed to unauthorized users

### Token Encryption

LinkedIn OAuth tokens are encrypted using pgcrypto:
- `encrypt_token()` function encrypts tokens before storage
- `decrypt_token()` function decrypts tokens for API use
- **Note**: In production, use Supabase Vault or a proper key management service

### Storage Bucket Policies

Supabase Storage bucket `media-assets` should have policies:
- Users can upload to their own folder: `{user_id}/**`
- Users can read their own files
- Users cannot access other users' files

## Indexes for Performance

### Content Items
- `idx_content_items_post_type`: Fast lookup by post type
- `idx_content_items_user_id`: Fast user content queries
- `idx_content_items_brand_id`: Fast brand content queries
- `idx_content_items_status`: Fast status filtering

### Media Assets
- `idx_media_assets_content_id`: Fast content media queries
- `idx_media_assets_user_id`: Fast user media queries
- `idx_media_assets_is_attached`: Fast attached media queries

### Carousel Slides
- `idx_carousel_slides_content_id`: Fast content carousel queries
- `idx_carousel_slides_order_index`: Fast ordered slide queries

### LinkedIn OAuth Tokens
- `idx_linkedin_oauth_tokens_connection_id`: Fast connection token lookup
- `idx_linkedin_oauth_tokens_expires_at`: Fast token expiration queries (for cleanup)

## Background Jobs

### Scheduled Post Publisher

**Purpose**: Publish scheduled posts at their scheduled time

**Process**:
1. Query `content_schedules` where `status='scheduled'` and `scheduled_at <= now()`
2. For each schedule:
   - Get `linkedin_oauth_tokens` for the connection
   - Decrypt access token
   - Check if token is expired, refresh if needed
   - Post content to LinkedIn API
   - Update `content_schedules.status='published'`
   - Update `content_items.status='published'`
   - Store `external_post_id` from LinkedIn

### Token Refresh Service

**Purpose**: Automatically refresh expired LinkedIn tokens

**Process**:
1. Query `linkedin_oauth_tokens` where `token_expires_at <= now() + 1 hour`
2. For each token:
   - Use refresh token to get new access token
   - Update `access_token_encrypted`, `token_expires_at`, `last_token_refresh_at`
   - If refresh fails, mark connection as 'error'

## Example Queries

### Get all LinkedIn posts for a user
```sql
SELECT ci.*, pt.title as post_type_title
FROM content_items ci
LEFT JOIN post_type_catalog pt ON ci.post_type_id = pt.id
WHERE ci.user_id = auth.uid()
  AND ci.type = 'linkedin_post'
ORDER BY ci.created_at DESC;
```

### Get post with all media assets
```sql
SELECT 
  ci.*,
  json_agg(ma.*) as media_assets
FROM content_items ci
LEFT JOIN media_assets ma ON ma.content_id = ci.id AND ma.is_attached = true
WHERE ci.id = content_id
GROUP BY ci.id;
```

### Get carousel with all slides
```sql
SELECT 
  ci.*,
  json_agg(
    json_build_object(
      'id', cs.id,
      'slide_number', cs.slide_number,
      'title', cs.title,
      'body', cs.body,
      'media_asset', ma.*
    ) ORDER BY cs.order_index
  ) as slides
FROM content_items ci
LEFT JOIN carousel_slides cs ON cs.content_id = ci.id
LEFT JOIN media_assets ma ON ma.id = cs.media_asset_id
WHERE ci.id = content_id
GROUP BY ci.id;
```

### Get valid LinkedIn token for posting
```sql
SELECT 
  lot.*,
  decrypt_token(lot.access_token_encrypted) as access_token
FROM linkedin_oauth_tokens lot
JOIN connections c ON c.id = lot.connection_id
WHERE lot.user_id = auth.uid()
  AND lot.brand_id = brand_id
  AND lot.token_expires_at > now()
  AND c.status = 'connected'
LIMIT 1;
```


