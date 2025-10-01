# Sound Setup Guide for Random Student Picker

Your Random Student Picker is now configured to play celebratory sounds when a student is selected! Here's how to get the audio files:

## Required Sound Files

Place these 7 MP3 files in the `sounds/` directory:

### Celebratory Sounds (6 files)
- `cheer1.mp3`
- `cheer2.mp3`
- `applause1.mp3`
- `applause2.mp3`
- `celebration1.mp3`
- `celebration2.mp3`

### Dice Rolling Sound (1 file)
- `dice-rolling.mp3` - Plays during the dice animation (1.5 seconds)

## Recommended Free Sources

### 1. Pixabay (Recommended - No Attribution Required)
- **Celebration sounds**: https://pixabay.com/sound-effects/search/applause/
- **Dice rolling sounds**: https://pixabay.com/sound-effects/search/dice/
- Search for: "applause", "cheer", "celebration", "success", "dice rolling"
- Download MP3 format
- Completely free for commercial and personal use
- No attribution required

### 2. Mixkit (Free with License)
- Go to: https://mixkit.co/free-sound-effects/applause/
- 36+ free applause sound effects
- Various crowd sizes and styles
- Free under Mixkit License

### 3. Freesound.org (Creative Commons)
- Go to: https://freesound.org
- Search for "applause celebration cheer"
- Filter by Creative Commons 0 (CC0) for no attribution required
- High-quality community uploads

### 4. Uppbeat
- Go to: https://uppbeat.io/sfx/category/applause
- Free sound effects for celebration and applause
- Account required but free tier available

## Download Instructions

1. Visit one of the recommended sites
2. **For celebration sounds**: Search for "applause", "cheering", "success sounds", etc.
   - Download 6 different short clips (2-10 seconds each)
   - Rename to: `cheer1.mp3`, `cheer2.mp3`, `applause1.mp3`, `applause2.mp3`, `celebration1.mp3`, `celebration2.mp3`
3. **For dice sound**: Search for "dice rolling", "dice shake", "rolling dice"
   - Download 1 dice rolling sound (1-3 seconds)
   - Rename to: `dice-rolling.mp3`
4. Place all files in the `sounds/` directory
5. Test by running the Random Student Picker and selecting a student!

## Sound Specifications

- **Format**: MP3
- **Duration**: 2-10 seconds recommended
- **Quality**: Any standard quality (128kbps or higher)
- **Volume**: The app automatically sets volume to 70%

## Testing the Feature

1. Open `index.html` in your browser
2. Add some students in Settings
3. Click "Pick Random Student"
4. You should hear:
   - **Dice rolling sound** during the 1.5-second dice animation
   - **Random celebratory sound** when a student is selected!

## Troubleshooting

If sounds don't play:
- Check browser console for errors
- Ensure files are named exactly as listed above
- Try interacting with the page first (browsers require user interaction for audio)
- Check that files are valid MP3 format
- Verify files are in the correct `sounds/` directory

## Alternative: Quick Test Sounds

If you want to test immediately, you can:
1. Record short sounds yourself (clapping, cheering)
2. Use text-to-speech to generate "Congratulations!" audio
3. Find any short celebratory audio and convert to MP3

The feature is ready to go - just add the sound files!