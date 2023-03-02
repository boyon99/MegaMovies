import { AppStorage } from '../util'

export async function getHistory(accessToken, detailId) {
  const headers = {
    'Content-type': 'application/json',
    apikey: process.env.apikey,
    username: 'KDT4_Team1',
    Authorization: `Bearer ${accessToken}`,
  }
  
  try {
    const res = await fetch(
      'https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/detail',
      {
        method:"POST",
        headers,
        body: JSON.stringify({ detailId }),
      }
    )
    const json = await res.json()
    return json
  } catch (error) {
    throw error
  }
}