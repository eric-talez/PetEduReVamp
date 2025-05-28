-- 기관 정보 테이블
CREATE TABLE institutes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    description TEXT,
    logo TEXT,
    is_active BOOLEAN DEFAULT true,
    business_number TEXT,
    capacity INTEGER DEFAULT 50,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    avatar TEXT,
    bio TEXT,
    location TEXT,
    specialty TEXT,
    is_verified BOOLEAN DEFAULT false,
    institute_id INTEGER REFERENCES institutes(id) ON DELETE SET NULL,
    ci TEXT UNIQUE,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    verification_name TEXT,
    verification_birth TEXT,
    verification_phone TEXT,
    provider TEXT,
    social_id TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    membership_tier TEXT,
    membership_expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 반려동물 정보 테이블
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER NOT NULL,
    weight INTEGER,
    gender TEXT,
    description TEXT,
    avatar TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    health TEXT,
    temperament TEXT,
    allergies TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 훈련 세션 테이블
CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    trainer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    skill TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    level TEXT NOT NULL,
    session_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER,
    notes TEXT,
    score INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 강의/코스 테이블
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    duration INTEGER,
    price INTEGER DEFAULT 0,
    trainer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    institute_id INTEGER REFERENCES institutes(id) ON DELETE SET NULL,
    is_popular BOOLEAN DEFAULT false,
    is_certified BOOLEAN DEFAULT false,
    max_participants INTEGER DEFAULT 10,
    syllabus JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 강의 등록 테이블
CREATE TABLE course_enrollments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    progress INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active'
);

-- 이벤트 관련 테이블
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    location TEXT,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    price INTEGER DEFAULT 0,
    image_url TEXT,
    organizer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude TEXT,
    longitude TEXT,
    capacity INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_attendances (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    attended_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 쇼핑 관련 테이블
CREATE TABLE shop_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    discount_price INTEGER,
    category_id INTEGER REFERENCES shop_categories(id) ON DELETE SET NULL,
    images JSONB,
    tags JSONB,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    rating INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    options JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_courses_trainer_id ON courses(trainer_id);
CREATE INDEX idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_products_category_id ON products(category_id);