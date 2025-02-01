import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { string, z, ZodEnum, ZodNativeEnum, ZodNumber, ZodString } from "zod";

// Create a type for the roles
export type Roles = "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

export type ValidationType = ZodString | ZodNumber | ZodEnum | ZodNativeEnum;
export type CommonConfig = {
  label: string;
  placeholder?: string;
  className?: string;
  cns?: {
    label?: string;
    input?: string;
    formItem?: string;
    container?: string;
  };
  divclassName?: string;
  labelClassName?: string;
  onClick?: (e: any) => void;
  readonly name: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  defaultValue?: string;
  validation: ValidationType;
};

type InputConfig = {
  type: HTMLInputTypeAttribute;
  fileRef?: any;
};

export type MagicFieldInput = {
  type: "input";
  config: CommonConfig & InputConfig;
};

export type CommandSelectConfig = {
  options: () => optionType[] | Promise<optionType[]>;
  conditionalOptions?: {
    fieldName: string;
    fn: (data: string) => optionType[] | Promise<optionType[]>;
  };
};

export type SelectConfig = {
  // options: () => Promise<OptionType[]> | OptionType[];
  // conditionalOptions?: {
  //   fieldName: string;
  //   fn: (data: string) => optionType[] | Promise<optionType[]>;
  // };
  options: () => optionType[] | Promise<optionType[]>;
  conditionalOptions?: {
    fieldName: string;
    fn: (data: string) => optionType[] | Promise<optionType[]>;
  };
};

export type MagicFieldSelect = {
  type: "select";
  config: CommonConfig & SelectConfig;
};

export type TextAreaConfig = {
  cols: number;
  rows: number;
};

export type MagicFieldTextArea = {
  type: "textarea";
  config: CommonConfig & TextAreaConfig;
};

export type MagicField = Readonly<
  (MagicFieldSelect | MagicFieldInput | MagicFieldTextArea) & {
    RenderComponent: RenderComponent;
  }
>;

export type TypeWithRenderField<T> = T & {
  control: Control<z.infer<FormSchema>>;
  form?: {
    getValues: UseFormGetValues<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
  };
};

export type InputFieldProps = Partial<
  TypeWithRenderField<MagicFieldInput["config"]>
>;

export type SelectFieldProps = Partial<
  TypeWithRenderField<MagicFieldSelect["config"]>
>;

export type TextAreaFieldProps = Partial<
  TypeWithRenderField<MagicFieldTextArea["config"]>
>;

export type InputFieldRenderComponent =
  React.FunctionComponent<InputFieldProps>;

export type SelectFieldRenderComponent =
  React.FunctionComponent<SelectFieldProps>;

export type TextAreaFieldRenderComponent =
  React.FunctionComponent<TextAreaFieldProps>;

export type RenderComponent =
  | InputFieldRenderComponent
  | SelectFieldRenderComponent
  | TextAreaFieldRenderComponent;

export type optionType = { value: string; label: string | ReactNode };
