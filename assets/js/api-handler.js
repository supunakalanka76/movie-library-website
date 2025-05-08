// Movie Search and Grid Functionality
document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('movie-search').value;
    if (query) {
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const data = await response.json();
            displayMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            alert('Failed to fetch movies. Please try again.');
        }
    }
});

function displayMovies(movies) {
    const grid = document.querySelector('.movie-grid');
    
    // Clear existing dynamic items (keep the first 3 static ones)
    while (grid.children.length > 3) {
        grid.removeChild(grid.lastChild);
    }
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <img src="${movie.show.image?.medium || 'https://via.placeholder.com/300x200'}" alt="${movie.show.name}">
            <div class="movie-item-content">
                <h3>${movie.show.name}</h3>
                <p>${movie.show.summary?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No description available'}...</p>
                <button class="remove-btn">Remove</button>
            </div>
        `;
        grid.appendChild(movieItem);
    });
    
    // Add event listeners to new remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.movie-item').remove();
        });
    });
}

// Add event listeners to initial remove buttons
document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.movie-item').remove();
    });
});