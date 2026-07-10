import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PayrollSettings } from "./PayrollSettings";

export const PayrollSettingsModal = ({ roleSalaries, mutate }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Payroll settings"
        >
          <Calculator className="h-4 w-4" />
          <span className="sr-only">Open payroll settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Payroll settings
          </DialogTitle>
          <DialogDescription>
            Configure salary settings for different roles in your organization.
          </DialogDescription>
        </DialogHeader>
        <PayrollSettings
          roleSalaries={roleSalaries}
          mutate={mutate}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};