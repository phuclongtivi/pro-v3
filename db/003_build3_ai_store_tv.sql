create table if not exists long_ai_jobs (
  id uuid primary key,
  event_id uuid references long_events(id) on delete cascade,
  owner_user_id text not null,
  job_type text not null,
  status text not null default 'draft',
  requires_approval boolean not null default true,
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists long_ai_jobs_event_idx
  on long_ai_jobs(event_id, created_at desc);

create table if not exists long_notifications (
  id uuid primary key,
  user_id text not null,
  event_id uuid references long_events(id) on delete cascade,
  category text not null,
  title text not null,
  body text,
  action_url text,
  requires_confirmation boolean not null default false,
  status text not null default 'unread',
  created_at timestamptz not null default now()
);

create index if not exists long_notifications_user_idx
  on long_notifications(user_id, created_at desc);

create table if not exists long_products (
  id uuid primary key,
  owner_user_id text not null,
  store_name text not null default 'Long Store',
  title text not null,
  description text,
  price numeric(18,2) not null default 0,
  currency text not null default 'VND',
  status text not null default 'draft',
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists long_inventory (
  product_id uuid primary key references long_products(id) on delete cascade,
  sku text unique,
  quantity integer not null default 0,
  reserved integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint long_inventory_nonnegative check (quantity >= 0 and reserved >= 0)
);

create table if not exists long_orders (
  id uuid primary key,
  buyer_user_id text not null,
  seller_user_id text not null,
  product_id uuid not null references long_products(id),
  quantity integer not null default 1,
  unit_price numeric(18,2) not null,
  currency text not null default 'VND',
  side_status text not null default 'created',
  payment_status text not null default 'unpaid',
  fulfillment_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists long_orders_buyer_idx on long_orders(buyer_user_id, created_at desc);
create index if not exists long_orders_seller_idx on long_orders(seller_user_id, created_at desc);

create table if not exists long_tv_sessions (
  code text primary key,
  event_id uuid references long_events(id) on delete set null,
  status text not null default 'waiting',
  controller_id text,
  controller_token text not null,
  tv_id text,
  tv_token text,
  capabilities jsonb,
  command jsonb,
  command_seq bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null
);
