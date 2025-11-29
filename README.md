# Shreyan's Arc

A personal DSA (Data Structures and Algorithms) roadmap and tracker application.

## Features

- **Interactive Roadmap**: Visual tree-like structure for DSA topics.
- **Progress Tracking**: Track solved questions and category completion.
- **Firebase Integration**: Persist progress across devices (requires configuration).
- **Responsive Design**: Works on desktop and mobile.
- **NeetCode Inspired UI**: Dark mode, sleek aesthetics.

## Project Structure

The project follows a standard Vite/React structure:

- `src/`: Source code
    - `components/`: React components
    - `data/`: Question data and roadmap structure
    - `lib/`: Firebase configuration and utilities
    - `App.tsx`: Main application component
    - `index.tsx`: Entry point
- `public/`: Static assets

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd shreyan's-arc
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    - Open `src/lib/firebase.ts` (or create `.env.local` if supported).
    - Add your Firebase configuration keys.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS (via CDN)
- Firebase

## License

[MIT](LICENSE)
