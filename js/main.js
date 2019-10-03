// Trying something new.
Hey = {
    Satan: {
        host: "/",
        ready: function domReady(fn) {
            // If we're early to the party
            document.addEventListener("DOMContentLoaded", fn);
            // If late; I mean on time.
            if (document.readyState === "interactive" || document.readyState === "complete") {
                fn();
            }
        },
        target: () => {
            // Let's Get This Bread.
            const urlParams = new URLSearchParams(window.location.search);
            return 'https://' + urlParams.get('target');
        },
        clear: (item) => {
            while (item.firstChild) item.removeChild(item.firstChild);
        },
        // Serialize forms before submitting
        serialize: function (form) {
            if (!form || form.nodeName !== "FORM") {
                return
            }
            let i, j, q = [];
            for (i = form.elements.length - 1; i >= 0; i = i - 1) {
                if (form.elements[i].name === "") {
                    continue
                }
                switch (form.elements[i].nodeName) {
                    case"INPUT":
                        switch (form.elements[i].type) {
                            case"text":
                            case"search":
                            case"email":
                            case"hidden":
                            case"password":
                            case"button":
                            case"reset":
                            case"submit":
                                if (form.elements[i].value !== '') q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                            case"checkbox":
                            case"radio":
                                if (form.elements[i].checked) {
                                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value))
                                }
                                break;
                            case"file":
                                break
                        }
                        break;
                    case"TEXTAREA":
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                    case"SELECT":
                        switch (form.elements[i].type) {
                            case"select-one":
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                            case"select-multiple":
                                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                    if (form.elements[i].options[j].selected) {
                                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value))
                                    }
                                }
                                break
                        }
                        break;
                    case"BUTTON":
                        switch (form.elements[i].type) {
                            case"reset":
                            case"submit":
                            case"button":
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break
                        }
                        break
                }
            }
            return q.join("&")
        },
        contains: function (target, pattern) {
            let value = 0;
            pattern.forEach(function (word) {
                value = value + (target === word);
            });
            return (value === 1)
        },
        on: function (target, events, fn) {
            let e = events.split(' ');

            e.every(cb => {
                if (target) target.addEventListener(cb, fn, false);

                return false;
            });
        },
        inventory: () => {
            // Make the call
            axios.get(Hey.Satan.target() + '/products.json')
                // If it works
                .then(function (response) {
                    // Get inventory data
                    let data = response.data;

                    localStorage.setItem('data', JSON.stringify(data['products']));

                    // Load store inventory
                    let inventory = document.querySelector('#products');

                    data['products'].forEach(
                        product => {
                            let info = Hey.Satan.product(product, Hey.Satan.target());
                            if (info !== undefined) inventory.insertAdjacentHTML('beforeend', info);
                        }
                    );

                    // Handle cart data
                    Hey.Satan.cart(data);
                })
                // If it fails
                .catch(function (error) {
                    console.log(error);
                });
        },
        product: (json) => {
            // Count how many variants are available in a single product.
            let available = 0;
            json['variants'].forEach(item => {
                available += (item['available'] === true);
            });

            // Get the thumbnail of the first variant, most likely primary.
            let thumb = (json.images.length > 0) ? json.images[0].src : 'https://static1.squarespace.com/static/5a012e62a8b2b08dfb252872/t/5a0cfe13f9619aada94a05fc/1510800936269/32_100T_Logo_Red_DarkBG_1920x1080.png?format=400w';

            // Create the contents of the product.
            return `
            <div class="product tf bb ma-b-30 m-ma-b-30" ${(available === 0) ? `style="opacity: .4"` : ``}>
                <div class="product-image fw-bg br ma-b-10 m-ma-b-10" style="background: #0F0F0F url(${thumb}) no-repeat center;background-size: cover;"></div>
                <h6 class="product-title ma-b-10 m-ma-b-10">${json.title}</h6>
                <div class="variants df mf b-bg br wt">
                    ${json['variants'].map((item) => `
                        ${(item['available'] === true) ? `<div id="variant-${item.id}" class="csf wt pa-v-10 pa-h-15 m-pa-a-10 cp" data-variant="${item.id}" style="flex: 0 0 auto;">${item.title}</div>` : ``}
                    `.trim()).join('')}
                </div>
            </div>
            `;
        },
        cart: (data) => {
            // Load cart
            let cart = localStorage.getItem('cart');

            Hey.Satan.updateCart();

            if (cart !== null) {
                let list = document.querySelector('#cart-items');

                let itemCount = 0;

                let cartData = JSON.parse(cart);

                cartData.forEach(cartItem => {
                    itemCount++;
                    // Get data for product
                    let foundProduct = data['products'].find(product => {
                        return product['variants'].some(item => {
                            return item.id === parseInt(cartItem.variant);
                        })
                    });

                    if (foundProduct) {
                        // Get data for variant
                        let foundProductVariant = foundProduct['variants'].find(variant => {
                            return variant.id === parseInt(cartItem.variant);
                        });

                        // Find product
                        let productVariant = document.querySelector('[data-variant="' + cartItem.variant + '"]');

                        if (productVariant) {
                            // If the product exists, mark it so the user knows it's there.
                            productVariant.classList.add('ruby');

                            let cartItemInfo = `
                            <div id="cart-${cartItem.variant}" class="cart-item df mf sbf wt ${(itemCount !== cartData.length) ? `ma-b-10 m-ma-b-10 pa-b-10 m-pa-b-10` : ``}">
                                <div class="ma-r-10 m-ma-r-10">
                                    <div>${foundProduct.title}</div>
                                    <div class="st">$${foundProductVariant['price']} - <em class="glt">${foundProductVariant.title}</em></div>
                                </div>
                                <div class="df mf">
                                    <input class="cart-quantity br ma-r-20 m-ma-r-20 no-bg wt b" type="number" value="${cartItem['quantity']}" data-quantity="${cartItem.variant}" style="width: 30px;height: 25px;"/>
                                    <div class="cp" data-remove="${cartItem.variant}"><i class="fas fa-times cp fa-lg deep"></i></div>
                                </div>
                            </div>
                            `;

                            // Show item in cart
                            list.insertAdjacentHTML('beforeend', cartItemInfo);
                        } else {
                            // TODO: If the product doesn't exist, automatically remove it from the cart or mark it for disregard, thus taking it out of the compiled URL automatically.
                        }
                    }
                });
            }
        },
        addToCart: (item) => {
            let data = JSON.parse(localStorage.getItem('data'));

            let cart = [];

            if (localStorage.getItem('cart')) cart = JSON.parse(localStorage.getItem('cart'));

            let variant = cart.find(product => product.variant === item.dataset.variant);

            if (variant) {
                variant.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));

                let value = document.querySelector('#cart-' + item.dataset.variant + ' input[type=number]');

                value.value = variant.quantity;
            } else {
                cart.push({'variant': item.dataset.variant, 'quantity': 1});

                localStorage.setItem('cart', JSON.stringify(cart));

                // Get data for product
                let foundProduct = data.find(product => {
                    return product['variants'].some(variant => {
                        return variant.id === parseInt(item.dataset.variant);
                    })
                });

                // Get data for variant
                let foundProductVariant = foundProduct['variants'].find(variant => {
                    return variant.id === parseInt(item.dataset.variant);
                });

                let cartItemInfo = `
                <div id="cart-${item.dataset.variant}" class="cart-item df mf sbf wt">
                    <div class="ma-r-10 m-ma-r-10">
                        <div>${foundProduct.title}</div>
                        <div class="st">$${foundProductVariant['price']} - <em class="glt">${foundProductVariant.title}</em></div>
                    </div>
                    <div class="df mf">
                        <input class="cart-quantity br ma-r-20 m-ma-r-20 no-bg wt b" type="number" value="1" data-quantity="${item.dataset.variant}" style="width: 30px;height: 25px;"/>
                        <div class="cp" data-remove="${item.dataset.variant}"><i class="fas fa-times cp fa-lg deep"></i></div>
                    </div>
                </div>
                `;

                let list = document.querySelector('#cart-items');

                if (list.lastElementChild) list.lastElementChild.classList.add('ma-b-10', 'm-ma-b-10');

                // Toss item in cart
                list.insertAdjacentHTML('beforeend', cartItemInfo);

                item.classList.add('ruby');
            }

            Hey.Satan.updateCart();
        },
        removeFromCart: (item) => {
            if (confirm('Are you sure you want to remove this product from your cart?')) {
                let cartVariant = document.querySelector('#cart-' + item.dataset.remove);
                if (cartVariant) cartVariant.remove();

                let productVariant = document.querySelector('#variant-' + item.dataset.remove);
                if (productVariant) productVariant.classList.remove('ruby');

                let cart = JSON.parse(localStorage.getItem('cart'));
                let products = cart.filter(product => product.variant !== item.dataset.remove.toString());
                localStorage.setItem('cart', JSON.stringify(products));

                Hey.Satan.updateCart();
            }
        },
        updateCart: () => {
            let data = JSON.parse(localStorage.getItem('data'));
            let cart = JSON.parse(localStorage.getItem('cart'));
            let button = document.querySelector('#checkout-link');
            let amount = document.querySelector('#cart-price');
            let subtotal = document.querySelector('#cart-subtotal');
            let loading = document.querySelector('#cart-loading');
            let empty = document.querySelector('#cart-empty');
            let items = '';

            // Once the cart finishes loading initially.
            if (loading) loading.remove();

            // Now check for any differences.
            if (cart.length > 0) {
                // Add ID's and Quantities into a string to prepare for checkout
                cart.forEach((i, v) => {
                    items += ((v !== 0) ? ',' : '') + i.variant + ':' + i.quantity
                });

                let prefill = localStorage.getItem('params');

                // Show and update button and other elements for checkout
                empty.classList.add('none');
                amount.classList.remove('none');
                button.classList.remove('none');
                button.setAttribute('href', Hey.Satan.target() + '/cart/' + items + ((prefill !== null || prefill !== 'undefined') ? '?' + JSON.parse(prefill) : ''));

                // Update subtotal
                let cost = 0;

                cart.forEach(item => {
                    // Get data for product
                    let foundProduct = data.find(product => {
                        return product['variants'].some(v => {
                            return v.id === parseInt(item.variant);
                        })
                    });

                    if (foundProduct) {
                        // Get data for variant
                        let foundProductVariant = foundProduct['variants'].find(v => {
                            return v.id === parseInt(item.variant);
                        });

                        // Base the math on quantity
                        cost += item.quantity * parseInt(foundProductVariant['price']);
                    }
                });

                Hey.Satan.clear(subtotal);
                subtotal.insertAdjacentHTML('beforeend', `$` + cost);
            } else {
                // Hide button and update to prevent any bad clicks
                empty.classList.remove('none');
                amount.classList.add('none');
                button.classList.add('none');
                button.setAttribute('href', 'javascript:void(0);');
            }
        },
        updatePrefill: () => {
            let inputs = new URLSearchParams(JSON.parse(localStorage.getItem('params')));
            document.querySelector('input[name="checkout[email]"]').value = inputs.get('checkout[email]');
            document.querySelector('input[name="checkout[shipping_address][first_name]"]').value = inputs.get('checkout[shipping_address][first_name]');
            document.querySelector('input[name="checkout[shipping_address][last_name]"]').value = inputs.get('checkout[shipping_address][last_name]');
            document.querySelector('input[name="checkout[shipping_address][address1]"]').value = inputs.get('checkout[shipping_address][address1]');
            document.querySelector('input[name="checkout[shipping_address][address2]"]').value = inputs.get('checkout[shipping_address][address2]');
            document.querySelector('input[name="checkout[shipping_address][city]"]').value = inputs.get('checkout[shipping_address][city]');
            document.querySelector('input[name="checkout[shipping_address][zip]"]').value = inputs.get('checkout[shipping_address][zip]');
        }
    }
};

Hey.Satan.ready(function () {
    Hey.Satan.inventory();
    Hey.Satan.updatePrefill();

    // Listen to any click on the body and react to an item that matches the classes below.
    document.addEventListener('click', event => {
        // Main target
        const item = event.target;

        // Add item to cart
        if (item.hasAttribute('data-variant')) Hey.Satan.addToCart(item);

        // Remove item from cart
        if (item.hasAttribute('data-remove')) Hey.Satan.removeFromCart(item);

        // Detect quantity change
        document.querySelectorAll('.cart-quantity').forEach(input => input.addEventListener('focusout', event => {
            const box = event.target;

            let cart = [];

            if (localStorage.getItem('cart')) cart = JSON.parse(localStorage.getItem('cart'));

            let variant = cart.find(product => product.variant === box.dataset.quantity);

            variant.quantity = box.value;
            localStorage.setItem('cart', JSON.stringify(cart));
            Hey.Satan.updateCart();
        }));

        // Detect prefill change
        document.querySelectorAll('.early-input').forEach(input => input.addEventListener('focusout', event => {
            let form = Hey.Satan.serialize(document.querySelector('#early-prefill'));
            localStorage.setItem('params', JSON.stringify(form));
            Hey.Satan.updateCart();
        }));
    });
});