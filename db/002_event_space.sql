create table if not exists long_events (
  id uuid primary key,
  public_token text unique not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'published',
  visibility text not null default 'public',
  creator_id text not null,
  chat_enabled boolean not null default true,
  pre_event_chat_enabled boolean not null default false,
  delete_chat_at timestamptz generated always as (ends_at + interval '36 hours') stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists long_event_roles (
  event_id uuid not null references long_events(id) on delete cascade,
  user_id text not null,
  role text not null,
  invited_by text,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id, role)
);

create table if not exists long_event_members (
  event_id uuid not null references long_events(id) on delete cascade,
  member_id text not null,
  account_id text,
  display_name text not null,
  member_type text not null default 'guest',
  role text not null default 'audience',
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (event_id, member_id)
);

create table if not exists long_event_messages (
  id uuid primary key,
  event_id uuid not null references long_events(id) on delete cascade,
  member_id text not null,
  display_name text not null,
  role text not null default 'audience',
  kind text not null default 'text',
  body text,
  attachment_url text,
  attachment_name text,
  attachment_size integer,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists long_event_messages_event_created_idx
  on long_event_messages(event_id, created_at desc);

create index if not exists long_event_members_presence_idx
  on long_event_members(event_id, last_seen_at desc);
