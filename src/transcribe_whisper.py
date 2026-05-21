import os
from yt_dlp import YoutubeDL
from faster_whisper import WhisperModel
import json
import os

def download_audio_for_transcription(url):
    """
    Downloads a lightweight audio file into the current working directory
    with a fixed base name 'temp_audio'.
    """
    # Fixes the name to 'temp_audio', but keeps the extension flexible 
    # based on whatever low-bitrate format yt-dlp grabs (.m4a or .webm)
    ydl_opts = {
        'format': 'worstaudio[ext=m4a]/worstaudio[ext=webm]/worst',
        'outtmpl': 'temp_audio.%(ext)s', 
        'postprocessors': [],
        'quiet': False,
        'overwrites': True, # Overwrites old temp_audio files from previous runs
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
    
    # Automatically switch to GPU (cuda) if available, otherwise use CPU.
    # float16 is faster on GPU, int8 is highly optimized for CPU.
    import torch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    compute_type = "float16" if device == "cuda" else "int8"
    
    model = WhisperModel(model_size, device=device, compute_type=compute_type)

    print("Transcribing... (this may take a moment)")
    # beam_size=5 is a good balance of accuracy and speed
    segments, info = model.transcribe(audio_path, beam_size=5)

    print(f"Detected language: '{info.language}' with probability {info.language_probability:.2f}")

    # Process and print the text chunks with timestamps
    full_transcript = []
    for segment in segments:
        timestamp = f"[{segment.start:05.2f}s -> {segment.end:05.2f}s]"
        print(f"{timestamp} {segment.text}")
        full_transcript.append(segment.text)
    
    with open('transcript.txt', 'w') as transcript_file:
        transcript_file.write(" ".join(full_transcript))
        
    return " ".join(full_transcript)

if __name__ == "__main__":
    # Replace with any YouTube URL or supported video platform link
    video_url = "https://www.youtube.com/watch?v=dW6pvUx4_jc"
    # with open('queue.json', 'r') as queueFile:
    #     video_url = json.loads(queueFile.read()).queue[0]
    
    try:
        # Step 1: Download the lightweight audio file
        audio_file = download_audio_for_transcription(video_url)
        
        # Step 2: Run faster-whisper transcription
        # Model choices: 'tiny', 'base', 'small', 'medium', 'large-v3'
        transcript = transcribe_audio(audio_file, model_size="small")
        
        print(f"\n--- Transcription Finished ---")

        os.remove("temp_audio.m4a")
        
    except Exception as e:
        print(f"An error occurred: {e}")