"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import z from "zod";

// const formSchema = z.object({
//
// })

export default function ProjectForm() {
  const { control, handleSubmit } = useForm({
    // resolver: zodResolver(),
  });

  return (
    <form>
      <FieldGroup>
        <Controller
          name="pname"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="pname"
                aria-invalid={fieldState.invalid}
                placeholder="Project name"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Other Controllers goes here. */}
      </FieldGroup>
    </form>
  );
}
