let KanapAPI = "http://localhost:3000/api/products/";
const cartItems = document.querySelector("#cart__items");
const totalPrice = document.querySelector("#totalPrice");
const totalQuantity = document.querySelector("#totalQuantity");
const order = document.querySelector("#order");
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = [];

//affichage du produit(id, couleur, quantité)
const displayProduct = (productId, productColor, productQuantity) => {
  fetch(KanapAPI + productId)
    .then((res) => res.json())
    .then((produit) => {
      products.push(produit);
      calculateTotal();

      //création de l'article dans le DOM

      const newLigne = document.createElement("article");
      newLigne.setAttribute("class", "cart__item");
      newLigne.setAttribute("data-id", produit._id);
      newLigne.setAttribute("data-color", productColor);
      newLigne.innerHTML = `
                          <div class ="cart__item__img"> 
                          <img src="${produit.imageUrl}" alt=${produit.altText}>
                          </div>
                          <div class="cart__item__content">
                          <div class="cart__item__content__description">
                              <h2>${produit.name}</h2>
                              <p>${productColor}</p>
                              <p>${produit.price} €</p>
                          </div>
                          <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                              <p>Qté : </p>
                              <input type="number"  class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productQuantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                      <p class="deleteItem">Supprimer</p>
                                    </div>
                                  </div>
                                </div>
                              </article>`;
      cartItems.appendChild(newLigne);

      const deleteBtn = document.querySelector(
        `[data-id="${produit._id}"][data-color="${productColor}"] .deleteItem`
      );

      const changeBtn = document.querySelector(
        `[data-id="${produit._id}"][data-color="${productColor}"] .itemQuantity`
      );

      changeBtn.addEventListener("change", (e) => {
        changeQuantity(produit._id, productColor, e.target.value);
      });

      deleteBtn.addEventListener("click", () => {
        deleteItem(produit._id, productColor);
      });
    })
    .catch((error) => console.log(error));
};
// fonction chanfgement de la quantité suivant l' id et la couleur du produit
const changeQuantity = (id, color, value) => {
  const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];

  // trouver item avec cet id
  let item = updatedCart.find((i) => i.id === id && i.itemColor === color);

  // obtenir les indexs

  let index = updatedCart.indexOf(item);

  //  mise à jour
  item.itemQuantity = value;
  updatedCart[index] = item;

  // mise à jour du panier dans le localStorage

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  calculateTotal();
};
//supression d'un produit suivant l'id et la couleur
const deleteItem = (productId, color) => {
  const carts = JSON.parse(localStorage.getItem("cart")) || [];

  let product = carts.find((i) => i.id == productId);
  // trouver le produit à effacer
  let productItemDom = document.querySelector(
    `[data-id="${productId}"][data-color="${color}"]`
  );

  // retirer item du tableau
  const index = carts.indexOf(product);
  if (index > -1) {
    carts.splice(index, 1);
  }

  // mise à jour du panier
  localStorage.setItem("cart", JSON.stringify(carts));

  // retirer product item du DOM
  cartItems.removeChild(productItemDom);

  calculateTotal();
};
//fonction du calcul du prix du ou des produits dans le panier
const calculateTotal = () => {
  const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  let totalQuantityNumber = 0;
  //boucle for of pour parcourir chaque article dans le panier
  for (let item of updatedCart) {
    // trouver l id de l'article
    let prod = products.find((i) => i._id === item.id);
    if (prod) {
      let price = prod.price * item.itemQuantity;
      total += price;
      totalQuantityNumber += parseInt(item.itemQuantity);
    }
  }
  totalPrice.textContent = total;
  totalQuantity.textContent = totalQuantityNumber;
};
// demmarage du script
const start = () => {
  for (let item of cart) {
    displayProduct(item.id, item.itemColor, item.itemQuantity);
  }

  order.addEventListener("click", (e) => {
    e.preventDefault();
    ordre();
  });
};
// ensemble du regex utilisé dans le formulaire
const allRegex = [
  {
    name: "firstName",
    regex: /^[A-Za-z-]+$/,
    error: "Le prenom n'est pas valide",
    validate: "Prenom √",
  },
  {
    name: "lastName",
    regex: /^[A-Za-z-]+$/,
    error: "Le nom de famille n'est pas valide",
    validate: "Nom √",
  },
  {
    name: "address",
    regex: /^[0-9]+\s[0-9A-Za-zÀ-ü-'\s]+$/,
    error: "L'adresse n'est pas valide",
    validate: "Adresse √",
  },
  {
    name: "city",
    regex: /^[A-Za-zÀ-ü-'\s]+$/,
    error: "Le nom de la ville n'est pas valide",
    validate: "Ville √",
  },
  {
    name: "email",
    regex: /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/,
    error: "l'email que vous avez saisi n'est pas valide",
    validate: "Email √",
  },
];
// fonction de verification des champs du formulaire
const checkInputs = () => {
  let datas = {};
  let validForm = true;

  for (let field of allRegex) {
    // selectionner élément input
    let fieldInput = document.querySelector(`#${field.name}`);
    //la valeur de l'input
    let inputValue = fieldInput.value;

    fieldInput.addEventListener("change", (e) => {
      
    
      //s'il y a regex verification
      
      if(!field.regex.test(e.target.value)){
      //efacce le message d'erreur quand on modifie le champs grace a textContent

        fieldInput.nextElementSibling.textContent = field.error;
      }else {
        fieldInput.nextElementSibling.textContent = field.validate;
      }
    });

  
    
      // test de la valeur mise par l'utilisateur  si regex valide

      if (!field.regex.test(inputValue)) {
        // sinon  erreur dans nextElementSibling

        fieldInput.nextElementSibling.textContent = field.error;

        validForm = false;
      }
    

    datas[field.name] = inputValue;
  }

  if (validForm) {
    return datas;
  } else {
    return false;
  }
};

// fonction pour passer la commande si formulaire valide
const ordre = () => {
  let data = checkInputs();
  if (!data) {
    alert("Veuillez remplir le formulaire correctement");

    return;
  }
  // verification si panier rempli
  let products = JSON.parse(localStorage.getItem("cart")) || [];
  let productData = [];
  if (!products[0]) {
    alert("Votre panier est vide");

    return;
  }

  // creéation du tableau du contenu du panier
  for (let product of products) {
    for (let index = 0; index < product.itemQuantity; index++) {
      productData.push(product.id);
    }
  }
  // envoi la commande à l'API
  fetch(KanapAPI + "order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        address: data.address,
        email: data.email,
      },
      products: productData,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      
      localStorage.removeItem("cart");
      window.location.replace("confirmation.html?orderId=" + data.orderId);
    })

    .catch((error) => {
      console.error("Error:", error);
    
    });
};

window.addEventListener("load", start);
