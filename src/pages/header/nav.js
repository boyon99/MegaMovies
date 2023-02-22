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
searchInput.placeholder = "작품 또는 태그를 입력하세요";
let value = "";
searchInput.addEventListener('input',(e)=>{
  value = searchInput.value
})

searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.isComposing) {
    searchBtn.click()
  }
})



const searchBtn = document.createElement("button")
searchBtn.classList.add('search', 'btn-primary')
searchBtn.innerText = "검색"
searchBtn.addEventListener('click',()=>{
  if(value.length === 0){
    
  }else{
    location.href='/search'+`/${value}`
  }
})



inner.append(navItemList, searchInput, searchBtn);
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
