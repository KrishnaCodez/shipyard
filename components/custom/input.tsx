import React from "react";
import { Input } from "../ui/input";
import { InputFieldProps } from "@/utils/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const CustomInput = (props: InputFieldProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name as string}
      render={({ field }) => {
        const { value, ...restField } = field;
        const hasBefore = !!props.beforeInput;
        const hasAfter = !!props.afterInput;

        return (
          <FormItem className={cn("space-y-2", props.containerClassName)}>
            {props.label && (
              <FormLabel className={cn(props.labelClassName)}>
                {props.label}
              </FormLabel>
            )}

            <div className="relative">
              {props.beforeInput && (
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  {props.beforeInput}
                </div>
              )}

              <Input
                {...field}
                disabled={props.disabled}
                className={cn(
                  props.className,
                  hasBefore && "ps-9",
                  hasAfter && "pe-9"
                )}
                placeholder={props.placeholder}
                type={props.type}
                value={props.type === "file" ? undefined : (value ?? "")}
                onClick={props.onClick}
                onChange={(e) => {
                  props.onChange?.(e);
                  if (props.type === "number") {
                    field.onChange(e.currentTarget.valueAsNumber);
                  } else if (props.type === "file") {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    field.onChange(files); // Pass the array of File objects
                  } else {
                    field.onChange(e.currentTarget.value);
                  }
                }}
              />

              {props.afterInput && (
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  {props.afterInput}
                </div>
              )}
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CustomInput;
