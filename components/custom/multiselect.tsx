// MultiSelectCommand.tsx
import React from "react";
import { ChevronDown, LoaderIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
// import Highlighter from "react-highlight-words";
import { MultiSelectFieldProps, optionType } from "@/utils/types"; // Adjust the path as needed

// Define the two tabs used for the command list.
const tabTitles = ["add", "remove"] as const;
type TabTitle = (typeof tabTitles)[number];

/**
 * MultiSelectCommand
 *
 * This component is used as the RenderComponent for a multiselect field.
 * It expects the configuration defined in your MagicFieldMultiSelect type:
 *
 *   - `options`: a function returning (or Promise of) an array of optionType
 *   - `conditionalOptions` (optional): an object with a field name and a function that,
 *      given a string value, returns (or Promise of) an array of optionType.
 *   - `value`: an array of currently selected option values.
 *   - `onChange`: callback to update the value.
 *
 * Additional configuration such as `className` is applied to the outer container.
 */
const MultiSelectCommand: React.FC<MultiSelectFieldProps> = ({
  value,
  onChange,
  options,
  conditionalOptions,
  className,
  // Extract additional properties from rest. We expect conditionalValue may be passed.
  ...rest
}) => {
  // Extract conditionalValue from rest (if provided)
  const { conditionalValue } = rest as { conditionalValue?: string };

  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabTitle>("add");
  const [loadedOptions, setLoadedOptions] = React.useState<optionType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Load the primary options.
  React.useEffect(() => {
    async function loadOptions() {
      setLoading(true);
      let opts: optionType[] = [];
      if (options) {
        if (typeof options === "function") {
          opts = await options();
        } else {
          opts = options;
        }
      }
      setLoadedOptions(opts);
      setLoading(false);
    }
    loadOptions();
  }, [options]);

  // If conditionalOptions and a conditionalValue are provided, load those options.
  React.useEffect(() => {
    async function loadConditional() {
      if (conditionalOptions && conditionalValue) {
        setLoading(true);
        const opts = await conditionalOptions.fn(conditionalValue);
        setLoadedOptions(opts);
        setLoading(false);
      }
    }
    loadConditional();
  }, [conditionalOptions, conditionalValue]);

  // Determine the effective loading state.
  const isLoading = loading;

  // Create a Set for quick lookup of selected option values.
  const selectedIds = React.useMemo(
    () => new Set(value?.filter(Boolean) || []),
    [value]
  );

  // Partition the loaded options into "add" (not selected) and "remove" (selected).
  const data = React.useMemo(() => {
    const allOptions = loadedOptions || [];
    const add = allOptions.filter((item) => !selectedIds.has(item.value));
    const remove = allOptions.filter((item) => selectedIds.has(item.value));
    return { add, remove };
  }, [selectedIds, loadedOptions]);

  // Handlers for toggling the popover.
  const handleTogglePopover = React.useCallback(() => {
    setIsPopoverOpen((prev) => !prev);
  }, []);

  const handleClosePopover = React.useCallback(() => {
    setIsPopoverOpen(false);
  }, []);

  // When an item is clicked in the command list, update the selection.
  const handleSelect = React.useCallback(
    (item: optionType) => {
      const newList =
        activeTab === "add"
          ? [...data.remove, item]
          : data.remove.filter((d) => d.value !== item.value);
      onChange?.(newList.map((d) => d.value));
    },
    [activeTab, data, onChange]
  );

  // "Select all" (or "remove all") handler.
  const handleSelectAll = React.useCallback(() => {
    onChange?.(activeTab === "add" ? loadedOptions.map((d) => d.value) : []);
  }, [activeTab, onChange, loadedOptions]);

  // Remove a single item.
  const handleUnselect = React.useCallback(
    (item: optionType) => {
      const newList = data.remove.filter((d) => d.value !== item.value);
      onChange?.(newList.map((d) => d.value));
    },
    [data.remove, onChange]
  );

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <SelectedProperty
        isLoading={isLoading}
        selected={data.remove}
        handleTogglePopover={handleTogglePopover}
        handleUnselect={handleUnselect}
        className={className}
      />
      <PopoverContent className="min-w-[var(--radix-popper-anchor-width)] p-0 max-h-[300px] overflow-hidden">
        <PropertiesList
          selectedTab={activeTab}
          list={data}
          onTabValueChange={async (tab) => setActiveTab(tab as TabTitle)}
          selectAll={handleSelectAll}
          onSelect={handleSelect}
          onClose={handleClosePopover}
        />
      </PopoverContent>
    </Popover>
  );
};

/* --------------------------------------------------------------------------
   SelectedProperty Component
   -------------------------------------------------------------------------- */

type SelectedPropertyProps = React.ComponentProps<"button"> & {
  selected?: optionType[];
  isLoading?: boolean;
  handleTogglePopover?: () => void;
  handleUnselect?: (item: optionType) => void;
};

function SelectedProperty({
  selected = [],
  isLoading,
  handleTogglePopover,
  handleUnselect,
  className,
  ...props
}: SelectedPropertyProps) {
  return (
    <TooltipProvider>
      <PopoverTrigger asChild>
        <Button
          onClick={handleTogglePopover}
          disabled={isLoading}
          className={cn(
            "flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-input p-1 hover:bg-input/80",
            className
          )}
          {...props}
        >
          {selected.length > 0 ? (
            <Tooltip delayDuration={100}>
              <ScrollArea className="w-full">
                <TooltipTrigger asChild>
                  <div className="flex w-max gap-1">
                    {selected.map((item) => (
                      <Badge
                        key={item.value}
                        variant="default"
                        className="flex-shrink rounded-sm text-[13.6px] font-medium capitalize hover:bg-primary"
                      >
                        {item.label}
                        <span
                          className="ml-1 rounded-full cursor-pointer outline-none ring-offset-background active:ring-2 active:ring-ring active:ring-offset-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUnselect?.(item);
                          }}
                        >
                          <X className="h-3 w-3 text-destructive hover:text-destructive/50" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </TooltipTrigger>
                <ScrollBar
                  orientation="horizontal"
                  className="opacity-40"
                  onClick={(e) => e.stopPropagation()}
                />
              </ScrollArea>
            </Tooltip>
          ) : (
            <>
              {isLoading ? (
                <div className="ml-2 mt-1 flex h-6 flex-1 items-center bg-transparent text-muted-foreground outline-none">
                  <LoaderIcon className="animate-spin" />
                </div>
              ) : (
                <div className="mx-auto flex w-full items-center justify-between">
                  <span className="mx-3 text-sm capitalize text-muted-foreground">
                    select
                  </span>
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
    </TooltipProvider>
  );
}

/* --------------------------------------------------------------------------
   PropertiesList Component
   -------------------------------------------------------------------------- */

type PropertiesListProps = {
  list: Record<TabTitle, optionType[]>;
  onTabValueChange: (value: TabTitle) => Promise<void>;
  selectedTab: TabTitle;
  selectAll: () => void;
  onClose: () => void;
  onSelect?: (value: optionType) => void;
};

function PropertiesList({
  list,
  onTabValueChange,
  selectedTab,
  ...props
}: PropertiesListProps) {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => onTabValueChange(value as TabTitle)}
      className="w-full flex flex-col h-full"
    >
      <TabsList className="w-full rounded-b-none sticky top-0 z-10 bg-background">
        {tabTitles.map((title) => (
          <TabsTrigger key={title} className="w-full capitalize" value={title}>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex-grow overflow-auto">
        {tabTitles.map((title) => (
          <TabsContent key={title} value={title} className="h-full m-0">
            <PropertyCommand
              items={list[title]}
              selectedTab={selectedTab}
              {...props}
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

/* --------------------------------------------------------------------------
   PropertyCommand Component
   -------------------------------------------------------------------------- */

type PropertyCommandProps = {
  items: optionType[];
  onSelect?: (value: optionType) => void;
  selectedTab: TabTitle;
  selectAll?: () => void;
  onClose?: () => void;
};

function PropertyCommand({
  items,
  onSelect,
  onClose,
  selectAll,
  selectedTab,
}: PropertyCommandProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const searchResults =
    searchValue.length > 0
      ? items.filter((item) =>
          item.label
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
      : [];

  const isEmpty =
    (searchValue.length > 0 && searchResults.length === 0) ||
    (searchValue.length === 0 && items.length === 0);

  const getItemList = (item: optionType) => (
    <CommandItem
      className="cursor-pointer"
      key={item.value}
      onSelect={() => onSelect?.(item)}
    >
      {item.label}

      {/* <Highlighter
        highlightClassName="rounded-md bg-amber-300/70 px-1 py-0.5 text-foreground"
        searchWords={searchValue.trim().split(" ")}
        autoEscape
        textToHighlight={item.label.toString()}
      /> */}
    </CommandItem>
  );

  return (
    <Command
      className="overflow-hidden flex flex-col"
      filter={(value, _) =>
        value.toLowerCase().includes(searchValue.toLowerCase()) ? 1 : 0
      }
    >
      <CommandInput
        value={searchValue}
        onValueChange={setSearchValue}
        className="placeholder:Capitalize h-10 border-0 sticky top-0 z-10 bg-background"
        placeholder="Search..."
      />
      <CommandList className="overflow-auto">
        <div
          className={cn(
            "py-6 capitalize text-center hidden",
            isEmpty && "block"
          )}
        >
          empty
        </div>
        <CommandGroup>{items.map(getItemList)}</CommandGroup>
      </CommandList>
      <div className="border-t p-2 bg-background sticky bottom-0 z-10">
        <div className="flex gap-2">
          <Badge className="max-w-max">
            {searchValue.length > 0
              ? `${searchResults.length} of ${items.length}`
              : items.length}
          </Badge>
          <div
            className={cn(
              "flex flex-1 gap-2",
              (searchValue.length > 0 || items.length < 1) && "hidden"
            )}
          >
            <span
              onClick={selectAll}
              className="relative flex justify-center gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer flex-1 text-center capitalize hover:bg-muted"
            >
              {selectedTab === "remove" ? "remove all" : "add all"}
            </span>
            <Separator orientation="vertical" className="h-full" />
          </div>
          <span
            onClick={onClose}
            className="relative flex justify-center gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer flex-1 text-center capitalize hover:bg-muted"
          >
            close
          </span>
        </div>
      </div>
    </Command>
  );
}

export default MultiSelectCommand;
