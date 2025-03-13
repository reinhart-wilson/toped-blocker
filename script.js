// ==UserScript==
// @name         Block Seller
// @namespace    http://tokopedia.com/
// @version      2024-06-13
// @description
// @author       reinhart-wilson
// @match        https://www.tokopedia.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokopedia.com
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
const blockedSellers = JSON.parse(GM_getValue("blockedSellers", "[]"));
const blockedWords = JSON.parse(GM_getValue("blockedWords", "[]"));
const badword = 'BLOCKED';

function removeProduct() {
    const productContainerSelector = '.css-5wh65g';

    const sellerSpans = document.getElementsByClassName('flip');
    const sellerSpansArray = Array.from(sellerSpans);

    for (const elem of sellerSpansArray) {
        const sellerName = elem.innerText.trim().toLowerCase();
        if (blockedSellers.includes(sellerName)) {
            const productContainer = elem.closest(productContainerSelector);
            productContainer.innerHTML = 'BLOCKED';
        }
    }

    const productNameSpans = document.getElementsByClassName('_0T8-iGxMpV6NEsYEhwkqEg==');
    const productNameSpansArray = Array.from(productNameSpans);

    for (const elem of productNameSpansArray) {
        const productName = elem.innerText.toLowerCase();
        for (const word of blockedWords) {
            if (productName.includes(word)) {
                const productContainer = elem.closest(productContainerSelector);
                productContainer.innerHTML = 'BLOCKED';
                break; // Stop checking once a match is found
            }
        }
    }
}

// Triggers a callback at specified interval.
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
    element.innerText = innerText;
    if (parent) {
        parent.appendChild(element);
    }
    return element;
}

// Observes if an element (specified by selector) has been loaded. Does callback if true.
function waitForElement(selector, callback, options = { childList: true, subtree: true }) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            obs.disconnect();
        }
    });

    observer.observe(document.body, options);
}

// This function adds the input field filter for entering words or sellers users want to block
function addBlockFilter(element) {
    let blockDiv = document.createElement('div');

    // The title of the filter item
    const blockTitleBtn = document.createElement("button");
    blockTitleBtn.type = "button";
    blockTitleBtn.className = "css-v39ha5";
    const blockTitleText = document.createElement("h6");
    blockTitleText.className = "css-zyuuxa-unf-heading e1qvo2ff6";
    blockTitleText.innerText = "Sembunyikan Produk";
    blockTitleBtn.appendChild(blockTitleText);

    // Filter body, where the input field will be placed
    const blockBodyDiv = document.createElement("div");
    blockBodyDiv.className = "css-1m93f3h";

    blockDiv.appendChild(blockTitleBtn);
    blockDiv.appendChild(blockBodyDiv);

    // Blocked word input field
    const keywordBlockInput = document.createElement('input');
    keywordBlockInput.name = 'keywords';
    keywordBlockInput.className = "css-6v0gm9 exxxdg63";
    blockBodyDiv.append(keywordBlockInput);
    keywordBlockInput.addEventListener("change", function () {
        const input = keywordBlockInput.value.trim();
        if (input) {
            const words = input.split(",").map(word => word.trim().toLowerCase());
            blockedWords.push(...words); // Add new words to array
            GM_setValue("blockedWords", JSON.stringify(blockedWords)); // Save updated array
            removeProduct();
        }
    });

    // Blocked seller input field
    const sellerBlockInput = document.createElement('input');
    sellerBlockInput.name = 'sellers';
    sellerBlockInput.className = "css-6v0gm9 exxxdg63";
    blockBodyDiv.append(sellerBlockInput);
    sellerBlockInput.addEventListener("change", function () {
        const input = sellerBlockInput.value.trim();
        if (input) {
            const sellers = input.split(",").map(word => word.trim().toLowerCase());
            blockedSellers.push(...sellers); // Add new words to array
            GM_setValue("blockedSellers", JSON.stringify(blockedSellers)); // Save updated array
            removeProduct();
        }
    });
    element.prepend(blockDiv);
}

(function () {
    'use strict';

    // Removal is triggered every set interval since Tokopedia does not show all products directly.
    // WIP: should be a better approach out there. Could use the addBlockFilter fuction, but should use extra parameter(s) to work properly
    triggerFunction(removeProduct, 5, 2000);
    window.navigation.addEventListener('navigate', () => { triggerFunction(removeProduct, 3, 1000); });

    // Adds an input UI for filtering products.
    let filterParentDivSelector = '[data-testid="cntrBlockFilter"]';
    waitForElement(filterParentDivSelector, (element) => { addBlockFilter(element); });
    window.navigation.addEventListener('navigate', () => { waitForElement(filterParentDivSelector, (element) => { addBlockFilter(element); }); });

})();
