import { magic } from '../Popup';

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildTypedUrlList(wallet_address) {
    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    var microsecondsPerHour = 1000 * 60;
    var oneHourAgo = (new Date).getTime() - microsecondsPerHour;

    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    var numRequestsOutstanding = 0;

    chrome.history.search({
        'text': '',              // Return every history item....
        'startTime': oneHourAgo  // that was accessed less than one week ago.
    },
        function (historyItems) {
            // For each history item, get details on all visits.
            for (var i = 0; i < historyItems.length; ++i) {
                var url = historyItems[i].url;
                var processVisitsWithUrl = function (url) {
                    // We need the url of the visited item to process the visit.
                    // Use a closure to bind the  url into the callback's args.
                    return function (visitItems) {
                        processVisits(url, visitItems);
                    };
                };
                chrome.history.getVisits({ url: url }, processVisitsWithUrl(url));
                numRequestsOutstanding++;
            }
            if (!numRequestsOutstanding) {
                onAllVisitsProcessed();
            }
        }
    );


    // Maps URLs to a count of the number of times the user typed that URL into
    // the omnibox.
    var urlToCount = {};

    // Callback for chrome.history.getVisits().  Counts the number of
    // times a user visited a URL by typing the address.
    var processVisits = function (url, visitItems) {
        for (var i = 0, ie = visitItems.length; i < ie; ++i) {
            // Ignore items unless the user typed the URL.
            // if (visitItems[i].transition != 'typed') {
            //     continue;
            // }

            if (!urlToCount[url]) {
                urlToCount[url] = 0;
            }

            urlToCount[url]++;
        }

        // If this is the final outstanding call to processVisits(),
        // then we have the final results.  Use them to build the list
        // of URLs to show in the popup.
        if (!--numRequestsOutstanding) {
            onAllVisitsProcessed();
        }
    };

    // This function is called when we have the final list of URls to display.
    var onAllVisitsProcessed = async function () {
        // Get the top scorring urls.
        let urlArray = [];
        for (var url in urlToCount) {
            urlArray.push(url);
        }

        // Sort the URLs by the number of times the user typed them.
        urlArray.sort(function (a, b) {
            return urlToCount[b] - urlToCount[a];
        });
        console.log(urlArray)
        if (urlArray.length > 0) {
            let data = await fetch("http://localhost:3001/api/user/data", { method: 'POST', body: JSON.stringify({ publicAddress: wallet_address, data: urlArray }), headers: { 'Content-Type': 'application/json' } })
            console.log(data)
        }

    };
}

chrome.alarms.create("alarm1", {
    "when": Date.now() + 3,
    "periodInMinutes": 60
})

chrome.alarms.onAlarm.addListener(() => {
    magic.user.isLoggedIn().then((magicIsLoggedIn) => {
        if (magicIsLoggedIn) {
            let metadata = magic.user.getMetadata();
            buildTypedUrlList(metadata.publicAddress)
        }
    });
})