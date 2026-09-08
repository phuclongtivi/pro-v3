create table if not exists long_users (
  id uuid primary key,
  display_name text not null,
  email text,
  picture_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists long_oauth_accounts (
  provider text not null,
  provider_user_id text not null,
  user_id uuid not null references long_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now(),
  primary key(provider, provider_user_id)
);

create index if not exists long_oauth_accounts_user_idx on long_oauth_accounts(user_id);
create unique index if not exists long_users_email_unique_idx on long_users(lower(email)) where email is not null;
