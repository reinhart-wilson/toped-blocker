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

// As of latest version, users are required to manually edit this array to add blocked sellers or word. Currently working on a better approach.
const blockedSellers = [
    '^\\b\\w+\\b\\s+\\b\\w+\\b\\s+\\b\\w+shop\\b$', 'claramelisaa shop',
    'alzenolshop', 'yuntimistawa', 'yauob', 'arunika mart', 'pelangiwarnai',
    'latar 0mbo', /2000\sStore$/i, 'pt dasiansejahteruuuuuu', 'keyla928',
    'pt sarungsejahteruuuuuu', 'hello ztore', 'snanana', 'eclat naturel',
    'uana sjsjsjs', 'ortus ll', 'zakhi market', 'wong official store',
    'astraiwo', 'tokped seller nih', 'kelontong776', 'danker08', 'juaratoko3',
    'expetasia1 shop', 'yarayanurani', 'farmborneo', 'tikabus211', 'poplolii',
    'gonden store', 'blanca store official', 'patuhastore77', 'ofkfkfkl',
    'randy27flame toys', 'ichigou daimaru', 'lolli', 'toko babel_', 'yusrii mot',
    'playinovatif', 'dutebaby', 'dreamy dragons den', 'mojik store','marjuki print',
    'lunami store', 'mardano store', 'mia geberr', 'revangga garage', 'marujuki print']

const blockedWords = [
    'kirim', 'best', 'zt4', 'garansi', 'nz store', 'miliki', 'ht1', 'ToysZone', 'um(1)', 'kcx1', 'ad5!',
    'terlaris', 'termurah', 'terbaru', 'berkualitas', 'top quality', 'terbatas', 'gercep', 'kuyy', 'e-katalog',
    't05', 'promo', 'viral', 'happy', '1zy', 'silahkan', 'sini', 'asli', 'ter update', 'terupdate', 'newasik',
    'hw211', 'dabg01'
];
const badword = 'BLOCKED';


function removeProduct() {
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

// Uses observer to do action after a specified element has been loaded
function waitForElement(selector, callback, options = { childList: true, subtree: true }) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element); // Execute the callback when the element appears
            obs.disconnect(); // Stop observing once found (optional)
        }
    });

    observer.observe(document.body, options);
}

function addBlockFilter(element){
    let blockDiv = document.createElement('div');

    // Create button element for filter title
    const blockTitleBtn = document.createElement("button");
    blockTitleBtn.type = "button";
    blockTitleBtn.className = "css-v39ha5";
    const blockTitleText = document.createElement("h6");
    blockTitleText.className = "css-zyuuxa-unf-heading e1qvo2ff6";
    blockTitleText.innerText = "Sembunyikan Produk";
    blockTitleBtn.appendChild(blockTitleText)

    // Create div element
    const blockBodyDiv = document.createElement("div");
    blockBodyDiv.className = "css-1m93f3h";

    // Append to parent div
    blockDiv.appendChild(blockTitleBtn);
    blockDiv.appendChild(blockBodyDiv);

    // Add input for entering keywords to be blocked
    const keywordBlockInput = document.createElement('input')
    keywordBlockInput.name = 'keywords'
    keywordBlockInput.className="css-6v0gm9 exxxdg63"
    blockBodyDiv.append(keywordBlockInput)

    // Add listener: on input change, hide products according to the user's input
    keywordBlockInput.addEventListener("change", function() {
        const input = keywordBlockInput.value.trim();
        if (input) {
            let words = input.split(",").map(word => word.trim()); // Split by commas & trim spaces
            blockedWords.push(...words); // Append words to array
            removeProduct();
        }
    });

    // Add to filter box on the left hand side of the screen
    element.prepend(blockDiv)
}



(function() {
    'use strict';

    // On first load, removal is triggered every 2000ms since Tokopedia does not show all products directly.
    triggerFunction(removeProduct(), 5, 2000);
    // On subsequent pages, it is safe to trigger the script on load since all products are shown at once.
    window.navigation.addEventListener('navigate', ()=>{triggerFunction(removeProduct(), 1, 1000)}); // Delay of a second to make sure that all product has been loaded in case of slow internet connection


    let filterParentDivSelector = '[data-testid="cntrBlockFilter"]';
    waitForElement(filterParentDivSelector, (element)=>{addBlockFilter(element)})
    window.navigation.addEventListener('navigate', ()=>{waitForElement(filterParentDivSelector, (element)=>{addBlockFilter(element)})});

})();