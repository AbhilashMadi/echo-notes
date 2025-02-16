import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { FC, useCallback, useState } from "react";

import { Loader } from "@/App";
import {
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from "@/context/notes-api";
import useGlobalContext from "@/hooks/context-hooks";
import { formatDate } from "@/utils/time-utils";
import { ServerKeys } from "@/resources/serverkeys";
import { debounce } from "@/utils/idempotency";
import Mapper from "@/components/custom/mapper";
import { Note } from "@/types/object-types";

const Empty: FC = () => {
  return (
    <div className="h-[70dvh] w-full flex-center font-secondary text-foreground-500">
      <p className="w-[20%]">
        No notes? No thoughts? Just vibes. 🌀 Start jotting before they vanish!
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { searchParams, setSearchParams } = useGlobalContext();
  const { data, isLoading } = useGetNotesQuery({
    query: searchParams.toString(),
  });
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  // Ensure initial params
  if (!searchParams.get("limit")) searchParams.set("limit", "6");
  if (!searchParams.get("page")) searchParams.set("page", "1");

  const limit = Number(searchParams.get("limit")) || 6;
  const page = Number(searchParams.get("page")) || 1;

  const notes = data?.data?.notes ?? [];
  const totalNotes = data?.data?.total ?? 0;
  // Ensure at least 1 page
  const totalPages = Math.max(Math.ceil(totalNotes / limit), 1);

  const handlePageChange = (page: number): void => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  //Features Toggle
  const handleFeatureToggle = async (
    noteId: string,
    v: boolean,
    attribute: ServerKeys.FAVORITE | ServerKeys.PINNED,
  ): Promise<void> => {
    await updateNote({
      [ServerKeys.NOTE_ID]: noteId,
      [ServerKeys.BODY]: { [attribute]: v },
    });
  };

  //Delete note
  const [openDeletePop, setOpenDeletePop] = useState<string>("");
  const toggleDeletePop = (noteId: string): void => setOpenDeletePop(noteId);
  const handleDeleteNote = useCallback(
    debounce(async (noteId: string): Promise<void> => {
      await deleteNote({ noteId });
      setOpenDeletePop("");
    }, 500),
    [],
  );

  const debounceFeature = useCallback(debounce(handleFeatureToggle, 500), []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="p-8 h-full flex flex-col justify-between items-center overflow-y-auto transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Mapper<Note>
          comp={(note) => (
            <Card key={note.noteId} className="p-4 rounded-lg text-xs relative">
              <CardHeader className="font-semibold text-sm text-clip-2">
                {note.title}
              </CardHeader>
              <CardBody className="text-foreground-400">
                <p className="line-clamp-3">{note.content}</p>
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
                      disabled={isUpdating}
                      onClick={() =>
                        debounceFeature(
                          note?.[ServerKeys.NOTE_ID],
                          !note?.[ServerKeys.PINNED],
                          ServerKeys.PINNED,
                        )
                      }
                    >
                      <Icon
                        height="16"
                        icon="solar:pin-bold-duotone"
                        width="16"
                      />
                    </button>
                    <button
                      className={clsx(
                        "bg-foreground-200 p-1 border-l-1 border-foreground-50",
                        note?.[ServerKeys.FAVORITE]
                          ? "bg-danger-500 text-white"
                          : "hover:bg-danger-100",
                      )}
                      disabled={isUpdating}
                      onClick={() =>
                        debounceFeature(
                          note?.[ServerKeys.NOTE_ID],
                          !note?.[ServerKeys.FAVORITE],
                          ServerKeys.FAVORITE,
                        )
                      }
                    >
                      <Icon
                        height="16"
                        icon="solar:star-bold-duotone"
                        width="16"
                      />
                    </button>
                    <Popover
                      showArrow
                      backdrop="opaque"
                      isOpen={openDeletePop === note?.[ServerKeys.NOTE_ID]}
                    >
                      <PopoverTrigger>
                        <button
                          className="bg-foreground-200 p-1 rounded-r-full border-l-1  border-foreground-50 hover:bg-red-500"
                          onClick={() =>
                            toggleDeletePop(note?.[ServerKeys.NOTE_ID])
                          }
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
                              onClick={() => toggleDeletePop("")}
                            >
                              <Icon
                                height="16"
                                icon="hugeicons:cancel-01"
                                width="16"
                              />
                            </button>
                            <button
                              className="p-1 rounded-md bg-red-500 size-6"
                              onClick={() =>
                                handleDeleteNote(note?.[ServerKeys.NOTE_ID])
                              }
                            >
                              <Icon
                                height="16"
                                icon="solar:trash-bin-minimalistic-bold-duotone"
                                width="16"
                              />
                            </button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}
          data={notes}
        />
      </div>
      {notes.length === 0 && <Empty />}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            showShadow
            color="primary"
            initialPage={page}
            page={page}
            size="sm"
            total={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
}
