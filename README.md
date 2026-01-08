# BuildTrust Frontend

React + TypeScript + Vite frontend application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3001/api
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:8080

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

- `src/components` - React components
- `src/pages` - Page components
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions and API client
- `src/components/ui` - shadcn/ui components

## API Integration

The frontend communicates with the backend API through the API client in `src/lib/api.ts`. All API requests are authenticated using JWT tokens stored in localStorage.

# buildtrust
