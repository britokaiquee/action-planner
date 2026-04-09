import type { ActionEntity, FormDefaults, Technician } from "@/modules/actions/domain/entities";

export const coordinatorName = "Maria Costa";
export const technicianName = "Joao Silva";

export const formDefaults: FormDefaults = {
  checkInTime: "08:00",
  checkOutTime: "17:00",
};

export const techniciansSeed: Technician[] = [
  {
    id: "tec-1",
    name: "Joao Silva",
    city: "Itabuna - BA",
    specialty: "Infraestrutura hospitalar",
    dailyCost: 550,
    participantResources: [
      { id: "pr-1", label: "Diaria", cost: 300, type: "diaria" },
      { id: "pr-2", label: "Alimentacao", cost: 90, type: "alimentacao" },
      { id: "pr-3", label: "Kit EPI", cost: 160, type: "epi" },
    ],
  },
  {
    id: "tec-2",
    name: "Maria Santos",
    city: "Ilheus - BA",
    specialty: "Instalacao eletrica",
    dailyCost: 550,
    participantResources: [
      { id: "pr-4", label: "Diaria", cost: 300, type: "diaria" },
      { id: "pr-5", label: "Alimentacao", cost: 90, type: "alimentacao" },
      { id: "pr-6", label: "Ferramentas pessoais", cost: 160, type: "ferramenta" },
    ],
  },
  {
    id: "tec-3",
    name: "Paula Reis",
    city: "Ilheus - BA",
    specialty: "Supervisao de campo",
    dailyCost: 620,
    participantResources: [
      { id: "pr-7", label: "Diaria", cost: 320, type: "diaria" },
      { id: "pr-8", label: "Alimentacao", cost: 100, type: "alimentacao" },
    ],
  },
  {
    id: "tec-4",
    name: "Carlos Lima",
    city: "Itabuna - BA",
    specialty: "Logistica operacional",
    dailyCost: 480,
    participantResources: [
      { id: "pr-9", label: "Diaria", cost: 260, type: "diaria" },
      { id: "pr-10", label: "Alimentacao", cost: 80, type: "alimentacao" },
    ],
  },
  {
    id: "tec-5",
    name: "Ana Paula",
    city: "Itabuna - BA",
    specialty: "Montagem tecnica",
    dailyCost: 510,
    participantResources: [
      { id: "pr-11", label: "Diaria", cost: 280, type: "diaria" },
      { id: "pr-12", label: "EPI adicional", cost: 120, type: "epi" },
    ],
  },
];

export const actionsSeed: ActionEntity[] = [
  {
    id: "acao-instalacao-paineis",
    title: "Instalacao de Paineis",
    description: "Deslocamento da equipe de infraestrutura para instalar paineis de chamadas dentro dos postos de saude de Itabuna.",
    city: "Itabuna - BA",
    local: "Posto de Saude Central",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    plannedStatus: "andamento",
    notes: "Priorizar check-in ate 08:15 e validar checklist de seguranca antes de iniciar a montagem.",
    technicians: techniciansSeed.slice(0, 2),
    dailyAllocations: [
      {
        technicianId: "tec-1",
        date: "2026-04-10",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "confirmado",
      },
      {
        technicianId: "tec-2",
        date: "2026-04-10",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "confirmado",
      },
      {
        technicianId: "tec-2",
        date: "2026-04-12",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "conflito",
        hasTechnicianConflict: true,
        notes: "Tecnica alocada em manutencao em Ilheus na mesma data.",
      },
    ],
    commonResources: [
      {
        id: "cr-1",
        label: "Fiat Strada 2020",
        description: "Placa: ABC-1234",
        plate: "ABC-1234",
        cost: 1100,
        type: "veiculo",
      },
      {
        id: "cr-2",
        label: "Logistica",
        cost: 1500,
        type: "logistica",
      },
      {
        id: "cr-3",
        label: "Recursos Materiais",
        cost: 6000,
        type: "material",
      },
    ],
    executionRecords: [
      {
        id: "ex-1",
        actionId: "acao-instalacao-paineis",
        actionDate: "2026-04-10",
        type: "check-in",
        technicianName: "Joao Silva",
        timestamp: "2026-04-10T07:56:00-03:00",
        notes: "Equipe presente e com materiais conferidos.",
      },
    ],
    metrics: {
      progressPercent: 45,
      activeParticipants: 2,
      pendingParticipants: 0,
      predictedCost: 8600,
    },
  },
  {
    id: "acao-manutencao-equipamentos",
    title: "Manutencao Equipamentos",
    description: "Visita tecnica ao hospital municipal para manutencao preventiva e troca de componentes criticos.",
    city: "Ilheus - BA",
    local: "Hospital Municipal",
    startDate: "2026-04-12",
    endDate: "2026-04-14",
    plannedStatus: "planejamento",
    notes: "Confirmar liberacao de acesso e disponibilidade do veiculo reserva.",
    technicians: [techniciansSeed[1], techniciansSeed[2], techniciansSeed[3]],
    dailyAllocations: [
      {
        technicianId: "tec-2",
        date: "2026-04-12",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "conflito",
        hasTechnicianConflict: true,
      },
      {
        technicianId: "tec-3",
        date: "2026-04-12",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "confirmado",
      },
      {
        technicianId: "tec-4",
        date: "2026-04-13",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "pendente",
      },
    ],
    commonResources: [
      {
        id: "cr-4",
        label: "Van Operacional",
        description: "Placa: QWE-9087",
        plate: "QWE-9087",
        cost: 1800,
        type: "veiculo",
        hasConflict: true,
      },
      {
        id: "cr-5",
        label: "Logistica",
        cost: 900,
        type: "logistica",
      },
      {
        id: "cr-6",
        label: "Kit de manutencao",
        cost: 4200,
        type: "material",
      },
    ],
    executionRecords: [],
    metrics: {
      progressPercent: 15,
      activeParticipants: 1,
      pendingParticipants: 2,
      predictedCost: 7900,
    },
  },
];