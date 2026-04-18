import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import type { TeamMember } from "@/modules/actions/domain/entities";

export interface TecnicoTeamMemberViewModel {
  id: string;
  nameLabel: string;
  roleLabel: string;
  profileTag: string;
  isCurrentUser: boolean;
  isManager: boolean;
}

export interface TecnicoTeamViewModel {
  members: TecnicoTeamMemberViewModel[];
}

interface GetTecnicoTeamOptions {
  currentUser?: {
    name?: string;
    jobTitle?: string;
    profileTag?: string;
  };
}

function normalizeValue(value: string | undefined) {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function createFallbackProfileTag(name: string) {
  const alphanumeric = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return `#${alphanumeric.slice(0, 6).padEnd(6, "0")}`;
}

function createCurrentUserMember(
  currentUser: NonNullable<GetTecnicoTeamOptions["currentUser"]>,
  existingMember?: TeamMember,
): TeamMember {
  return {
    id: existingMember?.id ?? "team-current-user",
    name: currentUser.name ?? existingMember?.name ?? "Técnico",
    jobTitle: currentUser.jobTitle?.trim() || existingMember?.jobTitle || "Técnico de campo",
    profileTag: (currentUser.profileTag ?? existingMember?.profileTag ?? createFallbackProfileTag(currentUser.name ?? "Tecnico")).toUpperCase(),
    role: "tecnico",
    isHighlighted: existingMember?.isHighlighted,
  };
}

export async function getTecnicoTeam(
  repository: ActionRepository,
  { currentUser }: GetTecnicoTeamOptions = {},
): Promise<TecnicoTeamViewModel> {
  const baseMembers = await repository.listTeamMembers();
  const normalizedUserName = normalizeValue(currentUser?.name);
  const normalizedUserTag = normalizeValue(currentUser?.profileTag);

  const currentUserIndex = baseMembers.findIndex(
    (member) => normalizeValue(member.profileTag) === normalizedUserTag || normalizeValue(member.name) === normalizedUserName,
  );

  const members = [...baseMembers];

  if (currentUser?.name || currentUser?.profileTag) {
    const currentUserMember = createCurrentUserMember(
      currentUser,
      currentUserIndex >= 0 ? members[currentUserIndex] : undefined,
    );

    if (currentUserIndex >= 0) {
      members[currentUserIndex] = currentUserMember;
    } else {
      const highlightIndex = members.findIndex((member) => member.isHighlighted);
      const insertIndex = highlightIndex >= 0 ? highlightIndex + 1 : 0;
      members.splice(insertIndex, 0, currentUserMember);
    }
  }

  const viewMembers = members.map((member) => {
    const isCurrentUser = Boolean(
      (normalizedUserTag && normalizeValue(member.profileTag) === normalizedUserTag) ||
        (normalizedUserName && normalizeValue(member.name) === normalizedUserName),
    );

    return {
      id: member.id,
      nameLabel: isCurrentUser ? `${member.name} (Você)` : member.name,
      roleLabel: member.role === "gestor" ? "Gestor(a)" : member.jobTitle,
      profileTag: member.profileTag,
      isCurrentUser,
      isManager: member.role === "gestor" || Boolean(member.isHighlighted),
    } satisfies TecnicoTeamMemberViewModel;
  });

  return {
    members: viewMembers,
  };
}