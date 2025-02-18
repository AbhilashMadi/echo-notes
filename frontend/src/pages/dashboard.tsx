import { Pagination } from "@heroui/react";
import { FC } from "react";

import { Loader } from "@/App";
import Sider from "@/components/common/sider";
import Mapper from "@/components/custom/mapper";
import { useGetNotesQuery } from "@/context/notes-api";
import useGlobalContext from "@/hooks/context-hooks";
import { Note } from "@/types/object-types";
import NoteCard from "@/components/custom/note-card";

const Empty: FC = () => {
  return (
    <div className="font-secondary text-foreground-500">
      <p className="w-[40%] mx-auto">
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="flex p-8 gap-8 font-primary">
      <Sider />
      <section className="p-8 w-full bg-foreground-50 rounded-2xl flex flex-col justify-between items-center overflow-y-auto transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Mapper<Note>
            comp={(note) => <NoteCard note={note} />}
            data={notes}
          />
        </div>

        {/* UI For empty board */}
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
    </main>
  );
}
