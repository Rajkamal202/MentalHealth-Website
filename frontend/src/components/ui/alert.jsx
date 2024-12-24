"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export function Alert({ children }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Open Alert
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content className="fixed inset-0 m-auto max-w-md rounded bg-white p-6 shadow-lg">
          {children}
          <AlertDialog.Action asChild>
            <button className="mt-4 bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600">
              Close
            </button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export function AlertTitle({ children }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function AlertDescription({ children }) {
  return <p className="text-sm text-gray-600">{children}</p>;
}

