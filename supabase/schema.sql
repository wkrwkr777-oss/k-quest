-- 💎 K-Quest Grand Master Schema
-- Phase 1 ~ Phase 5 모든 기능을 지원하는 통합 스키마

-- 1. Users & Profiles (사용자 및 프로필)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('user', 'expert', 'admin')) default 'user',
  is_verified boolean default false,
  verification_level text check (verification_level in ('none', 'basic', 'id', 'video')) default 'none',
  tier text check (tier in ('bronze', 'silver', 'gold', 'platinum')) default 'bronze',
  bio text,
  languages text[],
  skills text[],
  rating float default 0,
  review_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Quests (퀘스트 시스템)
create table public.quests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  category text not null,
  location text,
  budget_min int,
  budget_max int,
  currency text default 'USD',
  status text check (status in ('open', 'in_progress', 'completed', 'cancelled', 'dispute')) default 'open',
  images text[],
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Proposals (견적 및 매칭)
create table public.proposals (
  id uuid default uuid_generate_v4() primary key,
  quest_id uuid references public.quests(id) not null,
  expert_id uuid references public.profiles(id) not null,
  price int not null,
  currency text default 'USD',
  message text,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  estimated_days int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Payments & Escrow (결제 시스템)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  quest_id uuid references public.quests(id) not null,
  payer_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  amount int not null,
  currency text default 'USD',
  provider text check (provider in ('stripe', 'paypal', 'crypto')),
  status text check (status in ('pending', 'held_in_escrow', 'released', 'refunded')) default 'pending',
  transaction_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Reviews (리뷰 및 평가)
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  quest_id uuid references public.quests(id) not null,
  reviewer_id uuid references public.profiles(id) not null,
  target_id uuid references public.profiles(id) not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Chat Messages (채팅 시스템)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  quest_id uuid references public.quests(id),
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  type text check (type in ('text', 'image', 'system')) default 'text',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Notifications (알림)
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  message text not null,
  type text check (type in ('info', 'success', 'warning', 'error', 'premium')),
  is_read boolean default false,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Policies
alter table public.profiles enable row level security;
alter table public.quests enable row level security;
alter table public.proposals enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Basic Policies (누구나 읽기 가능, 본인만 수정 가능)
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Quests are viewable by everyone." on public.quests for select using (true);
create policy "Authenticated users can create quests." on public.quests for insert with check (auth.role() = 'authenticated');
create policy "Users can update own quests." on public.quests for update using (auth.uid() = user_id);
