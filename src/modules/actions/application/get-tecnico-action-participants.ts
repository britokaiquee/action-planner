import type { ActionRepository } from "@/modules/actions/domain/action-repository";
import type { TeamMember } from "@/modules/actions/domain/entities";

export interface TecnicoActionParticipantsMemberViewModel {
  id: string;
  nameLabel: string;
  roleLabel: string;
  profileTag: string;
  isCurrentUser: boolean;
  isManager: boolean;
}

export interface TecnicoActionParticipantsViewModel {
  actionTitle: string;
  members: TecnicoActionParticipantsMemberViewModel[];
}

interface GetTecnicoActionParticipantsOptions {
  actionId: string;
  currentUser?: {
    name?: string;
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

function toViewModel(
  member: TeamMember,
  options: {
    normalizedUserName: string;
    normalizedUserTag: string;
    isManager?: boolean;
  },
) {
  const isCurrentUser = Boolean(
    (options.normalizedUserTag && normalizeValue(member.profileTag) === options.normalizedUserTag) ||
      (options.normalizedUserName && normalizeValue(member.name) === options.normalizedUserName),
  );

  return {
    id: member.id,
    nameLabel: isCurrentUser ? `${member.name} (Você)` : member.name,
    roleLabel: member.role === "gestor" ? member.jobTitle : member.jobTitle,
    profileTag: member.profileTag,
    isCurrentUser,
    isManager: Boolean(options.isManager ?? (member.role === "gestor" || member.isHighlighted)),
  } satisfies TecnicoActionParticipantsMemberViewModel;
}

export async function getTecnicoActionParticipants(
  repository: ActionRepository,
  { actionId, currentUser }: GetTecnicoActionParticipantsOptions,
): Promise<TecnicoActionParticipantsViewModel | null> {
  const [action, teamMembers] = await Promise.all([repository.getActionById(actionId), repository.listTeamMembers()]);

  if (!action) {
    return null;
  }

  const normalizedUserName = normalizeValue(currentUser?.name);
  const normalizedUserTag = normalizeValue(currentUser?.profileTag);
  const technicianNames = new Set(action.technicians.map((technician) => normalizeValue(technician.name)));

  const manager = action.createdByTeamMemberId
    ? teamMembers.find((member) => member.id === action.createdByTeamMemberId)
    : teamMembers.find((member) => member.role === "gestor" && member.isHighlighted);

  const technicians = teamMembers.filter(
    (member) => member.role === "tecnico" && technicianNames.has(normalizeValue(member.name)),
  );

  const members = [
    ...(manager ? [toViewModel(manager, { normalizedUserName, normalizedUserTag, isManager: true })] : []),
    ...technicians.map((member) => toViewModel(member, { normalizedUserName, normalizedUserTag })),
  ];

  return {
    actionTitle: action.title,
    members,
  };
}