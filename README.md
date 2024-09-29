# UpLearn Video Skipper



https://github.com/user-attachments/assets/45a0aea5-f788-4886-8289-d4a6c9291605



**UpLearn Video Skipper** is some JavaScript code designed to help users skip through video lessons on UpLearn and go straight to the questions, saving time by avoiding the need to watch the entire video if they already know everything about that specific topic/video. The script locates the question times in a video and automatically skips to them.

## How It Works

In UpLearn video lessons, there are periodic in-video questions. This script uses the UpLearn API to fetch those questions and automatically skips to each question's corresponding timestamp in the video. When there are no more questions, the video will skip to the end.

## Features
- Skips directly to the in-video questions.
- Reduces time spent on watching unnecessary portions of the video.
- Easy to use (pasting the script into the browser's console)

## Instructions

1. **Open the Developer Console**:
    - In Chrome, press `Ctrl + Shift + J` (Windows) or `Cmd + Option + J` (Mac).
    - In Firefox, press `Ctrl + Shift + K` (Windows) or `Cmd + Option + K` (Mac).
  
    - If none of them work, try `F12`, `Ctrl + Shift + I` or right click on the page and click `Inspect`/`Inspect Element`.

2. **Allow Pasting (if necessary)**:
    - If the browser doesn't allow you to paste the code into the console, simply type `allow pasting` in the console to enable it.

3. **Copy and Paste the Script**:
    - Copy the entire script ([from this GitHub page `index.js`](https://github.com/itsme12453/UpLearn-Video-Skipper/blob/main/index.js)) and paste it into the console.

4. **Run the Script**:
    - After pasting, press `Enter` to run the script.
    - A "Skip Video" button will appear on the page.

5. **Click "Skip Video"**:
    - Click the "Skip Video" button to start skipping through the video. The script will automatically navigate to each question's position in the video.

## Code

### DO NOT USE CODE FROM ANY OTHER SOURCE. THEY MAY BE MALICIOUS. ONLY USE THE CODE FOUND DIRECTLY ON THIS GITHUB

## Troubleshooting

- **Video doesn’t skip?** Ensure you're running the script on an UpLearn video page and that you've clicked the "Skip Video" button after the script has been pasted into the console.
- **Pasting doesn’t work?** Make sure you've typed `allow pasting` in the developer console to permit code pasting.

- **Still not working?** Refresh the page and paste the code again.

## Disclaimer

This script is intended for personal use to enhance learning efficiency on UpLearn by skipping through parts **you already know**, not to skip homework!

---

### License

This project is open source and available under the [MIT License](LICENSE).
