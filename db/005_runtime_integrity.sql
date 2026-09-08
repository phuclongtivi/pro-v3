create table if not exists long_action_receipts (
  receipt_id uuid primary key,
  invocation_id text unique not null,
  action_id text not null,
  executor text not null,
  adapter text not null,
  status text not null check (status in ('success','failed','gated')),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists long_action_receipts_action_created_idx on long_action_receipts(action_id,created_at desc);

create table if not exists long_event_activity (
  id uuid primary key,
  event_id uuid not null references long_events(id) on delete cascade,
  activity_type text not null,
  activity_ref text,
  state text not null default 'active',
  priority integer not null default 0,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists long_event_activity_current_idx on long_event_activity(event_id,state,priority desc,starts_at desc);

create table if not exists long_evolution_metrics (
  id uuid primary key,
  generation text not null,
  action_id text not null,
  result_code text not null,
  success boolean not null,
  latency_ms integer,
  cost_class text,
  anonymous_context jsonb not null default '{}'::jsonb,
  consent_scope text not null,
  created_at timestamptz not null default now()
);
create table if not exists long_evolution_candidates (
  id uuid primary key,
  generation text not null,
  candidate_type text not null,
  proposal jsonb not null,
  risk text not null,
  decision text not null default 'pending',
  policy_version text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create table if not exists long_scene_resources (
  id uuid primary key,
  source_url text not null,
  provider text not null,
  media_type text not null,
  license text not null,
  attribution text,
  cost numeric not null default 0,
  evidence jsonb not null,
  checked_at timestamptz not null,
  policy_version text not null,
  status text not null default 'candidate'
);
