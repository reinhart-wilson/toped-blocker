// ==UserScript==
// @name         Block Seller
// @namespace    http://tokopedia.com/
// @version      2024-06-13
// @description
// @author       reinhart-wilson
// @match        https://www.tokopedia.com/search?*
// @match        https://www.tokopedia.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokopedia.com
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
const blockedSellers = JSON.parse(GM_getValue("blockedSellers", "[]"));
const blockedWords = JSON.parse(GM_getValue("blockedWords", "[]"));
const badword = 'BLOCKED';

const productContainerSelectors = ['.css-5wh65g', '.css-bk6tzz']; 
const sellerElementSelectors = [
    '.flip',
    '.css-ywdpwd'
];
const productNameSelectors = [
    '[class="+tnoqZhn89+NHUA43BpiJg=="]', 
    '.css-20kt3o'
];
const productListSelectors = [
    '[data-testid="divSRPContentProducts"]',
    '[data-testid="lstCL3ProductList"]',
];

const blockDivId = 'block-seller-filter';
const buttonClass = 'css-1x3ipd9-unf-chip e6yxrl1';

function removeProduct() {
    // --- Handle seller name blocking ---
    for (const sellerSelector of sellerElementSelectors) {
        const sellerElems = document.querySelectorAll(sellerSelector);
        sellerElems.forEach(elem => {
            const sellerName = elem.innerText.trim().toLowerCase();
            if (blockedSellers.includes(sellerName)) {
                const productContainer = findClosestContainer(elem);
                if (productContainer) productContainer.innerHTML = badword;
            }
        });
    }

    // --- Handle keyword blocking ---
    for (const productNameSelector of productNameSelectors) {
        const productElems = document.querySelectorAll(productNameSelector);
        productElems.forEach(elem => {
            const productName = elem.innerText.toLowerCase();
            for (const word of blockedWords) {
                if (productName.includes(word)) {
                    const productContainer = findClosestContainer(elem);
                    if (productContainer) productContainer.innerHTML = badword;
                    break; // Stop after the first matched word
                }
            }
        });
    }
}

// Utility: finds the closest parent that matches any known product container class
function findClosestContainer(element) {
    for (const selector of productContainerSelectors) {
        const container = element.closest(selector);
        if (container) return container;
    }
    return null;
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

// modified waitForElement that waits matching element attributes instead of just one.
function waitForAnyElement(selectors, callback, options = { childList: true, subtree: true }) {
    console.log('Observer started');

    const observer = new MutationObserver((mutations, obs) => {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                obs.disconnect();
                return;
            }
        }
    });

    observer.observe(document.body, options);
}


// This function adds the input field filter for entering words or sellers users want to block
function addBlockFilter(element) {
    let blockDiv = document.createElement('div');
    blockDiv.setAttribute("id", blockDivId);

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

    // Additional containers to match the look of Tokopedia's GUI
    const blockContainer = document.createElement('div');
    blockContainer.className = 'css-1cb34wj';
    blockBodyDiv.appendChild(blockContainer);

    // Function to create styled text inputs matching Tokopedia's inputs' appearence
    function createStyledInput({ name, placeholder = "", onChange }) {
        const input = document.createElement('input');
        input.name = name;
        input.placeholder = placeholder;
        input.className = "css-6v0gm9 exxxdg63";

        const container = document.createElement('div');
        container.style.borderRadius = '8px';
        container.style.border = '1px solid var(--color-border, #E5E7E9)';
        container.style.padding = '0px 12px';
        container.style.margin = '8px 0px'
        container.appendChild(input);

        input.addEventListener('change', onChange);

        return container;
    }

    function createStyledButton({text, onPress}){
        const button = document.createElement('button');
        button.innerText = text;
        button.addEventListener('click', onPress);
        button.className = buttonClass;
        button.type = 'button';

        button.style.marginTop = '1vh';

        return button;
    }

    const keywordBlockDiv = createStyledInput({
        name: 'keywords',
        placeholder: 'Sembunyikan Kata Kunci',
        onChange: () => {
            const input = keywordBlockDiv.querySelector('input').value.trim();
            if (input) {
                const words = input.split(',').map(word => word.trim().toLowerCase());
                blockedWords.push(...words);
                GM_setValue("blockedWords", JSON.stringify(blockedWords));
                removeProduct();
            }
        }
    });
    blockContainer.append(keywordBlockDiv);

    const sellerBlockDiv = createStyledInput({
        name: 'sellers',
        placeholder: 'Sembunyikan Penjual',
        onChange: () => {
            const input = sellerBlockDiv.querySelector('input').value.trim();
            if (input) {
                const sellers = input.split(',').map(word => word.trim().toLowerCase());
                blockedSellers.push(...sellers);
                GM_setValue("blockedSellers", JSON.stringify(blockedSellers));
                removeProduct();
            }
        }
    });
    blockContainer.append(sellerBlockDiv);

    const sellerResetButton = createStyledButton({
        text: 'Reset Seller',
        onPress: resetBlockedSellers
    });
    blockContainer.append(sellerResetButton);

    const wordsResetButton = createStyledButton({
        text: 'Reset Kata',
        onPress: resetBlockedWords
    });
    blockContainer.append(wordsResetButton);

    const parentElement = element;
    parentElement.prepend(blockDiv);
}

// This function observers the addition of products in prodList, then triggers
// the script when changes are present.
function observeProdListChange(element){
    const prodList = element;
    const observerConfig = { childList: true, subtree: true };
    const observerCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                removeProduct();
            }
        }
    };
    const observer = new MutationObserver(observerCallback);
    observer.observe(prodList, observerConfig);
}

function onProdListLoad(element){
    removeProduct();
    observeProdListChange(element);
}

function onFilterLoad(element){
    if (!document.getElementById(blockDivId)) {
        addBlockFilter(element);
    }
}

function resetBlockedSellers() {
    GM_setValue("blockedSellers", JSON.stringify([]));
    window.location.reload();
}

function resetBlockedWords() {
    GM_setValue("blockedWords", JSON.stringify([]));
    window.location.reload();
}


(function () {
    'use strict';

    // Adds an input UI for filtering products.
    let filterParentDivSelectors = ['[data-testid="cntrBlockFilter"]', '.filterBlockContainer'];
    waitForAnyElement(filterParentDivSelectors, (element) => { onFilterLoad(element); });
    window.navigation.addEventListener('navigate', () => { waitForElement(filterParentDivSelectors, (element) => { onFilterLoad(element); }); });

    // React to changes in DOM
    //    const prodListSelector = `[data-testid="${searchProductListContainerDataTestId}"]`;
    //  waitForElement(prodListSelector, onProdListLoad);
    waitForAnyElement(productListSelectors, onProdListLoad);

})();
