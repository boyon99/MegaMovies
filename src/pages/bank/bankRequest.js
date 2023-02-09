export default class BankAPI {
  #baseAPIURL = "https://asia-northeast3-heropy-api.cloudfunctions.net/api";
  #defaultHeader = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: process.env.username,
  };

  constructor() {
    this.requestData = new Map([
      [
        "getBankAccountList",
        {
          url: `${this.#baseAPIURL}/account/banks`,
          method: "GET",
          headers: ({ accessToken }) => ({
            ...this.#defaultHeader,
            Authorization: `Bearer ${accessToken}`,
          }),
        },
      ],
    ]);
  }

  async getBankAccountList({ accessToken }) {
    const { url, method, headers } = this.requestData.get("getBankAccountList");
    const requestHeaders = { ...headers({ accessToken }) };

    console.log({ url, method, requestHeaders });
  }
}

/*
  1. 계좌 연결
  2. 계좌 목록 및 잔액 조회
  3. 선택 가능한 은행목록 조회
  4. 계좌 해지
*/
