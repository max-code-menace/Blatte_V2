-- ============================================================
-- Blatte V2 — Schéma initial
-- ============================================================
-- Tables : profiles, entrepreneurs, chantiers, produits,
-- commandes, commande_items
-- Pas de drivers, pas de suppliers (table), pas de paiements.
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES — extension de auth.users
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text not null,
  nom text not null,
  telephone text,
  role text not null default 'entrepreneur' check (role in ('entrepreneur', 'admin')),
  langue text not null default 'fr' check (langue in ('fr', 'nl', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. ENTREPRENEURS — données entreprise
-- ------------------------------------------------------------
create table public.entrepreneurs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  raison_sociale text not null,
  numero_tva text not null,
  adresse_facturation_rue text,
  adresse_facturation_numero text,
  adresse_facturation_code_postal text,
  adresse_facturation_ville text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_entrepreneurs_profile_id on public.entrepreneurs(profile_id);

-- ------------------------------------------------------------
-- 3. CHANTIERS — adresses de livraison
-- ------------------------------------------------------------
create table public.chantiers (
  id uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid not null references public.entrepreneurs(id) on delete cascade,
  nom text not null,
  rue text not null,
  numero text not null,
  code_postal text not null,
  ville text not null,
  commune text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  google_place_id text,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_chantiers_entrepreneur_id on public.chantiers(entrepreneur_id);
create index idx_chantiers_actif on public.chantiers(actif);

-- ------------------------------------------------------------
-- 4. PRODUITS — catalogue (rempli plus tard depuis Moens)
-- ------------------------------------------------------------
create table public.produits (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  nom_fr text not null,
  nom_nl text,
  description_fr text,
  description_nl text,
  categorie text not null,
  sous_categorie text,
  unite text not null,
  prix_ht numeric(10, 2) not null check (prix_ht >= 0),
  tva_pct numeric(5, 2) not null default 21.00,
  poids_kg numeric(10, 3),
  image_url text,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_produits_categorie on public.produits(categorie);
create index idx_produits_actif on public.produits(actif);

-- ------------------------------------------------------------
-- 5. COMMANDES
-- ------------------------------------------------------------
create table public.commandes (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  entrepreneur_id uuid not null references public.entrepreneurs(id) on delete restrict,
  chantier_id uuid not null references public.chantiers(id) on delete restrict,
  mode_livraison text not null check (mode_livraison in ('express', 'planifie')),
  creneau_debut timestamptz,
  creneau_fin timestamptz,
  statut text not null default 'brouillon' check (statut in (
    'brouillon',
    'en_attente_fournisseur',
    'confirmee_fournisseur',
    'livree',
    'annulee'
  )),
  total_ht numeric(10, 2) not null default 0,
  total_ttc numeric(10, 2) not null default 0,
  frais_livraison_ht numeric(10, 2) not null default 0,
  notes_entrepreneur text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_commandes_entrepreneur_id on public.commandes(entrepreneur_id);
create index idx_commandes_chantier_id on public.commandes(chantier_id);
create index idx_commandes_statut on public.commandes(statut);
create index idx_commandes_created_at on public.commandes(created_at desc);

-- ------------------------------------------------------------
-- 6. COMMANDE_ITEMS
-- ------------------------------------------------------------
create table public.commande_items (
  id uuid primary key default gen_random_uuid(),
  commande_id uuid not null references public.commandes(id) on delete cascade,
  produit_id uuid not null references public.produits(id) on delete restrict,
  quantite numeric(10, 2) not null check (quantite > 0),
  prix_ht_unitaire numeric(10, 2) not null check (prix_ht_unitaire >= 0),
  tva_pct numeric(5, 2) not null,
  total_ht numeric(10, 2) generated always as (quantite * prix_ht_unitaire) stored,
  created_at timestamptz not null default now()
);

create index idx_commande_items_commande_id on public.commande_items(commande_id);
create index idx_commande_items_produit_id on public.commande_items(produit_id);

-- ------------------------------------------------------------
-- 7. TRIGGER : updated_at automatique
-- ------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

create trigger trg_entrepreneurs_updated_at
  before update on public.entrepreneurs
  for each row execute function public.tg_set_updated_at();

create trigger trg_chantiers_updated_at
  before update on public.chantiers
  for each row execute function public.tg_set_updated_at();

create trigger trg_produits_updated_at
  before update on public.produits
  for each row execute function public.tg_set_updated_at();

create trigger trg_commandes_updated_at
  before update on public.commandes
  for each row execute function public.tg_set_updated_at();

-- ------------------------------------------------------------
-- 8. TRIGGER : créer un profile auto à l'inscription
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, prenom, nom, telephone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'prenom', ''),
    coalesce(new.raw_user_meta_data->>'nom', ''),
    new.raw_user_meta_data->>'telephone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();