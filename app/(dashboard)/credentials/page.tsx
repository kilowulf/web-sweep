import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialDialog from "@/app/(dashboard)/credentials/_components/CreateCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "@/app/(dashboard)/credentials/_components/DeleteCredentialDialog";

/**
 * Credentials Component.
 *
 * Renders the main credentials management page including the header, encryption alert,
 * and the list of user credentials fetched asynchronously. Also provides a dialog for creating
 * new credentials.
 *
 * @component
 * @returns {JSX.Element} The credentials management interface.
 */
export default function Credentials() {
  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Header Section with page title and credential creation button */}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        {/* Button that triggers the Create Credential Dialog */}
        <CreateCredentialDialog />
      </div>
      <div className="h-full py-6 space-y-8">
        {/* Alert to inform the user that data is securely encrypted */}
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe
          </AlertDescription>
        </Alert>
        {/* Suspense component handles the loading state while credentials are being fetched */}
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Async UserCredentials Component.
 *
 * Fetches the list of credentials for the current user using the GetCredentialsForUser action.
 * - If no credentials data is returned, displays a "Credentials not found" message.
 * - If the user has no credentials, displays a card with a prompt to create a new credential.
 * - Otherwise, maps over the credentials and renders each one in a Card component with details
 *   like the credential name, relative creation time, and a delete action dialog.
 *
 * @async
 * @function
 * @returns {Promise<JSX.Element>} The rendered list of user credentials or appropriate messaging if none exist.
 */
async function UserCredentials() {
  // Fetch user credentials.
  const credentials = await GetCredentialsForUser();

  // Display a message if credentials data is not available.
  if (!credentials) {
    return <div>Credentials not found</div>;
  }

  // If the user has no credentials, prompt them to create their first credential.
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created.</p>
            <p className="text-sm text-muted-foreground">
              Click the link button below to create your first credential.
            </p>
          </div>
          {/* Render the Create Credential Dialog with a custom trigger message */}
          <CreateCredentialDialog triggerText="Create your first credential." />
        </div>
      </Card>
    );
  }

  // If credentials exist, render each credential in a Card component.
  return (
    <div>
      {credentials.map((credential) => {
        // Format the creation time to a human-readable relative time (e.g., "2 days ago").
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true
        });
        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className="flex gap-2 items-center">
              {/* Icon representing the credential */}
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>
              <div>
                {/* Display credential name */}
                <p className="font-bold">{credential.name}</p>
                {/* Display the relative creation time */}
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            {/* Render the Delete Credential Dialog for this credential */}
            <DeleteCredentialDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}
