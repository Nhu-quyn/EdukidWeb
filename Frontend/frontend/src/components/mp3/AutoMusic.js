import { useEffect, useRef } from "react";
import music from "../../mp3/kids-happy-music-320636.mp3";

const AutoMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true; // phát liên tục

    const playAudio = () => {
      if (audio) {
        audio.volume = 0.3; // tùy chỉnh âm lượng
        audio.play().catch((err) => {
          console.log("Trình duyệt chặn phát nhạc:", err);
        });
      }
    };

    // Phát nhạc sau khi người dùng tương tác (lần đầu click)
    document.addEventListener("click", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  return <audio ref={audioRef} src={music} preload="auto" />;
};

export default AutoMusic;
