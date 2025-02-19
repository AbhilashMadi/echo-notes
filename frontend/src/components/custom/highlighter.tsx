import React from "react";

interface HighlighterProps {
  text: string;
  highlightText: string;
}

const Highlighter: React.FC<HighlighterProps> = ({ text, highlightText }) => {
  if (!highlightText) {
    return <div>{text}</div>;
  }

  const regex = new RegExp(`(${highlightText})`, "gi");
  const parts = text.split(regex);

  return (
    <div>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="bg-warning-100 px-0.5 rounded-sm border border-dashed border-yellow-600"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </div>
  );
};

export default Highlighter;
