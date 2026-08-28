# Northstar PIM Console

A focused Product Information Management administration console for centralized catalog operations and enterprise publishing workflows.

## Features

- Product catalog dashboard with key catalog metrics
- Search by product name, SKU, or category
- Filter products by publishing status
- Table and grid views
- Bulk product selection and publish queue feedback
- Responsive desktop and mobile layouts
- Express API health endpoint for service checks

## Tech Stack

- React 19
- Vite
- Express
- Lucide React
- CSS with responsive breakpoints

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

The Vite development server runs at `http://localhost:5173`.

### Start the API

```bash
npm run server
```

The Express server runs at `http://localhost:3000` by default. Check its status with:

```text
GET /api/health
```

Example response:

```json
{"status":"ok","service":"pim-api"}
```

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express API |
| `npm run build` | Create a production frontend build in `dist/` |
| `npm run preview` | Preview the production frontend build |

## Project Structure

```text
.
├── index.html          Vite HTML entry point
├── server.js           Express API entry point
├── src/
│   ├── main.jsx        React application and catalog interactions
│   └── styles.css      Application styling and responsive layout
├── vite.config.js      Vite configuration
└── package.json        Scripts and dependencies
```

## Current Data Layer

The catalog currently uses representative in-memory product data in `src/main.jsx` so the administration workflow can be explored immediately. The Express server exposes a health check only; persistence, Elasticsearch indexing, authentication, and third-party REST integrations are ready to be added behind the existing UI and API boundaries.

## Production Build

```bash
npm run build
npm run preview
```
