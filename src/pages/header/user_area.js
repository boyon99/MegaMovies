export const userArea = (user) => {
  return user ? loginedUser(user) : logoutedArea();
};

function logoutedArea() {
  const logouted = document.createElement("div");
  logouted.className = "button-group";
  logouted.innerHTML = `
  <a class="btn-ghost small btn-signup" href="/signup"  type="button" data-navigo>회원가입</a>
  <a class="btn-primary small btn-login" href="/login"  type="button" data-navigo>로그인</a>
  `;
  return logouted;
}

function loginedUser(user) {
  const { displayName, profileImg } = user;
  const defaultImg = "https://cdn-icons-png.flaticon.com/512/6522/6522516.png";

  const logedInArea = document.createElement("div");
  logedInArea.className = "user";

  const userProfile = document.createElement("div");
  userProfile.className = "profile";
  const userImg = document.createElement("img");
  userImg.src = profileImg ?? defaultImg;
  userImg.alt = "profile image";
  userProfile.appendChild(userImg);

  const userInfo = document.createElement("div");
  userInfo.className = "user-info";
  const userName = document.createElement("span");
  userName.className = "user-name";
  userName.textContent = displayName;
  userInfo.append(userName, document.createTextNode(" 님"));

  // 라우팅 주소 매핑
  const menuMap = new Map([
    [{ path: "/cart", title: "장바구니" }, createMenuLi],
    [{ path: "/user-info", title: "사용자 정보 수정" }, createMenuLi],
    [{ path: "/bank", title: "계좌 페이지" }, createMenuLi],
    [{ path: "/order-history", title: "구매내역" }, createMenuLi],
    [{ path: "/logout", title: "로그아웃" }, createMenuLi],
  ]);
  const menu = document.createElement("div");
  menu.className = "my-menu";
  const menuList = document.createElement("ul");
  menuList.className = "my-menu-list";
  menuList.append(...createMenuItems());
  menu.appendChild(menuList);

  logedInArea.append(userProfile, userInfo, menu);

  return logedInArea;

  function createMenuItems() {
    const menuItems = Array.from(menuMap.entries()).map(
      ([{ path, title }, createLiFactory]) => {
        return createLiFactory({ path, title });
      }
    );
    return menuItems;
  }

  function createMenuLi({ path, title }) {
    const liEl = document.createElement("li");
    liEl.className = "my-menu-item";
    const linkEl = document.createElement("a");
    linkEl.href = path;
    linkEl.dataset.navigo = "";
    linkEl.textContent = title;

    liEl.appendChild(linkEl);

    return liEl;
  }
}
