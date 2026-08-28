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
├── server.js           Backward-compatible API entry point
├── backend/
│   ├── app.js           Express application composition
│   ├── server.js        API process entry point
│   ├── config/          Environment configuration
│   ├── data/            Development seed data
│   ├── db/              File-backed persistence adapter
│   ├── middleware/      Error and 404 handling
│   ├── repositories/    Product data access
│   ├── routes/          Health, catalog, and workflow routes
│   ├── services/        Catalog and search business logic
│   └── validators/      Product request validation
├── src/
│   ├── api/             Frontend API client
│   ├── main.jsx         React application and catalog interactions
│   └── styles.css       Application styling and responsive layout
├── vite.config.js      Vite configuration
└── package.json        Scripts and dependencies
```

## Current Data Layer

The catalog uses a JSON-backed development store at `backend/data/products.json`. This keeps the project runnable without infrastructure while preserving a repository boundary for a production database. Elasticsearch search is supported when `ELASTICSEARCH_URL` is configured; otherwise the service performs a local repository search. Authentication, migrations, and third-party integrations remain application extensions.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/products` | List, search, filter, and paginate products |
| `GET` | `/api/products/stats` | Return catalog metrics |
| `GET` | `/api/products/:sku` | Get one product |
| `POST` | `/api/products` | Create a product |
| `PATCH` | `/api/products/:sku` | Update a product |
| `DELETE` | `/api/products/:sku` | Delete a product |
| `POST` | `/api/workflows/publish` | Bulk publish products by SKU |

Product listing accepts `search`, `status`, `page`, and `pageSize` query parameters.

## Production Build

```bash
npm run build
npm run preview
```
