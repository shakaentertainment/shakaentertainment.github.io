const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const popularMoviesContainer = document.getElementById('popular-movies-container');
const topRatedMoviesContainer = document.getElementById('top-rated-movies-container');
const upcomingMoviesContainer = document.getElementById('upcoming-movies-container');
const searchResultsContainer = document.getElementById('search-results-container');
const searchResultsSection = document.getElementById('search-results');
const mainSections = [
    document.getElementById('popular-movies'),
    document.getElementById('top-rated-movies'),
    document.getElementById('upcoming-movies')
];

// API KEYS
const OMDB_API_KEY = 'e449cb2d'; // OMDb API key
const TMDB_API_KEY = '47cbba1c943d155246a15ab01fb2c339'; // <-- Replace with your TMDb API key

// TMDb endpoints
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';

async function fetchTMDbMovies(endpoint) {
    const res = await fetch(`${TMDB_BASE}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    return data.results || [];
}

function createCarouselControls(container) {
    container.parentElement.querySelectorAll('.carousel-btn').forEach(btn => btn.remove());

    const leftBtn = document.createElement('button');
    leftBtn.className = 'carousel-btn left';
    leftBtn.innerHTML = '&#8592;';
    leftBtn.onclick = () => {
        container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
    };

    const rightBtn = document.createElement('button');
    rightBtn.className = 'carousel-btn right';
    rightBtn.innerHTML = '&#8594;';
    rightBtn.onclick = () => {
        container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
    };

    container.parentElement.appendChild(leftBtn);
    container.parentElement.appendChild(rightBtn);
}

function displayMovies(movies, container, isTMDb = false) {
    container.innerHTML = '';
    movies.forEach((movie) => {
        let poster = isTMDb
            ? (movie.poster_path ? `${TMDB_IMAGE}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image')
            : (movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image');
        let title = isTMDb ? movie.title : (movie.Title || movie.Name);
        let year = isTMDb ? (movie.release_date ? movie.release_date.slice(0, 4) : '') : (movie.Year || '');

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="movie-card-content">
                <h3>${title}</h3>
                <p>Year: ${year}</p>
            </div>
        `;
        container.appendChild(movieCard);
    });
    createCarouselControls(container);
}

async function loadInitialMovies() {
    // Popular
    const popular = await fetchTMDbMovies('/movie/popular');
    displayMovies(popular, popularMoviesContainer, true);

    // Top Rated
    const topRated = await fetchTMDbMovies('/movie/top_rated');
    displayMovies(topRated, topRatedMoviesContainer, true);

    // Upcoming
    const upcoming = await fetchTMDbMovies('/movie/upcoming');
    displayMovies(upcoming, upcomingMoviesContainer, true);
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm) {
        const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();

        mainSections.forEach(section => section.classList.add('hidden'));
        searchResultsSection.classList.remove('hidden');

        if (data.Search) {
            displayMovies(data.Search, searchResultsContainer);
        } else {
            searchResultsContainer.innerHTML = '<h2>No movies found</h2>';
        }
    }
});

document.querySelector('header h1').addEventListener('click', () => {
    mainSections.forEach(section => section.classList.remove('hidden'));
    searchResultsSection.classList.add('hidden');
    searchInput.value = '';
});

window.addEventListener('DOMContentLoaded', loadInitialMovies);

