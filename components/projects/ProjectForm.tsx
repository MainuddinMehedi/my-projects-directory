"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import BadgeInput from "../BadgeInput";
import MarkdownEditor from "../MarkdownEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { generateSlug } from "@/utils/generateSlug";

// TODO: you can keep two choices. either a complete project or a project that i just started. in this case i won't have many detailed info about it. So i have to make some features optional. a checkbox to opt into that mode.

// This will be used when figure out how i'm gonna make the image upload work. For now i will use url of a already uploaded photo.
// const MAX_FILE_SIZE = 5000000; // 5MB
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// This schema should be based on mongoose model as i will be adding project according to these two schema.
// This schema to validate the client side and mongoose model is to validate the server side. or before saving it in the database.
const formSchema = z.object({
  pname: z.string().min(1, { message: "You must write the project name" }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .max(500, {
      message: "Description must be within 500 characters.",
    }),
  thumbnail: z.string(),
  // thumbnail: z
  //   .instanceof(File, { message: "Thumbnail is required" })
  //   .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
  //   .refine(
  //     (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
  //     "Only .jpg, .jpeg, .png and .webp formats are supported.",
  //   ),
  gallery: z.string().optional(),
  repoLink: z.string().url({ message: "Please enter a valid url" }),
  siteUrl: z.string().optional(),
  tags: z.string().optional(),
  technologies: z.string().min(1, { message: "Please list technologies used" }),
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      let slug = generateSlug(data.pname);

      const payload = {
        ...data,
        slug,
        gallery: data.gallery
          ? data.gallery.split(",").map((url) => ({ url: url.trim() }))
          : [],
        devPhase: {
          status: data.devStatus,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      };

      const url = "/api/projects";
      const method = "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7 flex flex-col justify-center items-center"
    >
      {/* projectName, description */}
      <FieldGroup>
        <Controller
          name="pname"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Name</Label>
              <Input
                {...field}
                id="pname"
                aria-invalid={fieldState.invalid}
                placeholder="Project name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Short Description</Label>
              <Textarea
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder="Brief summary..."
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* thumbnail, gallery -  */}
      <FieldGroup>
        <Controller
          name="thumbnail"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Thumbnail Image</Label>
              <Input
                {...field}
                // type="file"
                id="thumbnail"
                placeholder="/projects/image.jpg"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                Upload a thumbnail image To show in the card
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* TODO: Figure out how you would upload multiple files and reorder them */}
        <Controller
          name="gallery"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Gallery URLs</Label>
              <BadgeInput
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="url1, url2, url3"
              />

              {/* <Input */}
              {/*   {...field} */}
              {/*   // type="file" */}
              {/*   id="gallery" */}
              {/*   placeholder="url1, url2, url3" */}
              {/*   aria-invalid={fieldState.invalid} */}
              {/* /> */}
              <FieldDescription>Upload multiple images</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* repoLink, siteUrl */}
      <FieldGroup className="flex flex-row gap-2">
        <Controller
          name="repoLink"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Repository Link</Label>
              <Input
                {...field}
                id="repoLink"
                aria-invalid={fieldState.invalid}
                placeholder="https://github.com/..."
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
              <Label>Live Site Link</Label>
              <Input
                {...field}
                id="siteUrl"
                aria-invalid={fieldState.invalid}
                placeholder="https://..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Tags, tech, and devPhase */}
      {/* TODO: Calender implementation */}
      <FieldGroup className="border p-3 py-5 rounded-md mb-7">
        <h3 className="text-lg font-semibold">Development Details</h3>

        <Controller
          name="tags"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Tags</Label>
              <BadgeInput
                placeholder="Type and press Enter (e.g. Web App, Open Source)"
                value={field.value || ""}
                onChange={field.onChange}
              />

              <FieldDescription>
                General tags for categorization
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="technologies"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Label>Technologies</Label>
              <BadgeInput
                value={field.value || ""}
                placeholder="Type and press Enter (e.g. React, Next.js)"
                onChange={field.onChange}
              />
              <FieldDescription>
                Technologies used in this project.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-2">
          <Controller
            name="devStatus"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label>Status of the project</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label>StartDate</Label>
                <Input
                  {...field}
                  type="date"
                  id="startDate"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label>EndDate</Label>
                <Input
                  {...field}
                  type="date"
                  id="endDate"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      {/* problemStatement */}
      <Controller
        name="problemStatement"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label>Problem Statement</Label>
            <Textarea
              {...field}
              id="problemStatement"
              aria-invalid={fieldState.invalid}
              placeholder="Notable difficulties faced and fixed."
              autoComplete="off"
            />

            <FieldDescription>
              Any difficulties faced that you wanna mention for later. Jot them
              down here and write about it in the details section.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* details */}
      <Controller
        name="details"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Label>Project Details</Label>
            <MarkdownEditor value={field.value} onChange={field.onChange} />
          </Field>
        )}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create project"}
      </Button>

      {/* <Button type="submit" disabled={isSubmitting}> */}
      {/*   {isSubmitting */}
      {/*     ? "Saving..." */}
      {/*     : initialData */}
      {/*       ? "Update Project" */}
      {/*       : "Create Project"} */}
      {/* </Button> */}
    </form>
  );
}
