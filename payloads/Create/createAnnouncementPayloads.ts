// Case de body de comunicados para las pruebas de API
const baseAnnouncement = {
  name: "Comunicado desde API prueba nueva de comunicados desde codigo",
  description:
    "Esto es una prueba de creación para los comunicados desde código, para validar que la creación de comunicados funcione correctamente desde código y no solo desde postman",
  appliesTo: [0, 1, 2, 3],
  programs: [{ code: "1331" }],
  campusSchedules: [1],
  startDate: null,
  endDate: null,
  isActive: true,
  periodId: 21,
  userPersonCode: null,
};

export const createAnnouncement = baseAnnouncement;

export const createAnnouncementWithPastDate = {
  ...baseAnnouncement,
  programs: [{ code: "1331", name: "Pruebas de Software JCPM" }],
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
  startDate: "2026-09-07",
};

const { appliesTo: _appliesTo, ...announcementWithoutAppliesTo } =
  baseAnnouncement;
export const createAnnouncementWithoutAppliesTo = {
  ...announcementWithoutAppliesTo,
  programs: [{ code: "1331", name: "Pruebas de Software JCPM" }],
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
  startDate: "2026-09-10",
};

export const createAnnouncementWithoutProgramId = {
  ...baseAnnouncement,
  programs: [{ name: "Pruebas de Software JCPM" }],
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
};

export const createAnnouncementWithoutName = {
  ...baseAnnouncement,
  name: null,
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
};

export const createAnnouncementWithoutDescription = {
  ...baseAnnouncement,
  description: null,
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
  startDate: "2026-09-10",
};

export const createAnnouncementWithGradeIdNull = {
  ...baseAnnouncement,
  grades: [{ id: null }],
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
};

export const createAnnouncementWithInvalidIsActive = {
  ...baseAnnouncement,
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
  startDate: "2026-09-10",
  isActive: 1,
};

export const createAnnouncementWithoutNameAndDescription = {
  ...baseAnnouncement,
  name: null,
  description: null,
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
};

export const createAnnouncementWithIncorrectPublicationDates = {
  ...baseAnnouncement,
  startDate: "2026-09-26",
  endDate: "2026-09-15",
};

export const createAnnouncementWithInactiveProgram = {
  ...baseAnnouncement,
  programs: [{ code: "325741"}],
  campusSchedules: [{ id: 1, name: "Principal - Mañana" }],
};
