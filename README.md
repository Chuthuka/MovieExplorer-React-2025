# 🎬 MovieExplorer - Discover Your Favorite Films

A modern web application for exploring movies, viewing details, and discovering trending films. Built with React, TypeScript, and TMDb API.

## 🚀 Features

- User authentication with login interface
- Movie search functionality with real-time results
- Trending movies section with latest popular films
- Detailed movie view with overview, genre, cast, and YouTube trailer
- Favorites system to save and revisit preferred movies (with localStorage persistence)
- Light/dark mode toggle with yellow and black theme
- Mobile-first responsive design that works across all devices
- "Load More" button for pagination of movie results
- Dockerized for easy deployment and development
- Optimized for Vercel deployment

## 📱 Live Demo

Experience MovieExplorer in action: 

## 🖥️ Technologies Used

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- TMDb API for movie data
- Context API for state management
- Lucide React for icons
- Docker for containerization
- Vercel for hosting and deployment

## 🛠️ Quick Start

### Option 1: Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/movieexplorer.git
   cd movieexplorer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Update `.env` file in the root directory with your TMDb API key
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_TMDB_API_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

### Option 2: Using Docker

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/movieexplorer.git
   cd movieexplorer
   ```

2. Create a `.env` file with your TMDb API key as shown above

3. Build and run with Docker Compose
   ```bash
   docker-compose up -d
   ```

4. Access the application at http://localhost:5173

## 🚢 Deployment

### Deploy to Vercel

1. Fork or clone this repository to your GitHub account

2. Connect your GitHub repository to Vercel
   
3. Configure environment variables in Vercel:
   - `VITE_TMDB_API_KEY`
   - `VITE_TMDB_API_URL`
   - `VITE_TMDB_IMAGE_URL`

4. Deploy! Vercel will automatically build and deploy your app.

### Deploy with Docker

To deploy the Docker container on any platform that supports Docker:

```bash
# Build the image
docker build -t movieexplorer .

# Run the container
docker run -p 8080:80 -d movieexplorer
```

## 📱 Responsive Design

The application follows a mobile-first approach with optimized layouts for:
- Mobile devices (< 640px)
- Tablets (640px - 1024px) 
- Desktops (> 1024px)

All components are designed to provide an optimal experience on any device. The grid layout automatically adjusts based on screen size:
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 4-5 columns

## 🎨 Theme

The app features a distinctive yellow and black theme with support for both light and dark modes:

- Light mode: Yellow accents on white background
- Dark mode: Yellow accents on black background

User preferences are stored in localStorage and applied automatically on return visits.

## 🔒 Authentication

For demo purposes, the app uses a simplified authentication system stored in localStorage. Any username with a password of at least 4 characters will work.

## 🔍 Search Functionality

- Real-time search results from TMDb API
- "Load More" button to fetch additional results
- Last search term is saved in localStorage for convenience

## ❤️ Favorites

- Add/remove movies to your favorites list with a single click
- Complete favorites management using localStorage
- All favorites persist between sessions
- Dedicated favorites page to view and manage saved movies

## 🎥 Movie Details

Each movie page displays:

- Title, poster, and backdrop
- Release date, rating, and runtime
- Overview and genres
- Cast information with photos
- YouTube trailer (when available)

## 🔄 Data Persistence

The application stores the following data in localStorage:
- User authentication state
- Theme preference (light/dark)
- Favorite movies list
- Recent search terms

## 🧪 Docker Development

During development, you can use Docker to ensure a consistent environment:

```bash
# Start the development container
docker-compose -f docker-compose.dev.yml up

# Build for production
docker build -t movieexplorer:prod .
```

