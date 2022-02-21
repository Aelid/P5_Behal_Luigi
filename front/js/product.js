var currentUrl = new URL(window.location.href);
var idProduct = currentUrl.searchParams.get("id");
console.log(idProduct);
let article = "";

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

getArticle();

// On récupere les articles dans l'API
function getArticle() {
    fetch("http://localhost:3000/api/products/" + idProduct)
        .then((res) => {
            return res.json();
        })

        // On repartie les données de l'API dans le DOM
        .then(async function (resultatAPI) {
            article = resultatAPI;
            console.table(article);
            if (article) {
                addArticleToDom(article);
            }
        })
        .catch((error) => {
            console.log("Erreur de la requête API");
        })
}

function addArticleToDom(article) {

// Mise en place de l'image
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

// Modification du titre
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;

// Modification du prix
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

// Modification de la description
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

// Mise en place des changement de couleurs
    for (let colors of article.colors) {
        console.table(colors);
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
    addToCart(article);
}

// Gestion du panier
function addToCart(article) {
    const btn_envoyerPanier = document.querySelector("#addToCart");
// Ecouter le panier avec comme condition couleur non nulle et la quantité entre 1 et 100
    btn_envoyerPanier.addEventListener("click", (event) => {
        if (quantityPicked.value > 0 && quantityPicked.value <= 100 && quantityPicked.value != 0) {

// Choix de la couleur
            let choixCouleur = colorPicked.value;

// Choix de la quantité               
            let choixQuantite = quantityPicked.value;

// Recupération des options de l'article a mettre dans le panier
            let optionsProduit = {
                idProduit: idProduct,
                couleurProduit: choixCouleur,
                quantiteProduit: Number(choixQuantite),
                nomProduit: article.name,
                descriptionProduit: article.description,
                imgProduit: article.imageUrl,
                altImgProduit: article.altTxt,
            };

// Initialisation du local storage
            let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
// fenêtre pop-up
            const popupConfirmation = () => {
                if (window.confirm(`Votre commande de ${choixQuantite} ${article.name} ${choixCouleur} est ajoutée au panier, veuillez cliquer sur OK`)) {
                    window.location.href = "cart.html";
                }
            }
// Importation dans le local storage si le panier a un article
            if (produitLocalStorage) {
                const resultFind = produitLocalStorage.find(
                    (el) => el.idProduit === idProduct && el.couleurProduit === choixCouleur);

                // Si le produit en question est déjà dans le panier
                if (resultFind) {
                    let newQuantite =
                        parseInt(optionsProduit.quantiteProduit) + parseInt(resultFind.quantiteProduit);
                    resultFind.quantiteProduit = newQuantite;
                    console.log("Le produit est dans le localsotrage", optionsProduit);
                    localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
                    console.table(produitLocalStorage);
                    popupConfirmation();

                    // Si le produit en question n'est pas dans le panier
                } else {
                    console.log("Le produit n'est pas dans la localsotrage", optionsProduit);
                    produitLocalStorage.push(optionsProduit);
                    localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
                    console.table(produitLocalStorage);
                    popupConfirmation();
                }

                // Si le panier est vide
            } else {
                produitLocalStorage = [];
                produitLocalStorage.push(optionsProduit);
                localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
                console.table(produitLocalStorage);
                popupConfirmation();
            }
        }
    });
}