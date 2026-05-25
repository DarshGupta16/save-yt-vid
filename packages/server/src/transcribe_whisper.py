import os
from yt_dlp import YoutubeDL
from faster_whisper import WhisperModel
import json
import datetime
import traceback

def log_error(error_msg):
    with open('error.log', 'a') as f:
        f.write(f"{datetime.datetime.now().isoformat()}: [Python Whisper Error] {error_msg}\n")

def download_audio_for_transcription(url):
    """
    Downloads a lightweight audio file into the current working directory
    with a fixed base name 'temp_audio'.
    """
    ydl_opts = {
        'format': 'worstaudio[ext=m4a]/worstaudio[ext=webm]/worst',
        'outtmpl': 'temp_audio.%(ext)s', 
        'postprocessors': [],
        'quiet': False,
        'overwrites': True, 
        'extractor_args': {
            'youtube': {
                'clients': ['ios', 'android', 'web']
            }
        }
    }

    print(f"Downloading audio from: {url}")
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = os.path.abspath(ydl.prepare_filename(info))
        return filename

def transcribe_audio(audio_path, model_size="base"):
    """
    Transcribes the downloaded audio using faster-whisper.
    """
    print(f"\nInitializing Whisper model ({model_size})...")
    
    import torch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    compute_type = "float16" if device == "cuda" else "int8"
    
    model = WhisperModel(model_size, device=device, compute_type=compute_type)

    print("Transcribing... (this may take a moment)")
    segments, info = model.transcribe(audio_path, beam_size=5)

    print(f"Detected language: '{info.language}' with probability {info.language_probability:.2f}")

    full_transcript = []
    for segment in segments:
        timestamp = f"[{segment.start:05.2f}s -> {segment.end:05.2f}s]"
        print(f"{timestamp} {segment.text}")
        full_transcript.append(segment.text)
    
    with open('transcript.txt', 'w') as transcript_file:
        transcript_file.write(" ".join(full_transcript))
        
    return " ".join(full_transcript)

if __name__ == "__main__":
    try:
        video_url = ""
        with open('src/queue.json', 'r') as queueFile:
            video_url = json.loads(queueFile.read())["queue"][0]["url"]
        
        # Step 1: Download the lightweight audio file
        audio_file = download_audio_for_transcription(video_url)
        
        # Step 2: Run faster-whisper transcription
        transcript = transcribe_audio(audio_file, model_size="small")
        
        print(f"\n--- Transcription Finished ---")

        if os.path.exists("temp_audio.m4a"):
            os.remove("temp_audio.m4a")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        log_error(traceback.format_exc())
        raise e
