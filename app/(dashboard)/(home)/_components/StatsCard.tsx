import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

/**
 * A reusable component to display a card with a title, value, and icon.
 *
 * @param props - The properties for the StatsCard component.
 * @returns - A React component that renders a card with the given title, value, and icon.
 */
interface Props {  
  title: string;  
  value: number;  
  icon: LucideIcon;
}
export default function StatsCard(props: Props) {
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex">
        <CardTitle>{props.title}</CardTitle>
        <props.icon
          size={140}
          className="text-muted-foreground absolute -bottom-8 -right-8 stroke-primary opacity-15"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={props.value} />
        </div>
      </CardContent>
    </Card>
  );
}

