// ==UserScript==
// @name         Block Seller
// @namespace    http://tokopedia.com/
// @version      2024-06-13
// @description  
// @author       reinhart-wilson
// @match        https://www.tokopedia.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokopedia.com
// @grant        none
// ==/UserScript==

const blockedSellers = ['joss sport', 'alzenolshop', 'yuntimistawa', 'yauob', 'arunika mart', 'pelangiwarnai',
                        'latar 0mbo', /2000\sStore$/i, '^\\b\\w+\\b\\s+\\b\\w+\\b\\s+\\b\\w+shop\\b$',
                       'pt dasiansejahteruuuuuu', 'pt sarungsejahteruuuuuu', 'keyla928', 'hello ztore',
                       'snanana', 'eclat naturel', 'uana sjsjsjs', 'ortus ll', 'zakhi market', 'wong official store',
                       'astraiwo', 'tokped seller nih', 'kelontong776', 'danker08', 'expetasia1 shop', 'juaratoko3', 'yskf majd',
                       'yarayanurani', 'farmborneo', 'tikabus211', 'blanca store official', 'patuhastore77', 'ofkfkfkl',
                       'randy27flame toys', 'poplolii', 'ichigou daimaru', 'lolli', 'toko babel_', 'yusrii mot', 'playinovatif',
                       'dutebaby', 'dreamy dragons den', 'mojik store', 'marjuki print', 'lunami store', 'mardano store',
                       'mia geberr', 'revangga garage', 'marujuki print', 'gonden store']
const blockedWords = ['kirim', 'best', 'zt4', 'garansi', 'nz store', 'miliki', 'ht1', 'ToysZone', 'um(1)', 'kcx1', 'ad5!',
                     'terlaris', 'termurah', 'terbaru', 'berkualitas', 'top quality', 'terbatas', 'gercep', 'kuyy', 'e-katalog',
                     't05', 'promo', 'viral', 'happy', '1zy', 'silahkan', 'sini', 'asli', 'ter update', 'terupdate', 'ofkfkfkl',
                     'hw211', 'dabg01']
const badword = 'BLOCKED';


const removeProduct = () => {
    const sellerSpans = document.getElementsByClassName('flip');
    const sellerSpansArray = Array.from(sellerSpans);

    for (const elem of sellerSpansArray){
        const sellerName = elem.innerText

        // Check if sellerName is in blockedSellers ignoring case
        const isBlocked = blockedSellers.some(blockedSeller => {
            const regex = new RegExp(blockedSeller, 'i'); // 'i' flag for case-insensitive matching
            return regex.test(sellerName);
        });
        if (isBlocked) {
            const productContainer = elem.parentElement.parentElement.parentElement.parentElement;
            productContainer.innerHTML = badword;
        }
    }

    const productNameSpans = document.getElementsByClassName('_0T8-iGxMpV6NEsYEhwkqEg==');
    const productNameSpansArray = Array.from(productNameSpans);

    for (const elem of productNameSpansArray){
        const productName = elem.innerText

        // Check if sellerName is in blockedSellers ignoring case
        const isBlocked = blockedWords.some(word => productName.toLowerCase().includes(word.toLowerCase()));
        if (isBlocked) {
            const productContainer = elem.parentElement.parentElement.parentElement;
            productContainer.innerHTML = badword;
        }
    }
}

const triggerFunction = (func, times, interval) => {
    let counter = 0;


    const executeFunction = () => {
        removeProduct();
        counter++;

        if (counter < times) {
            setTimeout(executeFunction, interval);
        }
    };

    executeFunction();
};

function createElement(tag, classNames = [], parent = null, innerText = null) {
    const element = document.createElement(tag);
    element.classList.add(...classNames);
    element.innerText = innerText
    if (parent) {
        parent.appendChild(element);
    }
    return element;
}



(function() {
    'use strict';

    // On first load, removal is triggered every 2000ms since Tokopedia does not show all products directly.
    triggerFunction(removeProduct(), 5, 2000);
    // On subsequent pages, it is safe to trigger the script on load since all products are shown at once.
    window.navigation.addEventListener('navigate', ()=>{triggerFunction(removeProduct(), 3, 1000)});
  
})();
