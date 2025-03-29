import { TaskParamType } from "@/types/task";

/**
 * ColorForHandle maps each TaskParamType to a specific CSS background color class.
 *
 * This record is used to style handles (or nodes) based on their parameter type,
 * ensuring that each type has a consistent and visually distinct background color.
 *
 * @type {Record<TaskParamType, string>}
 */
export const ColorForHandle: Record<TaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400",
  SELECT: "!bg-rose-400",
  CREDENTIAL: "!bg-teal-400"
};
