// 영화 가져오기

const genrePage = document.createElement("div");

genrePage.textContent = "장르 페이지";
export default genrePage;

const inputEl = document.querySelector("input");
let searchText = "";
let listCount = 1;
inputEl.addEventListener("input", () => {
  searchText = inputEl.value;
});
inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.isComposing) {
    getMovies();
  }
});

const chosenContainer = document.createElement("div");
const chosenTitle = document.createElement("div");
genrePage.appendChild(chosenContainer);
chosenContainer.appendChild(chosenTitle);
chosenTitle.classList.add("title");
chosenTitle.textContent = "당신을 위해 골랐어요";
chosenContainer.classList.add("container");

const actionContainer = document.createElement("div");
const actionTitle = document.createElement("div");
genrePage.appendChild(actionContainer);
actionContainer.appendChild(actionTitle);
actionTitle.classList.add("title");
actionTitle.textContent = "액션하면 이 영화죠!";
actionContainer.classList.add("container");

const comedyContainer = document.createElement("div");
const comedyTitle = document.createElement("div");
genrePage.appendChild(comedyContainer);
comedyContainer.appendChild(comedyTitle);
comedyTitle.classList.add("title");
comedyTitle.textContent = "웃고 싶은 날엔 코미디";
comedyContainer.classList.add("container");

const genreThemeContainer = document.createElement("div");
const genreContainer = document.createElement("div");
genrePage.appendChild(genreThemeContainer);
genreThemeContainer.classList.add("container");

// 무슨 API를 써야 되는지..?
//curl https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/:productId

async function getMovies() {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/search`
  );
  const json = await res.json();
  console.log(json);
  const title = json.title;
}
async function renderMovies() {
  movies.forEach((movie) => {
    const liEl = document.createElement("li");
    const titleEl = document.createElement("h4");
    const postEl = document.createElement("img");
    titleEl.textContent = "";
  });
}
