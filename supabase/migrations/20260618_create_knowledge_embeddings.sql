create extension if not exists vector;

create table if not exists knowledge_embeddings (
  id uuid primary key default gen_random_uuid(),
  chunk_id text not null unique,
  source text not null default 'consensus',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_embeddings_source_idx
on knowledge_embeddings (source);

create index if not exists knowledge_embeddings_metadata_idx
on knowledge_embeddings
using gin (metadata);

create index if not exists knowledge_embeddings_embedding_idx
on knowledge_embeddings
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
