import { SetupUser } from "@/actions/billing/setupUser";

/**
 * SetupPage Component.
 *
 * This asynchronous component handles the user setup process by invoking the SetupUser action.
 * The SetupUser function is expected to perform any necessary initialization or configuration related
 * to billing or user setup, and it returns the corresponding output which is then rendered.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered output from the SetupUser function.
 */
export default async function SetupPage() {
  return await SetupUser();
}
