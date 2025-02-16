import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  Tab,
  Tabs,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, {
  ChangeEvent,
  useCallback,
  useDeferredValue,
  useState,
} from "react";

import LogOutButton from "./logout-button";
import SearchInput from "./search-input";

import { ThemeSwitch } from "@/components/common/theme-switch";
import useAuth from "@/hooks/use-auth";
import { ServerKeys } from "@/resources/serverkeys";
import useGlobalContext from "@/hooks/context-hooks";
import { debounce } from "@/utils/idempotency";

export default function Sider() {
  const { searchParams, setSearchParams } = useGlobalContext();
  const { user } = useAuth();

  /************************** DRAG TAGS LOGIC ***************************************/
  // Extract tags from URL params or use default ones
  const [availableTags, setAvailableTags] = useState<string[]>(
    user?.[ServerKeys.TAGS] ?? [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",") || [],
  );

  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, tag: string) => {
    e.dataTransfer.setData("text/plain", tag);
  };

  // Function to handle dropping
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const tag = e.dataTransfer.getData("text/plain");

    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setAvailableTags((prev) => prev.filter((t) => t !== tag));
      updateSearchParams([...selectedTags, tag]);
    }
  };

  // Allow dropping
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Function to update searchParams
  const updateSearchParams = (tags: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (tags.length === 0) {
      newParams.delete("tags");
    } else {
      newParams.set("tags", tags.join(","));
    }
    setSearchParams(newParams);
  };

  // Function to remove a tag
  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setAvailableTags((prev) => [...prev, tag]);
    updateSearchParams(selectedTags.filter((t) => t !== tag));
  };

  /**************************** CHECKBOXES LOGIC *****************************/
  const defaultShowFavoirte = false; //not specific filter
  const defaultShowPinned = false; //not show specific but included

  const handleCheckboxChange = (
    attribute: ServerKeys.FAVORITE | ServerKeys.PINNED,
  ) => {
    return (checked: boolean) => {
      if (checked) {
        searchParams.set(attribute, "true");
      } else {
        searchParams.delete(attribute);
      }
      setSearchParams(searchParams);
    };
  };

  /**************************** TABS LOGIC ***********************************/
  const defaultSortOrder = searchParams.get(ServerKeys.SORT) ?? "asc";
  const handleTabChange = (key: React.Key) => {
    searchParams.set(ServerKeys.SORT, key.toString());
    setSearchParams(searchParams);
  };

  /*****************************SEARCH LOGIC *********************************/
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get(ServerKeys.SEARCH) ?? "",
  );
  const defferedSearch = useDeferredValue(searchValue);

  const handleSearch = (v: string) => {
    if (v) {
      searchParams.set(ServerKeys.SEARCH, v);
    } else {
      searchParams.delete(ServerKeys.SEARCH);
    }

    setSearchParams(searchParams);
  };

  const debounceSearch = useCallback(debounce(handleSearch, 500), []);
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debounceSearch(e.target.value.trim());
  };

  return (
    <aside className="w-[250px] rounded-2xl p-4 min-h-[calc(100vh-4rem)] bg-foreground-50 flex flex-col justify-between text-xs">
      <div className="flex flex-col gap-3">
        {/* Checkboxes for specific filtering (by default allowed when false only filtered when checked)*/}
        <Checkbox
          defaultSelected={defaultShowFavoirte}
          onValueChange={handleCheckboxChange(ServerKeys.FAVORITE)}
        >
          <p className="text-xs">Only Show Favorites</p>
        </Checkbox>
        <Checkbox
          defaultSelected={defaultShowPinned}
          onValueChange={handleCheckboxChange(ServerKeys.PINNED)}
        >
          <p className="text-xs">Only Show Pinned</p>
        </Checkbox>

        {/* Sort order Tabs */}
        <Tabs
          aria-label="Notes sort tabs"
          defaultSelectedKey={defaultSortOrder}
          size="sm"
          onSelectionChange={handleTabChange}
        >
          <Tab key={"asc"} title={"Oldest First"} />
          <Tab key={"desc"} title={"Newest First"} />
        </Tabs>

        {/* Available Tags (Draggable) */}
        <Card>
          <CardHeader className="flex gap-3">
            <Icon
              height="24"
              icon="solar:archive-down-minimlistic-broken"
              width="24"
            />
            <div>Available tags from your notes</div>
          </CardHeader>
          <CardBody className="overflow-y-scroll max-h-[100px]">
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Chip
                  key={tag}
                  className="hover:cursor-grab active:cursor-grabbing"
                  draggable="true"
                  size="sm"
                  variant="flat"
                  onDragStart={(e) => handleDragStart(e, tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Selected Tags (Droppable) */}
        <Card onDragOver={allowDrop} onDrop={handleDrop}>
          <CardHeader className="flex gap-3">
            <Icon
              height="24"
              icon="solar:checklist-minimalistic-line-duotone"
              width="24"
            />
            <div className="">Selected Tags to filter</div>
          </CardHeader>
          <CardBody className="overflow-y-scroll max-h-[120px]">
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="flat"
                    onClose={() => removeTag(tag)}
                  >
                    {tag}
                  </Chip>
                ))
              ) : (
                <p className="text-foreground-400 border-dashed border border-foreground-300 w-full rounded-xl p-4 bg-foreground-100 flex items-center flex-col gap-2">
                  <Icon
                    height="24"
                    icon="solar:filter-line-duotone"
                    width="24"
                  />
                  Drop tags here...
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Search Input */}
        <SearchInput value={defferedSearch} onChange={handleSearchChange} />
      </div>

      {/* USER PROFILE & THEME SWITCH */}
      <div className="flex justify-between gap-2">
        <LogOutButton />
        <div className="p-2 flex-center bg-foreground-200 rounded-xl">
          <ThemeSwitch />
        </div>
      </div>
    </aside>
  );
}
