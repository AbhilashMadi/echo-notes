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
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import SearchInput from "./search-input";

import { ThemeSwitch } from "@/components/common/theme-switch";
import useAuth from "@/hooks/use-auth";
import { ServerKeys } from "@/resources/serverkeys";

export default function Sider() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const filtersSchema = [
    {
      id: "sort",
      label: "Sort",
      type: "tab",
      options: [
        { value: "asc", label: "Oldest First" },
        { value: "desc", label: "Newest First" },
      ],
      default: "desc",
    },
    {
      id: "favorite",
      label: "Show Favorites",
      type: "checkbox",
      default: false,
      icon: "stash:heart-solid",
    },
    {
      id: "pinned",
      label: "Show Pinned",
      type: "checkbox",
      default: false,
      icon: "basil:pin-solid",
    },
    {
      id: "tags",
      label: "Tags",
      type: "tags",
      default: user?.[ServerKeys.TAGS],
    },
  ];

  // Extract tags from URL params or use default ones
  const initialTags = filtersSchema.find((f) => f.id === "tags")?.default || [];
  const [availableTags, setAvailableTags] = useState<string[]>(initialTags);
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

  return (
    <aside className="w-[250px] rounded-2xl p-4 h-[calc(100vh-8rem)] bg-foreground-50 flex flex-col justify-between text-xs">
      <div className="flex flex-col gap-3">
        {filtersSchema.map((filter) => (
          <div key={filter.id}>
            {filter.type === "checkbox" && (
              <Checkbox
                icon={<Icon height="24" icon={filter.icon} width="24" />}
                isSelected={searchParams.get(filter.id) === "true"}
                onChange={(e) =>
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);

                    newParams.set(
                      filter.id,
                      e.target.checked ? "true" : "false",
                    );

                    return newParams;
                  })
                }
              >
                <div className="text-xs">{filter.label}</div>
              </Checkbox>
            )}

            {filter.type === "tab" && (
              <Tabs
                aria-label={filter.label}
                selectedKey={searchParams.get(filter.id) || filter.default}
                size="sm"
                variant={"solid"}
                onSelectionChange={(value) =>
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);

                    newParams.set(filter.id, value as string);

                    return newParams;
                  })
                }
              >
                {filter.options.map((option) => (
                  <Tab key={option.value} title={option.label} />
                ))}
              </Tabs>
            )}

            {filter.type === "tags" && (
              <div className="flex flex-col gap-3">
                {/* Available Tags (Draggable) */}
                <Card>
                  <CardHeader className="flex gap-3">
                    <Icon
                      height="24"
                      icon="solar:archive-down-minimlistic-broken"
                      width="24"
                    />
                    <div className="">Available tags from your notes</div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Chip
                          key={tag}
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
                  <CardBody>
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
              </div>
            )}
          </div>
        ))}
        <SearchInput />
      </div>

      {/* USER PROFILE & THEME SWITCH */}
      <div className="flex justify-between gap-2">
        <div className="bg-foreground-200 w-full rounded-xl" />
        <div className="p-2 flex-center bg-foreground-200 rounded-xl">
          <ThemeSwitch />
        </div>
      </div>
    </aside>
  );
}
