/**
 * API Service for AI-Powered Resume & Job Description Analyzer
 * Connects to the FastAPI backend with structured error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function analyzeResume(fileOrObj, maybeJobDesc, maybeApiKey) {
  let file;
  let jobDescription;
  let apiKey;

  if (fileOrObj && typeof fileOrObj === 'object' && !(fileOrObj instanceof File) && !(fileOrObj instanceof Blob)) {
    file = fileOrObj.file;
    jobDescription = fileOrObj.jobDescription;
    apiKey = fileOrObj.apiKey;
  } else {
    file = fileOrObj;
    jobDescription = maybeJobDesc;
    apiKey = maybeApiKey;
  }

  if (!file) {
    throw new Error('Please upload a PDF or DOCX resume file.');
  }
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Please enter a target job description.');
  }

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription.trim());

  const headers = {};
  if (apiKey && apiKey.trim()) {
    headers['X-Gemini-API-Key'] = apiKey.trim();
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
  } catch {
    throw new Error(
      'Could not connect to the analysis server. Please verify that the backend is running at ' +
        API_BASE_URL
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Received an unparseable response from the server.');
  }

  if (!response.ok) {
    const detail = data && data.detail ? data.detail : '';

    switch (response.status) {
      case 400:
        throw new Error(detail || 'Invalid input or corrupt document provided.');
      case 413:
        throw new Error(detail || 'File exceeds the 5 MB maximum size limit.');
      case 422:
        throw new Error(detail || 'We could not extract enough text from this document. Please ensure it is a text-based PDF or DOCX file.');
      case 429:
        throw new Error(
          detail ||
            'Gemini API rate limit exceeded. Please wait a moment before trying again, or continue with rule-based analysis.'
        );
      case 500:
      case 502:
      case 503:
        throw new Error(
          detail ||
            'Temporary server error while processing the analysis. Please try again in a few moments.'
        );
      default:
        throw new Error(detail || `Analysis request failed with status code ${response.status}.`);
    }
  }

  return data;
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) {
      return await res.json();
    }
    return { status: 'offline' };
  } catch {
    return { status: 'offline' };
  }
}
