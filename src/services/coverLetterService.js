const BASE_URL = "http://localhost:5000/api/coverletter";

export async function generateCoverLetter(token, jobDescription, analysis = null) {
  try {
    // Prepare the request body
    const requestBody = { jobDescription };
    
    // Only include analysis if it's provided and not empty
    if (analysis && Object.keys(analysis).length > 0) {
      requestBody.analysis = analysis;
    }

    const response = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      
      throw new Error(`Failed to generate cover letter: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    
    // Enhance error message for better debugging
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    
    throw error;
  }
}