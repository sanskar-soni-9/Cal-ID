export const getContactInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type CreateAvailabilityShareLinkInput = {
  bookerUrl: string;
  eventSlug: string;
  username?: string | null;
  teamSlug?: string | null;
  isOrgTeam?: boolean;
};

export const createAvailabilityShareLink = ({
  bookerUrl,
  eventSlug,
  username,
  teamSlug,
  isOrgTeam = false,
}: CreateAvailabilityShareLinkInput) => {
  const normalizedBookerUrl = bookerUrl.replace(/\/+$/, "");
  const ownerPath = teamSlug ? (isOrgTeam ? teamSlug : `team/${teamSlug}`) : username ? username : null;

  if (!ownerPath || !eventSlug) {
    return "";
  }

  return `${normalizedBookerUrl}/${ownerPath}/${eventSlug}`;
};
