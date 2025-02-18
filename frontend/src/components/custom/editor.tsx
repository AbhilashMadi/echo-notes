import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { useTheme } from "@/hooks/use-theme";

export default function Editor() {
  const { theme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
        content: "You'll see that the text is now blue",
      },
      {
        type: "paragraph",
        content:
          "Press the '/' key - the hovered Slash Menu items are also blue",
      },
      {
        type: "paragraph",
      },
    ],
  });

  return (
    <main className="bg-[#1f1f1f] py-8 overflow-hidden rounded-2xl h-[calc(100dvh-4rem)] overflow-y-scroll">
      <BlockNoteView
        className="text-xs"
        contentEditable={false}
        editor={editor}
        theme={theme}
      />
    </main>
  );
}
