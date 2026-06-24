alter table knowledge_embeddings
add column if not exists source_id text;

alter table knowledge_embeddings
add column if not exists content_hash text;

alter table knowledge_embeddings
add column if not exists embedding_model text;

alter table knowledge_embeddings
add column if not exists dimensions integer;

alter table knowledge_embeddings
add column if not exists status text default 'pending';

create index if not exists knowledge_embeddings_status_idx
on knowledge_embeddings(status);

create index if not exists knowledge_embeddings_source_id_idx
on knowledge_embeddings(source_id);
