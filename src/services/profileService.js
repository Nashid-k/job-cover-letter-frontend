const BASE_URL = "http://localhost:5000/api/profile";

export async function getProfile(token) {
    const res = await fetch(`${BASE_URL}/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return res.json();
}

export async function updatePreferences(token, preferences) {
    const res = await fetch(`${BASE_URL}/preferences`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(preferences)
    });
    return res.json();
}

export async function uploadResume(token, file) {
    const formData = new FormData();
    formData.append('resume', file);
    
    const res = await fetch(`${BASE_URL}/resume`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
            // Don't set Content-Type for FormData, let browser set it
        },
        body: formData
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
    }
    
    return data;
}