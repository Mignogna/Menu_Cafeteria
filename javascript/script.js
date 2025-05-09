import { foodItems } from "./catalogue.js";

const productContainer = document.getElementById("product-container");
const order = document.getElementById("food-order");
const openModal = document.getElementById("order-list")
const viewOrderList = document.getElementById("modal-order");
const foodItem = document.querySelectorAll(".food-card");
const totalPrice = document.getElementById("order-amount");
const finishOrder = document.getElementById("finish-btn");
const closeModal = document.getElementById("close-modal-btn");
const orderQuantity = document.getElementById("order-count");
const addressInput = document.getElementById("input-address");
const orderItemsContainer = document.getElementById("order-items");
let orderItems = [];
let totalAmount = 0;

function renderFoodItems(items) {
    productContainer.innerHTML = '';
    items.forEach(item => {
        const foodCard = `
        <div class="food-card">
          <img class="food-img" src="${item.image}" alt="${item.name}">
          <div class="food-card-description">
            <p class="food-name">${item.name}</p><br>
            <p class="food-desc">${item.description}</p><br>
            <p class="food-price">${item.price}</p>
            <button  id="food-order" class="food-order">Pedir</button>
          </div>
        </div>`;
        productContainer.innerHTML += foodCard;
    });
}

window.chooseSnacks = function () {
    const snacks = foodItems.filter(item => item.type === "snacks");
    renderFoodItems(snacks);
}

window.chooseDessert = function () {
    const desserts = foodItems.filter(item => item.type === "dessert");
    renderFoodItems(desserts);
}

window.chooseDrinks = function () {
    const drinks = foodItems.filter(item => item.type === "drinks");
    renderFoodItems(drinks);
}

renderFoodItems(foodItems);

openModal.addEventListener("click", function () {
    viewOrderList.classList.remove("modal-order");
    viewOrderList.classList.add("show-modal-order");
})
closeModal.addEventListener("click", function () {
    viewOrderList.classList.remove("show-modal-order");
    viewOrderList.classList.add("modal-order");
})



function addToOrder(item) {
    const existingItem = orderItems.find(orderItem => orderItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        item.quantity = 1;
        orderItems.push(item);
    }
    totalAmount += item.price;
    renderOrderItems();
}

function renderOrderItems() {
    orderItemsContainer.innerHTML = '';
    totalAmount = 0;
    orderItems.forEach(item => {
        totalAmount += item.price * item.quantity;
        const orderItem = `
        <div class="order-item">
            <p>${item.name} (${item.quantity})</p> 
            <div class="order-price">
                R$ ${(item.price * item.quantity).toFixed(2)} 
                <i class="bi bi-trash-fill"></i>
            </div>
        </div>`;

        orderItemsContainer.innerHTML += orderItem;
    });

    document.getElementById("amount").innerText = `R$ ${totalAmount.toFixed(2)}`;
    orderQuantity.innerText = orderItems.length;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("food-order")) {
        const foodCard = event.target.closest(".food-card");
        const foodName = foodCard.querySelector(".food-name").innerText;
        const foodPrice = parseFloat(foodCard.querySelector(".food-price").innerText.replace("R$ ", "").replace(",", "."));
        addToOrder({ name: foodName, price: foodPrice });
    }
    else if (event.target.classList.contains("bi-trash-fill")) {
        const orderItem = event.target.closest(".order-item");
        const itemName = orderItem.querySelector("p").innerText.split(" (")[0];
        orderItems = orderItems.filter(item => item.name !== itemName);
        renderOrderItems();
    }
});
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.style.border = "1px solid #528fd3"
    }
})
finishOrder.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        Toastify({
            text: "Ooops! O restaurante está fechado!",
            duration: 3000,
                   close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "#ff0000",
              color:"#fff8dc",
              border:"2px solid #fff8dc",
              outline:"2px solid #ff0000"
            },
          
          }).showToast();
          return;
    }
    if (orderItems.length === 0) return;
    if (addressInput.value === "") {
        addressInput.style.border = "3px solid #ff0000";
        return;
    }
    const orderCompleted = orderItems.map((item) => {
        return(
            `${item.name} Qtd:${item.quantity} R$ ${item.price} / `
        )
    }).join("")
    const message = encodeURIComponent(orderCompleted);
    const phone = "5511982362156";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");
    orderItems=[];
    renderFoodItems();
});

function checkRestaurantOpen() {
    const date = new Date();
    const hour = date.getHours();
    return hour >= 9 && hour < 19;
}
const scheduleHour = document.querySelector(".store-hours");
const isOpen = checkRestaurantOpen();
const overlay = document.querySelector(".overlay");
if(isOpen){
    overlay.style.display= "none"
    scheduleHour.style.color = "#f3c740";
}else{
    overlay.style.display = "block"
    scheduleHour.style.color = "#ff0000";
    scheduleHour.style.textShadow = "1px 1px 3px #f3c740"
}












