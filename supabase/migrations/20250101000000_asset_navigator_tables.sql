-- UUID helper
create extension if not exists "pgcrypto";

-- 1. Project templates (for Studio view)
create table project_templates (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  created_at  timestamptz default now()
);

-- 2. Assets attached to templates
--    'media' is your existing table of files
create table template_assets (
  template_id uuid references project_templates(id) on delete cascade,
  media_id    uuid references media(id)            on delete cascade,
  primary key(template_id, media_id)
);

-- 3. Folders hierarchy (both Studio & Client)
create table folders (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  parent_id   uuid        references folders(id)      on delete cascade,
  client_id   uuid        references clients(id)      on delete cascade,  -- for "Clients" root
  project_id  uuid        references projects(id)     on delete cascade,  -- for client's own Projects
  template_id uuid        references project_templates(id) on delete cascade, -- for Studio Templates
  created_at  timestamptz default now()
);

-- 4. Which media lives in which folder
create table folder_media (
  folder_id uuid references folders(id) on delete cascade,
  media_id  uuid references media(id)   on delete cascade,
  primary key(folder_id, media_id)
);

-- Add indexes for performance
create index idx_folders_parent_id on folders(parent_id);
create index idx_folders_client_id on folders(client_id);
create index idx_folders_project_id on folders(project_id);
create index idx_folders_template_id on folders(template_id);
create index idx_template_assets_template_id on template_assets(template_id);
create index idx_template_assets_media_id on template_assets(media_id);
create index idx_folder_media_folder_id on folder_media(folder_id);
create index idx_folder_media_media_id on folder_media(media_id); 