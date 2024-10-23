import { ReactNode, useState } from "react";
import { Dialog, DialogBackdrop } from "@headlessui/react";

interface ModalProps {
  children: ReactNode;
}
export default function Modal({ children }: ModalProps) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onClose={setOpen} className="fixed inset-0 z-[1004]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {children}
        </div>
      </div>
    </Dialog>
  );
}
