DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS shows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    poster_path TEXT,
    vote_average NUMERIC(3, 1) DEFAULT 0.0
);

INSERT INTO shows (title, overview, poster_path, vote_average) VALUES
('Breaking Bad', 'A chemistry teacher turns to cooking meth.', 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', 9.5),
('Dexter', 'A forensic blood spatter analyst and serial killer.', 'https://image.tmdb.org/t/p/w500/58H6CtF0xvq11kffy7G7wB5pL2q.jpg', 8.7),
('Arcane', 'Tale of two sisters in Zaun and Piltover.', 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn397FvFeR2ca.jpg', 9.0);
