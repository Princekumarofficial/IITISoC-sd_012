import { useState } from "react";

function CopyableMeetingId({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    setExpanded(true);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {
      console.error("Copy failed");
    }
  };

  return (
    <div
      className="cursor-pointer select-none  text-sm h-1 font-mono text-gray-700"
      onClick={handleClick}
      title="Click to copy"
    > 
      <span className="truncate inline-block max-w-[80px]">
        {expanded ? value : `${value.slice(0, 5)}...`}
      </span>
      {copied && <span className="text-green-600 ml-2">Copied!</span>}
    </div>
  );
}
