"use client";
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelectFieldProps, optionType } from "@/utils/types";

const MultiSelectCommand = (props: MultiSelectFieldProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [availableOptions, setAvailableOptions] = React.useState<optionType[]>(
    []
  );

  // Fetch options
  React.useEffect(() => {
    const loadOptions = async () => {
      if (typeof props.options === "function") {
        const options = await props.options();
        setAvailableOptions(options);
      }
    };
    loadOptions();
  }, [props.options]);

  // Handle conditional options
  React.useEffect(() => {
    if (props.conditionalOptions && props.form) {
      const watchField = props.form.watch(props.conditionalOptions.fieldName);
      const fetchOptions = async () => {
        const options = await props.conditionalOptions?.fn(watchField);
        setAvailableOptions(options || []);
      };
      fetchOptions();
    }
  }, [props.form?.watch, props.conditionalOptions]);

  const handleSelect = (value: string) => {
    const newValues = [...(props.value || []), value];
    props.onChange?.(newValues);
  };

  const handleRemove = (value: string) => {
    const newValues = (props.value || []).filter((v) => v !== value);
    props.onChange?.(newValues);
  };

  const selectedTags = (props.value || [])
    .map((value) => availableOptions.find((opt) => opt.value === value))
    .filter(Boolean) as optionType[];

  const unselectedTags = availableOptions.filter(
    (opt) => !props.value?.includes(opt.value)
  );

  return (
    <FormField
      control={props.control}
      name={props.name as string}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", props.className)}>
          <FormLabel className={cn(props.labelClassName)}>
            {props.label}
          </FormLabel>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-background"
              >
                <div className="flex flex-wrap gap-2">
                  {selectedTags.length > 0 ? (
                    selectedTags.map((tag) => (
                      <motion.div
                        key={tag.value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 pr-1 w-fit"
                        >
                          <span>{tag.label}</span>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(tag.value);
                            }}
                          />
                        </Badge>
                      </motion.div>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      {props.placeholder || "Select options..."}
                    </span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
              <div className="grid grid-cols-2 gap-2">
                {unselectedTags.map((option) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-8 text-sm justify-start"
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MultiSelectCommand;
