let KanapAPI = "http://localhost:3000/api/products/";
const cartItems = document.querySelector("#cart__items");
const totalPrice = document.querySelector("#totalPrice");
const totalQuantity = document.querySelector("#totalQuantity");

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = [];

function displayProduct(productId, productColor, productQuantity) {
  fetch(KanapAPI + productId)
    .then((res) => res.json())
    .then((produit) => {
      products.push(produit);
      // calculateTotal();
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

      // const deleteBtn = document.querySelector(
      //   `[data-id="${produit._id}"][data-color="${productColor}"] .deleteItem`
      // );

      // const changeBtn = document.querySelector(
      //   `[data-id="${produit._id}"][data-color="${productColor}"] .itemQuantity`
      // );

      // changeBtn.addEventListener("change", (e) => {
      //   changeQuantity(produit._id, productColor, e.target.value);
      // });

      // deleteBtn.addEventListener("click", () => {
      //   deleteItem(produit._id, productColor);
      // });

      console.log(produit.name);
    });
}

// const changeQuantity = (id, color, value) => {
//   const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];

//   // find item with that id
//   let item = updatedCart.find((i) => i.id == id && i.itemColor == color);

//   // get item's index

//   let index = updatedCart.indexOf(item);

//   // update cart
//   item.itemQuantity = value;
//   updatedCart[index] = item;

//   // update cart in localStorage

//   localStorage.setItem("cart", JSON.stringify(updatedCart));

//   // calculate total price and quiantity

//   calculateTotal();
// };

// const deleteItem = (productId, color) => {
//   let product = cart.find((i) => i.id == productId);

//   let productItemDom = document.querySelector(
//     `[data-id="${productId}"][data-color="${color}"]`
//   );

//   // remove item from array
//   const index = cart.indexOf(product);
//   if (index > -1) {
//     cart.splice(index, 1);
//   }

//   // update cart
//   localStorage.setItem("cart", JSON.stringify(cart));

//   // remove product item from DOM
//   cartItems.removeChild(productItemDom);

//   calculateTotal();
// };

// const calculateTotal = () => {
//   const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
//   let total = 0;
//   let totalQuantityNumber = 0;

//   for (let item of updatedCart) {
//     let prod = products.find((i) => i._id == item.id);

//     if (prod) {
//       let price = prod.price * item.itemQuantity;
//       total += price;
//       totalQuantityNumber += parseInt(item.itemQuantity);
//     }
//   }
//   totalPrice.textContent = total;
//   totalQuantity.textContent = totalQuantityNumber;
// };

for (let item of cart) {
  console.log(`${item.id}-${item.itemColor}-${item.itemQuantity}`);
  displayProduct(item.id, item.itemColor, item.itemQuantity);
}
