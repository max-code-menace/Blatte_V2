
-- ============================================================
-- Blatte V2 — Row Level Security
-- ============================================================

-- ------------------------------------------------------------
-- Helper : récupère l'entrepreneur_id du user connecté
-- ------------------------------------------------------------
create or replace function public.current_entrepreneur_id()
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select id from public.entrepreneurs where profile_id = auth.uid()
$$;

-- ============================================================
-- PROFILES
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Pas d'insert manuel : le trigger handle_new_user s'en occupe
-- Pas de delete : suppression via auth.users cascade

-- ============================================================
-- ENTREPRENEURS
-- ============================================================
alter table public.entrepreneurs enable row level security;

create policy "entrepreneurs_select_own"
  on public.entrepreneurs for select
  using (profile_id = auth.uid());

create policy "entrepreneurs_insert_own"
  on public.entrepreneurs for insert
  with check (profile_id = auth.uid());

create policy "entrepreneurs_update_own"
  on public.entrepreneurs for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Pas de delete : on archive plutôt qu'on supprime

-- ============================================================
-- CHANTIERS
-- ============================================================
alter table public.chantiers enable row level security;

create policy "chantiers_select_own"
  on public.chantiers for select
  using (entrepreneur_id = public.current_entrepreneur_id());

create policy "chantiers_insert_own"
  on public.chantiers for insert
  with check (entrepreneur_id = public.current_entrepreneur_id());

create policy "chantiers_update_own"
  on public.chantiers for update
  using (entrepreneur_id = public.current_entrepreneur_id())
  with check (entrepreneur_id = public.current_entrepreneur_id());

create policy "chantiers_delete_own"
  on public.chantiers for delete
  using (entrepreneur_id = public.current_entrepreneur_id());

-- ============================================================
-- PRODUITS — catalogue public en lecture
-- ============================================================
alter table public.produits enable row level security;

create policy "produits_select_all_authenticated"
  on public.produits for select
  to authenticated
  using (actif = true);

-- Pas d'insert/update/delete depuis l'app : on remplit côté admin via service_role

-- ============================================================
-- COMMANDES
-- ============================================================
alter table public.commandes enable row level security;

create policy "commandes_select_own"
  on public.commandes for select
  using (entrepreneur_id = public.current_entrepreneur_id());

create policy "commandes_insert_own"
  on public.commandes for insert
  with check (entrepreneur_id = public.current_entrepreneur_id());

create policy "commandes_update_own_brouillon"
  on public.commandes for update
  using (
    entrepreneur_id = public.current_entrepreneur_id()
    and statut = 'brouillon'
  )
  with check (entrepreneur_id = public.current_entrepreneur_id());

-- Pas de delete : on annule via statut

-- ============================================================
-- COMMANDE_ITEMS
-- ============================================================
alter table public.commande_items enable row level security;

create policy "commande_items_select_own"
  on public.commande_items for select
  using (
    exists (
      select 1 from public.commandes c
      where c.id = commande_id
        and c.entrepreneur_id = public.current_entrepreneur_id()
    )
  );

create policy "commande_items_insert_own_brouillon"
  on public.commande_items for insert
  with check (
    exists (
      select 1 from public.commandes c
      where c.id = commande_id
        and c.entrepreneur_id = public.current_entrepreneur_id()
        and c.statut = 'brouillon'
    )
  );

create policy "commande_items_update_own_brouillon"
  on public.commande_items for update
  using (
    exists (
      select 1 from public.commandes c
      where c.id = commande_id
        and c.entrepreneur_id = public.current_entrepreneur_id()
        and c.statut = 'brouillon'
    )
  );

create policy "commande_items_delete_own_brouillon"
  on public.commande_items for delete
  using (
    exists (
      select 1 from public.commandes c
      where c.id = commande_id
        and c.entrepreneur_id = public.current_entrepreneur_id()
        and c.statut = 'brouillon'
    )
  );