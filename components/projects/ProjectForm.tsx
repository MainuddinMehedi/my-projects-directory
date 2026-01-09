"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// TODO: you can keep two choices. either a complete project or a project that i just started. in this case i won't have many detailed info about it. So i have to make some features optional. a checkbox to opt into that mode.

// This schema should be based on mongoose model as i will be adding project according to these two schema.
// This schema to validate the client side and mongoose model is to validate the server side. or before saving it in the database.
const formSchema = z.object({
  pname: z.string(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  thumbnail: z.string(),
  gallery: z.string().optional(),
  repoLink: z.string(),
  siteUrl: z.string().optional(),
  tags: z.string().optional(),
  technologies: z.string(),
  details: z.string().optional(),
  problemStatement: z.string().optional(),
  devStatus: z.enum([
    "Planned",
    "In Progress",
    "Completed",
    "On Hold",
    "Abandoned",
  ]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export default function ProjectForm() {
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pname: "",
      description: "",
      thumbnail: "",
      gallery: "",
      repoLink: "",
      siteUrl: "",
      tags: "",
      technologies: "",
      details: "",
      problemStatement: "",
      devStatus: "In Progress",
      startDate: "",
      endDate: "",
    },
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
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder="Project description"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="thumbnail"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="thumbnail"
                aria-invalid={fieldState.invalid}
                placeholder="Thumbnail"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="gallery"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="gallery"
                aria-invalid={fieldState.invalid}
                placeholder="More images"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="repoLink"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="repoLink"
                aria-invalid={fieldState.invalid}
                placeholder="Github repo link"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="siteUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="siteUrl"
                aria-invalid={fieldState.invalid}
                placeholder="Site url"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="tags"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="tags"
                aria-invalid={fieldState.invalid}
                placeholder="Relevant tags"
                // autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="technologies"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="technologies"
                aria-invalid={fieldState.invalid}
                placeholder="Relevant technologies"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Field>
        <Controller
          name="details"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="details"
                aria-invalid={fieldState.invalid}
                placeholder="Detailed description of the project."
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </Field>

      <Field>
        <Controller
          name="problemStatement"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="problemStatement"
                aria-invalid={fieldState.invalid}
                placeholder="Notable difficulties faced and fixed."
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </Field>

      <FieldGroup>
        <Controller
          name="devStatus"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Abandoned">Abandoned</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="startDate"
                aria-invalid={fieldState.invalid}
                placeholder="Start Date"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="endDate"
                aria-invalid={fieldState.invalid}
                placeholder="End Date"
                autoComplete="off"
                className=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
