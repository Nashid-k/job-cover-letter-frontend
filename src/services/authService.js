const BASE_URL = "http://localhost:5000/api/auth";


// eslint-disable-next-line no-unused-vars
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

export async function register({name, email, password}) {
    const res = await fetch(`${BASE_URL}/register`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name, email, password})
    });
    return res.json();
}

export async function login({email, password}){
    const res = await fetch(`${BASE_URL}/login`,{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email, password})
    })
    return res.json()
}

export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

 
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}