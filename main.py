import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel

app = FastAPI(title="CineDex Platform")
Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# دیتابیس سریال‌ها با پوسترهای اورجینال از سرورهای کاملاً آزاد و بدون فیلتر آمازون
SHOWS_DB = [
    {
        "id": 1,
        "title": "Breaking Bad",
        "first_air_date": "2008-01-20",
        "total_seasons": 5,
        "total_episodes": 62,
        "vote_average": 9.5,
        "overview": "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhNw==._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhNw==._V1_SX500.jpg"
    },
    {
        "id": 2,
        "title": "Better Call Saul",
        "first_air_date": "2015-02-08",
        "total_seasons": 6,
        "total_episodes": 63,
        "vote_average": 9.0,
        "overview": "The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to Walter White.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BMTc5NTM5OTY0Nl5BMl5BanBnXkFtZTgwNjg2NzYzOTE@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BMTc5NTM5OTY0Nl5BMl5BanBnXkFtZTgwNjg2NzYzOTE@._V1_SX500.jpg"
    },
    {
        "id": 3,
        "title": "Dexter",
        "first_air_date": "2006-10-01",
        "total_seasons": 8,
        "total_episodes": 96,
        "vote_average": 8.7,
        "overview": "Dexter Morgan leads a double life as a forensic analyst and a vigilante serial killer.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BNDBhMmFiOGUtNzY4Mi00OGVkLWE5NzctZWI0MDY3YTU4M2IzXkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BNDBhMmFiOGUtNzY4Mi00OGVkLWE5NzctZWI0MDY3YTU4M2IzXkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 4,
        "title": "Dexter: Original Sin",
        "first_air_date": "2024-12-13",
        "total_seasons": 1,
        "total_episodes": 10,
        "vote_average": 8.5,
        "overview": "Young Dexter transitions from student to avenging serial killer under the guidance of Harry.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BMTY3NTY0NTc4NF5BMl5BanBnXkFtZTgwNTc2NzYzOTE@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BMTY3NTY0NTc4NF5BMl5BanBnXkFtZTgwNTc2NzYzOTE@._V1_SX500.jpg"
    },
    {
        "id": 5,
        "title": "Game of Thrones",
        "first_air_date": "2011-04-17",
        "total_seasons": 8,
        "total_episodes": 73,
        "vote_average": 9.2,
        "overview": "Nine noble families fight for control over the mythical lands of Westeros.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDBlMy00ODlkLWExYjktOTU1OGZlODk2MjBhXkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDBlMy00ODlkLWExYjktOTU1OGZlODk2MjBhXkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 6,
        "title": "House of the Dragon",
        "first_air_date": "2022-08-21",
        "total_seasons": 2,
        "total_episodes": 18,
        "vote_average": 8.6,
        "overview": "The reign of House Targaryen begins with the civil war that leads to the downfall of the dragons.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BM2QzMGVkNjUtN2Y4Yi00ODMwLTg3YzktYzUxYjJlNjFjNDY1XkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BM2QzMGVkNjUtN2Y4Yi00ODMwLTg3YzktYzUxYjJlNjFjNDY1XkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 7,
        "title": "Arcane",
        "first_air_date": "2021-11-06",
        "total_seasons": 2,
        "total_episodes": 18,
        "vote_average": 9.1,
        "overview": "Set in utopian Piltover and oppressed Zaun, sisters Vi and Jinx battle on opposite sides.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BYTViYTE3NWQtNDBlZS00MTA5LWFkMDAtODljOTU1N2U3YWQ4XkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BYTViYTE3NWQtNDBlZS00MTA5LWFkMDAtODljOTU1N2U3YWQ4XkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 8,
        "title": "Dark",
        "first_air_date": "2017-12-01",
        "total_seasons": 3,
        "total_episodes": 26,
        "vote_average": 8.8,
        "overview": "A missing child sets four families on a frantic hunt for answers across generations.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BODk2NjUyOTYtM2FlYi00MGIzLTlmNzktMmFjYjVkZTE3ZTViXkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BODk2NjUyOTYtM2FlYi00MGIzLTlmNzktMmFjYjVkZTE3ZTViXkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 9,
        "title": "1899",
        "first_air_date": "2022-11-17",
        "total_seasons": 1,
        "total_episodes": 8,
        "vote_average": 7.9,
        "overview": "Multinational immigrants traveling from Europe discover a nightmarish riddle.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BOGZmNGE3MmItM2Y4OC00OTNkLTg2NDktZjc5NmU0NjgxMzZhXkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BOGZmNGE3MmItM2Y4OC00OTNkLTg2NDktZjc5NmU0NjgxMzZhXkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 10,
        "title": "Cowboy Bebop",
        "first_air_date": "1998-04-03",
        "total_seasons": 1,
        "total_episodes": 26,
        "vote_average": 8.9,
        "overview": "Bounty hunter Spike Spiegel and his partners track down criminals across space.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BNGNlNjBkODEtZThlOC00YzUxLWI0MjMtMjk3YzJmMDFlNWZlXkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BNGNlNjBkODEtZThlOC00YzUxLWI0MjMtMjk3YzJmMDFlNWZlXkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 11,
        "title": "Fullmetal Alchemist: Brotherhood",
        "first_air_date": "2009-04-05",
        "total_seasons": 1,
        "total_episodes": 64,
        "vote_average": 9.1,
        "overview": "Two brothers search for a Philosopher Stone to restore their bodies.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BNDk0OWM3ZTYtMTA4NC00M2M1LWI4OTUtOTk1ODRhYTUwMDNiXkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BNDk0OWM3ZTYtMTA4NC00M2M1LWI4OTUtOTk1ODRhYTUwMDNiXkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 12,
        "title": "Severance",
        "first_air_date": "2022-02-18",
        "total_seasons": 2,
        "total_episodes": 19,
        "vote_average": 8.7,
        "overview": "Mark leads a team of office workers whose memories have been surgically divided.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BZTg5ZmVmM2EtMGE2MS00ZTZkLTk5M2EtYTU4OWRiY2FlZDI2XkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BZTg5ZmVmM2EtMGE2MS00ZTZkLTk5M2EtYTU4OWRiY2FlZDI2XkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 13,
        "title": "The Sopranos",
        "first_air_date": "1999-01-10",
        "total_seasons": 6,
        "total_episodes": 86,
        "vote_average": 9.2,
        "overview": "New Jersey mob boss Tony Soprano deals with personal and professional issues.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BNmU5YzE4NDQtODJlOS00NjcyLWFiNmUtOGQ4MmQ0ZWQ5YjM0XkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BNmU5YzE4NDQtODJlOS00NjcyLWFiNmUtOGQ4MmQ0ZWQ5YjM0XkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 14,
        "title": "The Wire",
        "first_air_date": "2002-06-02",
        "total_seasons": 5,
        "total_episodes": 60,
        "vote_average": 9.3,
        "overview": "The Baltimore drug scene seen through the eyes of drug dealers and law enforcement.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BZmY5ZTRlMGUtMmRmYS00NWJmLTk4MTYtY2Q1NzcxN2M0ZGI3XkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BZmY5ZTRlMGUtMmRmYS00NWJmLTk4MTYtY2Q1NzcxN2M0ZGI3XkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 15,
        "title": "Chernobyl",
        "first_air_date": "2019-05-06",
        "total_seasons": 1,
        "total_episodes": 5,
        "vote_average": 9.4,
        "overview": "An explosion at the Chernobyl nuclear plant becomes a catastrophic disaster.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BNTEzNjBiMTktYmU5MS00NmZkLWI2MmUtNDBlNzZjODRhZDU2XkEyXkFqcGc@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BNTEzNjBiMTktYmU5MS00NmZkLWI2MmUtNDBlNzZjODRhZDU2XkEyXkFqcGc@._V1_SX500.jpg"
    },
    {
        "id": 16,
        "title": "Peaky Blinders",
        "first_air_date": "2013-09-12",
        "total_seasons": 6,
        "total_episodes": 36,
        "vote_average": 8.8,
        "overview": "A gangster family epic set in 1900s England centering on a gang in Birmingham.",
        "poster_path": "https://m.media-amazon.com/images/M/MV5BMTkzNjEzMDEzMF5BMl5BanBnXkFtZTgwMDI0MjE4MjE@._V1_SX500.jpg",
        "backdrop_path": "https://m.media-amazon.com/images/M/MV5BMTkzNjEzMDEzMF5BMl5BanBnXkFtZTgwMDI0MjE4MjE@._V1_SX500.jpg"
    }
]

# بسط دادن دیتابیس تا ۱۰۰ عنوان
for i in range(17, 101):
    base = SHOWS_DB[(i - 1) % len(SHOWS_DB)]
    SHOWS_DB.append({
        "id": i,
        "title": f"{base['title']} (Vol {i // 16 + 1})",
        "first_air_date": base["first_air_date"],
        "total_seasons": base["total_seasons"],
        "total_episodes": base["total_episodes"],
        "vote_average": round(7.4 + ((i % 22) * 0.1), 1),
        "overview": base["overview"],
        "poster_path": base["poster_path"],
        "backdrop_path": base["backdrop_path"]
    })

USER_STATUS = {"watchlist": [1, 3], "favorite": [1, 2], "hate": []}
WATCHED_EPISODES = [1, 2, 3]

@app.get("/", response_class=HTMLResponse)
def index():
    for p in ["/app/frontend/index.html", "frontend/index.html"]:
        if os.path.exists(p):
            return FileResponse(p)
    return "<h1>CineDex Ready</h1>"

@app.get("/app.js")
def get_js():
    for p in ["/app/frontend/app.js", "frontend/app.js"]:
        if os.path.exists(p):
            return FileResponse(p, media_type="application/javascript")
    raise HTTPException(status_code=404)

@app.get("/style.css")
def get_css():
    for p in ["/app/frontend/style.css", "frontend/style.css"]:
        if os.path.exists(p):
            return FileResponse(p, media_type="text/css")
    raise HTTPException(status_code=404)

@app.get("/shows")
def get_shows(limit: int = 100):
    return {"results": SHOWS_DB[:limit]}

@app.get("/shows/{show_id}")
def get_show_details(show_id: int):
    show = next((s for s in SHOWS_DB if s["id"] == show_id), SHOWS_DB[0])
    return {
        **show,
        "seasons": [{"season_number": s, "title": f"Season {s}"} for s in range(1, show.get("total_seasons", 1) + 1)]
    }

@app.get("/shows/{show_id}/seasons/{season_num}")
def get_season_episodes(show_id: int, season_num: int):
    return {
        "season": season_num,
        "episodes": [
            {"id": (show_id * 100) + ep, "episode_number": ep, "title": f"Episode {ep}", "overview": "Standard episode log."}
            for ep in range(1, 11)
        ]
    }

@app.get("/user/status-map")
def get_status_map():
    return USER_STATUS

@app.get("/user/watched-episodes")
def get_watched():
    return {"watched_ids": WATCHED_EPISODES}

class EpisodeWatch(BaseModel):
    episode_id: int
    watched: bool

@app.post("/episodes/watch")
def watch_ep(item: EpisodeWatch):
    if item.watched:
        if item.episode_id not in WATCHED_EPISODES:
            WATCHED_EPISODES.append(item.episode_id)
    else:
        if item.episode_id in WATCHED_EPISODES:
            WATCHED_EPISODES.remove(item.episode_id)
    return {"status": "success"}

class AuthRequest(BaseModel):
    username: str
    password: str

@app.post("/auth/login")
@app.post("/auth/register")
def auth(req: AuthRequest):
    return {"username": req.username, "token": "cinedex-valid-token-2026"}

@app.get("/healthz")
def health():
    return {"status": "ok"}
