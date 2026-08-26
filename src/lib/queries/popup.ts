import { prisma } from "@/lib/prisma";

export type PopupData = {
  active: boolean;
  title: string;
  content: string;
  delaySeconds: number;
  updatedAt: Date;
};

export async function getPopup(): Promise<PopupData | null> {
  try {
    return await prisma.popup.findUnique({ where: { id: "default" } });
  } catch {
    return null;
  }
}

/** Only returns the popup when it is switched on and actually has text. */
export async function getActivePopup(): Promise<PopupData | null> {
  const popup = await getPopup();
  if (!popup || !popup.active) return null;
  if (!popup.title.trim() && !popup.content.trim()) return null;
  return popup;
}
