from flask import Flask, render_template, request, Response
from flask_cors import CORS, cross_origin
from fishystreaming_backend import app
from pytubefix import YouTube
from pytubefix.cli import on_progress
import os
import subprocess

DOWNLOAD_FOLDER = "audio"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@app.route('/')
@cross_origin() # allow all origins all methods.
def home():
    return render_template('index.html', title='Home Page')

@app.route('/api/download', methods=['GET'])
@cross_origin(supports_credentials=True)
def download_and_stream_audio():
    video_id = request.args.get('videoId')
    if not video_id:
        return {"error": "No videoId provided"}, 400
    try:
        url = f"https://www.youtube.com/watch?v={video_id}"
        yt = YouTube(url, on_progress_callback = on_progress)
        print(yt.title)
 
        audio_stream = yt.streams.filter(only_audio=True).order_by('abr').last()
        print(audio_stream)
        
        file_path = audio_stream.download(output_path=DOWNLOAD_FOLDER, filename=f"{video_id}.mp3")
       
        def generate():
            with open(file_path, "rb") as audio_file:
                while chunk := audio_file.read(2024):
                    yield chunk
            os.remove(file_path)
        
        return Response(generate(), mimetype="audio/mpeg")

    except Exception as e:
        print(f"Error downloading video: {e}")
        return {"error": "Failed to download audio"}, 500
   

def convert_audio(input_file, output_file):
    # Use ffmpeg to convert mp3 to higher quality wav or any other format
    subprocess.run(["ffmpeg", "-i", input_file, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "320k", output_file])
