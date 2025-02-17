import { FC, useEffect, useRef } from "react";
import { Input, InputProps, Kbd } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ISearchInput extends InputProps { }

const SearchInput: FC<ISearchInput> = (props) => {
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
      {...props}
      ref={inputRef}
      className="placeholder:text-xs text-xs"
      endContent={<Kbd keys={["ctrl", "space"]} />}
      labelPlacement="outside"
      placeholder="Search title 👉🏻"
      startContent={<Icon height="24" icon="hugeicons:search-01" width="24" />}
      type="text"
    />
  );
};

export default SearchInput;
