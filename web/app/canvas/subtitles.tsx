import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Subtitles({
  dataChannel,
}: {
  dataChannel: RTCDataChannel;
}) {
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "response.created") {
        setIsVisible(true);
        setSubtitles([""]);
      } else if (message.type === "response.output_audio_transcript.delta") {
        setSubtitles((prev) => [...prev, message.delta]);
      } else if (message.type === "response.output_audio_transcript.done") {
        setSubtitles([message.transcript]);
      }
    };
    dataChannel.addEventListener("message", handleMessage);
    return () => {
      dataChannel.removeEventListener("message", handleMessage);
    };
  }, [dataChannel]);

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 bottom-28 z-50 p-3 bg-neutral-50 text-black rounded-md shadow-md h-auto max-h-[40vh] max-w-[100px] md:max-w-[640px] overflow-y-auto flex flex-row flex-wrap gap-0 whitespace-pre-wrap"
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -10,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
    >
      {subtitles.map((subtitle, index) => (
        <motion.p key={index} className="text-black text-md m-0">
          {subtitle}
        </motion.p>
      ))}
    </motion.div>
  );
}
