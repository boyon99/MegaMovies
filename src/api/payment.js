export default class paymentAPI {
  #baseAPIURL = "https://asia-northeast3-heropy-api.cloudfunctions.net/api";
  #defaultHeader = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
  };

  constructor() {
    this.requestData = {
      defaultData: {
        baseUrl: this.#baseAPIURL,
        headers: {
          ...this.#defaultHeader,
        },
      },
      order({ accessToken }) {
        return {
          url: `${this.defaultData.baseUrl}/products/buy`,
          method: "POST",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      confirmOrder({ accessToken }) {
        return {
          url: `${this.defaultData.baseUrl}/products/ok`,
          method: "POST",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      cancelOrder({ accessToken }) {
        return {
          url: `${this.defaultData.baseUrl}/products/cancel`,
          method: "POST",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
    };
  }

  // 제품 거래 신청
  async order({ accessToken, productId, accountId }) {
    if (!accessToken) return false;

    const { url, method, headers } = this.requestData.order({
      accessToken,
    });

    const response = await fetch(url, {
      headers,
      method,
      body: JSON.stringify({
        productId,
        accountId,
      }),
    });

    if (response.status !== 200) return await response.json();

    return true;
  }

  // 제품 거래 확정
  async confirmOrder({ accessToken, detailId }) {
    if (!accessToken) return false;

    const { url, method, headers } = this.requestData.confirmOrder({
      accessToken,
    });

    const response = await fetch(url, {
      headers,
      method,
      body: JSON.stringify({ detailId }),
    });

    if (response.status !== 200) return false;

    return true;
  }

  // 제품 거래 취소
  async cancelOrder({ accessToken, detailId }) {
    if (!accessToken) return false;

    const { url, method, headers } = this.requestData.cancelOrder({
      accessToken,
    });

    const response = await fetch(url, {
      headers,
      method,
      body: JSON.stringify({
        detailId,
      }),
    });

    if (response.status !== 200) return false;

    return true;
  }
}
