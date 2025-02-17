import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { useTheme } from "@/hooks/use-theme";

export default function Editor() {
  const { theme } = useTheme();
  const editor = useCreateBlockNote();

  return <BlockNoteView className="text-xs" editor={editor} theme={theme} />;
}
