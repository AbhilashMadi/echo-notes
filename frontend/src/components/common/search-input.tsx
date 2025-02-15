import { FC, useEffect, useRef } from "react";
import { Input, Kbd } from "@heroui/react";
import { Icon } from "@iconify/react";

const SearchInput: FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Detect "Ctrl + Space"
      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Input
      ref={inputRef}
      className="placeholder:text-xs text-xs"
      endContent={<Kbd keys={["ctrl", "space"]} />}
      label="Search notes"
      labelPlacement="outside"
      placeholder="Press to search 👉🏻"
      startContent={<Icon height="24" icon="hugeicons:search-01" width="24" />}
      type="text"
    />
  );
};

export default SearchInput;
