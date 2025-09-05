# Watchlister: Your Ultimate Movie & TV Show Tracker

Track, discover, and enjoy movies and TV shows effortlessly. Watchlister helps you build a personalized watchlist, keep tabs on your viewing progress, and explore new content with rich details and trailers.

## Installation

To get Watchlister up and running on your local machine, follow these steps:

### Clone the Repository
Start by cloning the project repository to your local machine:

```bash
git clone https://github.com/Idris-jose/watchfinder.git
cd watchfinder
```

### Install Dependencies
Install all required project dependencies using npm:

```bash
npm install
```

### Environment Variables
Watchlister relies on Firebase and TMDB for its functionality. You need to set up a `.env` file in the root of your project with the following variables. Replace the placeholder values with your actual API keys and configuration from Firebase and TMDB.

```
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
VITE_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
VITE_TMDB_API_KEY="YOUR_TMDB_API_KEY"
```

**Note:** The Firebase configuration is found in `src/firebase-config.js`. For production, it's best practice to protect these keys. For local development, using a `.env` file and Vite's `VITE_` prefix for environment variables is appropriate.

### Start the Development Server
Once dependencies are installed and environment variables are configured, you can start the development server:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### Build for Production
To create an optimized production build, run:

```bash
npm run build
```
The production-ready files will be generated in the `dist/` directory.

## Usage

Watchlister provides a seamless experience for managing your entertainment.

1.  **Authentication**: Sign up or log in using your email and password, or conveniently use your Google account.
2.  **Discover Content**: Explore trending, popular, and top-rated movies and TV shows. Use advanced filters to narrow down content by genres, minimum rating, and release year.
3.  **Search**: Quickly find any movie or TV show using the search bar. Results are comprehensive and provide relevant details.
4.  **Manage Watchlist**:
    *   **Add/Remove**: Easily add interesting titles to your watchlist directly from discovery or search results. Remove them when you're no longer interested.
    *   **Mark as Watched**: Keep track of what you've seen by marking items as "watched." This helps you maintain an organized list.
    *   **Set Priority**: Assign high, medium, or low priority to items in your watchlist, allowing you to prioritize your viewing.
5.  **View Details & Trailers**: Click on any movie or TV show to view its overview, genres, status, runtime/seasons, ratings, and watch trailers directly within the app.
6.  **Share Your Watchlist**: Generate a unique shareable link for your watchlist, allowing friends to view it. You can control whether others can copy your list to their own accounts and see view/copy statistics.

## Features

*   **User Authentication**: Secure sign-up and login using email/password or Google integration, powered by Firebase Authentication.
*   **Dynamic Content Discovery**: Explore an extensive library of movies and TV shows with filters for genres, ratings, and release years.
*   **Intuitive Search Functionality**: Search across both movies and TV shows with instant results and detailed content previews.
*   **Personalized Watchlist Management**: Add, remove, mark as watched, and set viewing priorities for your favorite titles.
*   **Watchlist Sharing**: Generate unique, shareable links for your watchlist, offering control over privacy and allowing others to copy your curated lists. Includes analytics for views and copies.
*   **Real-time Data Synchronization**: Your watchlist and watched items are seamlessly synced across devices using Firebase Firestore.
*   **Rich Content Details**: Access comprehensive information, including overviews, genres, release dates, and integrated YouTube trailers for each title.
*   **Responsive User Interface**: Enjoy a consistent experience across desktop and mobile devices, featuring dedicated navigation for each.
*   **Search Engine Optimization (SEO)**: Dynamic meta tags ensure discoverability and rich previews when shared online.
*   **Achievement System**: Rewards users for actively building and managing their watchlists.
*   **Modern UI/UX**: Built with Tailwind CSS for rapid styling and Framer Motion for smooth animations and transitions.

## Technologies Used

| Category     | Technology                                                                                                                                              | Description                                            |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------- |
| **Frontend** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)                                           | JavaScript library for building user interfaces.       |
|              | ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)                                                 | Next-generation frontend tooling for fast development. |
|              | ![TailwindCSS](https://img.shields.io/badge/tailwind_css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)                         | Utility-first CSS framework for rapid UI development.  |
|              | ![Framer Motion](https://img.shields.io/badge/Framer--Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)                                   | Production-ready motion library for React.             |
|              | ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)                                | Declarative routing for React applications.            |
|              | ![Lucide React](https://img.shields.io/badge/Lucide-black?style=for-the-badge&logo=lucide&logoColor=white)                                             | Modern, lightweight, and customizable SVG icon library. |
|              | ![React Hot Toast](https://img.shields.io/badge/react--hot--toast-FF4F5E?style=for-the-badge&logo=react-hot-toast&logoColor=white)                   | Accessible, customizable, and beautiful toast notifications. |
| **Backend/DB** | ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)                                                     | Google's platform for developing mobile and web applications (Authentication, Firestore). |
| **API**      | [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)                                                                           | Provides comprehensive movie and TV show data.         |
| **Deployment** | ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)                                         | Cloud platform for static sites and serverless functions. |
| **Linting**  | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)                                                   | Pluggable JavaScript linter.                           |
| **Analytics**| ![Vercel Analytics](https://img.shields.io/badge/Vercel_Analytics-black?style=for-the-badge&logo=vercel&logoColor=white)                               | Real-time insights into website performance and user behavior. |

## Contributing

We welcome contributions to make Watchlister even better! Here’s how you can help:

*   Fork the repository.
*   Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.
*   Make your changes and ensure your code adheres to the project's coding standards.
*   Write clear, concise commit messages.
*   Push your branch: `git push origin feature/your-feature-name`.
*   Open a pull request with a detailed description of your changes.

## License

This project is currently unlicensed. Please contact the author for licensing information.

## Author Info

**Idris-jose**

*   **GitHub**: [Idris-jose](https://github.com/Idris-jose)
*   **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/idrisjose)
*   **Portfolio**: [Your Portfolio/Website](https://your-portfolio.com)

---

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwind_css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)