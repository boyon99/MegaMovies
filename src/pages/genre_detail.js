import { getGenreMovies } from "./genre";

export const genreDetailPage = (category) => {
  const detailPage = document.createElement("div");
  detailPage.textContent = category;
  detailPage.classList.add("detail-page");
  getGenreMovies(category).then((movieList) => {
    render(createMovieItemList(movieList));
  });

  return detailPage;
};

async function render(childeren) {
  const detailPage = document.querySelector(".detail-page");
  detailPage.append(childeren);
}

function createMovieItemList(movieItems) {
  const movieListEl = document.createElement("ul");
  movieListEl.classList.add("movie-list");

  const movieList = movieItems.map(
    ({ thumbnail, title, id, price, description }) =>
      createMovieItem(thumbnail, title, id, price, description, getMovieRate())
  );
  movieListEl.append(...movieList);
  return movieListEl;
}

function getMovieRate() {
  const rate = Math.random() * (5 - 2) + 2;
  return rate.toFixed(1);
}

function createMovieItem(thumbnail, title, id, price, description, rate) {
  const movieItem = document.createElement("li");
  movieItem.classList.add("movie-item");
  const linkEl = document.createElement("a");

  linkEl.href = `/movie/${id}`;
  linkEl.dataset.navigo = "";
  linkEl.innerHTML = `
  <div class="img-wrapper">
  <img src=${thumbnail} />
  </div>
  <div class="movie-details">
  <div class="title">${title}</div>
  <div class="rate-wrapper">
    <div class="star"></div>
    <div class="rate">${rate}</div>
  </div>
  <div class="plot">${description}...</div>
  <div class="price-wrapper">
  <div class="price">${price}</div>
  <div class="price-tag"></div>
  </div>
  </div>`;

  movieItem.append(linkEl);
  return movieItem;
}
