let KanapAPI = "http://localhost:3000/api/products/";
const cartItems = document.querySelector("#cart__items");
const totalPrice = document.querySelector("#totalPrice");
const totalQuantity = document.querySelector("#totalQuantity");
const order  = document.querySelector("#order")
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = [];

function displayProduct(productId, productColor, productQuantity) {
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
    });


}

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
  const cards = JSON.parse(localStorage.getItem("cart")) || [];
  let product = cards.find((i) => i.id == productId);

  let productItemDom = document.querySelector(
    `[data-id="${productId}"][data-color="${color}"]`
  );

  // retirer item du tableau
  const index = cards.indexOf(product);
  if (index > -1) {
    cards.splice(index, 1);
  }

  // mise à jour du panier
  localStorage.setItem("cart", JSON.stringify(cards));

  // retirer product item du DOM
  cartItems.removeChild(productItemDom);

  calculateTotal();
};

const calculateTotal = () => {
  const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  let totalQuantityNumber = 0;

  for (let item of updatedCart) {
     let prod = products.find((i) => i._id == item.id);

    if (prod) {
      let price = prod.price * item.itemQuantity;
      total += price;
      totalQuantityNumber += parseInt(item.itemQuantity);
    }
  }
  totalPrice.textContent = total;
  totalQuantity.textContent = totalQuantityNumber;
};

for (let item of cart) {
  console.log(`${item.id}-${item.itemColor}-${item.itemQuantity}`);
  displayProduct(item.id, item.itemColor, item.itemQuantity);

}


order.addEventListener("submit",(event) =>{
  event.preventDefault();
  
})