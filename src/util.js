/**
 * @typedef {object} User
 * @property {string} email 이메일
 * @property {string} displayName 사용자 이름(별칭)
 * @property {string | null} profileImg 프로필 이미지 URL
 */

import { router } from ".";

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
  static setCartItem(item) {
    let length = 0
    while (localStorage.getItem(`cart-${length}`)) {
      length++
    }
    let isCart = 1

    // 장바구니에 있는 아이템인지 여부 확인 
    for (let i = 0; i < 30; i++) {
      if (localStorage.getItem(`cart-${i}`)) {
        if (localStorage.getItem(`cart-${i}`).split(',').includes(`${item.id}`)) {
          isCart = 0;
        }
      }
    }
    // 최대 장바구니에 담을 수 있는 아이템의 수
    if (length < 31 && isCart === 1) {
      // 배열 형식으로 아이템 값 저장
      window?.localStorage.setItem(`cart-${length}`, [`${item.id}`, `${item.title}`, `${item.price}`, `${item.thumbnail}`, 'false'])
    } else if (length > 31) {
      isCart = 2;
    }

    return isCart
  }

  /**
   * 장바구니에 있는 아이템을 조회하는 함수
   */
  static getCartItem() {
    let items = []
    for (let i = 0; i < 31; i++) {
      if (localStorage.getItem(`cart-${i}`)) {
        // items.push(window?.localStorage.getItem(`cart-${i}`).split(','))
        items[`${i}`] = window?.localStorage.getItem(`cart-${i}`).split(',')
      }
    }
    return items
  }
}
