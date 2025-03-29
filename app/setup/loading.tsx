import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";

/**
 * Loading Component.
 *
 * Renders a loading screen UI for account setup. This component displays a logo,
 * a separator, and a spinning loader icon accompanied by a status message.
 *
 * @returns {JSX.Element} The loading screen component.
 */
export default function loading() {
  return (
    <div className="h--screen w-full flex flex-col items-center justify-center gap-4">
      {/* Logo component with specified icon and font sizes */}
      <Logo iconSize={50} fontSize="text-3xl" />
      {/* Visual separator */}
      <Separator className="max-w-xs" />
      {/* Loader section with a spinning icon and status message */}
      <div className="flex items-center gap-2 justify-center">
        <Loader2Icon size={16} className="animate-spin stroke-primary" />
        <p className="text-muted-foreground">Account setup</p>
      </div>
    </div>
  );
}
