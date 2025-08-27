const BASE_URL = "http://localhost:5000/api/coverletter";

export async function generateCoverLetter(token, jobDescription) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ jobDescription })
  });
  return res.json();
}