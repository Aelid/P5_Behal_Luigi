//Initialisation du local storag
onQuantiteeChange();
getArticles();

async function getArticles() {
    var articlesCatch = await fetch("http://localhost:3000/api/products")
    return await articlesCatch.json();   
}

let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
    console.table(produitLocalStorage)
const positionEmptyCart = document.querySelector("#cart__items"); 
  

//Crée la div img
function createProductDivImg(produitLocalStorage) {
    // Mise en place de la div contenant l'img"
    let productDivImg = document.createElement("div");
    productDivImg.className = "cart__item__img";

    // Mise en place de l'élément "img"
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = produitLocalStorage.imgProduit;
    productImg.alt = produitLocalStorage.altImgProduit;

    return productDivImg;
}
//Affiche le panier
async function afficherPanier() {
    
    if (produitLocalStorage === null || produitLocalStorage === 0) {
        const emptyCart = `<p>Votre panier est vide</p>`;
        positionEmptyCart.innerHTML = emptyCart;
    } else {
        for (let produit in produitLocalStorage) {
            // Mise en place de l'élément "article"
            let productArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(productArticle);
            productArticle.className = "cart__item";
            productArticle.setAttribute('data-id', produitLocalStorage[produit].idProduit);

            let productDivImg = createProductDivImg(produitLocalStorage[produit]);
            productArticle.appendChild(productDivImg);

            // Mise en place de l'élément "div"
            let productItemContent = document.createElement("div");
            productArticle.appendChild(productItemContent);
            productItemContent.className = "cart__item__content";

            // Mise en place de l'élément "div"
            let productItemContentTitlePrice = document.createElement("div");
            productItemContent.appendChild(productItemContentTitlePrice);
            productItemContentTitlePrice.className = "cart__item__content__titlePrice";

            // Mise en place de l'élément "h2"
            let productTitle = document.createElement("h2");
            productItemContentTitlePrice.appendChild(productTitle);
            productTitle.innerHTML = produitLocalStorage[produit].nomProduit;

            // Mise en place de l'élément "panier color"
            let productColor = document.createElement("p");
            productTitle.appendChild(productColor);
            productColor.innerHTML = produitLocalStorage[produit].couleurProduit;
            productColor.style.fontSize = "20px";

            // Mise en place de l'élément "product price"
            let productPrice = document.createElement("p");
            productItemContentTitlePrice.appendChild(productPrice);
            getArticles().then(function(resultatAPI) {
                const articles = resultatAPI;
                for (let article in articles){ 
            productPrice.innerHTML = resultatAPI[article].price+ " €";}})
            
            // Mise en place de l'élément "div"
            let productItemContentSettings = document.createElement("div");
            productItemContent.appendChild(productItemContentSettings);
            productItemContentSettings.className = "cart__item__content__settings";

            // Mise en place de l'élément "div"
            let productItemContentSettingsQuantity = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsQuantity);
            productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

            // Mise en place de "Qté : "
            let productQte = document.createElement("p");
            productItemContentSettingsQuantity.appendChild(productQte);
            productQte.innerHTML = "Qté : ";

            // Mise en place de la quantité
            let productQuantity = document.createElement("input");
            productItemContentSettingsQuantity.appendChild(productQuantity);
            productQuantity.value = produitLocalStorage[produit].quantiteProduit;
            productQuantity.className = "itemQuantity";
            productQuantity.setAttribute("type", "number");
            productQuantity.setAttribute("min", "1");
            productQuantity.setAttribute("max", "100");
            productQuantity.setAttribute("name", "itemQuantity");

            // Mise en place de l'élément "div"
            let productItemContentSettingsDelete = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

            // Mise en place de l'élément "p" pour supprimer
            let productSupprimer = document.createElement("p");
            productItemContentSettingsDelete.appendChild(productSupprimer);
            productSupprimer.className = "deleteItem";
            productSupprimer.innerHTML = "Supprimer";
        }
        onQuantiteeChange();
        showTotalPrice();
        showTotalQuantity();
        deleteProduct();
        
    }
}

//Affiche la quantité totale
function showTotalQuantity() {

    // Récupération du total des quantités
    var elemsQtt = document.getElementsByClassName('itemQuantity');
    var myLength = elemsQtt.length, totalQtt = 0;

    for (var i = 0; i < myLength; ++i) {
        totalQtt += elemsQtt[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQtt;
}
//Affiche le prix total
function showTotalPrice() {
    getArticles().then(function(resultatAPI) {
        const articles = resultatAPI;
        for (let article in articles) {

    var quantitees = document.getElementsByClassName('itemQuantity');
    var nombreDelementDansLePanier = quantitees.length, // Récupération du prix
        totalPrice = 0;
    // Récupération du prix total
    for (var i = 0; i < nombreDelementDansLePanier; ++i) {
        totalPrice += (quantitees[i].valueAsNumber * resultatAPI[article].price);
    }

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;
    console.log(totalPrice);
    
}})}
//Changement de quantité
function onQuantiteeChange() {
    let qttModif = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < qttModif.length; k++) {
        qttModif[k].addEventListener("change", (event) => {
            event.preventDefault();
    // Changement de l'élement en fonction de son id/couleur
    let quantityModif = produitLocalStorage[k].quantiteProduit;
    let qttModifValue = qttModif[k].valueAsNumber;

    const resultFind = produitLocalStorage.find((el) => el.qttModifValue !== quantityModif);

    resultFind.quantiteProduit = qttModifValue;
    produitLocalStorage[k].quantiteProduit = resultFind.quantiteProduit;

    localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
    // reload la page
    location.reload();
})}}


// Suppression d'un produit
function deleteProduct() {
    let btn_supprimer = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < btn_supprimer.length; j++){
        btn_supprimer[j].addEventListener("click" , (event) => {
            event.preventDefault();

            // Choix de l'élement a supp celon l'id/couleur
            let idDelete = produitLocalStorage[j].idProduit;
            let colorDelete = produitLocalStorage[j].couleurProduit;

            produitLocalStorage = produitLocalStorage.filter( el => el.idProduit !== idDelete || el.couleurProduit !== colorDelete );

            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

            // alerte de produit supprimer
            
            location.reload();
            afficherPanier();
        })
    }
}

//Verification des modification
function addVerificationListernerToForm() {
    // Ajout des Regex
    let form = document.querySelector(".cart__order__form");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('change', function () {
        validFirstName(this);
    });
    // Ecoute de la modification du nom
    form.lastName.addEventListener('change', function () {
        validLastName(this);
    });
    // Ecoute de la modification de l'adresse
    form.address.addEventListener('change', function () {
        validAddress(this);
    });
    // Ecoute de la modification de la ville
    form.city.addEventListener('change', function () {
        validCity(this);
    });
    // Ecoute de la modification de l'email
    form.email.addEventListener('change', function () {
        validEmail(this);
    })
}
//Validation du prénom
function validFirstName(inputFirstName) {
    let firstNameErrorMsg = inputFirstName.nextElementSibling;
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    if (charRegExp.test(inputFirstName.value)) {
        firstNameErrorMsg.innerHTML = '';
    } else {
        firstNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
}
//Validation du nom
function validLastName(inputLastName) {
    let lastNameErrorMsg = inputLastName.nextElementSibling;
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    if (charRegExp.test(inputLastName.value)) {
        lastNameErrorMsg.innerHTML = '';
    } else {
        lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
}
//Validation de la ville
function validAddress(inputAddress) {
    let addressErrorMsg = inputAddress.nextElementSibling;
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
    if (addressRegExp.test(inputAddress.value)) {
        addressErrorMsg.innerHTML = '';
    } else {
        addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
}
//Validation de la ville
function validCity(inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    if (charRegExp.test(inputCity.value)) {
        cityErrorMsg.innerHTML = '';
    } else {
        cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
    }
}
//Validation de l'email
function validEmail(inputEmail) {
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value)) {
        emailErrorMsg.innerHTML = '';
    } else {
        emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
    }
}

function commanderLePanier(){ 
    //envois des infos au localstorage
    const btn_commander = document.getElementById("order");
    
    //Ecouter le panier
    btn_commander.addEventListener("click", (event) => {
    event.preventDefault();
    console.log('Jai cliqué sur commandé !');

    //Recupération des coordonnées du formulaire client
    let inputName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputMail = document.getElementById('email');

    // Mise en place d'un aray
    let idProducts = [];
    for (let i = 0; i < produitLocalStorage.length; i++) {
    idProducts.push(produitLocalStorage[i].idProduit);
    }
    console.log(idProducts);
        
    const order = {
        contact: {
            firstName: inputName.value,
            lastName: inputLastName.value,
            address: inputAdress.value,
            city: inputCity.value,
            email: inputMail.value,
        },  
        products: idProducts,
    }
    
    const options = {
        method: 'POST', body: JSON.stringify(order), headers: {
            'Accept': "application/json", "Content-Type": "application/json"
        },
    };
    fetch("http://localhost:3000/api/products/order", options)
        .then((resp) => resp.json())
        .then((data) => {
            console.log("data",data);
            localStorage.clear();
            localStorage.setItem("orderId", data.orderId);

            document.location.href = 'confirmation.html?id='+ data.orderId
        })
        .catch((err) => {
            alert("Erreur Fetch" + err.message);
        });
        })
}

deleteProduct();
afficherPanier();
addVerificationListernerToForm();
commanderLePanier();