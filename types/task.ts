/**
 * TaskType enum.
 *
 * Enumerates the possible types of tasks that can be part of a workflow.
 */
export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
  READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
  ADD_PROPERTY_TO_JSON = "ADD_PROPERTY_TO_JSON",
  NAVIGATE_URL = "NAVIGATE_URL",
  SCROLL_TO_ELEMENT = "SCROLL_TO_ELEMENT"
}

/**
 * TaskParamType enum.
 *
 * Enumerates the types of parameters that can be used as inputs or outputs in a task.
 */
export enum TaskParamType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
  SELECT = "SELECT",
  CREDENTIAL = "CREDENTIAL"
}

/**
 * TaskParam interface.
 *
 * Describes a parameter for a task including its name, type, and optional properties.
 *
 * @property {string} name - The name of the parameter.
 * @property {TaskParamType} type - The type of the parameter.
 * @property {string} [helperText] - Optional helper text providing additional context for the parameter.
 * @property {boolean} [required] - Indicates whether the parameter is required.
 * @property {boolean} [hideHandle] - If true, the parameter's handle should be hidden in the UI.
 * @property {string} [value] - Optional default or initial value of the parameter.
 * @property {any} [key: string] - Allows for additional properties.
 */
export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  value?: string;
  [key: string]: any;
}
