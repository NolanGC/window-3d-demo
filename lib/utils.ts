import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NewCreation } from "./drizzle"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadCreation(creation : NewCreation) {
  const response = await fetch("/api/creations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creation),
  });
  const insertedCreation = await response.json();
  return insertedCreation;
}

export function getWindowToast() {
  
}