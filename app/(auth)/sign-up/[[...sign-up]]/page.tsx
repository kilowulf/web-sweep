import { SignUp } from "@clerk/nextjs";

/**
 * This is the main page component for the sign-up feature.
 * It renders the Clerk SignUp component, which handles user sign-up functionality.
 *
 * @returns {JSX.Element} - The JSX element representing the sign-up page.
 */
export default function Page() {
  return <SignUp />;
}

