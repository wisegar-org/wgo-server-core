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
    // Get function args and remove last one (meta object); every(Boolean) checks AND
    return Array.prototype.slice
      .call(arguments, 0, arguments.length - 1)
      .every((val) => !!val);
  },
  or: function () {
    // Get function args and remove last one (meta object); every(Boolean) checks AND
    return Array.prototype.slice
      .call(arguments, 0, arguments.length - 1)
      .some((val) => !!val);
  },
  not: function (a: any) {
    return !a;
  },
};
