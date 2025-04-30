# 🛡️ Toped Blocker

Marketplaces like Tokopedia often suffer from **dropshipper bots**—automated accounts that duplicate listings from other sellers and repost them with inflated prices. This practice clutters search results with irrelevant and overpriced items, leading to a frustrating shopping experience.

Tokopedia does little to prevent this, and currently offers **no feature** to filter out specific sellers or unwanted product listings. This script aims to fill that gap with a simple solution: **block products based on seller names or product keywords**.

---

## ⚙️ How It Works

Since directly altering Tokopedia's backend queries is practically impossible, this script "blocks" products by **hiding their interface elements**. Any matching product will be replaced with a simple label: `BLOCKED`, so you can visually skip past them in search results. As of now it only works on search pages.

---

## 🔍 Mechanism

1. **User Input**  
   The script allows users to input:
   - A list of **seller names** to block (exact match).
   - A list of **product keywords** to hide (partial match).

2. **Persistent Storage**  
   All inputs are saved locally using TamperMonkey’s `GM_setValue` and `GM_getValue`, so your preferences stay even after refreshing or restarting the browser.

3. **Content Filtering**  
   When the page loads or a new input is added, the script:
   - Searches the DOM for seller names and product titles.
   - Hides products if:
     - The seller name **exactly matches** any entry in the block list.
     - The product title **contains** any of the blocked keywords.

---

## 🧩 Installation

1. **Install TamperMonkey**  
   Make sure you have [TamperMonkey](https://www.tampermonkey.net/) installed on your browser.

2. **Create a New Script**  
   Open the TamperMonkey dashboard → Click **“Create a new script”**.

3. **Paste the Script**  
   Replace the default code with this script (available in this repository).

4. **Save the Script**  
   Click **File → Save**, or press `Ctrl + S`.

5. **Done!**  
   Open [Tokopedia](https://www.tokopedia.com/) and you’ll see a new **input field** appear in the **filter section** on the left of your screen.
   
   > ✏️ **Tip:** You can enter multiple keywords or seller names, separated by commas.  
   > Example: `sepatu, kaos kaki, jaket`

---

## 💡 Notes

This is a basic and client-side-only solution—not perfect, but effective enough to **avoid wasting time** on products you already know you don't want to see. It simply helps surface more relevant listings in Tokopedia’s cluttered environment.

---

## 🛠️ Planned Future Improvements

- Regular expression matching
- Support for more pages other than search result

---

> 🧪 Built using JavaScript and [TamperMonkey](https://www.tampermonkey.net/)
