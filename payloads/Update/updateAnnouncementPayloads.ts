const baseUpdateAnnouncement = {
  name: "Prueba de comunicado modificado desde la automatización",
  description: "Prueba para modificar un comunicado",
  startDate: null,
  endDate: null,
  isActive: true,
  appliesTo: [1],
  periodId: 21,
  campusScheduleIds: [1],
  programs: [
    {
      code: "1331",
      name: "Pruebas de Software JCPM",
    },
    {
      code: "P01JPM",
      name: "Pruebas de Software JCPM",
    },
    {
      code: "BBT",
      name: "Burbujita",
    },
  ],
};

export const updateAnnouncement = baseUpdateAnnouncement;

const { appliesTo: _appliesTo, ...baseWithoutAppliesTo } =
  baseUpdateAnnouncement;

export const updateAnnouncementWithoutAppliesTo = {
  ...baseWithoutAppliesTo,
  name: "Prueba de comunicado editado desde API segunda vez",
  description:
    "Esta es una nueva description para validar el tema de las apis en comunicados y validar como funcionan, la primera fue desde postman ahoraa quiero ver si desde codigo lo hace",
};

export const updateAnnouncementWithoutValueAppliesTo = {
  ...baseWithoutAppliesTo,
  appliesTo: [],
};
