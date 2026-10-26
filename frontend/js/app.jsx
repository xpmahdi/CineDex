const { useState, useEffect, useMemo } = React;

const rawShows = [
  { id: 1, title: "Breaking Bad", rating: 9.5, duration: 49, eps: 62, uni: "Gilliganverse", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80" },
  { id: 2, title: "Better Call Saul", rating: 9.0, duration: 52, eps: 63, uni: "Gilliganverse", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80" },
  { id: 3, title: "Dexter", rating: 8.7, duration: 53, eps: 96, uni: "Dexter Saga", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80" },
  { id: 4, title: "Dexter: Original Sin", rating: 8.4, duration: 50, eps: 10, uni: "Dexter Saga", status: "watching", fav: false, poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80" },
  { id: 5, title: "Dexter: Resurrection", rating: 8.8, duration: 55, eps: 10, uni: "Dexter Saga", status: "plan_to_watch", fav: true, poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80" },
  { id: 6, title: "Arcane", rating: 9.0, duration: 41, eps: 18, uni: "Runeterra", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80" },
  { id: 7, title: "Game of Thrones", rating: 9.2, duration: 57, eps: 73, uni: "Westeros Realm", status: "completed", fav: false, poster: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=500&q=80" },
  { id: 8, title: "House of the Dragon", rating: 8.5, duration: 61, eps: 18, uni: "Westeros Realm", status: "watching", fav: false, poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500&q=80" },
  { id: 9, title: "Dark", rating: 8.7, duration: 60, eps: 26, uni: "Winden Continuum", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80" },
  { id: 10, title: "1899", rating: 7.8, duration: 55, eps: 8, uni: "Winden Continuum", status: "dropped", fav: false, poster: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80" },
  { id: 11, title: "Cowboy Bebop", rating: 8.9, duration: 24, eps: 26, uni: "Bebop Universe", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80" },
  { id: 12, title: "Fullmetal Alchemist: Brotherhood", rating: 9.1, duration: 24, eps: 64, uni: "Amestris Realm", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80" },
  { id: 13, title: "Severance", rating: 8.7, duration: 50, eps: 19, uni: "Standalone", status: "watching", fav: true, poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80" },
  { id: 14, title: "The Sopranos", rating: 9.2, duration: 55, eps: 86, uni: "Standalone", status: "plan_to_watch", fav: true, poster: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80" },
  { id: 15, title: "The Wire", rating: 9.3, duration: 59, eps: 60, uni: "Standalone", status: "plan_to_watch", fav: false, poster: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=500&q=80" },
  { id: 16, title: "Chernobyl", rating: 9.4, duration: 65, eps: 5, uni: "Standalone", status: "completed", fav: true, poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80" }
];

const canonUnis = ['Gilliganverse', 'Dexter Saga', 'Runeterra', 'Westeros Realm', 'Winden Continuum', 'Amestris Realm', 'Standalone'];
const statusPool = ['watching', 'plan_to_watch', 'completed', 'dropped'];

for (let i = 17; i <= 160; i++) {
  rawShows.push({
    id: i,
    title: `Series Archive #${i}`,
    rating: (7.2 + ((i % 25) * 0.09)).toFixed(1),
    duration: 45 + (i % 20),
    eps: 10 + (i % 30),
    uni: canonUnis[i % canonUnis.length],
    status: statusPool[i % statusPool.length],
    fav: (i % 5 === 0),
    poster: `https://picsum.photos/seed/k8s_${i + 50}/400/600`
  });
}

function App() {
  const [shows, setShows] = useState(() => {
    const saved = localStorage.getItem('cinenest_react_data');
    return saved ? JSON.parse(saved) : rawShows;
  });

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeUni, setActiveUni] = useState("all");

  useEffect(() => {
    localStorage.setItem('cinenest_react_data', JSON.stringify(shows));
  }, [shows]);

  const updateStatus = (id, newStatus) => {
    setShows(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const toggleFav = (id) => {
    setShows(prev => prev.map(s => s.id === id ? { ...s, fav: !s.fav } : s));
  };

  const metrics = useMemo(() => {
    let totalMinutes = 0;
    let watching = 0, fav = 0, plan = 0;
    shows.forEach(s => {
      if (s.status === 'completed' || s.status === 'watching') {
        totalMinutes += s.duration * s.eps;
      }
      if (s.status === 'watching') watching++;
      if (s.fav) fav++;
      if (s.status === 'plan_to_watch') plan++;
    });
    return {
      hours: Math.round(totalMinutes / 60),
      watching,
      fav,
      plan
    };
  }, [shows]);

  const filteredShows = useMemo(() => {
    return shows.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.uni.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === "all" ? true : activeTab === "favorites" ? s.fav : s.status === activeTab;
      const matchUni = activeUni === "all" ? true : s.uni === activeUni;
      return matchSearch && matchTab && matchUni;
    });
  }, [shows, search, activeTab, activeUni]);

  return (
    <div>
      <header>
        <a href="#" className="nav-brand">
          <span className="nav-logo">CINE<span>NEST</span></span>
          <span className="k8s-badge">React 18 • k3s</span>
        </a>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search 160+ TV Series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="hero">
        <div className="hero-meta">
          <span className="hero-tag">Spotlight Canon</span>
          <h1 className="hero-title">Breaking Bad</h1>
          <div className="hero-stats">
            <span>★ 9.5</span>
            <span>•</span>
            <span>5 Seasons (62 Episodes)</span>
            <span>•</span>
            <span>~49 Min / Ep</span>
            <span>•</span>
            <span style={{ color: "var(--primary)" }}>Gilliganverse</span>
          </div>
          <p className="hero-desc">Walter White, a terminally ill chemistry teacher, teams up with Jesse Pinkman to secure his family financial future, evolving into a legendary kingpin.</p>
        </div>
      </div>

      <section className="telemetry-row">
        <div className="telemetry-card">
          <div className="telemetry-title">Estimated Binge Time</div>
          <div className="telemetry-val" style={{ color: "var(--primary)" }}>{metrics.hours} hrs</div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-title">Currently Watching</div>
          <div className="telemetry-val" style={{ color: "var(--emerald)" }}>{metrics.watching}</div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-title">Hit List (Favorites)</div>
          <div className="telemetry-val" style={{ color: "var(--accent)" }}>{metrics.fav}</div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-title">Plan to Watch</div>
          <div className="telemetry-val" style={{ color: "var(--gold)" }}>{metrics.plan}</div>
        </div>
      </section>

      <section className="universe-strip">
        <div className="strip-head">
          <span>Cinematic Universes (Canon Lore)</span>
          <small>{filteredShows.length} Shows Found</small>
        </div>
        <div className="universe-scroll">
          {["all", ...canonUnis].map(u => (
            <button
              key={u}
              className={`u-pill ${activeUni === u ? "active" : ""}`}
              onClick={() => setActiveUni(u)}
            >
              {u === "all" ? "All Universes" : u}
            </button>
          ))}
        </div>
      </section>

      <div className="filter-nav">
        {[
          { key: "all", label: "All Records" },
          { key: "watching", label: "Watching" },
          { key: "plan_to_watch", label: "Plan to Watch" },
          { key: "completed", label: "Completed" },
          { key: "favorites", label: "Hit List" },
          { key: "dropped", label: "Dropped" }
        ].map(tab => (
          <button
            key={tab.key}
            className={`filter-link ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="grid-container">
        {filteredShows.map(show => {
          const totalHours = Math.round((show.duration * show.eps) / 60);
          return (
            <div key={show.id} className="media-card">
              <div className="media-poster-wrap">
                <img src={show.poster} alt={show.title} loading="lazy" />
                <span className="badge-rating">★ {show.rating}</span>
                <span className="badge-timing">{show.eps} eps • ~{show.duration}m</span>
                <button
                  className={`fav-trigger ${show.fav ? "active" : ""}`}
                  onClick={() => toggleFav(show.id)}
                >
                  ★
                </button>
              </div>
              <div className="media-body">
                <span className="media-uni-label">{show.uni}</span>
                <div className="media-title-text">{show.title}</div>
                <div className="media-runtime-total">Binge Duration: ~{totalHours} hrs</div>
                <select
                  className="status-dropdown"
                  value={show.status}
                  onChange={(e) => updateStatus(show.id, e.target.value)}
                >
                  <option value="watching">Watching</option>
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
            </div>
          );
        })}
      </main>

      <footer>
        <div>CineNest React Engine • Cloud-Native on Ubuntu k3s</div>
        <div>Contact: <a href="mailto:ops@cinenest.local" style={{ color: "var(--primary)", textDecoration: "none" }}>ops@cinenest.local</a></div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
