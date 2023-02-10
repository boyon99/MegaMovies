const nav = document.createElement("nav");
nav.className = "lnb";

const inner = document.createElement("div");
inner.className = "inner";

const navMaps = new Map([
  [{ path: "/", title: "홈" }, createNavLiEl],
  [{ path: "/ranking", title: "랭킹" }, createNavLiEl],
  [{ path: "/genre", title: "장르" }, createNavLiEl],
  [{ path: "/new", title: "신작" }, createNavLiEl],
]);
const navItemList = document.createElement("ul");
navItemList.className = "lnb-list";
navItemList.append(...createNavItems());

const searchInput = document.createElement("input");
searchInput.placeholder = "작품, 배우, 감독명을 입력하세요";

inner.append(navItemList, searchInput);
nav.appendChild(inner);

export { nav };

function createNavItems() {
  const navItemsMap = Array.from(navMaps.entries()).map(
    ([{ path, title }, createLiFactory]) => {
      return createLiFactory({ path, title });
    }
  );

  return navItemsMap;
}

function createNavLiEl({ path, title }) {
  const liEl = document.createElement("li");
  liEl.className = "lnb-item";
  const linkEl = document.createElement("a");
  linkEl.href = path;
  linkEl.dataset.navigo = "";
  linkEl.textContent = title;

  liEl.appendChild(linkEl);

  return liEl;
}
