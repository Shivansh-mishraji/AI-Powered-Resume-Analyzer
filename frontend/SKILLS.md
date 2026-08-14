# SKILLS.md — Frontend Developer
# Member: Harshwardhan
# Role: Frontend Developer
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Philosophy

> You can use AI to help you build. But understand what you submit.
>
> If your mentor points to your code and asks "What does this do?", you should be able to answer.

You don't need to become a React expert. You need to build a usable, working interface and understand its basic structure.

---

## The "Mentor Test" (Do This Before Every Saturday)

Open your code and ask yourself these questions:

1. Where is my homepage? → You should know.
2. Where is the resume upload code? → You should know.
3. Where is the JD input? → You should know.
4. What happens when I click Analyze? → You should know.
5. How does the frontend communicate with the backend? → You should know at a basic level.
6. Where are the results displayed? → You should know.

If you can answer all six, you're ready for the mentor.

---

## WEEK 1 Skills — Basic React Page

### Skill 1.1 — What is React?

**Understand (just the basics):**
- React is a JavaScript library for building user interfaces
- A React app is made of "components" — reusable pieces of UI
- `App.jsx` is the root component
- JSX is HTML-like syntax written inside JavaScript

**You should be able to answer:**
> "What is React used for?"
> "What is a component in React?"
> "What is App.jsx?"

---

### Skill 1.2 — Setting Up React with Vite

**Learn:**
- What Vite is: a fast build tool for React projects
- Creating a project: `npm create vite@latest frontend -- --template react`
- Running the dev server: `npm run dev`
- The folder structure: `src/`, `public/`, `App.jsx`, `main.jsx`

**You should be able to answer:**
> "How do you start a React project with Vite?"
> "What does `npm run dev` do?"
> "What is the difference between `src/` and `public/`?"

---

### Skill 1.3 — Basic UI Components

**Learn:**
- What JSX is: writing HTML inside JavaScript
- How to create a simple component
- How to add a button, input, and text area in JSX
- Linking a CSS file to a component

**Build:** A homepage that shows:
- App title
- File input for resume upload
- Text area for job description
- Analyze button

**You should be able to answer:**
> "What is JSX?"
> "How do you add a button in React?"

---

### Skill 1.4 — Basic CSS Styling

**Learn:**
- Linking CSS to a component (`import './App.css'`)
- Basic CSS: colors, fonts, padding, margin, flexbox layout
- How to center elements on the page

**Goal:** Make the page look clean — not fancy, just readable and organized.

**You should be able to answer:**
> "How do you add styles to a React component?"
> "What is flexbox used for?"

---

## WEEK 2 Skills — File Validation + UI Improvement

### Skill 2.1 — useState Hook

**Learn:**
- What `useState` is: a way to store data that changes in a component
- How to declare state: `const [value, setValue] = useState(initialValue)`
- How state updates trigger re-renders

**Example:**
```jsx
const [fileName, setFileName] = useState("")
```

**You should be able to answer:**
> "What is useState?"
> "Why do we use state instead of regular variables in React?"

---

### Skill 2.2 — Handling File Input

**Learn:**
- `<input type="file">` in React
- `onChange` event handler
- `event.target.files[0]` to get the selected file
- Displaying the selected file name
- Showing a "Remove" option

**Build:**
```
Selected Resume:
resume.pdf  [Remove]
```

**You should be able to answer:**
> "How do you get the selected file from a file input in React?"
> "How do you display the file name after it's selected?"

---

### Skill 2.3 — Basic Validation

**Learn:**
- Checking file type: `file.name.endsWith('.pdf') || file.name.endsWith('.docx')`
- Showing error messages conditionally in JSX
- Validating that fields are not empty before submitting

**Build these validations:**
- Wrong file type → `"❌ Please upload PDF or DOCX only"`
- No resume selected → `"❌ Please upload your resume"`
- Empty JD → `"❌ Please enter a Job Description"`

**You should be able to answer:**
> "How do you show an error message in React?"
> "How do you check if a field is empty before submitting?"

---

### Skill 2.4 — Loading State

**Learn:**
- Adding a loading state: `const [loading, setLoading] = useState(false)`
- Showing loading text when Analyze is clicked
- Disabling the button while loading

**Build:**
```
When loading is true → show "Analyzing your resume... Please wait"
When loading is false → show the Analyze button
```

**You should be able to answer:**
> "How do you show a loading message while waiting for the backend?"
> "Why do we disable the button during loading?"

---

## WEEK 3 Skills — Backend Connection

### Skill 3.1 — What is an API Call?

**Understand:**
- The frontend sends data to Shivansh's FastAPI backend
- The backend processes it and returns a JSON result
- The frontend receives the JSON and displays it
- This communication uses the browser's `fetch` API or `axios` library

**You should be able to answer:**
> "What is `POST /analyze`?"
> "What data does the frontend send to the backend?"
> "What does the backend return?"

---

### Skill 3.2 — Sending FormData (File + Text)

**Learn:**
- `FormData` — used to send files alongside text fields
- How to append file and text to FormData:
  ```js
  const formData = new FormData()
  formData.append("resume", selectedFile)
  formData.append("job_description", jdText)
  ```
- Using `fetch` to POST FormData to the backend

**Build:** `frontend/src/services/api.js`

```js
export async function analyzeResume(file, jobDescription) {
  const formData = new FormData()
  formData.append("resume", file)
  formData.append("job_description", jobDescription)

  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  })

  return await response.json()
}
```

**You should be able to answer:**
> "What is FormData and why do we use it?"
> "How do we send a file and text together to the backend?"
> "What URL does the frontend call?"

---

### Skill 3.3 — Handling API Response and Errors

**Learn:**
- `response.ok` to check if request succeeded
- `try/catch` in async functions
- Setting state with the result
- Showing error message if backend fails

**You should be able to answer:**
> "How do you check if an API call succeeded?"
> "What do you show the user if the backend returns an error?"

---

## WEEK 4 Skills — Results Page

### Skill 4.1 — Displaying JSON Data

**Learn:**
- Receiving JSON from the backend and storing in state
- Accessing nested values: `result.score`, `result.matched_skills`
- Displaying arrays with `.map()`:
  ```jsx
  {result.matched_skills.map(skill => <li key={skill}>✓ {skill}</li>)}
  ```

**Build:** Results page showing:
- Overall score (e.g., `78/100`)
- Matched skills list
- Missing skills list
- AI suggestions

**You should be able to answer:**
> "How do you display a list of items in React?"
> "What is `.map()` used for in JSX?"

---

### Skill 4.2 — Conditional Rendering

**Learn:**
- Showing different UI based on state
- Ternary in JSX: `{loading ? <Loading /> : <Results />}`
- Short-circuit: `{error && <p>{error}</p>}`

**States your UI should handle:**
- Initial state: show the upload form
- Loading: show "Analyzing..."
- Error: show error message
- Success: show results

**You should be able to answer:**
> "How does React decide what to show based on state?"
> "What is conditional rendering?"

---

## WEEK 5 Skills — Complete Integration

### Skill 5.1 — End-to-End Flow Testing

**Manually test:**

| Action | Expected |
|---|---|
| Upload PDF + paste JD + click Analyze | Results appear |
| Upload DOCX | Accepted |
| Upload JPG | Error shown |
| Click Analyze with empty JD | Validation error |
| Backend returns error | User-friendly message shown |
| Loading state | "Analyzing..." shown while waiting |

**You should be able to answer:**
> "Walk me through what happens from clicking Analyze to seeing results."

---

### Skill 5.2 — Basic Responsive Design

**Learn:**
- CSS media queries: `@media (max-width: 768px) { ... }`
- Making the layout work on a phone screen
- Testing on mobile: use Chrome DevTools device toggle

**Check on mobile:**
- Page fits the screen
- Buttons are tappable
- Text is readable
- Results are visible

---

## WEEK 6 Skills — Final Polish

### Skill 6.1 — Production Build

**Learn:**
- `npm run build` creates a production-ready `dist/` folder
- Deploying to free hosting (Netlify, Vercel, GitHub Pages)
- Setting the backend API URL correctly for production

**You should be able to answer:**
> "What is the difference between `npm run dev` and `npm run build`?"
> "How do you deploy a React app for free?"

---

## What You Can Use AI For

| Allowed | Not Allowed |
|---|---|
| Generating React components | Copying code you can't explain at all |
| CSS styling help | Claiming something works without testing it |
| Fixing errors you don't understand | Telling the mentor you understand something you don't |
| Explaining what code does | Generating the entire project without reading it |

---

## The Honest Mentor Answer

If your mentor asks: "Did you build this frontend yourself?"

A good honest answer is:

> "I used AI assistance while developing some parts, but I implemented, tested, modified and understood the frontend and its integration with the backend."

That is completely reasonable in modern software development. Your goal is not to prove you never used AI — your goal is to prove you can actually work with the code you submitted.
