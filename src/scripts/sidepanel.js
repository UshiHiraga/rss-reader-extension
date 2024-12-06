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

function fromItemRSStoJSON(item) {
    const DAY_IN_MS = 60 * 60 * 24 * 1000;
    const $$ = item.querySelector.bind(item);
    const date = new Date($$("updated, pubDate")?.textContent || 0);
    const href = $$("link")?.attributes?.href?.value || $$("link")?.textContent || $$("guid")?.textContent;
    const title = $$("title")?.textContent || "";
    const content = $$("content")?.textContent || "";
    const summary = $$("summary")?.textContent || "";
    const description = $$("description")?.textContent || "";
    
    return {
        date, 
        title,
        href
    }
};

function JSONtoNode({date, title, href, domain }) {

    let dateS = new Date(date)


    return createNodeFromText(/*html*/`
        <article class="timeline">
            <time datetime="${dateS.getTime()}">${dateS.toLocaleString()}</time>
            <h4><a target="_blank" href="${href}">${title}</a></h4>
            <p>${domain}</p>
        </article>`);
}

async function cacheFetch(url) {
    let res = await fetch(url);
    let text = await res.text();
    return text;
};

function compareNumbers(a, b) {
    return b - a;
}


function updateBody() {
    const DAY_IN_MS = 60 * 60 * 24 * 1000;
    let a = JSON.parse(sessionStorage.getItem("news"));
    let b = a.map((e) => (new Date(e.date)).getTime()).filter((e) => (Date.now() - e) < DAY_IN_MS);
    let c = b.sort(compareNumbers);



    let d = c.map((o) => a.find((e) => (new Date(e.date)).getTime() === o));
    document.body.replaceChildren();

    d.map((f) => document.body.appendChild(JSONtoNode(f)));
}


async function main() {
    let feedLinks = await requestRSSLinks();
    sessionStorage.setItem("news", JSON.stringify([]));

    if (feedLinks?.error || feedLinks.length === 0) {
        document.body.appendChild(createNodeFromText(/*html*/`<h1>${chrome.i18n.getMessage("error_rss_folder")}</h1>`));
        return true;
    };

    feedLinks.forEach((url) => {
        
        cacheFetch(url).then((feedText) => {
            const rss = (new DOMParser()).parseFromString(feedText, "text/xml");
            const items = Array.from(rss.querySelectorAll("item, entry")).map(fromItemRSStoJSON);
            const domain = new URL(url).hostname;
            let aa = items.map((e) => { return { domain, ...e } });

            let news = JSON.parse(sessionStorage.getItem("news"));
            news.push(...aa);
            sessionStorage.setItem("news", JSON.stringify(news));
            updateBody();
        });
    });


};

main();

