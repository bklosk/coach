// web/app/session/session_manager.tsx
"use client";

import getImage from "../utils/getImage";

export type RealtimeSession = {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  audioElement: HTMLAudioElement;
  sendJSON: (payload: unknown) => void;
  sendImage: (file: File) => Promise<void>;
  close: () => void;
};

export async function createRealtimeSession(): Promise<RealtimeSession> {
  const tokenResponse = await fetch("/api/token");
  const data = await tokenResponse.json();
  const EPHEMERAL_KEY = data.value;

  const peerConnection = new RTCPeerConnection();

  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;

  peerConnection.ontrack = (event) => {
    audioElement.srcObject = event.streams[0];
  };

  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  peerConnection.addTrack(mediaStream.getTracks()[0]);

  const dataChannel = peerConnection.createDataChannel("oai-events", {
    ordered: true,
  });

  const opened = new Promise<void>((resolve, reject) => {
    dataChannel.onopen = () => resolve();
    dataChannel.onerror = (e) => reject(e);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      "Content-Type": "application/sdp",
    },
    body: offer.sdp!,
  });

  const answer: RTCSessionDescriptionInit = {
    type: "answer",
    sdp: await sdpResponse.text(),
  };
  await peerConnection.setRemoteDescription(answer);

  await opened;

  const sendJSON = (payload: unknown) => {
    dataChannel.send(JSON.stringify(payload));
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve((reader.result as string).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const sendImage = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      console.log("Preparing to send image with base64 length:", base64.length);

      // Add the image to the conversation as context for the ongoing speech response
      // The model will automatically include this in its response to the user's speech
      const payload = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: dataUrl,
              detail: "auto",
            },
          ],
        },
      };

      console.log("Sending conversation.item.create with input_image");
      sendJSON(payload);

      // Don't call response.create - the model is already responding to speech
      console.log("Image added to conversation context");
    } catch (error) {
      console.error("Error in sendImage:", error);
      throw error;
    }
  };

  console.log("Exporting canvas as PNG");
  const { document: svgFile } = await getImage();
  await sendImage(svgFile);

  dataChannel.onmessage = async (event) => {
    if (
      (JSON.parse(event.data) as { type?: string })?.type ===
      "input_audio_buffer.speech_started"
    ) {
      console.log("Input audio speech started, exporting canvas as SVG");
      const { document: svgFile } = await getImage();
      await sendImage(svgFile);
      console.log("Canvas exported as SVG and sent to OpenAI");
    }
  };

  const close = () => {
    try {
      dataChannel.close();
    } catch {}
    try {
      peerConnection.close();
    } catch {}
    mediaStream.getTracks().forEach((t) => t.stop());
  };

  return {
    peerConnection,
    dataChannel,
    audioElement,
    sendJSON,
    sendImage,
    close,
  };
}
