create table if not exists long_devices (
  id uuid primary key,
  owner_user_id text,
  device_type text not null default 'tv',
  name text not null default 'Long TV',
  public_id text unique not null,
  device_secret_hash text not null,
  trusted boolean not null default false,
  capabilities jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists long_device_pair_tokens (
  token text primary key,
  device_id uuid not null references long_devices(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists long_device_pair_tokens_expiry_idx
  on long_device_pair_tokens(expires_at);

create table if not exists long_cast_assets (
  id uuid primary key,
  owner_user_id text not null,
  blob_url text not null,
  filename text,
  content_type text,
  size_bytes bigint not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
