let myElement;
var btn;

myElement = document.getElementById('center');
if (myElement) {
    processMyElement(myElement);
}

function processMyElement(element) {
    btn = document.createElement('button');
    btn.innerHTML = "Download";
    btn.style.padding = "5px";
    btn.style.backgroundColor = "red";
    element.appendChild(btn);

}

btn.addEventListener('click', () => {
    let videoUrl = location.href;
    let videoTitle = document.title.slice(0, -10);
    //alert(videoUrl + "    " + videoTitle);
    let request = "http://127.0.0.1:8000/?link=" + videoUrl + "&videoTitle=" + videoTitle + "&videoId=" + getYoutubeVideoId(videoUrl);
    //alert(request);
    fetch(request).then(r => r.text()).then(result => {
        btn.style.backgroundColor = "green";
        btn.innerHTML = "✓";
    });

});

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function getYoutubeVideoId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}




