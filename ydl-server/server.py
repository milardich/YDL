from flask import Flask, jsonify, request, send_file
import subprocess
import os

app = Flask("test")
link = ""

@app.route('/')
def processLink():
    # TODO: if youtube-dlp, ffprobe and ffmpeg is not in directory: download all three
    # update yt-dlp
    # add ability to change download directory
    # add ability to change download format (mp3, mp4, etc)

    link = request.args.get('link')
    
    if link == "" or not link.__contains__("youtube.com"):
        return "You must enter a youtube link!"

    if link.__contains__('list'):
        downloadPlaylist(link)
    else:
        downloadSong(link)

    return jsonify({
        "link:": link
    })

def downloadSong(song):
    print("Downloading: " + song)
    subprocess.run(["yt-dlp", "-f", "ba", "-x", "--audio-format", "mp3", song, "-o", getDownloadsDirectory() + "%(title)s.%(ext)s"])

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
        
if __name__ == '__main__':
    print(getDownloadsDirectory())

    app.run(debug = True, port = 8000)