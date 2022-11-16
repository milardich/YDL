const btn = document.getElementById('clickBtn');
const currentLinkText = document.getElementById('currentLink');

btn.addEventListener('click', () => {
    let _videoUrl = "";
    let _request = "";

    let queryOptions = { active: true, currentWindow: true };
    // get url of active tab
    tabs = chrome.tabs.query(queryOptions, tabs => {
        //console.log(tabs[0].url);
        _videoUrl = tabs[0].url;
        currentLinkText.innerHTML = tabs[0].title;
        _request = "http://127.0.0.1:8000/?link=" + _videoUrl;
        console.log(_request);
        fetch(_request).then(r => r.text()).then(result => {
            currentLinkText.innerHTML = tabs[0].title + " <br>[downloaded]";
        });
    });
    
});

var settingsButton = document.getElementById("settingsButton");
var backButton = document.getElementById("backButton");
var settingsDiv = document.getElementById("settingsDiv");
var mainDiv = document.getElementById("mainDiv");

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