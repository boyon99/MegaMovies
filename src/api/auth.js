/**
 * @typedef {object} user
 * @property {string} email 이메일
 * @property {string} displayName 사용자 이름(별칭)
 * @property {string | null} profileImg 프로필 이미지 URL
 */

import { renderToast } from "../pages/bank/toast";

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

export async function login(email, password) {
  const requestHeaders = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
  };
  const requestMethod = "POST";

  const loginResponse = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login",
    {
      headers: { ...requestHeaders },
      method: requestMethod,
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (loginResponse.status !== 200) return null;

  const user = await loginResponse.json();

  return user;
}

export async function logout(accessToken) {
  if (!accessToken) return false;

  const requestHeaders = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
    Authorization: `Bearer ${accessToken}`,
  };
  const requestMethod = "POST";

  const logoutResponse = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout",
    {
      headers: { ...requestHeaders },
      method: requestMethod,
    }
  );

  if (logoutResponse.status !== 200) return false;

  // true
  const result = await logoutResponse.json();

  return result;
}

export async function signUp({
  accessToken,
  email,
  password,
  displayName,
  profileImgBase64,
}) {
  const requestHeaders = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
    Authorization: `Bearer ${accessToken}`,
  };
  const requestMethod = "POST";

  const response = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup",
    {
      headers: { ...requestHeaders },
      method: requestMethod,
      body: JSON.stringify({
        email,
        password,
        displayName,
        ...(profileImgBase64 && { profileImgBase64 }),
      }),
    }
  );

  if (response.status !== 200) return null;

  const signedUser = await response.json();

  return signedUser;
}
