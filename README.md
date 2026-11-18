# Career Portfolio & Job-Search Assistant — Frontend

A React application that combines a developer portfolio with interactive career-support features, including job-description analysis and an AI chat experience.

## What’s in the app

- Portfolio sections for profile, experience, education, skills and projects
- Job-description analysis interface
- AI chat widget
- Responsive UI with reusable React components
- Animated interactions and data visualizations

## Tech stack

- React 19
- Vite 7
- Tailwind CSS 3
- Framer Motion
- OpenAI SDK
- Chart.js / react-chartjs-2
- React Markdown

## Run locally

```bash
git clone https://github.com/Nashid-k/job-cover-letter-frontend.git
cd job-cover-letter-frontend
npm install
npm run dev
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Related repository

The companion API repository contains authentication, profile and cover-letter endpoints:

[Career tools backend](https://github.com/Nashid-k/job-cover-letter-backend)

## Configuration

Configure any required API credentials and service URLs through environment variables. Do not commit real credentials; use a local `.env` file and keep it out of version control.
