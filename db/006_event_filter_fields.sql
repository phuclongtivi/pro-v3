alter table long_events add column if not exists event_type text not null default 'community';
alter table long_events add column if not exists event_format text not null default 'offline';
alter table long_events add column if not exists timezone text not null default 'Asia/Ho_Chi_Minh';
alter table long_events add column if not exists location text;

create index if not exists long_events_filter_idx
  on long_events(event_type, event_format, visibility, status, starts_at);
