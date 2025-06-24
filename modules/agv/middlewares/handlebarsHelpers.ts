module.exports = {
  getActiveTab: function (a: any, b: any) {
    return a == b ? "active" : "";
  },
  notEmpty: function (a: number) {
    return a > 0;
  },
  notNullOrUndefined: function (a: any) {
    return !!a;
  },
  isNullOrUndefined: function (a: any) {
    return !a;
  },
  and: function () {
    return Array.prototype.slice
      .call(arguments, 0, arguments.length - 1)
      .every((val) => !!val);
  },
  or: function () {
    return Array.prototype.slice
      .call(arguments, 0, arguments.length - 1)
      .some((val) => !!val);
  },
  not: function (a: any) {
    return !a;
  },

  // Helper para comparar si dos valores son iguales
  eq: function (a: any, b: any) {
    return a === b;
  },

  // Helper para recortar espacios en blanco
  trim: function (str: string) {
    if (typeof str !== "string") return "";
    return str.trim();
  },

  // Helper para obtener valores únicos de un array de objetos basados en una propiedad
  uniqueValues: function (array: any[], key: string) {
    if (!Array.isArray(array)) {
      console.error(
        "El argumento pasado a 'uniqueValues' no es un array:",
        array
      );
      return [];
    }
    const uniqueSet = new Set(array.map((item) => item[key]));
    return [...uniqueSet];
  },

  // Helper para convertir texto a minúsculas
  lowercase: function (str: string) {
    if (typeof str !== "string") return "";
    return str.toLowerCase();
  },
};
