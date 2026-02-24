// 创建数据库表结构

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Creating database tables...');

    // 创建categories表
    await supabase
      .from('categories')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') { // Table doesn't exist
          console.log('Creating categories table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE categories (
                  id TEXT PRIMARY KEY,
                  name JSONB NOT NULL,
                  slug TEXT UNIQUE NOT NULL,
                  description JSONB NOT NULL,
                  "order" INTEGER NOT NULL,
                  icon TEXT,
                  gradient TEXT
                );
                
                CREATE INDEX idx_categories_order ON categories ("order");
                CREATE INDEX idx_categories_slug ON categories (slug);
              `
            });
        }
      });

    // 创建tags表
    await supabase
      .from('tags')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating tags table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE tags (
                  id TEXT PRIMARY KEY,
                  name TEXT NOT NULL,
                  slug TEXT UNIQUE NOT NULL,
                  count INTEGER DEFAULT 0
                );
                
                CREATE INDEX idx_tags_count ON tags (count DESC);
                CREATE INDEX idx_tags_slug ON tags (slug);
              `
            });
        }
      });

    // 创建contents表
    await supabase
      .from('contents')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating contents table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE contents (
                  id TEXT PRIMARY KEY,
                  type TEXT NOT NULL,
                  title JSONB NOT NULL,
                  slug TEXT UNIQUE NOT NULL,
                  status TEXT NOT NULL,
                  seo JSONB NOT NULL,
                  content JSONB NOT NULL,
                  featured_image TEXT,
                  gallery JSONB,
                  locale TEXT NOT NULL,
                  author TEXT NOT NULL,
                  published_at TIMESTAMP,
                  scheduled_publish_at TIMESTAMP,
                  updated_at TIMESTAMP NOT NULL,
                  created_at TIMESTAMP NOT NULL
                );
                
                CREATE INDEX idx_contents_type ON contents (type);
                CREATE INDEX idx_contents_status ON contents (status);
                CREATE INDEX idx_contents_slug ON contents (slug);
                CREATE INDEX idx_contents_created_at ON contents (created_at DESC);
                CREATE INDEX idx_contents_published_at ON contents (published_at DESC);
              `
            });
        }
      });

    // 创建content_versions表
    await supabase
      .from('content_versions')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating content_versions table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE content_versions (
                  id TEXT PRIMARY KEY,
                  content_id TEXT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
                  version INTEGER NOT NULL,
                  title JSONB NOT NULL,
                  slug TEXT NOT NULL,
                  status TEXT NOT NULL,
                  seo JSONB NOT NULL,
                  content JSONB NOT NULL,
                  featured_image TEXT,
                  gallery JSONB,
                  locale TEXT NOT NULL,
                  author TEXT NOT NULL,
                  published_at TIMESTAMP,
                  scheduled_publish_at TIMESTAMP,
                  created_at TIMESTAMP NOT NULL,
                  updated_by TEXT NOT NULL,
                  comment TEXT
                );
                
                CREATE INDEX idx_content_versions_content_id ON content_versions (content_id);
                CREATE INDEX idx_content_versions_version ON content_versions (content_id, version DESC);
              `
            });
        }
      });

    // 创建media表
    await supabase
      .from('media')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating media table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE media (
                  id TEXT PRIMARY KEY,
                  type TEXT NOT NULL,
                  name TEXT NOT NULL,
                  url TEXT NOT NULL,
                  size INTEGER NOT NULL,
                  width INTEGER,
                  height INTEGER,
                  alt TEXT NOT NULL,
                  uploaded_at TIMESTAMP NOT NULL,
                  uploaded_by TEXT NOT NULL,
                  tags JSONB
                );
                
                CREATE INDEX idx_media_type ON media (type);
                CREATE INDEX idx_media_uploaded_at ON media (uploaded_at DESC);
              `
            });
        }
      });

    // 创建seo_rules表
    await supabase
      .from('seo_rules')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating seo_rules table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE seo_rules (
                  id TEXT PRIMARY KEY,
                  page_type TEXT NOT NULL,
                  title_template TEXT NOT NULL,
                  description_template TEXT NOT NULL,
                  h1_template TEXT NOT NULL,
                  h2_templates JSONB NOT NULL,
                  required_sections JSONB NOT NULL,
                  suggested_length JSONB NOT NULL
                );
                
                CREATE INDEX idx_seo_rules_page_type ON seo_rules (page_type);
              `
            });
        }
      });

    // 创建keywords表
    await supabase
      .from('keywords')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating keywords table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE keywords (
                  id TEXT PRIMARY KEY,
                  keyword TEXT NOT NULL,
                  search_volume INTEGER,
                  difficulty INTEGER,
                  intent TEXT NOT NULL,
                  cpc NUMERIC,
                  cluster_id TEXT,
                  created_at TIMESTAMP NOT NULL,
                  updated_at TIMESTAMP NOT NULL
                );
                
                CREATE INDEX idx_keywords_intent ON keywords (intent);
                CREATE INDEX idx_keywords_cluster_id ON keywords (cluster_id);
                CREATE INDEX idx_keywords_search_volume ON keywords (search_volume DESC);
              `
            });
        }
      });

    // 创建internal_links表
    await supabase
      .from('internal_links')
      .select('id')
      .limit(1)
      .single()
      .catch(async (error) => {
        if (error.code === '42P01') {
          console.log('Creating internal_links table...');
          await supabase
            .rpc('exec', {
              sql: `
                CREATE TABLE internal_links (
                  id TEXT PRIMARY KEY,
                  from_page_id TEXT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
                  to_page_id TEXT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
                  anchor_text TEXT NOT NULL,
                  link_type TEXT NOT NULL,
                  priority INTEGER NOT NULL
                );
                
                CREATE INDEX idx_internal_links_from_page ON internal_links (from_page_id);
                CREATE INDEX idx_internal_links_to_page ON internal_links (to_page_id);
              `
            });
        }
      });

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
}

createTables();