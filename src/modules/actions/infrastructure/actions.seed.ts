import type { ActionEntity, FormDefaults, Technician } from "@/modules/actions/domain/entities";

export const coordinatorName = "Maria Costa";
export const technicianName = "João Silva";

export const formDefaults: FormDefaults = {
  checkInTime: "08:00",
  checkOutTime: "17:00",
};

export const techniciansSeed: Technician[] = [
  {
    id: "tec-1",
    name: "João Silva",
    city: "Itabuna - BA",
    specialty: "Infraestrutura hospitalar",
    dailyCost: 550,
    participantResources: [
      { id: "pr-1", label: "Diária", cost: 300, type: "diaria" },
      { id: "pr-2", label: "Alimentação", cost: 90, type: "alimentacao" },
      { id: "pr-3", label: "Kit EPI", cost: 160, type: "epi" },
    ],
  },
  {
    id: "tec-2",
    name: "Maria Santos",
    city: "Ilhéus - BA",
    specialty: "Instalação elétrica",
    dailyCost: 550,
    participantResources: [
      { id: "pr-4", label: "Diária", cost: 300, type: "diaria" },
      { id: "pr-5", label: "Alimentação", cost: 90, type: "alimentacao" },
      { id: "pr-6", label: "Ferramentas pessoais", cost: 160, type: "ferramenta" },
    ],
  },
  {
    id: "tec-3",
    name: "Paula Reis",
    city: "Ilhéus - BA",
    specialty: "Supervisão de campo",
    dailyCost: 620,
    participantResources: [
      { id: "pr-7", label: "Diária", cost: 320, type: "diaria" },
      { id: "pr-8", label: "Alimentação", cost: 100, type: "alimentacao" },
    ],
  },
  {
    id: "tec-4",
    name: "Carlos Lima",
    city: "Itabuna - BA",
    specialty: "Logística operacional",
    dailyCost: 480,
    participantResources: [
      { id: "pr-9", label: "Diária", cost: 260, type: "diaria" },
      { id: "pr-10", label: "Alimentação", cost: 80, type: "alimentacao" },
    ],
  },
  {
    id: "tec-5",
    name: "Ana Paula",
    city: "Itabuna - BA",
    specialty: "Montagem técnica",
    dailyCost: 510,
    participantResources: [
      { id: "pr-11", label: "Diária", cost: 280, type: "diaria" },
      { id: "pr-12", label: "EPI adicional", cost: 120, type: "epi" },
    ],
  },
];

export const actionsSeed: ActionEntity[] = [
  {
    id: "acao-instalacao-paineis",
    title: "Instalação de Painéis",
    description: "Deslocamento da equipe de infraestrutura para instalar painéis de chamadas dentro dos postos de saúde de Itabuna.",
    city: "Itabuna - BA",
    local: "Posto de Saúde Central",
    startDate: "2026-04-06",
    endDate: "2026-04-06",
    plannedStatus: "andamento",
    notes: "Priorizar check-in até 08:15 e validar checklist de segurança antes de iniciar a montagem.",
    technicians: techniciansSeed.slice(0, 2),
    dailyAllocations: [
      {
        technicianId: "tec-1",
        date: "2026-04-06",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "confirmado",
      },
      {
        technicianId: "tec-2",
        date: "2026-04-06",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "confirmado",
      },
      {
        technicianId: "tec-2",
        date: "2026-04-07",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "conflito",
        hasTechnicianConflict: true,
        notes: "Técnica alocada em manutenção em Ilhéus na mesma data.",
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
        label: "Logística",
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
    executionRecords: [],
    metrics: {
      progressPercent: 45,
      activeParticipants: 2,
      pendingParticipants: 0,
      predictedCost: 8600,
    },
  },
  {
    id: "acao-instalacao-paineis-bairro-alto",
    title: "Instalação de Painéis",
    description: "Continuação da instalação dos painéis de chamadas na unidade do Bairro Alto, conforme o fluxo mostrado nas referências.",
    city: "Itabuna - BA",
    local: "Posto de Saúde Bairro Alto",
    startDate: "2026-04-07",
    endDate: "2026-04-07",
    plannedStatus: "planejamento",
    notes: "Equipe deslocada para a segunda frente de instalação no dia seguinte.",
    technicians: [techniciansSeed[0]],
    dailyAllocations: [
      {
        technicianId: "tec-1",
        date: "2026-04-07",
        checkInTime: "08:00",
        checkOutTime: "17:00",
        status: "pendente",
      },
    ],
    commonResources: [
      {
        id: "cr-1b",
        label: "Fiat Strada 2020",
        description: "Placa: ABC-1234",
        plate: "ABC-1234",
        cost: 1100,
        type: "veiculo",
      },
      {
        id: "cr-2b",
        label: "Logística",
        cost: 700,
        type: "logistica",
      },
    ],
    executionRecords: [],
    metrics: {
      progressPercent: 0,
      activeParticipants: 0,
      pendingParticipants: 1,
      predictedCost: 1800,
    },
  },
  {
    id: "acao-manutencao-equipamentos",
    title: "Manutenção Equipamentos",
    description: "Visita técnica ao hospital municipal para manutenção preventiva e troca de componentes críticos.",
    city: "Ilhéus - BA",
    local: "Hospital Municipal",
    startDate: "2026-04-12",
    endDate: "2026-04-14",
    plannedStatus: "planejamento",
    notes: "Confirmar liberação de acesso e disponibilidade do veículo reserva.",
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
        label: "Logística",
        cost: 900,
        type: "logistica",
      },
      {
        id: "cr-6",
        label: "Kit de manutenção",
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