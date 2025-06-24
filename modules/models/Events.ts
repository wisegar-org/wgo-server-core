const getClassOptions = () => {
  const result: string[] = [];
  let start = 2020;
  const end = new Date().getFullYear();
  while (start <= end) {
    result.push(`${start}-${start + 1}`);
    start += 1;
  }
  return result;
};

export const EventClassOption = getClassOptions();

export const EventTypeOptions = ["Evento", "Corso"];

export const EventStateOptions = ["In sospeso", "Confermato", "Annullato"];

export const EventEnrollmentOptions = [
  { label: "Abilitato", value: "true" },
  { label: "Non Abilitato", value: "false" },
];

export const EventVisibleOptions = [
  { label: "Visibile", value: "true" },
  { label: "Non Visibile", value: "false" },
];

export interface IEventResponseFilter {
  class: string;
  type: string;
  state: string;
  title: string;
  enrollment: string;
  visible: string;
}
