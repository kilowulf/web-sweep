import { SignIn } from "@clerk/nextjs";

/**
 * This is the default page component for the sign-in functionality.
 * It renders the Clerk SignIn component, which handles user authentication.
 *
 * @returns {JSX.Element} - The JSX element representing the sign-in page.
 */
export default function Page() {
  return <SignIn />;
}

