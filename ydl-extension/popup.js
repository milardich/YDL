const btn = document.getElementById('clickBtn');
const currentVideoTitle = document.getElementById('currentLink');
const settingsButton = document.getElementById("settingsButton");
const backButton = document.getElementById("backButton");
const settingsDiv = document.getElementById("settingsDiv");
const mainDiv = document.getElementById("mainDiv");
const videoImg = document.getElementById("videoImg");

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
        currentVideoTitle.innerHTML = tabs[0].title;
        _request = "http://127.0.0.1:8000/?link=" + _videoUrl;
        console.log(_request);
        fetch(_request).then(r => r.text()).then(result => {
            //currentVideoTitle.innerHTML = tabs[0].title + " <br>[downloaded]";
            //currentVideoTitle.style.color = "green";
            //currentVideoTitle.style.fontWeight = "bold";
            btn.style.backgroundColor = "green";
            btn.innerHTML = "✓";
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
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, tabs => {
        tabUrl = tabs[0].url;
        videoId = getYoutubeVideoId(tabUrl);
        videoTitle = tabs[0].title;

        if (tabUrl.includes("youtube") && tabUrl.includes("watch")) {
            //alert("this is a youtube video");
            videoImg.src = getVideoThumbnail(videoId);
            currentVideoTitle.innerHTML = videoTitle;
        }
    });
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