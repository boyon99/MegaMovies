const genrePage = document.createElement("div");
genrePage.classList.add("genre-page");
(async () => {
  await renderPage();
})();

import { readItem } from "../api/movieRequest";
async function getGenreList() {
  const genreSet = new Set();
  const movieList = await readItem();

  Array.from(movieList)
    .map((movie) => movie.tags)
    .forEach((tags) => {
      tags.forEach((tag) => genreSet.add(tag));
    });
  return Array.from(genreSet.values());
}

async function renderPage() {
  genrePage.textContent = "장르 페이지";

  const actionMovieList = await getGenreMovies("액션");
  const actionContainer = createContainer({
    title: "액션하면 이 영화죠",
    movieList: actionMovieList,
  });

  const comedyMovieList = await getGenreMovies("코미디");
  const comedyContainer = createContainer({
    title: "웃고싶은 날엔 코미디",
    movieList: comedyMovieList,
  });

  const sadMovieList = await getGenreMovies("드라마");
  const sadContainer = createContainer({
    title: "눈물나는 감동스토리",
    movieList: sadMovieList,
  });

  const renderGenreList = {
    genre: ["판타지", "사극", "느와르", "공포", "스포츠", "가족", "범죄"],
    theme: ["워너브라더스", "마블", "디즈니", "지브리"],
  };

  const moreContainer = createMoreContainer(renderGenreList);
  function createMoreContainer(genreList) {
    const container = document.createElement("div");
    container.classList.add("container");

    const titleEl = document.createElement("div");
    titleEl.textContent = "더 많은 장르/테마";
    titleEl.classList.add("title");

    const genreWrapper = document.createElement("div");
    genreWrapper.classList.add("genre-theme-wrap");

    const genreListArr = genreList.genre.map((genre) => {
      const linkEl = document.createElement("a");
      linkEl.href = `/genre/${genre}`;
      linkEl.dataset.navigo = "";
      linkEl.innerHTML = `
   <div class="genre-list">
   <div class="genre">
     <span>${genre}</span>
    </div>
    </div>`;
      genreWrapper.append(linkEl);
    });

    const themeListArr = genreList.theme.map((theme) => {
      const linkEl = document.createElement("a");
      linkEl.href = `/genre/${theme}`;
      linkEl.dataset.navigo = "";
      linkEl.innerHTML = `
   <div class="theme-list">
   <div class="theme">
     <span>${theme}</span>
    </div>
    </div>`;
      genreWrapper.append(linkEl);
    });

    container.append(titleEl, genreWrapper);
    return container;
  }

  genrePage.append(
    actionContainer,
    comedyContainer,
    sadContainer,
    moreContainer
  );
}

function createContainer({ title, movieList }) {
  const container = document.createElement("div");
  container.className = "container";

  const titleEl = document.createElement("div");
  titleEl.className = "title";
  titleEl.textContent = title;

  const movieItemList = createMovieItemList(movieList);

  container.append(titleEl, movieItemList);

  return container;
}

function createMovieItemList(movieList) {
  const movieListEl = document.createElement("ul");
  movieListEl.classList.add("movie-list");
  const movieItemList = Array.from(movieList)
    .slice(0, 4)
    .map((movie) =>
      createMovieItem({
        imgSrc: movie.thumbnail,
        title: movie.title,
        id: movie.id,
      })
    );

  movieListEl.append(...movieItemList);

  return movieListEl;
}

function createMovieItem({ imgSrc, title, id }) {
  const movieItem = document.createElement("li");
  movieItem.className = "list-item";

  const linkEl = document.createElement("a");
  linkEl.href = `/movie/${id}`;
  linkEl.dataset.navigo = "";
  linkEl.innerHTML = `
   <div class="wrapper">
      <span>${title}</span>
      <img src=${imgSrc} />
    </div>
  `;

  movieItem.append(linkEl);

  return movieItem;
}

export async function getGenreMovies(genreList) {
  const requestHeaders = {
    "Content-type": "application/json",
    apikey: process.env.apikey,
    username: "KDT4_Team1",
  };
  const requestMethod = "POST";

  const response = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/search",
    {
      headers: {
        ...requestHeaders,
      },
      method: requestMethod,
      body: JSON.stringify({
        searchTags: [genreList],
      }),
    }
  );
  const movies = await response.json();
  return movies;
}

export default genrePage;
