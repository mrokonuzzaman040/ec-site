-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    title_bn VARCHAR(500),
    content_bn TEXT,
    category VARCHAR(100),
    image_url TEXT,
    published_date TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for news
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_scraped_at ON news(scraped_at DESC);

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT,
    title_bn VARCHAR(500),
    content_bn TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    notice_type VARCHAR(100),
    file_url TEXT,
    published_date TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notices
CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority);
CREATE INDEX IF NOT EXISTS idx_notices_published_date ON notices(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_notices_type ON notices(notice_type);

-- Create officers table
CREATE TABLE IF NOT EXISTS officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_bn VARCHAR(200),
    position VARCHAR(200),
    position_bn VARCHAR(200),
    department VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(50),
    image_url TEXT,
    hierarchy_level INTEGER DEFAULT 0,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for officers
CREATE INDEX IF NOT EXISTS idx_officers_department ON officers(department);
CREATE INDEX IF NOT EXISTS idx_officers_hierarchy ON officers(hierarchy_level);
CREATE INDEX IF NOT EXISTS idx_officers_name ON officers(name);

-- Create elections table
CREATE TABLE IF NOT EXISTS elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    title_bn VARCHAR(500),
    description TEXT,
    description_bn TEXT,
    election_date DATE,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    results JSONB,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for elections
CREATE INDEX IF NOT EXISTS idx_elections_date ON elections(election_date DESC);
CREATE INDEX IF NOT EXISTS idx_elections_status ON elections(status);
CREATE INDEX IF NOT EXISTS idx_elections_results ON elections USING GIN(results);

-- Create scraping logs table
CREATE TABLE IF NOT EXISTS scraping_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    items_scraped INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for scraping logs
CREATE INDEX IF NOT EXISTS idx_scraping_logs_job_id ON scraping_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_target_type ON scraping_logs(target_type);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_status ON scraping_logs(status);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_started_at ON scraping_logs(started_at DESC);

-- Grant permissions to anon role for read access
GRANT SELECT ON news TO anon;
GRANT SELECT ON notices TO anon;
GRANT SELECT ON officers TO anon;
GRANT SELECT ON elections TO anon;

-- Grant full privileges to authenticated role
GRANT ALL PRIVILEGES ON news TO authenticated;
GRANT ALL PRIVILEGES ON notices TO authenticated;
GRANT ALL PRIVILEGES ON officers TO authenticated;
GRANT ALL PRIVILEGES ON elections TO authenticated;
GRANT ALL PRIVILEGES ON scraping_logs TO authenticated;

-- Insert initial scraping configuration
INSERT INTO scraping_logs (job_id, target_type, status, items_scraped, completed_at)
VALUES 
    ('init-001', 'news', 'completed', 0, NOW()),
    ('init-002', 'notices', 'completed', 0, NOW()),
    ('init-003', 'officers', 'completed', 0, NOW()),
    ('init-004', 'elections', 'completed', 0, NOW())
ON CONFLICT DO NOTHING;