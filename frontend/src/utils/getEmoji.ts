// Define supported emotion types from face-api
export type EmotionType =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "fear"
  | "disgusted"
  | "surprised";

// Utility function to map emotion to emoji
export function getEmojiFromEmotion(emotion: string): string {
  const emojiMap: Record<EmotionType, string> = {
    neutral: "😐",
    happy: "😄",
    sad: "😢",
    angry: "😠",
    fear: "😨",
    disgusted: "🤢",
    surprised: "😲",
  };

  const lowerEmotion = emotion.toLowerCase() as EmotionType;

  return emojiMap[lowerEmotion] ?? "❓";
}