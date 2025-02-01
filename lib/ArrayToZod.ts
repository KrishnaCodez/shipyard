import { MagicField } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const ArrayToZodResolver = (fields: MagicField[]) => {
  const fieldsObject = fields.reduce(
    (obj, field) => ({
      ...obj,
      [field.config.name]: field.config.validation,
    }),
    {}
  );

  const zodSchema = z.object(fieldsObject);

  return zodResolver(zodSchema);
};
