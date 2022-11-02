// Variables globales
let KanapAPI = "http://localhost:3000/api/products/";
const title = document.querySelector("#title");
const image = document.querySelector(".item__img");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const colorSelect = document.querySelector("#colors");
const qty = document.querySelector("#quantity");
const toCart = document.querySelector("#addToCart");
// retour objet
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let productItem = {};
// Affichage des élements des  produits
const start = () => {
  fetch(KanapAPI + id)
    .then((res) => res.json())
    .then((product) => {
      title.textContent = product.name;
      image.innerHTML = `<img src="${product.imageUrl}" alt=${product.altTxt}/>`;
      description.textContent = product.description;
      price.textContent = product.price;
      //Ajout Option pour les couleurs
      for (let color of product.colors) {
        const option = document.createElement("option");
        option.textContent = color;
        option.setAttribute("value", color);
        colorSelect.appendChild(option);
      }
      toCart.addEventListener("click", function () {
        produitAjout(product);
      });
    });
    };
    function produitAjout(product) {
      let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

      currentCart.push(product);

      localStorage.setItem("cart", JSON.stringify(currentCart));
    }

window.addEventListener("load", start);
