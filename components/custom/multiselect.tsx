"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { MultiSelectFieldProps, optionType } from "@/utils/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const CustomMultiSelect: React.FC<MultiSelectFieldProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<optionType[]>([]);
  const [options, setOptions] = useState<optionType[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);
  const popoverContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState("100%");

  useEffect(() => {
    const fetchOptions = async () => {
      if (!props.options) return;

      setIsFetchingData(true);
      try {
        const fetchedOptions = await props.options();
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([{ label: `No ${props.label} Found`, value: " " }]);
      }
      setIsFetchingData(false);
    };

    fetchOptions();
  }, [props.options, props.label]);

  useEffect(() => {
    if (selectedContainerRef.current) {
      selectedContainerRef.current.scrollTo({
        left: selectedContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedContainerRef]); // Removed unnecessary dependency: selected

  useEffect(() => {
    if (open && selectedContainerRef.current) {
      setContainerWidth(`${selectedContainerRef.current.offsetWidth}px`);
    }
  }, [open]);

  return (
    <FormField
      control={props.control}
      name={props.name as any}
      render={({ field }) => {
        useEffect(() => {
          // Set initial selected values
          const initialValues = field.value || [];
          const initialSelected = options.filter((option) =>
            initialValues.includes(option.value)
          );
          setSelected(initialSelected);
        }, [field.value, options]);

        const handleSelect = (item: optionType) => {
          if (props.maxSelections && selected.length >= props.maxSelections) {
            return;
          }
          const updatedSelected = [...selected, item];
          setSelected(updatedSelected);
          const updatedValues = updatedSelected.map((s) => s.value);
          props.onChange?.(updatedValues);
          field.onChange(updatedValues);
        };

        const handleRemove = (item: optionType) => {
          const updatedSelected = selected.filter(
            (i) => i.value !== item.value
          );
          setSelected(updatedSelected);
          const updatedValues = updatedSelected.map((s) => s.value);
          props.onChange?.(updatedValues);
          field.onChange(updatedValues);

          // Close popover if no tags are left

          if (updatedSelected.length === 0) {
            setOpen(false);
          }
        };

        return (
          <FormItem className={cn("space-y-2", props.cns?.container)}>
            {props.label && (
              <FormLabel className={cn(props.cns?.label)}>
                {props.label}
              </FormLabel>
            )}
            <FormControl>
              <div className=" w-full">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild className="w-full ">
                    <div
                      className={cn(
                        "w-full flex items-center justify-start gap-1.5 h-10  rounded-md border border-input bg-background p-1 text-base ring-offset-background  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm no-scrollbar cursor-pointer",
                        "overflow-x-auto no-scrollbar",
                        props.cns?.formItem
                      )}
                      style={{
                        borderRadius: 8,
                        width: inputRef.current
                          ? inputRef.current.offsetWidth
                          : "100%",
                      }}
                      ref={selectedContainerRef}
                      // layout
                    >
                      {selected.length === 0 && (
                        <span className="text-muted-foreground pl-2">
                          {props.placeholder}
                        </span>
                      )}
                      {selected.map((item) => (
                        <div
                          key={item.value}
                          className="flex items-center gap-1 pl-3 pr-1 py-1
                        bg-white shadow-sm border h-full shrink-0"
                          style={{ borderRadius: 6 }}
                          // layoutId={`tag-${item.value}`}
                        >
                          <span
                            // layoutId={`tag-${item.value}-label`}
                            className="text-gray-700 font-medium"
                          >
                            {item.label}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Added stop propagation
                              handleRemove(item);
                            }}
                            className="p-1 rounded-full"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    forceMount
                    className="w-full custom-popover-content p-0"
                    align="start"
                    // style={{
                    //   width: "100%",
                    // }}

                    style={{
                      width: containerWidth,
                      maxWidth: "none", // Disable default max-width
                    }}
                    data-custom="multiselect"
                  >
                    <div
                      className="bg-white shadow-sm p-2 border w-full"
                      style={{ borderRadius: 8 }}
                    >
                      <div className="flex flex-wrap gap-2 w-full">
                        {isFetchingData ? (
                          <div className="w-full flex p-3 justify-center items-center">
                            Loading...
                          </div>
                        ) : options.length === 0 ? (
                          <div className="w-full flex p-3 justify-center items-center">
                            No {props.label} left
                          </div>
                        ) : (
                          options
                            .filter(
                              (option) =>
                                !selected.some((s) => s.value === option.value)
                            )
                            .map((option) => (
                              <button
                                key={option.value}
                                // layoutId={`tag-${option.value}`}
                                className="flex items-center gap-1 px-4 py-2.5 bg-gray-100/60 rounded-full shrink-0"
                                onClick={() => handleSelect(option)}
                                style={{ borderRadius: 14 }}
                              >
                                <span
                                  // layoutId={`tag-${option.value}-label`}
                                  className="text-gray-700 font-medium"
                                >
                                  {option.label}
                                </span>
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
