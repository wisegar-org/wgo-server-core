import { AGVEventModel } from "../models/Event/EventModel";

export class HomePageService {
  private readonly eventModel: AGVEventModel;

  constructor(ctx: any) {
    this.eventModel = new AGVEventModel(ctx);
  }

  public async getLastEvents() {
    // Obtener los dos últimos eventos
    const lastEvents = await this.eventModel.getPage(
      {
        descending: true,
        filter: {
          visible: "true",
          type: "Evento",
          class: "",
          state: "",
          title: "",
          enrollment: "",
        }, // Filtrar solo eventos visibles
        skip: 0,
        take: 2, // Limitar a los dos eventos más recientes
        sortBy: "startDate", // Ordenar por la fecha de inicio
      },
      ""
    );
    return lastEvents;
  }
}
