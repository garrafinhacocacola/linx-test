$(() => {
    // Populate the products container using an array of products and an URL for the next page
    const populateProductsContainer = ((products, nextPage) => {
        // Variables
        const productsContainer = document.querySelector(".product-container");
        const nextPageButtonContainer = document.querySelector(".more-products-container");
        let productElement = undefined;
        let nextPageButtonElement = undefined;
        let nextPageButton = undefined;
        // Iterate over each product as an object, create a product card and append it to the parent container
        $.each(products, (key, value) => {
            productElement = `
                <div class="product-card" id="${value.id}">
                    <img src="" alt="">
                    <div class="product-information">
                        <span id="product-name">${value.name}</span>
                        <span id="product-from-price">De: R$${value.oldPrice}</span>
                        <span id="product-by-price">Por: R$${value.price}</span>
                        <span id="product-split">ou ${value.installments.count}x de R$${value.installments.value}</span>
                        <button>Comprar</button>
                    </div>
                </div>
            `
            $(productsContainer).append(productElement);
        });
        // Create a button to the next page and set the URL as its ID, then watch over clicks to load the next product's page
        nextPageButtonElement = `<button id="${nextPage}" class="next-product-page">Ainda mais produtos aqui!</button>`;
        $(nextPageButtonContainer).append(nextPageButtonElement);
        nextPageButton = document.querySelector(".next-product-page");
        $(nextPageButton).click((event) => {
            $(nextPageButton).remove();
            loadProducts(event.target.id);
        });
    });

    // Load an array of products using an specific page, but when this is called without a page, load the first page of products
    const loadProducts = ((page=undefined) => {
        if (page === undefined) {
            page = 'frontend-intern-challenge-api.iurykrieger.now.sh/products?page=1';
        }
        $.ajax({
            url: `https://${page}`,
            type: 'GET'
        }).done((productsReturned) => {
            populateProductsContainer(productsReturned.products, productsReturned.nextPage);
        });
    });

    // Validate any input by choosing what to validate, and disable the submit button if it's not valid
    const validateInputs = (targetInput, whatToValidate, submitButton) => {
        const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        let isValid = false;
        switch (whatToValidate) {
            case 'name':
                isValid = $(targetInput).val().match('^[a-zA-Z]{3,16}$');
                break;
            case 'email':
                // Validate if the field is not empty or with spaces
                if ($(targetInput).val() === "") {
                    break;
                }
                isValid = emailReg.test($(targetInput).val());
                break;
            default:
                break;
        };
        // Add a css class to the input, making it red and disabling the button
        if (isValid) {
            $(targetInput).removeClass("invalid-field");
        } else {
            $(targetInput).addClass("invalid-field");
            $(submitButton).prop("disabled", true);
        }
        return isValid;
    };

    // Load products as the page completes loading
    loadProducts();

    // Both below watches for the newsletter inputs to lose focus and validate both fields to prevent submitting the form with errors
    $("#share-name").on("blur", (event) => {
        if (
            validateInputs(event.target, 'name', $("#share-button"))
            &&
            validateInputs($("#share-email"), 'email', $("#share-button"))
        ) {
            $("#share-button").prop("disabled", false);
        }
    });

    $("#share-email").on("blur", (event) => {
        if (
            validateInputs(event.target, 'email', $("#share-button"))
            &&
            validateInputs($("#share-name"), 'name', $("#share-button"))
        ) {
            $("#share-button").prop("disabled", false);
        }
    });
});