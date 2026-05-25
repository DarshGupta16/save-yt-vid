from youtube_transcript_api import YouTubeTranscriptApi
import json
import datetime
import traceback

def log_error(error_msg):
    with open('error.log', 'a') as f:
        f.write(f"{datetime.datetime.now().isoformat()}: [Python API Error] {error_msg}\n")

try:
    video_id = ""
    with open('src/queue.json', 'r') as queueFile:
        video_id = json.loads(queueFile.read())["queue"][0]["url"].split("=")[1]

    transcript = YouTubeTranscriptApi().fetch(video_id)

    full_transcript = ""

    for snippet in transcript:
        full_transcript += " " + snippet.text
        print(snippet.text)

    with open('transcript.txt', 'w') as transcript_file:
        transcript_file.write(full_transcript)
except Exception as e:
    log_error(traceback.format_exc())
    raise e
