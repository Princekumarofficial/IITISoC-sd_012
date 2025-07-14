import { useMemo } from "react";
import { VideoTile } from "./VideoTile";
import { getEmojiFromEmotion } from "../utils/getEmoji";
import { RemoteStream } from "../hooks/useSFUClient";

export default function RemoteStreamTiles({ remote, emotionData, isFaceSwapOn }: {
  remote: RemoteStream,
  emotionData: any,
  isFaceSwapOn: boolean
}) {
  const videoTracks = remote.stream.getVideoTracks();
  const cameraTrack = videoTracks[0] || null;
  const screenTrack = videoTracks[1] || null;

  const cameraStream = useMemo(() => cameraTrack ? new MediaStream([cameraTrack]) : null, [cameraTrack]);
  const screenStream = useMemo(() => screenTrack ? new MediaStream([screenTrack]) : null, [screenTrack]);

  return (
    <>
      {cameraStream && (
        <VideoTile
          key={`${remote.peerId}-cam`}
          stream={cameraStream}
          name={remote.peerName}
          isLocal={false}
          muted={false}
          emotion={getEmojiFromEmotion(emotionData?.emotion)}
          emotionConfidence={emotionData?.confidence}
          showEmoji={emotionData?.isOverlayOn}
          showFaceSwap={isFaceSwapOn}
          landmarks={emotionData?.landmarks}
        />
      )}

      {screenStream && (
        <VideoTile
          key={`${remote.peerId}-screen`}
          stream={screenStream}
          name={`${remote.peerName}'s screen`}
          isLocal={false}
          muted={true}
          emotionConfidence={0}
          showEmoji={false}
          showFaceSwap={false}
          landmarks={{}}
        />
      )}
    </>
  );
}