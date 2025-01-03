const DAY_IN_MS = 60 * 60 * 24 * 1000;

function handleForm(e) {
    let formData = new FormData(e.target);
    console.log(formData.get("rss-sources"));


    function hidee({date, title, href, domain}){
        console.log("hola");
        return domain === formData.get("rss-sources");
    };

 
    let d = formData.get("rss-sources") === "all" ? hideMoreThanDay : hidee;
    redrawBody(d);
}

function hideMoreThanDay({date, title, href, domain}){
    let dateObject = new Date(date);
    return (dateObject.getTime() >= (Date.now() - DAY_IN_MS))
};

function redrawBody(filterBy = hideMoreThanDay) {
    function rssJsonToNode({ date, title, href, domain }) {
        let dateObject = new Date(date);
        return Object.assign(createNodeFromText(/*html*/`
        <article class="timeline">
            <time datetime="${dateObject.getTime()}">${dateObject.toLocaleString()}</time>
            <h3><a target="_blank" href="${href}">${title}</a></h3>
            <p>${domain}</p>
        </article>`), { date, title, href, domain });
    };

    let parentRssArticles = document.querySelector("main");
    parentRssArticles.replaceChildren();

    let rssLinksMetadata = localStorage.read("rss-links-metadata") ?? {};
    let rssStoredArticles = Object.keys(rssLinksMetadata).map((k) => localStorage.read(k)).flat();
    let validArticles = rssStoredArticles.filter(filterBy).sort(differenceBetween);
    document.querySelector("main").append(...validArticles.map(rssJsonToNode));


    function aa(text){
        return createNodeFromText(`<option>${text}</option>`);
    }

    document.getElementById("rss-sources").replaceChildren();
    document.getElementById("rss-sources").append(...[aa("all"), ...Object.keys(rssLinksMetadata).map(aa)]);
    return;
};

function localize() {
    let textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (textNodes.nextNode()) {
        const message_regex = /__MSG_(\w+)__/gm;
        let nodeText = textNodes.currentNode;
        let msgCode = message_regex.exec(nodeText.nodeValue);
        if (!msgCode) continue;
        nodeText.nodeValue = chrome.i18n.getMessage(msgCode.at(1));
    };
};

function fromRssRawTextToRSSItemJson(rssRawText) {
    function fromItemRSStoJSON(item) {
        const $$ = item.querySelector.bind(item);
        const date = new Date($$("updated, pubDate")?.textContent || 0).getTime();
        const href = $$("link")?.attributes?.href?.value || $$("link")?.textContent || $$("guid")?.textContent;
        const title = $$("title")?.textContent || "";
        return { date, title, href, domain: getHostname(href) };
    };

    const rss = (new DOMParser()).parseFromString(rssRawText, "text/xml");
    return Array.from(rss.querySelectorAll("item, entry")).map(fromItemRSStoJSON);
};

async function updateSources(rssLinks) {
    let rssLinksMetadata = localStorage.read("rss-links-metadata") ?? {};
    for (let rssLink of rssLinks) {
        let rssLinkLastRetrieve = rssLinksMetadata[getHostname(rssLink)] ?? 0;

        if (rssLinkLastRetrieve >= (Date.now() - DAY_IN_MS)) {
            console.info(`${rssLink} was retrieved at ${new Date(rssLinkLastRetrieve).toLocaleString()}. Skipping.`);
            continue;
        };

        textFetch(rssLink)
        .then(fromRssRawTextToRSSItemJson)
        .then((rssItems) => localStorage.write(getHostname(rssLink), rssItems))
        .then(() => localStorage.write("rss-links-metadata", { ...localStorage.read("rss-links-metadata"), [getHostname(rssLink)]: Date.now() }))
        .then(() => window.callEvent("redraw"))
        .catch((e) => { console.error(e) })
    };
};

function ss(e) {
    let a = document.createElement("option");
    a.setAttribute("value", getHostname(e));
    a.innerText = getHostname(e);
    return a;
}

window.addEventListener("redraw", function (e) {

    redrawBody();
});


async function main() {
    async function getFeedLinksFromBookmarks() {
        let rssFolderNode = await chrome.bookmarks.search(chrome.i18n.getMessage("rss_folder"));
        if (rssFolderNode.length === 0) { return { "error": "no-valid-rss-bookmark-folder" } };
        let feedsLinksNodes = await chrome.bookmarks.getChildren(rssFolderNode[0].id);
        return feedsLinksNodes.map(e => e.url);
    };

    let feedLinks = await getFeedLinksFromBookmarks();
    if (feedLinks?.error || feedLinks.length === 0) { return true };

    updateSources(feedLinks);
    window.callEvent("redraw");
};

document.getElementById("options-button").addEventListener("click", () => document.getElementById("options-dialog").showModal());
document.getElementById("option-form").addEventListener("submit", handleForm);
localize();
main();