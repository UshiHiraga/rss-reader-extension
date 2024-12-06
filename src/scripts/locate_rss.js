const knownServices = {
    Youtube(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/(channel|user|c).+/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;
            let query = '';
            let title = '';

            let path = new URL(url).pathname;

            if (path.startsWith('/channel/')) {
                let channel_id = path.substr('/channel/'.length).split('/')[0];
                query = 'channel_id=' + channel_id;
                title = channel_id;
            } else if (path.startsWith('/c/')) {
                let channel_id = path.substr('/c/'.length).split('/')[0];
                query = 'user=' + channel_id;
                title = channel_id;
            } else if (path.startsWith('/user/')) {
                let user_id = path.substr('/user/'.length).split('/')[0];
                query = 'user=' + user_id;
                title = user_id;
            }

            if (query != '') {
                datas.feeds.push({
                    url: 'https://www.youtube.com/feeds/videos.xml?' + query,
                    title: title
                });
            }
        }

        return datas;
    },
    RedditRoot(url) {
        let datas = { match: false, feeds: [] };


        let regex = /^(http(s)?:\/\/)?((w){3}.)?reddit\.com(\/)?$/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let feed_url = !url.endsWith('/') ? url + '/' : url;
            feed_url += '.rss';

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: feed_url
                });
            }
        }

        return datas;
    },
    RedditSub(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?reddit\.com\/r\/(.+)/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let feed_url = url.endsWith('/') ? url.slice(0, -1) : url;
            feed_url += '.rss';

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: feed_url
                });
            }
        }

        return datas;
    },
    RedditUser(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?reddit\.com\/user\/(.+)/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let feed_url = url.endsWith('/') ? url.slice(0, -1) : url;
            feed_url += '.rss';

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: feed_url
                });
            }
        }

        return datas;
    },
    RedditPostComments(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?reddit\.com\/r\/(.+)\/comments\/(.+)\/(.+)/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let feed_url = url.endsWith('/') ? url.slice(0, -1) : url;
            feed_url += '.rss';

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: feed_url
                });
            }
        }

        return datas;
    },
    Kickstarter(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?kickstarter\.com/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let feed_url = url.endsWith('/') ? url.slice(0, -1) : url;
            feed_url = feed_url.split('?')[0] + '/posts.atom';

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: feed_url
                });
            }
        }

        return datas;
    },
    Vimeo(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?vimeo\.com\/([a-zA-Z](.+))(\/videos)?/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let feed_url = url.endsWith('/videos') ? url.replace(/\/videos$/, '') + '/rss' : url + '/videos/rss';

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: feed_url
                });
            }
        }

        return datas;
    },
    GithubRepo(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?github\.com\/([a-zA-Z0-9](.+))\/([a-zA-Z0-9](.+))$/i;
        let matches = url.match(regex);

        if (matches) {
            datas.match = true;
            let repoUrl = matches[0].replace(/\/$/, ''); // Remove trailing slash
            repoUrl = repoUrl.replace(/\/(releases|commits|tags)$/, '');

            datas.feeds.push({ url: repoUrl + '/releases.atom', title: 'Repo releases' });
            datas.feeds.push({ url: repoUrl + '/commits.atom', title: 'Repo commits' });
            datas.feeds.push({ url: repoUrl + '/tags.atom', title: 'Repo tags' });
        }

        return datas;
    },
    GithubUser(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?github\.com\/([a-zA-Z0-9](.+))$/i;
        let matches = url.match(regex);

        if (matches) {
            datas.match = true;
            let userUrl = matches[0].replace(/\/$/, ''); // Remove trailing slash
            datas.feeds.push({ url: userUrl + '.atom', title: 'User activity' });
        }

        return datas;
    },
    GitlabRepo(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?gitlab\.com\/([a-zA-Z0-9](.+))\/([a-zA-Z0-9](.+))$/i;
        let matches = url.match(regex);

        if (matches) {
            datas.match = true;
            let repoUrl = matches[0].replace(/\/$/, ''); // Remove trailing slash

            datas.feeds.push({ url: repoUrl + '.atom', title: 'Repo commits' });
        }

        return datas;
    },
    GitlabUser(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?gitlab\.com\/([a-zA-Z0-9](.+))$/i;
        let matches = url.match(regex);

        if (matches) {
            datas.match = true;
            let userUrl = matches[0].replace(/\/$/, ''); // Remove trailing slash
            datas.feeds.push({ url: userUrl + '.atom', title: 'User activity' });
        }

        return datas;
    },
    MediumTag(url) {
        let datas = { match: false, feeds: [] };

        let regex = /^(http(s)?:\/\/)?((w){3}.)?medium\.com\/tag\/(.+)/i;
        let has_match = regex.test(url);

        if (has_match) {
            datas.match = true;

            let tag = url.match(regex)[5];

            let feed_url = url.replace(/(\/tag)/, '/feed$1');

            if (feed_url) {
                datas.feeds.push({
                    url: feed_url,
                    title: tag ?? feed_url
                });
            }
        }

        return datas;
    }
};

async function requestOpenPopup(data) {
    await chrome.runtime.sendMessage({ code: "request-open-popup", data });
    return true;
};

async function tryToGetFeedURL(tabUrl) {
    var url_datas = parseUrl(tabUrl);
    var feed = null;
    var isFound = false;

    var tests = ['/feed', '/rss', '/rss.xml', '/feed.xml', '/rss/news.xml', '/articles/feed', '/rss/index.html'];

    for (var t = 0; t < tests.length; t++) {
        if (isFound === false) {
            var feed_url = url_datas.origin + tests[t];

            let response = await fetch(feed_url, { method: 'get' });

            if (!response.ok || (response.status >= 200 && response.status < 400)) {
                let urlContent = await response.text();

                var oParser = new DOMParser();
                var oDOM = oParser.parseFromString(urlContent, "application/xml");

                var getRssTag = oDOM.getElementsByTagName('rss');
                var getFeedTag = oDOM.getElementsByTagName('feed');

                if (getRssTag.length > 0 || getFeedTag.length > 0) {

                    if (getRssTag.length > 0) {
                        var getChannelTag = getRssTag['0'].getElementsByTagName('channel');
                    } else if (getFeedTag.length > 0) {
                        var getChannelTag = getFeedTag['0'];
                    }

                    if (getChannelTag !== false) {
                        isFound = true;

                        feed = {
                            url: feed_url,
                            title: new URL(feed_url).hostname
                        };

                        return feed;
                    }
                }
            }
        }
    }

    return feed;
};

async function searchRSSfromLinkTags(links) {
    const types = [
        'application/rss+xml',
        'application/atom+xml',
        'application/rdf+xml',
        'application/rss',
        'application/atom',
        'application/rdf',
        'text/rss+xml',
        'text/atom+xml',
        'text/rdf+xml',
        'text/rss',
        'text/atom',
        'text/rdf'
    ];

    var feeds_urls = [];
    for (var i = 0; i < links.length; i++) {

        if (links[i].hasAttribute('type') && types.indexOf(links[i].getAttribute('type')) !== -1) {

            var feed_url = links[i].getAttribute('href');

            // If feed's url starts with "//"
            if (feed_url.startsWith('//')) {
                feed_url = "http:" + feed_url;
            }
            // If feed's url starts with "/"
            else if (feed_url.startsWith('/')) {
                feed_url = url.split('/')[0] + '//' + url.split('/')[2] + feed_url;
            }
            // If feed's url starts with http or https
            else if (/^(http|https):\/\//i.test(feed_url)) {
                feed_url = feed_url;
            }
            // If feed's has no slash
            else if (!feed_url.match(/\//)) {
                feed_url = url.substr(0, url.lastIndexOf("/")) + '/' + feed_url;
            }
            else {
                feed_url = url + "/" + feed_url.replace(/^\//g, '');
            }

            var feed = {
                url: feed_url,
                title: links[i].getAttribute('title') || feed_url
            };

            feeds_urls.push(feed);
        }
    }

    return feeds_urls;
}

function extractLinkTags(html) {
    // let regex = /<link\s+[^>]*\btype=['"][^'"]+['"][^>]*>/gi;

    // Excludes link tags with:
    //   rel="stylesheet"
    //   rel="icon"
    //   rel="search"
    //   type="text/javascript"
    //   type="image/"
    //   type="font/"
    let regex = /<link\s+(?![^>]*\b(?:rel=['"](stylesheet|icon|search)['"]|type=['"](text\/javascript|image\/(.*)|font\/(.*))['"]))[^>]*\btype=['"][^'"]+['"][^>]*>/gi;
    let match = html.match(regex);
    return match || [];
};

async function main() {
    let url = location.href;
    let feedaa = [];

    // Looking in known services
    for (const service of Object.keys(knownServices)) {
        check = knownServices[service](url);
        match = check.match;
        console.log(match);

        if (match === true) {
            feedaa.push(...check.feeds);

        }
    }

    // Looking in tags
    let a = document.querySelector("html").innerHTML;
    let d = extractLinkTags(a).map(createNodeFromText);
    let e = await searchRSSfromLinkTags(d);
    feedaa.push(...e);


    // Looking by fecthing to sample urls
    let test_feed = await tryToGetFeedURL(url);
    (test_feed !== null) ? feedaa.push(test_feed) : null;

    // Send requestion
    requestOpenPopup(feedaa);
    
}

main();