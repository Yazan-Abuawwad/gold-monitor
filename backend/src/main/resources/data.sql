-- Remove old broken / dead sources so they get replaced cleanly
DELETE FROM sources WHERE url IN (
    'http://www.bbc.co.uk/arabic/business/index.xml',
    'https://feeds.reuters.com/reuters/topNews',
    'https://feeds.reuters.com/reuters/commoditiesNews',
    'https://rsshub.app/apnews/topics/apf-intlnews',
    'https://www.defensenews.com/rss/',
    'https://www.kitco.com/rss/KitcoNews.xml',
    'https://goldprice.org/rss/gold-price-news.xml',
    'https://www.bullionvault.com/gold-news/gold-news-rss.do',
    'https://www.mining.com/category/gold/feed/',
    'https://news.goldseek.com/GoldSeek/rss.php'
);

INSERT INTO sources (name, url, category) VALUES
    -- World News
    ('BBC News World',     'https://feeds.bbci.co.uk/news/world/rss.xml',                     'world'),
    ('Al Jazeera',         'https://www.aljazeera.com/xml/rss/all.xml',                       'world'),
    ('The Guardian World', 'https://www.theguardian.com/world/rss',                           'world'),
    ('NPR World',          'https://feeds.npr.org/1004/rss.xml',                              'world'),
    ('ABC News Intl',      'https://abcnews.go.com/abcnews/internationalheadlines',           'world'),
    ('Defense News',       'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml', 'security'),
    -- Gold & Commodities News
    ('Kitco News Gold',    'https://www.kitco.com/rss/KitcoNewsGold.xml',                     'gold'),
    ('MarketWatch Metals', 'https://feeds.marketwatch.com/marketwatch/marketpulse/',          'gold'),
    ('Investing.com Gold', 'https://www.investing.com/rss/news_25.rss',                       'gold'),
    ('Gold Silver Worlds', 'https://goldsilverworlds.com/feed/',                              'gold'),
    ('Seeking Alpha Gold', 'https://seekingalpha.com/tag/gold.xml',                           'gold'),
    ('Mining.com',         'https://www.mining.com/feed/',                                    'gold'),
    ('FX Empire Gold',     'https://www.fxempire.com/api/v1/en/markets/commodity/Gold/news/feed', 'gold')
ON CONFLICT (url) DO NOTHING;
