// تنظیم داینامیک آدرس بک‌اند متناسب با پورت باز شده در کلاستر
const API_BASE = window.location.origin;

let allShows = [];
let currentHeroShow = null;
let currentTab = "all";
let currentGenreFilter = "all";
let statusMap = { watchlist: [], favorite: [], hate: [] };
let currentUser = JSON.parse(localStorage.getItem("cinedex_user") || "null");
let authMode = "login";
let currentLang = localStorage.getItem("cinedex_lang") || "en";

// اسلایدر خودکار هیرو
let heroSlideIndex = 0;
let heroSlideTimer = null;
const ROTATION_INTERVAL = 5000;

// متغیرهای مودال اپیزودها
let currentModalShow = null;
let currentModalEpisodes = [];
let watchedEpisodesSet = new Set();

// دیکشنری چندزبانه (i18n)
const TRANSLATIONS = {
  en: {
    nav_genres: "Genre Universe",
    nav_upcoming: "Coming Soon",
    nav_discover: "Discover",
    nav_watchlist: "Watchlist 📌",
    nav_favorites: "Favorites ❤️",
    nav_hate: "Hate List 🤮",
    search_placeholder: "Search series...",
    btn_signin: "Sign In",
    hero_details: "▶ View Details",
    hero_add_watchlist: "+ Add to Watchlist",
    universe_title: "Genre Universe",
    universe_desc: "Click any planet in our cinematic solar system to filter your series!",
    planet_all: "All Shows",
    grid_explore: "Explore Shows",
    grid_sub: "Showing titles from database",
    calendar_title: "Coming Soon",
    calendar_desc: "The nearest upcoming releases, with a live countdown for the closest premiere.",
    next_premiere: "NEXT PREMIERE",
    releases_in: "RELEASES IN",
    footer_bio: "Your ultimate destination for discovering and streaming the best movies and TV shows from around the world.",
    quick_links: "Quick Links",
    support_links: "Support",
    contact_us: "Contact Us",
    auth_login_title: "Sign In to CineDex",
    auth_login_sub: "Manage your favorites, watchlist and watch history",
    auth_reg_title: "Create CineDex Account",
    auth_reg_sub: "Start tracking your journey today",
    auth_user: "Username",
    auth_pass: "Password",
    auth_no_account: "Don't have an account?",
    auth_has_account: "Already have an account?",
    auth_create_one: "Create one",
    auth_login_link: "Sign In"
  },
  fa: {
    nav_genres: "منظومه ژانرها",
    nav_upcoming: "به‌زودی",
    nav_discover: "همه سریال‌ها",
    nav_watchlist: "واچ‌لیست 📌",
    nav_favorites: "محبوب‌ها ❤️",
    nav_hate: "هیت‌لیست 🤮",
    search_placeholder: "جستجوی سریال...",
    btn_signin: "ورود به حساب",
    hero_details: "▶ مشاهده قسمت‌ها",
    hero_add_watchlist: "+ افزودن به واچ‌لیست",
    universe_title: "منظومه کهکشانی ژانرها",
    universe_desc: "روی هر سیاره کلیک کنید تا سریال‌های همان ژانر در مدار قرار بگیرند!",
    planet_all: "همه ژانرها",
    grid_explore: "کاتالوگ سریال‌ها",
    grid_sub: "در حال نمایش عناوین پایگاه داده",
    calendar_title: "به‌زودی در سینما و تلویزیون",
    calendar_desc: "نزدیک‌ترین اکران‌ها با شمارش معکوس زنده و دقیق برای نزدیک‌ترین پرمیر.",
    next_premiere: "پرمیر بعدی",
    releases_in: "زمان باقی‌مانده تا پخش",
    footer_bio: "مقصد نهایی شما برای کشف و ردیابی بهترین سریال‌ها و فیلم‌های برتر جهان.",
    quick_links: "دسترسی سریع",
    support_links: "پشتیبانی",
    contact_us: "تماس با ما",
    auth_login_title: "ورود به ساین‌دکس",
    auth_login_sub: "مدیریت واچ‌لیست، علاقه‌مندی‌ها و قسمت‌های تماشا شده",
    auth_reg_title: "ساخت حساب کاربری جدید",
    auth_reg_sub: "ردیابی سریال‌های خود را از امروز شروع کنید",
    auth_user: "نام کاربری",
    auth_pass: "رمز عبور",
    auth_no_account: "حساب کاربری ندارید؟",
    auth_has_account: "قبلاً ثبت‌نام کرده‌اید؟",
    auth_create_one: "ساخت اکانت",
    auth_login_link: "ورود"
  },
  de: {
    nav_genres: "Genre-Universum",
    nav_upcoming: "Demnächst",
    nav_discover: "Entdecken",
    nav_watchlist: "Merkliste 📌",
    nav_favorites: "Favoriten ❤️",
    nav_hate: "Hassliste 🤮",
    search_placeholder: "Serien suchen...",
    btn_signin: "Anmelden",
    hero_details: "▶ Details ansehen",
    hero_add_watchlist: "+ Zur Merkliste",
    universe_title: "Genre-Universum",
    universe_desc: "Klicken Sie auf einen Planeten, um Serien nach Genre zu filtern!",
    planet_all: "Alle Serien",
    grid_explore: "Serien durchstöbern",
    grid_sub: "Titel aus der Datenbank",
    calendar_title: "Demnächst",
    calendar_desc: "Die nächsten Veröffentlichungen mit Live-Countdown.",
    next_premiere: "NÄCHSTE PREMIERE",
    releases_in: "VERÖFFENTLICHUNG IN",
    footer_bio: "Ihr ultimatives Ziel zum Entdecken der besten Serien weltweit.",
    quick_links: "Schnelllinks",
    support_links: "Support",
    contact_us: "Kontakt",
    auth_login_title: "Bei CineDex anmelden",
    auth_login_sub: "Verwalten Sie Ihre Merkliste und Ihren Verlauf",
    auth_reg_title: "CineDex-Konto erstellen",
    auth_reg_sub: "Beginnen Sie noch heute mit dem Tracking",
    auth_user: "Benutzername",
    auth_pass: "Passwort",
    auth_no_account: "Kein Konto?",
    auth_has_account: "Bereits registriert?",
    auth_create_one: "Registrieren",
    auth_login_link: "Anmelden"
  },
  ja: {
    nav_genres: "ジャンル・ユニバース",
    nav_upcoming: "近日公開",
    nav_discover: "見つける",
    nav_watchlist: "リスト 📌",
    nav_favorites: "お気に入り ❤️",
    nav_hate: "苦手リスト 🤮",
    search_placeholder: "シリーズを検索...",
    btn_signin: "ログイン",
    hero_details: "▶ 詳細を見る",
    hero_add_watchlist: "+ リストに追加",
    universe_title: "ジャンル・ユニバース",
    universe_desc: "惑星をクリックしてジャンル別にシリーズを絞り込みます！",
    planet_all: "すべて",
    grid_explore: "シリーズ一覧",
    grid_sub: "データベースの作品を表示中",
    calendar_title: "近日公開カレンダー",
    calendar_desc: "最も近いプレミアのライブカウントダウン。",
    next_premiere: "次のプレミア",
    releases_in: "配信まで",
    footer_bio: "世界中の素晴らしいドラマや映画を見つけるための決定版。",
    quick_links: "クイックリンク",
    support_links: "サポート",
    contact_us: "お問い合わせ",
    auth_login_title: "CineDexにログイン",
    auth_login_sub: "お気に入りや視聴履歴を管理",
    auth_reg_title: "新規アカウント作成",
    auth_reg_sub: "トラッキングを始めましょう",
    auth_user: "ユーザー名",
    auth_pass: "パスワード",
    auth_no_account: "アカウントをお持ちでないですか？",
    auth_has_account: "すでにアカウントをお持ちですか？",
    auth_create_one: "新規登録",
    auth_login_link: "ログイン"
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  setupLanguage();
  renderAuthButton();
  startLiveCountdown();
  await init();
  setupSearch();
});

function startLiveCountdown() {
  let totalSeconds = 102 * 3600 + 22 * 60 + 27;
  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const hEl = document.getElementById("countdown-hours");
      const mEl = document.getElementById("countdown-mins");
      const sEl = document.getElementById("countdown-secs");

      if (hEl) hEl.textContent = String(hours).padStart(2, "0");
      if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
      if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
    }
  }, 1000);
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("cinedex_lang", lang);
  document.documentElement.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput && t.search_placeholder) {
    searchInput.placeholder = t.search_placeholder;
  }
}

function setupLanguage() {
  const select = document.getElementById("lang-select");
  if (select) select.value = currentLang;
  changeLanguage(currentLang);
}

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (currentUser && currentUser.token) {
    headers["Authorization"] = `Bearer ${currentUser.token}`;
  }
  return headers;
}

async function init() {
  await fetchStatusMap();
  await fetchWatchedEpisodes();
  await fetchShows();
}

async function fetchStatusMap() {
  try {
    const res = await fetch(`${API_BASE}/user/status-map`, { headers: getAuthHeaders() });
    if (res.ok) statusMap = await res.json();
  } catch (err) {
    console.warn("Status map error:", err);
  }
}

async function fetchWatchedEpisodes() {
  try {
    const res = await fetch(`${API_BASE}/user/watched-episodes`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      watchedEpisodesSet = new Set(data.watched_ids || []);
    }
  } catch (err) {
    console.warn("Watch history error:", err);
  }
}

async function fetchShows() {
  const grid = document.getElementById("shows-grid");
  try {
    const res = await fetch(`${API_BASE}/shows?limit=100`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    
    const data = await res.json();
    const rawShows = data.results || [];
    
    // فیلتر سریال‌هایی که دارای داده معتبر هستند
    allShows = rawShows.filter(s => s && s.title);

    if (allShows.length > 0) {
      const firstValid = allShows.find(s => s.backdrop_path) || allShows[0];
      setHero(firstValid);
      renderGrid();
      startHeroAutoRotate();
    } else {
      grid.innerHTML = `<p class="col-span-full text-center text-slate-500 py-16">No shows found.</p>`;
    }
  } catch (err) {
    console.error("Shows fetch error:", err);
    grid.innerHTML = `<p class="col-span-full text-center text-rose-500 py-12">Backend connection failed!</p>`;
  }
}

function setHero(show) {
  if (!show) return;
  currentHeroShow = show;
  const bgImg = document.getElementById("hero-bg");
  
  if (bgImg) {
    bgImg.style.opacity = "0.05";
    setTimeout(() => {
      bgImg.src = show.backdrop_path || show.poster_path;
      bgImg.style.opacity = "0.4";
    }, 250);
  }

  const score = show.vote_average ? Number(show.vote_average).toFixed(1) : (8.4 + (show.id % 12) * 0.1).toFixed(1);

  const titleEl = document.getElementById("hero-title");
  if (titleEl) titleEl.textContent = show.title;

  const yearEl = document.getElementById("hero-year");
  if (yearEl) yearEl.textContent = show.first_air_date ? show.first_air_date.split("-")[0] : "2024";

  const seasonsEl = document.getElementById("hero-seasons");
  if (seasonsEl) seasonsEl.textContent = `${show.total_seasons || 1} Seasons`;

  const epsEl = document.getElementById("hero-episodes");
  if (epsEl) epsEl.textContent = `${show.total_episodes || 10} Episodes`;

  const descEl = document.getElementById("hero-desc");
  if (descEl) descEl.textContent = show.overview || "No overview available.";

  const badgeEl = document.getElementById("hero-badge");
  if (badgeEl) badgeEl.textContent = `★ ${score} TMDb`;

  updateHeroButtons();
}

function startHeroAutoRotate() {
  if (heroSlideTimer) clearInterval(heroSlideTimer);

  heroSlideTimer = setInterval(() => {
    const topShows = allShows.slice(0, 10);
    if (topShows.length === 0) return;

    heroSlideIndex = (heroSlideIndex + 1) % topShows.length;
    setHero(topShows[heroSlideIndex]);
  }, ROTATION_INTERVAL);
}

function updateHeroButtons() {
  if (!currentHeroShow) return;
  const inWatch = statusMap.watchlist.includes(currentHeroShow.id);
  const inFav = statusMap.favorite.includes(currentHeroShow.id);

  const favBtn = document.getElementById("hero-fav-btn");
  const watchBtn = document.getElementById("hero-watch-btn");

  if (favBtn) {
    favBtn.className = inFav 
      ? "flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition shadow-lg shadow-rose-600/30"
      : "flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition";
    favBtn.textContent = inFav ? "❤️ In Favorites" : "❤️";
  }

  if (watchBtn) {
    watchBtn.className = inWatch
      ? "flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold transition"
      : "flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition";
    watchBtn.textContent = inWatch ? "📌 In Watchlist" : "+ Add to Watchlist";
  }
}

function filterByGenre(genre) {
  currentGenreFilter = genre;
  const badge = document.getElementById("active-genre-badge");
  
  if (genre === "all") {
    badge.classList.add("hidden");
  } else {
    badge.textContent = `Planet: ${genre}`;
    badge.classList.remove("hidden");
  }

  renderGrid();
  scrollToCatalog();
}

function scrollToUniverse() {
  document.getElementById("genre-universe-section").scrollIntoView({ behavior: "smooth" });
}

function scrollToCatalog() {
  document.getElementById("catalog-section").scrollIntoView({ behavior: "smooth" });
}

function scrollToUpcoming() {
  document.getElementById("upcoming-section").scrollIntoView({ behavior: "smooth" });
}

function renderGrid(filteredList = null) {
  const grid = document.getElementById("shows-grid");
  let shows = filteredList || allShows;

  if (!filteredList) {
    if (currentTab === "watchlist") shows = allShows.filter(s => statusMap.watchlist.includes(s.id));
    if (currentTab === "favorite") shows = allShows.filter(s => statusMap.favorite.includes(s.id));
    if (currentTab === "hate") shows = allShows.filter(s => statusMap.hate.includes(s.id));

    if (currentGenreFilter !== "all") {
      const g = currentGenreFilter.toLowerCase();
      shows = shows.filter(s => {
        const text = ((s.title || "") + " " + (s.overview || "")).toLowerCase();
        if (g === "action") return text.includes("action") || text.includes("war") || text.includes("fight") || text.includes("titan") || text.includes("daredevil") || text.includes("borderland");
        if (g === "crime") return text.includes("crime") || text.includes("police") || text.includes("dexter") || text.includes("vice") || text.includes("bad");
        if (g === "comedy") return text.includes("comedy") || text.includes("fun") || text.includes("humor");
        if (g === "animation") return text.includes("anime") || text.includes("animation") || text.includes("titan") || text.includes("avatar") || text.includes("alchemist");
        if (g === "drama") return text.includes("drama") || text.includes("god") || text.includes("thrones") || text.includes("tokyo");
        if (g === "horror") return text.includes("horror") || text.includes("dead") || text.includes("fear") || text.includes("dark");
        if (g === "thriller") return text.includes("thriller") || text.includes("suspense") || text.includes("borderland") || text.includes("dexter");
        return true;
      });
    }
  }

  if (shows.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-slate-500 py-16">No series found for this filter.</p>`;
    return;
  }

  grid.innerHTML = shows.map((show, index) => {
    const inWatch = statusMap.watchlist.includes(show.id);
    const inFav = statusMap.favorite.includes(show.id);
    const inHate = statusMap.hate.includes(show.id);
    const rating = show.vote_average ? Number(show.vote_average).toFixed(1) : (8.0 + ((show.id * 7) % 18) * 0.1).toFixed(1);

    return `
      <div class="fade-in group relative flex flex-col bg-[#0d111a] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5">
        <div onclick="openShowDetails(${show.id})" class="cursor-pointer relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
          <img src="${show.poster_path}" alt="${show.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" onerror="this.onerror=null; this.src='/api/proxy-image?url=' + encodeURIComponent('${show.poster_path}');">
          
          ${index < 10 && currentTab === 'all' && currentGenreFilter === 'all' ? `
            <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-black text-amber-400 shadow-md">
              #${index + 1}
            </span>
          ` : ''}

          <span class="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-amber-500/20 text-xs font-bold text-amber-400 shadow-md">
            ★ ${rating}
          </span>

          <div class="absolute inset-0 bg-gradient-to-t from-[#0d111a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-xs font-semibold text-white">Click for Episodes</span>
          </div>
        </div>

        <div class="p-3.5 flex flex-col flex-1 justify-between gap-2">
          <div>
            <h3 onclick="openShowDetails(${show.id})" class="cursor-pointer text-sm font-bold text-white truncate hover:text-amber-400 transition" title="${show.title}">
              ${show.title}
            </h3>
            <div class="flex items-center justify-between text-xs text-slate-400 mt-1">
              <span>${show.first_air_date ? show.first_air_date.split("-")[0] : "TV Series"}</span>
              <span class="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-medium">
                ${show.total_seasons || 1}S
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2.5 border-t border-white/5 text-xs">
            <button onclick="toggleAction('watchlist', ${show.id})" title="Watchlist" class="p-1.5 rounded-lg transition ${inWatch ? 'bg-amber-500/20 text-amber-400 font-bold scale-110' : 'text-slate-400 hover:text-white hover:bg-white/5'}">📌</button>
            <button onclick="toggleAction('favorite', ${show.id})" title="Favorite" class="p-1.5 rounded-lg transition ${inFav ? 'bg-rose-500/20 text-rose-500 font-bold scale-110' : 'text-slate-400 hover:text-white hover:bg-white/5'}">❤️</button>
            <button onclick="toggleAction('hate', ${show.id})" title="Hate / Drop" class="p-1.5 rounded-lg transition ${inHate ? 'bg-emerald-500/20 text-emerald-400 font-bold scale-110' : 'text-slate-400 hover:text-white hover:bg-white/5'}">🤮</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function setHeroById(id) {
  const showIndex = allShows.findIndex(s => s.id === id);
  if (showIndex !== -1) {
    heroSlideIndex = showIndex % 10;
    setHero(allShows[showIndex]);
    startHeroAutoRotate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function toggleHeroAction(type) {
  if (currentHeroShow) {
    await toggleAction(type, currentHeroShow.id);
  }
}

async function toggleAction(type, showId) {
  const isAlready = statusMap[type].includes(showId);
  const method = isAlready ? "DELETE" : "POST";
  const url = isAlready 
    ? `${API_BASE}/user/lists/${type}?show_id=${showId}`
    : `${API_BASE}/user/lists/${type}`;

  try {
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: isAlready ? null : JSON.stringify({ show_id: showId })
    });

    if (res.ok) {
      if (isAlready) {
        statusMap[type] = statusMap[type].filter(id => id !== showId);
      } else {
        statusMap[type].push(showId);
      }
      renderGrid();
      updateHeroButtons();
    }
  } catch (err) {
    console.error("Action error:", err);
  }
}

function setTab(tab) {
  currentTab = tab;
  currentGenreFilter = "all";
  document.getElementById("active-genre-badge").classList.add("hidden");
  renderGrid();
  scrollToCatalog();
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderGrid();
      return;
    }
    const filtered = allShows.filter(s => s.title.toLowerCase().includes(q));
    renderGrid(filtered);
  });
}

function openHeroDetails() {
  if (currentHeroShow) openShowDetails(currentHeroShow.id);
}

async function openShowDetails(showId) {
  const modal = document.getElementById("details-modal");
  modal.classList.remove("hidden");
  
  await fetchWatchedEpisodes();

  try {
    const res = await fetch(`${API_BASE}/shows/${showId}`);
    currentModalShow = await res.json();

    document.getElementById("modal-poster").src = currentModalShow.poster_path;
    document.getElementById("modal-title").textContent = currentModalShow.title;
    document.getElementById("modal-overview").textContent = currentModalShow.overview || "No overview available.";
    
    const score = currentModalShow.vote_average ? Number(currentModalShow.vote_average).toFixed(1) : "8.5";
    document.getElementById("modal-rating").textContent = `★ ${score}`;

    const seasons = currentModalShow.seasons || [{ season_number: 1, title: "Season 1" }];
    const tabsContainer = document.getElementById("modal-seasons-tabs");
    
    tabsContainer.innerHTML = seasons.map((s, idx) => `
      <button onclick="loadSeasonEpisodes(${currentModalShow.id}, ${s.season_number})" 
              id="season-tab-${s.season_number}" 
              class="season-tab px-3 py-1.5 rounded-lg border font-medium transition ${idx === 0 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}">
        Season ${s.season_number}
      </button>
    `).join("");

    await loadSeasonEpisodes(currentModalShow.id, seasons[0].season_number);
  } catch (err) {
    console.error("Error opening show details:", err);
  }
}

async function loadSeasonEpisodes(showId, seasonNumber) {
  document.querySelectorAll(".season-tab").forEach(tab => {
    tab.className = "season-tab px-3 py-1.5 rounded-lg border font-medium bg-white/5 border-white/5 text-slate-400 hover:text-white transition";
  });
  const activeTab = document.getElementById(`season-tab-${seasonNumber}`);
  if (activeTab) activeTab.className = "season-tab px-3 py-1.5 rounded-lg border font-bold bg-amber-500 text-slate-950 border-amber-400 transition";

  const listContainer = document.getElementById("modal-episodes-list");
  listContainer.innerHTML = `<p class="text-center text-xs text-slate-500 py-8">Loading episodes...</p>`;

  try {
    const res = await fetch(`${API_BASE}/shows/${showId}/seasons/${seasonNumber}`);
    const data = await res.json();
    currentModalEpisodes = data.episodes || [];

    renderEpisodesList();
    updateModalProgress();
  } catch (err) {
    listContainer.innerHTML = `<p class="text-center text-xs text-rose-400 py-8">No episode details in database.</p>`;
  }
}

function renderEpisodesList() {
  const listContainer = document.getElementById("modal-episodes-list");
  if (currentModalEpisodes.length === 0) {
    listContainer.innerHTML = `<p class="text-center text-xs text-slate-500 py-8">No episodes for this season.</p>`;
    return;
  }

  listContainer.innerHTML = currentModalEpisodes.map(ep => {
    const isWatched = watchedEpisodesSet.has(ep.id);
    return `
      <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition">
        <div class="flex-1 pr-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-amber-400">E${ep.episode_number}</span>
            <span class="text-xs font-semibold text-white truncate">${ep.title}</span>
          </div>
          <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${ep.overview || 'Episode summary available on watch.'}</p>
        </div>

        <button onclick="toggleWatchEpisode(${ep.id}, this)" 
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${isWatched ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'}">
          ${isWatched ? '✓ Watched' : '+ Mark Seen'}
        </button>
      </div>
    `;
  }).join("");
}

async function toggleWatchEpisode(episodeId, btn) {
  const isWatched = watchedEpisodesSet.has(episodeId);
  const newStatus = !isWatched;

  try {
    const res = await fetch(`${API_BASE}/episodes/watch`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ episode_id: episodeId, watched: newStatus })
    });

    if (res.ok) {
      if (newStatus) {
        watchedEpisodesSet.add(episodeId);
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
        btn.textContent = "✓ Watched";
      } else {
        watchedEpisodesSet.delete(episodeId);
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10";
        btn.textContent = "+ Mark Seen";
      }
      updateModalProgress();
    }
  } catch (err) {
    alert("Connection error while updating watch status.");
  }
}

function updateModalProgress() {
  if (currentModalEpisodes.length === 0) return;
  const watchedCount = currentModalEpisodes.filter(ep => watchedEpisodesSet.has(ep.id)).length;
  const percentage = Math.round((watchedCount / currentModalEpisodes.length) * 100);

  const bar = document.getElementById("modal-progress-bar");
  const text = document.getElementById("modal-progress-text");

  if (bar) bar.style.width = `${percentage}%`;
  if (text) text.textContent = `${percentage}% Watched (${watchedCount}/${currentModalEpisodes.length})`;
}

function closeDetailsModal() {
  document.getElementById("details-modal").classList.add("hidden");
}

function renderAuthButton() {
  const container = document.getElementById("auth-section");
  if (!container) return;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  if (currentUser) {
    container.innerHTML = `
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-xs font-semibold text-slate-300">👤 ${currentUser.username}</span>
        <button onclick="logout()" class="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-rose-400 text-xs rounded-lg transition">Logout</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openAuthModal()" id="login-btn" class="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20">
        ${t.btn_signin}
      </button>
    `;
  }
}

function openAuthModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  document.getElementById("auth-title").textContent = authMode === "login" ? t.auth_login_title : t.auth_reg_title;
  document.getElementById("auth-subtitle").textContent = authMode === "login" ? t.auth_login_sub : t.auth_reg_sub;
  document.getElementById("auth-submit-btn").textContent = authMode === "login" ? t.btn_signin : t.auth_create_one;
  document.getElementById("auth-switch-text").textContent = authMode === "login" ? t.auth_no_account : t.auth_has_account;
  document.getElementById("auth-switch-btn").textContent = authMode === "login" ? t.auth_create_one : t.auth_login_link;
}

async function submitAuth() {
  const username = document.getElementById("auth-username").value;
  const password = document.getElementById("auth-password").value;

  if (!username || !password) {
    alert("Please fill both username and password");
    return;
  }

  const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
      currentUser = data;
      localStorage.setItem("cinedex_user", JSON.stringify(data));
      closeAuthModal();
      renderAuthButton();
      await fetchStatusMap();
      await fetchWatchedEpisodes();
      renderGrid();
    } else {
      alert(data.detail || "Authentication failed");
    }
  } catch (err) {
    alert("Connection error to API");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("cinedex_user");
  renderAuthButton();
  fetchStatusMap().then(() => renderGrid());
}
