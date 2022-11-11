let KanapAPI = "http://localhost:3000/api/products";
const cartItems = document.querySelector("#cart__items");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

for (let item of cart) {
  console.log(`${item.id}-${item.itemColor}-${item.itemQuantity}`);

   const newElement = document.createElement("article");

   newElement.innerHTML = `<h3>Quantity: ${item.itemQuantity} Color: ${item.itemColor} Id: ${item.id}</h3>`;
  //   newElement.innerHTML =`div class = "cart_item"_img
  //                            <img src ="${product.imageUrl}" alt =${pruduct.altTxt}`
  cartItems.appendChild(newElement);
}
