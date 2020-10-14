$(() => {
    const populateProductsContainer = ((products, nextPage) => {
        const productsContainer = document.querySelector(".product-container");
        const nextPageButtonContainer = document.querySelector(".more-products-container");
        let productElement = undefined;
        let nextPageButtonElement = undefined;
        let nextPageButton = undefined;
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
        nextPageButtonElement = `<button id="${nextPage}" class="next-product-page">Ainda mais produtos aqui!</button>`;
        $(nextPageButtonContainer).append(nextPageButtonElement);
        nextPageButton = document.querySelector(".next-product-page");
        // $(nextPageButton).attr("id", nextPage);
        $(nextPageButton).click((event) => {
            // $(productsContainer).html("");
            // loadProducts(event.target.id);
            $(nextPageButton).remove();
            // $(productsContainer).height($(productsContainer).height() + 1450);
            // console.log($(productsContainer).height());
            loadProducts(event.target.id);
        });
    });

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

    const validateInputs = (targetInput, whatToValidate, submitButton) => {
        const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        let isValid = false;
        switch (whatToValidate) {
            case 'name':
                isValid = $(targetInput).val().match('^[a-zA-Z]{3,16}$');
                break;
            case 'email':
                if ($(targetInput).val() === "") {
                    break;
                }
                isValid = emailReg.test($(targetInput).val());
                break;
            default:
                break;
        };
        if (isValid) {
            $(targetInput).removeClass("invalid-field");
        } else {
            $(targetInput).addClass("invalid-field");
            $(submitButton).prop("disabled", true);
        }
        return isValid;
    };

    loadProducts();

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