const btn = document.getElementById('clickBtn');
const currentVideoTitle = document.getElementById('currentLink');
const settingsButton = document.getElementById("settingsButton");
const backButton = document.getElementById("backButton");
const settingsDiv = document.getElementById("settingsDiv");
const mainDiv = document.getElementById("mainDiv");
const videoImg = document.getElementById("videoImg");
const numberOfDownloadsDiv = document.getElementById("numberOfDownloads");
const currentVideoDiv = document.getElementById("currentVideoContainer");
const noYoutubeVideoActiveDiv = document.getElementById("noYoutubeVideoActiveContainer");
const downloadPlaylistDiv = document.getElementById("downloadPlaylistDiv");

// get this list from remote server
let youtubeApiKeys = [
    "AIzaSyDIFQtOIEXPWGG0sVpHxg20kupPKl41oKg"
]

setDataFromCurrentTab();

/*
    TODO: 
    [ ] Hide download button if not on youtube
    [ ] If playlist: show download playlist button
    [ ] Settings
    [ ] If song from current tab downloaded: show checkmark
    [ ] in setDataFromCurrentTab() check if current song already downloaded (isDownloaded() -> sends request to server and returns value)
    [ ] request contains: link, isPlaylist
    [ ] inject download button on youtube video
 */

btn.addEventListener('click', () => {
    let _videoUrl = "";
    let _request = "";

    let queryOptions = { active: true, currentWindow: true };
    // get url of active tab
    tabs = chrome.tabs.query(queryOptions, tabs => {
        //console.log(tabs[0].url);
        _videoUrl = tabs[0].url;
        _videoTitle = tabs[0].title.slice(0, -10);
        currentVideoTitle.innerHTML = _videoTitle;
        _request = "http://127.0.0.1:8000/?link=" + _videoUrl + "&videoTitle=" + _videoTitle + "&videoId=" + getYoutubeVideoId(_videoUrl);
        console.log(_request);
        btn.innerHTML = "↓";
        btn.style.backgroundColor = "gray";
        btn.disabled = true;
        fetch(_request).then(r => r.text()).then(result => {
            btn.style.backgroundColor = "green";
            btn.innerHTML = "✓";
            setNumberOfDownloads();
        });
    });
});

settingsButton.addEventListener('click', () => {
    settingsDiv.style.display = "block";
    mainDiv.style.display = "none";
    settingsButton.style.display = "none";
    backButton.style.display = "block";
});

backButton.addEventListener('click', () => {
    settingsDiv.style.display = "none";
    mainDiv.style.display = "block";
    settingsButton.style.display = "block";
    backButton.style.display = "none";
});

function setDataFromCurrentTab() {
    youtubeVideoActiveCheck();
    playlistActiveCheck();
    setPlaylistVideoCount();
    currentVideoDownloadedCheck();
    setNumberOfDownloads();
}

function setPlaylistVideoCount() {
    // [ ] TODO: make multiple google developer accounts and enable youtube v3 apis
    // [ ] TODO: log youtube api calls (send every call to github page or some free hosting)
    // [ ] TODO: keep track of calls in current app
    // [ ] TODO: if it exceeds 500 calls (max free tier limit) -> switch to another api key (from another google account)
    // [ ] TODO: store list of API keys on some free hosting

    // test api call
    // my api key: AIzaSyDIFQtOIEXPWGG0sVpHxg20kupPKl41oKg
    // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10000&playlistId=PLfeaIWXJgPROrv6fkEoh5GO6_pAXLAfkJ&key=AIzaSyDIFQtOIEXPWGG0sVpHxg20kupPKl41oKg
    //const response = await fetch('http://127.0.0.1:8000/downloaded');
    //const videoUrls = await response.json();

}

function playlistActiveCheck() {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, tabs => {
        tabUrl = tabs[0].url;
        if (tabUrl.includes("youtube") && tabUrl.includes("list")) {
            downloadPlaylistDiv.style.display = "block";
        }
        else {
            downloadPlaylistDiv.style.display = "none";
        }
    });
}

function youtubeVideoActiveCheck() {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, tabs => {
        tabUrl = tabs[0].url;
        videoId = getYoutubeVideoId(tabUrl);
        videoTitle = tabs[0].title.slice(0, -10);
        if (tabUrl.includes("youtube") && tabUrl.includes("watch")) {
            //alert("this is a youtube video");
            videoImg.src = getVideoThumbnail(videoId);
            currentVideoTitle.innerHTML = videoTitle;
        }
        else {
            currentVideoDiv.style.display = "none";
            noYoutubeVideoActiveDiv.style.display = "block";
        }
    });
}

async function currentVideoDownloadedCheck() {
    var currentTabUrl;
    var currentTabTitle;
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, tabs => {
        currentTabUrl = tabs[0].url;
        currentTabTitle = tabs[0].title.slice(0, -10);
    });
    const response = await fetch('http://127.0.0.1:8000/downloaded');
    const videoUrls = await response.json();

    for (i = 0; i < videoUrls["downloadedVideos"].length; i++) {
        if (videoUrls["downloadedVideos"][i].videoUrl == currentTabUrl ||
            videoUrls["downloadedVideos"][i].videoTitle == currentTabTitle ||
            videoUrls["downloadedVideos"][i].videoId == getYoutubeVideoId(currentTabUrl)) {
            btn.style.backgroundColor = "green";
            btn.innerHTML = "✓";
        }
    }
    //numberOfDownloadsDiv.innerHTML = videoUrls["downloadedVideos"].length;
    console.log(currentTabUrl);
    console.log(videoUrls);
}

async function setNumberOfDownloads() {
    var currentTabUrl;
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, tabs => {
        currentTabUrl = tabs[0].url;
    });
    const response = await fetch('http://127.0.0.1:8000/downloaded');
    const videoUrls = await response.json();

    numberOfDownloadsDiv.innerHTML = videoUrls["downloadedVideos"].length;
    //console.log(currentTabUrl);
    //console.log(videoUrls);
}

function getVideoThumbnail(videoId) {
    //http://img.youtube.com/vi/[video-id]/[thumbnail-number].jpg
    return "http://img.youtube.com/vi/" + videoId + "/0.jpg";
}

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function getYoutubeVideoId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}