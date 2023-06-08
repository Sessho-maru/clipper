# clipper
- Making video clips by using bookmark file `.pbf` on [DAUMPotplayer](https://potplayer.daum.net/)

<img src="https://raw.githubusercontent.com/Sessho-maru/clipper/main/example.gif" />

video source, Universe Size Comparison 3D [(YouTube)](https://www.youtube.com/watch?v=i93Z7zljQ7I)

## Motivation
[This tool](https://github.com/Sessho-maru/pbfWalker) simply parse a `.pbf` into a plain text to make easy to peek the desired portion of video.<br/>
***Clipper*** splits given video source into actual video clips.

### Requirement
- node, ffmpeg
- Turn on `Store bookmarks into .pbf files instead of Registry/INI(책갈피를 동영상과 같은 폴더에 저장)`</br>(this option makes a `.pbf` file be populated in the same folder where target video lives)
