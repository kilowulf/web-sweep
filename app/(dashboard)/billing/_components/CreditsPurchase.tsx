/**
 * CreditsPurchase Component
 *
 * Overview:
 * This component provides a user interface for purchasing credits.
 * It displays a list of available credit packages using radio buttons,
 * allowing users to select a package and then submit a purchase request.
 *
 * Key Functions and Variables:
 * - CreditsPack: An array of available credit packages, including details such as id, name, label, and price.
 * - PackId: An enumeration of credit pack IDs, with a default selection (PackId.MEDIUM).
 * - useState: React hook used to manage the selected credit pack state.
 * - useMutation: React Query hook used to handle the asynchronous purchase operation by invoking the PurchaseCredits function.
 * - PurchaseCredits: Function responsible for processing the credit purchase.
 *
 * How It Works:
 * - The component maintains the state of the currently selected credit pack.
 * - It renders a radio group where each credit package is displayed with its name, label, and formatted price.
 * - Selecting a package updates the state.
 * - The "Purchase credits" button triggers a mutation to initiate the purchase process.
 * - The button is disabled while the purchase request is pending.
 *
 *  */

"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CoinsIcon, CreditCard } from "lucide-react";
import { CreditsPack, PackId } from "@/types/billing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PurchaseCredits } from "@/actions/billing/purchaseCredits";

export default function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);
  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {},
    onError: () => {}
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon className="h-6 w-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPack.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex justify-between w-full cursor-pointer">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  $ {(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="">
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(selectedPack)}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Purchase credits
        </Button>
      </CardFooter>
    </Card>
  );
}
