// Variables globales
let KanapAPI = "http://localhost:3000/api/products/";
const title = document.querySelector("#title");
const image = document.querySelector(".item__img");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const colorSelect = document.querySelector("#colors");
const qty = document.querySelector("#quantity");
const toCart = document.querySelector("#addToCart");

// Récupération de l'ID dans l'url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");


// Récupération du produit depuis l'API
// Affichage des élements du  produit
const start = () => {
  fetch(KanapAPI + id)  
    .then((res) => res.json())
    .then((product) => {
      title.textContent = product.name;
      image.innerHTML = `<img src="${product.imageUrl}" alt=${product.altTxt}/>`;
      description.textContent = product.description;
      price.textContent = product.price;

      // Ajout Option pour les couleurs
      for (let color of product.colors) {
        const option = document.createElement("option");
        option.textContent = color;
        option.setAttribute("value", color);
        colorSelect.appendChild(option);
      }

      // Ajout du listener sur le bouton ajouter
      toCart.addEventListener("click", () => produitAjout(product));
    })
    .catch((err) => console.log(err));
};
// ajout du ou des produits
const produitAjout = (product) => {
  const productQuantity = parseInt(qty.value);

  // valider  productQuantity et colorSelect
  if (colorSelect.value == "" || productQuantity < 1 || productQuantity > 100) {
    alert(
      "Vous devez selectionner au moins une quantité et vous devez selectionner une couleur"
    );
    return;
  }

  let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

  // trouver  element  dont id est egal à newItem.id
  const itemExists = currentCart.find(
    (item) => item.id === product._id && item.itemColor === colorSelect.value
  );
   

  const newItemQuantity = itemExists?.itemQuantity || 0;

  const newItem = {
    id: product._id,
    itemColor: colorSelect.value,
    itemQuantity: productQuantity + newItemQuantity,
  };

  if (itemExists) {
    // si  on trouve element avec le meme id on le remplace par newItem
    const index = currentCart.indexOf(itemExists);

    currentCart[index] = newItem; 

    // alert("La quantité est mise a jour")
    
  } else {
    currentCart.push(newItem);
    alert("Votre produit est dans le panier");
 
  }
  // enregistrement du panier
  localStorage.setItem("cart", JSON.stringify(currentCart));

};

window.addEventListener("load", start);
