import urllib.request
import json
import psycopg2

TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDUyOWQyOWJlYTJkZjkxNzFiNWQ1YjFlMDEwZDhkMyIsIm5iZiI6MTc5MjkzMzAyOC45MTEsInN1YiI6IjZhZGRmY2E0MDMyOWQ3ZDNiZDU3NzQwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y4BKbuCKkhEGTBkZj378QKWZTFwqtqSSQBejL3sUkkg"
DATABASE_URL = "postgresql://cinedex_user:cinedex_pass@localhost:5432/cinedex_db"
PROXY = "http://127.0.0.1:10809"

# تنظیم پراکسی تروجان برای دور زدن فیلترینگ TMDB
proxy_handler = urllib.request.ProxyHandler({'http': PROXY, 'https': PROXY})
opener = urllib.request.build_opener(proxy_handler)

def fetch_json(url):
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {TMDB_TOKEN}",
        "Content-Type": "application/json;charset=utf-8",
        "User-Agent": "Mozilla/5.0"
    })
    with opener.open(req, timeout=15) as res:
        return json.loads(res.read().decode('utf-8'))

def detect_universe(title):
    t = title.lower()
    if any(k in t for k in ['breaking bad', 'better call saul', 'el camino']):
        return 'Gilliganverse'
    if 'dexter' in t:
        return 'Dexter Saga'
    if any(k in t for k in ['game of thrones', 'house of the dragon']):
        return 'Westeros Realm'
    if any(k in t for k in ['arcane', 'league of legends']):
        return 'Runeterra'
    if any(k in t for k in ['dark', '1899']):
        return 'Winden Continuum'
    if 'cowboy bebop' in t:
        return 'Bebop Universe'
    if 'fullmetal alchemist' in t:
        return 'Amestris Realm'
    return 'Standalone'

def get_genre_names(genre_ids):
    genres_map = {
        10759: "Action & Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
        99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids",
        9648: "Mystery", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
        10766: "Soap", 10767: "Talk", 10768: "War & Politics", 37: "Western"
    }
    names = [genres_map.get(gid) for gid in genre_ids if gid in genres_map]
    return ", ".join(names[:2]) if names else "Drama"

print("Fetching 160 top-rated shows from TMDB via Trojan Proxy...")
shows = []
page = 1

while len(shows) < 160 and page <= 10:
    url = f"https://api.themoviedb.org/3/tv/top_rated?language=en-US&page={page}"
    data = fetch_json(url)
    results = data.get("results", [])
    if not results:
        break

    for item in results:
        if len(shows) >= 160:
            break
        
        show_id = item.get("id")
        title = item.get("name")
        overview = item.get("overview") or "Catalog record synchronized from TMDB master index."
        rating = round(float(item.get("vote_average", 8.0)), 1)
        poster = f"https://image.tmdb.org/t/p/w500{item.get('poster_path')}" if item.get("poster_path") else "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80"
        genre = get_genre_names(item.get("genre_ids", []))
        
        release_date = item.get("first_air_date", "2020-01-01")
        year = int(release_date.split("-")[0]) if release_date else 2020
        
        universe = detect_universe(title)
        
        # مقداردهی متوازن به وضعیت‌های ترکر
        idx = len(shows)
        status_pool = ['completed', 'watching', 'plan_to_watch', 'plan_to_watch', 'dropped']
        tracker_status = status_pool[idx % len(status_pool)]
        is_favorite = rating >= 8.7 or universe != 'Standalone'

        shows.append((title, overview, rating, poster, genre, year, 50, 12, universe, tracker_status, is_favorite))
    
    page += 1

print(f"Successfully retrieved {len(shows)} shows from TMDB. Storing to PostgreSQL...")

# تزریق به دیتابیس
conn = psycopg2.connect("postgresql://cinedex_user:cinedex_pass@cinedex-postgres:5432/cinedex_db")
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        vote_average NUMERIC(3, 1) DEFAULT 0.0,
        poster_path TEXT,
        genre VARCHAR(100),
        release_year INT,
        duration_min INT DEFAULT 50,
        episodes_count INT DEFAULT 12,
        universe VARCHAR(100) DEFAULT 'Standalone',
        tracker_status VARCHAR(50) DEFAULT 'plan_to_watch',
        is_favorite BOOLEAN DEFAULT false
    );
    TRUNCATE TABLE shows RESTART IDENTITY;
""")

for s in shows:
    cur.execute("""
        INSERT INTO shows (title, overview, vote_average, poster_path, genre, release_year, duration_min, episodes_count, universe, tracker_status, is_favorite)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, s)

conn.commit()
cur.close()
conn.close()
print("All 160 shows ingested into PostgreSQL successfully!")
