import currency from "currency.js";

export const UtilService = {
  getRequestData<TData>(req: Request): TData {
    return (req as any).body as TData;
  },
  roundNumber(value: number, decimal?: number) {
    if (!value) return value;
    const roundValue = currency(value, {
      symbol: "",
      separator: "'",
      precision: decimal || 2,
    }).format();
    return parseFloat(roundValue);
  },
  async readStreamData(stream: any) {
    return new Promise((res, rej) => {
      let dataStm: any[] = [];
      stream
        .on("error", () => {
          rej(null);
        })
        .on("data", (data: any) => {
          dataStm.push(data);
        })
        .on("end", () => {
          res(Buffer.concat(dataStm));
        });
    });
  },
};
