import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import {
  DragHandleButton,
  SideMenu,
  SideMenuController,
  SideMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
  useCreateBlockNote,
} from "@blocknote/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetNoteQuery } from "@/context/notes-api";
import { useTheme } from "@/hooks/use-theme";

// Custom Side Menu button to remove the hovered block.
export function RemoveBlockButton(props: SideMenuProps) {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;

  return (
    <Components.SideMenu.Button
      icon={
        <Icon
          height="20"
          icon="solar:trash-bin-trash-bold-duotone"
          width="20"
          onClick={() => editor.removeBlocks([props.block])}
        />
      }
      label="Remove block"
    />
  );
}

export default function Editor() {
  const { theme } = useTheme();
  const { noteId = "" } = useParams();

  const { isLoading, data: response } = useGetNoteQuery({ noteId });
  const editor = useCreateBlockNote();

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(
        response?.data?.note?.content,
      );

      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor, response]);

  return (
    <main className="p-4 overflow-hidden rounded-2xl h-[calc(100dvh-4rem)] overflow-y-scroll">
      <BlockNoteView editor={editor} sideMenu={false} theme={theme}>
        <SideMenuController
          sideMenu={(props) => (
            <SideMenu {...props}>
              {/* Button which removes the hovered block. */}
              <RemoveBlockButton {...props} />
              <DragHandleButton {...props} />
            </SideMenu>
          )}
        />
      </BlockNoteView>
    </main>
  );
}
