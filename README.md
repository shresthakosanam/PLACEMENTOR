# PLACEMENTOR

AI-Powered placement readiness analyzer with a frontend landing page and Node.js backend.

## Features

- Interactive HTML/CSS frontend form
- Resume upload support via backend file upload
- Mock readiness scoring based on profile inputs
- JSON preview of backend analysis results
- Simple Express API powering analysis logic

## Project structure

- `Placementor.html` — frontend UI with form and results view
- `server.js` — Node.js / Express backend with `/api/analyze`
- `package.json` — Node dependencies and start script
- `.gitignore` — ignores `node_modules`, `uploads`, and `.env`

## Setup

1. Open a terminal in the project folder:
   ```bash
   cd "c:\Users\Kosanam Shreshta\OneDrive\Desktop\PLACEMENTOR"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm start
   ```
4. Open the app in your browser:
   ```text
   http://localhost:3000/
   ```

## How it works

- The frontend submits the form to `/api/analyze`.
- The backend accepts the uploaded resume and form data.
- A mock scoring system generates:
  - readiness score
  - score breakdown
  - skill gap recommendations
  - project suggestions
  - resume tips
  - personalized roadmap
- The frontend displays the analysis and optional JSON preview.

## Sample usage

1. Open the app at `http://localhost:3000/`.
2. Enter a GitHub username, for example `johndoe`.
3. Optionally add a LinkedIn URL such as `https://linkedin.com/in/johndoe`.
4. Upload your resume file (`.pdf`, `.doc`, or `.docx`).
5. Enter coding profile usernames for LeetCode and CodeChef, or leave blank if you do not have them.
6. Select a target role such as `Backend Developer` or `Full Stack Developer`.
7. Choose your communication skills rating from 1 to 5.
8. Click `Analyze Profile`.

The app will show a readiness score, breakdown of analysis categories, recommended projects, resume tips, and a JSON preview of the backend response.

## GitHub repository

https://github.com/shresthakosanam/PLACEMENTOR

## Deployment

This app can be deployed to any Node.js hosting service.

### Render

1. Create a new Web Service.
2. Connect to your GitHub repo.
3. Set the build command to:
   ```bash
   npm install
   ```
4. Set the start command to:
   ```bash
   npm start
   ```
5. Ensure the root directory is the repository root.

### Other services

- Vercel: use a custom server configuration or a Docker deployment.
- Heroku: use the default Node.js buildpack and `npm start`.

## Notes

- This backend uses mock scoring logic for demo purposes.
- For production, replace the scoring with real resume parsing and profile data analysis.
