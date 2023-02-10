/**
 * @typedef {object} user
 * @property {string} email 이메일
 * @property {string} displayName 사용자 이름(별칭)
 * @property {string | null} profileImg 프로필 이미지 URL
 */

/**
 * 사용자 인증을 위한 함수
 * @param {string} accessToken 액세스 토큰
 * @returns {Promise<user | null>}
 */
export async function me(accessToken) {
  if (!accessToken) return null;

  const requestHeaders = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
    Authorization: `Bearer ${accessToken}`,
  };
  const requestMethod = "POST";

  const authResponse = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me",
    {
      headers: { ...requestHeaders },
      method: requestMethod,
    }
  );

  if (authResponse.status !== 200) return null;

  const user = await authResponse.json();

  return user;
}
