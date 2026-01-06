
import { TestResult } from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  return response.json();
};

export const saveTestResultToSheet = async (url: string, result: TestResult): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors', // Apps Script web apps often require this
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'add',
      payload: result,
    }),
    // redirect: 'follow' // This might be needed if script.google.com redirects
  });
  // Note: With no-cors, we can't read the response. We assume it's successful if no network error is thrown.
  return { status: 'success' };
};

export const deleteTestResultsFromSheet = async (url: string, ids: string[]): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'delete',
      payload: { ids },
    }),
    // redirect: 'follow'
  });
  return { status: 'success' };
};

export const fetchAllResultsFromSheet = async (url: string): Promise<TestResult[]> => {
  // We need a proper CORS response for GET requests.
  // The provided Apps Script code does not set CORS headers.
  // This will likely fail in the browser due to CORS policy unless the script is modified.
  // A common workaround is to use a CORS proxy, but for this exercise, we assume the user can adjust their script if needed.
  try {
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data as TestResult[];
  } catch (error) {
     if (error instanceof TypeError) {
        // This is likely a CORS error.
        console.warn("CORS error fetching from Google Sheet. Please ensure your Apps Script is configured for CORS if you need to fetch data directly.");
     }
     // For now, return empty array to prevent app crash on fetch failure.
     return [];
  }
};
