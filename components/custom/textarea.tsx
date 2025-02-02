import React from "react";
import { TextAreaFieldProps } from "@/utils/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const CustomTextArea = (props: TextAreaFieldProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name as any}
      render={(renderField) => {
        const { field } = renderField;
        return (
          <div className={cn("space-y-2 ", props.className)}>
            <FormItem>
              <FormLabel>{props.label}</FormLabel>
              <Textarea
                {...field}
                cols={props.cols}
                rows={props.rows}
                disabled={props.disabled}
                placeholder={props.placeholder}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          </div>
        );
      }}
    />
  );
};

export default CustomTextArea;
