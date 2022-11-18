from flask import Flask, jsonify, request
import subprocess
import os
import urllib.request
import json
#from mega import Mega


# TODO:
# [X] if youtube-dlp, ffprobe and ffmpeg is not in directory: download all three
# [X] update yt-dlp
# [X] add ability to change download directory
# [X] add ability to change download format (mp3, mp4, etc)
# [ ] add ability to detect and download whole yt playlists
# [ ] auto downloading
# [ ] read ffmpeg etc download links from a file
# [X] config - download location, download file format, port number and ip, etc


app = Flask("YDL")
link = ""
DownloadLocation = ""
DownloadFormat = ""
AutoDownload = "false"
HostAddress = "localhost"
PortNumber = "8000"
DownloadedFilesJsonData = ""
VideoTitle = ""


@app.route('/', methods=['POST', 'GET'])
def processLink():
    global VideoTitle
    link = request.args.get('link')
    VideoTitle = request.args.get('videoTitle')
    if link == "" or not link.__contains__("youtube.com"):
        return "You must enter a youtube link!"
    if link.__contains__('list'):
        downloadPlaylist(link)
    else:
        downloadSong(link)
    return jsonify({
        "videoUrl:": link,
        "title": VideoTitle
    })


@app.route('/settings', methods=['POST', 'GET'])
def getSettings():
    global DownloadLocation, DownloadFormat,  AutoDownload
    DownloadLocation = getDownloadLocation()
    DownloadFormat = getDownloadFormat()
    AutoDownload = getAutoDownload()
    return jsonify({
        "DownloadLocation": DownloadLocation,
        "DownloadFormat": DownloadFormat,
        "AutoDownload": AutoDownload
    })


@app.route('/settings/changeDownloadLocation')
def changeDownloadLocation():
    global DownloadLocation
    DownloadLocation = request.args.get('value')
    saveDownloadLocation()
    return jsonify({
        "DownloadLocation": DownloadLocation
    })


@app.route('/settings/changeDownloadFormat')
def changeDownloadFormat():
    global DownloadFormat
    DownloadFormat = request.args.get('value')
    if DownloadFormat != "mp3" and DownloadFormat != "mp4":
        DownloadFormat = "mp3"
    saveDownloadFormat()
    return jsonify({
        "DownloadFormat": DownloadFormat
    })


@app.route('/settings/changeAutoDownload')
def changeAutoDownload():
    global AutoDownload
    AutoDownload = request.args.get('value')
    if AutoDownload != "true" and AutoDownload != "false":
        AutoDownload = "false"
    saveAutoDownload()
    return jsonify({
        "AutoDownload": AutoDownload
    })


@app.route('/downloaded', methods=['GET', 'POST'])
def getDownloadedFiles():
    f = open("downloaded_files.json", "r")
    DownloadedFilesJsonData = json.load(f)
    f.close()
    return jsonify(DownloadedFilesJsonData)


def downloadSong(song):
    global VideoTitle
    print("Downloading: " + song)
    subprocess.run(["yt-dlp", "-f", "ba", "-x", "--audio-format", "mp3", song,
                   "-o", DownloadLocation + "%(title)s.%(ext)s", "--no-mtime"])
    songDict = {
        "videoUrl": song,
        "videoTitle": VideoTitle
    }
    saveToDownloadedJson(songDict)


def downloadPlaylist(playlist):
    print("Downloading playlist: " + playlist)


def getDownloadsDirectory():
    if os.name == 'nt':
        import winreg
        sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
        downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
            location = winreg.QueryValueEx(key, downloads_guid)[0]
        return str(location) + "\\"
    else:
        return os.path.join(os.path.expanduser('~'), 'downloads')


def getDownloadLocation():
    global DownloadLocation
    return DownloadLocation


def getDownloadFormat():
    global DownloadFormat
    return DownloadFormat


def getAutoDownload():
    global AutoDownload
    return AutoDownload


def loadSettings():
    global DownloadLocation, DownloadFormat, AutoDownload, HostAddress, PortNumber
    if not os.path.exists("DownloadLocation.txt"):
        open("DownloadLocation.txt", "w").write(getDownloadsDirectory())
    if not os.path.exists("DownloadFormat.txt"):
        open("DownloadFormat.txt", "w").write("mp3")
    if not os.path.exists("AutoDownload.txt"):
        open("AutoDownload.txt", "w").write("false")
    if not os.path.exists("HostAddress.txt"):
        open("HostAddress.txt", "w").write("localhost")
    if not os.path.exists("PortNumber.txt"):
        open("PortNumber.txt", "w").write("8000")
    if not os.path.exists("downloaded_files.json"):
        open("downloaded_files.json", "w").write("")

    DownloadLocation = open("DownloadLocation.txt", "r").read()
    DownloadFormat = open("DownloadFormat.txt", "r").read()
    AutoDownload = open("AutoDownload.txt", "r").read()
    HostAddress = open("HostAddress.txt", "r").read()
    PortNumber = open("PortNumber.txt", "r").read()


def saveDownloadLocation():
    global DownloadLocation
    settingFile = open("DownloadLocation.txt", "w")
    settingFile.write(DownloadLocation)


def saveDownloadFormat():
    global DownloadFormat
    settingFile = open("DownloadFormat.txt", "w")
    settingFile.write(DownloadFormat)


def saveAutoDownload():
    global AutoDownload
    settingFile = open("AutoDownload.txt", "w")
    settingFile.write(AutoDownload)


def saveToDownloadedJson(youtubeVideoDictionary):
    global DownloadedFilesJsonData
    f = open("downloaded_files.json", "r")
    DownloadedFilesJsonData = json.load(f)
    f.close()
    DownloadedFilesJsonData["downloadedVideos"].append(youtubeVideoDictionary)
    json_object = json.dumps(DownloadedFilesJsonData, indent=4)
    f = open("downloaded_files.json", "w")
    f.write(json_object)
    f.close()
    print(str(json_object))


def downloadYtdlp():
    print("Downloading yt-dlp...")
    urllib.request.urlretrieve(
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe", "yt-dlp.exe")


def downloadFfprobe():
    print("Downloading FFPROBE...")
    mega = Mega()
    m = mega.login()
    try:
        m.download_url(
            'https://mega.nz/file/HBYEjZjJ#2wn-LyNo-PEGjzFIxozudOKS7Azfcl7LyP5djCwsIvg')
    except:
        PermissionError


def downloadFfmpeg():
    print("Downloading FFMPEG...")
    mega = Mega()
    m = mega.login()
    try:
        m.download_url(
            'https://mega.nz/file/6ZpFGRCR#EsfBP2kEjjFYYcWUH8SGcV3itaKaTLz8Hmq5BRNZhvQ')
    except:
        PermissionError


def checkFiles():
    if not os.path.exists('./ffmpeg.exe'):
        downloadFfmpeg()
    if not os.path.exists('./yt-dlp.exe'):
        downloadYtdlp()
    if not os.path.exists('./ffprobe.exe'):
        downloadFfprobe()


if __name__ == '__main__':
    downloadLocation = getDownloadsDirectory()
    loadSettings()
    checkFiles()
    subprocess.run(["yt-dlp", "-U"])
    print(getDownloadsDirectory())
    app.run(host=HostAddress, port=PortNumber, debug=True)
