# AI-Powered Resume & Job Description Analyzer

A minor project by a team of 4, built progressively over 6 weeks.

## Team

| Member | Role | GitHub Profile |
|---|---|---|
| Shivansh Mishra | Backend + AI Engineer + Scrum Master | [@Shivansh-mishraji](https://github.com/Shivansh-mishraji) |
| Harshwardhan Sisodiya | Frontend Developer | [@harsh123-code](https://github.com/harsh123-code) |
| Vishal | Testing & QA | [@Vishal](https://github.com/Vishal) |
| Sujeet Kannujiya | Research & Documentation | [@sujeet-official](https://github.com/sujeet-official) |


## Project Goal (V1)

Upload a resume (PDF/DOCX) + paste a job description → get a match score, matched/missing skills, and AI-powered improvement suggestions.

## Tech Stack

- **Backend:** Python, FastAPI
- **Frontend:** React (Vite)
- **PDF Parsing:** PyMuPDF
- **DOCX Parsing:** python-docx
- **AI:** Google Gemini API
- **Testing:** pytest

## Project Structure

```
├── backend/        # FastAPI backend + AI services
├── frontend/       # React frontend
├── docs/           # Research + documentation
├── testing/        # QA test plans and reports
├── README.md
└── .gitignore
```

## V1 Scope

- Resume upload (PDF / DOCX)
- Job description text input
- Keyword-based skill extraction
- Resume ↔ JD skill matching
- Deterministic match score (0–100)
- AI-generated improvement suggestions (Gemini)

## Not in V1

- User authentication
- Database storage
- Payments / SaaS
- RAG / vector embeddings

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your API key:
```
GEMINI_API_KEY=your_key_here
```
