function createNodeFromText(text) {
    const parent = document.createElement("section");
    parent.innerHTML = text;
    return parent.children[0];
};

async function requestRSSLinks() {
    let rssFolderNode = await chrome.bookmarks.search(chrome.i18n.getMessage("rss_folder"));
    if (rssFolderNode.length === 0) { return { "error": "no-valid-rss-bookmark-folder" } };

    let feedsLinksNodes = await chrome.bookmarks.getChildren(rssFolderNode[0].id);
    return feedsLinksNodes.map(e => e.url);
};

function fromItemRSStoNode(item) {
    const DAY_IN_MS = 60 * 60 * 24 * 1000;
    const $$ = item.querySelector.bind(item);
    const date = new Date($$("updated, pubDate")?.textContent || 0);
    const href = $$("link")?.attributes?.href?.value || $$("link")?.textContent || $$("guid")?.textContent;
    const title = $$("title")?.textContent || "";
    const content = $$("content")?.textContent || "";
    const summary = $$("summary")?.textContent || "";
    const description = $$("description")?.textContent || "";

    return createNodeFromText(/*html*/`
    <article
        ${(Date.now() - date) > DAY_IN_MS ? "hidden" : ''} 
    >
        <details class="feed-article" name="feed-article">
            <summary>    
                <a target="_blank" href="${href}">${title}</a>
            </summary>
            <section>
                <time datetime="${date.getTime()}">${date.toLocaleString()}</time>
                <p>${description}</p>
                <p>${content} </p>
                <p>${summary}</p>
            </section>
        </details>
    </article>`);
};

async function cacheFetch(url) {
    let res = await fetch(url);
    let text = await res.text();
    return text;
};

async function main() {
    let feedLinks = await requestRSSLinks();

    if (feedLinks?.error || feedLinks.length === 0) {
        document.body.appendChild(createNodeFromText(/*html*/`<h1>${chrome.i18n.getMessage("error_rss_folder")}</h1>`));
        return true;
    };

    feedLinks.forEach((url) => {
        const domain = new URL(url).hostname;

        document.body.appendChild(createNodeFromText(/*html*/`
        <details name="rss-feed">
            <summary>${domain}</summary>
            <section id="${domain}"><p>${chrome.i18n.getMessage("loading_badge")}</p></section>
        </details>`));

        cacheFetch(url).then((feedText) => {
            const rss = (new DOMParser()).parseFromString(feedText, "text/xml");
            const items = Array.from(rss.querySelectorAll("item, entry")).map(fromItemRSStoNode);
            document.getElementById(domain).replaceChildren(...items);
        });
    });
};

main();