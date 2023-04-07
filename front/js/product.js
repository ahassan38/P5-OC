let url = new URL(location.href); //déclare une variable valant l'url de la page actuelle
let kanapPageId = url.searchParams.get("id"); //récupère l'id contenu dans l'url de la page actuelle

const zoneImgKanap = document.querySelector(".item__img");
const nomKanap = document.querySelector("#title");
const prixKanap = document.querySelector("#price");			// emplacements des différentes zones
const speechKanap = document.querySelector("#description");	// d'insertion des variables dynamiques
const colorOptions = document.querySelector("#colors");
const getProductQuantity = document.querySelector("#quantity");

fetch(`http://localhost:3000/api/products/${kanapPageId}`) //je ne selectionne QUE la partie du JSON qui m'interesse en fonction de l'id du kanap concerné à fetch
	.then((res) => res.json())
	.then((object) => {
		const imgKanap = object.imageUrl;
		const nameKanap = object.name;
		const priceKanap = object.price;
		const descriptKanap = object.description;
		const colorsKanap = object.colors;

		for (let couleur of colorsKanap) {
			colorOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
		}
		zoneImgKanap.innerHTML += `<img src="${imgKanap}" alt="Photographie d'un canapé">`;
		nomKanap.innerText += `${nameKanap}`;
		prixKanap.innerText += `${priceKanap} `;
		speechKanap.innerText += `${descriptKanap}`;

		// je crée une fonction déclenchée au clic sur le bouton ADDTOCART

		const button = document.getElementById("addToCart");

		//---------------------------------------localStorage----------------------------------------------------

		// liste des actions déclenchées au clic sur le bouton "ajouter"
		button.addEventListener("click", () => {
			let kanapValue = {
				//initialisation de la variable kanapValue
				idSelectedProduct: kanapPageId,
				nameSelectedProduct: nameKanap,
				colorSelectedProduct: colorOptions.value,
				quantity: getProductQuantity.value
			};

			//je crée une fonction de récupération du panier
			function getKanap() {
				let kanapValue = JSON.parse(localStorage.getItem("cartLs"));
				if (kanapValue === null) {
					return [];				//si le LocalStorage est vide, on crée un tableau vide
				} else {
					return kanapValue
				}
			}

			//je crée une fonction d'ajout au panier avec argument product
			function addkanap(product) {
				let kanapValue = getKanap();
				let foundProducts = kanapValue.find(
					/// on définit foundProducts comme l'article à trouver
					(item) =>
						item.idSelectedProduct === product.idSelectedProduct &&
						item.colorSelectedProduct === product.colorSelectedProduct	
				); //si les produits du panier et les produits du LS n'ont pas même ID et même couleur
					// il retournera undefined  
				if (
					foundProducts == undefined &&
					colorOptions.value != "" &&			//si les consitions sont OK
					getProductQuantity.value > 0 &&
					getProductQuantity.value <= 100
				) {
					product.quantity = getProductQuantity.value; //la quantité saisie est définie 
					kanapValue.push(product);					 //dans le Ls
				} else {
					let newQuantity =
						parseInt(foundProducts.quantity) +
						parseInt(getProductQuantity.value); //CUMUL Quantité si présent ID et color
					foundProducts.quantity = newQuantity;
				}
				saveKanap(kanapValue);
				alert(
					`Le canapé ${nameKanap} ${colorOptions.value} a été ajouté en ${getProductQuantity.value} exemplaires à votre panier !`
				);
			}
			//je crée une fonction de sauvegarde du panier
			function saveKanap(kanapValue) {
				localStorage.setItem("cartLs", JSON.stringify(kanapValue));
			}

			// Si le choix de couleur est vide
			if (colorOptions.value === "") {
				alert("Veuillez choisir une couleur, SVP");
			}
			// Si la quantité choisie est nulle OU si elle dépasse 100
			else if (
				getProductQuantity.value <= 0 ||
				getProductQuantity.value > 100
			) {
				alert("Veuillez sélectionner une quantité correcte, SVP");
			} else {
				//Si tout est OK, on envoie le panier au LS
				addkanap(kanapValue);
			}
		});
	})
	.catch(function (err) {
		console.log(err);
	});

