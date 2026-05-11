import z from "zod";

const schema = z.object({
  success: z.boolean(),
  filename: z.string(),
  size: z.number(),
  content_type: z.string(),
  saved_path: z.string(),
});

export const parseDBFUploadResponse = (data: unknown) => {
  return schema.parse(data);
};

export type DBFUploadResponse = z.infer<typeof schema>;

const fileExistSchema = z.object({
  Tglobal: z.boolean(),
  Gunits: z.boolean(),
  Gattacks: z.boolean(),
});

export const parseFileExistResponse = (data: unknown) => {
  return fileExistSchema.parse(data);
};

export type FileExistResponse = z.infer<typeof fileExistSchema>;
