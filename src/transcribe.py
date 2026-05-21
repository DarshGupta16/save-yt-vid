import os
from yt_dlp import YoutubeDL
from faster_whisper import WhisperModel
import json

def download_audio_for_transcription(url, output_dir="temp_downloads"):
    """
    Downloads a lightweight audio file optimized for speech recognition.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # We target 'worstaudio' or standard low-bitrate m4a/webm because Whisper 
    # internally resamples everything to 16kHz mono anyway.
    ydl_opts = {
        'format': 'worstaudio[ext=m4a]/worstaudio[ext=webm]/worst',
        'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
        'postprocessors': [], # No heavy re-encoding needed
        'quiet': False,
    }

    print(f"Downloading audio from: {url}")
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        # Fetch the absolute path of the downloaded file
        filename = ydl.prepare_filename(info)
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
        
    except Exception as e:
        print(f"An error occurred: {e}")