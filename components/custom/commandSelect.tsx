"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectFieldProps, optionType } from "@/utils/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const CommandSelect = (props: SelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<optionType[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const conditionalValue = props.conditionalOptions
    ? props.form?.watch(props.conditionalOptions.fieldName)
    : "";

  useEffect(() => {
    const loadData = async () => {
      if (!props?.options) return;
      try {
        const options = await props.options();
        setData(
          options.length
            ? options
            : [{ label: `No ${props.label} Found`, value: " " }]
        );
      } catch (error) {
        console.error(error);
        setData([{ label: `Error loading ${props.label}`, value: " " }]);
      }
      setIsFetchingData(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadConditionalData = async () => {
      if (!props.conditionalOptions) return;
      setIsFetchingData(true);
      try {
        const options = await props.conditionalOptions.fn(
          props.form?.getValues(props.conditionalOptions.fieldName)
        );
        const currentValue = props.form?.getValues(props.name ?? "");
        if (!options.find((option) => option.value === currentValue)) {
          props.form?.setValue(props.name, undefined);
        }
        setData(
          options.length
            ? options
            : [{ label: `No ${props.label} Found`, value: " " }]
        );
      } catch (error) {
        console.error(error);
        setData([{ label: `Error loading ${props.label}`, value: " " }]);
      }
      setIsFetchingData(false);
    };
    loadConditionalData();
  }, [conditionalValue]);

  return (
    <FormField
      control={props.control}
      name={props.name as any}
      render={({ field }) => (
        <FormItem
          className={cn(
            props.className,
            props.cns?.container,
            props.cns?.formItem
          )}
        >
          <FormLabel className={cn(props?.cns?.label)}>{props.label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={props.disabled}
                  className={cn(
                    "w-full justify-between font-normal",
                    props.cns?.input
                  )}
                >
                  <span
                    className={cn(
                      "truncate",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? data.find((item) => item.value === field.value)?.label
                      : props.placeholder}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={`Search ${props.label}...`} />
                  <CommandList>
                    <CommandEmpty>No {props.label} found.</CommandEmpty>
                    <CommandGroup>
                      {isFetchingData ? (
                        <CommandItem>Loading...</CommandItem>
                      ) : (
                        data.map((item) => (
                          <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={(currentValue) => {
                              field.onChange(
                                currentValue === field.value ? "" : currentValue
                              );
                              props.onChange?.(currentValue);
                              setOpen(false);
                            }}
                          >
                            {item.label}
                            {field.value === item.value && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommandSelect;
