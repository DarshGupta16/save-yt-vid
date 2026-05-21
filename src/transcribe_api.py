from youtube_transcript_api import YouTubeTranscriptApi

transcript = YouTubeTranscriptApi().fetch("dW6pvUx4_jc")

full_transcript = ""

for snippet in transcript:
    full_transcript += " " + snippet.text
    print(snippet.text)

with open('transcript.txt', 'w') as transcript_file:
    transcript_file.write(full_transcript)