"use client";

import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, disabled = false }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onCheckedChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}