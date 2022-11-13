from flask import Flask, jsonify, request, send_file

app = Flask("test")
link = ""

@app.route('/')
def processLink():
    link = request.args.get('link')
    
    if link == "":
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

def downloadPlaylist(playlist):
    print("Downloading playlist: " + playlist)
        


if __name__ == '__main__':
    app.run(debug = True, port = 8000)