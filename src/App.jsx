
import { useEffect, useState } from "react";
import "./App.css";

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      alert("Storage full! Please use smaller images.");
    }
  }, [key, value]);

  return [value, setValue];
}

function readImage(file, callback) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  if (file.size > 2.5 * 1024 * 1024) {
    alert("Please select an image below 2.5 MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

const quotes = [
  "Your vibe attracts your tribe.",
  "Dream big. Work hard. Stay focused.",
  "Create your own sunshine.",
  "Small steps every day lead to big results.",
  "Be the energy you want to attract."
];

const moods = [
  "😊 Happy",
  "😎 Cool",
  "🔥 Motivated",
  "😴 Sleepy",
  "💜 Peaceful",
  "🎧 Music"
];

function App() {
  const [name, setName] = useStoredState("vibespace-name", "Anil");
  const [profilePhoto, setProfilePhoto] = useStoredState("vibespace-profile-photo", "");
  const [mood, setMood] = useStoredState("vibespace-mood", "😊 Happy");
  const [theme, setTheme] = useStoredState("vibespace-theme", "purple");
  const [wallpaper, setWallpaper] = useStoredState("vibespace-wallpaper", "");

  const [tasks, setTasks] = useStoredState("vibespace-tasks", []);
  const [goals, setGoals] = useStoredState("vibespace-goals", []);
  const [songs, setSongs] = useStoredState("vibespace-songs", []);
  const [gallery, setGallery] = useStoredState("vibespace-gallery", []);
  const [movies, setMovies] = useStoredState("vibespace-tollywood-movies", []);

  const [taskInput, setTaskInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [songInput, setSongInput] = useState("");

  const [movieName, setMovieName] = useState("");
  const [movieHero, setMovieHero] = useState("");
  const [movieDirector, setMovieDirector] = useState("");
  const [movieDate, setMovieDate] = useState("");
  const [moviePoster, setMoviePoster] = useState("");
  const [moviePosterName, setMoviePosterName] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completedTasks = tasks.filter(task => task.done).length;
  const pendingTasks = tasks.length - completedTasks;

  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const addTask = () => {
    if (!taskInput.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: taskInput.trim(), done: false }
    ]);

    setTaskInput("");
  };

  const toggleTask = id => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;

    setGoals([
      ...goals,
      { id: Date.now(), text: goalInput.trim() }
    ]);

    setGoalInput("");
  };

  const deleteGoal = id => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const addSong = () => {
    if (!songInput.trim()) return;

    let videoId = songInput.trim();

    try {
      if (videoId.includes("youtu.be/")) {
        videoId = videoId.split("youtu.be/")[1].split("?")[0];
      } else if (videoId.includes("youtube.com/watch")) {
        videoId = new URL(videoId).searchParams.get("v");
      } else if (videoId.includes("youtube.com/embed/")) {
        videoId = videoId.split("youtube.com/embed/")[1].split("?")[0];
      }

      if (!videoId) throw new Error("Invalid URL");

      setSongs([...songs, { id: Date.now(), videoId }]);
      setSongInput("");
    } catch {
      alert("Please enter a valid YouTube link.");
    }
  };

  const deleteSong = id => {
    setSongs(songs.filter(song => song.id !== id));
  };

  const addGalleryPhoto = event => {
    const file = event.target.files[0];

    readImage(file, image => {
      setGallery(previous => [
        ...previous,
        { id: Date.now(), image }
      ]);
    });

    event.target.value = "";
  };

  const deleteGalleryPhoto = id => {
    setGallery(gallery.filter(photo => photo.id !== id));
  };

  const addMovie = event => {
    event.preventDefault();

    if (
      !movieName.trim() ||
      !movieHero.trim() ||
      !movieDirector.trim() ||
      !movieDate
    ) {
      alert("Please fill all movie details.");
      return;
    }

    const newMovie = {
      id: Date.now(),
      name: movieName.trim(),
      hero: movieHero.trim(),
      director: movieDirector.trim(),
      date: movieDate,
      poster: moviePoster
    };

    setMovies(previous => [...previous, newMovie]);

    setMovieName("");
    setMovieHero("");
    setMovieDirector("");
    setMovieDate("");
    setMoviePoster("");
    setMoviePosterName("");

    alert("Movie added to your cinema!");
  };

  const updateMoviePoster = (id, event) => {
    const file = event.target.files[0];

    readImage(file, image => {
      setMovies(previous =>
        previous.map(movie =>
          movie.id === id
            ? { ...movie, poster: image }
            : movie
        )
      );
    });

    event.target.value = "";
  };

  const deleteMovie = id => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const changeProfilePhoto = event => {
    readImage(event.target.files[0], setProfilePhoto);
    event.target.value = "";
  };

  const changeWallpaper = event => {
    readImage(event.target.files[0], setWallpaper);
    event.target.value = "";
  };

  const changeNewMoviePoster = event => {
    const file = event.target.files[0];
    if (!file) return;

    readImage(file, image => {
      setMoviePoster(image);
      setMoviePosterName(file.name);
    });

    event.target.value = "";
  };

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString("en-IN");

  return (
    <div
      className={`app theme-${theme}`}
      style={wallpaper ? {
        backgroundImage: `linear-gradient(#0b0b18bb, #0b0b18dd), url(${wallpaper})`
      } : {}}
    >
      <aside className="sidebar">
        <div className="brand">✦ VibeSpace</div>
        <p className="sidebar-subtitle">YOUR DIGITAL WORLD</p>

        <nav>
          <a href="#home">⌂ <span>Home</span></a>
          <a href="#profile">♙ <span>My Profile</span></a>
          <a href="#tasks">✓ <span>My Tasks</span></a>
          <a href="#goals">✧ <span>My Goals</span></a>
          <a href="#music">♫ <span>Music Space</span></a>
          <a href="#gallery">▧ <span>My Gallery</span></a>
          <a href="#movies">🎬 <span>Tollywood</span></a>
          <a href="#settings">⚙ <span>Settings</span></a>
        </nav>

        <div className="sidebar-bottom">
          <span>Made with 💜</span>
          <strong>VibeSpace © 2026</strong>
        </div>
      </aside>

      <main className="main-content">
        <section id="home" className="hero">
          <div>
            <p className="eyebrow">WELCOME TO YOUR SPACE ✨</p>
            <h1>Hello, {name}! 👋</h1>
            <p className="hero-description">
              This is your world. Make it yours.
            </p>

            <div className="date-time">
              <span>📅 {formattedDate}</span>
              <span>🕒 {formattedTime}</span>
            </div>
          </div>

          <div className="hero-mood">
            <span className="mood-label">CURRENT VIBE</span>
            <strong>{mood}</strong>

            <select value={mood} onChange={e => setMood(e.target.value)}>
              {moods.map(item => <option key={item}>{item}</option>)}
            </select>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>📝</span><p>Total Tasks</p><h2>{tasks.length}</h2>
          </div>
          <div className="stat-card">
            <span>✅</span><p>Completed</p><h2>{completedTasks}</h2>
          </div>
          <div className="stat-card">
            <span>⏳</span><p>Pending</p><h2>{pendingTasks}</h2>
          </div>
          <div className="stat-card">
            <span>🎯</span><p>My Goals</p><h2>{goals.length}</h2>
          </div>
        </section>

        <section id="profile" className="section-card profile-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR IDENTITY</p>
              <h2>My Profile 👤</h2>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-avatar">
              {profilePhoto
                ? <img src={profilePhoto} alt="Profile" />
                : <span>👤</span>}
            </div>

            <div className="profile-details">
              <label>Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} />

              <label className="upload-label">
                📷 Change Profile Photo
                <input type="file" accept="image/*" onChange={changeProfilePhoto} />
              </label>
            </div>
          </div>
        </section>

        <section className="section-card quote-card">
          <p className="eyebrow">DAILY INSPIRATION</p>
          <h2>“{quotes[quoteIndex]}”</h2>
          <button
            className="small-button"
            onClick={() => setQuoteIndex((quoteIndex + 1) % quotes.length)}
          >
            ✨ New Quote
          </button>
        </section>

        <section id="tasks" className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">STAY PRODUCTIVE</p>
              <h2>My Tasks 📝</h2>
            </div>
            <span className="count-badge">{tasks.length} TASKS</span>
          </div>

          <div className="add-row">
            <input
              placeholder="What do you want to do?"
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
            />
            <button onClick={addTask}>+ Add Task</button>
          </div>

          <div className="item-list">
            {tasks.length === 0 && <p className="empty-text">No tasks added yet.</p>}

            {tasks.map(task => (
              <div className="list-item" key={task.id}>
                <label className={task.done ? "completed" : ""}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  {task.text}
                </label>
                <button className="delete-button" onClick={() => deleteTask(task.id)}>✕</button>
              </div>
            ))}
          </div>
        </section>

        <section id="goals" className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THINK BIG</p>
              <h2>My Goals 🎯</h2>
            </div>
            <span className="count-badge">{goals.length} GOALS</span>
          </div>

          <div className="add-row">
            <input
              placeholder="Add your dream or goal..."
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addGoal()}
            />
            <button onClick={addGoal}>+ Add Goal</button>
          </div>

          <div className="item-list">
            {goals.length === 0 && <p className="empty-text">Your goals will appear here.</p>}

            {goals.map(goal => (
              <div className="list-item" key={goal.id}>
                <span>⭐ {goal.text}</span>
                <button className="delete-button" onClick={() => deleteGoal(goal.id)}>✕</button>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card progress-card">
          <p className="eyebrow">YOUR PRODUCTIVITY</p>
          <h2>Progress Overview 📊</h2>

          <div className="progress-info">
            <strong>{progress}%</strong>
            <span>{completedTasks} of {tasks.length} tasks completed</span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section id="music" className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR SOUNDTRACK</p>
              <h2>Music Space 🎧</h2>
            </div>
            <span className="count-badge">{songs.length} SONGS</span>
          </div>

          <div className="add-row">
            <input
              placeholder="Paste YouTube video link..."
              value={songInput}
              onChange={e => setSongInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSong()}
            />
            <button onClick={addSong}>+ Add Song</button>
          </div>

          <div className="music-grid">
            {songs.length === 0 && <p className="empty-text">No songs added yet.</p>}

            {songs.map(song => (
              <div className="music-card" key={song.id}>
                <iframe
                  src={`https://www.youtube.com/embed/${song.videoId}`}
                  title="YouTube music player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <button className="delete-button" onClick={() => deleteSong(song.id)}>
                  ✕ Remove Song
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className="section-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR MEMORIES</p>
              <h2>My Gallery 📸</h2>
            </div>

            <label className="upload-label">
              + Upload Photo
              <input type="file" accept="image/*" onChange={addGalleryPhoto} />
            </label>
          </div>

          <div className="gallery-grid">
            {gallery.length === 0 && <p className="empty-text">Your gallery is waiting for photos.</p>}

            {gallery.map(photo => (
              <div className="gallery-item" key={photo.id}>
                <img src={photo.image} alt="Gallery" />
                <button onClick={() => deleteGalleryPhoto(photo.id)}>✕</button>
              </div>
            ))}
          </div>
        </section>

        <section id="movies" className="section-card movies-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TOLLYWOOD COLLECTION</p>
              <h2>Upcoming Tollywood 🎬</h2>
              <p className="section-description">
                Keep your most-awaited movies in one place.
              </p>
            </div>
            <span className="count-badge">{movies.length} MOVIES</span>
          </div>

          <form className="movie-form" onSubmit={addMovie}>
            <div className="movie-form-heading">
              <div className="movie-icon">🎥</div>
              <div>
                <h2>Add To My Cinema</h2>
                <p>Save a movie you're excited about.</p>
              </div>
            </div>

            <div className="movie-input-grid">
              <input
                placeholder="🎬 Movie Name"
                value={movieName}
                onChange={e => setMovieName(e.target.value)}
                required
              />
              <input
                placeholder="⭐ Hero / Lead Actor"
                value={movieHero}
                onChange={e => setMovieHero(e.target.value)}
                required
              />
              <input
                placeholder="🎞️ Director Name"
                value={movieDirector}
                onChange={e => setMovieDirector(e.target.value)}
                required
              />
              <input
                type="date"
                value={movieDate}
                onChange={e => setMovieDate(e.target.value)}
                required
              />
            </div>

            <div className="new-poster-upload">
              {moviePoster ? (
                <img src={moviePoster} alt="Selected movie poster" />
              ) : (
                <span>🖼️</span>
              )}

              <div>
                <strong>{moviePosterName || "Choose Movie Poster (Optional)"}</strong>
                <p>Select a poster image from your computer</p>

                <label className="upload-label">
                  📁 Choose Poster
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeNewMoviePoster}
                  />
                </label>
              </div>
            </div>

            <button className="movie-submit" type="submit">
              ＋ ADD TO MY CINEMA
            </button>
          </form>

          <div className="movies-grid">
            {movies.length === 0 && (
              <p className="empty-text">
                No movies added yet. Add your favourite movies above!
              </p>
            )}

            {movies.map(movie => (
              <article className="movie-card" key={movie.id}>
                <div className="movie-poster">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={`${movie.name} poster`}
                      onError={e => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="poster-placeholder">
                      <span>🎬</span>
                      <strong>{movie.name}</strong>
                      <small>Upload a movie poster</small>
                    </div>
                  )}

                  <label className="poster-upload-button">
                    📷 {movie.poster ? "Change Poster" : "Upload Poster"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => updateMoviePoster(movie.id, e)}
                    />
                  </label>
                </div>

                <div className="movie-info">
                  <h3>{movie.name}</h3>
                  <p>⭐ {movie.hero}</p>
                  <p>🎬 {movie.director}</p>
                  <p>📅 {movie.date}</p>

                  <button
                    className="delete-button"
                    onClick={() => deleteMovie(movie.id)}
                  >
                    ✕ Remove Movie
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="settings" className="section-card">
          <p className="eyebrow">MAKE IT YOURS</p>
          <h2>Settings ⚙️</h2>

          <h3 className="settings-title">Choose Theme</h3>

          <div className="theme-options">
            {["purple", "ocean", "sunset", "forest"].map(item => (
              <button
                key={item}
                className={`theme-option ${item} ${theme === item ? "active" : ""}`}
                onClick={() => setTheme(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <h3 className="settings-title">Custom Wallpaper</h3>

          <div className="settings-actions">
            <label className="upload-label">
              🖼️ Upload Wallpaper
              <input type="file" accept="image/*" onChange={changeWallpaper} />
            </label>

            {wallpaper && (
              <button className="small-button" onClick={() => setWallpaper("")}>
                Remove Wallpaper
              </button>
            )}
          </div>
        </section>

        <footer className="footer">
          <h2>VibeSpace 💜</h2>
          <p>Your mood. Your music. Your memories. Your world.</p>
          <span>Made with ❤️ by {name}</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
