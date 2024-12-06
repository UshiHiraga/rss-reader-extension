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