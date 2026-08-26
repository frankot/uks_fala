import { getActivePopup } from "@/lib/queries/popup";
import PopupModal from "./PopupModal";

export default async function SitePopup() {
  const popup = await getActivePopup();
  if (!popup) return null;

  return (
    <PopupModal
      title={popup.title}
      content={popup.content}
      delaySeconds={popup.delaySeconds}
      version={new Date(popup.updatedAt).getTime().toString()}
    />
  );
}
