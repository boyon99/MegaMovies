/**
 * @typedef {object} User
 * @property {string} email 이메일
 * @property {string} displayName 사용자 이름(별칭)
 * @property {string | null} profileImg 프로필 이미지 URL
 */

export class AppStorage {
  static #user = null;
  static accessTokenKey = "accessToken";
  /**
   * 유저를 반환하는 함수
   * @returns {User | null}
   */
  static getCurrentUser() {
    return this.#user;
  }
  /**
   * 유저를 설정하는 함수
   * @param {User | null} user - 유저
   */
  static setCurrentUser(user) {
    this.#user = user;
  }
  /**
   * 액세스 토큰을 얻어오는 함수
   * @returns {string | null}
   */
  static getAccessToken() {
    return window?.localStorage.getItem(this.accessTokenKey);
  }

  /**
   * 액세스 토큰을 삭제하는 함수
   */
  static deleteAccessToken() {
    window?.localStorage.getItem(this.accessTokenKey) &&
      window?.localStorage.removeItem(this.accessTokenKey);
  }

  /**
   * 장바구니에 아이템을 추가하는 함수
   */
  static setCartItem(item){
    let length = localStorage.length
    while(localStorage.getItem(`cart-${length}`)){
      console.log(length)
      length++
    }
    window?.localStorage.setItem(`cart-${length}`, [`${item.id}`,`${item.title}`, `${item.price}`, `${item.thumbnail}`])
  }

  /**
   * 장바구니에 있는 아이템을 조회하는 함수
   */
  static getCartItem(){
    for(let i = 0; i < localStorage.length + 1; i++){
    console.log(localStorage.getItem(`cart-${i}`).split(','))
    }
  }
}
