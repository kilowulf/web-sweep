import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  CodeIcon,
  DatabaseIcon,
  FileJson2Icon,
  GlobeIcon,
  LucideProps,
  MousePointerClick,
  TextIcon
} from "lucide-react";

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add property to JSON",
  icon: (props: LucideProps) => (
    <DatabaseIcon className="stroke-orange-600" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Property name",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Property value",
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [{ name: "Updated JSON", type: TaskParamType.STRING }] as const
} satisfies WorkflowTask;
