import { optionType, SelectFieldProps } from "@/utils/types";
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

const SelectCommand = (props: SelectFieldProps) => {
  const [data, setData] = useState<optionType[]>([]);
  const [open, setOpen] = useState(false);

  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const conditionalValue = props.conditionalOptions
    ? props.form?.watch(props.conditionalOptions.fieldName)
    : "";
  useEffect(() => {
    (async () => {
      if (!props?.options) return () => {};
      let options: optionType[] = [];
      try {
        options = await props.options();
      } catch (error) {
        // toast.error(beautifyBackendError(errorHandler(error)).ErrorMessage);
      }
      if (options.length === 0) {
        setData([{ label: `No ${props.name} Found`, value: " " }]);
        setIsFetchingData(false);
        return () => {};
      }
      setData(options);
      setIsFetchingData(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!props.conditionalOptions) return () => {};
      setIsFetchingData(true);

      const options = await props.conditionalOptions.fn(
        props.form?.getValues(props.conditionalOptions.fieldName)
      );
      const getCurrentValue = props.form?.getValues(props.name ?? "");
      if (!options.find((option: any) => option.value === getCurrentValue)) {
        props.form?.setValue(props.name, undefined);
      }
      if (!Array.isArray(options)) {
        console.error("props.options() did not return an array");
        setData([{ label: `No ${props.label} Found`, value: " " }]);
        return () => {};
      }
      if (options.length === 0) {
        setData([{ label: `No ${props.label} Found`, value: " " }]);
        setIsFetchingData(false);
        return () => {};
      }
      setData(options);
      setIsFetchingData(false);
    })();
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

export default SelectCommand;
