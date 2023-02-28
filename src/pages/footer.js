import logo from "../../static/logo.png";

const footer = document.getElementById("footer");

const logoArea = document.createElement("a");
logoArea.classList.add("logo-area");

logoArea.onclick = function () {
  logoArea.href = "/";
};
footer.appendChild(logoArea);

const logoImage = document.createElement("img");
logoImage.classList.add("logo-image");
logoImage.src = logo;
logoImage.alt = "MegaMovies logo";
logoArea.appendChild(logoImage);

const textArea = document.createElement("div");
textArea.classList.add("text-area");
textArea.innerHTML = `<div>ⓒ ${new Date().getFullYear()} Mega Movies.</div><div>All Rights Reserved.</div>`;
footer.appendChild(textArea);
