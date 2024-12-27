/**
    * Creates a DOM node from a given text string.
    * @param {string} text - The text to create the node from.
    * @returns {HTMLElement} The created DOM node.  Returns null if the text is invalid or doesn't create a node.
    * @throws {Error} If the input is not a string.
*/
function createNodeFromText(text) {
    if (typeof text !== 'string') throw new Error("Invalid input: text must be a string");
    const parent = document.createElement("section");
    parent.innerHTML = text;
    return parent.children[0];
};

/**
 * Parses a URL string and returns a URL object.
 * @param {string} string - The URL string to parse.
 * @returns {URL} A URL object representing the parsed URL.
 */
function parseUrl(string) {
    return new URL(string);
};

function getHostname(string) {
    return parseUrl(string).hostname;
}

async function textFetch(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return await res.text();
    } catch (error) {
        throw error;
    }
};

/**
 * Compares two numbers and returns the difference between them.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @returns {number} The difference between the second and the first number.
 */
function differenceBetween(a, b) {
    return b - a;
};

/**
 * Saves a JSON object to localStorage.
 *
 * @param {string} key - The key under which the JSON will be stored.
 * @param {Object} value - The JSON object to be stored.
 */
Storage.prototype.write = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

/**
 * Reads a JSON object from localStorage.
 *
 * @param {string} key - The key under which the JSON was stored.
 * @returns {Object|null} The stored JSON object or null if not found.
 */
Storage.prototype.read = function (key) {
    return JSON.parse(this.getItem(key) ?? null);
};

/**
 * Dispatches a custom event on the window object.
 *
 * @param {string} name - The name of the event.
 * @param {Object} [detail={}] - An optional object containing additional event details.
 * @returns {boolean} - Returns true if the event is successfully dispatched, otherwise false.
 */
window.callEvent = function (name, detail = {}) {
    return window.dispatchEvent(new CustomEvent(name, { detail }));
};