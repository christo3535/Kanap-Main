let KanapAPI = "http://localhost:3000/api/products/";
const cartItems = document.querySelector("#cart__items");
const totalPrice = document.querySelector("#totalPrice");
const totalQuantity = document.querySelector("#totalQuantity");
const order = document.querySelector("#order");
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = [];

const displayProduct = (productId, productColor, productQuantity) => {
  console.log("fetch");
  fetch(KanapAPI + productId)
    .then((res) => res.json())
    .then((produit) => {
      products.push(produit);
      calculateTotal();
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

      console.log(produit.name);
    })
    .catch((error) => alert("error"));
};

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

const deleteItem = (productId, color) => {
  const carts = JSON.parse(localStorage.getItem("cart")) || [];
  let product = carts.find((i) => i.id == productId);

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

const calculateTotal = () => {
  const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  let totalQuantityNumber = 0;

  for (let item of updatedCart) {
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
const demarage = () => {
  for (let item of cart) {
    console.log(`${item.id}-${item.itemColor}-${item.itemQuantity}`);
    displayProduct(item.id, item.itemColor, item.itemQuantity);
  }

  order.addEventListener("click", (e) => {
    e.preventDefault();
    ordre();
  });
};

const allRegex = [
  {
    name: "firstName",
    regex: /^[A-Za-z-]+$/,
    error: "Le prenom n'est pas valide",
    validate: "Prenom v",
  },
  {
    name: "lastName",
    regex: /^[A-Za-z-]+$/,
    error: "Le nom de famille n'est pas valide",
    validate: "Nom v",
  },
  {
    name: "address",
    regex: /^[0-9]+\s[0-9A-Za-zÀ-ü-'\s]+/,
    error: "L'adresse n'est pas valide",
    validate: "Adresse v",
  },
  {
    name: "city",
    regex: /^[A-Za-zÀ-ü-'\s]+$/,
    error: "Le nom de la ville n'est pas valide",
    validate: "Ville v",
  },
  {
    name: "email",
    regex: /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/,
    error: "l'email que vous avez saisi n'est pas valide",
    validate: "Email v",
  },
];

const checkInputs = () => {
  let data = {};
  let validForm = true;

  for (let field of allRegex) {
    // selectionner élément input
    let fieldInput = document.querySelector(`#${field.name}`);
    //la valeur de l'input
    let inputValue = fieldInput.value;

    fieldInput.addEventListener("change", () => {
      //efacce le message d'erreur quand on modifie le champs grace a l'innerHtml
      fieldInput.nextElementSibling.innerHTML = field.validate;
    });

    // s'il y a regex verification
    if (field.regex) {
      // test de la valeur mise par l'utilisateur  si regex valide

      if (!field.regex.test(inputValue)) {
        // sinon  erreur dans nextElementSibling

        fieldInput.nextElementSibling.textContent = field.error;
        // fieldInput.nextElementSibling.style.color = "red";

        validForm = false;
        continue;
      }
    }

    data[field.name] = inputValue;
  }

  if (validForm) {
    return data;
  } else {
    return false;
  }
};

const ordre = () => {
  let data = checkInputs();
  if (!data) {
    return;
  }

  let products = JSON.parse(localStorage.getItem("cart")) || [];
  let productData = [];
  if(!products[0]){
    return
  }
  for (let product of products) {
    for (let index = 0; index < product.itemQuantity; index++) {
      productData.push(product.id);
    }
  }

  fetch(KanapAPI + "order", {
    method: "POST",
    headers: {
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
      console.log("Success:", data);
      window.location.replace("confirmation.html?orderId=" + data.orderId)
    })

    .catch((error) => {
      console.error("Error:", error);
    });
};

window.addEventListener("load", demarage);
