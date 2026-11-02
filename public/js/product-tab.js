import * as CONST from './constants.js'
import { disableFormButtons, displayGlobalMessage } from './tools.js';

const ProductTab = {

    // Identifiants des éléments HTML du panneau
    createFormId : '#product #product-form',
    listContainerId : '#product #product-list',
    globalMessageId : '#product #global-message',
        
    myList : async () => {               
        const tab = document.querySelector(ProductTab.listContainerId)

        tab.replaceChildren()

        const productLine = (index, infos) => {
            const p = document.createElement("p")
            p.textContent = `${index}. ${infos.map((v) => v).join(', ')}`
            return p
        };

        const response = await fetch(`${CONST.HOST}${CONST.ROUTES.products}`)
        
        if (!response.ok)
            document.querySelector('#product-message').textContent = `Erreur: [${response.status}] les produits sont injoignables.`           

        const data = await response.json()

        data.forEach((p, i) => tab.appendChild(productLine(i + 1, Object.keys(p).filter(k => k !== 'id').map(k => p[k]))))
    },
    
    loadList : async () => {
        
        const tabContent = document.querySelector(ProductTab.listContainerId);
        tabContent.replaceChildren();

        try{

            const response = await fetch(CONST.HOST + CONST.ROUTES.products, {
                headers: {
                    [CONST.HEADER.XApiKey]: CONST.API_KEY
                }
            });
        
            if (!response.ok) {

                throw new Error(`Statut de réponse : ${response.status}`);

            }

            const data = await response.json();
            
            if (!data) return;

            // À partir d'ici l'affichage change comparé à myList()
           
            data.forEach(product => {
                
                const form = document.createElement('form');
                form.classList.add('d-inline-block', 'm-2');
                
                const inputId = document.createElement('input');
                inputId.name = CONST.PRODUCT.id;
                inputId.type = 'text';
                inputId.value = product.id
                inputId.classList.add('mx-2', 'text-center');
                inputId.setAttribute('disabled', true);
                inputId.setAttribute('style', "max-width: 50px");

                const inputName = document.createElement('input');
                inputName.type = 'text';
                inputName.name = CONST.PRODUCT.name;
                inputName.value = product.name;
                inputName.dataset.name = product.name;
                inputName.placeholder = 'Name';
                inputName.classList.add('mx-2');

                const inputPicture = document.createElement('input');
                inputPicture.type = 'file';
                inputPicture.name = CONST.PRODUCT.picture;
                inputPicture.title = product.picture;
                inputPicture.dataset.picture = product.picture;
                inputPicture.classList.add('mx-2');

                const inputPrice = document.createElement('input');
                inputPrice.type = 'text';
                inputPrice.name = CONST.PRODUCT.price;
                inputPrice.placeholder = 'Price';
                inputPrice.value = product.price;
                inputPrice.dataset.price = product.price;
                inputPrice.classList.add('mx-2', 'text-center');
                inputPrice.setAttribute('style', "max-width: 75px");

                const saveButton = document.createElement('button');
                saveButton.type = 'submit';
                saveButton.textContent = 'Save';
                saveButton.classList.add('btn', 'btn-primary', 'mx-2');
                saveButton.addEventListener('click', async (event) => { await ProductTab.saveProduct(event, product.id) } );
                
                const resetButton = document.createElement('button');
                resetButton.textContent = 'Reset';
                resetButton.classList.add('btn', 'btn-warning', 'mx-2');
                resetButton.addEventListener('click', async (event) => { await ProductTab.resetProduct(event) } );
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-danger', 'mx-2');
                deleteButton.addEventListener('click', async (event) => { await ProductTab.deleteProduct(event, product.id) } );
                
                form.appendChild(inputId);
                form.appendChild(inputName);
                form.appendChild(inputPicture);
                form.appendChild(inputPrice);
                form.appendChild(saveButton);
                form.appendChild(resetButton);
                form.appendChild(deleteButton);
                                
                tabContent.appendChild(form);     
            
            });

        } catch (error) {

            // pour le moment on ne va qu'afficher l'erreur
            console.log(error.message);
        }

    },

    // Associer le bouton "Create" avec la fonction "createProduct"
    createProductSubmitBindEvent : () => {

        try {

            const form = document.querySelector(ProductTab.createFormId);
            form.addEventListener('submit', async (event) => { await ProductTab.createProduct(event) } );

        } catch (error) {

            // pour le moment on ne va qu'afficher l'erreur
            console.log(error.message);
        }
        
    
    },

    // Créer un produit par appel API
    createProduct : async (event) => {
        
        const form = document.querySelector(ProductTab.createFormId);
        
        try {

            event.preventDefault();            

            disableFormButtons(form);
            
            const data = {

                name : form.elements[CONST.PRODUCT.name].value,

                // .split('\\').pop() est temporaire car on simule le fichier en utilisant son nom
                picture : form.elements[CONST.PRODUCT.picture].value.split('\\').pop(),

                price : form.elements[CONST.PRODUCT.price].value

            };

            let valid = true;
            let invalidFieldIds = []
            // Valider les données avant l'appel à l'API
            if (data.name.trim() == "") {
                invalidFieldIds.push(form.elements[CONST.PRODUCT.name].id)
                valid = false
            }              
            if (data.picture.trim() == "") {
                invalidFieldIds.push(form.elements[CONST.PRODUCT.picture].id)
                valid = false
            }
            if (data.price.trim() == "" || isNaN(data.price)) {
                invalidFieldIds.push(form.elements[CONST.PRODUCT.price].id)
                valid = false
            }

            form.reset();           
            
            if (valid) {               
                let text, success
                // Créer le produit
                const res = await fetch(
                    CONST.HOST + CONST.ROUTES.createProduct.route,
                    {
                        method: CONST.ROUTES.createProduct.method,
                        headers: {
                            [CONST.HEADER.contentType]: CONST.CONTENT_TYPE.applicationJson
                        },
                        body: JSON.stringify(data)
                    }
                )
                
                console.log(res.headers.get(CONST.HEADER.location))
                ProductTab.loadList();    

                switch (res.status) {
                    case CONST.HTTP_STATUS.Created:
                        text = CONST.TEXT.productCreated
                        success = true
                        break;
                    case CONST.HTTP_STATUS.BadRequest:
                        text = CONST.TEXT.fieldsMissingValuesInvalid
                        success = false
                        break;
                    case CONST.HTTP_STATUS.Conflict:
                        text = CONST.TEXT.productNameAlreadyExists
                        success = false
                        break;
                    case CONST.HTTP_STATUS.ServiceUnavailable:
                        text = CONST.TEXT.ServiceUnavailable
                        break;
                    default:
                        text = CONST.TEXT.errorOccurred
                        success = false
                }

                displayGlobalMessage(ProductTab.globalMessageId, text, success);
                
                return
            }

            displayGlobalMessage(ProductTab.globalMessageId, CONST.TEXT.fieldsMissingValuesInvalid, valid);
            
            // Remplir les fields correct
            for (const key of Object.keys(data)) {
                const value = data[key]
                let el = form.elements[key]

                if (!el) continue // no matching field, avoid a different crash

                if (invalidFieldIds.includes(key)) {
                    el.classList.add('errored-field')
                    continue
                }

                if (el.type === 'file') {
                    // can't set file input values programmatically — skip or handle differently
                    continue
                }

                el.value = value
            }
            // focus le premier field erroné            
            form.elements[invalidFieldIds[0]].focus()

        } catch (error) {
            displayGlobalMessage(ProductTab.globalMessageId, CONST.TEXT.errorOccurred, false)
            // pour le moment on ne va qu'afficher l'erreur
            console.log(error);

        } finally {
            disableFormButtons(form, false);  
        }                

    },

    // Enregistrer la modification du produit par appel API
    saveProduct : async (event, id) => {

        try {

            event.preventDefault();
            // console.log('Save: ' + id);

            const form = event.target.parentElement;
            
            disableFormButtons(form);

            const data = {

                name : form.elements[CONST.PRODUCT.name].value,

                // .split('\\').pop() est temporaire car onsimule le fichier en utilisant son nom
                picture : form.elements[CONST.PRODUCT.picture].value.split('\\').pop(),

                price : form.elements[CONST.PRODUCT.price].value

            };

            console.log(data);
            
            // Normalement ici on devrait valider les données avant l'appel à l'API

            // === Compléter la suite de la fonction ===

            // Appel API PUT ou PATCH ?

            // Supposons un succès pour tester la suite
            const response = {};
            response.status = 200;

            switch (response.status) {

                case CONST.HTTP_STATUS.OK:
                
                    form.elements[CONST.PRODUCT.name].dataset.name = data.name;

                    form.elements[CONST.PRODUCT.picture].dataset.picture = data.picture;
                    form.elements[CONST.PRODUCT.picture].title = data.picture;
                    form.elements[CONST.PRODUCT.picture].value = '';

                    form.elements[CONST.PRODUCT.price].dataset.price = data.price;                      

                    displayGlobalMessage(ProductTab.globalMessageId, CONST.TEXT.productSaved, true);

                    break;

                case CONST.HTTP_STATUS.NotFound:
                
                    displayGlobalMessage(ProductTab.globalMessageId, CONST.TEXT.productNotExists, false);

                    break;

                default :
                
                    displayGlobalMessage(ProductTab.globalMessageId, CONST.TEXT.errorOccurred, false);

                    break;
            }

            disableFormButtons(form, false);

        } catch (error) {

            // pour le moment on ne va qu'afficher l'erreur
            console.log(error.message);

        } 

    },
    
    // Remettre les valeurs originales du produit grâce à "dataset"
    resetProduct : async (event) => {

        try {

            event.preventDefault();
            const form = event.target.parentElement;
            
            form.elements[CONST.PRODUCT.name].value = form.elements[CONST.PRODUCT.name].dataset.name;
            form.elements[CONST.PRODUCT.picture].value = '';
            form.elements[CONST.PRODUCT.price].value = form.elements[CONST.PRODUCT.price].dataset.price;

        } catch (error) {

            // pour le moment on ne va qu'afficher l'erreur
            console.log(error.message);
        } 

    },

    // Supprimer un produit par appel API
    deleteProduct : async (event, id) => {

        try {

            event.preventDefault();
            console.log('Delete: ' + id);

            // === Compléter la suite de la fonction ===

            // Appel API
            const res = await fetch(
                CONST.HOST + CONST.ROUTES.deleteProduct.route + `/${id}`,
                {
                    method: CONST.ROUTES.deleteProduct.method,
                    headers: {
                        [CONST.HEADER.contentType]: CONST.CONTENT_TYPE.applicationJson
                    }                    
                }
            )

            let text
            let success = res.status >= 200 && res.status < 300            
            
            switch (res.status) {
                case CONST.HTTP_STATUS.OK:
                    text = CONST.TEXT.productDeleted
                    break;
                case CONST.HTTP_STATUS.NotFound:
                    text = CONST.TEXT.productNotExists
                    break;
                case CONST.HTTP_STATUS.BadRequest:
                    text = CONST.TEXT.fieldsMissingValuesInvalid
                    break;
                case CONST.HTTP_STATUS.ServiceUnavailable:
                    text = CONST.TEXT.ServiceUnavailable
                    break;
                default:
                    text = CONST.TEXT.errorOccurred
                    break;
            }
            if (success) {
                ProductTab.loadList()
            }
            displayGlobalMessage(ProductTab.globalMessageId, text, success)

        } catch (error) {
            displayGlobalMessage(ProductTab.globalMessageId, CONST.TEXT.errorOccurred, false)
            // pour le moment on ne va qu'afficher l'erreur
            console.log(error.message);
        } 
        
    }, 

};

export default ProductTab;