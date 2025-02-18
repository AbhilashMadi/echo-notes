import { useCreateBlockNote } from "@blocknote/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { FC, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import Highlighter from "./highlighter";

import { formatDate } from "@/utils/time-utils";
import { debounce } from "@/utils/idempotency";
import { Note } from "@/types/object-types";
import { ServerKeys } from "@/resources/serverkeys";
import useGlobalContext from "@/hooks/context-hooks";
import {
  useDeleteNoteMutation,
  useFavoriteNoteMutation,
  usePinNoteMutation,
} from "@/context/notes-api";

const NoteCard: FC<{ note: Note }> = ({ note }) => {
  const { searchParams } = useGlobalContext();
  const noteId = note?.[ServerKeys.NOTE_ID];
  // const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [updateFavorite, { isLoading: isUpdatingFavorite }] =
    useFavoriteNoteMutation();
  const [updatePinned, { isLoading: isUpdatingPinned }] = usePinNoteMutation();

  // Handle Favorite
  const handleFavorite = useCallback(
    debounce(
      async (favorite: boolean) => await updateFavorite({ favorite, noteId }),
      500,
    ),
    [],
  );

  // Handle Pinned
  const handlePinned = useCallback(
    debounce(
      async (pinned: boolean) => await updatePinned({ noteId, pinned }),
      500,
    ),
    [],
  );

  // Handle Delete note
  const [openDeletePop, setOpenDeletePop] = useState<boolean>(false);
  const toggleDeletePop = (): void => setOpenDeletePop(!openDeletePop);

  const handleDeleteNote = useCallback(
    debounce(async (noteId: string): Promise<void> => {
      await deleteNote({ noteId });
      setOpenDeletePop(false);
    }, 500),
    [],
  );

  const editor = useCreateBlockNote({
    initialContent: note?.[ServerKeys.CONTENT],
  });

  return (
    <Card className="p-4 rounded-lg text-xs relative">
      <CardHeader className="font-semibold text-sm text-clip-2">
        <Highlighter
          highlightText={searchParams.get(ServerKeys.SEARCH) || ""}
          text={note.title}
        />
      </CardHeader>
      <CardBody className="text-foreground-400">
        <ul>
          {note?.[ServerKeys.CONTENT]
            .slice(0, 6)
            .map((o, i: number) => <li key={i}>{o?.[ServerKeys.CONTENT]}</li>)}
        </ul>
      </CardBody>
      <CardFooter className="flex flex-col items-start">
        <div className="py-2 text-clip-2">
          <b>Tags: </b>
          <span className="text-primary-500 ml-1">
            {note.tags.map((t) => (
              <span key={t}> #{t}</span>
            ))}
          </span>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex">
            <Chip
              className="rounded-r-none bg-foreground-200"
              size="sm"
              startContent={
                <Icon
                  className="mr-1"
                  height="16"
                  icon="solar:calendar-add-line-duotone"
                  width="16"
                />
              }
            >
              {formatDate(note?.createdAt)}
            </Chip>
            <Chip
              className="rounded-l-none border-l-1 border-foreground-50 bg-foreground-200"
              size="sm"
              startContent={
                <Icon
                  className="mr-1"
                  height="16"
                  icon="solar:gallery-bold-duotone"
                  width="16"
                />
              }
            >
              {note?.images.length}
            </Chip>
          </div>
          <div className="inline-flex">
            <button
              className={clsx(
                "bg-foreground-200 p-1 rounded-l-full",
                note?.[ServerKeys.PINNED]
                  ? "bg-success-500 text-white"
                  : "hover:bg-success-100",
              )}
              disabled={isUpdatingPinned}
              onClick={() => handlePinned(!note?.[ServerKeys.PINNED])}
            >
              {isUpdatingPinned ? (
                <Icon
                  height="16"
                  icon="line-md:loading-twotone-loop"
                  width="16"
                />
              ) : (
                <Icon height="16" icon="solar:pin-bold-duotone" width="16" />
              )}
            </button>
            <button
              className={clsx(
                "bg-foreground-200 p-1 border-l-1 border-foreground-50",
                note?.[ServerKeys.FAVORITE]
                  ? "bg-pink-500 text-white"
                  : "hover:bg-danger-100",
              )}
              disabled={isUpdatingFavorite}
              onClick={() => handleFavorite(!note?.[ServerKeys.FAVORITE])}
            >
              {isUpdatingFavorite ? (
                <Icon
                  height="16"
                  icon="line-md:loading-twotone-loop"
                  width="16"
                />
              ) : (
                <Icon height="16" icon="solar:star-bold-duotone" width="16" />
              )}
            </button>
            <Link to={`/note/${note?.[ServerKeys.NOTE_ID]}`}>
              <button className="bg-foreground-200 p-1 border-l-1 border-foreground-50 hover:bg-warning-300">
                <Icon height="16" icon="solar:eye-broken" width="16" />
              </button>
            </Link>
            <Popover showArrow backdrop="opaque" isOpen={openDeletePop}>
              <PopoverTrigger>
                <button
                  className="bg-foreground-200 p-1 rounded-r-full border-l-1  border-foreground-50 hover:bg-red-500"
                  disabled={isDeleting}
                  onClick={toggleDeletePop}
                >
                  <Icon
                    height="16"
                    icon="solar:trash-bin-trash-bold-duotone"
                    width="16"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="font-primary text-xs">
                <div className="inline-flex items-center gap-1">
                  <p>
                    Sure you wanted
                    <br /> to delete this note
                  </p>
                  <div className="space-x-1">
                    <button
                      className="p-1 rounded-md bg-warning-500 size-6"
                      onClick={() => setOpenDeletePop(false)}
                    >
                      <Icon height="16" icon="hugeicons:cancel-01" width="16" />
                    </button>
                    <button
                      className="p-1 rounded-md bg-red-500 size-6"
                      onClick={() =>
                        handleDeleteNote(note?.[ServerKeys.NOTE_ID])
                      }
                    >
                      {isDeleting ? (
                        <Icon
                          height="16"
                          icon="line-md:loading-twotone-loop"
                          width="16"
                        />
                      ) : (
                        <Icon
                          height="16"
                          icon="solar:trash-bin-minimalistic-bold-duotone"
                          width="16"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
