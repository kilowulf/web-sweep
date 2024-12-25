import { ReactNode } from "react";

//  timeestamp; 2:26:34
export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({ input }: { input: any }) {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      {input.name}
    </div>
  );
}
