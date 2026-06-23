import { useState, useEffect, use } from "react";
import { Search, ArrowLeft, Star, Heart, Loader2 } from "lucide-react"; // Added Loader2 for loading spinner
import { motion, AnimatePresence } from "framer-motion";

//  SEARCH BAR COMPONENT

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <form
      onSubmit={handleSearch}
      className="mt-6 max-w-2xl mx-auto flex items-center gap-2 mb-10"
    >
      <input
        type="text"
        placeholder="Search for movies (e.g., Inception, Avengers)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 text-white px-5 py-3 rounded-lg focus:outline-none focus:border-emerald-400 transition-colors"
      />
      <button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
    </form>
  );
};

// MOVIE CARD COMPONENT

const MovieCard = ({ movie, onClick, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 cursor-pointer flex flex-col"
    >
      <button
        onClick={(e) => onToggleFavorite(movie, e)}
        className="absolute top-3 right-3 p-2 bg-slate-900/80 rounded-full hover:bg-slate-900 transition-colors z-10 cursor-pointer"
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
        />
      </button>

      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/400x600?text=No+Poster"
        }
        alt={movie.Title}
        className="w-full h-[400px] object-cover"
      />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <h2 className="text-xl font-bold mb-1 line-clamp-1" title={movie.Title}>
          {movie.Title}
        </h2>
        <p className="text-emerald-400 font-semibold">{movie.Year}</p>
      </div>
    </motion.div>
  );
};

//  MOVIE DETAILS COMPONENT

const MovieDetails = ({ movie, onBack }) => {
  const [fullDetails, setFullDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetails = async () => {
      setIsLoading(true);

      const API_KEY = "6374127f";

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`,
        );
        const data = await response.json();
        setFullDetails(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullDetails();
  }, [movie.imdbID]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 p-8 mt-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8 transition-colors cursor-pointer font-semibold"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/400x600?text=No+Poster"
          }
          alt={movie.Title}
          className="w-full md:w-1/3 rounded-lg object-cover shadow-lg self-start"
        />

        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-2">{movie.Title}</h2>
          <p className="text-gray-400 text-xl mb-6">{movie.Year}</p>

          {isLoading ? (
            <div className="flex items-center gap-3 text-emerald-400 text-lg py-10">
              <Loader2 className="w-6 h-6 animate-spin" />
              Loading full movie details...
            </div>
          ) : fullDetails ? (
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 space-y-6">
              <div>
                <h3 className="text-emerald-400 font-semibold mb-2 text-lg">
                  Plot
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {fullDetails.Plot}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-1">
                    Director
                  </h3>
                  <p className="text-gray-300">{fullDetails.Director}</p>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-1">Cast</h3>
                  <p className="text-gray-300">{fullDetails.Actors}</p>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-1">Genre</h3>
                  <p className="text-gray-300">{fullDetails.Genre}</p>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-1">
                    Details
                  </h3>
                  <p className="text-gray-300 flex items-center gap-3">
                    <span>{fullDetails.Runtime}</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      {fullDetails.imdbRating}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

//  MAIN APP COMPONENT

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);

  //  States for loading and errors on the home page
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("movieFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("movieFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchMovies = async (searchQuery) => {
    setIsLoading(true);
    setError(null);

    const API_KEY = "6374127f";

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`,
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(...movies, data.Search);
      } else {
        setMovies([]);
        setError(data.Error); // Sets error to "Movie not found!" from OMDB
      }
    } catch (err) {
      setError("Failed to fetch movies. Please check your connection.");
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies("Batman");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchMovies(searchTerm);
      setCurrentView("home");
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setCurrentView("details");
  };

  const handleBackToHome = () => {
    setSelectedMovie(null);
    setCurrentView("home");
  };

  const toggleFavorite = (movie, e) => {
    e.stopPropagation();
    const isAlreadyFavorite = favorites.some(
      (fav) => fav.imdbID === movie.imdbID,
    );

    if (isAlreadyFavorite) {
      setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 overflow-x-hidden">
      <header className="mb-6 text-center flex flex-col items-center">
        <h1
          className="text-4xl font-bold text-emerald-400 cursor-pointer inline-block mb-6"
          onClick={handleBackToHome}
        >
          Movie Discovery App
        </h1>

        <nav className="flex gap-4 mb-4">
          <button
            onClick={() => setCurrentView("home")}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${currentView === "home" ? "bg-emerald-500 text-white" : "bg-slate-800 text-emerald-400 hover:bg-slate-700"}`}
          >
            Search
          </button>
          <button
            onClick={() => setCurrentView("favorites")}
            className={`px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer ${currentView === "favorites" ? "bg-red-500 text-white" : "bg-slate-800 text-red-400 hover:bg-slate-700"}`}
          >
            <Heart
              className={`w-4 h-4 ${favorites.length > 0 ? "fill-current" : ""}`}
            />
            My Watchlist ({favorites.length})
          </button>
        </nav>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {currentView === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              />

              {/* Conditional UI based on Loading or Error states */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20 text-emerald-500">
                  <Loader2 className="w-12 h-12 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <h2 className="text-3xl font-bold text-gray-400 mb-2">
                    Oops!
                  </h2>
                  <p className="text-xl text-red-400">{error}</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                >
                  <AnimatePresence>
                    {movies.map((movie) => (
                      <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                        isFavorite={favorites.some(
                          (fav) => fav.imdbID === movie.imdbID,
                        )}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* FAVORITES VIEW */}
          {currentView === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto mt-10"
            >
              {favorites.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                >
                  <AnimatePresence>
                    {favorites.map((movie) => (
                      <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center bg-slate-800 p-12 rounded-xl border border-slate-700">
                  <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-300 mb-2">
                    Your Watchlist is empty
                  </h2>
                  <p className="text-gray-400">
                    Search for movies and click the heart icon to save them
                    here!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* DETAILS VIEW */}
          {currentView === "details" && selectedMovie && (
            <motion.div key="details">
              <MovieDetails movie={selectedMovie} onBack={handleBackToHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
