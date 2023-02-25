import logo from "../../static/logo.png";

const footer = document.getElementById("footer");

const logoArea = document.createElement("img");
logoArea.classList.add("logo-area");
logoArea.src = logo;
logoArea.alt = "MegaMovies logo";
footer.appendChild(logoArea);

const textArea = document.createElement("div");
textArea.classList.add("text-area");
textArea.innerHTML = `<div>ⓒ ${new Date().getFullYear()} Mega Movies.</div><div>All Rights Reserved.</div>`;
footer.appendChild(textArea);
