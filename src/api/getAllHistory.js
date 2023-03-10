export async function getAllHistory(accessToken) {
  const headers = {
    "content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
    Authorization: `Bearer ${accessToken}`
  }

  try {
    const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/details', {
      method: 'GET',
      headers
    })
    const json = await res.json()
    return json
  } catch (error) {
    throw error
  }
}