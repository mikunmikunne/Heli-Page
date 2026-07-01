-- Day 1 - Task 1: Khởi tạo bảng seo_articles cho Automation CMS

CREATE TABLE seo_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL,
    title TEXT,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    image_url TEXT,
    category TEXT,
    author_name TEXT,
    read_time TEXT,
    status TEXT DEFAULT 'pending',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo Index để truy vấn nội dung nhanh hơn trên Next.js
CREATE INDEX idx_seo_articles_status ON seo_articles(status);
CREATE INDEX idx_seo_articles_slug ON seo_articles(slug);

-- (Tùy chọn) Thêm Row mẫu để lát nữa test giao diện (Task 2)
INSERT INTO seo_articles (keyword, title, slug, content, status, published_at)
VALUES (
    'chair massage benefits', 
    'The Ultimate Guide to Chair Massage Benefits for Office Workers', 
    'chair-massage-benefits', 
    '# Chair Massage Benefits \n\nOffice workers spend hours sitting, which leads to back pain. \n\n## Why you need it \nIt reduces stress and improves productivity. \n\n### FAQ \n**Does it hurt?** \nNo, it is very relaxing.', 
    'published',
    now()
);
