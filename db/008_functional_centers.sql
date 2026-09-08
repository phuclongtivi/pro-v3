alter table long_events add column if not exists has_gift boolean not null default false;
alter table long_events add column if not exists has_ticket boolean not null default false;
alter table long_products add column if not exists category text not null default 'uncategorized';
alter table long_products add column if not exists featured boolean not null default false;
alter table long_products add column if not exists priority_score integer not null default 0;

create index if not exists long_events_experience_filter_idx on long_events(status,has_gift,has_ticket,starts_at);
create index if not exists long_products_catalog_filter_idx on long_products(status,category,featured,priority_score desc,created_at desc);

create table if not exists long_ai_configs (
  user_id uuid not null references long_users(id) on delete cascade,
  agent_id text not null,
  config jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key(user_id,agent_id)
);

create table if not exists long_mixer_configs (
  user_id uuid not null references long_users(id) on delete cascade,
  name text not null,
  device_id text,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(user_id,name)
);
