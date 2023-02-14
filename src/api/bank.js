export default class BankAPI {
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
      availableBankAccountList({ accessToken }) {
        return {
          url: `${this.defaultData.baseUrl}/account/banks`,
          method: "GET",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      userBankAccountList({ accessToken }) {
        return {
          url: `${this.defaultData.baseUrl}/account`,
          method: "GET",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      syncBankAccount({
        accessToken,
        bankCode,
        accountNumber,
        phoneNumber,
        signature,
      }) {
        return {
          url: `${this.defaultData.baseUrl}/account`,
          method: "POST",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            bankCode,
            accountNumber,
            phoneNumber,
            signature,
          }),
        };
      },
      closeBankAccount({ accessToken, accountId, signature }) {
        return {
          url: `${this.defaultData.baseUrl}/account`,
          method: "DELETE",
          headers: {
            ...this.defaultData.headers,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            accountId,
            signature,
          }),
        };
      },
    };
  }

  // 선택 가능한 은행 목록 조회
  async getAvailableBankAccountList({ accessToken }) {
    if (!accessToken) return null;

    const { url, method, headers } = this.requestData.availableBankAccountList({
      accessToken,
    });

    const response = await fetch(url, {
      headers,
      method,
    });

    if (response.status !== 200) return null;

    const availableBankAccountList = await response.json();

    return availableBankAccountList.filter(
      (bankAccount) => !bankAccount.disabled
    );
  }

  // 계좌 목록 및 잔액 조회
  async getUserBankAccountList({ accessToken }) {
    if (!accessToken) return null;

    const { url, method, headers } = this.requestData.userBankAccountList({
      accessToken,
    });

    const response = await fetch(url, {
      headers,
      method,
    });

    if (response.status !== 200) return null;

    const userBankAccountList = await response.json();

    return userBankAccountList;
  }

  // 계좌 연결
  async syncBankAccount({
    accessToken,
    bankCode,
    accountNumber,
    phoneNumber,
    signature = true,
  }) {
    if (!(accessToken && bankCode && accountNumber && phoneNumber && signature))
      return false;

    const { url, method, headers, body } = this.requestData.syncBankAccount({
      accessToken,
      bankCode,
      accountNumber,
      phoneNumber,
      signature,
    });

    const response = await fetch(url, {
      headers,
      method,
      body,
    });

    if (response.status !== 200) return false;

    const syncedBankAccount = await response.json();

    return syncedBankAccount;
  }

  // 계좌 해지
  async closeBankAccount({ accessToken, accountId, signature = true }) {
    if (!(accessToken && accountId && signature)) return false;

    const { url, method, headers, body } = this.requestData.closeBankAccount({
      accessToken,
      accountId,
      signature,
    });

    const response = await fetch(url, {
      headers,
      method,
      body,
    });

    if (response.status !== 200) return false;

    return true;
  }
}
