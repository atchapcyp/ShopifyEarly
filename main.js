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
        // Serialize forms before submitting
        serialize: function (form) {
            if(!form||form.nodeName!=="FORM"){return }let i,j,q=[];for(i=form.elements.length-1;i>=0;i=i-1){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"text":case"search":case"email":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=form.elements[i].options.length-1;j>=0;j=j-1){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")
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
        product: function (json, target) {
            // Count how many variants are available in a single product.
            let available = 0;
            json.variants.forEach(item => {available += (item.available === true);});

            // Get the thumbnail of the first variant, most likely primary.
            let thumb = (json.images.length > 0) ? json.images[0].src : 'https://static1.squarespace.com/static/5a012e62a8b2b08dfb252872/t/5a0cfe13f9619aada94a05fc/1510800936269/32_100T_Logo_Red_DarkBG_1920x1080.png?format=400w';

            // Create the contents of the product.
            let product = `
            <div class="product bb hf ma-b-30 m-ma-b-30">
                <div class="product-image br ma-b-10 m-ma-b-10" style="background: #0F0F0F url(${thumb}) no-repeat center;background-size: cover;"></div>
                <h6 class="ma-b-10 m-ma-b-10">${json.title}</h6>
                <div class="variants df mf sbf b-bg br wt">
                    ${json.variants.map((item) => `
                        ${(item.available === true) ? `<a href="${target}/cart/${item.id}:1" class="blk csf wt pa-v-10 pa-h-15 m-pa-a-10">${item.title}</a>` : ``}
                    `.trim()).join('')}
                </div>
            </div>
            `;

            // If no variants are available, hide the product.
            if (available > 0) return product;
        }
    }
}

Hey.Satan.ready(function () {
    // Let's Get This Bread.
    const urlParams = new URLSearchParams(window.location.search);
    const target = 'https://' + urlParams.get('target');

    // Make the call
    axios.get(target + '/products.json')
        // If it works
        .then(function(response) {
            let inventory = document.querySelector('#products');
            response.data.products.forEach(
                product => {
                    let info = Hey.Satan.product(product, target);
                    if (info !== undefined) inventory.insertAdjacentHTML('beforeend', info);
                }
            );

        })
        // If it fails
        .catch(function(error) {
            console.log(error);
        });
});