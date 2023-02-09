const headers = {
  "content-type": "application/json",
  apikey: process.env.apikey,
  username: "KDT4_Team1",
  masterkey: true,
}

export async function readItem() {
  try {
    const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/products', {
      method: 'GET',
      headers
    })
    const json = await res.json()
    return json
  } catch (error) {
    throw error
  }
}



