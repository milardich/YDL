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
        _request = "http://127.0.0.1:8000/?link=" + _videoUrl;
        console.log(_request);
        fetch(_request).then(r => r.text()).then(result => {
            // Result now contains the response text, do what you want...
            currentLinkText.innerHTML = tabs[0].title + " <br><br> should be downloaded idk, check Downloads folder on ur pc";
        });
    });
    
});
















document.addEventListener('DOMContentLoaded', function() {
    var checkButton = document.getElementById('check');
    var linkText = document.getElementById('linkText');
    


    /*
    checkButton.addEventListener('click', function() {
        var currentTabUrl = "https://www.youtube.com/watch?v=4D7u5KF7SP8";
        currentTabUrl = getCurrentTab();
        alert(currentTabUrl);
        var request = "http://127.0.0.1:8000/?link=" + currentTabUrl;
        linkText.innerHTML = currentTabUrl;
        fetch(request).then(r => r.text()).then(result => {
            // Result now contains the response text, do what you want...
        });
    }, false);
     */
}, false);

