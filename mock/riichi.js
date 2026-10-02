/* 由 mockjs/build_browser.mjs 自动生成，请修改 mockjs/ 源码后重新构建。 */
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // node_modules/agari/index.js
  var require_agari = __commonJS({
    "node_modules/agari/index.js"(exports2, module2) {
      (() => {
        "use strict";
        const sum = (arr) => {
          let s = 0;
          for (let i = 0; i < arr.length; i++)
            s += arr[i];
          return s;
        };
        const check7 = (hai_arr) => {
          let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
          let s = 0;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i] != 2) return false;
            s += arr[i];
          }
          return s == 14;
        };
        const check13 = (hai_arr) => {
          let arr = [hai_arr[0][0], hai_arr[0][8], hai_arr[1][0], hai_arr[1][8], hai_arr[2][0], hai_arr[2][8], ...hai_arr[3]];
          return !arr.includes(0) && sum(arr) == 14;
        };
        const _check = (arr, is_jihai = false) => {
          arr = [...arr];
          let s = sum(arr);
          if (s === 0)
            return true;
          if (s % 3 == 2) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] >= 2)
                arr[i] -= 2;
              else
                continue;
              if (!_check(arr, is_jihai))
                arr[i] += 2;
              else
                return true;
            }
            return false;
          }
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
              continue;
            } else if (arr[i] === 3) {
              delete arr[i];
              continue;
            } else {
              if (is_jihai || i >= 7)
                return false;
              if (arr[i] === 4)
                arr[i] -= 3;
              arr[i + 1] -= arr[i];
              arr[i + 2] -= arr[i];
              if (arr[i + 1] < 0 || arr[i + 2] < 0)
                return false;
              arr[i] = 0;
            }
          }
          return true;
        };
        const check = (hai_arr) => {
          let j = 0;
          for (let i = 0; i < hai_arr.length; i++) {
            if (sum(hai_arr[i]) % 3 === 1)
              return false;
            j += sum(hai_arr[i]) % 3 === 2;
          }
          return j === 1 && _check(hai_arr[3], true) && _check(hai_arr[0]) && _check(hai_arr[1]) && _check(hai_arr[2]);
        };
        const checkAll = (hai_arr) => {
          return check7(hai_arr) || check13(hai_arr) || check(hai_arr);
        };
        const MPSZ2 = ["m", "p", "s", "z"];
        const sumAll = (hai_arr) => {
          let s = 0;
          for (let arr of hai_arr)
            s += sum(arr);
          return s;
        };
        const findKotsu = (hai_arr) => {
          let res2 = [];
          for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              if (hai_arr[i][ii] >= 3) {
                hai_arr[i][ii] -= 3;
                if (check(hai_arr)) {
                  res2.push([ii + 1 + MPSZ2[i]]);
                } else {
                  hai_arr[i][ii] += 3;
                }
              }
            }
          }
          return res2;
        };
        const findJyuntsu = (hai_arr) => {
          let res2 = [];
          for (let i = 0; i < hai_arr.length; i++) {
            if (i === 3)
              break;
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              while (hai_arr[i][ii] >= 1 && hai_arr[i][ii + 1] >= 1 && hai_arr[i][ii + 2] >= 1) {
                hai_arr[i][ii]--;
                hai_arr[i][ii + 1]--;
                hai_arr[i][ii + 2]--;
                if (check(hai_arr)) {
                  res2.push([ii + 1 + MPSZ2[i], ii + 2 + MPSZ2[i], ii + 3 + MPSZ2[i]]);
                } else {
                  hai_arr[i][ii]++;
                  hai_arr[i][ii + 1]++;
                  hai_arr[i][ii + 2]++;
                  break;
                }
              }
            }
          }
          return res2;
        };
        const findJyanto = (hai_arr) => {
          for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              if (hai_arr[i][ii] >= 2) {
                return ii + 1 + MPSZ2[i];
              }
            }
          }
        };
        let res = [];
        const calc = (hai_arr, j) => {
          let tmp_hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          let first_res = findKotsu(tmp_hai_arr).concat(j);
          if (sumAll(tmp_hai_arr) === 2) {
            res.push(first_res.sort());
          } else if (first_res.length > 0) {
            first_res = first_res.concat(findJyuntsu(tmp_hai_arr));
            res.push(first_res.sort());
          }
          tmp_hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          let second_res = findJyuntsu(tmp_hai_arr).concat(j);
          if (sumAll(tmp_hai_arr) === 2) {
            res.push(second_res.sort());
          } else {
            second_res = second_res.concat(findKotsu(tmp_hai_arr));
            res.push(second_res.sort());
          }
        };
        const findAllAgariPatterns = (hai_arr) => {
          hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          res = [];
          if (!check(hai_arr)) {
            return res;
          }
          if (sumAll(hai_arr) === 2) {
            res.push([findJyanto(hai_arr)]);
            return res;
          }
          let j;
          for (let i = 0; i < hai_arr[3].length; i++) {
            if (hai_arr[3][i] === 0) {
              hai_arr[3][i] += 2;
              j = i;
              break;
            }
          }
          for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
              if (i === 3 && ii === j)
                continue;
              if (hai_arr[i][ii] >= 2) {
                hai_arr[i][ii] -= 2;
                if (check(hai_arr))
                  calc(hai_arr, ii + 1 + MPSZ2[i]);
                hai_arr[i][ii] += 2;
              }
            }
          }
          let final_res = [];
          for (let v of res) {
            let is_duplicate = false;
            for (let vv of final_res) {
              if (JSON.stringify(v) === JSON.stringify(vv))
                is_duplicate = true;
            }
            if (!is_duplicate)
              final_res.push(v);
          }
          return final_res;
        };
        const exports3 = findAllAgariPatterns;
        exports3.check = check;
        exports3.check7 = check7;
        exports3.check13 = check13;
        exports3.checkAll = checkAll;
        if (typeof module2 === "object" && module2 && module2.exports) {
          module2.exports = exports3;
        } else if (typeof define === "function" && define.amd) {
          define(() => {
            return exports3;
          });
        } else if (typeof self === "object" && self) {
          self.agari = exports3;
        }
      })();
    }
  });

  // node_modules/syanten/index.js
  var require_syanten = __commonJS({
    "node_modules/syanten/index.js"(exports2, module2) {
      (() => {
        "use strict";
        const sum = (arr) => {
          let s = 0;
          for (let i = 0; i < arr.length; i++)
            s += arr[i];
          return s;
        };
        const syanten2 = (hai_arr) => {
          let res = 9;
          let mentsu, tatsu, alone, furo;
          mentsu = tatsu = alone = furo = 0;
          const search = (arr2, is_jihai = false) => {
            const searchHelper = (arr3, index, is_jihai2 = false, mentsu2, tatsu2, alone2) => {
              let tmp2 = [0, 0, 0];
              let max = [mentsu2, tatsu2, alone2];
              if (index === (is_jihai2 ? 7 : 9)) {
                return max;
              }
              if (arr3[index] === 0) {
                tmp2 = searchHelper(arr3, index + 1, is_jihai2, mentsu2, tatsu2, alone2);
                if (tmp2 > max) {
                  max = tmp2;
                }
              }
              if (arr3[index] >= 3) {
                arr3[index] -= 3;
                tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2 + 1, tatsu2, alone2);
                if (tmp2 > max) {
                  max = tmp2;
                }
                arr3[index] += 3;
              }
              if (arr3[index] >= 2) {
                arr3[index] -= 2;
                tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2 + 1, alone2);
                if (tmp2 > max) {
                  max = tmp2;
                }
                arr3[index] += 2;
              }
              if (arr3[index] >= 1) {
                arr3[index] -= 1;
                tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2, alone2 + 1);
                if (tmp2 > max) {
                  max = tmp2;
                }
                arr3[index] += 1;
              }
              if (!is_jihai2) {
                if (arr3[index] > 0 && arr3[index + 1] > 0 && arr3[index + 2] > 0) {
                  arr3[index]--, arr3[index + 1]--, arr3[index + 2]--;
                  tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2 + 1, tatsu2, alone2);
                  if (tmp2 > max) {
                    max = tmp2;
                  }
                  arr3[index]++, arr3[index + 1]++, arr3[index + 2]++;
                }
                if (arr3[index] > 0 && arr3[index + 2] > 0) {
                  arr3[index]--, arr3[index + 2]--;
                  tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2 + 1, alone2);
                  if (tmp2 > max) {
                    max = tmp2;
                  }
                  arr3[index]++, arr3[index + 2]++;
                }
                if (arr3[index] > 0 && arr3[index + 1] > 0) {
                  arr3[index]--, arr3[index + 1]--;
                  tmp2 = searchHelper(arr3, index, is_jihai2, mentsu2, tatsu2 + 1, alone2);
                  if (tmp2 > max) {
                    max = tmp2;
                  }
                  arr3[index]++, arr3[index + 1]++;
                }
              }
              return max;
            };
            let tmp = searchHelper(arr2, 0, is_jihai, 0, 0, 0);
            mentsu += tmp[0], tatsu += tmp[1], alone += tmp[2];
          };
          const calc = () => {
            let tmp_res = -1;
            while (mentsu < 4 - furo) {
              if (tatsu && alone) {
                tatsu--, alone--, mentsu++, tmp_res++;
                continue;
              }
              if (tatsu && !alone) {
                tatsu--, alone++, mentsu++, tmp_res++;
                continue;
              }
              if (!tatsu && alone) {
                alone -= 2, mentsu++, tmp_res += 2;
              }
            }
            if (alone > 0) tmp_res++;
            res = tmp_res < res ? tmp_res : res;
            mentsu = tatsu = alone = 0;
          };
          hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]];
          let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
          let s = sum(arr);
          if (s > 14 || s % 3 === 0)
            return -2;
          furo = Math.round((14 - s) / 3);
          if (s % 3 === 1) {
            for (let i = 33; ; i--) {
              if (!arr[i]) {
                arr[i]++;
                hai_arr[Math.floor(i / 9)][i % 9]++;
                break;
              }
            }
          }
          for (let i = 0; i < 34; i++) {
            if (arr[i] === 0)
              continue;
            let t = [];
            t[0] = [...hai_arr[0]], t[1] = [...hai_arr[1]], t[2] = [...hai_arr[2]], t[3] = [...hai_arr[3]];
            t[Math.floor(i / 9)][i % 9] -= arr[i] >= 2 ? 2 : arr[i];
            search(t[0]);
            search(t[1]);
            search(t[2]);
            search(t[3], true);
            calc();
          }
          return res;
        };
        const syanten7 = (hai_arr) => {
          let cnt = sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3]);
          if (cnt < 13 || cnt > 14)
            return -2;
          let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
          let s = 0, t = 0;
          for (let i = 0; i < 34; i++) {
            if (arr[i] >= 2) s++;
            if (arr[i] === 1) t++;
          }
          if (s + t >= 7)
            return 6 - s;
          else
            return 6 - s + (7 - s - t);
        };
        const syanten13 = (hai_arr) => {
          let cnt = sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3]);
          if (cnt < 13 || cnt > 14)
            return -2;
          let arr = [hai_arr[0][0], hai_arr[0][8], hai_arr[1][0], hai_arr[1][8], hai_arr[2][0], hai_arr[2][8], ...hai_arr[3]];
          let s = 0, t = 0;
          for (let i = 0; i < 13; i++) {
            if (arr[i]) s++;
            if (arr[i] > 1) t = 1;
          }
          return 13 - s - t;
        };
        const syantenAll = (hai_arr) => {
          let s7 = syanten7(hai_arr);
          let s13 = syanten13(hai_arr);
          if (s7 === -2 || s13 === -2)
            return syanten2(hai_arr);
          else
            return Math.min(syanten2(hai_arr), s7, s13);
        };
        const MPSZ2 = ["m", "p", "s", "z"];
        const hairi = (hai_arr, is7or13 = false) => {
          let syantenCalc = !is7or13 ? syanten2 : (haiArr) => {
            return Math.min(syanten7(haiArr), syanten13(haiArr));
          };
          let sht = syantenCalc(hai_arr);
          let res = { now: sht };
          if (sht < 0)
            return res;
          let self2 = [];
          const calcHairi = () => {
            let map = {};
            for (let i = 0; i < 4; i++) {
              for (let ii = 0; ii < 9; ii++) {
                if (hai_arr[i][ii] === void 0)
                  continue;
                if (i === self2[0] && ii === self2[1])
                  continue;
                if (!is7or13 && i == 3 && hai_arr[i][ii] === 0)
                  continue;
                if (!is7or13 && i < 3 && (hai_arr[i][ii] === 0 && !hai_arr[i][ii - 1] === 0 && !hai_arr[i][ii - 2] === 0 && !hai_arr[i][ii + 1] === 0 && !hai_arr[i][ii + 1] === 0))
                  continue;
                hai_arr[i][ii]++;
                if (syantenCalc(hai_arr) < sht) {
                  map[ii + 1 + MPSZ2[i]] = 5 - hai_arr[i][ii];
                }
                hai_arr[i][ii]--;
              }
            }
            return map;
          };
          if ((sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3])) % 3 === 1) {
            res.wait = calcHairi();
            return res;
          }
          for (let i = 0; i < 4; i++) {
            for (let ii = 0; ii < 9; ii++) {
              if (hai_arr[i][ii] === 0 || hai_arr[i][ii] === void 0)
                continue;
              hai_arr[i][ii]--;
              if (syantenCalc(hai_arr) === sht) {
                self2 = [i, ii];
                res[ii + 1 + MPSZ2[i]] = calcHairi();
              }
              hai_arr[i][ii]++;
            }
          }
          return res;
        };
        const exports3 = syantenAll;
        exports3.syanten = syanten2;
        exports3.syanten7 = syanten7;
        exports3.syanten13 = syanten13;
        exports3.syantenAll = syantenAll;
        exports3.hairi = hairi;
        if (typeof module2 === "object" && module2 && module2.exports) {
          module2.exports = exports3;
        } else if (typeof define === "function" && define.amd) {
          define(() => {
            return exports3;
          });
        } else if (typeof self === "object" && self) {
          self.syanten = exports3;
        }
      })();
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports2, module2) {
      "use strict";
      module2.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = /* @__PURE__ */ Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = (
            /** @type {PropertyDescriptor} */
            Object.getOwnPropertyDescriptor(obj, sym)
          );
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "node_modules/has-tostringtag/shams.js"(exports2, module2) {
      "use strict";
      var hasSymbols = require_shams();
      module2.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      };
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports2, module2) {
      "use strict";
      module2.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports2, module2) {
      "use strict";
      module2.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports2, module2) {
      "use strict";
      module2.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports2, module2) {
      "use strict";
      module2.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports2, module2) {
      "use strict";
      module2.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports2, module2) {
      "use strict";
      module2.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports2, module2) {
      "use strict";
      module2.exports = TypeError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports2, module2) {
      "use strict";
      module2.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports2, module2) {
      "use strict";
      module2.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports2, module2) {
      "use strict";
      module2.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports2, module2) {
      "use strict";
      module2.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports2, module2) {
      "use strict";
      module2.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports2, module2) {
      "use strict";
      module2.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports2, module2) {
      "use strict";
      module2.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports2, module2) {
      "use strict";
      module2.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports2, module2) {
      "use strict";
      var $isNaN = require_isNaN();
      module2.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports2, module2) {
      "use strict";
      module2.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports2, module2) {
      "use strict";
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module2.exports = $gOPD;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports2, module2) {
      "use strict";
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module2.exports = $defineProperty;
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports2, module2) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module2.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/get-proto/Reflect.getPrototypeOf.js
  var require_Reflect_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports2, module2) {
      "use strict";
      module2.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    }
  });

  // node_modules/get-proto/Object.getPrototypeOf.js
  var require_Object_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Object.getPrototypeOf.js"(exports2, module2) {
      "use strict";
      var $Object = require_es_object_atoms();
      module2.exports = $Object.getPrototypeOf || null;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports2, module2) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      };
      var slicy = function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      };
      var joiny = function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      };
      module2.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports2, module2) {
      "use strict";
      var implementation = require_implementation();
      module2.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/call-bind-apply-helpers/functionCall.js
  var require_functionCall = __commonJS({
    "node_modules/call-bind-apply-helpers/functionCall.js"(exports2, module2) {
      "use strict";
      module2.exports = Function.prototype.call;
    }
  });

  // node_modules/call-bind-apply-helpers/functionApply.js
  var require_functionApply = __commonJS({
    "node_modules/call-bind-apply-helpers/functionApply.js"(exports2, module2) {
      "use strict";
      module2.exports = Function.prototype.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/reflectApply.js
  var require_reflectApply = __commonJS({
    "node_modules/call-bind-apply-helpers/reflectApply.js"(exports2, module2) {
      "use strict";
      module2.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/actualApply.js
  var require_actualApply = __commonJS({
    "node_modules/call-bind-apply-helpers/actualApply.js"(exports2, module2) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var $reflectApply = require_reflectApply();
      module2.exports = $reflectApply || bind.call($call, $apply);
    }
  });

  // node_modules/call-bind-apply-helpers/index.js
  var require_call_bind_apply_helpers = __commonJS({
    "node_modules/call-bind-apply-helpers/index.js"(exports2, module2) {
      "use strict";
      var bind = require_function_bind();
      var $TypeError = require_type();
      var $call = require_functionCall();
      var $actualApply = require_actualApply();
      module2.exports = function callBindBasic(args) {
        if (args.length < 1 || typeof args[0] !== "function") {
          throw new $TypeError("a function is required");
        }
        return $actualApply(bind, $call, args);
      };
    }
  });

  // node_modules/dunder-proto/get.js
  var require_get = __commonJS({
    "node_modules/dunder-proto/get.js"(exports2, module2) {
      "use strict";
      var callBind = require_call_bind_apply_helpers();
      var gOPD = require_gopd();
      var hasProtoAccessor;
      try {
        hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
        [].__proto__ === Array.prototype;
      } catch (e) {
        if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
          throw e;
        }
      }
      var desc = !!hasProtoAccessor && gOPD && gOPD(
        Object.prototype,
        /** @type {keyof typeof Object.prototype} */
        "__proto__"
      );
      var $Object = Object;
      var $getPrototypeOf = $Object.getPrototypeOf;
      module2.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
        /** @type {import('./get')} */
        function getDunder(value) {
          return $getPrototypeOf(value == null ? value : $Object(value));
        }
      ) : false;
    }
  });

  // node_modules/get-proto/index.js
  var require_get_proto = __commonJS({
    "node_modules/get-proto/index.js"(exports2, module2) {
      "use strict";
      var reflectGetProto = require_Reflect_getPrototypeOf();
      var originalGetProto = require_Object_getPrototypeOf();
      var getDunderProto = require_get();
      module2.exports = reflectGetProto ? function getProto(O) {
        return reflectGetProto(O);
      } : originalGetProto ? function getProto(O) {
        if (!O || typeof O !== "object" && typeof O !== "function") {
          throw new TypeError("getProto: not an object");
        }
        return originalGetProto(O);
      } : getDunderProto ? function getProto(O) {
        return getDunderProto(O);
      } : null;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports2, module2) {
      "use strict";
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module2.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports2, module2) {
      "use strict";
      var undefined2;
      var $Object = require_es_object_atoms();
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var abs = require_abs();
      var floor = require_floor();
      var max = require_max();
      var min = require_min();
      var pow = require_pow();
      var round = require_round();
      var sign = require_sign();
      var $Function = Function;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = require_gopd();
      var $defineProperty = require_es_define_property();
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? (function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      })() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = require_get_proto();
      var $ObjectGPO = require_Object_getPrototypeOf();
      var $ReflectGPO = require_Reflect_getPrototypeOf();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": $EvalError,
        "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": $Object,
        "%Object.getOwnPropertyDescriptor%": $gOPD,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
        "%Function.prototype.call%": $call,
        "%Function.prototype.apply%": $apply,
        "%Object.defineProperty%": $defineProperty,
        "%Object.getPrototypeOf%": $ObjectGPO,
        "%Math.abs%": abs,
        "%Math.floor%": floor,
        "%Math.max%": max,
        "%Math.min%": min,
        "%Math.pow%": pow,
        "%Math.round%": round,
        "%Math.sign%": sign,
        "%Reflect.getPrototypeOf%": $ReflectGPO
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call($call, Array.prototype.concat);
      var $spliceApply = bind.call($apply, Array.prototype.splice);
      var $replace = bind.call($call, String.prototype.replace);
      var $strSlice = bind.call($call, String.prototype.slice);
      var $exec = bind.call($call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module2.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void undefined2;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bound/index.js
  var require_call_bound = __commonJS({
    "node_modules/call-bound/index.js"(exports2, module2) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBindBasic = require_call_bind_apply_helpers();
      var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
      module2.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = (
          /** @type {(this: unknown, ...args: unknown[]) => unknown} */
          GetIntrinsic(name, !!allowMissing)
        );
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBindBasic(
            /** @type {const} */
            [intrinsic]
          );
        }
        return intrinsic;
      };
    }
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "node_modules/is-arguments/index.js"(exports2, module2) {
      "use strict";
      var hasToStringTag = require_shams2()();
      var callBound = require_call_bound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      };
      var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && "length" in value && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && "callee" in value && $toString(value.callee) === "[object Function]";
      };
      var supportsStandardArguments = (function() {
        return isStandardArguments(arguments);
      })();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module2.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // node_modules/is-regex/index.js
  var require_is_regex = __commonJS({
    "node_modules/is-regex/index.js"(exports2, module2) {
      "use strict";
      var callBound = require_call_bound();
      var hasToStringTag = require_shams2()();
      var hasOwn = require_hasown();
      var gOPD = require_gopd();
      var fn;
      if (hasToStringTag) {
        $exec = callBound("RegExp.prototype.exec");
        isRegexMarker = {};
        throwRegexMarker = function() {
          throw isRegexMarker;
        };
        badStringifier = {
          toString: throwRegexMarker,
          valueOf: throwRegexMarker
        };
        if (typeof Symbol.toPrimitive === "symbol") {
          badStringifier[Symbol.toPrimitive] = throwRegexMarker;
        }
        fn = function isRegex(value) {
          if (!value || typeof value !== "object") {
            return false;
          }
          var descriptor = (
            /** @type {NonNullable<typeof gOPD>} */
            gOPD(
              /** @type {{ lastIndex?: unknown }} */
              value,
              "lastIndex"
            )
          );
          var hasLastIndexDataProperty = descriptor && hasOwn(descriptor, "value");
          if (!hasLastIndexDataProperty) {
            return false;
          }
          try {
            $exec(
              value,
              /** @type {string} */
              /** @type {unknown} */
              badStringifier
            );
          } catch (e) {
            return e === isRegexMarker;
          }
        };
      } else {
        $toString = callBound("Object.prototype.toString");
        regexClass = "[object RegExp]";
        fn = function isRegex(value) {
          if (!value || typeof value !== "object" && typeof value !== "function") {
            return false;
          }
          return $toString(value) === regexClass;
        };
      }
      var $exec;
      var isRegexMarker;
      var throwRegexMarker;
      var badStringifier;
      var $toString;
      var regexClass;
      module2.exports = fn;
    }
  });

  // node_modules/safe-regex-test/index.js
  var require_safe_regex_test = __commonJS({
    "node_modules/safe-regex-test/index.js"(exports2, module2) {
      "use strict";
      var callBound = require_call_bound();
      var isRegex = require_is_regex();
      var $exec = callBound("RegExp.prototype.exec");
      var $TypeError = require_type();
      module2.exports = function regexTester(regex) {
        if (!isRegex(regex)) {
          throw new $TypeError("`regex` must be a RegExp");
        }
        return function test(s) {
          return $exec(regex, s) !== null;
        };
      };
    }
  });

  // node_modules/generator-function/index.js
  var require_generator_function = __commonJS({
    "node_modules/generator-function/index.js"(exports2, module2) {
      "use strict";
      var cached = (
        /** @type {GeneratorFunctionConstructor} */
        function* () {
        }.constructor
      );
      module2.exports = () => cached;
    }
  });

  // node_modules/is-generator-function/index.js
  var require_is_generator_function = __commonJS({
    "node_modules/is-generator-function/index.js"(exports2, module2) {
      "use strict";
      var callBound = require_call_bound();
      var safeRegexTest = require_safe_regex_test();
      var isFnRegex = safeRegexTest(/^\s*(?:function)?\*/);
      var hasToStringTag = require_shams2()();
      var getProto = require_get_proto();
      var toStr = callBound("Object.prototype.toString");
      var fnToStr = callBound("Function.prototype.toString");
      var getGeneratorFunction = require_generator_function();
      module2.exports = function isGeneratorFunction(fn) {
        if (typeof fn !== "function") {
          return false;
        }
        if (isFnRegex(fnToStr(fn))) {
          return true;
        }
        if (!hasToStringTag) {
          var str = toStr(fn);
          return str === "[object GeneratorFunction]";
        }
        if (!getProto) {
          return false;
        }
        var GeneratorFunction = getGeneratorFunction();
        return GeneratorFunction && getProto(fn) === GeneratorFunction.prototype;
      };
    }
  });

  // node_modules/is-callable/index.js
  var require_is_callable = __commonJS({
    "node_modules/is-callable/index.js"(exports2, module2) {
      "use strict";
      var fnToStr = Function.prototype.toString;
      var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
      var badArrayLike;
      var isCallableMarker;
      if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
        try {
          badArrayLike = Object.defineProperty({}, "length", {
            get: function() {
              throw isCallableMarker;
            }
          });
          isCallableMarker = {};
          reflectApply(function() {
            throw 42;
          }, null, badArrayLike);
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null;
          }
        }
      } else {
        reflectApply = null;
      }
      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false;
        }
      };
      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var objectClass = "[object Object]";
      var fnClass = "[object Function]";
      var genClass = "[object GeneratorFunction]";
      var ddaClass = "[object HTMLAllCollection]";
      var ddaClass2 = "[object HTML document.all class]";
      var ddaClass3 = "[object HTMLCollection]";
      var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
      var isIE68 = !(0 in [,]);
      var isDDA = function isDocumentDotAll() {
        return false;
      };
      if (typeof document === "object") {
        all = document.all;
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll(value) {
            if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
              try {
                var str = toStr.call(value);
                return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
              } catch (e) {
              }
            }
            return false;
          };
        }
      }
      var all;
      module2.exports = reflectApply ? function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        try {
          reflectApply(value, null, badArrayLike);
        } catch (e) {
          if (e !== isCallableMarker) {
            return false;
          }
        }
        return !isES6ClassFn(value) && tryFunctionObject(value);
      } : function isCallable(value) {
        if (isDDA(value)) {
          return true;
        }
        if (!value) {
          return false;
        }
        if (typeof value !== "function" && typeof value !== "object") {
          return false;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
          return false;
        }
        return tryFunctionObject(value);
      };
    }
  });

  // node_modules/for-each/index.js
  var require_for_each = __commonJS({
    "node_modules/for-each/index.js"(exports2, module2) {
      "use strict";
      var isCallable = require_is_callable();
      var toStr = Object.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var forEachArray = function forEachArray2(array, iterator, receiver) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array);
            } else {
              iterator.call(receiver, array[i], i, array);
            }
          }
        }
      };
      var forEachString = function forEachString2(string, iterator, receiver) {
        for (var i = 0, len = string.length; i < len; i++) {
          if (receiver == null) {
            iterator(string.charAt(i), i, string);
          } else {
            iterator.call(receiver, string.charAt(i), i, string);
          }
        }
      };
      var forEachObject = function forEachObject2(object, iterator, receiver) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object);
            } else {
              iterator.call(receiver, object[k], k, object);
            }
          }
        }
      };
      function isArray(x) {
        return toStr.call(x) === "[object Array]";
      }
      module2.exports = function forEach(list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError("iterator must be a function");
        }
        var receiver;
        if (arguments.length >= 3) {
          receiver = thisArg;
        }
        if (isArray(list)) {
          forEachArray(list, iterator, receiver);
        } else if (typeof list === "string") {
          forEachString(list, iterator, receiver);
        } else {
          forEachObject(list, iterator, receiver);
        }
      };
    }
  });

  // node_modules/possible-typed-array-names/index.js
  var require_possible_typed_array_names = __commonJS({
    "node_modules/possible-typed-array-names/index.js"(exports2, module2) {
      "use strict";
      module2.exports = [
        "Float16Array",
        "Float32Array",
        "Float64Array",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "BigInt64Array",
        "BigUint64Array"
      ];
    }
  });

  // node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS({
    "node_modules/available-typed-arrays/index.js"(exports2, module2) {
      "use strict";
      var possibleNames = require_possible_typed_array_names();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      module2.exports = function availableTypedArrays() {
        var out = [];
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof g[possibleNames[i]] === "function") {
            out[out.length] = possibleNames[i];
          }
        }
        return out;
      };
    }
  });

  // node_modules/define-data-property/index.js
  var require_define_data_property = __commonJS({
    "node_modules/define-data-property/index.js"(exports2, module2) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var gopd = require_gopd();
      module2.exports = function defineDataProperty(obj, property, value) {
        if (!obj || typeof obj !== "object" && typeof obj !== "function") {
          throw new $TypeError("`obj` must be an object or a function`");
        }
        if (typeof property !== "string" && typeof property !== "symbol") {
          throw new $TypeError("`property` must be a string or a symbol`");
        }
        if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
          throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
          throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
          throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
          throw new $TypeError("`loose`, if provided, must be a boolean");
        }
        var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
        var nonWritable = arguments.length > 4 ? arguments[4] : null;
        var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
        var loose = arguments.length > 6 ? arguments[6] : false;
        var desc = !!gopd && gopd(obj, property);
        if ($defineProperty) {
          $defineProperty(obj, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          });
        } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
          obj[property] = value;
        } else {
          throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        }
      };
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports2, module2) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        return !!$defineProperty;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!$defineProperty) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module2.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/set-function-length/index.js
  var require_set_function_length = __commonJS({
    "node_modules/set-function-length/index.js"(exports2, module2) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var define2 = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var gOPD = require_gopd();
      var $TypeError = require_type();
      var $floor = GetIntrinsic("%Math.floor%");
      module2.exports = function setFunctionLength(fn, length) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
          throw new $TypeError("`length` must be a positive 32-bit integer");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        var functionLengthIsConfigurable = true;
        var functionLengthIsWritable = true;
        if ("length" in fn && gOPD) {
          var desc = gOPD(fn, "length");
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false;
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false;
          }
        }
        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define2(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length,
              true,
              true
            );
          } else {
            define2(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length
            );
          }
        }
        return fn;
      };
    }
  });

  // node_modules/call-bind-apply-helpers/applyBind.js
  var require_applyBind = __commonJS({
    "node_modules/call-bind-apply-helpers/applyBind.js"(exports2, module2) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var actualApply = require_actualApply();
      module2.exports = function applyBind() {
        return actualApply(bind, $apply, arguments);
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports2, module2) {
      "use strict";
      var setFunctionLength = require_set_function_length();
      var $defineProperty = require_es_define_property();
      var callBindBasic = require_call_bind_apply_helpers();
      var applyBind = require_applyBind();
      module2.exports = function callBind(originalFunction) {
        var func = callBindBasic(arguments);
        var adjustedLength = 1 + originalFunction.length - (arguments.length - 1);
        return setFunctionLength(
          func,
          adjustedLength > 0 ? adjustedLength : 0,
          true
        );
      };
      if ($defineProperty) {
        $defineProperty(module2.exports, "apply", { value: applyBind });
      } else {
        module2.exports.apply = applyBind;
      }
    }
  });

  // node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS({
    "node_modules/which-typed-array/index.js"(exports2, module2) {
      "use strict";
      var forEach = require_for_each();
      var availableTypedArrays = require_available_typed_arrays();
      var callBind = require_call_bind();
      var callBound = require_call_bound();
      var gOPD = require_gopd();
      var getProto = require_get_proto();
      var $toString = callBound("Object.prototype.toString");
      var hasToStringTag = require_shams2()();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      var typedArrays = availableTypedArrays();
      var $slice = callBound("String.prototype.slice");
      var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      };
      var cache = { __proto__: null };
      if (hasToStringTag && gOPD && getProto) {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          if (Symbol.toStringTag in arr && getProto) {
            var proto = getProto(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor && proto) {
              var superProto = getProto(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            if (descriptor && descriptor.get) {
              var bound = callBind(descriptor.get);
              cache[
                /** @type {`$${TypedArrayName}`} */
                "$" + typedArray
              ] = bound;
            }
          }
        });
      } else {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          var fn = arr.slice || arr.set;
          if (fn) {
            var bound = (
              /** @type {BoundSlice | BoundSet} */
              // @ts-expect-error TODO FIXME
              callBind(fn)
            );
            cache[
              /** @type {`$${TypedArrayName}`} */
              "$" + typedArray
            ] = bound;
          }
        });
      }
      function tryTypedArrays(value) {
        var found = false;
        forEach(
          /** @type {Record<`$${TypedArrayName}`, Getter>} */
          cache,
          /** @param {Getter} getter @param {`$${TypedArrayName}`} typedArray */
          function(getter, typedArray) {
            if (!found) {
              try {
                if ("$" + getter(value) === typedArray) {
                  found = /** @type {TypedArrayName} */
                  $slice(typedArray, 1);
                }
              } catch (e) {
              }
            }
          }
        );
        return found;
      }
      function trySlices(value) {
        var found = false;
        forEach(
          /** @type {Record<`$${TypedArrayName}`, Getter>} */
          cache,
          /** @param {Getter} getter @param {`$${TypedArrayName}`} name */
          function(getter, name) {
            if (!found) {
              try {
                getter(value);
                found = /** @type {TypedArrayName} */
                $slice(name, 1);
              } catch (e) {
              }
            }
          }
        );
        return found;
      }
      function isTATag(tag) {
        return $indexOf(typedArrays, tag) > -1;
      }
      module2.exports = function whichTypedArray(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (!hasToStringTag) {
          var tag = $slice($toString(value), 8, -1);
          if (isTATag(tag)) {
            return tag;
          }
          if (tag !== "Object") {
            return false;
          }
          return trySlices(value);
        }
        if (!gOPD) {
          return null;
        }
        return tryTypedArrays(value);
      };
    }
  });

  // node_modules/is-typed-array/index.js
  var require_is_typed_array = __commonJS({
    "node_modules/is-typed-array/index.js"(exports2, module2) {
      "use strict";
      var whichTypedArray = require_which_typed_array();
      module2.exports = function isTypedArray(value) {
        return !!whichTypedArray(value);
      };
    }
  });

  // node_modules/util/support/types.js
  var require_types = __commonJS({
    "node_modules/util/support/types.js"(exports2) {
      "use strict";
      var isArgumentsObject = require_is_arguments();
      var isGeneratorFunction = require_is_generator_function();
      var whichTypedArray = require_which_typed_array();
      var isTypedArray = require_is_typed_array();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var BigIntSupported = typeof BigInt !== "undefined";
      var SymbolSupported = typeof Symbol !== "undefined";
      var ObjectToString = uncurryThis(Object.prototype.toString);
      var numberValue = uncurryThis(Number.prototype.valueOf);
      var stringValue = uncurryThis(String.prototype.valueOf);
      var booleanValue = uncurryThis(Boolean.prototype.valueOf);
      if (BigIntSupported) {
        bigIntValue = uncurryThis(BigInt.prototype.valueOf);
      }
      var bigIntValue;
      if (SymbolSupported) {
        symbolValue = uncurryThis(Symbol.prototype.valueOf);
      }
      var symbolValue;
      function checkBoxedPrimitive(value, prototypeValueOf) {
        if (typeof value !== "object") {
          return false;
        }
        try {
          prototypeValueOf(value);
          return true;
        } catch (e) {
          return false;
        }
      }
      exports2.isArgumentsObject = isArgumentsObject;
      exports2.isGeneratorFunction = isGeneratorFunction;
      exports2.isTypedArray = isTypedArray;
      function isPromise(input) {
        return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
      }
      exports2.isPromise = isPromise;
      function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value);
        }
        return isTypedArray(value) || isDataView(value);
      }
      exports2.isArrayBufferView = isArrayBufferView;
      function isUint8Array(value) {
        return whichTypedArray(value) === "Uint8Array";
      }
      exports2.isUint8Array = isUint8Array;
      function isUint8ClampedArray(value) {
        return whichTypedArray(value) === "Uint8ClampedArray";
      }
      exports2.isUint8ClampedArray = isUint8ClampedArray;
      function isUint16Array(value) {
        return whichTypedArray(value) === "Uint16Array";
      }
      exports2.isUint16Array = isUint16Array;
      function isUint32Array(value) {
        return whichTypedArray(value) === "Uint32Array";
      }
      exports2.isUint32Array = isUint32Array;
      function isInt8Array(value) {
        return whichTypedArray(value) === "Int8Array";
      }
      exports2.isInt8Array = isInt8Array;
      function isInt16Array(value) {
        return whichTypedArray(value) === "Int16Array";
      }
      exports2.isInt16Array = isInt16Array;
      function isInt32Array(value) {
        return whichTypedArray(value) === "Int32Array";
      }
      exports2.isInt32Array = isInt32Array;
      function isFloat32Array(value) {
        return whichTypedArray(value) === "Float32Array";
      }
      exports2.isFloat32Array = isFloat32Array;
      function isFloat64Array(value) {
        return whichTypedArray(value) === "Float64Array";
      }
      exports2.isFloat64Array = isFloat64Array;
      function isBigInt64Array(value) {
        return whichTypedArray(value) === "BigInt64Array";
      }
      exports2.isBigInt64Array = isBigInt64Array;
      function isBigUint64Array(value) {
        return whichTypedArray(value) === "BigUint64Array";
      }
      exports2.isBigUint64Array = isBigUint64Array;
      function isMapToString(value) {
        return ObjectToString(value) === "[object Map]";
      }
      isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
      function isMap(value) {
        if (typeof Map === "undefined") {
          return false;
        }
        return isMapToString.working ? isMapToString(value) : value instanceof Map;
      }
      exports2.isMap = isMap;
      function isSetToString(value) {
        return ObjectToString(value) === "[object Set]";
      }
      isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
      function isSet(value) {
        if (typeof Set === "undefined") {
          return false;
        }
        return isSetToString.working ? isSetToString(value) : value instanceof Set;
      }
      exports2.isSet = isSet;
      function isWeakMapToString(value) {
        return ObjectToString(value) === "[object WeakMap]";
      }
      isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
      function isWeakMap(value) {
        if (typeof WeakMap === "undefined") {
          return false;
        }
        return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
      }
      exports2.isWeakMap = isWeakMap;
      function isWeakSetToString(value) {
        return ObjectToString(value) === "[object WeakSet]";
      }
      isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
      function isWeakSet(value) {
        return isWeakSetToString(value);
      }
      exports2.isWeakSet = isWeakSet;
      function isArrayBufferToString(value) {
        return ObjectToString(value) === "[object ArrayBuffer]";
      }
      isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
      function isArrayBuffer(value) {
        if (typeof ArrayBuffer === "undefined") {
          return false;
        }
        return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
      }
      exports2.isArrayBuffer = isArrayBuffer;
      function isDataViewToString(value) {
        return ObjectToString(value) === "[object DataView]";
      }
      isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
      function isDataView(value) {
        if (typeof DataView === "undefined") {
          return false;
        }
        return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
      }
      exports2.isDataView = isDataView;
      var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
      function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === "[object SharedArrayBuffer]";
      }
      function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === "undefined") {
          return false;
        }
        if (typeof isSharedArrayBufferToString.working === "undefined") {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
        }
        return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
      }
      exports2.isSharedArrayBuffer = isSharedArrayBuffer;
      function isAsyncFunction(value) {
        return ObjectToString(value) === "[object AsyncFunction]";
      }
      exports2.isAsyncFunction = isAsyncFunction;
      function isMapIterator(value) {
        return ObjectToString(value) === "[object Map Iterator]";
      }
      exports2.isMapIterator = isMapIterator;
      function isSetIterator(value) {
        return ObjectToString(value) === "[object Set Iterator]";
      }
      exports2.isSetIterator = isSetIterator;
      function isGeneratorObject(value) {
        return ObjectToString(value) === "[object Generator]";
      }
      exports2.isGeneratorObject = isGeneratorObject;
      function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === "[object WebAssembly.Module]";
      }
      exports2.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
      function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue);
      }
      exports2.isNumberObject = isNumberObject;
      function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue);
      }
      exports2.isStringObject = isStringObject;
      function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue);
      }
      exports2.isBooleanObject = isBooleanObject;
      function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
      }
      exports2.isBigIntObject = isBigIntObject;
      function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
      }
      exports2.isSymbolObject = isSymbolObject;
      function isBoxedPrimitive(value) {
        return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
      }
      exports2.isBoxedPrimitive = isBoxedPrimitive;
      function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
      }
      exports2.isAnyArrayBuffer = isAnyArrayBuffer;
      ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
        Object.defineProperty(exports2, method, {
          enumerable: false,
          value: function() {
            throw new Error(method + " is not supported in userland");
          }
        });
      });
    }
  });

  // node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS({
    "node_modules/util/support/isBufferBrowser.js"(exports2, module2) {
      module2.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }
  });

  // node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "node_modules/inherits/inherits_browser.js"(exports2, module2) {
      if (typeof Object.create === "function") {
        module2.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module2.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {
            };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });

  // node_modules/util/util.js
  var require_util = __commonJS({
    "node_modules/util/util.js"(exports2) {
      var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };
      var formatRegExp = /%[sdj%]/g;
      exports2.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x2) {
          if (x2 === "%%") return "%";
          if (i >= len) return x2;
          switch (x2) {
            case "%s":
              return String(args[i++]);
            case "%d":
              return Number(args[i++]);
            case "%j":
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return "[Circular]";
              }
            default:
              return x2;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += " " + x;
          } else {
            str += " " + inspect(x);
          }
        }
        return str;
      };
      exports2.deprecate = function(fn, msg) {
        if (typeof process !== "undefined" && process.noDeprecation === true) {
          return fn;
        }
        if (typeof process === "undefined") {
          return function() {
            return exports2.deprecate(fn, msg).apply(this, arguments);
          };
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      };
      var debugs = {};
      var debugEnvRegex = /^$/;
      if (process.env.NODE_DEBUG) {
        debugEnv = process.env.NODE_DEBUG;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
        debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
      }
      var debugEnv;
      exports2.debuglog = function(set) {
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (debugEnvRegex.test(set)) {
            var pid = process.pid;
            debugs[set] = function() {
              var msg = exports2.format.apply(exports2, arguments);
              console.error("%s %d: %s", set, pid, msg);
            };
          } else {
            debugs[set] = function() {
            };
          }
        }
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          ctx.showHidden = opts;
        } else if (opts) {
          exports2._extend(ctx, opts);
        }
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports2.inspect = inspect;
      inspect.colors = {
        "bold": [1, 22],
        "italic": [3, 23],
        "underline": [4, 24],
        "inverse": [7, 27],
        "white": [37, 39],
        "grey": [90, 39],
        "black": [30, 39],
        "blue": [34, 39],
        "cyan": [36, 39],
        "green": [32, 39],
        "magenta": [35, 39],
        "red": [31, 39],
        "yellow": [33, 39]
      };
      inspect.styles = {
        "special": "cyan",
        "number": "yellow",
        "boolean": "yellow",
        "undefined": "grey",
        "null": "bold",
        "string": "green",
        "date": "magenta",
        // "name": intentionally not styling
        "regexp": "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        if (style) {
          return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
        } else {
          return str;
        }
      }
      function stylizeNoColor(str, styleType) {
        return str;
      }
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
        value.inspect !== exports2.inspect && // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
          return formatError(value);
        }
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), "date");
          }
          if (isError(value)) {
            return formatError(value);
          }
        }
        var base2 = "", array = false, braces = ["{", "}"];
        if (isArray(value)) {
          array = true;
          braces = ["[", "]"];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base2 = " [Function" + n + "]";
        }
        if (isRegExp(value)) {
          base2 = " " + RegExp.prototype.toString.call(value);
        }
        if (isDate(value)) {
          base2 = " " + Date.prototype.toUTCString.call(value);
        }
        if (isError(value)) {
          base2 = " " + formatError(value);
        }
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base2 + braces[1];
        }
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          } else {
            return ctx.stylize("[Object]", "special");
          }
        }
        ctx.seen.push(value);
        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }
        ctx.seen.pop();
        return reduceToSingleString(output, base2, braces);
      }
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value))
          return ctx.stylize("" + value, "number");
        if (isBoolean(value))
          return ctx.stylize("" + value, "boolean");
        if (isNull(value))
          return ctx.stylize("null", "null");
      }
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              String(i),
              true
            ));
          } else {
            output.push("");
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              true
            ));
          }
        });
        return output;
      }
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (desc.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = "[" + key + "]";
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf("\n") > -1) {
              if (array) {
                str = str.split("\n").map(function(line) {
                  return "  " + line;
                }).join("\n").slice(2);
              } else {
                str = "\n" + str.split("\n").map(function(line) {
                  return "   " + line;
                }).join("\n");
              }
            }
          } else {
            str = ctx.stylize("[Circular]", "special");
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.slice(1, -1);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      function reduceToSingleString(output, base2, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf("\n") >= 0) numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) {
          return braces[0] + (base2 === "" ? "" : base2 + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        }
        return braces[0] + base2 + " " + output.join(", ") + " " + braces[1];
      }
      exports2.types = require_types();
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports2.isArray = isArray;
      function isBoolean(arg) {
        return typeof arg === "boolean";
      }
      exports2.isBoolean = isBoolean;
      function isNull(arg) {
        return arg === null;
      }
      exports2.isNull = isNull;
      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports2.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return typeof arg === "number";
      }
      exports2.isNumber = isNumber;
      function isString(arg) {
        return typeof arg === "string";
      }
      exports2.isString = isString;
      function isSymbol(arg) {
        return typeof arg === "symbol";
      }
      exports2.isSymbol = isSymbol;
      function isUndefined(arg) {
        return arg === void 0;
      }
      exports2.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject(re) && objectToString(re) === "[object RegExp]";
      }
      exports2.isRegExp = isRegExp;
      exports2.types.isRegExp = isRegExp;
      function isObject(arg) {
        return typeof arg === "object" && arg !== null;
      }
      exports2.isObject = isObject;
      function isDate(d) {
        return isObject(d) && objectToString(d) === "[object Date]";
      }
      exports2.isDate = isDate;
      exports2.types.isDate = isDate;
      function isError(e) {
        return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
      }
      exports2.isError = isError;
      exports2.types.isNativeError = isError;
      function isFunction(arg) {
        return typeof arg === "function";
      }
      exports2.isFunction = isFunction;
      function isPrimitive(arg) {
        return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
        typeof arg === "undefined";
      }
      exports2.isPrimitive = isPrimitive;
      exports2.isBuffer = require_isBufferBrowser();
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      function timestamp() {
        var d = /* @__PURE__ */ new Date();
        var time = [
          pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())
        ].join(":");
        return [d.getDate(), months[d.getMonth()], time].join(" ");
      }
      exports2.log = function() {
        console.log("%s - %s", timestamp(), exports2.format.apply(exports2, arguments));
      };
      exports2.inherits = require_inherits_browser();
      exports2._extend = function(origin, add2) {
        if (!add2 || !isObject(add2)) return origin;
        var keys = Object.keys(add2);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add2[keys[i]];
        }
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
      var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? /* @__PURE__ */ Symbol("util.promisify.custom") : void 0;
      exports2.promisify = function promisify(original) {
        if (typeof original !== "function")
          throw new TypeError('The "original" argument must be of type Function');
        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
          var fn = original[kCustomPromisifiedSymbol];
          if (typeof fn !== "function") {
            throw new TypeError('The "util.promisify.custom" argument must be of type Function');
          }
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
          return fn;
        }
        function fn() {
          var promiseResolve, promiseReject;
          var promise = new Promise(function(resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
          });
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          args.push(function(err, value) {
            if (err) {
              promiseReject(err);
            } else {
              promiseResolve(value);
            }
          });
          try {
            original.apply(this, args);
          } catch (err) {
            promiseReject(err);
          }
          return promise;
        }
        Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
        if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return Object.defineProperties(
          fn,
          getOwnPropertyDescriptors(original)
        );
      };
      exports2.promisify.custom = kCustomPromisifiedSymbol;
      function callbackifyOnRejected(reason, cb) {
        if (!reason) {
          var newReason = new Error("Promise was rejected with a falsy value");
          newReason.reason = reason;
          reason = newReason;
        }
        return cb(reason);
      }
      function callbackify(original) {
        if (typeof original !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        function callbackified() {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          var maybeCb = args.pop();
          if (typeof maybeCb !== "function") {
            throw new TypeError("The last argument must be of type Function");
          }
          var self2 = this;
          var cb = function() {
            return maybeCb.apply(self2, arguments);
          };
          original.apply(this, args).then(
            function(ret) {
              process.nextTick(cb.bind(null, null, ret));
            },
            function(rej) {
              process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
            }
          );
        }
        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
        Object.defineProperties(
          callbackified,
          getOwnPropertyDescriptors(original)
        );
        return callbackified;
      }
      exports2.callbackify = callbackify;
    }
  });

  // node_modules/assert/build/internal/errors.js
  var require_errors = __commonJS({
    "node_modules/assert/build/internal/errors.js"(exports2, module2) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
        Object.defineProperty(subClass, "prototype", { writable: false });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
          var Super = _getPrototypeOf(Derived), result;
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }
          return _possibleConstructorReturn(this, result);
        };
      }
      function _possibleConstructorReturn(self2, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        } else if (call !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }
        return _assertThisInitialized(self2);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      var codes = {};
      var assert;
      var util;
      function createErrorType(code, message, Base) {
        if (!Base) {
          Base = Error;
        }
        function getMessage(arg1, arg2, arg3) {
          if (typeof message === "string") {
            return message;
          } else {
            return message(arg1, arg2, arg3);
          }
        }
        var NodeError = /* @__PURE__ */ (function(_Base) {
          _inherits(NodeError2, _Base);
          var _super = _createSuper(NodeError2);
          function NodeError2(arg1, arg2, arg3) {
            var _this;
            _classCallCheck(this, NodeError2);
            _this = _super.call(this, getMessage(arg1, arg2, arg3));
            _this.code = code;
            return _this;
          }
          return _createClass(NodeError2);
        })(Base);
        codes[code] = NodeError;
      }
      function oneOf(expected, thing) {
        if (Array.isArray(expected)) {
          var len = expected.length;
          expected = expected.map(function(i) {
            return String(i);
          });
          if (len > 2) {
            return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
          } else if (len === 2) {
            return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
          } else {
            return "of ".concat(thing, " ").concat(expected[0]);
          }
        } else {
          return "of ".concat(thing, " ").concat(String(expected));
        }
      }
      function startsWith(str, search, pos) {
        return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
      }
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function includes(str, search, start) {
        if (typeof start !== "number") {
          start = 0;
        }
        if (start + search.length > str.length) {
          return false;
        } else {
          return str.indexOf(search, start) !== -1;
        }
      }
      createErrorType("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError);
      createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
        if (assert === void 0) assert = require_assert();
        assert(typeof name === "string", "'name' must be a string");
        var determiner;
        if (typeof expected === "string" && startsWith(expected, "not ")) {
          determiner = "must not be";
          expected = expected.replace(/^not /, "");
        } else {
          determiner = "must be";
        }
        var msg;
        if (endsWith(name, " argument")) {
          msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        } else {
          var type = includes(name, ".") ? "property" : "argument";
          msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        }
        msg += ". Received type ".concat(_typeof(actual));
        return msg;
      }, TypeError);
      createErrorType("ERR_INVALID_ARG_VALUE", function(name, value) {
        var reason = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
        if (util === void 0) util = require_util();
        var inspected = util.inspect(value);
        if (inspected.length > 128) {
          inspected = "".concat(inspected.slice(0, 128), "...");
        }
        return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
      }, TypeError, RangeError);
      createErrorType("ERR_INVALID_RETURN_VALUE", function(input, name, value) {
        var type;
        if (value && value.constructor && value.constructor.name) {
          type = "instance of ".concat(value.constructor.name);
        } else {
          type = "type ".concat(_typeof(value));
        }
        return "Expected ".concat(input, ' to be returned from the "').concat(name, '"') + " function but got ".concat(type, ".");
      }, TypeError);
      createErrorType("ERR_MISSING_ARGS", function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (assert === void 0) assert = require_assert();
        assert(args.length > 0, "At least one arg needs to be specified");
        var msg = "The ";
        var len = args.length;
        args = args.map(function(a) {
          return '"'.concat(a, '"');
        });
        switch (len) {
          case 1:
            msg += "".concat(args[0], " argument");
            break;
          case 2:
            msg += "".concat(args[0], " and ").concat(args[1], " arguments");
            break;
          default:
            msg += args.slice(0, len - 1).join(", ");
            msg += ", and ".concat(args[len - 1], " arguments");
            break;
        }
        return "".concat(msg, " must be specified");
      }, TypeError);
      module2.exports.codes = codes;
    }
  });

  // node_modules/assert/build/internal/assert/assertion_error.js
  var require_assertion_error = __commonJS({
    "node_modules/assert/build/internal/assert/assertion_error.js"(exports2, module2) {
      "use strict";
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
        Object.defineProperty(subClass, "prototype", { writable: false });
        if (superClass) _setPrototypeOf(subClass, superClass);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
          var Super = _getPrototypeOf(Derived), result;
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else {
            result = Super.apply(this, arguments);
          }
          return _possibleConstructorReturn(this, result);
        };
      }
      function _possibleConstructorReturn(self2, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        } else if (call !== void 0) {
          throw new TypeError("Derived constructors may only return object or undefined");
        }
        return _assertThisInitialized(self2);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2)) return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2) _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      var _require = require_util();
      var inspect = _require.inspect;
      var _require2 = require_errors();
      var ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE;
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function repeat(str, count) {
        count = Math.floor(count);
        if (str.length == 0 || count == 0) return "";
        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
          str += str;
          count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
      }
      var blue = "";
      var green = "";
      var red = "";
      var white = "";
      var kReadableOperator = {
        deepStrictEqual: "Expected values to be strictly deep-equal:",
        strictEqual: "Expected values to be strictly equal:",
        strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
        deepEqual: "Expected values to be loosely deep-equal:",
        equal: "Expected values to be loosely equal:",
        notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
        notStrictEqual: 'Expected "actual" to be strictly unequal to:',
        notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
        notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
        notEqual: 'Expected "actual" to be loosely unequal to:',
        notIdentical: "Values identical but not reference-equal:"
      };
      var kMaxShortLength = 10;
      function copyError(source) {
        var keys = Object.keys(source);
        var target = Object.create(Object.getPrototypeOf(source));
        keys.forEach(function(key) {
          target[key] = source[key];
        });
        Object.defineProperty(target, "message", {
          value: source.message
        });
        return target;
      }
      function inspectValue(val) {
        return inspect(val, {
          compact: false,
          customInspect: false,
          depth: 1e3,
          maxArrayLength: Infinity,
          // Assert compares only enumerable properties (with a few exceptions).
          showHidden: false,
          // Having a long line as error is better than wrapping the line for
          // comparison for now.
          // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
          // have meta information about the inspected properties (i.e., know where
          // in what line the property starts and ends).
          breakLength: Infinity,
          // Assert does not detect proxies currently.
          showProxy: false,
          sorted: true,
          // Inspect getters as we also check them when comparing entries.
          getters: true
        });
      }
      function createErrDiff(actual, expected, operator) {
        var other = "";
        var res = "";
        var lastPos = 0;
        var end = "";
        var skipped = false;
        var actualInspected = inspectValue(actual);
        var actualLines = actualInspected.split("\n");
        var expectedLines = inspectValue(expected).split("\n");
        var i = 0;
        var indicator = "";
        if (operator === "strictEqual" && _typeof(actual) === "object" && _typeof(expected) === "object" && actual !== null && expected !== null) {
          operator = "strictEqualObject";
        }
        if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
          var inputLength = actualLines[0].length + expectedLines[0].length;
          if (inputLength <= kMaxShortLength) {
            if ((_typeof(actual) !== "object" || actual === null) && (_typeof(expected) !== "object" || expected === null) && (actual !== 0 || expected !== 0)) {
              return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
            }
          } else if (operator !== "strictEqualObject") {
            var maxLength = process.stderr && process.stderr.isTTY ? process.stderr.columns : 80;
            if (inputLength < maxLength) {
              while (actualLines[0][i] === expectedLines[0][i]) {
                i++;
              }
              if (i > 2) {
                indicator = "\n  ".concat(repeat(" ", i), "^");
                i = 0;
              }
            }
          }
        }
        var a = actualLines[actualLines.length - 1];
        var b = expectedLines[expectedLines.length - 1];
        while (a === b) {
          if (i++ < 2) {
            end = "\n  ".concat(a).concat(end);
          } else {
            other = a;
          }
          actualLines.pop();
          expectedLines.pop();
          if (actualLines.length === 0 || expectedLines.length === 0) break;
          a = actualLines[actualLines.length - 1];
          b = expectedLines[expectedLines.length - 1];
        }
        var maxLines = Math.max(actualLines.length, expectedLines.length);
        if (maxLines === 0) {
          var _actualLines = actualInspected.split("\n");
          if (_actualLines.length > 30) {
            _actualLines[26] = "".concat(blue, "...").concat(white);
            while (_actualLines.length > 27) {
              _actualLines.pop();
            }
          }
          return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join("\n"), "\n");
        }
        if (i > 3) {
          end = "\n".concat(blue, "...").concat(white).concat(end);
          skipped = true;
        }
        if (other !== "") {
          end = "\n  ".concat(other).concat(end);
          other = "";
        }
        var printedLines = 0;
        var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
        var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
        for (i = 0; i < maxLines; i++) {
          var cur = i - lastPos;
          if (actualLines.length < i + 1) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(expectedLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(expectedLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
            printedLines++;
          } else if (expectedLines.length < i + 1) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(actualLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(actualLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
            printedLines++;
          } else {
            var expectedLine = expectedLines[i];
            var actualLine = actualLines[i];
            var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ",") || actualLine.slice(0, -1) !== expectedLine);
            if (divergingLines && endsWith(expectedLine, ",") && expectedLine.slice(0, -1) === actualLine) {
              divergingLines = false;
              actualLine += ",";
            }
            if (divergingLines) {
              if (cur > 1 && i > 2) {
                if (cur > 4) {
                  res += "\n".concat(blue, "...").concat(white);
                  skipped = true;
                } else if (cur > 3) {
                  res += "\n  ".concat(actualLines[i - 2]);
                  printedLines++;
                }
                res += "\n  ".concat(actualLines[i - 1]);
                printedLines++;
              }
              lastPos = i;
              res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
              other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
              printedLines += 2;
            } else {
              res += other;
              other = "";
              if (cur === 1 || i === 0) {
                res += "\n  ".concat(actualLine);
                printedLines++;
              }
            }
          }
          if (printedLines > 20 && i < maxLines - 2) {
            return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
          }
        }
        return "".concat(msg).concat(skipped ? skippedMsg : "", "\n").concat(res).concat(other).concat(end).concat(indicator);
      }
      var AssertionError = /* @__PURE__ */ (function(_Error, _inspect$custom) {
        _inherits(AssertionError2, _Error);
        var _super = _createSuper(AssertionError2);
        function AssertionError2(options) {
          var _this;
          _classCallCheck(this, AssertionError2);
          if (_typeof(options) !== "object" || options === null) {
            throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
          }
          var message = options.message, operator = options.operator, stackStartFn = options.stackStartFn;
          var actual = options.actual, expected = options.expected;
          var limit = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          if (message != null) {
            _this = _super.call(this, String(message));
          } else {
            if (process.stderr && process.stderr.isTTY) {
              if (process.stderr && process.stderr.getColorDepth && process.stderr.getColorDepth() !== 1) {
                blue = "\x1B[34m";
                green = "\x1B[32m";
                white = "\x1B[39m";
                red = "\x1B[31m";
              } else {
                blue = "";
                green = "";
                white = "";
                red = "";
              }
            }
            if (_typeof(actual) === "object" && actual !== null && _typeof(expected) === "object" && expected !== null && "stack" in actual && actual instanceof Error && "stack" in expected && expected instanceof Error) {
              actual = copyError(actual);
              expected = copyError(expected);
            }
            if (operator === "deepStrictEqual" || operator === "strictEqual") {
              _this = _super.call(this, createErrDiff(actual, expected, operator));
            } else if (operator === "notDeepStrictEqual" || operator === "notStrictEqual") {
              var base2 = kReadableOperator[operator];
              var res = inspectValue(actual).split("\n");
              if (operator === "notStrictEqual" && _typeof(actual) === "object" && actual !== null) {
                base2 = kReadableOperator.notStrictEqualObject;
              }
              if (res.length > 30) {
                res[26] = "".concat(blue, "...").concat(white);
                while (res.length > 27) {
                  res.pop();
                }
              }
              if (res.length === 1) {
                _this = _super.call(this, "".concat(base2, " ").concat(res[0]));
              } else {
                _this = _super.call(this, "".concat(base2, "\n\n").concat(res.join("\n"), "\n"));
              }
            } else {
              var _res = inspectValue(actual);
              var other = "";
              var knownOperators = kReadableOperator[operator];
              if (operator === "notDeepEqual" || operator === "notEqual") {
                _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);
                if (_res.length > 1024) {
                  _res = "".concat(_res.slice(0, 1021), "...");
                }
              } else {
                other = "".concat(inspectValue(expected));
                if (_res.length > 512) {
                  _res = "".concat(_res.slice(0, 509), "...");
                }
                if (other.length > 512) {
                  other = "".concat(other.slice(0, 509), "...");
                }
                if (operator === "deepEqual" || operator === "equal") {
                  _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
                } else {
                  other = " ".concat(operator, " ").concat(other);
                }
              }
              _this = _super.call(this, "".concat(_res).concat(other));
            }
          }
          Error.stackTraceLimit = limit;
          _this.generatedMessage = !message;
          Object.defineProperty(_assertThisInitialized(_this), "name", {
            value: "AssertionError [ERR_ASSERTION]",
            enumerable: false,
            writable: true,
            configurable: true
          });
          _this.code = "ERR_ASSERTION";
          _this.actual = actual;
          _this.expected = expected;
          _this.operator = operator;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
          }
          _this.stack;
          _this.name = "AssertionError";
          return _possibleConstructorReturn(_this);
        }
        _createClass(AssertionError2, [{
          key: "toString",
          value: function toString() {
            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
          }
        }, {
          key: _inspect$custom,
          value: function value(recurseTimes, ctx) {
            return inspect(this, _objectSpread(_objectSpread({}, ctx), {}, {
              customInspect: false,
              depth: 0
            }));
          }
        }]);
        return AssertionError2;
      })(/* @__PURE__ */ _wrapNativeSuper(Error), inspect.custom);
      module2.exports = AssertionError;
    }
  });

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports2, module2) {
      "use strict";
      var toStr = Object.prototype.toString;
      module2.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/object-keys/implementation.js"(exports2, module2) {
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = (function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        })();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module2.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports2, module2) {
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation2();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = (function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          })(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module2.exports = keysShim;
    }
  });

  // node_modules/object.assign/implementation.js
  var require_implementation3 = __commonJS({
    "node_modules/object.assign/implementation.js"(exports2, module2) {
      "use strict";
      var objectKeys = require_object_keys();
      var hasSymbols = require_shams()();
      var callBound = require_call_bound();
      var $Object = require_es_object_atoms();
      var $push = callBound("Array.prototype.push");
      var $propIsEnumerable = callBound("Object.prototype.propertyIsEnumerable");
      var originalGetSymbols = hasSymbols ? $Object.getOwnPropertySymbols : null;
      module2.exports = function assign(target, source1) {
        if (target == null) {
          throw new TypeError("target must be an object");
        }
        var to = $Object(target);
        if (arguments.length === 1) {
          return to;
        }
        for (var s = 1; s < arguments.length; ++s) {
          var from = $Object(arguments[s]);
          var keys = objectKeys(from);
          var getSymbols = hasSymbols && ($Object.getOwnPropertySymbols || originalGetSymbols);
          if (getSymbols) {
            var syms = getSymbols(from);
            for (var j = 0; j < syms.length; ++j) {
              var key = syms[j];
              if ($propIsEnumerable(from, key)) {
                $push(keys, key);
              }
            }
          }
          for (var i = 0; i < keys.length; ++i) {
            var nextKey = keys[i];
            if ($propIsEnumerable(from, nextKey)) {
              var propValue = from[nextKey];
              to[nextKey] = propValue;
            }
          }
        }
        return to;
      };
    }
  });

  // node_modules/object.assign/polyfill.js
  var require_polyfill = __commonJS({
    "node_modules/object.assign/polyfill.js"(exports2, module2) {
      "use strict";
      var implementation = require_implementation3();
      var lacksProperEnumerationOrder = function() {
        if (!Object.assign) {
          return false;
        }
        var str = "abcdefghijklmnopqrst";
        var letters = str.split("");
        var map = {};
        for (var i = 0; i < letters.length; ++i) {
          map[letters[i]] = letters[i];
        }
        var obj = Object.assign({}, map);
        var actual = "";
        for (var k in obj) {
          actual += k;
        }
        return str !== actual;
      };
      var assignHasPendingExceptions = function() {
        if (!Object.assign || !Object.preventExtensions) {
          return false;
        }
        var thrower = Object.preventExtensions({ 1: 2 });
        try {
          Object.assign(thrower, "xy");
        } catch (e) {
          return thrower[1] === "y";
        }
        return false;
      };
      module2.exports = function getPolyfill() {
        if (!Object.assign) {
          return implementation;
        }
        if (lacksProperEnumerationOrder()) {
          return implementation;
        }
        if (assignHasPendingExceptions()) {
          return implementation;
        }
        return Object.assign;
      };
    }
  });

  // node_modules/object-is/implementation.js
  var require_implementation4 = __commonJS({
    "node_modules/object-is/implementation.js"(exports2, module2) {
      "use strict";
      var numberIsNaN = function(value) {
        return value !== value;
      };
      module2.exports = function is(a, b) {
        if (a === 0 && b === 0) {
          return 1 / a === 1 / b;
        }
        if (a === b) {
          return true;
        }
        if (numberIsNaN(a) && numberIsNaN(b)) {
          return true;
        }
        return false;
      };
    }
  });

  // node_modules/object-is/polyfill.js
  var require_polyfill2 = __commonJS({
    "node_modules/object-is/polyfill.js"(exports2, module2) {
      "use strict";
      var implementation = require_implementation4();
      module2.exports = function getPolyfill() {
        return typeof Object.is === "function" ? Object.is : implementation;
      };
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports2, module2) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module2.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
    }
  });

  // node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "node_modules/define-properties/index.js"(exports2, module2) {
      "use strict";
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof /* @__PURE__ */ Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var defineDataProperty = require_define_data_property();
      var isFunction = function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      };
      var supportsDescriptors = require_has_property_descriptors()();
      var defineProperty = function(object, name, value, predicate) {
        if (name in object) {
          if (predicate === true) {
            if (object[name] === value) {
              return;
            }
          } else if (!isFunction(predicate) || !predicate()) {
            return;
          }
        }
        if (supportsDescriptors) {
          defineDataProperty(object, name, value, true);
        } else {
          defineDataProperty(object, name, value);
        }
      };
      var defineProperties = function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      };
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module2.exports = defineProperties;
    }
  });

  // node_modules/object-is/shim.js
  var require_shim = __commonJS({
    "node_modules/object-is/shim.js"(exports2, module2) {
      "use strict";
      var getPolyfill = require_polyfill2();
      var define2 = require_define_properties();
      module2.exports = function shimObjectIs() {
        var polyfill = getPolyfill();
        define2(Object, { is: polyfill }, {
          is: function testObjectIs() {
            return Object.is !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // node_modules/object-is/index.js
  var require_object_is = __commonJS({
    "node_modules/object-is/index.js"(exports2, module2) {
      "use strict";
      var define2 = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation4();
      var getPolyfill = require_polyfill2();
      var shim = require_shim();
      var polyfill = callBind(getPolyfill(), Object);
      define2(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module2.exports = polyfill;
    }
  });

  // node_modules/is-nan/implementation.js
  var require_implementation5 = __commonJS({
    "node_modules/is-nan/implementation.js"(exports2, module2) {
      "use strict";
      module2.exports = function isNaN2(value) {
        return value !== value;
      };
    }
  });

  // node_modules/is-nan/polyfill.js
  var require_polyfill3 = __commonJS({
    "node_modules/is-nan/polyfill.js"(exports2, module2) {
      "use strict";
      var implementation = require_implementation5();
      module2.exports = function getPolyfill() {
        if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a")) {
          return Number.isNaN;
        }
        return implementation;
      };
    }
  });

  // node_modules/is-nan/shim.js
  var require_shim2 = __commonJS({
    "node_modules/is-nan/shim.js"(exports2, module2) {
      "use strict";
      var define2 = require_define_properties();
      var getPolyfill = require_polyfill3();
      module2.exports = function shimNumberIsNaN() {
        var polyfill = getPolyfill();
        define2(Number, { isNaN: polyfill }, {
          isNaN: function testIsNaN() {
            return Number.isNaN !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // node_modules/is-nan/index.js
  var require_is_nan = __commonJS({
    "node_modules/is-nan/index.js"(exports2, module2) {
      "use strict";
      var callBind = require_call_bind();
      var define2 = require_define_properties();
      var implementation = require_implementation5();
      var getPolyfill = require_polyfill3();
      var shim = require_shim2();
      var polyfill = callBind(getPolyfill(), Number);
      define2(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module2.exports = polyfill;
    }
  });

  // node_modules/assert/build/internal/util/comparisons.js
  var require_comparisons = __commonJS({
    "node_modules/assert/build/internal/util/comparisons.js"(exports2, module2) {
      "use strict";
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t) return;
              f = false;
            } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
            } finally {
              if (o) throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      var regexFlagsSupported = /a/g.flags !== void 0;
      var arrayFromSet = function arrayFromSet2(set) {
        var array = [];
        set.forEach(function(value) {
          return array.push(value);
        });
        return array;
      };
      var arrayFromMap = function arrayFromMap2(map) {
        var array = [];
        map.forEach(function(value, key) {
          return array.push([key, value]);
        });
        return array;
      };
      var objectIs = Object.is ? Object.is : require_object_is();
      var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
        return [];
      };
      var numberIsNaN = Number.isNaN ? Number.isNaN : require_is_nan();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
      var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
      var objectToString = uncurryThis(Object.prototype.toString);
      var _require$types = require_util().types;
      var isAnyArrayBuffer = _require$types.isAnyArrayBuffer;
      var isArrayBufferView = _require$types.isArrayBufferView;
      var isDate = _require$types.isDate;
      var isMap = _require$types.isMap;
      var isRegExp = _require$types.isRegExp;
      var isSet = _require$types.isSet;
      var isNativeError = _require$types.isNativeError;
      var isBoxedPrimitive = _require$types.isBoxedPrimitive;
      var isNumberObject = _require$types.isNumberObject;
      var isStringObject = _require$types.isStringObject;
      var isBooleanObject = _require$types.isBooleanObject;
      var isBigIntObject = _require$types.isBigIntObject;
      var isSymbolObject = _require$types.isSymbolObject;
      var isFloat32Array = _require$types.isFloat32Array;
      var isFloat64Array = _require$types.isFloat64Array;
      function isNonIndex(key) {
        if (key.length === 0 || key.length > 10) return true;
        for (var i = 0; i < key.length; i++) {
          var code = key.charCodeAt(i);
          if (code < 48 || code > 57) return true;
        }
        return key.length === 10 && key >= Math.pow(2, 32);
      }
      function getOwnNonIndexProperties(value) {
        return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
      }
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */
      function compare(a, b) {
        if (a === b) {
          return 0;
        }
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) {
          return -1;
        }
        if (y < x) {
          return 1;
        }
        return 0;
      }
      var ONLY_ENUMERABLE = void 0;
      var kStrict = true;
      var kLoose = false;
      var kNoIterator = 0;
      var kIsArray = 1;
      var kIsSet = 2;
      var kIsMap = 3;
      function areSimilarRegExps(a, b) {
        return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
      }
      function areSimilarFloatArrays(a, b) {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        for (var offset = 0; offset < a.byteLength; offset++) {
          if (a[offset] !== b[offset]) {
            return false;
          }
        }
        return true;
      }
      function areSimilarTypedArrays(a, b) {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
      }
      function areEqualArrayBuffers(buf1, buf2) {
        return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
      }
      function isEqualBoxedPrimitive(val1, val2) {
        if (isNumberObject(val1)) {
          return isNumberObject(val2) && objectIs(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
        }
        if (isStringObject(val1)) {
          return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
        }
        if (isBooleanObject(val1)) {
          return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
        }
        if (isBigIntObject(val1)) {
          return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
        }
        return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
      }
      function innerDeepEqual(val1, val2, strict, memos) {
        if (val1 === val2) {
          if (val1 !== 0) return true;
          return strict ? objectIs(val1, val2) : true;
        }
        if (strict) {
          if (_typeof(val1) !== "object") {
            return typeof val1 === "number" && numberIsNaN(val1) && numberIsNaN(val2);
          }
          if (_typeof(val2) !== "object" || val1 === null || val2 === null) {
            return false;
          }
          if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
            return false;
          }
        } else {
          if (val1 === null || _typeof(val1) !== "object") {
            if (val2 === null || _typeof(val2) !== "object") {
              return val1 == val2;
            }
            return false;
          }
          if (val2 === null || _typeof(val2) !== "object") {
            return false;
          }
        }
        var val1Tag = objectToString(val1);
        var val2Tag = objectToString(val2);
        if (val1Tag !== val2Tag) {
          return false;
        }
        if (Array.isArray(val1)) {
          if (val1.length !== val2.length) {
            return false;
          }
          var keys1 = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
          var keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
          if (keys1.length !== keys2.length) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
        }
        if (val1Tag === "[object Object]") {
          if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
            return false;
          }
        }
        if (isDate(val1)) {
          if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
            return false;
          }
        } else if (isRegExp(val1)) {
          if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
            return false;
          }
        } else if (isNativeError(val1) || val1 instanceof Error) {
          if (val1.message !== val2.message || val1.name !== val2.name) {
            return false;
          }
        } else if (isArrayBufferView(val1)) {
          if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
            if (!areSimilarFloatArrays(val1, val2)) {
              return false;
            }
          } else if (!areSimilarTypedArrays(val1, val2)) {
            return false;
          }
          var _keys = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
          var _keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
          if (_keys.length !== _keys2.length) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
        } else if (isSet(val1)) {
          if (!isSet(val2) || val1.size !== val2.size) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsSet);
        } else if (isMap(val1)) {
          if (!isMap(val2) || val1.size !== val2.size) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsMap);
        } else if (isAnyArrayBuffer(val1)) {
          if (!areEqualArrayBuffers(val1, val2)) {
            return false;
          }
        } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kNoIterator);
      }
      function getEnumerables(val, keys) {
        return keys.filter(function(k) {
          return propertyIsEnumerable(val, k);
        });
      }
      function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
        if (arguments.length === 5) {
          aKeys = Object.keys(val1);
          var bKeys = Object.keys(val2);
          if (aKeys.length !== bKeys.length) {
            return false;
          }
        }
        var i = 0;
        for (; i < aKeys.length; i++) {
          if (!hasOwnProperty(val2, aKeys[i])) {
            return false;
          }
        }
        if (strict && arguments.length === 5) {
          var symbolKeysA = objectGetOwnPropertySymbols(val1);
          if (symbolKeysA.length !== 0) {
            var count = 0;
            for (i = 0; i < symbolKeysA.length; i++) {
              var key = symbolKeysA[i];
              if (propertyIsEnumerable(val1, key)) {
                if (!propertyIsEnumerable(val2, key)) {
                  return false;
                }
                aKeys.push(key);
                count++;
              } else if (propertyIsEnumerable(val2, key)) {
                return false;
              }
            }
            var symbolKeysB = objectGetOwnPropertySymbols(val2);
            if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
              return false;
            }
          } else {
            var _symbolKeysB = objectGetOwnPropertySymbols(val2);
            if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
              return false;
            }
          }
        }
        if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
          return true;
        }
        if (memos === void 0) {
          memos = {
            val1: /* @__PURE__ */ new Map(),
            val2: /* @__PURE__ */ new Map(),
            position: 0
          };
        } else {
          var val2MemoA = memos.val1.get(val1);
          if (val2MemoA !== void 0) {
            var val2MemoB = memos.val2.get(val2);
            if (val2MemoB !== void 0) {
              return val2MemoA === val2MemoB;
            }
          }
          memos.position++;
        }
        memos.val1.set(val1, memos.position);
        memos.val2.set(val2, memos.position);
        var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
        memos.val1.delete(val1);
        memos.val2.delete(val2);
        return areEq;
      }
      function setHasEqualElement(set, val1, strict, memo) {
        var setValues = arrayFromSet(set);
        for (var i = 0; i < setValues.length; i++) {
          var val2 = setValues[i];
          if (innerDeepEqual(val1, val2, strict, memo)) {
            set.delete(val2);
            return true;
          }
        }
        return false;
      }
      function findLooseMatchingPrimitives(prim) {
        switch (_typeof(prim)) {
          case "undefined":
            return null;
          case "object":
            return void 0;
          case "symbol":
            return false;
          case "string":
            prim = +prim;
          // Loose equal entries exist only if the string is possible to convert to
          // a regular number and not NaN.
          // Fall through
          case "number":
            if (numberIsNaN(prim)) {
              return false;
            }
        }
        return true;
      }
      function setMightHaveLoosePrim(a, b, prim) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) return altValue;
        return b.has(altValue) && !a.has(altValue);
      }
      function mapMightHaveLoosePrim(a, b, prim, item, memo) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) {
          return altValue;
        }
        var curB = b.get(altValue);
        if (curB === void 0 && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
          return false;
        }
        return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
      }
      function setEquiv(a, b, strict, memo) {
        var set = null;
        var aValues = arrayFromSet(a);
        for (var i = 0; i < aValues.length; i++) {
          var val = aValues[i];
          if (_typeof(val) === "object" && val !== null) {
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(val);
          } else if (!b.has(val)) {
            if (strict) return false;
            if (!setMightHaveLoosePrim(a, b, val)) {
              return false;
            }
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(val);
          }
        }
        if (set !== null) {
          var bValues = arrayFromSet(b);
          for (var _i = 0; _i < bValues.length; _i++) {
            var _val = bValues[_i];
            if (_typeof(_val) === "object" && _val !== null) {
              if (!setHasEqualElement(set, _val, strict, memo)) return false;
            } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
              return false;
            }
          }
          return set.size === 0;
        }
        return true;
      }
      function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
        var setValues = arrayFromSet(set);
        for (var i = 0; i < setValues.length; i++) {
          var key2 = setValues[i];
          if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
            set.delete(key2);
            return true;
          }
        }
        return false;
      }
      function mapEquiv(a, b, strict, memo) {
        var set = null;
        var aEntries = arrayFromMap(a);
        for (var i = 0; i < aEntries.length; i++) {
          var _aEntries$i = _slicedToArray(aEntries[i], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
          if (_typeof(key) === "object" && key !== null) {
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(key);
          } else {
            var item2 = b.get(key);
            if (item2 === void 0 && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
              if (strict) return false;
              if (!mapMightHaveLoosePrim(a, b, key, item1, memo)) return false;
              if (set === null) {
                set = /* @__PURE__ */ new Set();
              }
              set.add(key);
            }
          }
        }
        if (set !== null) {
          var bEntries = arrayFromMap(b);
          for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
            var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), _key = _bEntries$_i[0], item = _bEntries$_i[1];
            if (_typeof(_key) === "object" && _key !== null) {
              if (!mapHasEqualEntry(set, a, _key, item, strict, memo)) return false;
            } else if (!strict && (!a.has(_key) || !innerDeepEqual(a.get(_key), item, false, memo)) && !mapHasEqualEntry(set, a, _key, item, false, memo)) {
              return false;
            }
          }
          return set.size === 0;
        }
        return true;
      }
      function objEquiv(a, b, strict, keys, memos, iterationType) {
        var i = 0;
        if (iterationType === kIsSet) {
          if (!setEquiv(a, b, strict, memos)) {
            return false;
          }
        } else if (iterationType === kIsMap) {
          if (!mapEquiv(a, b, strict, memos)) {
            return false;
          }
        } else if (iterationType === kIsArray) {
          for (; i < a.length; i++) {
            if (hasOwnProperty(a, i)) {
              if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
                return false;
              }
            } else if (hasOwnProperty(b, i)) {
              return false;
            } else {
              var keysA = Object.keys(a);
              for (; i < keysA.length; i++) {
                var key = keysA[i];
                if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
                  return false;
                }
              }
              if (keysA.length !== Object.keys(b).length) {
                return false;
              }
              return true;
            }
          }
        }
        for (i = 0; i < keys.length; i++) {
          var _key2 = keys[i];
          if (!innerDeepEqual(a[_key2], b[_key2], strict, memos)) {
            return false;
          }
        }
        return true;
      }
      function isDeepEqual(val1, val2) {
        return innerDeepEqual(val1, val2, kLoose);
      }
      function isDeepStrictEqual(val1, val2) {
        return innerDeepEqual(val1, val2, kStrict);
      }
      module2.exports = {
        isDeepEqual,
        isDeepStrictEqual
      };
    }
  });

  // node_modules/assert/build/assert.js
  var require_assert = __commonJS({
    "node_modules/assert/build/assert.js"(exports2, module2) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return _typeof(key) === "symbol" ? key : String(key);
      }
      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var _require = require_errors();
      var _require$codes = _require.codes;
      var ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT;
      var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
      var ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE;
      var ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE;
      var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
      var AssertionError = require_assertion_error();
      var _require2 = require_util();
      var inspect = _require2.inspect;
      var _require$types = require_util().types;
      var isPromise = _require$types.isPromise;
      var isRegExp = _require$types.isRegExp;
      var objectAssign = require_polyfill()();
      var objectIs = require_polyfill2()();
      var RegExpPrototypeTest = require_callBound()("RegExp.prototype.test");
      var isDeepEqual;
      var isDeepStrictEqual;
      function lazyLoadComparison() {
        var comparison = require_comparisons();
        isDeepEqual = comparison.isDeepEqual;
        isDeepStrictEqual = comparison.isDeepStrictEqual;
      }
      var warned = false;
      var assert = module2.exports = ok;
      var NO_EXCEPTION_SENTINEL = {};
      function innerFail(obj) {
        if (obj.message instanceof Error) throw obj.message;
        throw new AssertionError(obj);
      }
      function fail(actual, expected, message, operator, stackStartFn) {
        var argsLen = arguments.length;
        var internalMessage;
        if (argsLen === 0) {
          internalMessage = "Failed";
        } else if (argsLen === 1) {
          message = actual;
          actual = void 0;
        } else {
          if (warned === false) {
            warned = true;
            var warn = process.emitWarning ? process.emitWarning : console.warn.bind(console);
            warn("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
          }
          if (argsLen === 2) operator = "!=";
        }
        if (message instanceof Error) throw message;
        var errArgs = {
          actual,
          expected,
          operator: operator === void 0 ? "fail" : operator,
          stackStartFn: stackStartFn || fail
        };
        if (message !== void 0) {
          errArgs.message = message;
        }
        var err = new AssertionError(errArgs);
        if (internalMessage) {
          err.message = internalMessage;
          err.generatedMessage = true;
        }
        throw err;
      }
      assert.fail = fail;
      assert.AssertionError = AssertionError;
      function innerOk(fn, argLen, value, message) {
        if (!value) {
          var generatedMessage = false;
          if (argLen === 0) {
            generatedMessage = true;
            message = "No value argument passed to `assert.ok()`";
          } else if (message instanceof Error) {
            throw message;
          }
          var err = new AssertionError({
            actual: value,
            expected: true,
            message,
            operator: "==",
            stackStartFn: fn
          });
          err.generatedMessage = generatedMessage;
          throw err;
        }
      }
      function ok() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        innerOk.apply(void 0, [ok, args.length].concat(args));
      }
      assert.ok = ok;
      assert.equal = function equal2(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (actual != expected) {
          innerFail({
            actual,
            expected,
            message,
            operator: "==",
            stackStartFn: equal2
          });
        }
      };
      assert.notEqual = function notEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (actual == expected) {
          innerFail({
            actual,
            expected,
            message,
            operator: "!=",
            stackStartFn: notEqual
          });
        }
      };
      assert.deepEqual = function deepEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (!isDeepEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "deepEqual",
            stackStartFn: deepEqual
          });
        }
      };
      assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (isDeepEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notDeepEqual",
            stackStartFn: notDeepEqual
          });
        }
      };
      assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (!isDeepStrictEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "deepStrictEqual",
            stackStartFn: deepStrictEqual
          });
        }
      };
      assert.notDeepStrictEqual = notDeepStrictEqual;
      function notDeepStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        if (isDeepStrictEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notDeepStrictEqual",
            stackStartFn: notDeepStrictEqual
          });
        }
      }
      assert.strictEqual = function strictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (!objectIs(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "strictEqual",
            stackStartFn: strictEqual
          });
        }
      };
      assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (objectIs(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notStrictEqual",
            stackStartFn: notStrictEqual
          });
        }
      };
      var Comparison = /* @__PURE__ */ _createClass(function Comparison2(obj, keys, actual) {
        var _this = this;
        _classCallCheck(this, Comparison2);
        keys.forEach(function(key) {
          if (key in obj) {
            if (actual !== void 0 && typeof actual[key] === "string" && isRegExp(obj[key]) && RegExpPrototypeTest(obj[key], actual[key])) {
              _this[key] = actual[key];
            } else {
              _this[key] = obj[key];
            }
          }
        });
      });
      function compareExceptionKey(actual, expected, key, message, keys, fn) {
        if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
          if (!message) {
            var a = new Comparison(actual, keys);
            var b = new Comparison(expected, keys, actual);
            var err = new AssertionError({
              actual: a,
              expected: b,
              operator: "deepStrictEqual",
              stackStartFn: fn
            });
            err.actual = actual;
            err.expected = expected;
            err.operator = fn.name;
            throw err;
          }
          innerFail({
            actual,
            expected,
            message,
            operator: fn.name,
            stackStartFn: fn
          });
        }
      }
      function expectedException(actual, expected, msg, fn) {
        if (typeof expected !== "function") {
          if (isRegExp(expected)) return RegExpPrototypeTest(expected, actual);
          if (arguments.length === 2) {
            throw new ERR_INVALID_ARG_TYPE("expected", ["Function", "RegExp"], expected);
          }
          if (_typeof(actual) !== "object" || actual === null) {
            var err = new AssertionError({
              actual,
              expected,
              message: msg,
              operator: "deepStrictEqual",
              stackStartFn: fn
            });
            err.operator = fn.name;
            throw err;
          }
          var keys = Object.keys(expected);
          if (expected instanceof Error) {
            keys.push("name", "message");
          } else if (keys.length === 0) {
            throw new ERR_INVALID_ARG_VALUE("error", expected, "may not be an empty object");
          }
          if (isDeepEqual === void 0) lazyLoadComparison();
          keys.forEach(function(key) {
            if (typeof actual[key] === "string" && isRegExp(expected[key]) && RegExpPrototypeTest(expected[key], actual[key])) {
              return;
            }
            compareExceptionKey(actual, expected, key, msg, keys, fn);
          });
          return true;
        }
        if (expected.prototype !== void 0 && actual instanceof expected) {
          return true;
        }
        if (Error.isPrototypeOf(expected)) {
          return false;
        }
        return expected.call({}, actual) === true;
      }
      function getActual(fn) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", "Function", fn);
        }
        try {
          fn();
        } catch (e) {
          return e;
        }
        return NO_EXCEPTION_SENTINEL;
      }
      function checkIsPromise(obj) {
        return isPromise(obj) || obj !== null && _typeof(obj) === "object" && typeof obj.then === "function" && typeof obj.catch === "function";
      }
      function waitForActual(promiseFn) {
        return Promise.resolve().then(function() {
          var resultPromise;
          if (typeof promiseFn === "function") {
            resultPromise = promiseFn();
            if (!checkIsPromise(resultPromise)) {
              throw new ERR_INVALID_RETURN_VALUE("instance of Promise", "promiseFn", resultPromise);
            }
          } else if (checkIsPromise(promiseFn)) {
            resultPromise = promiseFn;
          } else {
            throw new ERR_INVALID_ARG_TYPE("promiseFn", ["Function", "Promise"], promiseFn);
          }
          return Promise.resolve().then(function() {
            return resultPromise;
          }).then(function() {
            return NO_EXCEPTION_SENTINEL;
          }).catch(function(e) {
            return e;
          });
        });
      }
      function expectsError(stackStartFn, actual, error, message) {
        if (typeof error === "string") {
          if (arguments.length === 4) {
            throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
          }
          if (_typeof(actual) === "object" && actual !== null) {
            if (actual.message === error) {
              throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error message "'.concat(actual.message, '" is identical to the message.'));
            }
          } else if (actual === error) {
            throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error "'.concat(actual, '" is identical to the message.'));
          }
          message = error;
          error = void 0;
        } else if (error != null && _typeof(error) !== "object" && typeof error !== "function") {
          throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
        }
        if (actual === NO_EXCEPTION_SENTINEL) {
          var details = "";
          if (error && error.name) {
            details += " (".concat(error.name, ")");
          }
          details += message ? ": ".concat(message) : ".";
          var fnType = stackStartFn.name === "rejects" ? "rejection" : "exception";
          innerFail({
            actual: void 0,
            expected: error,
            operator: stackStartFn.name,
            message: "Missing expected ".concat(fnType).concat(details),
            stackStartFn
          });
        }
        if (error && !expectedException(actual, error, message, stackStartFn)) {
          throw actual;
        }
      }
      function expectsNoError(stackStartFn, actual, error, message) {
        if (actual === NO_EXCEPTION_SENTINEL) return;
        if (typeof error === "string") {
          message = error;
          error = void 0;
        }
        if (!error || expectedException(actual, error)) {
          var details = message ? ": ".concat(message) : ".";
          var fnType = stackStartFn.name === "doesNotReject" ? "rejection" : "exception";
          innerFail({
            actual,
            expected: error,
            operator: stackStartFn.name,
            message: "Got unwanted ".concat(fnType).concat(details, "\n") + 'Actual message: "'.concat(actual && actual.message, '"'),
            stackStartFn
          });
        }
        throw actual;
      }
      assert.throws = function throws(promiseFn) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
      };
      assert.rejects = function rejects(promiseFn) {
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        return waitForActual(promiseFn).then(function(result) {
          return expectsError.apply(void 0, [rejects, result].concat(args));
        });
      };
      assert.doesNotThrow = function doesNotThrow(fn) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
      };
      assert.doesNotReject = function doesNotReject(fn) {
        for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }
        return waitForActual(fn).then(function(result) {
          return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
        });
      };
      assert.ifError = function ifError(err) {
        if (err !== null && err !== void 0) {
          var message = "ifError got unwanted exception: ";
          if (_typeof(err) === "object" && typeof err.message === "string") {
            if (err.message.length === 0 && err.constructor) {
              message += err.constructor.name;
            } else {
              message += err.message;
            }
          } else {
            message += inspect(err);
          }
          var newErr = new AssertionError({
            actual: err,
            expected: null,
            operator: "ifError",
            message,
            stackStartFn: ifError
          });
          var origStack = err.stack;
          if (typeof origStack === "string") {
            var tmp2 = origStack.split("\n");
            tmp2.shift();
            var tmp1 = newErr.stack.split("\n");
            for (var i = 0; i < tmp2.length; i++) {
              var pos = tmp1.indexOf(tmp2[i]);
              if (pos !== -1) {
                tmp1 = tmp1.slice(0, pos);
                break;
              }
            }
            newErr.stack = "".concat(tmp1.join("\n"), "\n").concat(tmp2.join("\n"));
          }
          throw newErr;
        }
      };
      function internalMatch(string, regexp, message, fn, fnName) {
        if (!isRegExp(regexp)) {
          throw new ERR_INVALID_ARG_TYPE("regexp", "RegExp", regexp);
        }
        var match = fnName === "match";
        if (typeof string !== "string" || RegExpPrototypeTest(regexp, string) !== match) {
          if (message instanceof Error) {
            throw message;
          }
          var generatedMessage = !message;
          message = message || (typeof string !== "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(_typeof(string), " (").concat(inspect(string), ")") : (match ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(inspect(regexp), ". Input:\n\n").concat(inspect(string), "\n"));
          var err = new AssertionError({
            actual: string,
            expected: regexp,
            message,
            operator: fnName,
            stackStartFn: fn
          });
          err.generatedMessage = generatedMessage;
          throw err;
        }
      }
      assert.match = function match(string, regexp, message) {
        internalMatch(string, regexp, message, match, "match");
      };
      assert.doesNotMatch = function doesNotMatch(string, regexp, message) {
        internalMatch(string, regexp, message, doesNotMatch, "doesNotMatch");
      };
      function strict() {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }
        innerOk.apply(void 0, [strict, args.length].concat(args));
      }
      assert.strict = objectAssign(strict, assert, {
        equal: assert.strictEqual,
        deepEqual: assert.deepStrictEqual,
        notEqual: assert.notStrictEqual,
        notDeepEqual: assert.notDeepStrictEqual
      });
      assert.strict.strict = assert.strict;
    }
  });

  // node_modules/riichi/yaku.js
  var require_yaku = __commonJS({
    "node_modules/riichi/yaku.js"(exports2, module2) {
      "use strict";
      var assert = require_assert();
      var agari2 = require_agari();
      var MPSZ2 = ["m", "p", "s", "z"];
      var checkAllowed = (o, allowed) => {
        for (let v of o.hai)
          if (!allowed.includes(v))
            return false;
        for (let v of o.furo)
          for (let vv of v)
            if (!allowed.includes(vv))
              return false;
        return true;
      };
      var checkChanta = (o, allow) => {
        let hasJyuntsu = false;
        for (let v of o.currentPattern) {
          if (typeof v === "string") {
            if (!allow.includes(v))
              return false;
          } else if (v.length <= 2 || v[0] === v[1]) {
            if (!allow.includes(v[0]))
              return false;
          } else {
            hasJyuntsu = true;
            let add2 = parseInt(v[0]) + parseInt(v[1]) + parseInt(v[2]);
            if (add2 > 6 && add2 < 24)
              return false;
          }
        }
        return hasJyuntsu;
      };
      var checkYakuhai = (o, pos) => {
        for (let v of o.currentPattern) {
          if (typeof v !== "string" && v[0] === pos + "z")
            return true;
        }
        return false;
      };
      var YAKU2 = {
        "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762\u5F85\u3061": { "yakuman": 2, "isMenzenOnly": true, "check": (o) => {
          return agari2.check13(o.haiArray) && o.hai.reduce((total, v) => {
            return v === o.agari ? ++total : total;
          }, 0) === 2;
        } },
        "\u56FD\u58EB\u7121\u53CC": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          return agari2.check13(o.haiArray) && o.hai.reduce((total, v) => {
            return v === o.agari ? ++total : total;
          }, 0) === 1;
        } },
        "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8": { "yakuman": 2, "isMenzenOnly": true, "check": (o) => {
          let i = MPSZ2.indexOf(o.agari[1]);
          let arr = o.haiArray[i].concat();
          if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
            return false;
          return [2, 4].includes(arr[parseInt(o.agari) - 1]);
        } },
        "\u4E5D\u84EE\u5B9D\u71C8": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          let i = MPSZ2.indexOf(o.agari[1]);
          let arr = o.haiArray[i].concat();
          if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
            return false;
          return [1, 3].includes(arr[parseInt(o.agari) - 1]);
        } },
        "\u56DB\u6697\u523B\u5358\u9A0E\u5F85\u3061": { "yakuman": 2, "isMenzenOnly": true, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && v !== o.agari)
              return false;
            if (typeof v !== "string" && v.length <= 2)
              res++;
          }
          return res === 4;
        } },
        "\u56DB\u6697\u523B": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && v === o.agari)
              return false;
            if (typeof v !== "string" && v.length <= 2)
              res++;
          }
          return res === 4;
        } },
        "\u5927\u56DB\u559C": { "yakuman": 2, "check": (o) => {
          let need = ["1z", "2z", "3z", "4z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 4;
        } },
        "\u5C0F\u56DB\u559C": { "yakuman": 1, "check": (o) => {
          let need = ["1z", "2z", "3z", "4z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && !need.includes(v))
              return false;
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 3;
        } },
        "\u5927\u4E09\u5143": { "yakuman": 1, "check": (o) => {
          let need = ["5z", "6z", "7z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 3;
        } },
        "\u5B57\u4E00\u8272": { "yakuman": 1, "check": (o) => {
          let allow = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkAllowed(o, allow);
        } },
        "\u7DD1\u4E00\u8272": { "yakuman": 1, "check": (o) => {
          let allow = ["2s", "3s", "4s", "6s", "8s", "6z"];
          return checkAllowed(o, allow);
        } },
        "\u6E05\u8001\u982D": { "yakuman": 1, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s"];
          return checkAllowed(o, allow);
        } },
        "\u56DB\u69D3\u5B50": { "yakuman": 1, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (typeof v !== "string" && (v.length === 2 || v.length === 4))
              res++;
          return res === 4;
        } },
        "\u5929\u548C": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("t") && o.isTsumo && o.isOya && !o.furo.length;
        } },
        "\u5730\u548C": { "yakuman": 1, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("t") && o.isTsumo && !o.isOya && !o.furo.length;
        } },
        "\u4EBA\u548C": { "yakuman": 1, "isMenzenOnly": true, "isLocal": true, "check": (o) => {
          return o.extra.includes("t") && !o.isTsumo && !o.isOya && !o.furo.length;
        } },
        "\u5927\u4E03\u661F": { "yakuman": 1, "isMenzenOnly": true, "isLocal": true, "check": (o) => {
          let allow = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkAllowed(o, allow) && YAKU2["\u4E03\u5BFE\u5B50"].check(o);
        } },
        "\u6E05\u4E00\u8272": { "han": 6, "isFuroMinus": true, "check": (o) => {
          let must = o.agari[1];
          let allow = [];
          for (let i = 1; i <= 9; i++)
            allow.push(i + must);
          return checkAllowed(o, allow);
        } },
        "\u6DF7\u4E00\u8272": { "han": 3, "isFuroMinus": true, "check": (o) => {
          let allow = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          let d = "";
          for (let v of o.hai) {
            if (["m", "p", "s"].includes(v[1])) {
              d = v[1];
              break;
            }
          }
          if (!d) {
            for (let v of o.furo) {
              for (let vv of v) {
                if (["m", "p", "s"].includes(vv[1])) {
                  d = vv[1];
                  break;
                }
              }
            }
          }
          if (!d)
            return false;
          for (let i = 1; i <= 9; i++)
            allow.push(i + d);
          return checkAllowed(o, allow) && !YAKU2["\u6E05\u4E00\u8272"].check(o);
        } },
        "\u4E8C\u76C3\u53E3": { "han": 3, "isMenzenOnly": true, "check": (o) => {
          let arr = [];
          for (let v of o.currentPattern) {
            if (typeof v === "string")
              continue;
            if (v.length !== 3 || v[0] === v[1])
              return false;
            arr.push(v[0]);
          }
          return arr[0] + arr[2] === arr[1] + arr[3];
        } },
        "\u7D14\u5168\u5E2F\u4E48\u4E5D": { "han": 3, "isFuroMinus": true, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s"];
          return checkChanta(o, allow);
        } },
        "\u6DF7\u5168\u5E2F\u4E48\u4E5D": { "han": 2, "isFuroMinus": true, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkChanta(o, allow) && !YAKU2["\u7D14\u5168\u5E2F\u4E48\u4E5D"].check(o);
        } },
        "\u5BFE\u3005\u548C": { "han": 2, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (v.length === 1 || v[0] === v[1])
              res++;
          return res === 4;
        } },
        "\u6DF7\u8001\u982D": { "han": 2, "check": (o) => {
          let allow = ["1m", "9m", "1p", "9p", "1s", "9s", "1z", "2z", "3z", "4z", "5z", "6z", "7z"];
          return checkAllowed(o, allow);
        } },
        "\u4E09\u69D3\u5B50": { "han": 2, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (typeof v !== "string" && (v.length === 2 || v.length === 4))
              res++;
          return res === 3;
        } },
        "\u5C0F\u4E09\u5143": { "han": 2, "check": (o) => {
          let need = ["5z", "6z", "7z"];
          let res = 0;
          for (let v of o.currentPattern) {
            if (typeof v === "string" && !need.includes(v))
              return false;
            if (typeof v === "object" && need.includes(v[0]))
              res++;
          }
          return res === 2;
        } },
        "\u4E09\u8272\u540C\u523B": { "han": 2, "check": (o) => {
          let res = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let v of o.currentPattern) {
            if ((v.length === 1 || v[0] === v[1]) && !v[0].includes("z"))
              res[parseInt(v[0]) - 1]++;
            else
              continue;
          }
          return res.includes(3);
        } },
        "\u4E09\u6697\u523B": { "han": 2, "check": (o) => {
          let res = 0;
          for (let v of o.currentPattern)
            if (typeof v !== "string" && v.length <= 2)
              res++;
          return res === 3;
        } },
        "\u4E03\u5BFE\u5B50": { "han": 2, "isMenzenOnly": true, "check": (o) => {
          return agari2.check7(o.haiArray) && !YAKU2["\u4E8C\u76C3\u53E3"].check(o);
        } },
        "\u30C0\u30D6\u30EB\u7ACB\u76F4": { "han": 2, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("w") && !o.furo.length;
        } },
        "\u4E00\u6C17\u901A\u8CAB": { "han": 2, "isFuroMinus": true, "check": (o) => {
          let res = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (let v of o.currentPattern) {
            if (v.length <= 2 || v[0] === v[1])
              continue;
            if ([1, 4, 7].includes(parseInt(v[0]))) {
              let i = MPSZ2.indexOf(v[0][1]) * 3 + (parseInt(v[0]) - 1) / 3;
              res[i]++;
            }
          }
          return res[0] && res[1] && res[2] || res[3] && res[4] && res[5] || res[6] && res[7] && res[8];
        } },
        "\u4E09\u8272\u540C\u9806": { "han": 2, "isFuroMinus": true, "check": (o) => {
          let res = [];
          for (let v of o.currentPattern) {
            if (v.length <= 2 || v[0] === v[1] || v[0].includes("z")) continue;
            let value = parseInt(v[0]);
            res[value] = res[value] ? res[value] : /* @__PURE__ */ new Set();
            res[value].add(v[0][1]);
          }
          return res.some((value) => value.size === 3);
        } },
        "\u65AD\u4E48\u4E5D": { "han": 1, "check": (o) => {
          for (let v of o.furo)
            if (!o.allowKuitan && v.length !== 2)
              return false;
          let allow = ["2m", "3m", "4m", "5m", "6m", "7m", "8m", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "2s", "3s", "4s", "5s", "6s", "7s", "8s"];
          return checkAllowed(o, allow);
        } },
        "\u5E73\u548C": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          let hasAgariFu = true;
          for (let v of o.currentPattern) {
            if (typeof v === "string") {
              if (v.includes("z") && [o.bakaze, o.jikaze, 5, 6, 7].includes(parseInt(v)))
                return false;
            } else if (v.length !== 3 || v[0] === v[1]) {
              return false;
            } else if (v[0] === o.agari && parseInt(v[2]) !== 9 || v[2] === o.agari && parseInt(v[0]) !== 1) {
              hasAgariFu = false;
            }
          }
          return !hasAgariFu;
        } },
        "\u4E00\u76C3\u53E3": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          if (YAKU2["\u4E8C\u76C3\u53E3"].check(o))
            return false;
          for (let i in o.currentPattern) {
            i = parseInt(i);
            let v = o.currentPattern[i];
            if (v.length === 3 && v[0] != v[1]) {
              while (i < 4) {
                i++;
                try {
                  assert.deepStrictEqual(v, o.currentPattern[i]);
                  return true;
                } catch (e) {
                }
              }
            }
          }
          return false;
        } },
        "\u9580\u524D\u6E05\u81EA\u6478\u548C": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          return o.isTsumo;
        } },
        "\u7ACB\u76F4": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          return (YAKU2["\u4E00\u767A"].check(o) || (o.extra.includes("r") || o.extra.includes("l"))) && !YAKU2["\u30C0\u30D6\u30EB\u7ACB\u76F4"].check(o);
        } },
        "\u4E00\u767A": { "han": 1, "isMenzenOnly": true, "check": (o) => {
          return o.extra.includes("i") || o.extra.includes("y");
        } },
        "\u5DBA\u4E0A\u958B\u82B1": { "han": 1, "check": (o) => {
          let hasKantsu = false;
          for (let v of o.furo) {
            if (v.length === 2 || v.length === 4) {
              hasKantsu = true;
              break;
            }
          }
          return hasKantsu && o.extra.includes("k") && !o.extra.includes("h") && o.isTsumo && !YAKU2["\u4E00\u767A"].check(o);
        } },
        "\u6436\u69D3": { "han": 1, "check": (o) => {
          return o.extra.includes("k") && !o.extra.includes("h") && !o.isTsumo;
        } },
        "\u6D77\u5E95\u6478\u6708": { "han": 1, "check": (o) => {
          return o.extra.includes("h") && o.isTsumo;
        } },
        "\u6CB3\u5E95\u6488\u9B5A": { "han": 1, "check": (o) => {
          return o.extra.includes("h") && !o.isTsumo && !YAKU2["\u4E00\u767A"].check(o);
        } },
        "\u5834\u98A8\u6771": { "han": 1, "check": (o) => {
          return o.bakaze === 1 && checkYakuhai(o, 1);
        } },
        "\u5834\u98A8\u5357": { "han": 1, "check": (o) => {
          return o.bakaze === 2 && checkYakuhai(o, 2);
        } },
        "\u5834\u98A8\u897F": { "han": 1, "check": (o) => {
          return o.bakaze === 3 && checkYakuhai(o, 3);
        } },
        "\u5834\u98A8\u5317": { "han": 1, "check": (o) => {
          return o.bakaze === 4 && checkYakuhai(o, 4);
        } },
        "\u81EA\u98A8\u6771": { "han": 1, "check": (o) => {
          return o.jikaze === 1 && checkYakuhai(o, 1);
        } },
        "\u81EA\u98A8\u5357": { "han": 1, "check": (o) => {
          return o.jikaze === 2 && checkYakuhai(o, 2);
        } },
        "\u81EA\u98A8\u897F": { "han": 1, "check": (o) => {
          return o.jikaze === 3 && checkYakuhai(o, 3);
        } },
        "\u81EA\u98A8\u5317": { "han": 1, "check": (o) => {
          return o.jikaze === 4 && checkYakuhai(o, 4);
        } },
        "\u5F79\u724C\u767D": { "han": 1, "check": (o) => {
          return checkYakuhai(o, 5);
        } },
        "\u5F79\u724C\u767A": { "han": 1, "check": (o) => {
          return checkYakuhai(o, 6);
        } },
        "\u5F79\u724C\u4E2D": { "han": 1, "check": (o) => {
          return checkYakuhai(o, 7);
        } }
      };
      module2.exports = YAKU2;
    }
  });

  // node_modules/riichi/index.js
  var require_riichi = __commonJS({
    "node_modules/riichi/index.js"(exports, module) {
      "use strict";
      var agari = require_agari();
      var syanten = require_syanten();
      var YAKU = require_yaku();
      var MPSZ = ["m", "p", "s", "z"];
      var KAZE = [void 0, "\u6771", "\u5357", "\u897F", "\u5317", "\u767D", "\u767C", "\u4E2D"];
      var ceil10 = (num) => {
        return Math.ceil(num / 10) * 10;
      };
      var ceil100 = (num) => {
        return Math.ceil(num / 100) * 100;
      };
      var isHai = (text) => {
        return typeof text === "string" && text.length === 2 && !isNaN(text[0]) && MPSZ.includes(text[1]);
      };
      var is19 = (text) => {
        return isHai(text) && (text.includes("1") || text.includes("9") || text.includes("z"));
      };
      var isFuro = (arr) => {
        if (arr instanceof Array !== true || arr.length > 4 || arr.length < 2)
          return false;
        let set = new Set(arr);
        if (set.size === 1)
          return isHai(arr[0]);
        else {
          if (set.size !== 3)
            return false;
          let minus1 = parseInt(arr[1]) - parseInt(arr[0]);
          let minus2 = parseInt(arr[2]) - parseInt(arr[1]);
          if (minus1 !== minus2 || minus1 !== 1)
            return false;
        }
        return true;
      };
      var parse = (text) => {
        let tmp = [];
        let aka = 0;
        for (let v of text) {
          if (!isNaN(v)) {
            if (v === "0")
              v = "5", aka++;
            tmp.push(v);
          }
          if (MPSZ.includes(v)) {
            for (let k in tmp)
              if (!isNaN(tmp[k]))
                tmp[k] += v;
          }
        }
        let res = [];
        for (let v of tmp)
          if (isNaN(v))
            res.push(v);
        return { "res": tmp, "aka": aka };
      };
      var Riichi = class {
        /**
         * @param string data
         */
        constructor(data) {
          this.hai = [];
          this.haiArray = [
            // 複合array型手牌(和了牌含)
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
          ];
          this.furo = [];
          this.agari = "";
          this.dora = [];
          this.extra = "";
          this.isTsumo = true;
          this.isOya = false;
          this.bakaze = 1;
          this.jikaze = 2;
          this.aka = 0;
          this.agariPatterns = [];
          this.currentPattern;
          this.tmpResult = {
            //臨時計算結果
            "isAgari": false,
            //和了?
            "yakuman": 0,
            //役満倍数
            "yaku": {},
            //手役 例:{'天和':'役満','大四喜':'ダブル役満'} 例:{'立直':'1飜','清一色':'6飜'}
            "han": 0,
            //飜数
            "fu": 0,
            //符数
            "ten": 0,
            //点数(this.isOya=undefined場合，計算不能)
            "name": "",
            //例:'満貫'、'跳満'、'倍満'、'三倍満'、'数え役満'
            "text": "",
            //結果text 例:'30符4飜'、'40符4飜 満貫'、'6倍役満'
            "oya": [0, 0, 0],
            //親家得点 例:[2600,2600,2600]、[7700]
            "ko": [0, 0, 0],
            //子家得点 例:[3900,2000,2000]、[7700]
            "error": true
            //input error
          };
          this.finalResult;
          this.allLocalEnabled = false;
          this.localEnabled = [];
          this.disabled = [];
          this.allowWyakuman = true;
          this.allowKuitan = true;
          this.allowAka = true;
          this.hairi = true;
          if (typeof data !== "string")
            return;
          data = data.toLowerCase();
          let arr = data.split("+");
          let hai = arr.shift();
          for (let v of arr) {
            if (!v.includes("m") && !v.includes("p") && !v.includes("s") && !v.includes("z"))
              this.extra = v;
            else if (v[0] === "d")
              this.dora = parse(v.substr(1)).res;
            else if (isHai(v)) {
              hai += v;
              this.isTsumo = false;
            } else {
              let tmp2 = [];
              for (let vv of v) {
                if (MPSZ.includes(vv)) {
                  for (let k in tmp2)
                    tmp2[k] += vv;
                  if (isFuro(tmp2))
                    this.furo.push(tmp2.sort());
                  tmp2 = [];
                } else {
                  if (vv === "0")
                    vv = "5", this.aka++;
                  tmp2.push(vv);
                }
              }
            }
          }
          let tmp = parse(hai);
          this.hai = tmp.res;
          this.aka += tmp.aka;
          this.agari = this.hai.slice(-1)[0];
          if (this.hai.length % 3 === 0)
            return;
          if (this.hai.length + this.furo.length * 3 > 14)
            return;
          for (let v of this.hai) {
            let n = parseInt(v);
            let i = MPSZ.indexOf(v.replace(n, ""));
            this.haiArray[i][n - 1]++;
          }
          let kaze = this.extra.replace(/[a-z]/g, "");
          if (kaze.length === 1)
            this.jikaze = parseInt(kaze);
          if (kaze.length > 1) {
            this.bakaze = parseInt(kaze[0]);
            this.jikaze = parseInt(kaze[1]);
          }
          if (this.jikaze === 1)
            this.isOya = true;
          else
            this.isOya = false;
          this.tmpResult.error = false;
          this.finalResult = JSON.parse(JSON.stringify(this.tmpResult));
        }
        /**
         * 門前判定
         */
        isMenzen() {
          for (let v of this.furo)
            if (v.length > 2)
              return false;
          return true;
        }
        /**
         * dora枚数計算
         */
        calcDora() {
          if (!this.tmpResult.han)
            return;
          let dora = 0;
          for (let v of this.hai) {
            for (let vv of this.dora) {
              if (v === vv)
                dora++;
            }
          }
          for (let v of this.furo) {
            if (v.length === 2)
              v = v.concat(v);
            for (let vv of v) {
              for (let vvv of this.dora) {
                if (vvv === vv)
                  dora++;
              }
            }
          }
          if (dora) {
            this.tmpResult.han += dora;
            this.tmpResult.yaku["\u30C9\u30E9"] = dora + "\u98DC";
          }
          if (this.allowAka && this.aka) {
            this.tmpResult.han += this.aka;
            this.tmpResult.yaku["\u8D64\u30C9\u30E9"] = this.aka + "\u98DC";
          }
        }
        /**
         * 符計算
         */
        calcFu() {
          let fu = 0;
          if (this.tmpResult.yaku["\u4E03\u5BFE\u5B50"]) {
            fu = 25;
          } else if (this.tmpResult.yaku["\u5E73\u548C"]) {
            fu = this.isTsumo ? 20 : 30;
          } else {
            fu = 20;
            let hasAgariFu = false;
            if (!this.isTsumo && this.isMenzen())
              fu += 10;
            for (let v of this.currentPattern) {
              if (typeof v === "string") {
                if (v.includes("z")) {
                  for (let vv of [this.bakaze, this.jikaze, 5, 6, 7])
                    if (parseInt(v) === vv)
                      fu += 2;
                }
                if (this.agari === v)
                  hasAgariFu = true;
              } else {
                if (v.length === 4)
                  fu += is19(v[0]) ? 16 : 8;
                else if (v.length === 2)
                  fu += is19(v[0]) ? 32 : 16;
                else if (v.length === 1)
                  fu += is19(v[0]) ? 8 : 4;
                else if (v.length === 3 && v[0] === v[1])
                  fu += is19(v[0]) ? 4 : 2;
                else if (!hasAgariFu) {
                  if (v[1] === this.agari)
                    hasAgariFu = true;
                  else if (v[0] === hasAgariFu && parseInt(v[2]) === 9)
                    hasAgariFu = true;
                  else if (v[2] === hasAgariFu && parseInt(v[0]) === 1)
                    hasAgariFu = true;
                }
              }
            }
            if (hasAgariFu)
              fu += 2;
            if (this.isTsumo)
              fu += 2;
            fu = ceil10(fu);
            if (fu < 30)
              fu = 30;
          }
          this.tmpResult.fu = fu;
        }
        /**
         * 点数計算
         */
        calcTen() {
          this.tmpResult.name = "";
          let base;
          this.tmpResult.text = `(${KAZE[this.bakaze]}\u5834`;
          this.tmpResult.text += KAZE[this.jikaze] + "\u5BB6)";
          this.tmpResult.text += this.isTsumo ? "\u81EA\u6478" : "\u6804\u548C";
          if (this.tmpResult.yakuman) {
            base = 8e3 * this.tmpResult.yakuman;
            this.tmpResult.name = this.tmpResult.yakuman > 1 ? this.tmpResult.yakuman + "\u500D\u5F79\u6E80" : "\u5F79\u6E80";
          } else {
            if (!this.tmpResult.han)
              return;
            base = this.tmpResult.fu * Math.pow(2, this.tmpResult.han + 2);
            this.tmpResult.text += " " + this.tmpResult.fu + "\u7B26" + this.tmpResult.han + "\u98DC";
            if (base > 2e3) {
              if (this.tmpResult.han >= 13) {
                base = 8e3;
                this.tmpResult.name = "\u6570\u3048\u5F79\u6E80";
              } else if (this.tmpResult.han >= 11) {
                base = 6e3;
                this.tmpResult.name = "\u4E09\u500D\u6E80";
              } else if (this.tmpResult.han >= 8) {
                base = 4e3;
                this.tmpResult.name = "\u500D\u6E80";
              } else if (this.tmpResult.han >= 6) {
                base = 3e3;
                this.tmpResult.name = "\u8DF3\u6E80";
              } else {
                base = 2e3;
                this.tmpResult.name = "\u6E80\u8CAB";
              }
            }
          }
          this.tmpResult.text += (this.tmpResult.name ? " " : "") + this.tmpResult.name;
          if (this.isTsumo) {
            this.tmpResult.oya = [ceil100(base * 2), ceil100(base * 2), ceil100(base * 2)];
            this.tmpResult.ko = [ceil100(base * 2), ceil100(base), ceil100(base)];
          } else {
            this.tmpResult.oya = [ceil100(base * 6)];
            this.tmpResult.ko = [ceil100(base * 4)];
          }
          this.tmpResult.ten = this.isOya ? eval(this.tmpResult.oya.join("+")) : eval(this.tmpResult.ko.join("+"));
          this.tmpResult.text += " " + this.tmpResult.ten + "\u70B9";
          if (this.isTsumo) {
            this.tmpResult.text += "(";
            if (this.isOya)
              this.tmpResult.text += this.tmpResult.oya[0] + "all";
            else
              this.tmpResult.text += this.tmpResult.ko[0] + "," + this.tmpResult.ko[1];
            this.tmpResult.text += ")";
          }
        }
        /**
         * 手役計算
         */
        calcYaku() {
          this.tmpResult.yaku = {};
          this.tmpResult.yakuman = 0;
          this.tmpResult.han = 0;
          for (let k in YAKU) {
            let v = YAKU[k];
            if (this.disabled.includes(k))
              continue;
            if (v.isLocal && !this.allLocalEnabled && !this.localEnabled.includes(k))
              continue;
            if (this.tmpResult.yakuman && !v.yakuman)
              continue;
            if (v.isMenzenOnly && !this.isMenzen())
              continue;
            if (v.check(this)) {
              if (v.yakuman) {
                let n = this.allowWyakuman ? v.yakuman : 1;
                this.tmpResult.yakuman += n;
                this.tmpResult.yaku[k] = n > 1 ? "\u30C0\u30D6\u30EB\u5F79\u6E80" : "\u5F79\u6E80";
              } else {
                let n = v.han;
                if (v.isFuroMinus && !this.isMenzen())
                  n--;
                this.tmpResult.yaku[k] = n + "\u98DC";
                this.tmpResult.han += n;
              }
            }
          }
        }
        // api exports ↓ ----------------------------------------------------------------------------------------------------
        disableWyakuman() {
          this.allowWyakuman = false;
        }
        disableKuitan() {
          this.allowKuitan = false;
        }
        disableAka() {
          this.allowAka = false;
        }
        enableLocalYaku(name) {
          this.localEnabled.push(name);
        }
        disableYaku(name) {
          this.disabled.push(name);
        }
        // supported local yaku list
        // 大七星 役満(字一色別)
        // 人和 役満
        // 
        disableHairi() {
          this.hairi = false;
        }
        /**
         * main
         */
        calc() {
          if (this.tmpResult.error) {
            return this.tmpResult;
          }
          this.tmpResult.isAgari = agari.checkAll(this.haiArray);
          if (!this.tmpResult.isAgari || this.hai.length + this.furo.length * 3 !== 14) {
            if (this.hairi) {
              this.tmpResult.hairi = syanten.hairi(this.haiArray);
              this.tmpResult.hairi7and13 = syanten.hairi(this.haiArray, true);
            }
            return this.tmpResult;
          }
          this.finalResult.isAgari = true;
          if (this.extra.includes("o"))
            this.allLocalEnabled = true;
          this.agariPatterns = agari(this.haiArray);
          if (!this.agariPatterns.length)
            this.agariPatterns.push([]);
          for (let v of this.agariPatterns) {
            if (!this.isTsumo) {
              for (let k in v) {
                let vv = v[k];
                if (vv.length === 1 && vv[0] === this.agari) {
                  let i = MPSZ.indexOf(this.agari[1]);
                  if (this.haiArray[i][parseInt(this.agari) - 1] < 4)
                    v[k] = [vv[0], vv[0], vv[0]];
                }
              }
            }
            this.currentPattern = v.concat(this.furo);
            this.calcYaku();
            if (!this.tmpResult.yakuman && !this.tmpResult.han)
              continue;
            if (this.tmpResult.han) {
              this.calcDora();
              this.calcFu();
            }
            this.calcTen();
            if (this.tmpResult.ten > this.finalResult.ten)
              this.finalResult = JSON.parse(JSON.stringify(this.tmpResult));
            else if (this.tmpResult.ten === this.finalResult.ten && this.tmpResult.han > this.finalResult.han)
              this.finalResult = JSON.parse(JSON.stringify(this.tmpResult));
          }
          if (!this.finalResult.ten)
            this.finalResult.text = "\u7121\u5F79";
          return this.finalResult;
        }
      };
      module.exports = Riichi;
    }
  });

  // node_modules/protobufjs/src/util/aspromise.js
  var require_aspromise = __commonJS({
    "node_modules/protobufjs/src/util/aspromise.js"(exports2, module2) {
      "use strict";
      module2.exports = asPromise;
      function asPromise(fn, ctx) {
        var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
        while (index < arguments.length)
          params[offset++] = arguments[index++];
        return new Promise(function executor(resolve, reject) {
          params[offset] = function callback(err) {
            if (pending) {
              pending = false;
              if (err)
                reject(err);
              else {
                var params2 = new Array(arguments.length - 1), offset2 = 0;
                while (offset2 < params2.length)
                  params2[offset2++] = arguments[offset2];
                resolve.apply(null, params2);
              }
            }
          };
          try {
            fn.apply(ctx || null, params);
          } catch (err) {
            if (pending) {
              pending = false;
              reject(err);
            }
          }
        });
      }
    }
  });

  // node_modules/protobufjs/src/util/base64.js
  var require_base64 = __commonJS({
    "node_modules/protobufjs/src/util/base64.js"(exports2) {
      "use strict";
      var base64 = exports2;
      base64.length = function length(string) {
        var p = string.length;
        if (!p)
          return 0;
        while (p > 0 && string.charAt(p - 1) === "=")
          --p;
        return Math.floor(p * 3 / 4);
      };
      var b64 = new Array(64);
      var s64 = new Array(123);
      for (i = 0; i < 64; )
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
      var i;
      s64[45] = 62;
      s64[95] = 63;
      base64.encode = function encode2(buffer, start, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start < end) {
          var b = buffer[start++];
          switch (j) {
            case 0:
              chunk[i2++] = b64[b >> 2];
              t = (b & 3) << 4;
              j = 1;
              break;
            case 1:
              chunk[i2++] = b64[t | b >> 4];
              t = (b & 15) << 2;
              j = 2;
              break;
            case 2:
              chunk[i2++] = b64[t | b >> 6];
              chunk[i2++] = b64[b & 63];
              j = 0;
              break;
          }
          if (i2 > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i2 = 0;
          }
        }
        if (j) {
          chunk[i2++] = b64[t];
          chunk[i2++] = 61;
          if (j === 1)
            chunk[i2++] = 61;
        }
        if (parts) {
          if (i2)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i2));
      };
      var invalidEncoding = "invalid encoding";
      base64.decode = function decode2(string, buffer, offset) {
        var start = offset;
        var j = 0, t;
        for (var i2 = 0; i2 < string.length; ) {
          var c = string.charCodeAt(i2++);
          if (c === 61 && j > 1)
            break;
          if ((c = s64[c]) === void 0)
            throw Error(invalidEncoding);
          switch (j) {
            case 0:
              t = c;
              j = 1;
              break;
            case 1:
              buffer[offset++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer[offset++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset - start;
      };
      var base64Re = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      var base64UrlRe = /[-_]/;
      var base64UrlNoPaddingRe = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}(?:==)?|[A-Za-z0-9_-]{3}=?)?$/;
      base64.test = function test(string) {
        return base64Re.test(string) || base64UrlRe.test(string) && base64UrlNoPaddingRe.test(string);
      };
    }
  });

  // node_modules/protobufjs/src/util/eventemitter.js
  var require_eventemitter = __commonJS({
    "node_modules/protobufjs/src/util/eventemitter.js"(exports2, module2) {
      "use strict";
      module2.exports = EventEmitter;
      function EventEmitter() {
        this._listeners = /* @__PURE__ */ Object.create(null);
      }
      EventEmitter.prototype.on = function on(evt, fn, ctx) {
        (this._listeners[evt] || (this._listeners[evt] = [])).push({
          fn,
          ctx: ctx || this
        });
        return this;
      };
      EventEmitter.prototype.off = function off(evt, fn) {
        if (evt === void 0)
          this._listeners = /* @__PURE__ */ Object.create(null);
        else {
          if (fn === void 0)
            this._listeners[evt] = [];
          else {
            var listeners = this._listeners[evt];
            if (!listeners)
              return this;
            for (var i = 0; i < listeners.length; )
              if (listeners[i].fn === fn)
                listeners.splice(i, 1);
              else
                ++i;
          }
        }
        return this;
      };
      EventEmitter.prototype.emit = function emit2(evt) {
        var listeners = this._listeners[evt];
        if (listeners) {
          var args = [], i = 1;
          for (; i < arguments.length; )
            args.push(arguments[i++]);
          for (i = 0; i < listeners.length; )
            listeners[i].fn.apply(listeners[i++].ctx, args);
        }
        return this;
      };
    }
  });

  // node_modules/protobufjs/src/util/float.js
  var require_float = __commonJS({
    "node_modules/protobufjs/src/util/float.js"(exports2, module2) {
      "use strict";
      module2.exports = factory(factory);
      function factory(exports3) {
        if (typeof Float32Array !== "undefined") (function() {
          var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
          function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
          }
          function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
          }
          exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
          exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
          function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
          }
          function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
          }
          exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
          exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
        })();
        else (function() {
          function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0)
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos);
            else if (isNaN(val))
              writeUint(2143289344, buf, pos);
            else if (val > 34028234663852886e22)
              writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 11754943508222875e-54)
              writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
              writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
          }
          exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
          exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
          function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
          }
          exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
          exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
        })();
        if (typeof Float64Array !== "undefined") (function() {
          var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
          function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
          }
          function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
          }
          exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
          exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
          function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
          }
          function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
          }
          exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
          exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
        })();
        else (function() {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0) {
              writeUint(0, buf, pos + off0);
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos + off1);
            } else if (isNaN(val)) {
              writeUint(0, buf, pos + off0);
              writeUint(2146959360, buf, pos + off1);
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf, pos + off0);
              writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
              var mantissa;
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324;
                writeUint(mantissa >>> 0, buf, pos + off0);
                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                  exponent = 1023;
                mantissa = val * Math.pow(2, -exponent);
                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
              }
            }
          }
          exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
          exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
          function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
          }
          exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
          exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
        })();
        return exports3;
      }
      function writeUintLE(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      function writeUintBE(val, buf, pos) {
        buf[pos] = val >>> 24;
        buf[pos + 1] = val >>> 16 & 255;
        buf[pos + 2] = val >>> 8 & 255;
        buf[pos + 3] = val & 255;
      }
      function readUintLE(buf, pos) {
        return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
      }
      function readUintBE(buf, pos) {
        return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
      }
    }
  });

  // node_modules/protobufjs/src/util/utf8.js
  var require_utf8 = __commonJS({
    "node_modules/protobufjs/src/util/utf8.js"(exports2) {
      "use strict";
      var utf8 = exports2;
      var looseDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
      var strictDecoder;
      var TEXT_DECODER_MIN_LENGTH = 64;
      try {
        strictDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
      } catch (err) {
        strictDecoder = looseDecoder;
      }
      utf8.length = function utf8_length(string) {
        var len = 0, c = 0;
        for (var i = 0; i < string.length; ++i) {
          c = string.charCodeAt(i);
          if (c < 128)
            len += 1;
          else if (c < 2048)
            len += 2;
          else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
            ++i;
            len += 4;
          } else
            len += 3;
        }
        return len;
      };
      function utf8_read_decoder(decoder, buffer, start, end) {
        var source = start === 0 && end === buffer.length ? buffer : buffer.subarray(start, end);
        return decoder.decode(source);
      }
      utf8.read = function utf8_read_loose(buffer, start, end) {
        if (end - start < 1)
          return "";
        if (end - start >= TEXT_DECODER_MIN_LENGTH)
          return utf8_read_decoder(looseDecoder, buffer, start, end);
        var str = "", i = start, c1, c2, c3, c4, c5, c6, c7, c8;
        for (; i + 7 < end; i += 8) {
          c1 = buffer[i];
          c2 = buffer[i + 1];
          c3 = buffer[i + 2];
          c4 = buffer[i + 3];
          c5 = buffer[i + 4];
          c6 = buffer[i + 5];
          c7 = buffer[i + 6];
          c8 = buffer[i + 7];
          if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
            return str + utf8_read_decoder(looseDecoder, buffer, i, end);
          str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
        }
        for (; i < end; ++i) {
          c1 = buffer[i];
          if (c1 & 128)
            return str + utf8_read_decoder(looseDecoder, buffer, i, end);
          str += String.fromCharCode(c1);
        }
        return str;
      };
      utf8.readStrict = function utf8_read_strict(buffer, start, end) {
        if (end - start < 1)
          return "";
        if (end - start >= TEXT_DECODER_MIN_LENGTH)
          return utf8_read_decoder(strictDecoder, buffer, start, end);
        var str = "", i = start, c1, c2, c3, c4, c5, c6, c7, c8;
        for (; i + 7 < end; i += 8) {
          c1 = buffer[i];
          c2 = buffer[i + 1];
          c3 = buffer[i + 2];
          c4 = buffer[i + 3];
          c5 = buffer[i + 4];
          c6 = buffer[i + 5];
          c7 = buffer[i + 6];
          c8 = buffer[i + 7];
          if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
            return str + utf8_read_decoder(strictDecoder, buffer, i, end);
          str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
        }
        for (; i < end; ++i) {
          c1 = buffer[i];
          if (c1 & 128)
            return str + utf8_read_decoder(strictDecoder, buffer, i, end);
          str += String.fromCharCode(c1);
        }
        return str;
      };
      utf8.write = function utf8_write(string, buffer, offset) {
        var start = offset, c1, c2;
        for (var i = 0; i < string.length; ++i) {
          c1 = string.charCodeAt(i);
          if (c1 < 128) {
            buffer[offset++] = c1;
          } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          }
        }
        return offset - start;
      };
    }
  });

  // node_modules/protobufjs/src/util/pool.js
  var require_pool = __commonJS({
    "node_modules/protobufjs/src/util/pool.js"(exports2, module2) {
      "use strict";
      module2.exports = pool;
      function pool(alloc, slice, size) {
        var SIZE = size || 8192;
        var MAX = SIZE >>> 1;
        var slab = null;
        var offset = SIZE;
        return function pool_alloc(size2) {
          if (size2 < 1 || size2 > MAX)
            return alloc(size2);
          if (offset + size2 > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
          }
          var buf = slice.call(slab, offset, offset += size2);
          if (offset & 7)
            offset = (offset | 7) + 1;
          return buf;
        };
      }
    }
  });

  // node_modules/protobufjs/src/util/longbits.js
  var require_longbits = __commonJS({
    "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
      "use strict";
      module2.exports = LongBits;
      var Long;
      function LongBits(lo, hi) {
        this.lo = lo >>> 0;
        this.hi = hi >>> 0;
      }
      var zero = LongBits.zero = new LongBits(0, 0);
      zero.toNumber = function() {
        return 0;
      };
      zero.zzEncode = zero.zzDecode = function() {
        return this;
      };
      zero.length = function() {
        return 1;
      };
      var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
      LongBits.fromNumber = function fromNumber(value) {
        if (value === 0)
          return zero;
        var sign = value < 0;
        if (sign)
          value = -value;
        var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
        if (sign) {
          hi = ~hi >>> 0;
          lo = ~lo >>> 0;
          if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
              hi = 0;
          }
        }
        return new LongBits(lo, hi);
      };
      LongBits.from = function from(value) {
        if (typeof value === "number")
          return LongBits.fromNumber(value);
        if (typeof value === "string" || value instanceof String) {
          if (Long)
            value = Long.fromString(value);
          else
            return LongBits.fromNumber(parseInt(value, 10));
        }
        return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
      };
      LongBits.prototype.toNumber = function toNumber(unsigned) {
        if (!unsigned && this.hi >>> 31) {
          var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
          if (!lo)
            hi = hi + 1 >>> 0;
          return -(lo + hi * 4294967296);
        }
        return this.lo + this.hi * 4294967296;
      };
      LongBits.prototype.toLong = function toLong(unsigned) {
        return Long ? new Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
      };
      var charCodeAt = String.prototype.charCodeAt;
      LongBits.fromHash = function fromHash(hash) {
        if (hash === zeroHash)
          return zero;
        return new LongBits(
          (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
          (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
        );
      };
      LongBits.prototype.toHash = function toHash() {
        return String.fromCharCode(
          this.lo & 255,
          this.lo >>> 8 & 255,
          this.lo >>> 16 & 255,
          this.lo >>> 24,
          this.hi & 255,
          this.hi >>> 8 & 255,
          this.hi >>> 16 & 255,
          this.hi >>> 24
        );
      };
      LongBits.prototype.zzEncode = function zzEncode() {
        var mask = this.hi >> 31;
        this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
        this.lo = (this.lo << 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.zzDecode = function zzDecode() {
        var mask = -(this.lo & 1);
        this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
        this.hi = (this.hi >>> 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.length = function length() {
        var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
        return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
      };
      LongBits._configure = function(Long_) {
        Long = Long_;
      };
    }
  });

  // node_modules/long/umd/index.js
  var require_umd = __commonJS({
    "node_modules/long/umd/index.js"(exports2, module2) {
      (function(global2, factory) {
        function preferDefault(exports3) {
          return exports3.default || exports3;
        }
        if (typeof define === "function" && define.amd) {
          define([], function() {
            var exports3 = {};
            factory(exports3);
            return preferDefault(exports3);
          });
        } else if (typeof exports2 === "object") {
          factory(exports2);
          if (typeof module2 === "object") module2.exports = preferDefault(exports2);
        } else {
          (function() {
            var exports3 = {};
            factory(exports3);
            global2.Long = preferDefault(exports3);
          })();
        }
      })(
        typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports2,
        function(_exports) {
          "use strict";
          Object.defineProperty(_exports, "__esModule", {
            value: true
          });
          _exports.default = void 0;
          /**
           * @license
           * Copyright 2009 The Closure Library Authors
           * Copyright 2020 Daniel Wirtz / The long.js Authors.
           *
           * Licensed under the Apache License, Version 2.0 (the "License");
           * you may not use this file except in compliance with the License.
           * You may obtain a copy of the License at
           *
           *     http://www.apache.org/licenses/LICENSE-2.0
           *
           * Unless required by applicable law or agreed to in writing, software
           * distributed under the License is distributed on an "AS IS" BASIS,
           * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
           * See the License for the specific language governing permissions and
           * limitations under the License.
           *
           * SPDX-License-Identifier: Apache-2.0
           */
          var wasm = null;
          try {
            wasm = new WebAssembly.Instance(
              new WebAssembly.Module(
                new Uint8Array([
                  // \0asm
                  0,
                  97,
                  115,
                  109,
                  // version 1
                  1,
                  0,
                  0,
                  0,
                  // section "type"
                  1,
                  13,
                  2,
                  // 0, () => i32
                  96,
                  0,
                  1,
                  127,
                  // 1, (i32, i32, i32, i32) => i32
                  96,
                  4,
                  127,
                  127,
                  127,
                  127,
                  1,
                  127,
                  // section "function"
                  3,
                  7,
                  6,
                  // 0, type 0
                  0,
                  // 1, type 1
                  1,
                  // 2, type 1
                  1,
                  // 3, type 1
                  1,
                  // 4, type 1
                  1,
                  // 5, type 1
                  1,
                  // section "global"
                  6,
                  6,
                  1,
                  // 0, "high", mutable i32
                  127,
                  1,
                  65,
                  0,
                  11,
                  // section "export"
                  7,
                  50,
                  6,
                  // 0, "mul"
                  3,
                  109,
                  117,
                  108,
                  0,
                  1,
                  // 1, "div_s"
                  5,
                  100,
                  105,
                  118,
                  95,
                  115,
                  0,
                  2,
                  // 2, "div_u"
                  5,
                  100,
                  105,
                  118,
                  95,
                  117,
                  0,
                  3,
                  // 3, "rem_s"
                  5,
                  114,
                  101,
                  109,
                  95,
                  115,
                  0,
                  4,
                  // 4, "rem_u"
                  5,
                  114,
                  101,
                  109,
                  95,
                  117,
                  0,
                  5,
                  // 5, "get_high"
                  8,
                  103,
                  101,
                  116,
                  95,
                  104,
                  105,
                  103,
                  104,
                  0,
                  0,
                  // section "code"
                  10,
                  191,
                  1,
                  6,
                  // 0, "get_high"
                  4,
                  0,
                  35,
                  0,
                  11,
                  // 1, "mul"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  126,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 2, "div_s"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  127,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 3, "div_u"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  128,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 4, "rem_s"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  129,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 5, "rem_u"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  130,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11
                ])
              ),
              {}
            ).exports;
          } catch {
          }
          function Long(low, high, unsigned) {
            this.low = low | 0;
            this.high = high | 0;
            this.unsigned = !!unsigned;
          }
          Long.prototype.__isLong__;
          Object.defineProperty(Long.prototype, "__isLong__", {
            value: true
          });
          function isLong(obj) {
            return (obj && obj["__isLong__"]) === true;
          }
          function ctz32(value) {
            var c = Math.clz32(value & -value);
            return value ? 31 - c : c;
          }
          Long.isLong = isLong;
          var INT_CACHE = {};
          var UINT_CACHE = {};
          function fromInt(value, unsigned) {
            var obj, cachedObj, cache;
            if (unsigned) {
              value >>>= 0;
              if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
              }
              obj = fromBits(value, 0, true);
              if (cache) UINT_CACHE[value] = obj;
              return obj;
            } else {
              value |= 0;
              if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
              }
              obj = fromBits(value, value < 0 ? -1 : 0, false);
              if (cache) INT_CACHE[value] = obj;
              return obj;
            }
          }
          Long.fromInt = fromInt;
          function fromNumber(value, unsigned) {
            if (isNaN(value)) return unsigned ? UZERO : ZERO;
            if (unsigned) {
              if (value < 0) return UZERO;
              if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
            } else {
              if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
              if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
            }
            if (value < 0) return fromNumber(-value, unsigned).neg();
            return fromBits(
              value % TWO_PWR_32_DBL | 0,
              value / TWO_PWR_32_DBL | 0,
              unsigned
            );
          }
          Long.fromNumber = fromNumber;
          function fromBits(lowBits, highBits, unsigned) {
            return new Long(lowBits, highBits, unsigned);
          }
          Long.fromBits = fromBits;
          var pow_dbl = Math.pow;
          function fromString(str, unsigned, radix) {
            if (str.length === 0) throw Error("empty string");
            if (typeof unsigned === "number") {
              radix = unsigned;
              unsigned = false;
            } else {
              unsigned = !!unsigned;
            }
            if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
              return unsigned ? UZERO : ZERO;
            radix = radix || 10;
            if (radix < 2 || 36 < radix) throw RangeError("radix");
            var p;
            if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (p === 0) {
              return fromString(str.substring(1), unsigned, radix).neg();
            }
            var radixToPower = fromNumber(pow_dbl(radix, 8));
            var result = ZERO;
            for (var i = 0; i < str.length; i += 8) {
              var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
              if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
              } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
              }
            }
            result.unsigned = unsigned;
            return result;
          }
          Long.fromString = fromString;
          function fromValue(val, unsigned) {
            if (typeof val === "number") return fromNumber(val, unsigned);
            if (typeof val === "string") return fromString(val, unsigned);
            return fromBits(
              val.low,
              val.high,
              typeof unsigned === "boolean" ? unsigned : val.unsigned
            );
          }
          Long.fromValue = fromValue;
          var TWO_PWR_16_DBL = 1 << 16;
          var TWO_PWR_24_DBL = 1 << 24;
          var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
          var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
          var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
          var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
          var ZERO = fromInt(0);
          Long.ZERO = ZERO;
          var UZERO = fromInt(0, true);
          Long.UZERO = UZERO;
          var ONE = fromInt(1);
          Long.ONE = ONE;
          var UONE = fromInt(1, true);
          Long.UONE = UONE;
          var NEG_ONE = fromInt(-1);
          Long.NEG_ONE = NEG_ONE;
          var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
          Long.MAX_VALUE = MAX_VALUE;
          var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
          Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
          var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
          Long.MIN_VALUE = MIN_VALUE;
          var LongPrototype = Long.prototype;
          LongPrototype.toInt = function toInt() {
            return this.unsigned ? this.low >>> 0 : this.low;
          };
          LongPrototype.toNumber = function toNumber() {
            if (this.unsigned)
              return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
            return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
          };
          LongPrototype.toString = function toString(radix) {
            radix = radix || 10;
            if (radix < 2 || 36 < radix) throw RangeError("radix");
            if (this.isZero()) return "0";
            if (this.isNegative()) {
              if (this.eq(MIN_VALUE)) {
                var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
              } else return "-" + this.neg().toString(radix);
            }
            var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
            var result = "";
            while (true) {
              var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
              rem = remDiv;
              if (rem.isZero()) return digits + result;
              else {
                while (digits.length < 6) digits = "0" + digits;
                result = "" + digits + result;
              }
            }
          };
          LongPrototype.getHighBits = function getHighBits() {
            return this.high;
          };
          LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
            return this.high >>> 0;
          };
          LongPrototype.getLowBits = function getLowBits() {
            return this.low;
          };
          LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
            return this.low >>> 0;
          };
          LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
            if (this.isNegative())
              return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
            var val = this.high != 0 ? this.high : this.low;
            for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
            return this.high != 0 ? bit + 33 : bit + 1;
          };
          LongPrototype.isSafeInteger = function isSafeInteger() {
            var top11Bits = this.high >> 21;
            if (!top11Bits) return true;
            if (this.unsigned) return false;
            return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
          };
          LongPrototype.isZero = function isZero() {
            return this.high === 0 && this.low === 0;
          };
          LongPrototype.eqz = LongPrototype.isZero;
          LongPrototype.isNegative = function isNegative() {
            return !this.unsigned && this.high < 0;
          };
          LongPrototype.isPositive = function isPositive() {
            return this.unsigned || this.high >= 0;
          };
          LongPrototype.isOdd = function isOdd() {
            return (this.low & 1) === 1;
          };
          LongPrototype.isEven = function isEven() {
            return (this.low & 1) === 0;
          };
          LongPrototype.equals = function equals(other) {
            if (!isLong(other)) other = fromValue(other);
            if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
              return false;
            return this.high === other.high && this.low === other.low;
          };
          LongPrototype.eq = LongPrototype.equals;
          LongPrototype.notEquals = function notEquals(other) {
            return !this.eq(
              /* validates */
              other
            );
          };
          LongPrototype.neq = LongPrototype.notEquals;
          LongPrototype.ne = LongPrototype.notEquals;
          LongPrototype.lessThan = function lessThan(other) {
            return this.comp(
              /* validates */
              other
            ) < 0;
          };
          LongPrototype.lt = LongPrototype.lessThan;
          LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
            return this.comp(
              /* validates */
              other
            ) <= 0;
          };
          LongPrototype.lte = LongPrototype.lessThanOrEqual;
          LongPrototype.le = LongPrototype.lessThanOrEqual;
          LongPrototype.greaterThan = function greaterThan(other) {
            return this.comp(
              /* validates */
              other
            ) > 0;
          };
          LongPrototype.gt = LongPrototype.greaterThan;
          LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
            return this.comp(
              /* validates */
              other
            ) >= 0;
          };
          LongPrototype.gte = LongPrototype.greaterThanOrEqual;
          LongPrototype.ge = LongPrototype.greaterThanOrEqual;
          LongPrototype.compare = function compare(other) {
            if (!isLong(other)) other = fromValue(other);
            if (this.eq(other)) return 0;
            var thisNeg = this.isNegative(), otherNeg = other.isNegative();
            if (thisNeg && !otherNeg) return -1;
            if (!thisNeg && otherNeg) return 1;
            if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
            return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
          };
          LongPrototype.comp = LongPrototype.compare;
          LongPrototype.negate = function negate() {
            if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
            return this.not().add(ONE);
          };
          LongPrototype.neg = LongPrototype.negate;
          LongPrototype.add = function add2(addend) {
            if (!isLong(addend)) addend = fromValue(addend);
            var a48 = this.high >>> 16;
            var a32 = this.high & 65535;
            var a16 = this.low >>> 16;
            var a00 = this.low & 65535;
            var b48 = addend.high >>> 16;
            var b32 = addend.high & 65535;
            var b16 = addend.low >>> 16;
            var b00 = addend.low & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 + b48;
            c48 &= 65535;
            return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
          };
          LongPrototype.subtract = function subtract(subtrahend) {
            if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
            return this.add(subtrahend.neg());
          };
          LongPrototype.sub = LongPrototype.subtract;
          LongPrototype.multiply = function multiply(multiplier) {
            if (this.isZero()) return this;
            if (!isLong(multiplier)) multiplier = fromValue(multiplier);
            if (wasm) {
              var low = wasm["mul"](
                this.low,
                this.high,
                multiplier.low,
                multiplier.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
            if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
            if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
            if (this.isNegative()) {
              if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
              else return this.neg().mul(multiplier).neg();
            } else if (multiplier.isNegative())
              return this.mul(multiplier.neg()).neg();
            if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
              return fromNumber(
                this.toNumber() * multiplier.toNumber(),
                this.unsigned
              );
            var a48 = this.high >>> 16;
            var a32 = this.high & 65535;
            var a16 = this.low >>> 16;
            var a00 = this.low & 65535;
            var b48 = multiplier.high >>> 16;
            var b32 = multiplier.high & 65535;
            var b16 = multiplier.low >>> 16;
            var b00 = multiplier.low & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 * b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 * b00;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c16 += a00 * b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 * b00;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a16 * b16;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a00 * b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
            c48 &= 65535;
            return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
          };
          LongPrototype.mul = LongPrototype.multiply;
          LongPrototype.divide = function divide(divisor) {
            if (!isLong(divisor)) divisor = fromValue(divisor);
            if (divisor.isZero()) throw Error("division by zero");
            if (wasm) {
              if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
                return this;
              }
              var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
                this.low,
                this.high,
                divisor.low,
                divisor.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            if (this.isZero()) return this.unsigned ? UZERO : ZERO;
            var approx, rem, res;
            if (!this.unsigned) {
              if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                  return MIN_VALUE;
                else if (divisor.eq(MIN_VALUE)) return ONE;
                else {
                  var halfThis = this.shr(1);
                  approx = halfThis.div(divisor).shl(1);
                  if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                  } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                  }
                }
              } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
              if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
              } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
              res = ZERO;
            } else {
              if (!divisor.unsigned) divisor = divisor.toUnsigned();
              if (divisor.gt(this)) return UZERO;
              if (divisor.gt(this.shru(1)))
                return UONE;
              res = UZERO;
            }
            rem = this;
            while (rem.gte(divisor)) {
              approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
              var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
              while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
              }
              if (approxRes.isZero()) approxRes = ONE;
              res = res.add(approxRes);
              rem = rem.sub(approxRem);
            }
            return res;
          };
          LongPrototype.div = LongPrototype.divide;
          LongPrototype.modulo = function modulo(divisor) {
            if (!isLong(divisor)) divisor = fromValue(divisor);
            if (wasm) {
              var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
                this.low,
                this.high,
                divisor.low,
                divisor.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            return this.sub(this.div(divisor).mul(divisor));
          };
          LongPrototype.mod = LongPrototype.modulo;
          LongPrototype.rem = LongPrototype.modulo;
          LongPrototype.not = function not() {
            return fromBits(~this.low, ~this.high, this.unsigned);
          };
          LongPrototype.countLeadingZeros = function countLeadingZeros() {
            return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
          };
          LongPrototype.clz = LongPrototype.countLeadingZeros;
          LongPrototype.countTrailingZeros = function countTrailingZeros() {
            return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
          };
          LongPrototype.ctz = LongPrototype.countTrailingZeros;
          LongPrototype.and = function and(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low & other.low,
              this.high & other.high,
              this.unsigned
            );
          };
          LongPrototype.or = function or(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low | other.low,
              this.high | other.high,
              this.unsigned
            );
          };
          LongPrototype.xor = function xor(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low ^ other.low,
              this.high ^ other.high,
              this.unsigned
            );
          };
          LongPrototype.shiftLeft = function shiftLeft(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            else if (numBits < 32)
              return fromBits(
                this.low << numBits,
                this.high << numBits | this.low >>> 32 - numBits,
                this.unsigned
              );
            else return fromBits(0, this.low << numBits - 32, this.unsigned);
          };
          LongPrototype.shl = LongPrototype.shiftLeft;
          LongPrototype.shiftRight = function shiftRight(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            else if (numBits < 32)
              return fromBits(
                this.low >>> numBits | this.high << 32 - numBits,
                this.high >> numBits,
                this.unsigned
              );
            else
              return fromBits(
                this.high >> numBits - 32,
                this.high >= 0 ? 0 : -1,
                this.unsigned
              );
          };
          LongPrototype.shr = LongPrototype.shiftRight;
          LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits < 32)
              return fromBits(
                this.low >>> numBits | this.high << 32 - numBits,
                this.high >>> numBits,
                this.unsigned
              );
            if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
            return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
          };
          LongPrototype.shru = LongPrototype.shiftRightUnsigned;
          LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
          LongPrototype.rotateLeft = function rotateLeft(numBits) {
            var b;
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
            if (numBits < 32) {
              b = 32 - numBits;
              return fromBits(
                this.low << numBits | this.high >>> b,
                this.high << numBits | this.low >>> b,
                this.unsigned
              );
            }
            numBits -= 32;
            b = 32 - numBits;
            return fromBits(
              this.high << numBits | this.low >>> b,
              this.low << numBits | this.high >>> b,
              this.unsigned
            );
          };
          LongPrototype.rotl = LongPrototype.rotateLeft;
          LongPrototype.rotateRight = function rotateRight(numBits) {
            var b;
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
            if (numBits < 32) {
              b = 32 - numBits;
              return fromBits(
                this.high << b | this.low >>> numBits,
                this.low << b | this.high >>> numBits,
                this.unsigned
              );
            }
            numBits -= 32;
            b = 32 - numBits;
            return fromBits(
              this.low << b | this.high >>> numBits,
              this.high << b | this.low >>> numBits,
              this.unsigned
            );
          };
          LongPrototype.rotr = LongPrototype.rotateRight;
          LongPrototype.toSigned = function toSigned() {
            if (!this.unsigned) return this;
            return fromBits(this.low, this.high, false);
          };
          LongPrototype.toUnsigned = function toUnsigned() {
            if (this.unsigned) return this;
            return fromBits(this.low, this.high, true);
          };
          LongPrototype.toBytes = function toBytes(le) {
            return le ? this.toBytesLE() : this.toBytesBE();
          };
          LongPrototype.toBytesLE = function toBytesLE() {
            var hi = this.high, lo = this.low;
            return [
              lo & 255,
              lo >>> 8 & 255,
              lo >>> 16 & 255,
              lo >>> 24,
              hi & 255,
              hi >>> 8 & 255,
              hi >>> 16 & 255,
              hi >>> 24
            ];
          };
          LongPrototype.toBytesBE = function toBytesBE() {
            var hi = this.high, lo = this.low;
            return [
              hi >>> 24,
              hi >>> 16 & 255,
              hi >>> 8 & 255,
              hi & 255,
              lo >>> 24,
              lo >>> 16 & 255,
              lo >>> 8 & 255,
              lo & 255
            ];
          };
          Long.fromBytes = function fromBytes(bytes, unsigned, le) {
            return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
          };
          Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
            return new Long(
              bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
              bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
              unsigned
            );
          };
          Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
            return new Long(
              bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
              bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
              unsigned
            );
          };
          if (typeof BigInt === "function") {
            Long.fromBigInt = function fromBigInt(value, unsigned) {
              var lowBits = Number(BigInt.asIntN(32, value));
              var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
              return fromBits(lowBits, highBits, unsigned);
            };
            Long.fromValue = function fromValueWithBigInt(value, unsigned) {
              if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
              return fromValue(value, unsigned);
            };
            LongPrototype.toBigInt = function toBigInt() {
              var lowBigInt = BigInt(this.low >>> 0);
              var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
              return highBigInt << BigInt(32) | lowBigInt;
            };
          }
          var _default = _exports.default = Long;
        }
      );
    }
  });

  // node_modules/protobufjs/src/util/minimal.js
  var require_minimal = __commonJS({
    "node_modules/protobufjs/src/util/minimal.js"(exports2) {
      "use strict";
      var util = exports2;
      util.asPromise = require_aspromise();
      util.base64 = require_base64();
      util.EventEmitter = require_eventemitter();
      util.float = require_float();
      util.utf8 = require_utf8();
      util.pool = require_pool();
      util.LongBits = require_longbits();
      function isUnsafeProperty(key) {
        return key === "__proto__" || key === "prototype" || key === "constructor";
      }
      util.isUnsafeProperty = isUnsafeProperty;
      util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
      util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || typeof globalThis !== "undefined" && globalThis || exports2;
      util.emptyArray = Object.freeze ? Object.freeze([]) : (
        /* istanbul ignore next */
        []
      );
      util.emptyObject = Object.freeze ? Object.freeze({}) : (
        /* istanbul ignore next */
        {}
      );
      util.isInteger = Number.isInteger || /* istanbul ignore next */
      function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject(value) {
        return value && typeof value === "object";
      };
      util.isset = /**
       * Checks if a property on a message is considered to be present.
       * @param {Object} obj Plain object or message instance
       * @param {string} prop Property name
       * @returns {boolean} `true` if considered to be present, otherwise `false`
       */
      util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && Object.hasOwnProperty.call(obj, prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = (function() {
        try {
          var Buffer2 = util.global.Buffer;
          return Buffer2.prototype.utf8Write || util.isNode ? Buffer2 : (
            /* istanbul ignore next */
            null
          );
        } catch (e) {
          return null;
        }
      })();
      util.newBuffer = function newBuffer(sizeOrArray) {
        var Buffer2 = util.Buffer;
        return typeof sizeOrArray === "number" ? Buffer2 ? Buffer2.allocUnsafe(sizeOrArray) : new Uint8Array(sizeOrArray) : Buffer2 ? Buffer2.from(sizeOrArray) : new Uint8Array(sizeOrArray);
      };
      util.rawField = function rawField(id, wireType, data) {
        var out = [], tag = id << 3 | wireType;
        tag >>>= 0;
        while (tag > 127) {
          out.push(tag & 127 | 128);
          tag >>>= 7;
        }
        out.push(tag);
        for (var i = 0; i < data.length; ++i)
          out.push(data[i]);
        return util.newBuffer(out);
      };
      util.Array = Uint8Array;
      util.Long = /* istanbul ignore next */
      util.global.dcodeIO && /* istanbul ignore next */
      util.global.dcodeIO.Long || /* istanbul ignore next */
      util.global.Long || (function() {
        try {
          var Long = require_umd();
          return Long && Long.isLong ? Long : null;
        } catch (e) {
          return null;
        }
      })();
      util.key2Re = /^(?:true|false|0|1)$/;
      util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
      util.key64Re = /^(?:[\x00-\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
      util.longToHash = function longToHash(value) {
        return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
      };
      util.longFromHash = function longFromHash(hash, unsigned) {
        var bits = util.LongBits.fromHash(hash);
        if (util.Long)
          return util.Long.fromBits(bits.lo, bits.hi, unsigned);
        return bits.toNumber(Boolean(unsigned));
      };
      util.longFromKey = function longFromKey(key, unsigned) {
        return util.key64Re.test(key) && !util.key32Re.test(key) ? util.longFromHash(key, unsigned) : key;
      };
      util.boolFromKey = function boolFromKey(key) {
        return key === "true" || key === "1";
      };
      function merge(dst) {
        var ifNotSet = typeof arguments[arguments.length - 1] === "boolean", limit = ifNotSet ? arguments.length - 1 : arguments.length;
        ifNotSet = ifNotSet && arguments[arguments.length - 1];
        for (var a = 1; a < limit; ++a) {
          var src = arguments[a];
          if (!src)
            continue;
          for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
            if (!isUnsafeProperty(keys[i]) && (!ifNotSet || !Object.prototype.hasOwnProperty.call(dst, keys[i]) || dst[keys[i]] === void 0))
              dst[keys[i]] = src[keys[i]];
        }
        return dst;
      }
      util.merge = merge;
      util.nestingLimit = 32;
      util.recursionLimit = 100;
      util.makeProp = function makeProp(obj, key, enumerable) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          return;
        Object.defineProperty(obj, key, {
          enumerable: enumerable === void 0 ? true : enumerable,
          configurable: true,
          writable: true
        });
      };
      util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      };
      function newError(name) {
        function CustomError(message, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        CustomError.prototype = Object.create(Error.prototype, {
          constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true
          },
          name: {
            get: function get() {
              return name;
            },
            set: void 0,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true
          },
          toString: {
            value: function value() {
              return this.name + ": " + this.message;
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
        return CustomError;
      }
      util.newError = newError;
      util.ProtocolError = newError("ProtocolError");
      util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
          fieldMap[fieldNames[i]] = 1;
        return function() {
          for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
            if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
              return keys[i2];
        };
      };
      util.oneOfSetter = function setOneOf(fieldNames) {
        return function(name) {
          for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
              delete this[fieldNames[i]];
        };
      };
      util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
      };
    }
  });

  // node_modules/protobufjs/src/writer.js
  var require_writer = __commonJS({
    "node_modules/protobufjs/src/writer.js"(exports2, module2) {
      "use strict";
      module2.exports = Writer;
      var util = require_minimal();
      var BufferWriter;
      var LongBits = util.LongBits;
      var base64 = util.base64;
      var utf8 = util.utf8;
      function Writer() {
        this.pos = 0;
        this.buf = this.constructor.alloc(Writer.initialBufferSize);
        this.view = null;
        this.states = null;
      }
      Writer.initialBufferSize = 128;
      Object.defineProperty(Writer.prototype, "len", {
        configurable: true,
        enumerable: true,
        get: function get_len() {
          return this.pos;
        }
      });
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup() {
          return (Writer.create = function create_buffer() {
            return new BufferWriter();
          })();
        } : function create_array() {
          return new Writer();
        };
      };
      Writer.create = create();
      Writer.alloc = function alloc(size) {
        return new Uint8Array(size);
      };
      Writer.alloc = util.pool(Writer.alloc, Uint8Array.prototype.subarray);
      function sizeVarint32(value) {
        return value < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5;
      }
      Writer.prototype._reserve = function _reserve(n) {
        var need = this.pos + n;
        if (need > this.buf.length) {
          var size = this.buf.length << 1;
          if (size < need)
            size = need;
          var buf = this.constructor.alloc(size);
          buf.set(this.buf.subarray(0, this.pos), 0);
          this.buf = buf;
          this.view = null;
        }
      };
      function writeStringAscii(val, buf, pos) {
        for (var i = 0; i < val.length; )
          buf[pos++] = val.charCodeAt(i++);
      }
      function writeVarint32(val, buf, pos) {
        while (val > 127) {
          buf[pos++] = val & 127 | 128;
          val >>>= 7;
        }
        buf[pos] = val;
        return pos + 1;
      }
      Writer.prototype.uint32 = function write_uint32(value) {
        value = value >>> 0;
        this._reserve(5);
        var pos = this.pos;
        this.pos = writeVarint32(value, this.buf, pos);
        return this;
      };
      Writer.prototype.int32 = function write_int32(value) {
        if ((value |= 0) < 0) {
          this._reserve(10);
          writeVarint64(LongBits.fromNumber(value), this.buf, this.pos);
          this.pos += 10;
          return this;
        }
        return this.uint32(value);
      };
      Writer.prototype.sint32 = function write_sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
      };
      function writeVarint64(val, buf, pos) {
        var lo = val.lo, hi = val.hi;
        while (hi) {
          buf[pos++] = lo & 127 | 128;
          lo = (lo >>> 7 | hi << 25) >>> 0;
          hi >>>= 7;
        }
        while (lo > 127) {
          buf[pos++] = lo & 127 | 128;
          lo = lo >>> 7;
        }
        buf[pos] = lo;
        return pos + 1;
      }
      Writer.prototype.uint64 = function write_uint64(value) {
        var bits = LongBits.from(value);
        this._reserve(10);
        var pos = this.pos;
        this.pos = writeVarint64(bits, this.buf, pos);
        return this;
      };
      Writer.prototype.int64 = Writer.prototype.uint64;
      Writer.prototype.sint64 = function write_sint64(value) {
        var bits = LongBits.from(value).zzEncode();
        this._reserve(10);
        var pos = this.pos;
        this.pos = writeVarint64(bits, this.buf, pos);
        return this;
      };
      Writer.prototype.bool = function write_bool(value) {
        this._reserve(1);
        this.buf[this.pos++] = value ? 1 : 0;
        return this;
      };
      function writeFixed32(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      Writer.prototype.fixed32 = function write_fixed32(value) {
        this._reserve(4);
        writeFixed32(value >>> 0, this.buf, this.pos);
        this.pos += 4;
        return this;
      };
      Writer.prototype.sfixed32 = Writer.prototype.fixed32;
      Writer.prototype.fixed64 = function write_fixed64(value) {
        var bits = LongBits.from(value);
        this._reserve(8);
        writeFixed32(bits.lo, this.buf, this.pos);
        writeFixed32(bits.hi, this.buf, this.pos + 4);
        this.pos += 8;
        return this;
      };
      Writer.prototype.sfixed64 = Writer.prototype.fixed64;
      Writer.prototype.float = function write_float(value) {
        this._reserve(4);
        util.float.writeFloatLE(value, this.buf, this.pos);
        this.pos += 4;
        return this;
      };
      Writer.prototype.double = function write_double(value) {
        this._reserve(8);
        util.float.writeDoubleLE(value, this.buf, this.pos);
        this.pos += 8;
        return this;
      };
      Writer.prototype.bytes = function write_bytes(value) {
        var len = value.length >>> 0;
        if (!len) {
          this._reserve(1);
          this.buf[this.pos++] = 0;
          return this;
        }
        if (util.isString(value)) {
          var buf = Writer.alloc(len = base64.length(value));
          base64.decode(value, buf, 0);
          value = buf;
        }
        this.uint32(len);
        this._reserve(len);
        this.buf.set(value, this.pos);
        this.pos += len;
        return this;
      };
      Writer.prototype.raw = function write_raw(value) {
        var len = value.length >>> 0;
        if (!len)
          return this;
        this._reserve(len);
        this.buf.set(value, this.pos);
        this.pos += len;
        return this;
      };
      Writer.prototype._delim = function _delim(pos, len) {
        var n = sizeVarint32(len);
        if (n > 1)
          this.buf.copyWithin(pos + n, pos + 1, pos + 1 + len);
        writeVarint32(len, this.buf, pos);
        this.pos = pos + n + len;
        return this;
      };
      Writer.prototype.string = function write_string(value) {
        var n = value.length;
        if (!n) {
          this._reserve(1);
          this.buf[this.pos++] = 0;
          return this;
        }
        if (n < 128) {
          this._reserve(n * 3 + 5);
          var lenPos = this.pos;
          return this._delim(lenPos, utf8.write(value, this.buf, lenPos + 1));
        }
        var len = utf8.length(value);
        this.uint32(len);
        this._reserve(len);
        if (len === value.length)
          writeStringAscii(value, this.buf, this.pos);
        else
          utf8.write(value, this.buf, this.pos);
        this.pos += len;
        return this;
      };
      Writer.prototype.uint32s = function write_uint32s(value) {
        var n = value.length;
        this._reserve(n * 5 + 5);
        var buf = this.buf, lenPos = this.pos, p = lenPos + 1;
        for (var i = 0; i < n; ++i)
          p = writeVarint32(value[i] >>> 0, buf, p);
        return this._delim(lenPos, p - lenPos - 1);
      };
      Writer.prototype.int32s = function write_int32s(value) {
        var n = value.length;
        this._reserve(n * 10 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1, val;
        for (var i = 0; i < n; ++i) {
          if ((val = value[i] | 0) < 0) {
            pos = writeVarint64(LongBits.fromNumber(val), buf, pos);
          } else {
            pos = writeVarint32(val, buf, pos);
          }
        }
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.sint32s = function write_sint32s(value) {
        var n = value.length;
        this._reserve(n * 5 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
        for (var i = 0; i < n; ++i)
          pos = writeVarint32((value[i] << 1 ^ value[i] >> 31) >>> 0, buf, pos);
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.uint64s = function write_uint64s(value) {
        var n = value.length;
        this._reserve(n * 10 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
        for (var i = 0; i < n; ++i) {
          pos = writeVarint64(LongBits.from(value[i]), buf, pos);
        }
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.int64s = Writer.prototype.uint64s;
      Writer.prototype.sint64s = function write_sint64s(value) {
        var n = value.length;
        this._reserve(n * 10 + 5);
        var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
        for (var i = 0; i < n; ++i) {
          pos = writeVarint64(LongBits.from(value[i]).zzEncode(), buf, pos);
        }
        return this._delim(lenPos, pos - lenPos - 1);
      };
      Writer.prototype.bools = function write_bools(value) {
        var n = value.length;
        this.uint32(n);
        this._reserve(n);
        var buf = this.buf, p = this.pos;
        for (var i = 0; i < n; ++i)
          buf[p++] = value[i] ? 1 : 0;
        this.pos += n;
        return this;
      };
      var VIEW_THRESHOLD_FLOAT = 16;
      var VIEW_THRESHOLD_INT = 128;
      function getLazyView(writer, count, threshold) {
        var view = writer.view;
        if (view || count < threshold)
          return view;
        var buf = writer.buf;
        return writer.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      }
      Writer.prototype.fixed32s = function write_fixed32s(value) {
        var n = value.length, bytes = n * 4;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_INT);
        if (dv)
          for (i = 0; i < n; ++i) {
            dv.setUint32(p, value[i] >>> 0, true);
            p += 4;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            writeFixed32(value[i] >>> 0, buf, p);
            p += 4;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.sfixed32s = Writer.prototype.fixed32s;
      Writer.prototype.fixed64s = function write_fixed64s(value) {
        var n = value.length, bytes = n * 8;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, bits, dv = getLazyView(this, n, VIEW_THRESHOLD_INT);
        if (dv)
          for (i = 0; i < n; ++i) {
            bits = LongBits.from(value[i]);
            dv.setUint32(p, bits.lo, true);
            dv.setUint32(p + 4, bits.hi, true);
            p += 8;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            bits = LongBits.from(value[i]);
            writeFixed32(bits.lo, buf, p);
            writeFixed32(bits.hi, buf, p + 4);
            p += 8;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.sfixed64s = Writer.prototype.fixed64s;
      Writer.prototype.floats = function write_floats(value) {
        var n = value.length, bytes = n * 4;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (i = 0; i < n; ++i) {
            dv.setFloat32(p, value[i], true);
            p += 4;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            util.float.writeFloatLE(value[i], buf, p);
            p += 4;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.doubles = function write_doubles(value) {
        var n = value.length, bytes = n * 8;
        this.uint32(bytes);
        this._reserve(bytes);
        var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (i = 0; i < n; ++i) {
            dv.setFloat64(p, value[i], true);
            p += 8;
          }
        else {
          var buf = this.buf;
          for (i = 0; i < n; ++i) {
            util.float.writeDoubleLE(value[i], buf, p);
            p += 8;
          }
        }
        this.pos += bytes;
        return this;
      };
      Writer.prototype.fork = function fork() {
        this._reserve(1);
        (this.states || (this.states = [])).push(this.pos);
        this.pos += 1;
        return this;
      };
      Writer.prototype.reset = function reset() {
        var states = this.states;
        if (states && states.length) {
          this.pos = states.pop();
        } else {
          this.pos = 0;
        }
        return this;
      };
      Writer.prototype.ldelim = function ldelim() {
        var states = this.states, len, vlen;
        if (states && states.length) {
          var lenPos = states.pop();
          len = this.pos - lenPos - 1;
          vlen = sizeVarint32(len);
          if (vlen > 1) {
            this._reserve(vlen - 1);
            this.buf.copyWithin(lenPos + vlen, lenPos + 1, lenPos + 1 + len);
            this.pos += vlen - 1;
            writeVarint32(len, this.buf, lenPos);
          } else {
            this.buf[lenPos] = len;
          }
        } else {
          len = this.pos;
          vlen = sizeVarint32(len);
          this._reserve(vlen);
          this.buf.copyWithin(vlen, 0, len);
          writeVarint32(len, this.buf, 0);
          this.pos += vlen;
        }
        return this;
      };
      Writer.prototype.finish = function finish2(shared) {
        if (shared)
          return this.buf.subarray(0, this.pos);
        var buf = this.constructor.alloc(this.pos);
        buf.set(this.buf.subarray(0, this.pos), 0);
        return buf;
      };
      Writer.prototype.finishInto = function finishInto(buf, offset) {
        if (offset === void 0)
          offset = 0;
        buf.set(this.buf.subarray(0, this.pos), offset);
        return buf;
      };
      Writer._configure = function(BufferWriter_) {
        BufferWriter = BufferWriter_;
        Writer.create = create();
        BufferWriter._configure();
      };
    }
  });

  // node_modules/protobufjs/src/writer_buffer.js
  var require_writer_buffer = __commonJS({
    "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferWriter;
      var Writer = require_writer();
      BufferWriter.prototype = Object.create(Writer.prototype, {
        constructor: {
          value: BufferWriter,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      var util = require_minimal();
      function BufferWriter() {
        Writer.call(this);
      }
      var writeStringBuffer;
      BufferWriter._configure = function() {
        BufferWriter.alloc = util.Buffer && util.Buffer.allocUnsafe;
        writeStringBuffer = util.Buffer && util.Buffer.prototype.utf8Write ? function writeStringBuffer_utf8Write(val, buf, pos) {
          return buf.utf8Write(val, pos);
        } : function writeStringBuffer_write(val, buf, pos) {
          return buf.write(val, pos);
        };
      };
      BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
        if (util.isString(value))
          value = util.Buffer.from(value, "base64");
        var len = value.length >>> 0;
        this.uint32(len);
        if (len) {
          this._reserve(len);
          this.buf.set(value, this.pos);
          this.pos += len;
        }
        return this;
      };
      BufferWriter.prototype.string = function write_string_buffer(value) {
        var n = value.length;
        if (!n) {
          this._reserve(1);
          this.buf[this.pos++] = 0;
          return this;
        }
        if (n < 128) {
          this._reserve(n * 3 + 5);
          var pos = this.pos, buf = this.buf;
          return this._delim(
            pos,
            n < 40 ? util.utf8.write(value, buf, pos + 1) : writeStringBuffer(value, buf, pos + 1)
          );
        }
        var len = util.Buffer.byteLength(value);
        this.uint32(len);
        this._reserve(len);
        writeStringBuffer(value, this.buf, this.pos);
        this.pos += len;
        return this;
      };
      BufferWriter._configure();
    }
  });

  // node_modules/protobufjs/src/reader.js
  var require_reader = __commonJS({
    "node_modules/protobufjs/src/reader.js"(exports2, module2) {
      "use strict";
      module2.exports = Reader;
      var util = require_minimal();
      var BufferReader;
      var LongBits = util.LongBits;
      var utf8 = util.utf8;
      function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
      }
      function Reader(buffer) {
        this.buf = buffer;
        this.pos = 0;
        this.len = buffer.length;
        this.view = null;
        this.discardUnknown = Reader.discardUnknown;
      }
      function create_array(buffer) {
        if (Array.isArray(buffer))
          buffer = new Uint8Array(buffer);
        if (buffer instanceof Uint8Array)
          return new Reader(buffer);
        throw Error("illegal buffer");
      }
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup(buffer) {
          return (Reader.create = function create_buffer(buffer2) {
            return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
          })(buffer);
        } : create_array;
      };
      Reader.create = create();
      Reader.prototype.raw = function read_raw(start, end) {
        return this.buf.subarray(start, end);
      };
      function readVarint32NearEnd(reader) {
        var value = 0;
        for (var i = 0; i < 4; ++i) {
          if (reader.pos >= reader.len)
            throw indexOutOfRange(reader);
          var b = reader.buf[reader.pos++];
          value = (value | (b & 127) << i * 7) >>> 0;
          if (b < 128)
            return value;
        }
        throw indexOutOfRange(reader);
      }
      Reader.prototype.uint32 = function read_uint32() {
        if (this.len - this.pos < 5) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          if (this.buf[this.pos] >= 128)
            return readVarint32NearEnd(this);
        }
        var buf = this.buf, pos = this.pos, value = (buf[pos] & 127) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 7) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 14) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 21) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 15) << 28) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        for (var i = 0; i < 5; ++i) {
          if (pos >= this.len) {
            this.pos = pos;
            throw indexOutOfRange(this);
          }
          if (buf[pos++] < 128) {
            this.pos = pos;
            return value;
          }
        }
        this.pos = pos;
        throw Error("invalid varint encoding");
      };
      Reader.prototype.tag = function read_tag() {
        if (this.len - this.pos < 5) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          if (this.buf[this.pos] >= 128)
            return readVarint32NearEnd(this);
        }
        var buf = this.buf, pos = this.pos, value = (buf[pos] & 127) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 7) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 14) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 127) << 21) >>> 0;
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
        value = (value | (buf[pos] & 15) << 28) >>> 0;
        if (buf[pos] < 128 && (buf[pos] & 112) === 0) {
          this.pos = pos + 1;
          return value;
        }
        this.pos = pos + 1;
        throw Error("invalid tag encoding");
      };
      Reader.prototype.int32 = function read_int32() {
        return this.uint32() | 0;
      };
      Reader.prototype.sint32 = function read_sint32() {
        var value = this.uint32();
        return value >>> 1 ^ -(value & 1) | 0;
      };
      function readLongVarint() {
        var bits = new LongBits(0, 0);
        var i = 0;
        if (this.len - this.pos > 4) {
          for (; i < 4; ++i) {
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
          i = 0;
        } else {
          for (; i < 4; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          throw indexOutOfRange(this);
        }
        if (this.len - this.pos > 4) {
          for (; i < 5; ++i) {
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        } else {
          for (; i < 5; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        }
        throw Error("invalid varint encoding");
      }
      Reader.prototype.bool = function read_bool() {
        var value = false, b;
        for (var i = 0; i < 10; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          b = this.buf[this.pos++];
          if (b & 127)
            value = true;
          if (b < 128)
            return value;
        }
        throw Error("invalid varint encoding");
      };
      function readFixed32_end(buf, end) {
        return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
      }
      Reader.prototype.fixed32 = function read_fixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4);
      };
      Reader.prototype.sfixed32 = function read_sfixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4) | 0;
      };
      function readFixed64() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 8);
        return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
      }
      Reader.prototype.float = function read_float() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readFloatLE(this.buf, this.pos);
        this.pos += 4;
        return value;
      };
      Reader.prototype.double = function read_double() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readDoubleLE(this.buf, this.pos);
        this.pos += 8;
        return value;
      };
      Reader.prototype.uint32s = function read_uint32s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len, buf = this.buf, pos = this.pos, value;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (pos < end) {
          value = buf[pos++];
          if (value < 128)
            array.push(value);
          else {
            this.pos = pos - 1;
            array.push(this.uint32());
            pos = this.pos;
          }
        }
        this.pos = pos;
        if (pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      Reader.prototype.int32s = function read_int32s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len, buf = this.buf, pos = this.pos, value;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (pos < end) {
          value = buf[pos++];
          if (value < 128)
            array.push(value);
          else {
            this.pos = pos - 1;
            array.push(this.int32());
            pos = this.pos;
          }
        }
        this.pos = pos;
        if (pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      Reader.prototype.sint32s = function read_sint32s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (this.pos < end)
          array.push(this.sint32());
        if (this.pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      Reader.prototype.bools = function read_bools(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len, buf = this.buf, pos = this.pos, value;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (pos < end) {
          value = buf[pos++];
          if (value < 128)
            array.push(value !== 0);
          else {
            this.pos = pos - 1;
            array.push(this.bool());
            pos = this.pos;
          }
        }
        this.pos = pos;
        if (pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      var VIEW_THRESHOLD_FLOAT = 8;
      var VIEW_THRESHOLD_INT = 128;
      function getLazyView(reader, count, threshold) {
        var view = reader.view;
        if (view || count < threshold)
          return view;
        var buf = reader.buf;
        return reader.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      }
      Reader.prototype.fixed32s = function read_fixed32s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 2, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_INT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getUint32(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 4) array[i++] = readFixed32_end(buf, pos + 4);
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 4);
        return array;
      };
      Reader.prototype.sfixed32s = function read_sfixed32s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 2, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_INT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getInt32(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 4) array[i++] = readFixed32_end(buf, pos + 4) | 0;
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 4);
        return array;
      };
      Reader.prototype.floats = function read_floats(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 2, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getFloat32(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 4) array[i++] = util.float.readFloatLE(buf, pos);
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 4);
        return array;
      };
      Reader.prototype.doubles = function read_doubles(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 3, i = array.length, pos = this.pos;
        array.length = i + count;
        var dv = getLazyView(this, count, VIEW_THRESHOLD_FLOAT);
        if (dv)
          for (var k = 0; k < count; ++k, pos += 8) array[i++] = dv.getFloat64(pos, true);
        else {
          var buf = this.buf;
          for (var j = 0; j < count; ++j, pos += 8) array[i++] = util.float.readDoubleLE(buf, pos);
        }
        this.pos = pos;
        if (pos !== end) throw indexOutOfRange(this, 8);
        return array;
      };
      Reader.prototype.uint64s = function read_uint64s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (this.pos < end)
          array.push(this.uint64());
        if (this.pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      Reader.prototype.int64s = function read_int64s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (this.pos < end)
          array.push(this.int64());
        if (this.pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      Reader.prototype.sint64s = function read_sint64s(array) {
        if (array === void 0) array = [];
        var end = this.uint32() + this.pos, len = this.len;
        if (end > len) throw indexOutOfRange(this, end - this.pos);
        this.len = end;
        while (this.pos < end)
          array.push(this.sint64());
        if (this.pos !== end) throw RangeError("index out of range");
        this.len = len;
        return array;
      };
      Reader.prototype.fixed64s = function read_fixed64s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len, i = array.length;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 3;
        array.length = i + count;
        for (var j = 0; j < count; ++j)
          array[i++] = this.fixed64();
        if (this.pos !== end) throw indexOutOfRange(this, 8);
        return array;
      };
      Reader.prototype.sfixed64s = function read_sfixed64s(array) {
        if (array === void 0) array = [];
        var len = this.uint32(), end = this.pos + len, i = array.length;
        if (end > this.len) throw indexOutOfRange(this, len);
        var count = len >>> 3;
        array.length = i + count;
        for (var j = 0; j < count; ++j)
          array[i++] = this.sfixed64();
        if (this.pos !== end) throw indexOutOfRange(this, 8);
        return array;
      };
      Reader.prototype.bytes = function read_bytes() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos = end;
        return this.raw(start, end);
      };
      Reader.prototype.string = function read_string() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos = end;
        return utf8.read(this.buf, start, end);
      };
      Reader.prototype.stringVerify = function read_string_verify() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos = end;
        return utf8.readStrict(this.buf, start, end);
      };
      Reader.prototype.skip = function skip(length) {
        if (typeof length === "number") {
          if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
          this.pos += length;
        } else {
          do {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
          } while (this.buf[this.pos++] & 128);
        }
        return this;
      };
      Reader.recursionLimit = util.recursionLimit;
      Reader.discardUnknown = true;
      Reader.prototype.skipType = function(wireType, depth, fieldNumber) {
        if (depth === void 0) depth = 0;
        if (depth > Reader.recursionLimit)
          throw Error("max depth exceeded");
        if (fieldNumber === 0)
          throw Error("illegal tag: field number 0");
        switch (wireType) {
          case 0:
            this.skip();
            break;
          case 1:
            this.skip(8);
            break;
          case 2:
            this.skip(this.uint32());
            break;
          case 3:
            while (true) {
              var tag = this.tag();
              var nestedField = tag >>> 3;
              wireType = tag & 7;
              if (!nestedField)
                throw Error("illegal tag: field number 0");
              if (wireType === 4) {
                if (fieldNumber !== void 0 && nestedField !== fieldNumber)
                  throw Error("invalid end group tag");
                break;
              }
              this.skipType(wireType, depth + 1, nestedField);
            }
            break;
          case 5:
            this.skip(4);
            break;
          /* istanbul ignore next */
          default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
      };
      Reader._configure = function(BufferReader_) {
        BufferReader = BufferReader_;
        Reader.create = create();
        BufferReader._configure();
        var fn = util.Long ? "toLong" : (
          /* istanbul ignore next */
          "toNumber"
        );
        util.merge(Reader.prototype, {
          int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
          },
          uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
          },
          sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
          },
          fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
          },
          sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
          }
        });
      };
    }
  });

  // node_modules/protobufjs/src/reader_buffer.js
  var require_reader_buffer = __commonJS({
    "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferReader;
      var Reader = require_reader();
      BufferReader.prototype = Object.create(Reader.prototype, {
        constructor: {
          value: BufferReader,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      var util = require_minimal();
      function BufferReader(buffer) {
        Reader.call(this, buffer);
      }
      BufferReader._configure = function() {
        if (util.Buffer)
          BufferReader.prototype._slice = util.Buffer.prototype.slice;
      };
      BufferReader.prototype.raw = function read_raw_buffer(start, end) {
        return this._slice.call(this.buf, start, end);
      };
      BufferReader.prototype.string = function read_string_buffer() {
        var len = this.uint32(), start = this.pos, end = this.pos + len;
        if (end > this.len)
          throw RangeError("index out of range: " + this.pos + " + " + len + " > " + this.len);
        this.pos = end;
        return this.buf.utf8Slice ? this.buf.utf8Slice(start, end) : this.buf.toString("utf-8", start, end);
      };
      BufferReader._configure();
    }
  });

  // node_modules/protobufjs/src/rpc/service.js
  var require_service = __commonJS({
    "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var util = require_minimal();
      Service.prototype = Object.create(util.EventEmitter.prototype, {
        constructor: {
          value: Service,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      function Service(rpcImpl, requestDelimited, responseDelimited) {
        if (typeof rpcImpl !== "function")
          throw TypeError("rpcImpl must be a function");
        util.EventEmitter.call(this);
        this.rpcImpl = rpcImpl;
        this.requestDelimited = Boolean(requestDelimited);
        this.responseDelimited = Boolean(responseDelimited);
      }
      Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
        if (!request)
          throw TypeError("request must be specified");
        var self2 = this;
        if (!callback)
          return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
        if (!self2.rpcImpl) {
          setTimeout(function() {
            callback(Error("already ended"));
          }, 0);
          return void 0;
        }
        try {
          return self2.rpcImpl(
            method,
            requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {
              if (err) {
                self2.emit("error", err, method);
                return callback(err);
              }
              if (response === null) {
                self2.end(
                  /* endedByRPC */
                  true
                );
                return void 0;
              }
              if (!(response instanceof responseCtor)) {
                try {
                  response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
                } catch (err2) {
                  self2.emit("error", err2, method);
                  return callback(err2);
                }
              }
              self2.emit("data", response, method);
              return callback(null, response);
            }
          );
        } catch (err) {
          self2.emit("error", err, method);
          setTimeout(function() {
            callback(err);
          }, 0);
          return void 0;
        }
      };
      Service.prototype.end = function end(endedByRPC) {
        if (this.rpcImpl) {
          if (!endedByRPC)
            this.rpcImpl(null, null, null);
          this.rpcImpl = null;
          this.emit("end").off();
        }
        return this;
      };
    }
  });

  // node_modules/protobufjs/src/rpc.js
  var require_rpc = __commonJS({
    "node_modules/protobufjs/src/rpc.js"(exports2) {
      "use strict";
      var rpc = exports2;
      rpc.Service = require_service();
    }
  });

  // node_modules/protobufjs/src/roots.js
  var require_roots = __commonJS({
    "node_modules/protobufjs/src/roots.js"(exports2, module2) {
      "use strict";
      module2.exports = /* @__PURE__ */ Object.create(null);
    }
  });

  // node_modules/protobufjs/src/index-minimal.js
  var require_index_minimal = __commonJS({
    "node_modules/protobufjs/src/index-minimal.js"(exports2) {
      "use strict";
      exports2.build = "minimal";
      exports2.Writer = require_writer();
      exports2.BufferWriter = require_writer_buffer();
      exports2.Reader = require_reader();
      exports2.BufferReader = require_reader_buffer();
      exports2.util = require_minimal();
      exports2.rpc = require_rpc();
      exports2.roots = require_roots();
      exports2.configure = configure;
      function configure() {
        exports2.util.LongBits._configure(exports2.util.Long);
        exports2.Writer._configure(exports2.BufferWriter);
        exports2.Reader._configure(exports2.BufferReader);
      }
      configure();
    }
  });

  // node_modules/protobufjs/src/util/patterns.js
  var require_patterns = __commonJS({
    "node_modules/protobufjs/src/util/patterns.js"(exports2) {
      "use strict";
      var patterns = exports2;
      patterns.numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
      patterns.typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;
      patterns.reservedRe = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;
    }
  });

  // node_modules/protobufjs/src/util/codegen.js
  var require_codegen = __commonJS({
    "node_modules/protobufjs/src/util/codegen.js"(exports2, module2) {
      "use strict";
      module2.exports = codegen;
      var patterns = require_patterns();
      var reservedRe = patterns.reservedRe;
      function codegen(functionParams, functionName) {
        if (typeof functionParams === "string") {
          functionName = functionParams;
          functionParams = void 0;
        }
        var body = [];
        function Codegen(formatStringOrScope) {
          if (typeof formatStringOrScope !== "string") {
            var source = toString();
            if (codegen.verbose)
              console.log("codegen: " + source);
            source = "return " + source;
            if (formatStringOrScope) {
              var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
              while (scopeOffset < scopeKeys.length) {
                scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
              }
              scopeParams[scopeOffset] = source;
              return Function.apply(null, scopeParams).apply(null, scopeValues);
            }
            return Function(source)();
          }
          var formatParams = new Array(arguments.length - 1), formatOffset = 0;
          while (formatOffset < formatParams.length)
            formatParams[formatOffset] = arguments[++formatOffset];
          formatOffset = 0;
          formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
            var value = formatParams[formatOffset++];
            switch ($1) {
              case "d":
              case "f":
                value = Number(value);
                return Object.is(value, -0) ? "-0" : String(value);
              case "i":
                return String(Math.floor(value));
              case "j":
                return JSON.stringify(value);
              case "s":
                return String(value);
            }
            return "%";
          });
          if (formatOffset !== formatParams.length)
            throw Error("parameter count mismatch");
          body.push(formatStringOrScope);
          return Codegen;
        }
        function toString(functionNameOverride) {
          return "function " + safeFunctionName(functionNameOverride || functionName) + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
        }
        Object.defineProperty(Codegen, "toString", {
          value: toString,
          writable: true,
          enumerable: true,
          configurable: true
        });
        return Codegen;
      }
      codegen.verbose = false;
      function safeFunctionName(name) {
        if (!name)
          return "";
        name = String(name).replace(/[^\w$]/g, "");
        if (!name)
          return "";
        if (/^\d/.test(name))
          name = "_" + name;
        return reservedRe.test(name) ? name + "_" : name;
      }
    }
  });

  // (disabled):fs
  var require_fs = __commonJS({
    "(disabled):fs"() {
    }
  });

  // node_modules/protobufjs/src/util/fs.js
  var require_fs2 = __commonJS({
    "node_modules/protobufjs/src/util/fs.js"(exports2, module2) {
      "use strict";
      var fs = null;
      try {
        fs = require_fs();
        if (!fs || !fs.readFile || !fs.readFileSync)
          fs = null;
      } catch (e) {
      }
      module2.exports = fs;
    }
  });

  // node_modules/protobufjs/src/util/fetch.js
  var require_fetch = __commonJS({
    "node_modules/protobufjs/src/util/fetch.js"(exports2, module2) {
      "use strict";
      module2.exports = fetch;
      var asPromise = require_aspromise();
      var fs = require_fs2();
      function fetch(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        } else if (!options)
          options = {};
        if (!callback)
          return asPromise(fetch, this, filename, options);
        if (!options.xhr && fs && fs.readFile)
          return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
            return err && typeof XMLHttpRequest !== "undefined" ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
          });
        return fetch.xhr(filename, options, callback);
      }
      fetch.xhr = function fetch_xhr(filename, options, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function fetchOnReadyStateChange() {
          if (xhr.readyState !== 4)
            return void 0;
          if (xhr.status !== 0 && xhr.status !== 200)
            return callback(Error("status " + xhr.status));
          if (options.binary) {
            var buffer = xhr.response;
            if (!buffer) {
              buffer = [];
              for (var i = 0; i < xhr.responseText.length; ++i)
                buffer.push(xhr.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
          }
          return callback(null, xhr.responseText);
        };
        if (options.binary) {
          if ("overrideMimeType" in xhr)
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          xhr.responseType = "arraybuffer";
        }
        xhr.open("GET", filename);
        xhr.send();
      };
    }
  });

  // node_modules/protobufjs/src/util/path.js
  var require_path = __commonJS({
    "node_modules/protobufjs/src/util/path.js"(exports2) {
      "use strict";
      var path = exports2;
      var urlRe = /^[a-zA-Z][a-zA-Z0-9+.-]+:\/\//;
      function normalizeUrl(path2) {
        if (typeof URL === "undefined" || !urlRe.test(path2))
          return null;
        try {
          return new URL(path2).href;
        } catch (e) {
          return null;
        }
      }
      function resolveUrl(originPath, includePath) {
        if (typeof URL === "undefined" || !urlRe.test(originPath) || urlRe.test(includePath))
          return null;
        try {
          return new URL(includePath, originPath).href;
        } catch (e) {
          return null;
        }
      }
      var isAbsolute = (
        /**
         * Tests if the specified path is absolute.
         * @param {string} path Path to test
         * @returns {boolean} `true` if path is absolute
         */
        path.isAbsolute = function isAbsolute2(path2) {
          return /^(?:\/|\w+:|\\\\\w+)/.test(path2);
        }
      );
      var normalize = (
        /**
         * Normalizes the specified path.
         * @param {string} path Path to normalize
         * @returns {string} Normalized path
         */
        path.normalize = function normalize2(path2) {
          var normalizedUrl = normalizeUrl(path2);
          if (normalizedUrl)
            return normalizedUrl;
          var firstTwoCharacters = path2.substring(0, 2);
          var uncPrefix = "";
          if (firstTwoCharacters === "\\\\") {
            uncPrefix = firstTwoCharacters;
            path2 = path2.substring(2);
          }
          path2 = path2.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
          var parts = path2.split("/"), absolute = isAbsolute(path2), prefix = "";
          if (absolute)
            prefix = parts.shift() + "/";
          for (var i = 0; i < parts.length; ) {
            if (parts[i] === "..") {
              if (i > 0 && parts[i - 1] !== "..")
                parts.splice(--i, 2);
              else if (absolute)
                parts.splice(i, 1);
              else
                ++i;
            } else if (parts[i] === ".")
              parts.splice(i, 1);
            else
              ++i;
          }
          return uncPrefix + prefix + parts.join("/");
        }
      );
      path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
        var resolvedUrl = resolveUrl(originPath, includePath);
        if (resolvedUrl)
          return resolvedUrl;
        if (!alreadyNormalized)
          includePath = normalize(includePath);
        if (isAbsolute(includePath))
          return includePath;
        if (!alreadyNormalized)
          originPath = normalize(originPath);
        return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
      };
    }
  });

  // node_modules/protobufjs/src/namespace.js
  var require_namespace = __commonJS({
    "node_modules/protobufjs/src/namespace.js"(exports2, module2) {
      "use strict";
      module2.exports = Namespace;
      var ReflectionObject = require_object();
      Namespace.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Namespace,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Namespace.className = "Namespace";
      var Field = require_field();
      var util = require_util2();
      var OneOf = require_oneof();
      var Type;
      var Service;
      var Enum;
      Namespace.fromJSON = function fromJSON(name, json, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        return new Namespace(name, json.options).addJSON(json.nested, depth);
      };
      function arrayToJSON(array, toJSONOptions) {
        if (!(array && array.length))
          return void 0;
        var obj = {};
        for (var i = 0; i < array.length; ++i)
          obj[array[i].name] = array[i].toJSON(toJSONOptions);
        return obj;
      }
      Namespace.arrayToJSON = arrayToJSON;
      Namespace.isReservedId = function isReservedId(reserved, id) {
        if (reserved) {
          for (var i = 0; i < reserved.length; ++i)
            if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] >= id)
              return true;
        }
        return false;
      };
      Namespace.isReservedName = function isReservedName(reserved, name) {
        if (reserved) {
          for (var i = 0; i < reserved.length; ++i)
            if (reserved[i] === name)
              return true;
        }
        return false;
      };
      function Namespace(name, options) {
        ReflectionObject.call(this, name, options);
        this.nested = void 0;
        this._nestedArray = null;
        this._lookupCache = /* @__PURE__ */ Object.create(null);
        this._needsRecursiveFeatureResolution = true;
        this._needsRecursiveResolve = true;
      }
      function clearCache(namespace2) {
        namespace2._nestedArray = null;
        namespace2._lookupCache = /* @__PURE__ */ Object.create(null);
        var parent = namespace2;
        while (parent = parent.parent) {
          parent._lookupCache = /* @__PURE__ */ Object.create(null);
        }
        return namespace2;
      }
      Object.defineProperty(Namespace.prototype, "nestedArray", {
        get: function() {
          return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
        }
      });
      Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
        return util.toObject([
          "options",
          this.options,
          "nested",
          arrayToJSON(this.nestedArray, toJSONOptions)
        ]);
      };
      Namespace.prototype.addJSON = function addJSON(nestedJson, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        var ns = this;
        if (nestedJson) {
          for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
            nested = nestedJson[names[i]];
            ns.add(
              // most to least likely
              (nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : nested.id !== void 0 ? Field.fromJSON : Namespace.fromJSON)(names[i], nested, depth + 1)
            );
          }
        }
        return this;
      };
      Namespace.prototype.get = function get(name) {
        return this.nested && Object.prototype.hasOwnProperty.call(this.nested, name) ? this.nested[name] : null;
      };
      Namespace.prototype.getEnum = function getEnum(name) {
        if (this.nested && Object.prototype.hasOwnProperty.call(this.nested, name) && this.nested[name] instanceof Enum)
          return this.nested[name].values;
        throw Error("no such enum: " + name);
      };
      Namespace.prototype.add = function add2(object) {
        if (!(object instanceof Field && object.extend !== void 0 || object instanceof Type || object instanceof OneOf || object instanceof Enum || object instanceof Service || object instanceof Namespace))
          throw TypeError("object must be a valid nested object");
        if (object.name === "__proto__")
          return this;
        if (!this.nested)
          this.nested = {};
        else {
          var prev = this.get(object.name);
          if (prev) {
            if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
              var nested = prev.nestedArray;
              for (var i = 0; i < nested.length; ++i)
                object.add(nested[i]);
              this.remove(prev);
              if (!this.nested)
                this.nested = {};
              object.setOptions(prev.options, true);
            } else
              throw Error("duplicate name '" + object.name + "' in " + this);
          }
        }
        this.nested[object.name] = object;
        if (!(this instanceof Type || this instanceof Service || this instanceof Enum || this instanceof Field)) {
          if (!object._edition) {
            object._edition = object._defaultEdition;
          }
        }
        this._needsRecursiveFeatureResolution = true;
        this._needsRecursiveResolve = true;
        var parent = this;
        while (parent = parent.parent) {
          parent._needsRecursiveFeatureResolution = true;
          parent._needsRecursiveResolve = true;
        }
        object.onAdd(this);
        return clearCache(this);
      };
      Namespace.prototype.remove = function remove(object) {
        if (!(object instanceof ReflectionObject))
          throw TypeError("object must be a ReflectionObject");
        if (object.parent !== this)
          throw Error(object + " is not a member of " + this);
        if (!util.remove(this.nested, object, object.name))
          throw Error(object + " is not a member of " + this);
        if (!Object.keys(this.nested).length)
          this.nested = void 0;
        object.onRemove(this);
        return clearCache(this);
      };
      Namespace.prototype.define = function define2(path, json) {
        if (util.isString(path))
          path = path.split(".");
        else if (!Array.isArray(path))
          throw TypeError("illegal path");
        if (path && path.length && path[0] === "")
          throw Error("path must be relative");
        if (path.length > util.recursionLimit)
          throw Error("max depth exceeded");
        var ptr = this;
        while (path.length > 0) {
          var part = path.shift();
          if (ptr.nested && ptr.nested[part]) {
            ptr = ptr.nested[part];
            if (!(ptr instanceof Namespace))
              throw Error("path conflicts with non-namespace objects");
          } else
            ptr.add(ptr = new Namespace(part));
        }
        if (json)
          ptr.addJSON(json);
        return ptr;
      };
      Namespace.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        if (this._needsRecursiveFeatureResolution)
          this._resolveFeaturesRecursive(this._edition);
        var nested = this.nestedArray, i = 0;
        this.resolve();
        while (i < nested.length)
          if (nested[i] instanceof Namespace)
            nested[i++].resolveAll();
          else
            nested[i++].resolve();
        this._needsRecursiveResolve = false;
        return this;
      };
      Namespace.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        if (!this._needsRecursiveFeatureResolution) return this;
        this._needsRecursiveFeatureResolution = false;
        edition = this._edition || edition;
        ReflectionObject.prototype._resolveFeaturesRecursive.call(this, edition);
        this.nestedArray.forEach((nested) => {
          nested._resolveFeaturesRecursive(edition);
        });
        return this;
      };
      Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {
        if (typeof filterTypes === "boolean") {
          parentAlreadyChecked = filterTypes;
          filterTypes = void 0;
        } else if (filterTypes && !Array.isArray(filterTypes))
          filterTypes = [filterTypes];
        if (util.isString(path) && path.length) {
          if (path === ".")
            return this.root;
          path = path.split(".");
        } else if (!path.length)
          return this;
        var flatPath = path.join(".");
        if (path[0] === "")
          return this.root.lookup(path.slice(1), filterTypes);
        var found = this._lookupImpl(path, flatPath);
        if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
          return found;
        }
        found = this.root._fullyQualifiedObjects && this.root._fullyQualifiedObjects["." + flatPath];
        if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
          return found;
        }
        if (parentAlreadyChecked)
          return null;
        var current = this;
        while (current.parent) {
          found = current.parent._lookupImpl(path, flatPath);
          if (found && (!filterTypes || filterTypes.indexOf(found.constructor) > -1)) {
            return found;
          }
          current = current.parent;
        }
        return null;
      };
      Namespace.prototype._lookupImpl = function lookup(path, flatPath) {
        if (Object.prototype.hasOwnProperty.call(this._lookupCache, flatPath)) {
          return this._lookupCache[flatPath];
        }
        var found = this.get(path[0]);
        var exact = null;
        if (found) {
          if (path.length === 1) {
            exact = found;
          } else if (found instanceof Namespace) {
            path = path.slice(1);
            exact = found._lookupImpl(path, path.join("."));
          }
        } else {
          for (var i = 0; i < this.nestedArray.length; ++i)
            if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i]._lookupImpl(path, flatPath))) {
              exact = found;
              break;
            }
        }
        this._lookupCache[flatPath] = exact;
        return exact;
      };
      Namespace.prototype.lookupType = function lookupType(path) {
        var found = this.lookup(path, [Type]);
        if (!found)
          throw Error("no such type: " + path);
        return found;
      };
      Namespace.prototype.lookupEnum = function lookupEnum(path) {
        var found = this.lookup(path, [Enum]);
        if (!found)
          throw Error("no such Enum '" + path + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
        var found = this.lookup(path, [Type, Enum]);
        if (!found)
          throw Error("no such Type or Enum '" + path + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupService = function lookupService(path) {
        var found = this.lookup(path, [Service]);
        if (!found)
          throw Error("no such Service '" + path + "' in " + this);
        return found;
      };
      Namespace._configure = function(Type_, Service_, Enum_) {
        Type = Type_;
        Service = Service_;
        Enum = Enum_;
      };
    }
  });

  // node_modules/protobufjs/src/mapfield.js
  var require_mapfield = __commonJS({
    "node_modules/protobufjs/src/mapfield.js"(exports2, module2) {
      "use strict";
      module2.exports = MapField;
      var Field = require_field();
      MapField.prototype = Object.create(Field.prototype, {
        constructor: {
          value: MapField,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      MapField.className = "MapField";
      var types2 = require_types2();
      var util = require_util2();
      function MapField(name, id, keyType, type, options, comment) {
        Field.call(this, name, id, type, void 0, void 0, options, comment);
        if (!util.isString(keyType))
          throw TypeError("keyType must be a string");
        this.keyType = keyType;
        this.resolvedKeyType = null;
        this.map = true;
      }
      MapField.fromJSON = function fromJSON(name, json) {
        var field = new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
        if (json.protoName)
          field.protoName = json.protoName;
        if (json.jsonName !== void 0)
          field.jsonName = json.jsonName;
        else if (json.options && json.options.json_name !== void 0)
          field.jsonName = json.options.json_name;
        return field;
      };
      MapField.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "keyType",
          this.keyType,
          "type",
          this.type,
          "id",
          this.id,
          "extend",
          this.extend,
          "protoName",
          this.protoName !== this.name ? this.protoName : void 0,
          "jsonName",
          this.jsonName !== util.jsonName(this.protoName || this.name) ? this.jsonName : void 0,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      MapField.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (types2.mapKey[this.keyType] === void 0)
          throw Error("invalid key type: " + this.keyType);
        return Field.prototype.resolve.call(this);
      };
      MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
        if (typeof fieldValueType === "function")
          fieldValueType = util.decorateType(fieldValueType).name;
        else if (fieldValueType && typeof fieldValueType === "object")
          fieldValueType = util.decorateEnum(fieldValueType).name;
        return function mapFieldDecorator(prototype, fieldName) {
          util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
        };
      };
    }
  });

  // node_modules/protobufjs/src/method.js
  var require_method = __commonJS({
    "node_modules/protobufjs/src/method.js"(exports2, module2) {
      "use strict";
      module2.exports = Method;
      var ReflectionObject = require_object();
      Method.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Method,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Method.className = "Method";
      var util = require_util2();
      function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {
        if (util.isObject(requestStream)) {
          options = requestStream;
          requestStream = responseStream = void 0;
        } else if (util.isObject(responseStream)) {
          options = responseStream;
          responseStream = void 0;
        }
        if (!(type === void 0 || util.isString(type)))
          throw TypeError("type must be a string");
        if (!util.isString(requestType))
          throw TypeError("requestType must be a string");
        if (!util.isString(responseType))
          throw TypeError("responseType must be a string");
        ReflectionObject.call(this, name, options);
        this.type = type || "rpc";
        this.requestType = requestType;
        this.requestStream = requestStream ? true : void 0;
        this.responseType = responseType;
        this.responseStream = responseStream ? true : void 0;
        this.path = "/" + this.name;
        this.resolvedRequestType = null;
        this.resolvedResponseType = null;
        this.comment = comment;
        this.parsedOptions = parsedOptions;
      }
      Method.fromJSON = function fromJSON(name, json) {
        return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
      };
      Method.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "type",
          this.type !== "rpc" && /* istanbul ignore next */
          this.type || void 0,
          "requestType",
          this.requestType,
          "requestStream",
          this.requestStream,
          "responseType",
          this.responseType,
          "responseStream",
          this.responseStream,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0,
          "parsedOptions",
          this.parsedOptions
        ]);
      };
      Method.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (this.parent) {
          var serviceName = this.parent.fullName;
          if (serviceName.charAt(0) === ".")
            serviceName = serviceName.substring(1);
          this.path = "/" + serviceName + "/" + this.name;
        } else
          this.path = "/" + this.name;
        this.resolvedRequestType = this.parent.lookupType(this.requestType);
        this.resolvedResponseType = this.parent.lookupType(this.responseType);
        return ReflectionObject.prototype.resolve.call(this);
      };
    }
  });

  // node_modules/protobufjs/src/service.js
  var require_service2 = __commonJS({
    "node_modules/protobufjs/src/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var Namespace = require_namespace();
      Service.prototype = Object.create(Namespace.prototype, {
        constructor: {
          value: Service,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Service.className = "Service";
      var Method = require_method();
      var util = require_util2();
      var rpc = require_rpc();
      function Service(name, options) {
        Namespace.call(this, name, options);
        this.methods = {};
        this._methodsArray = null;
      }
      Service.fromJSON = function fromJSON(name, json, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        var service = new Service(name, json.options);
        if (json.methods)
          for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
            service.add(Method.fromJSON(names[i], json.methods[names[i]]));
        if (json.nested)
          service.addJSON(json.nested, depth);
        if (json.edition)
          service._edition = json.edition;
        service.comment = json.comment;
        service._defaultEdition = "proto3";
        return service;
      };
      Service.prototype.toJSON = function toJSON(toJSONOptions) {
        var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "options",
          inherited && inherited.options || void 0,
          "methods",
          Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
          {},
          "nested",
          inherited && inherited.nested || void 0,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Object.defineProperty(Service.prototype, "methodsArray", {
        get: function() {
          return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
        }
      });
      function clearCache(service) {
        service._methodsArray = null;
        return service;
      }
      Service.prototype.get = function get(name) {
        return Object.prototype.hasOwnProperty.call(this.methods, name) ? this.methods[name] : Namespace.prototype.get.call(this, name);
      };
      Service.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        Namespace.prototype.resolve.call(this);
        var methods = this.methodsArray;
        for (var i = 0; i < methods.length; ++i)
          methods[i].resolve();
        return this;
      };
      Service.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        if (!this._needsRecursiveFeatureResolution) return this;
        edition = this._edition || edition;
        Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
        this.methodsArray.forEach((method) => {
          method._resolveFeaturesRecursive(edition);
        });
        return this;
      };
      Service.prototype.add = function add2(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Method) {
          if (object.name === "__proto__")
            return this;
          this.methods[object.name] = object;
          object.parent = this;
          return clearCache(this);
        }
        return Namespace.prototype.add.call(this, object);
      };
      Service.prototype.remove = function remove(object) {
        if (object instanceof Method) {
          if (this.methods[object.name] !== object)
            throw Error(object + " is not a member of " + this);
          delete this.methods[object.name];
          object.parent = null;
          return clearCache(this);
        }
        return Namespace.prototype.remove.call(this, object);
      };
      Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
        for (var i = 0, method; i < /* initializes */
        this.methodsArray.length; ++i) {
          var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
          rpcService[methodName] = /* @__PURE__ */ (function(method2, requestType, responseType) {
            return function rpcMethod(request, callback) {
              return rpc.Service.prototype.rpcCall.call(this, method2, requestType, responseType, request, callback);
            };
          })(method, method.resolvedRequestType.ctor, method.resolvedResponseType.ctor);
        }
        return rpcService;
      };
    }
  });

  // node_modules/protobufjs/src/message.js
  var require_message = __commonJS({
    "node_modules/protobufjs/src/message.js"(exports2, module2) {
      "use strict";
      module2.exports = Message;
      var util = require_minimal();
      function Message(properties) {
        if (properties) {
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null && keys[i] !== "__proto__")
              this[keys[i]] = properties[keys[i]];
        }
      }
      Message.create = function create(properties) {
        return this.$type.create(properties);
      };
      Message.encode = function encode2(message, writer) {
        return this.$type.encode(message, writer);
      };
      Message.encodeDelimited = function encodeDelimited(message, writer) {
        return this.$type.encodeDelimited(message, writer);
      };
      Message.decode = function decode2(reader) {
        return this.$type.decode(reader);
      };
      Message.decodeDelimited = function decodeDelimited(reader) {
        return this.$type.decodeDelimited(reader);
      };
      Message.verify = function verify(message) {
        return this.$type.verify(message);
      };
      Message.fromObject = function fromObject(object) {
        return this.$type.fromObject(object);
      };
      Message.toObject = function toObject(message, options) {
        return this.$type.toObject(message, options);
      };
      Message.prototype.toJSON = function toJSON() {
        return this.$type.toObject(this, util.toJSONOptions);
      };
    }
  });

  // node_modules/protobufjs/src/decoder.js
  var require_decoder = __commonJS({
    "node_modules/protobufjs/src/decoder.js"(exports2, module2) {
      "use strict";
      module2.exports = decoder;
      var Enum = require_enum();
      var types2 = require_types2();
      var util = require_util2();
      function missing(field) {
        return "missing required '" + field.name + "'";
      }
      function stringMethod(field) {
        return field._features.utf8_validation === "VERIFY" ? "stringVerify" : "string";
      }
      function genPreserveUnknown(gen, ref) {
        return gen("if(!r.discardUnknown){")('util.makeProp(m,"$unknowns",false);')("(m.$unknowns||(m.$unknowns=[])).push(%s)", ref)("}");
      }
      function decoder(mtype) {
        var hasMapField = false, needsValueVar = false, i = 0;
        for (; i < mtype.fieldsArray.length; ++i) {
          var pfield = mtype._fieldsArray[i];
          if (pfield.map)
            hasMapField = true;
          if (pfield.resolvedType instanceof Enum || !pfield.repeated && !pfield.map && !pfield.hasPresence)
            needsValueVar = true;
        }
        var gen = util.codegen(["r", "l", "z", "q", "g"])("if(!(r instanceof Reader))")("r=Reader.create(r)")("if(q===undefined)q=0")("if(q>Reader.recursionLimit)")('throw Error("max depth exceeded")')("var c,m" + (hasMapField ? ",k,v" : needsValueVar ? ",v" : ""))("if(l===undefined)")("c=r.len")("else{")("c=r.pos+l")("if(c>r.len)")('throw RangeError("index out of range")')("l=r.len")("r.len=c")("}")("m=g||new C")("while(r.pos<c){")("var s=r.pos")("var t=r.tag()")("if(t===z){")("z=undefined")("break")("}");
        if (mtype.fieldsArray.length) gen("var u=t&7")("switch(t>>>=3){");
        for (i = 0; i < /* initializes */
        mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum ? "int32" : field.type, ref = "m" + util.safeProp(field.name), closed = field.resolvedType instanceof Enum && field.resolvedType._features.enum_type === "CLOSED";
          if (field.map) {
            gen("case %i:{", field.id)("if(u!==2)")("break");
            if (!closed) gen("if(%s===util.emptyObject)", ref)("%s={}", ref);
            gen("var c2=r.uint32()+r.pos")("if(c2>r.len)")('throw RangeError("index out of range")')("r.len=c2");
            if (types2.defaults[field.keyType] !== void 0) gen("k=%j", types2.defaults[field.keyType]);
            else gen("k=null");
            if (types2.long[type] !== void 0) gen("v=util.Long?util.Long.fromNumber(0,%j):0", type === "uint64" || type === "fixed64");
            else if (types2.defaults[type] !== void 0) gen("v=%j", types2.defaults[type]);
            else gen("v=null");
            gen("while(r.pos<c2){")("var t2=r.tag()")("u=t2&7")("switch(t2>>>=3){")("case 1:")("if(u!==%i)", types2.mapKey[field.keyType])("break")("k=r.%s()", field.keyType === "string" ? stringMethod(field) : field.keyType)("continue")("case 2:")("if(u!==%i)", types2.basic[type] === void 0 ? 2 : types2.basic[type])("break");
            if (types2.basic[type] === void 0) gen("v=types[%i].decode(r,r.uint32(),undefined,q+1,v)", i);
            else gen("v=r.%s()", type === "string" ? stringMethod(field) : type);
            gen("continue")("}")("r.skipType(u,q,t2)")("}");
            gen("if(r.pos!==c2)")('throw RangeError("index out of range")')("r.len=c");
            if (closed) {
              gen("if(types[%i].valuesById[v]===undefined){", i);
              genPreserveUnknown(gen, "r.raw(s,r.pos)")("continue")("}")("if(%s===util.emptyObject)", ref)("%s={}", ref);
            }
            var val = types2.basic[type] === void 0 ? "v||new types[" + i + "].ctor" : "v";
            if (types2.long[field.keyType] !== void 0) gen('%s[typeof k==="object"?util.longToHash(k):k]=%s', ref, val);
            else {
              if (field.keyType === "string") gen('if(k==="__proto__")')("util.makeProp(%s,k)", ref);
              gen("%s[k]=%s", ref, val);
            }
          } else if (field.repeated) {
            gen("case %i:", field.id)("{");
            if (types2.packed[type] !== void 0) {
              gen("if(u===2){");
              if (closed) {
                gen("var c2=r.uint32()+r.pos")("if(c2>r.len)")('throw RangeError("index out of range")')("r.len=c2")("while(r.pos<c2){")("s=r.pos")("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref)("%s.push(v)", ref)("}else");
                genPreserveUnknown(gen, "util.rawField(" + field.id + ",0,r.raw(s,r.pos))")("}");
                gen("if(r.pos!==c2)")('throw RangeError("index out of range")')("r.len=c");
              } else gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref)("r.%ss(%s)", type, ref);
              gen("continue")("}");
            }
            gen("if(u!==%i)", types2.basic[type] === void 0 ? field.delimited ? 3 : 2 : types2.basic[type])("break");
            if (!closed) gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
            if (types2.basic[type] === void 0) {
              if (field.delimited) gen("%s.push(types[%i].decode(r,undefined,%i,q+1))", ref, i, field.id * 8 + 4);
              else gen("%s.push(types[%i].decode(r,r.uint32(),undefined,q+1))", ref, i);
            } else if (closed) {
              gen("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref)("%s.push(v)", ref)("}else");
              genPreserveUnknown(gen, "r.raw(s,r.pos)");
            } else gen("%s.push(r.%s())", ref, type === "string" ? stringMethod(field) : type);
          } else if (types2.basic[type] === void 0) {
            gen("case %i:{", field.id)("if(u!==%i)", field.delimited ? 3 : 2)("break");
            if (field.delimited) gen("%s=types[%i].decode(r,undefined,%i,q+1,%s)", ref, i, field.id * 8 + 4, ref);
            else gen("%s=types[%i].decode(r,r.uint32(),undefined,q+1,%s)", ref, i, ref);
          } else if (field.hasPresence) {
            gen("case %i:{", field.id)("if(u!==%i)", types2.basic[type])("break");
            if (closed) {
              gen("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("%s=v", ref);
              if (field.partOf) gen("m%s=%j", util.safeProp(field.partOf.name), field.name);
              gen("}else");
              genPreserveUnknown(gen, "r.raw(s,r.pos)");
            } else gen("%s=r.%s()", ref, type === "string" ? stringMethod(field) : type);
          } else {
            gen("case %i:{", field.id)("if(u!==%i)", types2.basic[type])("break");
            if (closed) {
              gen("v=r.%s()", type)("if(types[%i].valuesById[v]!==undefined){", i)("if(v!==%j)", field.typeDefault)("%s=v", ref)("else")("delete %s", ref)("}else{");
              genPreserveUnknown(gen, "r.raw(s,r.pos)")("}");
            } else {
              if (field.resolvedType instanceof Enum && field.typeDefault !== 0) gen("if((v=r.%s())!==%j)", type, field.typeDefault);
              else if (type === "string") gen("if((v=r.%s()).length)", stringMethod(field));
              else if (type === "bytes") gen("if((v=r.%s()).length)", type);
              else if (types2.long[type] !== void 0) gen('if(typeof(v=r.%s())==="object"?v.low||v.high:v!==0)', type);
              else if (type === "double" || type === "float") gen("if(!Object.is(v=r.%s(),0))", type);
              else gen("if(v=r.%s())", type);
              gen("%s=v", ref)("else")("delete %s", ref);
            }
          }
          if (field.partOf && !closed) gen("m%s=%j", util.safeProp(field.partOf.name), field.name);
          gen("continue")("}");
        }
        if (i) gen("}");
        gen("r.skipType(%s,q,t)", i ? "u" : "t&7");
        genPreserveUnknown(gen, "r.raw(s,r.pos)")("}")("if(l!==undefined){")("if(r.pos!==c)")('throw RangeError("index out of range")')("r.len=l")("}")("if(z!==undefined)")('throw Error("missing end group")');
        for (i = 0; i < mtype._fieldsArray.length; ++i) {
          var rfield = mtype._fieldsArray[i];
          if (rfield.required) gen("if(!Object.hasOwnProperty.call(m,%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
        }
        return gen("return m");
      }
    }
  });

  // node_modules/protobufjs/src/verifier.js
  var require_verifier = __commonJS({
    "node_modules/protobufjs/src/verifier.js"(exports2, module2) {
      "use strict";
      module2.exports = verifier;
      var Enum = require_enum();
      var util = require_util2();
      function invalid(field, expected) {
        return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:" + field.keyType + "}" : "") + " expected";
      }
      function genVerifyValue(gen, field, fieldIndex, ref) {
        var resolvedType = field.resolvedType;
        if (resolvedType) {
          if (resolvedType instanceof Enum) {
            if (resolvedType._features.enum_type === "CLOSED") {
              gen("switch(%s){", ref)("default:")("return%j", invalid(field, "enum value"));
              for (var keys = Object.keys(resolvedType.values), j = 0; j < keys.length; ++j) gen("case %i:", resolvedType.values[keys[j]]);
              gen("break")("}");
            } else gen('if(typeof %s!=="number"||(%s|0)!==%s)', ref, ref, ref)("return%j", invalid(field, "enum value"));
          } else {
            gen("{")("var e=types[%i].verify(%s,q+1);", fieldIndex, ref)("if(e)")("return%j+e", field.name + ".")("}");
          }
        } else {
          switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
              gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field, "integer"));
              break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field, "integer|Long"));
              break;
            case "float":
            case "double":
              gen('if(typeof %s!=="number")', ref)("return%j", invalid(field, "number"));
              break;
            case "bool":
              gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field, "boolean"));
              break;
            case "string":
              gen("if(!util.isString(%s))", ref)("return%j", invalid(field, "string"));
              break;
            case "bytes":
              gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field, "buffer"));
              break;
          }
        }
        return gen;
      }
      function genVerifyKey(gen, field, ref) {
        switch (field.keyType) {
          case "int32":
          case "uint32":
          case "sint32":
          case "fixed32":
          case "sfixed32":
            gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field, "integer key"));
            break;
          case "int64":
          case "uint64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field, "integer|Long key"));
            break;
          case "bool":
            gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field, "boolean key"));
            break;
        }
        return gen;
      }
      function verifier(mtype) {
        var gen = util.codegen(["m", "q"])('if(typeof m!=="object"||m===null)')("return%j", "object expected")("if(q===undefined)q=0")("if(q>util.recursionLimit)")("return%j", "max depth exceeded");
        var oneofs = mtype.oneofsArray, seenFirstField = {};
        if (oneofs.length) gen("var p={}");
        for (var i = 0; i < /* initializes */
        mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), ref = "m" + util.safeProp(field.name);
          if (field.optional) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name);
          if (field.map) {
            gen("if(!util.isObject(%s))", ref)("return%j", invalid(field, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
            genVerifyKey(gen, field, "k[i]");
            genVerifyValue(gen, field, i, ref + "[k[i]]")("}");
          } else if (field.repeated) {
            gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field, "array"))("for(var i=0;i<%s.length;++i){", ref);
            genVerifyValue(gen, field, i, ref + "[i]")("}");
          } else {
            if (field.partOf) {
              var oneofProp = util.safeProp(field.partOf.name);
              if (seenFirstField[field.partOf.name] === 1) gen("if(p%s===1)", oneofProp)("return%j", field.partOf.name + ": multiple values");
              seenFirstField[field.partOf.name] = 1;
              gen("p%s=1", oneofProp);
            }
            genVerifyValue(gen, field, i, ref);
          }
          if (field.optional) gen("}");
        }
        return gen("return null");
      }
    }
  });

  // node_modules/protobufjs/src/converter.js
  var require_converter = __commonJS({
    "node_modules/protobufjs/src/converter.js"(exports2) {
      "use strict";
      var converter = exports2;
      var Enum = require_enum();
      var types2 = require_types2();
      var util = require_util2();
      function genValuePartial_fromObject(gen, field, fieldIndex, prop, dstProp) {
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) {
            var dst = dstProp ? "m" + dstProp + "[m" + dstProp + ".length]" : "m" + prop;
            gen("switch(d%s){", prop);
            for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
              gen("case%j:", keys[i])("case %i:", values[keys[i]])("%s=%j", dst, values[keys[i]])("break");
            }
            gen("default:");
            if (field.resolvedType._features.enum_type !== "CLOSED") {
              gen('if(typeof d%s==="number"&&(d%s|0)===d%s)', prop, prop, prop)("%s=d%s", dst, prop);
            }
            gen("}");
          } else gen("if(!util.isObject(d%s))", prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s=types[%i].fromObject(d%s,q+1)", prop, fieldIndex, prop);
        } else {
          var isUnsigned = false;
          switch (field.type) {
            case "double":
            case "float":
              gen("m%s=Number(d%s)", prop, prop);
              break;
            case "uint32":
            case "fixed32":
              gen("m%s=d%s>>>0", prop, prop);
              break;
            case "int32":
            case "sint32":
            case "sfixed32":
              gen("m%s=d%s|0", prop, prop);
              break;
            case "uint64":
            case "fixed64":
              isUnsigned = true;
            // eslint-disable-next-line no-fallthrough
            case "int64":
            case "sint64":
            case "sfixed64":
              gen("if(util.Long)")("m%s=util.Long.fromValue(d%s,%j)", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
              break;
            case "bytes":
              gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length>=0)", prop)("m%s=d%s", prop, prop);
              break;
            case "string":
              gen("m%s=String(d%s)", prop, prop);
              break;
            case "bool":
              gen("m%s=Boolean(d%s)", prop, prop);
              break;
          }
        }
        return gen;
      }
      converter.fromObject = function fromObject(mtype) {
        var fields = mtype.fieldsArray;
        var gen = util.codegen(["d", "q"])("if(d instanceof C)")("return d")("if(!util.isObject(d))")("throw TypeError(%j)", mtype.fullName + ": object expected")("if(q===undefined)q=0")("if(q>util.recursionLimit)")('throw Error("max depth exceeded")');
        if (!fields.length) return gen("return new C");
        gen("var m=new C");
        for (var i = 0; i < fields.length; ++i) {
          var field = fields[i].resolve(), prop = util.safeProp(field.name), implicitPresence = !field.hasPresence && !field.repeated && !field.map && (field.resolvedType instanceof Enum || types2.basic[field.type] !== void 0);
          if (field.map) {
            gen("if(d%s){", prop)("if(!util.isObject(d%s))", prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
            gen('if(ks[i]==="__proto__")')("util.makeProp(m%s,ks[i])", prop);
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop + "[ks[i]]"
            )("}")("}");
          } else if (field.repeated) {
            gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected");
            if (field.resolvedType instanceof Enum) gen("m%s=[]", prop);
            else gen("m%s=Array(d%s.length)", prop, prop);
            gen("for(var i=0;i<d%s.length;++i){", prop);
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop + "[i]",
              field.resolvedType instanceof Enum ? prop : void 0
            )("}")("}");
          } else {
            if (!(field.resolvedType instanceof Enum)) gen("if(d%s!=null){", prop);
            if (implicitPresence) {
              if (field.resolvedType instanceof Enum) gen('if(d%s!==%j&&(typeof d%s!=="string"||types[%i].values[d%s]!==%j)){', prop, field.typeDefault, prop, i, prop, field.typeDefault);
              else if (field.type === "string") gen('if(typeof d%s!=="string"||d%s.length){', prop, prop);
              else if (field.type === "bytes") gen("if(d%s.length){", prop);
              else if (field.type === "bool") gen("if(d%s){", prop);
              else if (field.type === "double" || field.type === "float") gen("if(!Object.is(Number(d%s),0)){", prop);
              else if (types2.long[field.type] !== void 0) gen('if(typeof d%s==="object"?d%s.low||d%s.high:Number(d%s)!==0){', prop, prop, prop, prop);
              else gen("if(Number(d%s)!==0){", prop);
            }
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop
            );
            if (implicitPresence) gen("}");
            if (!(field.resolvedType instanceof Enum)) gen("}");
          }
        }
        return gen("return m");
      };
      function genValuePartial_toObject(gen, field, fieldIndex, dstProp, srcProp) {
        if (!srcProp)
          srcProp = dstProp;
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", dstProp, fieldIndex, srcProp, srcProp, fieldIndex, srcProp, srcProp);
          else gen("d%s=types[%i].toObject(m%s,o,q+1)", dstProp, fieldIndex, srcProp);
        } else {
          var isUnsigned = false;
          switch (field.type) {
            case "double":
            case "float":
              gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", dstProp, srcProp, srcProp, srcProp);
              break;
            case "uint64":
            case "fixed64":
              isUnsigned = true;
            // eslint-disable-next-line no-fallthrough
            case "int64":
            case "sint64":
            case "sfixed64":
              gen('if(typeof BigInt!=="undefined"&&o.longs===BigInt)')('d%s=typeof m%s==="number"?BigInt(m%s):util.Long.fromBits(m%s.low>>>0,m%s.high>>>0,%j).toBigInt()', dstProp, srcProp, srcProp, srcProp, srcProp, isUnsigned)('else if(typeof m%s==="number")', srcProp)("d%s=o.longs===String?String(m%s):m%s", dstProp, srcProp, srcProp)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", dstProp, srcProp, srcProp, srcProp, isUnsigned ? "true" : "", srcProp);
              break;
            case "bytes":
              gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", dstProp, srcProp, srcProp, srcProp, srcProp);
              break;
            default:
              gen("d%s=m%s", dstProp, srcProp);
              break;
          }
        }
        return gen;
      }
      converter.toObject = function toObject(mtype) {
        var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
        if (!fields.length)
          return util.codegen()("return {}");
        var gen = util.codegen(["m", "o", "q"])("if(!o)")("o={}")("if(q===undefined)q=0")("if(q>util.recursionLimit)")('throw Error("max depth exceeded")')("var d={}");
        var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
        for (; i < fields.length; ++i)
          if (!fields[i].partOf)
            (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
        if (repeatedFields.length) {
          gen("if(o.arrays||o.defaults){");
          for (i = 0; i < repeatedFields.length; ++i) gen("d%s=[]", util.safeProp(repeatedFields[i].name));
          gen("}");
        }
        if (mapFields.length) {
          gen("if(o.objects||o.defaults){");
          for (i = 0; i < mapFields.length; ++i) gen("d%s={}", util.safeProp(mapFields[i].name));
          gen("}");
        }
        if (normalFields.length) {
          gen("if(o.defaults){");
          for (i = 0; i < normalFields.length; ++i) {
            var field = normalFields[i], prop = util.safeProp(field.name);
            if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
            else if (field.long) gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)('d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():typeof BigInt!=="undefined"&&o.longs===BigInt?n.toBigInt():n', prop)("}else")('d%s=o.longs===String?%j:typeof BigInt!=="undefined"&&o.longs===BigInt?BigInt(%j):%i', prop, field.typeDefault.toString(), field.typeDefault.toString(), field.typeDefault.toNumber());
            else if (field.bytes) {
              var arrayDefault = Array.prototype.slice.call(field.typeDefault);
              gen("if(o.bytes===String)d%s=%j", prop, util.base64.encode(field.typeDefault, 0, field.typeDefault.length))("else{")("d%s=%j", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
            } else if ((field.type === "double" || field.type === "float") && typeof field.typeDefault === "number" && (!isFinite(field.typeDefault) || Object.is(field.typeDefault, -0))) gen("d%s=%f", prop, field.typeDefault)("if(o.json&&!isFinite(d%s))d%s=String(d%s)", prop, prop, prop);
            else gen("d%s=%j", prop, field.typeDefault);
          }
          gen("}");
        }
        var hasKs2 = false;
        for (i = 0; i < fields.length; ++i) {
          var field = fields[i], index = mtype._fieldsArray.indexOf(field), prop = util.safeProp(field.name);
          if (field.map) {
            if (!hasKs2) {
              hasKs2 = true;
              gen("var ks2");
            }
            gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop);
            var longKey = types2.long[field.keyType] !== void 0, srcProp = prop + "[ks2[j]]";
            gen("for(var j=0;j<ks2.length;++j){");
            if (longKey) gen("var k2=util.longFromKey(ks2[j],%j).toString()", field.keyType === "uint64" || field.keyType === "fixed64");
            gen('if(ks2[j]==="__proto__")')("util.makeProp(d%s,ks2[j])", prop);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              longKey ? prop + "[k2]" : srcProp,
              srcProp
            )("}");
          } else if (field.repeated) {
            gen("if(m%s&&m%s.length){", prop, prop)("d%s=Array(m%s.length)", prop, prop)("for(var j=0;j<m%s.length;++j){", prop);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop + "[j]"
            )("}");
          } else {
            gen("if(m%s!=null&&Object.hasOwnProperty.call(m,%j)){", prop, field.name);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop
            );
            if (field.partOf && !field.partOf.isProto3Optional) gen("if(o.oneofs)")("d%s=%j", util.safeProp(field.partOf.name), field.name);
          }
          gen("}");
        }
        return gen("return d");
      };
    }
  });

  // node_modules/protobufjs/src/wrappers.js
  var require_wrappers = __commonJS({
    "node_modules/protobufjs/src/wrappers.js"(exports2) {
      "use strict";
      var wrappers = exports2;
      var Message = require_message();
      var util = require_minimal();
      wrappers[".google.protobuf.Any"] = {
        fromObject: function(object, depth) {
          if (depth === void 0)
            depth = 0;
          if (depth > util.recursionLimit)
            throw Error("max depth exceeded");
          if (object && object["@type"]) {
            var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
            var type = this.lookup(name, [this.constructor]);
            if (type) {
              var type_url = object["@type"].charAt(0) === "." ? object["@type"].slice(1) : object["@type"];
              if (type_url.indexOf("/") === -1) {
                type_url = "/" + type_url;
              }
              return this.create({
                type_url,
                value: type.encode(type.fromObject(object, depth + 1)).finish()
              });
            }
          }
          return this.fromObject(object, depth);
        },
        toObject: function(message, options, depth) {
          if (depth === void 0)
            depth = 0;
          if (depth > util.recursionLimit)
            throw Error("max depth exceeded");
          var googleApi = "type.googleapis.com/";
          var prefix = "";
          var name = "";
          if (options && options.json && message.type_url && message.value) {
            name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
            prefix = message.type_url.substring(0, message.type_url.lastIndexOf("/") + 1);
            var type = this.lookup(name, [this.constructor]);
            if (type)
              message = type.decode(message.value, void 0, void 0, depth + 1);
          }
          if (!(message instanceof this.ctor) && message instanceof Message) {
            var object = message.$type.toObject(message, options, depth + 1);
            var messageName = message.$type.fullName[0] === "." ? message.$type.fullName.slice(1) : message.$type.fullName;
            if (prefix === "") {
              prefix = googleApi;
            }
            name = prefix + messageName;
            object["@type"] = name;
            return object;
          }
          return this.toObject(message, options, depth);
        }
      };
    }
  });

  // node_modules/protobufjs/src/type.js
  var require_type2 = __commonJS({
    "node_modules/protobufjs/src/type.js"(exports2, module2) {
      "use strict";
      module2.exports = Type;
      var Namespace = require_namespace();
      Type.prototype = Object.create(Namespace.prototype, {
        constructor: {
          value: Type,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Type.className = "Type";
      var Enum = require_enum();
      var OneOf = require_oneof();
      var Field = require_field();
      var MapField = require_mapfield();
      var Service = require_service2();
      var Message = require_message();
      var Reader = require_reader();
      var Writer = require_writer();
      var util = require_util2();
      var encoder = require_encoder();
      var decoder = require_decoder();
      var verifier = require_verifier();
      var converter = require_converter();
      var wrappers = require_wrappers();
      function Type(name, options) {
        name = name.replace(/\W/g, "");
        Namespace.call(this, name, options);
        this.fields = {};
        this.oneofs = void 0;
        this.extensions = void 0;
        this.reserved = void 0;
        this.group = void 0;
        this.visibility = void 0;
        this._fieldsById = null;
        this._fieldsArray = null;
        this._oneofsArray = null;
        this._ctor = null;
        this._fieldsByJsonName = null;
      }
      Object.defineProperties(Type.prototype, {
        /**
         * Message fields by id.
         * @name Type#fieldsById
         * @type {Object.<number,Field>}
         * @readonly
         */
        fieldsById: {
          get: function() {
            if (this._fieldsById)
              return this._fieldsById;
            this._fieldsById = {};
            for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
              var field = this.fields[names[i]], id = field.id;
              if (this._fieldsById[id])
                throw Error("duplicate id " + id + " in " + this);
              this._fieldsById[id] = field;
            }
            return this._fieldsById;
          }
        },
        /**
         * Fields of this message as an array for iteration.
         * @name Type#fieldsArray
         * @type {Field[]}
         * @readonly
         */
        fieldsArray: {
          get: function() {
            return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
          }
        },
        /**
         * Oneofs of this message as an array for iteration.
         * @name Type#oneofsArray
         * @type {OneOf[]}
         * @readonly
         */
        oneofsArray: {
          get: function() {
            return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
          }
        },
        /**
         * The registered constructor, if any registered, otherwise a generic constructor.
         * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
         * When assigning manually, add the type to its parent namespace/root first if fields reference other reflected types, because constructor setup resolves field defaults.
         * @name Type#ctor
         * @type {Constructor<{}>}
         */
        ctor: {
          get: function() {
            return this._ctor || (this.ctor = Type.generateConstructor(this)());
          },
          set: function(ctor) {
            var prototype = ctor.prototype;
            if (!(prototype instanceof Message)) {
              ctor.prototype = new Message();
              Object.defineProperty(ctor.prototype, "constructor", {
                value: ctor,
                writable: true,
                enumerable: false,
                configurable: true
              });
              util.merge(ctor.prototype, prototype);
            }
            ctor.$type = ctor.prototype.$type = this;
            util.merge(ctor, Message, true);
            this._ctor = ctor;
            delete this.decode;
            delete this.fromObject;
            var i = 0;
            for (var field; i < /* initializes */
            this.fieldsArray.length; ++i) {
              field = this._fieldsArray[i].resolve();
              ctor.prototype[field.name] = field.defaultValue;
            }
            var ctorProperties = {};
            for (i = 0; i < /* initializes */
            this.oneofsArray.length; ++i)
              ctorProperties[this._oneofsArray[i].resolve().name] = {
                get: util.oneOfGetter(this._oneofsArray[i].oneof),
                set: util.oneOfSetter(this._oneofsArray[i].oneof)
              };
            if (i)
              Object.defineProperties(ctor.prototype, ctorProperties);
          }
        }
      });
      Type.generateConstructor = function generateConstructor(mtype) {
        var gen = util.codegen(["p"]);
        for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
          if ((field = mtype._fieldsArray[i]).map) gen("this%s={}", util.safeProp(field.name));
          else if (field.repeated) gen("this%s=[]", util.safeProp(field.name));
        return gen('if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null&&ks[i]!=="__proto__")')("this[ks[i]]=p[ks[i]]");
      };
      function clearCache(type) {
        type._fieldsById = type._fieldsArray = type._oneofsArray = type._fieldsByJsonName = null;
        delete type.encode;
        delete type.decode;
        delete type.verify;
        return type;
      }
      Type.fromJSON = function fromJSON(name, json, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.nestingLimit)
          throw Error("max depth exceeded");
        var type = new Type(name, json.options);
        type.extensions = json.extensions;
        type.reserved = json.reserved;
        var names = Object.keys(json.fields), i = 0;
        for (; i < names.length; ++i)
          type.add(
            (typeof json.fields[names[i]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]])
          );
        if (json.oneofs)
          for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
            type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
        if (json.nested)
          for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
            var nested = json.nested[names[i]];
            type.add(
              // most to least likely
              (nested.id !== void 0 ? Field.fromJSON : nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : Namespace.fromJSON)(names[i], nested, depth + 1)
            );
          }
        if (json.extensions && json.extensions.length)
          type.extensions = json.extensions;
        if (json.reserved && json.reserved.length)
          type.reserved = json.reserved;
        if (json.group)
          type.group = true;
        if (json.visibility)
          type.visibility = json.visibility;
        if (json.comment)
          type.comment = json.comment;
        if (json.edition)
          type._edition = json.edition;
        type._defaultEdition = "proto3";
        return type;
      };
      Type.prototype.toJSON = function toJSON(toJSONOptions) {
        var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "options",
          inherited && inherited.options || void 0,
          "oneofs",
          Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
          "fields",
          Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
            return !obj.declaringField;
          }), toJSONOptions) || {},
          "extensions",
          this.extensions && this.extensions.length ? this.extensions : void 0,
          "reserved",
          this.reserved && this.reserved.length ? this.reserved : void 0,
          "group",
          this.group || void 0,
          "visibility",
          this.visibility,
          "nested",
          inherited && inherited.nested || void 0,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Type.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        Namespace.prototype.resolveAll.call(this);
        var oneofs = this.oneofsArray;
        i = 0;
        while (i < oneofs.length)
          oneofs[i++].resolve();
        var fields = this.fieldsArray, i = 0;
        while (i < fields.length)
          fields[i++].resolve();
        return this;
      };
      Type.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        if (!this._needsRecursiveFeatureResolution) return this;
        edition = this._edition || edition;
        Namespace.prototype._resolveFeaturesRecursive.call(this, edition);
        this.oneofsArray.forEach((oneof) => {
          oneof._resolveFeatures(edition);
        });
        this.fieldsArray.forEach((field) => {
          field._resolveFeatures(edition);
        });
        return this;
      };
      Type.prototype.get = function get(name) {
        if (Object.prototype.hasOwnProperty.call(this.fields, name))
          return this.fields[name];
        if (this.oneofs && Object.prototype.hasOwnProperty.call(this.oneofs, name))
          return this.oneofs[name];
        if (this.nested && Object.prototype.hasOwnProperty.call(this.nested, name))
          return this.nested[name];
        return null;
      };
      Type.prototype.add = function add2(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Field && object.extend === void 0) {
          if (this._fieldsById ? (
            /* istanbul ignore next */
            this._fieldsById[object.id]
          ) : this.fieldsById[object.id])
            throw Error("duplicate id " + object.id + " in " + this);
          if (this.isReservedId(object.id))
            throw Error("id " + object.id + " is reserved in " + this);
          if (this.isReservedName(object.name) || object.name.charAt(0) === "$")
            throw Error("name '" + object.name + "' is reserved in " + this);
          if (object.name === "__proto__")
            return this;
          if (object.parent)
            object.parent.remove(object);
          this.fields[object.name] = object;
          object.message = this;
          object.onAdd(this);
          return clearCache(this);
        }
        if (object instanceof OneOf) {
          if (object.name.charAt(0) === "$")
            throw Error("name '" + object.name + "' is reserved in " + this);
          if (object.name === "__proto__")
            return this;
          if (!this.oneofs)
            this.oneofs = {};
          this.oneofs[object.name] = object;
          object.onAdd(this);
          return clearCache(this);
        }
        return Namespace.prototype.add.call(this, object);
      };
      Type.prototype.remove = function remove(object) {
        if (object instanceof Field && object.extend === void 0) {
          if (!util.remove(this.fields, object, object.name))
            throw Error(object + " is not a member of " + this);
          object.parent = null;
          object.onRemove(this);
          return clearCache(this);
        }
        if (object instanceof OneOf) {
          if (!util.remove(this.oneofs, object, object.name))
            throw Error(object + " is not a member of " + this);
          object.parent = null;
          object.onRemove(this);
          return clearCache(this);
        }
        return Namespace.prototype.remove.call(this, object);
      };
      Type.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Type.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
      Type.prototype.create = function create(properties) {
        return new this.ctor(properties);
      };
      Type.prototype.setup = function setup() {
        var root3 = this.root;
        if (root3 && root3._needsRecursiveFeatureResolution) {
          var edition = root3._edition || this._edition;
          if (edition)
            root3._resolveFeaturesRecursive(edition);
        }
        var fullName = this.fullName, types2 = [];
        for (var i = 0; i < /* initializes */
        this.fieldsArray.length; ++i)
          types2.push(this._fieldsArray[i].resolve().resolvedType);
        this.encode = encoder(this)({
          Writer,
          types: types2,
          util
        });
        this.decode = decoder(this)({
          Reader,
          types: types2,
          util,
          C: this.ctor
        });
        this.verify = verifier(this)({
          types: types2,
          util
        });
        this.fromObject = converter.fromObject(this)({
          types: types2,
          util,
          C: this.ctor
        });
        this.toObject = converter.toObject(this)({
          types: types2,
          util
        });
        var wrapper = wrappers[fullName];
        if (wrapper) {
          var wrapperThis = Object.create(this);
          wrapperThis._ctor = this.ctor;
          wrapperThis.fromObject = this.fromObject;
          this.fromObject = wrapper.fromObject.bind(wrapperThis);
          wrapperThis.toObject = this.toObject;
          this.toObject = wrapper.toObject.bind(wrapperThis);
        }
        return this;
      };
      Type.prototype.encode = function encode_setup(message, writer) {
        return this.setup().encode.apply(this, arguments);
      };
      Type.prototype.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, (writer || Writer.create()).fork()).ldelim();
      };
      Type.prototype.decode = function decode_setup(reader, length) {
        return this.setup().decode.apply(this, arguments);
      };
      Type.prototype.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof Reader))
          reader = Reader.create(reader);
        return this.decode(reader, reader.uint32());
      };
      Type.prototype.verify = function verify_setup(message) {
        return this.setup().verify.apply(this, arguments);
      };
      Type.prototype.fromObject = function fromObject(object) {
        return this.setup().fromObject.apply(this, arguments);
      };
      Type.prototype.toObject = function toObject(message, options) {
        return this.setup().toObject.apply(this, arguments);
      };
      Type.prototype.getTypeUrl = function getTypeUrl(prefix) {
        if (prefix === void 0)
          prefix = "type.googleapis.com";
        var fullName = this.fullName;
        return prefix + "/" + (fullName.charAt(0) === "." ? fullName.substring(1) : fullName);
      };
      Type.d = function decorateType(typeName) {
        return function typeDecorator(target) {
          util.decorateType(target, typeName);
        };
      };
    }
  });

  // node_modules/protobufjs/src/root.js
  var require_root = __commonJS({
    "node_modules/protobufjs/src/root.js"(exports2, module2) {
      "use strict";
      module2.exports = Root;
      var Namespace = require_namespace();
      Root.prototype = Object.create(Namespace.prototype, {
        constructor: {
          value: Root,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Root.className = "Root";
      var Field = require_field();
      var Enum = require_enum();
      var OneOf = require_oneof();
      var util = require_util2();
      var Type;
      var parse2;
      var common;
      function Root(options) {
        Namespace.call(this, "", options);
        this.deferred = [];
        this.files = [];
        this._edition = "proto2";
        this._fullyQualifiedObjects = {};
      }
      Root.fromJSON = function fromJSON(json, root3, depth) {
        if (depth === void 0)
          depth = 0;
        if (depth > util.recursionLimit)
          throw Error("max depth exceeded");
        if (!root3)
          root3 = new Root();
        if (json.options)
          root3.setOptions(json.options);
        return root3.addJSON(json.nested, depth).resolveAll();
      };
      Root.prototype.resolvePath = util.path.resolve;
      Root.prototype.fetch = util.fetch;
      function SYNC() {
      }
      Root.prototype.load = function load(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = void 0;
        }
        var self2 = this;
        if (!callback) {
          return util.asPromise(load, self2, filename, options);
        }
        var sync = callback === SYNC;
        function finish2(err, root3) {
          if (!callback) {
            return;
          }
          if (sync) {
            throw err;
          }
          if (root3) {
            root3.resolveAll();
          }
          var cb = callback;
          callback = null;
          cb(err, root3);
        }
        function getBundledFileName(filename2) {
          var idx = filename2.lastIndexOf("google/protobuf/");
          if (idx > -1) {
            var altname = filename2.substring(idx);
            if (Object.prototype.hasOwnProperty.call(common, altname)) return altname;
          }
          if (Object.prototype.hasOwnProperty.call(common, filename2)) return filename2;
          return null;
        }
        function process2(filename2, source, depth) {
          if (depth === void 0)
            depth = 0;
          try {
            if (depth > util.recursionLimit)
              throw Error("max depth exceeded");
            if (util.isString(source) && source.charAt(0) === "{")
              source = JSON.parse(source);
            if (!util.isString(source))
              self2.setOptions(source.options).addJSON(source.nested);
            else {
              parse2.filename = filename2;
              var parsed = parse2(source, self2, options), resolved2, i2 = 0;
              if (parsed.imports) {
                for (; i2 < parsed.imports.length; ++i2)
                  if (resolved2 = getBundledFileName(parsed.imports[i2]) || self2.resolvePath(filename2, parsed.imports[i2]))
                    fetch(resolved2, false, depth + 1);
              }
              if (parsed.weakImports) {
                for (i2 = 0; i2 < parsed.weakImports.length; ++i2)
                  if (resolved2 = getBundledFileName(parsed.weakImports[i2]) || self2.resolvePath(filename2, parsed.weakImports[i2]))
                    fetch(resolved2, true, depth + 1);
              }
            }
          } catch (err) {
            finish2(err);
          }
          if (!sync && !queued) {
            finish2(null, self2);
          }
        }
        function fetch(filename2, weak, depth) {
          if (depth === void 0)
            depth = 0;
          filename2 = getBundledFileName(filename2) || filename2;
          if (self2.files.indexOf(filename2) > -1) {
            return;
          }
          self2.files.push(filename2);
          if (Object.prototype.hasOwnProperty.call(common, filename2)) {
            if (sync) {
              process2(filename2, common[filename2], depth);
            } else {
              ++queued;
              setTimeout(function() {
                --queued;
                process2(filename2, common[filename2], depth);
              });
            }
            return;
          }
          if (sync) {
            var source;
            try {
              source = util.fs.readFileSync(filename2).toString("utf8");
            } catch (err) {
              if (!weak)
                finish2(err);
              return;
            }
            process2(filename2, source, depth);
          } else {
            ++queued;
            self2.fetch(filename2, function(err, source2) {
              --queued;
              if (!callback) {
                return;
              }
              if (err) {
                if (!weak)
                  finish2(err);
                else if (!queued)
                  finish2(null, self2);
                return;
              }
              process2(filename2, source2, depth);
            });
          }
        }
        var queued = 0;
        if (util.isString(filename)) {
          filename = [filename];
        }
        for (var i = 0, resolved; i < filename.length; ++i)
          if (resolved = self2.resolvePath("", filename[i]))
            fetch(resolved);
        if (sync) {
          self2.resolveAll();
          return self2;
        }
        if (!queued) {
          finish2(null, self2);
        }
        return self2;
      };
      Root.prototype.loadSync = function loadSync(filename, options) {
        if (!util.isNode)
          throw Error("not supported");
        return this.load(filename, options, SYNC);
      };
      Root.prototype.resolveAll = function resolveAll() {
        if (!this._needsRecursiveResolve) return this;
        if (this.deferred.length)
          throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
            return "'extend " + field.extend + "' in " + field.parent.fullName;
          }).join(", "));
        return Namespace.prototype.resolveAll.call(this);
      };
      var exposeRe = /^[A-Z]/;
      function tryHandleExtension(root3, field) {
        var extendedType = field.parent.lookup(field.extend);
        if (extendedType) {
          var sisterField = new Field(field.fullName, field.id, field.type, field.rule, void 0, field.options);
          if (extendedType.get(sisterField.name)) {
            return true;
          }
          sisterField.declaringField = field;
          field.extensionField = sisterField;
          extendedType.add(sisterField);
          return true;
        }
        return false;
      }
      Root.prototype._handleAdd = function _handleAdd(object) {
        if (object instanceof Field) {
          if (
            /* an extension field (implies not part of a oneof) */
            object.extend !== void 0 && /* not already handled */
            !object.extensionField
          ) {
            if (!tryHandleExtension(this, object))
              this.deferred.push(object);
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            object.parent[object.name] = object.values;
        } else if (!(object instanceof OneOf)) {
          if (object instanceof Type)
            for (var i = 0; i < this.deferred.length; )
              if (tryHandleExtension(this, this.deferred[i]))
                this.deferred.splice(i, 1);
              else
                ++i;
          for (var j = 0; j < /* initializes */
          object.nestedArray.length; ++j)
            this._handleAdd(object._nestedArray[j]);
          if (exposeRe.test(object.name))
            object.parent[object.name] = object;
        }
        if (object instanceof Type || object instanceof Enum || object instanceof Field) {
          this._fullyQualifiedObjects[object.fullName] = object;
        }
      };
      Root.prototype._handleRemove = function _handleRemove(object) {
        if (object instanceof Field) {
          if (
            /* an extension field */
            object.extend !== void 0
          ) {
            if (
              /* already handled */
              object.extensionField
            ) {
              object.extensionField.parent.remove(object.extensionField);
              object.extensionField = null;
            } else {
              var index = this.deferred.indexOf(object);
              if (index > -1)
                this.deferred.splice(index, 1);
            }
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        } else if (object instanceof Namespace) {
          for (var i = 0; i < /* initializes */
          object.nestedArray.length; ++i)
            this._handleRemove(object._nestedArray[i]);
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        }
        delete this._fullyQualifiedObjects[object.fullName];
      };
      Root._configure = function(Type_, parse_, common_) {
        Type = Type_;
        parse2 = parse_;
        common = common_;
      };
    }
  });

  // node_modules/protobufjs/src/util.js
  var require_util2 = __commonJS({
    "node_modules/protobufjs/src/util.js"(exports2, module2) {
      "use strict";
      var util = module2.exports = require_minimal();
      var roots = require_roots();
      var Type;
      var Enum;
      util.codegen = require_codegen();
      util.fetch = require_fetch();
      util.path = require_path();
      util.patterns = require_patterns();
      var reservedRe = util.patterns.reservedRe;
      util.fs = require_fs2();
      util.toArray = function toArray(object) {
        if (object) {
          var keys = Object.keys(object), array = new Array(keys.length), index = 0;
          while (index < keys.length)
            array[index] = object[keys[index++]];
          return array;
        }
        return [];
      };
      util.toObject = function toObject(array) {
        var object = {}, index = 0;
        while (index < array.length) {
          var key = array[index++], val = array[index++];
          if (val !== void 0)
            object[key] = val;
        }
        return object;
      };
      util.remove = function remove(object, value, key) {
        if (!object)
          return false;
        if (key !== void 0 && Object.prototype.hasOwnProperty.call(object, key) && object[key] === value) {
          delete object[key];
          return true;
        }
        for (var names = Object.keys(object), i = 0; i < names.length; ++i)
          if (object[names[i]] === value) {
            delete object[names[i]];
            return true;
          }
        return false;
      };
      util.isReserved = function isReserved(name) {
        return reservedRe.test(name);
      };
      util.safeProp = function safeProp(prop) {
        if (!/^[$\w_]+$/.test(prop) || reservedRe.test(prop))
          return "[" + JSON.stringify(prop) + "]";
        return "." + prop;
      };
      util.ucFirst = function ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      };
      var camelCaseRe = /_([a-z])/g;
      util.camelCase = function camelCase(str) {
        return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
          return $1.toUpperCase();
        });
      };
      util.jsonName = function jsonName(str) {
        var result = "", upperNext = false, i = 0;
        for (; i < str.length; ++i) {
          var ch = str.charAt(i);
          if (ch === "_")
            upperNext = true;
          else if (upperNext) {
            result += ch.toUpperCase();
            upperNext = false;
          } else
            result += ch;
        }
        return result;
      };
      util.compareFieldsById = function compareFieldsById(a, b) {
        return a.id - b.id;
      };
      util.decorateType = function decorateType(ctor, typeName) {
        if (ctor.$type) {
          if (typeName && ctor.$type.name !== typeName) {
            util.decorateRoot.remove(ctor.$type);
            ctor.$type.name = typeName;
            util.decorateRoot.add(ctor.$type);
          }
          return ctor.$type;
        }
        if (!Type)
          Type = require_type2();
        var type = new Type(typeName || ctor.name);
        util.decorateRoot.add(type);
        type.ctor = ctor;
        Object.defineProperty(ctor, "$type", { value: type, enumerable: false });
        Object.defineProperty(ctor.prototype, "$type", { value: type, enumerable: false });
        return type;
      };
      var decorateEnumIndex = 0;
      util.decorateEnum = function decorateEnum(object) {
        if (object.$type)
          return object.$type;
        if (!Enum)
          Enum = require_enum();
        var enm = new Enum("Enum" + decorateEnumIndex++, object);
        util.decorateRoot.add(enm);
        Object.defineProperty(object, "$type", { value: enm, enumerable: false });
        return enm;
      };
      util.setProperty = function setProperty(dst, path, value, ifNotSet) {
        function setProp(dst2, path2, value2) {
          var part = path2.shift();
          if (util.isUnsafeProperty(part))
            return dst2;
          if (path2.length > 0) {
            dst2[part] = setProp(dst2[part] || {}, path2, value2);
          } else {
            var prevValue = dst2[part];
            if (prevValue && ifNotSet)
              return dst2;
            if (prevValue)
              value2 = [].concat(prevValue).concat(value2);
            dst2[part] = value2;
          }
          return dst2;
        }
        if (typeof dst !== "object")
          throw TypeError("dst must be an object");
        if (!path)
          throw TypeError("path must be specified");
        path = path.split(".");
        if (path.length > util.recursionLimit)
          throw Error("max depth exceeded");
        return setProp(dst, path, value);
      };
      Object.defineProperty(util, "decorateRoot", {
        get: function() {
          return roots["decorated"] || (roots["decorated"] = new (require_root())());
        }
      });
    }
  });

  // node_modules/protobufjs/src/types.js
  var require_types2 = __commonJS({
    "node_modules/protobufjs/src/types.js"(exports2) {
      "use strict";
      var types2 = exports2;
      var util = require_util2();
      var s = [
        "double",
        // 0
        "float",
        // 1
        "int32",
        // 2
        "uint32",
        // 3
        "sint32",
        // 4
        "fixed32",
        // 5
        "sfixed32",
        // 6
        "int64",
        // 7
        "uint64",
        // 8
        "sint64",
        // 9
        "fixed64",
        // 10
        "sfixed64",
        // 11
        "bool",
        // 12
        "string",
        // 13
        "bytes"
        // 14
      ];
      function bake(values, offset) {
        var i = 0, o = /* @__PURE__ */ Object.create(null);
        offset |= 0;
        while (i < values.length) o[s[i + offset]] = values[i++];
        return o;
      }
      types2.basic = bake([
        /* double   */
        1,
        /* float    */
        5,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0,
        /* string   */
        2,
        /* bytes    */
        2
      ]);
      types2.defaults = bake([
        /* double   */
        0,
        /* float    */
        0,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        0,
        /* sfixed32 */
        0,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        0,
        /* sfixed64 */
        0,
        /* bool     */
        false,
        /* string   */
        "",
        /* bytes    */
        util.emptyArray,
        /* message  */
        null
      ]);
      types2.long = bake([
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1
      ], 7);
      types2.mapKey = bake([
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0,
        /* string   */
        2
      ], 2);
      types2.packed = bake([
        /* double   */
        1,
        /* float    */
        5,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0
      ]);
    }
  });

  // node_modules/protobufjs/src/field.js
  var require_field = __commonJS({
    "node_modules/protobufjs/src/field.js"(exports2, module2) {
      "use strict";
      module2.exports = Field;
      var ReflectionObject = require_object();
      Field.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Field,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Field.className = "Field";
      var Enum = require_enum();
      var types2 = require_types2();
      var util = require_util2();
      var Type;
      var ruleRe = /^(?:required|optional|repeated)$/;
      Field.fromJSON = function fromJSON(name, json) {
        var field = new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
        if (json.edition)
          field._edition = json.edition;
        if (json.protoName)
          field.protoName = json.protoName;
        if (json.jsonName !== void 0)
          field.jsonName = json.jsonName;
        else if (json.options && json.options.json_name !== void 0)
          field.jsonName = json.options.json_name;
        field._defaultEdition = "proto3";
        return field;
      };
      function Field(name, id, type, rule, extend, options, comment) {
        if (util.isObject(rule)) {
          comment = extend;
          options = rule;
          rule = extend = void 0;
        } else if (util.isObject(extend)) {
          comment = options;
          options = extend;
          extend = void 0;
        }
        ReflectionObject.call(this, name, options);
        if (!util.isInteger(id) || id < 0)
          throw TypeError("id must be a non-negative integer");
        if (!util.isString(type))
          throw TypeError("type must be a string");
        if (rule !== void 0 && !ruleRe.test(rule = rule.toString().toLowerCase()))
          throw TypeError("rule must be a string rule");
        if (extend !== void 0 && !util.isString(extend))
          throw TypeError("extend must be a string");
        this.rule = rule && rule !== "optional" ? rule : void 0;
        this.type = type;
        this.id = id;
        this.extend = extend || void 0;
        this.repeated = rule === "repeated";
        this.map = false;
        this.message = null;
        this.partOf = null;
        this.typeDefault = null;
        this.defaultValue = null;
        this.long = util.Long ? types2.long[type] !== void 0 : (
          /* istanbul ignore next */
          false
        );
        this.bytes = type === "bytes";
        this.resolvedType = null;
        this.extensionField = null;
        this.declaringField = null;
        this.comment = comment;
        this.protoName = void 0;
        this.jsonName = void 0;
      }
      Object.defineProperty(Field.prototype, "required", {
        get: function() {
          return this._features.field_presence === "LEGACY_REQUIRED";
        }
      });
      Object.defineProperty(Field.prototype, "optional", {
        get: function() {
          return !this.required;
        }
      });
      Object.defineProperty(Field.prototype, "delimited", {
        get: function() {
          return this.resolvedType instanceof Type && this._features.message_encoding === "DELIMITED";
        }
      });
      Object.defineProperty(Field.prototype, "packed", {
        get: function() {
          return this._features.repeated_field_encoding === "PACKED";
        }
      });
      Object.defineProperty(Field.prototype, "hasPresence", {
        get: function() {
          if (this.repeated || this.map) {
            return false;
          }
          return this.partOf || // oneofs
          this.declaringField || this.extensionField || // extensions
          this._features.field_presence !== "IMPLICIT";
        }
      });
      Field.prototype.setOption = function setOption(name, value, ifNotSet) {
        return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
      };
      Field.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "rule",
          this.rule !== "optional" && this.rule || void 0,
          "type",
          this.type,
          "id",
          this.id,
          "extend",
          this.extend,
          "protoName",
          this.protoName !== this.name ? this.protoName : void 0,
          "jsonName",
          this.jsonName !== util.jsonName(this.protoName || this.name) ? this.jsonName : void 0,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Field.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if ((this.typeDefault = types2.defaults[this.type]) === void 0) {
          this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
          if (this.resolvedType instanceof Type)
            this.typeDefault = null;
          else
            this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        } else if (this.options && this.options.proto3_optional) {
          this.typeDefault = null;
        }
        if (this.options && this.options["default"] != null) {
          this.typeDefault = this.options["default"];
          if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
            this.typeDefault = this.resolvedType.values[this.typeDefault];
        }
        if (this.options) {
          if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof Enum))
            delete this.options.packed;
          if (!Object.keys(this.options).length)
            this.options = void 0;
        }
        if (this.long) {
          var unsigned = this.type === "uint64" || this.type === "fixed64";
          this.typeDefault = typeof this.typeDefault === "string" ? util.Long.fromString(this.typeDefault, unsigned) : util.Long.fromNumber(this.typeDefault, unsigned);
          if (Object.freeze)
            Object.freeze(this.typeDefault);
        } else if (types2.long[this.type] !== void 0 && typeof this.typeDefault === "string") {
          this.typeDefault = parseInt(this.typeDefault, 10);
        } else if (this.bytes && typeof this.typeDefault === "string") {
          var buf;
          if (util.base64.test(this.typeDefault))
            util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
          else
            util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
          this.typeDefault = buf;
        }
        if (this.map)
          this.defaultValue = util.emptyObject;
        else if (this.repeated)
          this.defaultValue = util.emptyArray;
        else
          this.defaultValue = this.typeDefault;
        if (this.parent instanceof Type && this.parent._ctor)
          this.parent._ctor.prototype[this.name] = this.defaultValue;
        if (this.protoName === void 0)
          this.protoName = this.name;
        if (this.jsonName === void 0)
          this.jsonName = util.jsonName(this.protoName);
        return ReflectionObject.prototype.resolve.call(this);
      };
      Field.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures(edition) {
        if (edition !== "proto2" && edition !== "proto3") {
          return {};
        }
        var features = {};
        if (this.rule === "required") {
          features.field_presence = "LEGACY_REQUIRED";
        }
        if (this.parent && types2.defaults[this.type] === void 0) {
          var type = this.parent.get(this.type.split(".").pop());
          if (type && type instanceof Type && type.group) {
            features.message_encoding = "DELIMITED";
          }
        }
        if (this.getOption("packed") === true) {
          features.repeated_field_encoding = "PACKED";
        } else if (this.getOption("packed") === false) {
          features.repeated_field_encoding = "EXPANDED";
        }
        return features;
      };
      Field.prototype._resolveFeatures = function _resolveFeatures(edition) {
        return ReflectionObject.prototype._resolveFeatures.call(this, this._edition || edition);
      };
      Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
        if (typeof fieldType === "function")
          fieldType = util.decorateType(fieldType).name;
        else if (fieldType && typeof fieldType === "object")
          fieldType = util.decorateEnum(fieldType).name;
        return function fieldDecorator(prototype, fieldName) {
          util.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
        };
      };
      Field._configure = function configure(Type_) {
        Type = Type_;
      };
    }
  });

  // node_modules/protobufjs/src/oneof.js
  var require_oneof = __commonJS({
    "node_modules/protobufjs/src/oneof.js"(exports2, module2) {
      "use strict";
      module2.exports = OneOf;
      var ReflectionObject = require_object();
      OneOf.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: OneOf,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      OneOf.className = "OneOf";
      var Field = require_field();
      var util = require_util2();
      function OneOf(name, fieldNames, options, comment) {
        if (!Array.isArray(fieldNames)) {
          options = fieldNames;
          fieldNames = void 0;
        }
        ReflectionObject.call(this, name, options);
        if (!(fieldNames === void 0 || Array.isArray(fieldNames)))
          throw TypeError("fieldNames must be an Array");
        this.oneof = fieldNames || [];
        this.fieldsArray = [];
        this.comment = comment;
      }
      OneOf.fromJSON = function fromJSON(name, json) {
        return new OneOf(name, json.oneof, json.options, json.comment);
      };
      OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "options",
          this.options,
          "oneof",
          this.oneof,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      function addFieldsToParent(oneof) {
        if (oneof.parent) {
          for (var i = 0; i < oneof.fieldsArray.length; ++i)
            if (!oneof.fieldsArray[i].parent)
              oneof.parent.add(oneof.fieldsArray[i]);
        }
      }
      OneOf.prototype.add = function add2(field) {
        if (!(field instanceof Field))
          throw TypeError("field must be a Field");
        if (field.parent && field.parent !== this.parent)
          field.parent.remove(field);
        this.oneof.push(field.name);
        this.fieldsArray.push(field);
        field.partOf = this;
        addFieldsToParent(this);
        return this;
      };
      OneOf.prototype.remove = function remove(field) {
        if (!(field instanceof Field))
          throw TypeError("field must be a Field");
        var index = this.fieldsArray.indexOf(field);
        if (index < 0)
          throw Error(field + " is not a member of " + this);
        this.fieldsArray.splice(index, 1);
        index = this.oneof.indexOf(field.name);
        if (index > -1)
          this.oneof.splice(index, 1);
        field.partOf = null;
        return this;
      };
      OneOf.prototype.onAdd = function onAdd(parent) {
        ReflectionObject.prototype.onAdd.call(this, parent);
        var self2 = this;
        for (var i = 0; i < this.oneof.length; ++i) {
          var field = parent.get(this.oneof[i]);
          if (field && !field.partOf) {
            field.partOf = self2;
            self2.fieldsArray.push(field);
          }
        }
        addFieldsToParent(this);
      };
      OneOf.prototype.onRemove = function onRemove(parent) {
        for (var i = 0, field; i < this.fieldsArray.length; ++i)
          if ((field = this.fieldsArray[i]).parent)
            field.parent.remove(field);
        ReflectionObject.prototype.onRemove.call(this, parent);
      };
      Object.defineProperty(OneOf.prototype, "isProto3Optional", {
        get: function() {
          if (this.fieldsArray == null || this.fieldsArray.length !== 1) {
            return false;
          }
          var field = this.fieldsArray[0];
          return field.options != null && field.options["proto3_optional"] === true;
        }
      });
      OneOf.d = function decorateOneOf() {
        var fieldNames = new Array(arguments.length), index = 0;
        while (index < arguments.length)
          fieldNames[index] = arguments[index++];
        return function oneOfDecorator(prototype, oneofName) {
          util.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
          Object.defineProperty(prototype, oneofName, {
            get: util.oneOfGetter(fieldNames),
            set: util.oneOfSetter(fieldNames)
          });
        };
      };
    }
  });

  // node_modules/protobufjs/src/object.js
  var require_object = __commonJS({
    "node_modules/protobufjs/src/object.js"(exports2, module2) {
      "use strict";
      module2.exports = ReflectionObject;
      ReflectionObject.className = "ReflectionObject";
      var OneOf = require_oneof();
      var util = require_util2();
      var Root;
      var proto2Defaults = { enum_type: "CLOSED", field_presence: "EXPLICIT", json_format: "LEGACY_BEST_EFFORT", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "EXPANDED", utf8_validation: "NONE", enforce_naming_style: "STYLE_LEGACY", default_symbol_visibility: "EXPORT_ALL" };
      var proto3Defaults = { enum_type: "OPEN", field_presence: "IMPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE_LEGACY", default_symbol_visibility: "EXPORT_ALL" };
      var editions2023Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE_LEGACY", default_symbol_visibility: "EXPORT_ALL" };
      var editions2024Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE2024", default_symbol_visibility: "EXPORT_TOP_LEVEL" };
      var editions2026Defaults = { enum_type: "OPEN", field_presence: "EXPLICIT", json_format: "ALLOW", message_encoding: "LENGTH_PREFIXED", repeated_field_encoding: "PACKED", utf8_validation: "VERIFY", enforce_naming_style: "STYLE2026", default_symbol_visibility: "STRICT", enforce_proto_limits: "PROTO_LIMITS2026" };
      function ReflectionObject(name, options) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        if (options && !util.isObject(options))
          throw TypeError("options must be an object");
        this.options = options;
        this.parsedOptions = null;
        this.name = name;
        this._edition = null;
        this._defaultEdition = "proto2";
        this._features = {};
        this._featuresResolved = false;
        this.parent = null;
        this.resolved = false;
        this.comment = null;
        this.filename = null;
      }
      Object.defineProperties(ReflectionObject.prototype, {
        /**
         * Reference to the root namespace.
         * @name ReflectionObject#root
         * @type {Root}
         * @readonly
         */
        root: {
          get: function() {
            var ptr = this;
            while (ptr.parent !== null)
              ptr = ptr.parent;
            return ptr;
          }
        },
        /**
         * Full name including leading dot.
         * @name ReflectionObject#fullName
         * @type {string}
         * @readonly
         */
        fullName: {
          get: function() {
            var path = [this.name], ptr = this.parent;
            while (ptr) {
              path.unshift(ptr.name);
              ptr = ptr.parent;
            }
            return path.join(".");
          }
        }
      });
      ReflectionObject.prototype.toJSON = /* istanbul ignore next */
      function toJSON() {
        throw Error();
      };
      ReflectionObject.prototype.onAdd = function onAdd(parent) {
        if (this.parent && this.parent !== parent)
          this.parent.remove(this);
        this.parent = parent;
        this.resolved = false;
        var root3 = parent.root;
        if (root3 instanceof Root)
          root3._handleAdd(this);
      };
      ReflectionObject.prototype.onRemove = function onRemove(parent) {
        var root3 = parent.root;
        if (root3 instanceof Root)
          root3._handleRemove(this);
        this.parent = null;
        this.resolved = false;
      };
      ReflectionObject.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (this.root instanceof Root)
          this.resolved = true;
        return this;
      };
      ReflectionObject.prototype._resolveFeaturesRecursive = function _resolveFeaturesRecursive(edition) {
        return this._resolveFeatures(this._edition || edition);
      };
      ReflectionObject.prototype._resolveFeatures = function _resolveFeatures(edition) {
        if (this._featuresResolved) {
          return;
        }
        var defaults = {};
        if (!edition) {
          throw new Error("Unknown edition for " + this.fullName);
        }
        var protoFeatures = util.merge(
          {},
          this.options && this.options.features,
          this._inferLegacyProtoFeatures(edition)
        );
        if (this._edition) {
          if (edition === "proto2") {
            defaults = Object.assign({}, proto2Defaults);
          } else if (edition === "proto3") {
            defaults = Object.assign({}, proto3Defaults);
          } else if (edition === "2023") {
            defaults = Object.assign({}, editions2023Defaults);
          } else if (edition === "2024") {
            defaults = Object.assign({}, editions2024Defaults);
          } else if (edition === "2026") {
            defaults = Object.assign({}, editions2026Defaults);
          } else {
            throw new Error("Unknown edition: " + edition);
          }
          this._features = util.merge(defaults, protoFeatures);
        } else {
          if (this.partOf instanceof OneOf) {
            var lexicalParentFeaturesCopy = util.merge({}, this.partOf._features);
            this._features = util.merge(lexicalParentFeaturesCopy, protoFeatures);
          } else if (this.declaringField) {
          } else if (this.parent) {
            var parentFeaturesCopy = util.merge({}, this.parent._features);
            this._features = util.merge(parentFeaturesCopy, protoFeatures);
          } else {
            throw new Error("Unable to find a parent for " + this.fullName);
          }
        }
        if (this.extensionField) {
          this.extensionField._features = this._features;
        }
        this._featuresResolved = true;
      };
      ReflectionObject.prototype._inferLegacyProtoFeatures = function _inferLegacyProtoFeatures() {
        return {};
      };
      ReflectionObject.prototype.getOption = function getOption(name) {
        if (this.options && Object.prototype.hasOwnProperty.call(this.options, name))
          return this.options[name];
        return void 0;
      };
      ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
        if (name === "__proto__")
          return this;
        if (!this.options)
          this.options = {};
        if (/^features\./.test(name)) {
          util.setProperty(this.options, name, value, ifNotSet);
        } else {
          var prev = this.getOption(name);
          if (!ifNotSet || prev === void 0) {
            if (prev !== value) this.resolved = false;
            this.options[name] = value;
          }
        }
        return this;
      };
      ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
        if (name === "__proto__")
          return this;
        if (!this.parsedOptions) {
          this.parsedOptions = [];
        }
        var parsedOptions = this.parsedOptions;
        if (propName) {
          var opt = parsedOptions.find(function(opt2) {
            return Object.prototype.hasOwnProperty.call(opt2, name);
          });
          if (opt) {
            var newValue = opt[name];
            util.setProperty(newValue, propName, value);
          } else {
            opt = {};
            opt[name] = util.setProperty({}, propName, value);
            parsedOptions.push(opt);
          }
        } else {
          var newOpt = {};
          newOpt[name] = value;
          parsedOptions.push(newOpt);
        }
        return this;
      };
      ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
        if (options)
          for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
            this.setOption(keys[i], options[keys[i]], ifNotSet);
        return this;
      };
      Object.defineProperty(ReflectionObject.prototype, "toString", {
        value: function toString() {
          var className = this.constructor.className, fullName = this.fullName;
          if (fullName.length)
            return className + " " + fullName;
          return className;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
      ReflectionObject.prototype._editionToJSON = function _editionToJSON() {
        if (!this._edition || this._edition === "proto3") {
          return void 0;
        }
        return this._edition;
      };
      ReflectionObject._configure = function(Root_) {
        Root = Root_;
      };
    }
  });

  // node_modules/protobufjs/src/enum.js
  var require_enum = __commonJS({
    "node_modules/protobufjs/src/enum.js"(exports2, module2) {
      "use strict";
      module2.exports = Enum;
      var ReflectionObject = require_object();
      Enum.prototype = Object.create(ReflectionObject.prototype, {
        constructor: {
          value: Enum,
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      Enum.className = "Enum";
      var Namespace = require_namespace();
      var util = require_util2();
      function Enum(name, values, options, comment, comments, valuesOptions) {
        ReflectionObject.call(this, name, options);
        if (values && typeof values !== "object")
          throw TypeError("values must be an object");
        this.valuesById = /* @__PURE__ */ Object.create(null);
        this.values = Object.create(this.valuesById);
        this.comment = comment;
        this.comments = comments || {};
        this.valuesOptions = valuesOptions;
        this._valuesFeatures = {};
        this.reserved = void 0;
        this.visibility = void 0;
        if (values) {
          for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
            if (keys[i] !== "__proto__" && typeof values[keys[i]] === "number") {
              this.values[keys[i]] = values[keys[i]];
              if (this.valuesById[values[keys[i]]] === void 0)
                this.valuesById[values[keys[i]]] = keys[i];
            }
        }
      }
      Enum.prototype._resolveFeatures = function _resolveFeatures(edition) {
        edition = this._edition || edition;
        ReflectionObject.prototype._resolveFeatures.call(this, edition);
        Object.keys(this.values).forEach((key) => {
          var parentFeaturesCopy = util.merge({}, this._features);
          this._valuesFeatures[key] = util.merge(parentFeaturesCopy, this.valuesOptions && this.valuesOptions[key] && this.valuesOptions[key].features || {});
        });
        return this;
      };
      Enum.fromJSON = function fromJSON(name, json) {
        var enm = new Enum(name, json.values, json.options, json.comment, json.comments, json.valuesOptions);
        enm.reserved = json.reserved;
        if (json.visibility)
          enm.visibility = json.visibility;
        if (json.edition)
          enm._edition = json.edition;
        enm._defaultEdition = "proto3";
        return enm;
      };
      Enum.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "edition",
          this._editionToJSON(),
          "options",
          this.options,
          "valuesOptions",
          this.valuesOptions,
          "values",
          this.values,
          "reserved",
          this.reserved && this.reserved.length ? this.reserved : void 0,
          "visibility",
          this.visibility,
          "comment",
          keepComments ? this.comment : void 0,
          "comments",
          keepComments ? this.comments : void 0
        ]);
      };
      Enum.prototype.add = function add2(name, id, comment, options) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        if (!util.isInteger(id))
          throw TypeError("id must be an integer");
        if (name === "__proto__")
          return this;
        if (this.values[name] !== void 0)
          throw Error("duplicate name '" + name + "' in " + this);
        if (this.isReservedId(id))
          throw Error("id " + id + " is reserved in " + this);
        if (this.isReservedName(name))
          throw Error("name '" + name + "' is reserved in " + this);
        if (this.valuesById[id] !== void 0) {
          if (!(this.options && this.options.allow_alias))
            throw Error("duplicate id " + id + " in " + this);
          this.values[name] = id;
        } else
          this.valuesById[this.values[name] = id] = name;
        if (options) {
          if (this.valuesOptions === void 0)
            this.valuesOptions = {};
          this.valuesOptions[name] = options || null;
        }
        this.comments[name] = comment || null;
        return this;
      };
      Enum.prototype.remove = function remove(name) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        var val = this.values[name];
        if (val == null)
          throw Error("name '" + name + "' does not exist in " + this);
        delete this.valuesById[val];
        delete this.values[name];
        delete this.comments[name];
        if (this.valuesOptions)
          delete this.valuesOptions[name];
        return this;
      };
      Enum.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Enum.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
    }
  });

  // node_modules/protobufjs/src/encoder.js
  var require_encoder = __commonJS({
    "node_modules/protobufjs/src/encoder.js"(exports2, module2) {
      "use strict";
      module2.exports = encoder;
      var Enum = require_enum();
      var types2 = require_types2();
      var util = require_util2();
      function genTypePartial(gen, field, fieldIndex, ref) {
        return field.delimited ? gen("types[%i].encode(%s,w.uint32(%i),q+1).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork(),q+1).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
      }
      function encoder(mtype) {
        var gen = util.codegen(["m", "w", "q"])("if(!w)")("w=Writer.create()")("if(q===undefined)q=0")("if(q>util.recursionLimit)")('throw Error("max depth exceeded")');
        var i, ref;
        var fields = (
          /* initializes */
          mtype.fieldsArray.slice().sort(util.compareFieldsById)
        );
        for (var i = 0; i < fields.length; ++i) {
          var field = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field), type = field.resolvedType instanceof Enum ? "int32" : field.type, wireType = types2.basic[type];
          ref = "m" + util.safeProp(field.name);
          if (field.map) {
            gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref);
            if (field.keyType === "bool") gen("w.uint32(%i).fork().uint32(%i).bool(util.boolFromKey(ks[i]))", (field.id << 3 | 2) >>> 0, 8 | types2.mapKey[field.keyType]);
            else if (types2.long[field.keyType] !== void 0) gen("w.uint32(%i).fork().uint32(%i).%s(util.longFromKey(ks[i],%j))", (field.id << 3 | 2) >>> 0, 8 | types2.mapKey[field.keyType], field.keyType, field.keyType === "uint64" || field.keyType === "fixed64");
            else gen("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types2.mapKey[field.keyType], field.keyType);
            if (wireType === void 0) gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork(),q+1).ldelim().ldelim()", index, ref);
            else gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
            gen("}")("}");
          } else if (field.repeated) {
            gen("if(%s!=null&&%s.length){", ref, ref);
            if (field.packed && types2.packed[type] !== void 0) {
              gen("w.uint32(%i).%ss(%s)", (field.id << 3 | 2) >>> 0, type, ref);
            } else {
              gen("for(var i=0;i<%s.length;++i)", ref);
              if (wireType === void 0)
                genTypePartial(gen, field, index, ref + "[i]");
              else gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
            }
            gen("}");
          } else {
            if (!field.required)
              if (field.hasPresence || !(field.resolvedType instanceof Enum || types2.basic[type] !== void 0)) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name);
              else if (field.resolvedType instanceof Enum) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==%j)", ref, field.name, ref, field.typeDefault);
              else if (type === "bool") gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==false)", ref, field.name, ref);
              else if (type === "string") gen('if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!=="")', ref, field.name, ref);
              else if (type === "bytes") gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s.length)", ref, field.name, ref);
              else if (type === "double" || type === "float") gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&!Object.is(%s,0))", ref, field.name, ref);
              else if (types2.long[type] !== void 0) gen('if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&(typeof %s==="object"?%s.low||%s.high:%s!==0))', ref, field.name, ref, ref, ref, ref);
              else gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)&&%s!==0)", ref, field.name, ref);
            if (wireType === void 0)
              genTypePartial(gen, field, index, ref);
            else gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
          }
        }
        return gen('if(m.$unknowns!=null&&Object.hasOwnProperty.call(m,"$unknowns"))')("for(var i=0;i<m.$unknowns.length;++i)")("w.raw(m.$unknowns[i])")("return w");
      }
    }
  });

  // node_modules/protobufjs/src/index-light.js
  var require_index_light = __commonJS({
    "node_modules/protobufjs/src/index-light.js"(exports2, module2) {
      "use strict";
      exports2 = module2.exports = require_index_minimal();
      exports2.build = "light";
      function load(filename, root3, callback) {
        if (typeof root3 === "function") {
          callback = root3;
          root3 = new exports2.Root();
        } else if (!root3)
          root3 = new exports2.Root();
        return root3.load(filename, callback);
      }
      exports2.load = load;
      function loadSync(filename, root3) {
        if (!root3)
          root3 = new exports2.Root();
        return root3.loadSync(filename);
      }
      exports2.loadSync = loadSync;
      exports2.encoder = require_encoder();
      exports2.decoder = require_decoder();
      exports2.verifier = require_verifier();
      exports2.converter = require_converter();
      exports2.ReflectionObject = require_object();
      exports2.Namespace = require_namespace();
      exports2.Root = require_root();
      exports2.Enum = require_enum();
      exports2.Type = require_type2();
      exports2.Field = require_field();
      exports2.OneOf = require_oneof();
      exports2.MapField = require_mapfield();
      exports2.Service = require_service2();
      exports2.Method = require_method();
      exports2.Message = require_message();
      exports2.wrappers = require_wrappers();
      exports2.types = require_types2();
      exports2.util = require_util2();
      exports2.ReflectionObject._configure(exports2.Root);
      exports2.Namespace._configure(exports2.Type, exports2.Service, exports2.Enum);
      exports2.Root._configure(exports2.Type, void 0, {});
      exports2.Field._configure(exports2.Type);
    }
  });

  // node_modules/protobufjs/light.js
  var require_light = __commonJS({
    "node_modules/protobufjs/light.js"(exports2, module2) {
      "use strict";
      module2.exports = require_index_light();
    }
  });

  // mockjs/tiles.mjs
  var SUIT_CHAR = { 1: "m", 2: "p", 3: "s", 4: "z" };
  function tileId(suit, rank, copy) {
    return suit * 100 + rank * 10 + copy;
  }
  function decodeId(id) {
    const suit = Math.floor(id / 100);
    const rank = Math.floor(id % 100 / 10);
    const copy = id % 10;
    return { suit, rank, copy };
  }
  function toRiichi(id, aka = false) {
    const { suit, rank } = decodeId(id);
    const ch = SUIT_CHAR[suit];
    if (!ch) return null;
    if (aka && suit !== 4 && rank === 5) return "0" + ch;
    return rank + ch;
  }
  function doraFromIndicator(id, sanma = false) {
    const { suit, rank } = decodeId(id);
    if (suit === 4) {
      const next2 = rank <= 4 ? rank === 4 ? 1 : rank + 1 : rank === 7 ? 5 : rank + 1;
      return tileId(4, next2, 1);
    }
    if (sanma && suit === 1) return tileId(1, rank === 9 ? 1 : 9, 1);
    const next = rank === 9 ? 1 : rank + 1;
    return tileId(suit, next, 1);
  }
  function buildWall({ sanma = false, akaCount = 1 } = {}) {
    const tiles = [];
    const akaSet = /* @__PURE__ */ new Set();
    for (let suit = 1; suit <= 4; suit++) {
      const maxRank = suit === 4 ? 7 : 9;
      for (let rank = 1; rank <= maxRank; rank++) {
        if (sanma && suit === 1 && rank >= 2 && rank <= 8) continue;
        for (let copy = 1; copy <= 4; copy++) {
          tiles.push(tileId(suit, rank, copy));
        }
      }
    }
    for (const suit of [1, 2, 3]) {
      if (akaCount > 0) {
        akaSet.add(tileId(suit, 5, 1));
        if (akaCount > 1) akaSet.add(tileId(suit, 5, 2));
      }
    }
    return { tiles, akaSet };
  }
  function shuffle(arr, rng = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  var HAN_ZI = {
    1: "\u4E07",
    2: "\u7B52",
    3: "\u7D22",
    4: "\u5B57"
  };
  var ZI_NAME = { 1: "\u4E1C", 2: "\u5357", 3: "\u897F", 4: "\u5317", 5: "\u767D", 6: "\u53D1", 7: "\u4E2D" };
  function tileName(id) {
    const { suit, rank } = decodeId(id);
    if (suit === 4) return ZI_NAME[rank];
    return rank + HAN_ZI[suit];
  }

  // mockjs/shanten.mjs
  function tileIndex(id) {
    const { suit, rank } = decodeId(id);
    if (suit >= 1 && suit <= 3) return (suit - 1) * 9 + (rank - 1);
    if (suit === 4) return 27 + (rank - 1);
    return -1;
  }
  function indexToTileId(idx, copy = 1) {
    if (idx < 27) return tileId(Math.floor(idx / 9) + 1, idx % 9 + 1, copy);
    return tileId(4, idx - 27 + 1, copy);
  }
  function countsOf(ids) {
    const c = new Array(34).fill(0);
    for (const id of ids) {
      const i = tileIndex(id);
      if (i >= 0) c[i]++;
    }
    return c;
  }
  var YAOCHU = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];
  var suitCache = /* @__PURE__ */ new Map();
  function analyzeGroup(c, allowRuns) {
    const n = c.length;
    let code = 0;
    for (let i = 0; i < n; i++) code = code * 5 + c[i];
    const key = code * 2 + (allowRuns ? 0 : 1);
    const hit = suitCache.get(key);
    if (hit) return hit;
    const res = [];
    for (let i = 0; i < 5; i++) res.push({ p: -1, pp: -1 });
    const rec = (i, sets, partials, hasPair) => {
      if (sets + partials > 5) return;
      if (i >= n) {
        const s = sets > 4 ? 4 : sets;
        const r = res[s];
        if (partials > r.p) r.p = partials;
        if (hasPair && partials > r.pp) r.pp = partials;
        return;
      }
      if (c[i] === 0) {
        rec(i + 1, sets, partials, hasPair);
        return;
      }
      if (c[i] >= 3) {
        c[i] -= 3;
        rec(i, sets + 1, partials, hasPair);
        c[i] += 3;
      }
      if (allowRuns && i + 2 < n && c[i + 1] > 0 && c[i + 2] > 0) {
        c[i]--;
        c[i + 1]--;
        c[i + 2]--;
        rec(i, sets + 1, partials, hasPair);
        c[i]++;
        c[i + 1]++;
        c[i + 2]++;
      }
      if (c[i] >= 2) {
        c[i] -= 2;
        rec(i, sets, partials + 1, true);
        c[i] += 2;
      }
      if (allowRuns && i + 1 < n && c[i + 1] > 0) {
        c[i]--;
        c[i + 1]--;
        rec(i, sets, partials + 1, hasPair);
        c[i]++;
        c[i + 1]++;
      }
      if (allowRuns && i + 2 < n && c[i + 2] > 0) {
        c[i]--;
        c[i + 2]--;
        rec(i, sets, partials + 1, hasPair);
        c[i]++;
        c[i + 2]++;
      }
      c[i]--;
      rec(i, sets, partials, hasPair);
      c[i]++;
    };
    rec(0, 0, 0, false);
    suitCache.set(key, res);
    return res;
  }
  var G0 = new Array(9);
  var G1 = new Array(9);
  var G2 = new Array(9);
  var G3 = new Array(7);
  function stdShanten(t, fixedMelds) {
    for (let i = 0; i < 9; i++) {
      G0[i] = t[i];
      G1[i] = t[9 + i];
      G2[i] = t[18 + i];
    }
    for (let i = 0; i < 7; i++) G3[i] = t[27 + i];
    const groups = [
      analyzeGroup(G0, true),
      analyzeGroup(G1, true),
      analyzeGroup(G2, true),
      analyzeGroup(G3, false)
    ];
    let cur = new Uint8Array(5 * 6 * 2);
    cur[0] = 1;
    for (const g of groups) {
      const next = new Uint8Array(5 * 6 * 2);
      for (let s = 0; s <= 4; s++) {
        for (let p = 0; p <= 5; p++) {
          for (let h = 0; h <= 1; h++) {
            if (!cur[(s * 6 + p) * 2 + h]) continue;
            for (let gs = 0; gs <= 4; gs++) {
              const r = g[gs];
              if (r.p < 0) continue;
              const ns = s + gs;
              if (ns > 4) continue;
              for (const [gp, gh] of [[r.p, h], [r.pp, 1]]) {
                if (gp < 0) continue;
                let np = p + gp;
                if (np > 5) np = 5;
                next[(ns * 6 + np) * 2 + gh] = 1;
              }
            }
          }
        }
      }
      cur = next;
    }
    let best = 99;
    for (let s = 0; s <= 4; s++) {
      for (let p = 0; p <= 5; p++) {
        for (let h = 0; h <= 1; h++) {
          if (!cur[(s * 6 + p) * 2 + h]) continue;
          let total = s + fixedMelds;
          if (total > 4) total = 4;
          let pp = p;
          if (total + pp > 5) pp = 5 - total;
          if (pp < 0) pp = 0;
          let sh = 8 - 2 * total - pp;
          if (total + pp === 5 && !h) sh += 1;
          if (sh < best) best = sh;
        }
      }
    }
    return best;
  }
  function chiitoiShanten(t) {
    let pairs = 0, kinds = 0;
    for (let i = 0; i < 34; i++) {
      if (t[i] > 0) kinds++;
      if (t[i] >= 2) pairs++;
    }
    let sh = 6 - pairs;
    if (kinds < 7) sh += 7 - kinds;
    return sh;
  }
  function kokushiShanten(t) {
    let kinds = 0, hasPair = 0;
    for (const i of YAOCHU) {
      if (t[i] > 0) kinds++;
      if (t[i] >= 2) hasPair = 1;
    }
    return 13 - kinds - hasPair;
  }
  function shantenOfCounts(counts, meldCount = 0) {
    let sh = stdShanten(counts, meldCount);
    if (meldCount === 0) {
      const c = chiitoiShanten(counts);
      if (c < sh) sh = c;
      const k = kokushiShanten(counts);
      if (k < sh) sh = k;
    }
    return sh;
  }
  function waitsOfCounts(counts, meldCount = 0, remainOf = null) {
    const base2 = shantenOfCounts(counts, meldCount);
    const waits = [];
    let ukeire = 0;
    for (let i = 0; i < 34; i++) {
      if (counts[i] >= 4) continue;
      counts[i]++;
      const sh = shantenOfCounts(counts, meldCount);
      counts[i]--;
      if (sh < base2) {
        waits.push(i);
        ukeire += remainOf ? Math.max(0, remainOf(i)) : 4 - counts[i];
      }
    }
    return { shanten: base2, waits, ukeire };
  }
  function discardOptionsOfCounts(counts, meldCount = 0, remainOf = null) {
    let bestSh = 99;
    const raw = [];
    for (let i = 0; i < 34; i++) {
      if (counts[i] === 0) continue;
      counts[i]--;
      const sh = shantenOfCounts(counts, meldCount);
      counts[i]++;
      raw.push({ idx: i, shanten: sh });
      if (sh < bestSh) bestSh = sh;
    }
    const options = [];
    for (const r of raw) {
      if (r.shanten !== bestSh) continue;
      counts[r.idx]--;
      const w = waitsOfCounts(counts, meldCount, remainOf);
      counts[r.idx]++;
      options.push({ idx: r.idx, waits: w.waits, ukeire: w.ukeire });
    }
    return { shanten: bestSh, options };
  }

  // mockjs/ai.mjs
  var import_riichi = __toESM(require_riichi(), 1);
  var SUIT_CHAR2 = { 1: "m", 2: "p", 3: "s", 4: "z" };
  var kindOf = (id) => {
    const d = decodeId(id);
    return d.suit * 10 + d.rank;
  };
  var kindOfIndex = (idx) => kindOf(indexToTileId(idx));
  function tileDigit(id, akaSet) {
    const { suit, rank } = decodeId(id);
    if (akaSet && akaSet.has(id) && suit !== 4 && rank === 5) return "0";
    return String(rank);
  }
  function concealedStr(ids, akaSet) {
    return ids.map((id) => tileDigit(id, akaSet) + SUIT_CHAR2[decodeId(id).suit]).join("");
  }
  function realMelds(melds) {
    return (melds || []).filter((m) => m.type !== "babei");
  }
  function furoGroupStr(meld, akaSet) {
    const suit = decodeId(meld.tiles[0]).suit;
    const tiles = meld.type === "ankan" ? [...meld.tiles].sort((a, b) => Number(akaSet?.has(b) || false) - Number(akaSet?.has(a) || false)).slice(0, 2) : meld.tiles;
    return tiles.map((id) => tileDigit(id, akaSet)).join("") + SUIT_CHAR2[suit];
  }
  function furoStr(melds, akaSet) {
    return realMelds(melds).map((m) => furoGroupStr(m, akaSet)).join("+");
  }
  function handStr(concealedIds, melds, akaSet, opts = {}) {
    let s = concealedStr(concealedIds, akaSet);
    if (opts.ronTile != null) s += "+" + toRiichi(opts.ronTile, akaSet && akaSet.has(opts.ronTile));
    const fs = furoStr(melds, akaSet);
    if (fs) s += "+" + fs;
    let ex = "";
    if (opts.doubleRiichi) ex += "w";
    else if (opts.riichi) ex += "r";
    if (opts.ippatsu) ex += "i";
    if (opts.rinshan || opts.chankan) ex += "k";
    if (opts.haidi && !opts.rinshan && !opts.chankan) ex += "h";
    if (opts.tenho) ex += "t";
    ex += "" + (opts.roundWind || 1) + (opts.seatWind || 1);
    s += "+" + ex;
    if (opts.doraTiles && opts.doraTiles.length) {
      s += "+d" + opts.doraTiles.map((id) => toRiichi(id, false)).join("");
    }
    return s;
  }
  function calcWin(concealedIds, melds, akaSet, opts = {}) {
    const all = concealedIds.concat(opts.ronTile != null ? [opts.ronTile] : []);
    if (shantenOfCounts(countsOf(all), realMelds(melds).length) !== -1) {
      return { isAgari: false, hasYaku: false, han: 0, fu: 0, ten: 0, yakuman: 0, yaku: {}, name: "", oya: [0], ko: [0] };
    }
    const str = handStr(concealedIds, melds, akaSet, opts);
    let res;
    try {
      const calculator = new import_riichi.default(str.toLowerCase());
      if (opts.rinshan && opts.ronTile == null) {
        const calcYaku = calculator.calcYaku;
        calculator.calcYaku = function() {
          calcYaku.call(this);
          const result = this.tmpResult;
          if (!result.yakuman && !result.yaku["\u5DBA\u4E0A\u958B\u82B1"]) {
            result.yaku["\u5DBA\u4E0A\u958B\u82B1"] = "1\u98DC";
            result.han += 1;
          }
        };
      }
      res = calculator.calc();
    } catch (e) {
      return { isAgari: false, hasYaku: false, han: 0, fu: 0, ten: 0, yakuman: 0, yaku: {}, name: "", oya: [0], ko: [0], error: true };
    }
    const han = res.han || 0;
    const yakuman = res.yakuman || 0;
    return {
      str,
      isAgari: !!res.isAgari && !res.error,
      hasYaku: !!res.isAgari && (han > 0 || yakuman > 0),
      han,
      fu: res.fu || 0,
      ten: res.ten || 0,
      yakuman,
      yaku: res.yaku || {},
      name: res.name || "",
      oya: res.oya || [0, 0, 0],
      ko: res.ko || [0, 0, 0],
      error: !!res.error
    };
  }
  function handShanten(concealedIds, melds) {
    return shantenOfCounts(countsOf(concealedIds), realMelds(melds).length);
  }
  function handWaits(concealedIds, melds, remainOf = null) {
    const r = waitsOfCounts(countsOf(concealedIds), realMelds(melds).length, remainOf);
    return {
      shanten: r.shanten,
      waits: r.waits.map((i) => indexToTileId(i)),
      waitKinds: r.waits.map(kindOfIndex),
      ukeire: r.ukeire
    };
  }
  function chooseDiscard(concealedIds, melds, opts = {}) {
    const {
      drawnTile = null,
      doraKinds = null,
      akaSet = null,
      dangerKinds = null,
      dangerWeight = 1,
      forced = null,
      forbiddenKinds = null,
      remainOf = null,
      maxShantenLoss = 0,
      shantenLossPenalty = 240,
      ukeireWeight = 12
    } = opts;
    const meldCount = realMelds(melds).length;
    const counts = countsOf(concealedIds);
    if (forced != null && concealedIds.includes(forced) && !forbiddenKinds?.has(kindOf(forced))) {
      const c2 = counts.slice();
      c2[tileIndex(forced)]--;
      const w = waitsOfCounts(c2, meldCount, remainOf);
      return {
        discardId: forced,
        shanten: w.shanten,
        ukeire: w.ukeire,
        waits: w.waits.map((i) => indexToTileId(i)),
        score: 0
      };
    }
    const legalOptions = [];
    for (let idx = 0; idx < counts.length; idx++) {
      if (counts[idx] === 0) continue;
      const id = pickIdFromHand(concealedIds, idx, akaSet);
      if (id == null || forbiddenKinds?.has(kindOf(id))) continue;
      counts[idx]--;
      const shanten = shantenOfCounts(counts, meldCount);
      counts[idx]++;
      legalOptions.push({ idx, shanten });
    }
    if (!legalOptions.length) throw new Error("\u6CA1\u6709\u5408\u6CD5\u7684\u53EF\u6253\u724C");
    const bestShanten = Math.min(...legalOptions.map((option) => option.shanten));
    const options = legalOptions.filter((option) => option.shanten <= bestShanten + maxShantenLoss);
    let best = null;
    for (const option of options) {
      const id = pickIdFromHand(concealedIds, option.idx, akaSet);
      if (id == null || forbiddenKinds?.has(kindOf(id))) continue;
      counts[option.idx]--;
      const waits = waitsOfCounts(counts, meldCount, remainOf);
      counts[option.idx]++;
      option.waits = waits.waits;
      option.ukeire = waits.ukeire;
      const secondary = discardSecondaryScore(id, concealedIds, {
        drawnTile,
        doraKinds,
        akaSet,
        dangerKinds,
        dangerWeight
      });
      const totalScore = option.ukeire * ukeireWeight - (option.shanten - bestShanten) * shantenLossPenalty + secondary;
      const candidate = {
        discardId: id,
        shanten: option.shanten,
        ukeire: option.ukeire,
        score: totalScore,
        waits: option.waits.map((i) => indexToTileId(i))
      };
      if (!best || candidate.score > best.score || candidate.score === best.score && candidate.discardId < best.discardId) best = candidate;
    }
    if (!best) {
      const allowed = concealedIds.filter((id2) => !forbiddenKinds?.has(kindOf(id2)));
      const id = drawnTile != null && allowed.includes(drawnTile) ? drawnTile : allowed[allowed.length - 1];
      if (id == null) throw new Error("\u6CA1\u6709\u5408\u6CD5\u7684\u53EF\u6253\u724C");
      return { discardId: id, shanten: bestShanten, ukeire: 0, score: 0, waits: [] };
    }
    return best;
  }
  function pickIdFromHand(handIds, idx, akaSet) {
    let plain = null, any = null;
    for (const id of handIds) {
      if (tileIndex(id) !== idx) continue;
      any = any == null ? id : any;
      if (!(akaSet && akaSet.has(id))) {
        plain = id;
        break;
      }
    }
    return plain != null ? plain : any;
  }
  function discardSecondaryScore(tile, handIds, { drawnTile, doraKinds, akaSet, dangerKinds, dangerWeight = 1 }) {
    let s = 0;
    const { suit, rank } = decodeId(tile);
    const kind = suit * 10 + rank;
    if (doraKinds && doraKinds.has(kind)) s -= 100;
    if (akaSet && akaSet.has(tile)) s -= 120;
    const cnt = handIds.filter((x) => kindOf(x) === kind).length;
    if (suit === 4 && cnt === 1) s += 30;
    if (suit !== 4 && (rank === 1 || rank === 9) && cnt === 1) s += 15;
    if (suit !== 4 && (rank === 2 || rank === 8) && cnt === 1) s += 5;
    if (drawnTile != null && tile === drawnTile) s += 10;
    if (dangerKinds) {
      const risk = dangerKinds.riskByKind?.get(kind);
      if (Number.isFinite(risk)) s -= risk * dangerWeight;
      else {
        if (dangerKinds.safe?.has(kind)) s += 60;
        if (dangerKinds.risky?.has(kind)) s -= 80;
      }
    }
    return s;
  }

  // mockjs/proto_enum.mjs
  var Result = {
    Succ: 0,
    Fail_InternalError: 1,
    Fail_InvalidParam: 2,
    Fail_InvalidSequence: 3,
    Fail_ActionNotInCanPlayActions: 101,
    Fail_CardInCantPlays: 102,
    Fail_RiichiPlayCardWrong: 103,
    Fail_CardNotInHand: 104,
    Fail_CardNotMatchAction: 105,
    Fail_ActionNotInCanQiangActions: 201,
    Fail_InvalidOtherCards: 202
  };
  var RiichiMsg = {
    ENone: 0,
    EReqPrepare: 1,
    ERspPrepare: 2,
    EReqPlayCard: 3,
    ERspPlayCard: 4,
    EReqQiangCard: 5,
    ERspQiangCard: 6,
    EReqSetInternalState: 7,
    ERspSetInternalState: 8,
    EReqCloseOfflineTip: 9,
    ERspCloseOfflineTip: 10,
    EReqClickUI: 11,
    ERspClickUI: 12,
    ENtfToPrepare: 1001,
    ENtfPrepare: 1002,
    ENtfGameStart: 1003,
    ENtfSendCard: 1004,
    ENtfPlayCard: 1005,
    ENtfQiangCard: 1006,
    ENtfQiangCardEnd: 1007,
    ENtfGameStop: 1008,
    ENtfOfflineTip: 1009
  };
  var PlayAction = {
    Normal: 0,
    Guo: 1,
    Chi: 2,
    Peng: 3,
    MingGang: 4,
    PengGang: 5,
    AnGang: 6,
    Riichi: 7,
    Hu: 8,
    JiuZhongJiuLiuJu: 9,
    BaBei: 10
  };
  var ManType = {
    NoMan: 0,
    ManGuan: 1,
    TiaoMan: 2,
    BeiMan: 3,
    SanBeiMan: 4,
    YiMan: 5
  };
  var YiType = {
    NoYi: 0,
    RedBao: 101,
    Bao: 102,
    LiBao: 103,
    BaBeiBao: 104,
    LiZhi: 1101,
    YiFa: 1102,
    MengQianQingZiMoHu: 1103,
    PingHu: 1104,
    YiBeiKou: 1105,
    DuanYaoJiu: 1301,
    YiPaiZiFeng: 1302,
    YiPaiChangFeng: 1303,
    YiPaiSanYuanBai: 1304,
    YiPaiSanYuanFa: 1305,
    YiPaiSanYuanZhong: 1306,
    LingShangKaiHua: 1307,
    HaiDiLaoYue: 1308,
    HeDiMoYu: 1309,
    QiangGang: 1310,
    YiPaiBeiFeng: 1311,
    ShuangLiZi: 2101,
    QiDuiZi: 2102,
    HunQuanDaiYaoJiu: 2201,
    YiQiTongGuan: 2202,
    SanSeTongShun: 2203,
    SanSeTongKe: 2301,
    SanAnKe: 2302,
    SanGangZi: 2303,
    DuiDuiHu: 2304,
    HunLaoTou: 2305,
    XiaoSanYuan: 2306,
    ErBeiKou: 3101,
    ChunQuanDaiYaoJiu: 3201,
    HunYiSe: 3202,
    LiuJuManGuan: 5301,
    QingYiSe: 6201,
    TianHu: 91101,
    DiHu: 91102,
    GuoShiWuShuang: 91103,
    JiuLianBaoDeng: 91104,
    SiAnKe: 91105,
    SiGangZi: 91301,
    QingLaoTou: 91302,
    ZiYiSe: 91303,
    XiaoSiXi: 91304,
    DaSanYuan: 91305,
    LvYiSe: 91306,
    GuoShiWuShuangShiSanMian: 92101,
    ChunZhengJiuLianBaoDeng: 92102,
    SiAnKeDanQi: 92103,
    DaSiXi: 92301
  };
  var LiuJuType = {
    HuangPai: 0,
    SiFengLianDa: 1,
    SiGang: 2,
    JiuZhongJiuPai: 3,
    SiJiaLiZhi: 4
  };

  // mockjs/yaku_map.mjs
  var DIRECT = {
    "\u7ACB\u76F4": YiType.LiZhi,
    "\u30C0\u30D6\u30EB\u7ACB\u76F4": YiType.ShuangLiZi,
    // 2101 双立直
    "\u4E00\u767A": YiType.YiFa,
    "\u9580\u524D\u6E05\u81EA\u6478\u548C": YiType.MengQianQingZiMoHu,
    "\u5E73\u548C": YiType.PingHu,
    "\u4E00\u76C3\u53E3": YiType.YiBeiKou,
    "\u4E8C\u76C3\u53E3": YiType.ErBeiKou,
    // 3101
    "\u65AD\u4E48\u4E5D": YiType.DuanYaoJiu,
    "\u5F79\u724C\u767D": YiType.YiPaiSanYuanBai,
    "\u5F79\u724C\u767A": YiType.YiPaiSanYuanFa,
    "\u5F79\u724C\u4E2D": YiType.YiPaiSanYuanZhong,
    "\u4E00\u6C17\u901A\u8CAB": YiType.YiQiTongGuan,
    "\u4E09\u8272\u540C\u9806": YiType.SanSeTongShun,
    "\u4E09\u8272\u540C\u523B": YiType.SanSeTongKe,
    "\u4E09\u6697\u523B": YiType.SanAnKe,
    "\u4E09\u69D3\u5B50": YiType.SanGangZi,
    "\u5BFE\u3005\u548C": YiType.DuiDuiHu,
    "\u6DF7\u8001\u982D": YiType.HunLaoTou,
    "\u5C0F\u4E09\u5143": YiType.XiaoSanYuan,
    "\u7D14\u5168\u5E2F\u4E48\u4E5D": YiType.ChunQuanDaiYaoJiu,
    "\u6DF7\u5168\u5E2F\u4E48\u4E5D": YiType.HunQuanDaiYaoJiu,
    "\u6DF7\u4E00\u8272": YiType.HunYiSe,
    "\u6E05\u4E00\u8272": YiType.QingYiSe,
    "\u4E03\u5BFE\u5B50": YiType.QiDuiZi,
    "\u5DBA\u4E0A\u958B\u82B1": YiType.LingShangKaiHua,
    "\u6436\u69D3": YiType.QiangGang,
    "\u6D77\u5E95\u6478\u6708": YiType.HaiDiLaoYue,
    "\u6CB3\u5E95\u6488\u9B5A": YiType.HeDiMoYu,
    "\u56FD\u58EB\u7121\u53CC": YiType.GuoShiWuShuang,
    "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762\u5F85\u3061": YiType.GuoShiWuShuangShiSanMian,
    "\u4E5D\u84EE\u5B9D\u71C8": YiType.JiuLianBaoDeng,
    "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8": YiType.ChunZhengJiuLianBaoDeng,
    "\u56DB\u6697\u523B": YiType.SiAnKe,
    "\u56DB\u6697\u523B\u5358\u9A0E\u5F85\u3061": YiType.SiAnKeDanQi,
    "\u5927\u56DB\u559C": YiType.DaSiXi,
    "\u5C0F\u56DB\u559C": YiType.XiaoSiXi,
    "\u5927\u4E09\u5143": YiType.DaSanYuan,
    "\u5B57\u4E00\u8272": YiType.ZiYiSe,
    "\u7DD1\u4E00\u8272": YiType.LvYiSe,
    "\u6E05\u8001\u982D": YiType.QingLaoTou,
    "\u56DB\u69D3\u5B50": YiType.SiGangZi,
    "\u5929\u548C": YiType.TianHu,
    "\u5730\u548C": YiType.DiHu,
    "\u30C9\u30E9": YiType.Bao,
    // 宝（表宝牌）
    "\u8D64\u30C9\u30E9": YiType.RedBao
    // 赤宝（赤5 dora）
  };
  function windYiType(key, roundWind, seatWind) {
    const m = key.match(/^(場風|自風)([東南西北])$/);
    if (!m) return null;
    const kind = m[1];
    const wind = m[2];
    if (kind === "\u5834\u98A8") return YiType.YiPaiChangFeng;
    if (wind === "\u5317") return YiType.YiPaiBeiFeng;
    return YiType.YiPaiZiFeng;
  }
  function parseFan(val) {
    if (typeof val === "string") {
      if (val.includes("\u5F79\u6E80")) {
        return val.includes("\u30C0\u30D6\u30EB") ? 26 : 13;
      }
      const n = parseInt(val, 10);
      return isNaN(n) ? 0 : n;
    }
    return typeof val === "number" ? val : 0;
  }
  function mapYaku(yakuObj, { roundWind = 1, seatWind = 1 } = {}) {
    const yiFans = [];
    let isYiMan = false;
    let baoFan = 0, liBaoFan = 0, redBaoFan = 0;
    for (const [key, val] of Object.entries(yakuObj)) {
      let yiType = DIRECT[key];
      if (yiType === void 0) yiType = windYiType(key, roundWind, seatWind);
      if (yiType === void 0 || yiType === null) continue;
      const fan = parseFan(val);
      const ym = typeof val === "string" && val.includes("\u5F79\u6E80");
      if (ym) isYiMan = true;
      yiFans.push({ yiType, fan, isYiMan: ym, isFuLuMinus: false });
      if (key === "\u30C9\u30E9") baoFan += fan;
      else if (key === "\u8D64\u30C9\u30E9") redBaoFan += fan;
    }
    return { yiFans, isYiMan, baoFan, liBaoFan, redBaoFan };
  }
  function manTypeFromResult({ han, fu = 0, yakuman, name }) {
    if (yakuman > 0 || /役満/.test(name || "")) return ManType.YiMan;
    if (han >= 13) return ManType.YiMan;
    if (han >= 11) return ManType.SanBeiMan;
    if (han >= 8) return ManType.BeiMan;
    if (han >= 6) return ManType.TiaoMan;
    if (han >= 5) return ManType.ManGuan;
    if (han === 4 && fu >= 40 || han === 3 && fu >= 70) return ManType.ManGuan;
    return ManType.NoMan;
  }

  // mockjs/engine.mjs
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  var kindOf2 = (id) => {
    const d = decodeId(id);
    return d.suit * 10 + d.rank;
  };
  var GameEngine = class {
    constructor(opts = {}) {
      const {
        players = 4,
        akaCount = 1,
        startScore = 25e3,
        emit: emit2,
        seed
      } = opts;
      this.playersN = players;
      this.sanma = players === 3;
      this.akaCount = akaCount;
      this.startScore = startScore;
      this.emit = emit2 || (() => {
      });
      this.autoHuman = !!opts.autoHuman;
      this.speed = opts.speed != null ? opts.speed : 1;
      this.baseTime = opts.baseTime != null ? opts.baseTime : 5;
      this.extraTime = opts.extraTime != null ? opts.extraTime : 20;
      this.internalState = { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false };
      this.setInternalState(opts.internalState || {});
      this.seed = seed != null ? Number(seed) >>> 0 : null;
      this.rng = this.seed != null ? mulberry32(this.seed) : Math.random;
      this.handIndex = 0;
      this.juNum = 0;
      this.matchLength = opts.matchLength === "hanchan" ? "hanchan" : "east";
      this.regularWinds = this.matchLength === "hanchan" ? 2 : 1;
      this.maxHands = opts.maxHands != null ? opts.maxHands : this.matchLength === "hanchan" ? 64 : 32;
      this.roundWind = 1;
      this.honba = 0;
      this.renchanCount = 0;
      this.riichiSticks = 0;
      this.dealerSeat = 0;
      this.scores = null;
      this.xunNum = 0;
      this._pending = null;
      this._processing = false;
      this._expectedDraw = null;
      this._expectedClaim = null;
      this._nextCantPlays = null;
      this._bufferedDraw = null;
      this._bufferedClaim = null;
      this._prepareWaiter = null;
      this._prepared = false;
      this.matchOver = false;
      this.finished = false;
      this.onFinish = opts.onFinish || null;
      this.onFinalResult = opts.onFinalResult || null;
      this._finalResult = null;
      this.matchStats = { hands: 0, wins: 0, dealIns: 0, riichi: 0, calls: 0, tsumo: 0, ron: 0, winPoints: 0, winTurns: 0, maxRenchan: 0 };
      this.uids = opts.uids && opts.uids.length >= players ? opts.uids.slice(0, players) : Array.from({ length: players }, (_, s) => 1e4 + s);
    }
    uidOf(seat) {
      return this.uids[seat];
    }
    /** 客户端上行 ReqPrepare：解开 runHand 里的等待 */
    submitPrepare() {
      this._prepared = true;
      const w = this._prepareWaiter;
      this._prepareWaiter = null;
      if (w) w();
    }
    /** 等客户端点「准备」。抓包规律（dongfeng1 完整包）：
     *  局间（含连庄，isFinal=false）服务器先发 NtfToPrepare/NtfPrepare(机器人)，客户端发
     *  ReqPrepare，服务器再发 NtfPrepare(自己)/NtfGameStart —— 每局等一次 ReqPrepare。
     *  终局（isFinal=true）后引擎直接停，不存在“续场再等一次 ReqPrepare”的两段式握手；
     *  新一场是重新匹配出的新房间、新引擎（见 finishHand）。
     *  autoHuman（自测无客户端）直接跳过；真人模式留一个兜底超时防止卡死。 */
    waitPrepare(timeoutMs = 15e3) {
      if (this.autoHuman) return Promise.resolve();
      if (this._prepared) {
        this._prepared = false;
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        let done = false;
        const fin = () => {
          if (done) return;
          done = true;
          this._prepared = false;
          resolve();
        };
        this._prepareWaiter = fin;
        setTimeout(() => {
          if (done) return;
          this.log && this.log("[riichi] \u7B49 ReqPrepare \u8D85\u65F6\uFF0C\u81EA\u884C\u5F00\u5C40");
          fin();
        }, timeoutMs);
      });
    }
    _d(ms) {
      return this.speed > 0 ? sleep(ms * this.speed) : Promise.resolve();
    }
    // 各阶段延迟（毫秒，乘以 speed）
    get T() {
      return { think: 550, claim: 350, step: 250, hand: 2500 };
    }
    // ================= 入口 =================
    async start() {
      await this._d(400);
      while (!this.finished) {
        await this.runHand();
      }
      if (this.onFinish) this.onFinish(this.scores);
    }
    // ================= 一局 =================
    async runHand() {
      this.handEnded = false;
      this._expectedDraw = null;
      this._expectedClaim = null;
      this._nextCantPlays = null;
      this.xunNum = 0;
      this.kanCount = 0;
      this.firstGoAround = true;
      this.lastDiscard = null;
      const { tiles, akaSet } = buildWall({ sanma: this.sanma, akaCount: this.akaCount });
      this.akaSet = akaSet;
      const wall = shuffle(tiles, this.rng);
      const deadLen = this.sanma ? 18 : 14;
      const dead = wall.splice(wall.length - deadLen, deadLen);
      this.deadWall = dead;
      const rinLen = this.sanma ? 8 : 4;
      this.replacements = dead.slice(0, rinLen);
      const baoBase = this.sanma ? 8 : 4;
      this.doraIndicators = [dead[baoBase]];
      this.uraIndicators = [dead[baoBase + 1]];
      this._pendingBaoPreCard = 0;
      this._deferredKanDora = 0;
      this.wall = wall;
      this.remain = wall.length;
      const players = [];
      for (let s = 0; s < this.playersN; s++) {
        const score2 = this.scores ? this.scores[s] : this.startScore;
        players.push({
          seat: s,
          isHuman: s === 0,
          score: score2,
          scoreAtStart: score2,
          timeBank: s === 0 ? this.extraTime : 0,
          hand: wall.splice(0, 13).sort((a, b) => a - b),
          melds: [],
          discards: [],
          discardClaimed: false,
          discardKinds: /* @__PURE__ */ new Set(),
          riichi: false,
          doubleRiichi: false,
          riichiTurn: -1,
          riichiPending: false,
          ippatsu: false,
          menzen: true,
          waits: [],
          tempFuriten: false,
          riichiFuriten: false,
          pao: {},
          drawnTile: null,
          rinshan: false
        });
      }
      this.players = players;
      for (const p of players) this.updateWaits(p);
      const emptyInfos = players.map(() => ({}));
      this.emit(RiichiMsg.ENtfToPrepare, {
        userInfos: players.map((p) => ({ seat: p.seat, userID: this.uidOf(p.seat) }))
      });
      for (let s = 1; s < this.playersN; s++) {
        this.emit(RiichiMsg.ENtfPrepare, { seat: s, userInfos: emptyInfos });
      }
      await this.waitPrepare();
      if (this.finished) return;
      this.emit(RiichiMsg.ENtfPrepare, { seat: 0, userInfos: emptyInfos });
      await this._d(this.T.step);
      const dealer = players[this.dealerSeat];
      const firstTile = this.wall.shift();
      this.remain = this.wall.length;
      dealer.hand.push(firstTile);
      dealer.drawnTile = firstTile;
      dealer.rinshan = false;
      this.xunNum = 1;
      const dealerActions = this.turnActions(this.dealerSeat, true);
      this.expectDraw(this.dealerSeat, true, dealerActions, []);
      this.emit(RiichiMsg.ENtfGameStart, {
        changWind: this.roundWind - 1,
        juNum: this.juNum + 1,
        // 实机是 1 基（东1=1），内部保持 0 基
        benChangNum: this.honba,
        zhuangSeat: this.dealerSeat,
        baoPreCard: this.doraIndicators[0],
        remainDuiCardNum: this.remain,
        userInfos: players.map((p) => {
          const own = p.isHuman || this.autoHuman;
          const isDealer = p.seat === this.dealerSeat;
          return {
            seat: p.seat,
            score: p.score,
            initScore: this.startScore,
            handCards: own ? p.hand.slice() : [],
            tingInfos: [],
            canPlayActions: own && isDealer ? dealerActions : [],
            xunNum: isDealer ? 1 : 0
          };
        }),
        leftTimer: this.extraTime,
        defaultMinTimeout: this.baseTime,
        riichiBangNum: this.riichiSticks,
        isAllLast: this.isAllLast(),
        gameID: "mock-" + Date.now() + "-" + this.handIndex,
        duiCardsStrEncode: "",
        duiCardsStrSaltEncode: "",
        ServerRedundantTimeOut: 3,
        FirstGameStartRedundantTimeOut: 8
      });
      await this._d(this.T.step);
      await this.awaitTurn(this.dealerSeat, true, true);
    }
    nextSeat(s) {
      return (s + 1) % this.playersN;
    }
    seatWindOf(seat) {
      return ((seat - this.dealerSeat) % this.playersN + this.playersN) % this.playersN + 1;
    }
    isAllLast() {
      return this.roundWind > this.regularWinds || this.roundWind === this.regularWinds && this.juNum === this.playersN - 1;
    }
    // ================= 摸牌 =================
    async turnDraw(seat) {
      if (this.handEnded) return;
      if (this.remain <= 0) {
        await this.exhaustiveDraw();
        return;
      }
      const p = this.players[seat];
      p.tempFuriten = false;
      const tile = this.wall.shift();
      this.remain = this.wall.length;
      p.hand.push(tile);
      p.drawnTile = tile;
      p.rinshan = false;
      this.xunNum++;
      await this.awaitTurn(seat, true);
    }
    // 岭上摸牌（杠后）
    async drawReplacement(seat) {
      const p = this.players[seat];
      p.tempFuriten = false;
      if (!this.replacements.length || this.remain <= 0) {
        await this.exhaustiveDraw();
        return false;
      }
      const tile = this.replacements.pop();
      this.wall.pop();
      this.remain = this.wall.length;
      p.hand.push(tile);
      p.drawnTile = tile;
      p.rinshan = true;
      this.xunNum++;
      return true;
    }
    async doBaBei(seat, tile) {
      const p = this.players[seat];
      const canQiang = this.players.map((player) => {
        if (player.seat === seat || !this.canRon(player, tile)) return [];
        return [PlayAction.Hu, PlayAction.Guo];
      });
      this.expectClaim(0, seat, tile, canQiang[0] || []);
      this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, tile, PlayAction.BaBei, false, canQiang));
      await this._d(this.T.claim);
      if (await this.resolveKanRob(seat, tile, canQiang, {})) return;
      p.hand.splice(p.hand.indexOf(tile), 1);
      p.melds.push({ type: "babei", tiles: [tile] });
      for (const player of this.players) player.ippatsu = false;
      this.firstGoAround = false;
      if (!await this.drawReplacement(seat)) return;
      await this.awaitTurn(seat, true);
    }
    expectDraw(seat, drew, actions2, cantPlays = []) {
      if (this.autoHuman || !this.players[seat]?.isHuman) {
        this._expectedDraw = null;
        return;
      }
      this._processing = false;
      this._expectedDraw = { seat, drew, actions: actions2.slice(), cantPlays: cantPlays.slice() };
    }
    validateTurnPayload(payload, expected = this._expectedDraw) {
      if (!expected || !this.players?.[expected.seat]) return Result.Fail_InvalidSequence;
      const p = this.players[expected.seat];
      const action2 = Number(payload?.action);
      const card = Number(payload?.card);
      if (!Number.isInteger(action2)) return Result.Fail_InvalidParam;
      if (!expected.actions.includes(action2)) return Result.Fail_ActionNotInCanPlayActions;
      if (action2 === PlayAction.Hu || action2 === PlayAction.JiuZhongJiuLiuJu) return Result.Succ;
      if (!Number.isInteger(card) || !p.hand.includes(card)) return Result.Fail_CardNotInHand;
      if (expected.cantPlays.includes(kindOf2(card) * 10)) return Result.Fail_CardInCantPlays;
      if (action2 === PlayAction.Riichi) {
        const hand = p.hand.slice();
        hand.splice(hand.indexOf(card), 1);
        if (!this.isFormalTenpaiHand(hand, p.melds)) return Result.Fail_RiichiPlayCardWrong;
      }
      if (action2 === PlayAction.AnGang) {
        const allowed = this.concealedQuadTiles(p).some((tile) => kindOf2(tile) === kindOf2(card));
        if (!allowed) return Result.Fail_CardNotMatchAction;
      }
      if (action2 === PlayAction.PengGang) {
        const matchesPon = p.melds.some((meld) => meld.type === "pon" && kindOf2(meld.tiles[0]) === kindOf2(card));
        if (!matchesPon) return Result.Fail_CardNotMatchAction;
      }
      if (action2 === PlayAction.BaBei) {
        const { suit, rank } = decodeId(card);
        if (suit !== 4 || rank !== 4 || p.riichi && card !== p.drawnTile) return Result.Fail_CardNotMatchAction;
      }
      if (action2 === PlayAction.Normal && p.riichi && p.riichiTurn !== this.xunNum && card !== p.drawnTile) {
        return Result.Fail_CardNotMatchAction;
      }
      return Result.Succ;
    }
    expectClaim(seat, discarderSeat, card, actions2) {
      if (this.autoHuman || !this.players[seat]?.isHuman || !actions2?.length) {
        this._expectedClaim = null;
        return;
      }
      this._processing = false;
      this._expectedClaim = { seat, discarderSeat, card, actions: actions2.slice() };
    }
    validateClaimPayload(payload, expected = this._expectedClaim) {
      if (!expected || !this.players?.[expected.seat]) return Result.Fail_InvalidSequence;
      const action2 = Number(payload?.action);
      if (!Number.isInteger(action2)) return Result.Fail_InvalidParam;
      if (!expected.actions.includes(action2)) return Result.Fail_ActionNotInCanQiangActions;
      if (action2 === PlayAction.Guo || action2 === PlayAction.Hu) return Result.Succ;
      const p = this.players[expected.seat];
      const otherCards = Array.isArray(payload?.otherCards) ? payload.otherCards.map(Number) : [];
      const needed = action2 === PlayAction.MingGang ? 3 : 2;
      if (otherCards.length !== needed || new Set(otherCards).size !== otherCards.length || otherCards.some((tile) => !p.hand.includes(tile))) {
        return Result.Fail_InvalidOtherCards;
      }
      const claimedKind = kindOf2(expected.card);
      if (action2 === PlayAction.Peng || action2 === PlayAction.MingGang) {
        return otherCards.every((tile) => kindOf2(tile) === claimedKind) ? Result.Succ : Result.Fail_InvalidOtherCards;
      }
      if (action2 === PlayAction.Chi) {
        if (this.sanma || expected.seat !== this.nextSeat(expected.discarderSeat)) return Result.Fail_InvalidOtherCards;
        const all = [...otherCards, expected.card].map(decodeId);
        if (all.some((tile) => tile.suit === 4 || tile.suit !== all[0].suit)) return Result.Fail_InvalidOtherCards;
        const ranks = all.map((tile) => tile.rank).sort((a, b) => a - b);
        const isSequence = ranks[0] + 1 === ranks[1] && ranks[1] + 1 === ranks[2];
        return isSequence && this.canDiscardAfterClaim(p, action2, expected.card, otherCards) ? Result.Succ : Result.Fail_InvalidOtherCards;
      }
      return Result.Fail_ActionNotInCanQiangActions;
    }
    // ================= 轮到某家行动（手上 14 张） =================
    async awaitTurn(seat, drew, skipNotify) {
      if (this.handEnded) return;
      const p = this.players[seat];
      if (drew && this.isAiSeat(p) && this.canJiuZhongJiuPai(p)) {
        await this.abortiveDraw(LiuJuType.JiuZhongJiuPai, seat);
        return;
      }
      const can = this.turnActions(seat, drew);
      const cantPlays = this._nextCantPlays?.seat === seat ? this._nextCantPlays.values : [];
      this._nextCantPlays = null;
      if (!this._expectedDraw && this._bufferedDraw == null) this.expectDraw(seat, drew, can, cantPlays);
      if (drew && !skipNotify) {
        const newBao = this._pendingBaoPreCard || 0;
        this._pendingBaoPreCard = 0;
        this.emit(RiichiMsg.ENtfSendCard, {
          seat,
          baoPreCard: newBao,
          userInfos: this.players.map((q) => ({
            seat: q.seat,
            card: q.seat === seat && (q.isHuman || this.autoHuman) ? p.drawnTile : 0,
            tingInfos: q.seat === seat ? this.buildTingInfos(p) : [],
            canPlayActions: q.seat === seat ? can : [],
            leftTimer: q.isHuman ? Math.ceil(q.timeBank) : 0,
            isZhenTing: this.isFuriten(q),
            xunNum: this.xunNum,
            zhenTingTypes: this.furitenTypes(q)
          }))
        });
        await this._d(this.T.think);
      }
      let action2, card;
      const useHumanInput = !this.isAiSeat(p) || this._bufferedDraw != null;
      if (useHumanInput) {
        if (!this._expectedDraw && this._bufferedDraw == null) this.expectDraw(seat, drew, can, cantPlays);
        this._processing = false;
        const payload = await this.waitHuman("draw");
        action2 = payload.action != null ? payload.action : PlayAction.Normal;
        card = payload.card != null ? payload.card : p.drawnTile;
      } else {
        this._expectedDraw = null;
        const d = this.aiTurn(seat, drew, can, cantPlays);
        action2 = d.action;
        card = d.card;
        await this._d(this.T.think);
      }
      const result = await this.processTurnAction(seat, action2, card, drew, cantPlays);
      if (result !== Result.Succ) throw new Error(`\u975E\u6CD5\u5185\u90E8\u52A8\u4F5C seat=${seat} action=${action2} result=${result}`);
    }
    // 手牌 14 张时的可选动作
    turnActions(seat, drew) {
      const p = this.players[seat];
      const acts = [PlayAction.Normal];
      if (drew && this.canTsumo(p)) acts.push(PlayAction.Hu);
      if (drew && !p.riichi && p.menzen && this.canRiichi(p)) acts.push(PlayAction.Riichi);
      if (drew && this.kanCount < 4 && this.remain > 1) {
        if (this.concealedQuadTile(p) != null) acts.push(PlayAction.AnGang);
        if (!p.riichi && this.addedKanTile(p) != null) acts.push(PlayAction.PengGang);
      }
      if (drew && !this.isAiSeat(p) && this.canJiuZhongJiuPai(p)) acts.push(PlayAction.JiuZhongJiuLiuJu);
      if (drew && this.sanma && this.northInHand(p) != null && this.replacements.length && this.remain > 1) {
        acts.push(PlayAction.BaBei);
      }
      return acts;
    }
    // 手里的北（三麻拔北用），没有则返回 null
    northInHand(p) {
      if (p.riichi) {
        const tile = p.drawnTile;
        if (tile == null || !p.hand.includes(tile)) return null;
        const drawn = decodeId(tile);
        return drawn.suit === 4 && drawn.rank === 4 ? tile : null;
      }
      for (const t of p.hand) {
        const d = decodeId(t);
        if (d.suit === 4 && d.rank === 4) return t;
      }
      return null;
    }
    countYaoJiuKinds(p) {
      const s = /* @__PURE__ */ new Set();
      for (const t of p.hand) {
        const { suit, rank } = decodeId(t);
        if (suit === 4 || rank === 1 || rank === 9) s.add(suit * 10 + rank);
      }
      return s.size;
    }
    // 该席位是否由 AI 操作（autoHuman 为测试用：把 0 号真人席位也交给 AI 代打）
    isAiSeat(p) {
      return !p.isHuman || this.autoHuman;
    }
    // 九种九牌成立条件：仍在首巡（任何鸣牌——含吃碰杠与拔北——都会把 firstGoAround 置 false）
    // 且刚摸完牌的手牌里有 ≥9 种幺九。成立时人类可选、AI 自动。
    canJiuZhongJiuPai(p) {
      return this.firstGoAround && this.countYaoJiuKinds(p) >= 9;
    }
    canRiichi(p) {
      if (!p.menzen || p.riichi) return false;
      if (p.score < 1e3) return false;
      if (this.remain < this.playersN) return false;
      return this.formalTenpaiDiscards(p).length > 0;
    }
    canTsumo(p) {
      const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, false));
      return w.isAgari && w.hasYaku;
    }
    concealedQuadTiles(p) {
      const counts = /* @__PURE__ */ new Map();
      for (const tile of p.hand) counts.set(kindOf2(tile), (counts.get(kindOf2(tile)) || 0) + 1);
      const quads = [...counts.entries()].filter(([, count]) => count === 4).map(([kind]) => p.hand.find((tile) => kindOf2(tile) === kind));
      if (!p.riichi) return quads;
      if (p.drawnTile == null) return [];
      const drawnKind = kindOf2(p.drawnTile);
      return quads.filter((tile) => kindOf2(tile) === drawnKind && this.riichiAnkanKeepsWaits(p, drawnKind));
    }
    concealedQuadTile(p) {
      return this.concealedQuadTiles(p)[0] ?? null;
    }
    sameWaitKinds(left, right) {
      return left.length === right.length && left.every((kind, index) => kind === right[index]);
    }
    riichiAnkanKeepsWaits(p, quadKind) {
      const before = p.hand.slice();
      const drawnIndex = before.indexOf(p.drawnTile);
      if (drawnIndex < 0) return false;
      before.splice(drawnIndex, 1);
      const beforeWaits = handWaits(before, p.melds).waitKinds.slice().sort((a, b) => a - b);
      const after = p.hand.filter((tile) => kindOf2(tile) !== quadKind);
      const placeholder = p.hand.find((tile) => kindOf2(tile) === quadKind);
      const afterWaits = handWaits(after, p.melds.concat([{ type: "ankan", tiles: [placeholder, placeholder, placeholder, placeholder] }])).waitKinds.slice().sort((a, b) => a - b);
      return this.sameWaitKinds(beforeWaits, afterWaits);
    }
    riichiFutureAnkanKinds(p) {
      if (!p.riichi || p.hand.length % 3 !== 1) return [];
      const beforeWaits = handWaits(p.hand, p.melds).waitKinds.slice().sort((a, b) => a - b);
      const counts = /* @__PURE__ */ new Map();
      for (const tile of p.hand) counts.set(kindOf2(tile), (counts.get(kindOf2(tile)) || 0) + 1);
      const result = [];
      for (const [kind, count] of counts) {
        if (count !== 3) continue;
        const after = p.hand.filter((tile) => kindOf2(tile) !== kind);
        const placeholder = p.hand.find((tile) => kindOf2(tile) === kind);
        const afterWaits = handWaits(after, p.melds.concat([{ type: "ankan", tiles: [placeholder, placeholder, placeholder, placeholder] }])).waitKinds.slice().sort((a, b) => a - b);
        if (this.sameWaitKinds(beforeWaits, afterWaits)) result.push(kind * 10);
      }
      return result;
    }
    // 加杠：手上有与已碰的刻子同种的牌
    addedKanTile(p) {
      for (const m of p.melds) {
        if (m.type !== "pon") continue;
        const k = kindOf2(m.tiles[0]);
        const t = p.hand.find((x) => kindOf2(x) === k);
        if (t != null) return t;
      }
      return null;
    }
    // 表宝牌的「牌种」集合（供 AI 保留宝牌用）
    doraKinds() {
      const s = /* @__PURE__ */ new Set();
      for (const ind of this.doraIndicators) s.add(kindOf2(doraFromIndicator(ind, this.sanma)));
      return s;
    }
    // 场上已公开的牌（牌河 + 副露 + 宝牌指示牌）
    visibleCounts() {
      const c = new Array(34).fill(0);
      const add2 = (id) => {
        const i = tileIndex(id);
        if (i >= 0) c[i]++;
      };
      for (const q of this.players) {
        for (const t of q.discards) add2(t);
        for (const m of q.melds) for (const t of m.tiles) add2(t);
      }
      for (const t of this.doraIndicators) add2(t);
      return c;
    }
    // 某家视角下「某牌种还剩几张」（用于受入枚数）
    remainOfFor(p) {
      const vis = this.visibleCounts();
      const own = countsOf(p.hand);
      const total = (idx) => this.sanma && idx >= 1 && idx <= 7 ? 0 : 4;
      return (idx) => total(idx) - vis[idx] - own[idx];
    }
    // 统一的弃牌评估入口
    bestDiscard(p, extra = {}) {
      return chooseDiscard(p.hand, p.melds, {
        drawnTile: p.drawnTile,
        doraKinds: this.doraKinds(),
        akaSet: this.akaSet,
        remainOf: this.remainOfFor(p),
        ...extra
      });
    }
    doraTilesFor(p) {
      const out = this.doraIndicators.map((i) => doraFromIndicator(i, this.sanma));
      if (p.riichi) out.push(...this.uraIndicators.map((i) => doraFromIndicator(i, this.sanma)));
      return out;
    }
    winOpts(p, isRon, ronTile = null) {
      return {
        ronTile: isRon ? ronTile : null,
        riichi: p.riichi,
        doubleRiichi: p.doubleRiichi,
        ippatsu: p.riichi && p.ippatsu,
        tenho: !isRon && this.firstGoAround && p.discards.length === 0,
        rinshan: !isRon && p.rinshan,
        haidi: this.remain <= 0 && (isRon || !p.rinshan),
        doraTiles: this.doraTilesFor(p),
        roundWind: this.roundWind,
        seatWind: this.seatWindOf(p.seat)
      };
    }
    // 13 张形时更新听牌信息（waits 存牌种码）
    updateWaits(p) {
      if (p.hand.length % 3 !== 1) return;
      const info = handWaits(p.hand, p.melds);
      p.shanten = info.shanten;
      p.waits = info.shanten === 0 ? info.waitKinds : [];
      p.waitTiles = info.shanten === 0 ? info.waits : [];
    }
    isFormalTenpaiHand(hand, melds) {
      const info = handWaits(hand, melds);
      if (info.shanten !== 0 || !info.waitKinds.length) return false;
      const ownTiles = hand.concat(realMelds(melds).flatMap((meld) => meld.tiles));
      return info.waitKinds.some((kind) => ownTiles.filter((tile) => kindOf2(tile) === kind).length < 4);
    }
    formalTenpaiDiscards(p) {
      if (p.hand.length % 3 !== 2) return [];
      const result = [];
      const seen = /* @__PURE__ */ new Set();
      for (const tile of p.hand) {
        const kind = kindOf2(tile);
        if (seen.has(kind)) continue;
        seen.add(kind);
        const hand = p.hand.slice();
        hand.splice(hand.indexOf(tile), 1);
        if (this.isFormalTenpaiHand(hand, p.melds)) result.push(kind);
      }
      return result;
    }
    isTenpai(p) {
      if (p.hand.length % 3 === 1) return this.isFormalTenpaiHand(p.hand, p.melds);
      return this.formalTenpaiDiscards(p).length > 0;
    }
    selfFuriten(p) {
      return !!p.waits?.length && p.waits.some((kind) => p.discardKinds.has(kind));
    }
    isFuriten(p) {
      return this.selfFuriten(p) || !!p.tempFuriten || !!p.riichiFuriten;
    }
    furitenTypes(p) {
      const types2 = [];
      if (p.riichiFuriten) types2.push(0);
      if (p.tempFuriten) types2.push(1);
      if (this.selfFuriten(p)) types2.push(2);
      return types2;
    }
    markPassedRon(p) {
      if (p.riichi) p.riichiFuriten = true;
      else p.tempFuriten = true;
    }
    confirmRiichiDeclaration(p) {
      if (p?.riichiPending) p.riichiPending = false;
    }
    rollbackRiichiDeclaration(p) {
      if (!p?.riichiPending) return;
      p.riichi = false;
      p.doubleRiichi = false;
      p.riichiPending = false;
      p.riichiTurn = -1;
      p.ippatsu = false;
      p.score += 1e3;
      this.riichiSticks = Math.max(0, this.riichiSticks - 1);
    }
    // 14 张形的听牌提示：打哪张 -> 听哪些
    //
    // 编码陷阱：tingInfos.play / ting 用的是「牌种」编码（copy 位固定为 0），
    // 实机样本 play=380(3索) ting=210(1筒)、play=110(1万)，全部以 0 结尾。
    // 其余字段（handCards / NtfPlayCard.card / baoPreCard …）才是带 copy 的完整牌 ID。
    // 之前这里发的是 copy=1 的完整 ID（381/211），客户端按牌种查表匹配不上，
    // 结果就是「听了牌但不显示听牌、也没有听牌提示」。
    buildTingInfos(p) {
      if (p.hand.length % 3 !== 2) return [];
      const { shanten: sh, options } = discardOptionsOfCounts(
        countsOf(p.hand),
        realMelds(p.melds).length,
        this.remainOfFor(p)
      );
      if (sh !== 0) return [];
      const out = [];
      for (const o of options) {
        const playTile = p.hand.find((t) => tileIndex(t) === o.idx);
        if (!playTile) continue;
        const play2 = indexToTileId(o.idx, 0);
        const hand13 = p.hand.slice();
        hand13.splice(hand13.indexOf(playTile), 1);
        if (!this.isFormalTenpaiHand(hand13, p.melds)) continue;
        for (const wIdx of o.waits) {
          const tingTile = indexToTileId(wIdx, 0);
          const hand14 = hand13.concat([tingTile]);
          const wMo = calcWin(hand14, p.melds, this.akaSet, this.winOpts(p, false));
          const wRong = calcWin(hand13, p.melds, this.akaSet, this.winOpts(p, true, tingTile));
          out.push({
            play: play2,
            ting: tingTile,
            hasYiWhenMo: wMo.hasYaku,
            yiManChance: 0,
            fanFuTypeWhenMo: 0,
            hasYiWhenRong: wRong.hasYaku,
            manType: 0
          });
        }
      }
      return out.slice(0, 60);
    }
    // ================= 处理行动 =================
    async processTurnAction(seat, action2, card, drew, cantPlays = []) {
      const p = this.players[seat];
      const result = this.validateTurnPayload(
        { action: action2, card },
        { seat, drew, actions: this.turnActions(seat, drew), cantPlays }
      );
      if (result !== Result.Succ) return result;
      this._processing = true;
      this._bufferedDraw = null;
      this._bufferedClaim = null;
      if (action2 === PlayAction.Hu) {
        await this.winTsumo(seat);
        return Result.Succ;
      }
      if (action2 === PlayAction.JiuZhongJiuLiuJu) {
        await this.abortiveDraw(LiuJuType.JiuZhongJiuPai, seat);
        return Result.Succ;
      }
      if (action2 === PlayAction.AnGang) {
        await this.doKan(seat, card, "ankan");
        return Result.Succ;
      }
      if (action2 === PlayAction.PengGang) {
        await this.doKan(seat, card, "kakan");
        return Result.Succ;
      }
      if (action2 === PlayAction.BaBei) {
        await this.doBaBei(seat, card);
        return Result.Succ;
      }
      if (action2 === PlayAction.Riichi) {
        p.riichi = true;
        p.doubleRiichi = this.firstGoAround && p.discards.length === 0;
        p.riichiTurn = this.xunNum;
        p.riichiPending = true;
        p.ippatsu = true;
        p.score -= 1e3;
        this.riichiSticks += 1;
      }
      const idx = p.hand.lastIndexOf(card);
      p.hand.splice(idx, 1);
      p.hand.sort((a, b) => a - b);
      p.discards.push(card);
      p.discardKinds.add(kindOf2(card));
      this.updateWaits(p);
      this.lastDiscard = { seat, card };
      if (p.ippatsu && p.riichiTurn !== this.xunNum) p.ippatsu = false;
      await this.discard(seat, card, action2);
      return Result.Succ;
    }
    emptyClaims() {
      return this.players.map(() => []);
    }
    async discard(seat, card, action2) {
      const p = this.players[seat];
      const isMoQie = p.drawnTile === card;
      p.drawnTile = null;
      p.rinshan = false;
      this.flushDeferredKanDora();
      const canQiang = this.players.map((q) => q.seat === seat ? [] : this.claimActions(q.seat, seat, card));
      this.expectClaim(0, seat, card, canQiang[0] || []);
      this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, card, action2, isMoQie, canQiang));
      await this._d(this.T.claim);
      await this.resolveClaims(seat, card, canQiang);
    }
    checkSiFengLianDa() {
      if (!this.firstGoAround) return false;
      const n = this.playersN;
      if (n !== 4) return false;
      const firsts = this.players.map((p) => p.discards[0]);
      if (firsts.some((t) => t == null)) return false;
      if (this.players.some((p) => p.discards.length !== 1 || p.melds.length)) return false;
      const kinds = firsts.map(kindOf2);
      return kinds.every((k) => k >= 41 && k <= 44 && k === kinds[0]);
    }
    buildPlayCard(seat, card, action2, isMoQie, canQiang) {
      return {
        seat,
        card,
        action: action2,
        isMoQie,
        userInfos: this.players.map((q) => ({
          seat: q.seat,
          canQiangActions: canQiang[q.seat] || [],
          isZhenTing: this.isFuriten(q),
          leftTimer: q.isHuman ? Math.ceil(q.timeBank) : 0,
          canAnGangNoNumCardsAfterRiichi: this.riichiFutureAnkanKinds(q),
          zhenTingTypes: this.furitenTypes(q)
        }))
      };
    }
    // ================= 鸣牌 =================
    claimActions(seat, discarderSeat, card) {
      const p = this.players[seat];
      const acts = [];
      if (this.canRon(p, card)) acts.push(PlayAction.Hu);
      if (!p.riichi) {
        const cnt = p.hand.filter((t) => kindOf2(t) === kindOf2(card)).length;
        if (cnt >= 3 && this.kanCount < 4 && this.remain > 1) acts.push(PlayAction.MingGang);
        if (cnt >= 2 && this.remain > 0) acts.push(PlayAction.Peng);
        if (!this.sanma && seat === this.nextSeat(discarderSeat) && this.remain > 0) {
          if (this.chiTiles(p, card)) acts.push(PlayAction.Chi);
        }
      }
      if (acts.length) acts.push(PlayAction.Guo);
      return acts;
    }
    canRon(p, card, extra = {}) {
      if (!p.waits || !p.waits.includes(kindOf2(card))) return false;
      if (this.isFuriten(p)) return false;
      const w = calcWin(p.hand, p.melds, this.akaSet, { ...this.winOpts(p, true, card), ...extra });
      return w.isAgari && w.hasYaku;
    }
    canDiscardAfterClaim(p, action2, card, used) {
      const forbidden = this.kuikaeKinds(action2, [...used, card], card);
      return p.hand.some((tile) => !used.includes(tile) && !forbidden.has(kindOf2(tile)));
    }
    chiOptions(p, card) {
      const { suit, rank } = decodeId(card);
      if (suit === 4) return [];
      const options = [];
      const combos = [[rank - 2, rank - 1], [rank - 1, rank + 1], [rank + 1, rank + 2]];
      for (const [leftRank, rightRank] of combos) {
        if (leftRank < 1 || leftRank > 9 || rightRank < 1 || rightRank > 9) continue;
        const left = p.hand.find((tile) => {
          const decoded = decodeId(tile);
          return decoded.suit === suit && decoded.rank === leftRank;
        });
        if (left == null) continue;
        const right = p.hand.find((tile) => {
          const decoded = decodeId(tile);
          return tile !== left && decoded.suit === suit && decoded.rank === rightRank;
        });
        if (right != null && this.canDiscardAfterClaim(p, PlayAction.Chi, card, [left, right])) options.push([left, right]);
      }
      return options;
    }
    chiTiles(p, card) {
      return this.chiOptions(p, card)[0] || null;
    }
    async resolveClaims(discarderSeat, card, canQiang) {
      const all = [];
      let humanHandled = false;
      const humanCanClaim = this.players[0].isHuman && canQiang[0]?.length;
      if (humanCanClaim && (!this.isAiSeat(this.players[0]) || this._bufferedClaim != null)) {
        if (!this._expectedClaim && this._bufferedClaim == null) this.expectClaim(0, discarderSeat, card, canQiang[0]);
        const payload = await this.waitHuman("claim");
        humanHandled = true;
        if (payload?.action !== PlayAction.Hu && canQiang[0].includes(PlayAction.Hu)) {
          this.markPassedRon(this.players[0]);
        }
        if (payload?.action != null && payload.action !== PlayAction.Guo) {
          all.push({ seat: 0, action: payload.action, otherCards: payload.otherCards || [] });
        }
      } else {
        this._expectedClaim = null;
      }
      for (let seat = 0; seat < this.playersN; seat++) {
        if (seat === 0 && (humanHandled || !this.isAiSeat(this.players[0]))) continue;
        if (!canQiang[seat]?.length) continue;
        const claim2 = this.aiClaim(seat, discarderSeat, card, canQiang[seat]);
        if (claim2) all.push({ seat, ...claim2 });
        if (claim2?.action !== PlayAction.Hu && canQiang[seat].includes(PlayAction.Hu)) this.markPassedRon(this.players[seat]);
      }
      if (!all.length) {
        this.confirmRiichiDeclaration(this.players[discarderSeat]);
        if (this.playersN === 4 && this.players.every((player) => player.riichi)) {
          await this.abortiveDraw(LiuJuType.SiJiaLiZhi, discarderSeat);
          return;
        }
        if (this.checkSiFengLianDa()) {
          await this.abortiveDraw(LiuJuType.SiFengLianDa, discarderSeat);
          return;
        }
        const next = this.nextSeat(discarderSeat);
        if (next === this.dealerSeat) this.firstGoAround = false;
        await this.turnDraw(next);
        return;
      }
      const priority = (claim2) => claim2.action === PlayAction.Hu ? 4 : claim2.action === PlayAction.MingGang ? 3 : claim2.action === PlayAction.Peng ? 2 : 1;
      const distance = (seat) => (seat - discarderSeat + this.playersN) % this.playersN;
      all.sort((left, right) => priority(right) - priority(left) || distance(left.seat) - distance(right.seat));
      const ronClaims = all.filter((claim2) => claim2.action === PlayAction.Hu);
      if (ronClaims.length) {
        await this.winRons(ronClaims.map((claim2) => claim2.seat), discarderSeat, card);
        return;
      }
      this.confirmRiichiDeclaration(this.players[discarderSeat]);
      const claim = all[0];
      await this.executeClaim(claim.seat, claim.action, card, discarderSeat, claim.otherCards || []);
    }
    recordPao(player, discarderSeat) {
      player.pao || (player.pao = {});
      const tripletKinds = new Set(player.melds.filter((meld) => meld.type === "pon" || meld.type === "kan").map((meld) => kindOf2(meld.tiles[0])));
      if (player.pao.daisangen == null && [45, 46, 47].every((kind) => tripletKinds.has(kind))) {
        player.pao.daisangen = discarderSeat;
      }
      if (player.pao.daisuushi == null && [41, 42, 43, 44].every((kind) => tripletKinds.has(kind))) {
        player.pao.daisuushi = discarderSeat;
      }
    }
    paoYakumanUnits(player, win2) {
      const yaku2 = win2.yaku || {};
      let units = 0;
      if (player.pao?.daisangen != null && Object.keys(yaku2).some((name) => name.includes("\u5927\u4E09\u5143"))) units += 1;
      if (player.pao?.daisuushi != null && Object.keys(yaku2).some((name) => name.includes("\u5927\u56DB\u559C"))) units += 2;
      return Math.min(units, win2.yakuman || units);
    }
    paoSeatFor(player, win2) {
      const names = Object.keys(win2.yaku || {});
      if (player.pao?.daisangen != null && names.some((name) => name.includes("\u5927\u4E09\u5143"))) return player.pao.daisangen;
      if (player.pao?.daisuushi != null && names.some((name) => name.includes("\u5927\u56DB\u559C"))) return player.pao.daisuushi;
      return null;
    }
    async executeClaim(seat, action2, card, discarderSeat, otherCards) {
      const p = this.players[seat];
      const validation = this.validateClaimPayload(
        { action: action2, otherCards },
        { seat, discarderSeat, card, actions: this.claimActions(seat, discarderSeat, card) }
      );
      if (validation !== Result.Succ) return validation;
      this._processing = true;
      this._bufferedDraw = null;
      this._bufferedClaim = null;
      const donor = this.players[discarderSeat];
      if (action2 === PlayAction.Hu) {
        await this.winRon(seat, discarderSeat, card);
        return Result.Succ;
      }
      donor.discards.pop();
      donor.discardClaimed = true;
      for (const q of this.players) q.ippatsu = false;
      this.firstGoAround = false;
      if (action2 === PlayAction.MingGang) {
        const used2 = this.takeTiles(p, card, 3);
        p.melds.push({ type: "kan", tiles: [...used2, card], from: discarderSeat });
        p.menzen = false;
        this.kanCount++;
        this.recordPao(p, discarderSeat);
        this.emit(RiichiMsg.ENtfQiangCard, this.buildQiang(seat, action2, used2));
        await this._d(this.T.claim);
        this._deferredKanDora++;
        if (this.kanCount >= 4 && !this.players.some((player) => player.melds.filter((meld) => meld.type === "kan" || meld.type === "ankan").length >= 4)) {
          await this.abortiveDraw(LiuJuType.SiGang, seat);
          return Result.Succ;
        }
        if (!await this.drawReplacement(seat)) return Result.Succ;
        this.emit(RiichiMsg.ENtfQiangCardEnd, this.buildQiangEnd(seat, action2, used2, [...used2, card]));
        await this._d(this.T.claim);
        await this.awaitTurn(seat, true);
        return Result.Succ;
      }
      const isChi = action2 === PlayAction.Chi;
      const used = otherCards.slice();
      for (const tile of used) {
        p.hand.splice(p.hand.indexOf(tile), 1);
      }
      const meldTiles = [...used, card].sort((a, b) => a - b);
      p.melds.push({ type: isChi ? "chi" : "pon", tiles: meldTiles, from: discarderSeat });
      if (!isChi) this.recordPao(p, discarderSeat);
      p.menzen = false;
      p.drawnTile = null;
      p.rinshan = false;
      const cantPlays = this.cantPlays(p, action2, meldTiles);
      this._nextCantPlays = { seat, values: cantPlays };
      this.emit(RiichiMsg.ENtfQiangCard, this.buildQiang(seat, action2, used));
      await this._d(this.T.claim);
      this.expectDraw(seat, false, this.turnActions(seat, false), cantPlays);
      this.emit(RiichiMsg.ENtfQiangCardEnd, this.buildQiangEnd(seat, action2, used, meldTiles));
      await this._d(this.T.claim);
      await this.awaitTurn(seat, false);
      return Result.Succ;
    }
    canRobKan(p, tile, kind) {
      if (!p.waits?.includes(kindOf2(tile)) || this.isFuriten(p)) return false;
      const win2 = calcWin(p.hand, p.melds, this.akaSet, { ...this.winOpts(p, true, tile), chankan: true });
      if (!win2.isAgari || !win2.hasYaku) return false;
      if (kind !== "ankan") return true;
      return Object.keys(win2.yaku || {}).some((name) => name.includes("\u56FD\u58EB\u7121\u53CC"));
    }
    kanRobActions(kanSeat, tile, kind) {
      return this.players.map((player) => {
        if (player.seat === kanSeat || !this.canRobKan(player, tile, kind)) return [];
        return [PlayAction.Hu, PlayAction.Guo];
      });
    }
    async resolveKanRob(kanSeat, tile, canQiang, winExtra = { chankan: true }) {
      const claims = [];
      let humanHandled = false;
      const humanCanClaim = this.players[0].isHuman && canQiang[0]?.length;
      if (humanCanClaim && (!this.isAiSeat(this.players[0]) || this._bufferedClaim != null)) {
        if (!this._expectedClaim && this._bufferedClaim == null) this.expectClaim(0, kanSeat, tile, canQiang[0]);
        const payload = await this.waitHuman("claim");
        humanHandled = true;
        if (payload?.action === PlayAction.Hu) claims.push({ seat: 0 });
        else this.markPassedRon(this.players[0]);
      } else {
        this._expectedClaim = null;
      }
      for (let seat = 0; seat < this.playersN; seat++) {
        if (seat === 0 && (humanHandled || !this.isAiSeat(this.players[0]))) continue;
        if (canQiang[seat]?.includes(PlayAction.Hu)) claims.push({ seat });
      }
      if (!claims.length) return false;
      const distance = (seat) => (seat - kanSeat + this.playersN) % this.playersN;
      claims.sort((left, right) => distance(left.seat) - distance(right.seat));
      await this.winRons(claims.map((claim) => claim.seat), kanSeat, tile, winExtra, { robbed: true });
      return true;
    }
    async doKan(seat, card, kind) {
      this.flushDeferredKanDora();
      const p = this.players[seat];
      const action2 = kind === "ankan" ? PlayAction.AnGang : PlayAction.PengGang;
      const canQiang = this.kanRobActions(seat, card, kind);
      this.expectClaim(0, seat, card, canQiang[0] || []);
      this.emit(RiichiMsg.ENtfPlayCard, this.buildPlayCard(seat, card, action2, false, canQiang));
      await this._d(this.T.claim);
      if (await this.resolveKanRob(seat, card, canQiang)) return;
      if (kind === "ankan") {
        const tiles = this.takeTilesByKind(p, kindOf2(card), 4);
        p.melds.push({ type: "ankan", tiles });
      } else {
        const meld = p.melds.find((item) => item.type === "pon" && kindOf2(item.tiles[0]) === kindOf2(card));
        p.hand.splice(p.hand.indexOf(card), 1);
        meld.type = "kan";
        meld.tiles = [...meld.tiles, card];
      }
      this.kanCount++;
      for (const player of this.players) player.ippatsu = false;
      this.firstGoAround = false;
      if (kind === "ankan") this.revealKanDora();
      else this._deferredKanDora++;
      if (this.kanCount >= 4 && !this.players.some((player) => player.melds.filter((meld) => meld.type === "kan" || meld.type === "ankan").length >= 4)) {
        await this.abortiveDraw(LiuJuType.SiGang, seat);
        return;
      }
      if (!await this.drawReplacement(seat)) return;
      await this.awaitTurn(seat, true);
    }
    flushDeferredKanDora() {
      while (this._deferredKanDora > 0) {
        this._deferredKanDora--;
        this.revealKanDora();
      }
    }
    revealKanDora() {
      const i = this.doraIndicators.length;
      const baoBase = this.sanma ? 8 : 4;
      const maxI = 4;
      if (i >= 1 && i <= maxI && this.deadWall[baoBase + 2 * i] != null) {
        const ind = this.deadWall[baoBase + 2 * i];
        this.doraIndicators.push(ind);
        this.uraIndicators.push(this.deadWall[baoBase + 1 + 2 * i]);
        this._pendingBaoPreCard = ind;
      }
    }
    takeTiles(p, card, n) {
      return this.takeTilesByKind(p, kindOf2(card), n);
    }
    takeTilesByKind(p, kind, n) {
      const used = [];
      for (let i = 0; i < n; i++) {
        const idx = p.hand.findIndex((t) => kindOf2(t) === kind);
        if (idx >= 0) used.push(p.hand.splice(idx, 1)[0]);
      }
      return used;
    }
    // otherCards 是「自己手里贡献的牌」，**不含**被鸣的那张（实机抓包：
    // Chi/Peng 均为 2 张、MingGang 为 3 张，被鸣牌只由 NtfPlayCard.card 给出）。
    // 若把被鸣牌也塞进来，客户端会按 otherCards.length+1 判定副露类型：
    // 碰(3)→显示成明杠、吃(3)→UI 拼不出顺子而卡死。
    buildQiang(seat, action2, otherCards) {
      return {
        seat,
        action: action2,
        otherCards: otherCards || [],
        userInfos: this.players.map((q) => ({ seat: q.seat }))
      };
    }
    // otherCards = 发给客户端的「自己手里贡献的牌」（不含被鸣的那张）
    // meldTiles   = 完整面子（含被鸣牌），仅内部用于算食替禁止牌
    buildQiangEnd(seat, action2, otherCards, meldTiles) {
      const p = this.players[seat];
      return {
        seats: [seat],
        action: action2,
        otherCards: otherCards || [],
        userInfos: this.players.map((q) => ({
          seat: q.seat,
          tingInfos: q.seat === seat ? this.buildTingInfos(p) : [],
          // 实机 NtfQiangCardEnd 的 canPlayActions 只能是 []（他家）或 [0]（鸣牌者，
          // 即「仅可打牌」），绝不带 6/7/8/9/10。完整可选项由紧随其后的 NtfSendCard 下发。
          canPlayActions: q.seat === seat ? [PlayAction.Normal] : [],
          isZhenTing: this.isFuriten(q),
          cantPlays: q.seat === seat ? this.cantPlays(p, action2, meldTiles || otherCards || []) : [],
          leftTimer: q.isHuman ? Math.ceil(q.timeBank) : 0,
          xunNum: this.xunNum,
          zhenTingTypes: this.furitenTypes(q)
        }))
      };
    }
    // 吃碰后的食替禁止牌（同样是牌种编码 copy=0，实机样本 [440,310,280,380,320]）
    cantPlays(p, action2, meldTiles) {
      if (action2 !== PlayAction.Chi && action2 !== PlayAction.Peng) return [];
      const claimed = this.lastDiscard ? this.lastDiscard.card : null;
      return [...this.kuikaeKinds(action2, meldTiles, claimed)].filter((kind) => p.hand.some((tile) => kindOf2(tile) === kind)).map((kind) => kind * 10);
    }
    kuikaeKinds(action2, meldTiles, claimed) {
      const out = /* @__PURE__ */ new Set();
      if (claimed == null || action2 !== PlayAction.Chi && action2 !== PlayAction.Peng) return out;
      out.add(kindOf2(claimed));
      if (action2 !== PlayAction.Chi || meldTiles.length !== 3) return out;
      const claimedTile = decodeId(claimed);
      const ranks = meldTiles.map((tile) => decodeId(tile).rank).sort((left, right) => left - right);
      if (ranks[2] - ranks[0] !== 2) return out;
      if (claimedTile.rank === ranks[0] && ranks[2] < 9) out.add(claimedTile.suit * 10 + ranks[2] + 1);
      if (claimedTile.rank === ranks[2] && ranks[0] > 1) out.add(claimedTile.suit * 10 + ranks[0] - 1);
      return out;
    }
    // ================= 和牌 / 流局 =================
    async winTsumo(seat) {
      const p = this.players[seat];
      const w = calcWin(p.hand, p.melds, this.akaSet, this.winOpts(p, false));
      await this.endHand({ type: "tsumo", winner: seat, loser: null, card: p.drawnTile, win: w });
    }
    async winRon(seat, loser, card, extra = {}) {
      await this.winRons([seat], loser, card, extra);
    }
    async winRons(seats4, loser, card, extra = {}, { robbed = false } = {}) {
      const donor = this.players[loser];
      const robbedIndex = robbed ? donor.hand.indexOf(card) : -1;
      if (robbed && robbedIndex < 0) throw new Error(`\u88AB\u62A2\u724C\u4E0D\u5728\u624B\u4E2D seat=${loser} card=${card}`);
      const wins = /* @__PURE__ */ new Map();
      for (const seat of seats4) {
        const p = this.players[seat];
        const win2 = calcWin(
          p.hand,
          p.melds,
          this.akaSet,
          { ...this.winOpts(p, true, card), ...extra }
        );
        if (!win2.isAgari || !win2.hasYaku) throw new Error(`\u975E\u6CD5\u8363\u548C seat=${seat}`);
        wins.set(seat, win2);
      }
      this.rollbackRiichiDeclaration(donor);
      if (robbed) {
        donor.hand.splice(robbedIndex, 1);
        donor.drawnTile = null;
        this.updateWaits(donor);
      }
      await this.endHand({ type: "ron", winners: seats4.slice(), loser, card, wins });
    }
    async exhaustiveDraw() {
      const nagashiWinners = this.players.filter((player) => player.discards.length > 0 && !player.discardClaimed && player.discards.every((tile) => {
        const { suit, rank } = decodeId(tile);
        return suit === 4 || rank === 1 || rank === 9;
      })).map((player) => player.seat);
      const tenpai = this.players.map((player) => this.isTenpai(player));
      await this.endHand({ type: "draw", liuJuType: LiuJuType.HuangPai, tenpai, nagashiWinners });
    }
    async abortiveDraw(liuJuType, seat) {
      await this.endHand({
        type: "draw",
        liuJuType,
        liuJuSeat: seat,
        tenpai: this.players.map(() => false),
        noPenalty: true
      });
    }
    // ================= 结算 =================
    async endHand(res) {
      if (this.handEnded) return;
      this.handEnded = true;
      const n = this.playersN;
      const scores = this.players.map((p) => p.score);
      let dealerContinues = false;
      let ui = [];
      if (res.type === "draw") {
        const nagashiWinners = res.nagashiWinners || [];
        if (nagashiWinners.length) {
          for (const winner of nagashiWinners) {
            const dealerWin = winner === this.dealerSeat;
            for (let seat = 0; seat < n; seat++) {
              if (seat === winner) continue;
              const payment = dealerWin || seat === this.dealerSeat ? 4e3 : 2e3;
              scores[seat] -= payment;
              scores[winner] += payment;
            }
          }
        } else if (!res.noPenalty) {
          const tenpaiSeats = res.tenpai.map((tenpai, seat) => tenpai ? seat : -1).filter((seat) => seat >= 0);
          const notenSeats = res.tenpai.map((tenpai, seat) => tenpai ? -1 : seat).filter((seat) => seat >= 0);
          if (tenpaiSeats.length && notenSeats.length) {
            const receive = Math.floor(3e3 / tenpaiSeats.length);
            const payment = Math.floor(3e3 / notenSeats.length);
            for (const seat of tenpaiSeats) scores[seat] += receive;
            for (const seat of notenSeats) scores[seat] -= payment;
          }
        }
        dealerContinues = res.noPenalty ? true : !!res.tenpai[this.dealerSeat];
        const gameOver2 = this.decideGameOver(dealerContinues, scores, { drawNoPenalty: !!res.noPenalty });
        this.renchanCount = dealerContinues ? this.renchanCount + 1 : 0;
        if (gameOver2 && this.riichiSticks > 0) {
          const topSeat = this.players.map((_, seat) => seat).sort((left, right) => scores[right] - scores[left] || left - right)[0];
          scores[topSeat] += this.riichiSticks * 1e3;
          this.riichiSticks = 0;
        }
        this.recordHumanHandStats(res, null, dealerContinues);
        this.prepareFinalResult(scores, gameOver2);
        ui = this.buildStopUserInfos(scores, null, null, res.tenpai, gameOver2);
        this.emit(RiichiMsg.ENtfGameStop, {
          huSeats: [],
          huCardSeat: -1,
          huCard: 0,
          liBaoPreCards: [],
          isFinal: gameOver2,
          userInfos: ui,
          baoPreCards: this.doraIndicators.slice(),
          liuJuManGuanSeats: nagashiWinners,
          liuJuType: res.liuJuType,
          liuJuSeat: res.liuJuSeat != null ? res.liuJuSeat : -1,
          duiCards: [],
          duiCardsStr: "",
          duiCardsStrSalt: "",
          stopType: 0,
          winningStreak: 0
        });
        await this.finishHand(gameOver2, dealerContinues, scores, { draw: true });
        return;
      }
      const winners = res.type === "tsumo" ? [res.winner] : res.winners.slice();
      const details = /* @__PURE__ */ new Map();
      const huDelta = new Array(n).fill(0);
      for (let winnerIndex = 0; winnerIndex < winners.length; winnerIndex++) {
        const winner = winners[winnerIndex];
        const winP = this.players[winner];
        const isDealerWin = winner === this.dealerSeat;
        const doraBreak = this.countDora(winP, res.type === "ron" ? res.card : null);
        const extraFan = doraBreak.babei + doraBreak.babeiAsDora;
        const rawWin = res.type === "tsumo" ? res.win : res.wins.get(winner);
        const paoSeat = this.paoSeatFor(winP, rawWin);
        const paoUnits = this.paoYakumanUnits(winP, rawWin);
        const paoTotal = paoUnits * (isDealerWin ? 48e3 : 32e3);
        const win2 = this.applyExtraFan(rawWin, extraFan, isDealerWin);
        if (res.type === "tsumo") {
          let pureGain = 0;
          for (let seat = 0; seat < n; seat++) {
            if (seat === winner) continue;
            const base2 = isDealerWin ? win2.oya[0] || 0 : seat === this.dealerSeat ? win2.ko[0] || 0 : win2.ko[1] || 0;
            const payment = base2 + this.honba * 100;
            scores[seat] -= payment;
            scores[winner] += payment;
            huDelta[seat] -= base2;
            pureGain += base2;
          }
          if (paoSeat != null && paoTotal > 0) {
            for (let seat = 0; seat < n; seat++) {
              if (seat === winner) continue;
              const paoShare = (isDealerWin || seat === this.dealerSeat ? 16e3 : 8e3) * paoUnits;
              scores[seat] += paoShare + this.honba * 100;
              scores[winner] -= paoShare + this.honba * 100;
              huDelta[seat] += paoShare;
              pureGain -= paoShare;
            }
            const paoPayment = paoTotal + (n - 1) * this.honba * 100;
            scores[paoSeat] -= paoPayment;
            scores[winner] += paoPayment;
            huDelta[paoSeat] -= paoTotal;
            pureGain += paoTotal;
          }
          huDelta[winner] += pureGain;
        } else {
          const base2 = win2.ten || 0;
          const honbaPayment = winnerIndex === 0 ? this.honba * 300 : 0;
          scores[res.loser] -= base2 + honbaPayment;
          scores[winner] += base2 + honbaPayment;
          huDelta[res.loser] -= base2;
          huDelta[winner] += base2;
          if (paoSeat != null && paoSeat !== res.loser && paoTotal > 0) {
            const split = paoTotal / 2;
            scores[res.loser] += split + honbaPayment;
            scores[paoSeat] -= split + honbaPayment;
            huDelta[res.loser] += split;
            huDelta[paoSeat] -= split;
          }
        }
        const yakuInfo = mapYaku(win2.yaku, {
          roundWind: this.roundWind,
          seatWind: this.seatWindOf(winner)
        });
        details.set(winner, {
          yiFans: this.rebuildYiFans(yakuInfo.yiFans),
          isYiMan: yakuInfo.isYiMan || win2.yakuman > 0,
          manType: manTypeFromResult({ han: win2.han, fu: win2.fu, yakuman: win2.yakuman, name: win2.name }),
          baoFan: doraBreak.omote,
          liBaoFan: doraBreak.ura,
          redBaoFan: doraBreak.aka,
          baBeiFan: doraBreak.babei,
          fu: win2.fu,
          totalFan: win2.han
        });
      }
      const stickBonus = this.riichiSticks * 1e3;
      if (stickBonus) scores[winners[0]] += stickBonus;
      this.riichiSticks = 0;
      dealerContinues = winners.includes(this.dealerSeat);
      const gameOver = this.decideGameOver(dealerContinues, scores, {
        multiRonDealerContinuation: res.type === "ron" && winners.length > 1 && dealerContinues
      });
      this.renchanCount = dealerContinues ? this.renchanCount + 1 : 0;
      this.recordHumanHandStats(res, huDelta, dealerContinues);
      this.prepareFinalResult(scores, gameOver);
      ui = this.buildStopUserInfos(scores, winners, details, null, gameOver, huDelta);
      this.emit(RiichiMsg.ENtfGameStop, {
        huSeats: winners,
        huCardSeat: res.type === "ron" ? res.loser : winners[0],
        huCard: res.card || 0,
        liBaoPreCards: winners.some((seat) => this.players[seat].riichi) ? this.uraIndicators.slice() : [],
        isFinal: gameOver,
        userInfos: ui,
        baoPreCards: this.doraIndicators.slice(),
        liuJuManGuanSeats: [],
        liuJuType: 0,
        liuJuSeat: -1,
        duiCards: [],
        duiCardsStr: "",
        duiCardsStrSalt: "",
        stopType: 0,
        winningStreak: 0
      });
      await this.finishHand(gameOver, dealerContinues, scores);
    }
    // 给 riichi 库的结果补上库里没有的番数（目前只有拔北），并按标准公式重算点数。
    // 役满不受宝牌影响，原样返回。
    applyExtraFan(w, extraFan, isDealerWin) {
      if (!extraFan || !w || !w.isAgari || w.yakuman > 0) return w;
      const han = (w.han || 0) + extraFan;
      const fu = w.fu || 20;
      let base2;
      if (han >= 13) base2 = 8e3;
      else if (han >= 11) base2 = 6e3;
      else if (han >= 8) base2 = 4e3;
      else if (han >= 6) base2 = 3e3;
      else if (han === 5) base2 = 2e3;
      else base2 = Math.min(fu * 2 ** (2 + han), 2e3);
      const c = (x) => Math.ceil(x / 100) * 100;
      return {
        ...w,
        han,
        ten: c(base2 * (isDealerWin ? 6 : 4)),
        oya: [c(base2 * 2)],
        // 庄家自摸：每家付 base×2
        ko: [c(base2 * 2), c(base2)]
        // 闲家自摸：庄家付 base×2，其他闲家付 base
      };
    }
    // 宝牌拆分统计（表 / 里 / 赤 / 拔北）
    countDora(p, ronTile) {
      const tiles = p.hand.concat(ronTile != null ? [ronTile] : []);
      for (const m of p.melds) if (m.type !== "babei") tiles.push(...m.tiles);
      const babeiTiles = [];
      for (const m of p.melds) if (m.type === "babei") babeiTiles.push(...m.tiles);
      const count = (indList, list) => {
        let n = 0;
        for (const ind of indList) {
          const k = kindOf2(doraFromIndicator(ind, this.sanma));
          n += list.filter((t) => kindOf2(t) === k).length;
        }
        return n;
      };
      const babeiAsDora = count(this.doraIndicators, babeiTiles) + (p.riichi ? count(this.uraIndicators, babeiTiles) : 0);
      return {
        omote: count(this.doraIndicators, tiles) + count(this.doraIndicators, babeiTiles),
        ura: p.riichi ? count(this.uraIndicators, tiles) + count(this.uraIndicators, babeiTiles) : 0,
        aka: tiles.filter((t) => this.akaSet.has(t)).length,
        babei: babeiTiles.length,
        babeiAsDora
      };
    }
    // 剔除库合并出来的「ドラ」条目。
    //
    // 实机 15/15 例证明：宝牌**不进** yiFans，只走 baoFan / liBaoFan / redBaoFan / baBeiFan
    // 四个专用字段，且 totalFan = Σ(yiFans.fan) + 四项宝牌之和。
    // 之前这里把宝牌又 push 回 yiFans，客户端结算界面按
    // 「役列表 + 宝牌行」渲染时宝牌被算了两遍。
    rebuildYiFans(yiFans) {
      return yiFans.filter((y) => y.yiType !== YiType.Bao && y.yiType !== YiType.RedBao && y.yiType !== YiType.LiBao && y.yiType !== YiType.BaBeiBao);
    }
    recordHumanHandStats(result, huDelta, dealerContinues) {
      const stats = this.matchStats;
      const human = this.players[0];
      stats.hands += 1;
      if (human.riichi) stats.riichi += 1;
      if (human.melds.some((meld) => meld.type === "chi" || meld.type === "pon" || meld.type === "kan")) stats.calls += 1;
      const winners = result.type === "tsumo" ? [result.winner] : result.type === "ron" ? result.winners : [];
      if (winners.includes(0)) {
        stats.wins += 1;
        stats[result.type] += 1;
        stats.winPoints += Math.max(0, huDelta?.[0] || 0);
        stats.winTurns += this.xunNum;
      }
      if (result.type === "ron" && result.loser === 0) stats.dealIns += 1;
      if (dealerContinues && this.dealerSeat === 0) stats.maxRenchan = Math.max(stats.maxRenchan, this.renchanCount);
    }
    prepareFinalResult(scores, isFinal) {
      if (!isFinal || this._finalResult || !this.onFinalResult) return;
      this._finalResult = this.onFinalResult(scores.slice(), this) || null;
    }
    buildStopUserInfos(scores, winner, detail, tenpai, isFinal, huDelta) {
      const out = [];
      const order = this.players.map((_, seat) => seat).sort((left, right) => scores[right] - scores[left] || left - right);
      const rankOf = [];
      order.forEach((seat, index) => {
        rankOf[seat] = index + 1;
      });
      const winnerSeats = new Set(Array.isArray(winner) ? winner : winner == null ? [] : [winner]);
      const uma = this.playersN === 3 ? [15, 0, -15] : [15, 5, -5, -15];
      for (let s = 0; s < this.playersN; s++) {
        const p = this.players[s];
        const isWinner = winnerSeats.has(s);
        const currentDetail = detail instanceof Map ? detail.get(s) : isWinner ? detail : null;
        const rankResult = isFinal && s === 0 ? this._finalResult?.rank : null;
        const change = huDelta ? huDelta[s] || 0 : 0;
        const handStart = this.scores ? this.scores[s] : this.startScore;
        const netDelta = scores[s] - handStart;
        const rank = rankOf[s];
        const jing = isFinal ? (scores[s] - this.startScore) / 1e3 + uma[rank - 1] : 0;
        out.push({
          seat: s,
          score: scores[s],
          handCards: p.hand.slice(),
          changeScore: netDelta,
          yiFans: currentDetail?.yiFans || [],
          baoFan: currentDetail?.baoFan || 0,
          liBaoFan: currentDetail?.liBaoFan || 0,
          redBaoFan: currentDetail?.redBaoFan || 0,
          fu: currentDetail?.fu || 0,
          totalFan: currentDetail?.totalFan || 0,
          isYiMan: currentDetail?.isYiMan || false,
          manType: currentDetail?.manType || 0,
          baBeiFan: currentDetail?.baBeiFan || 0,
          doorCardsInfos: p.melds.filter((m) => m.type !== "babei").map((m) => ({
            cards: m.tiles.slice(),
            action: m.type === "chi" ? PlayAction.Chi : m.type === "pon" ? PlayAction.Peng : m.type === "ankan" ? PlayAction.AnGang : PlayAction.MingGang,
            qiangSeat: m.from != null ? m.from : s
          })),
          // tings 同样是牌种编码（copy=0）：实机流局样本 [230]/[260,230]/[160,130]
          tings: tenpai ? tenpai[s] ? (p.waits || []).map((k) => k * 10) : [] : [],
          alreadyRiichi: p.riichi,
          baBeiCards: p.melds.filter((m) => m.type === "babei").map((m) => m.tiles[0]),
          rank,
          // 因和牌役番产生的纯打点（只含番符，不含本场棒/立直棒/听牌罚符）。
          yiFanChangeDian: change,
          jingSuanScore: jing,
          jieBi: Math.round(jing * 100),
          changePT: rankResult?.change || 0,
          isBaoPai: false,
          matchingScore: 0,
          isMatchingAward: false,
          lianZhuang: this.honba,
          maxFan: currentDetail?.totalFan || 0,
          realJieBi: 0,
          finalBi: 0,
          level: 0,
          loveValue: 0,
          oldLevel: 0,
          oldLoveValue: 0,
          ptLevel: rankResult?.level || 0,
          ptPoint: rankResult?.point || 0,
          oldPTLevel: rankResult?.oldLevel || 0,
          oldPTPoint: rankResult?.oldPoint || 0,
          itemRewardLevel: 0,
          itemRewards: []
        });
      }
      return out;
    }
    decideGameOver(dealerContinues, scores, { drawNoPenalty = false, multiRonDealerContinuation = false } = {}) {
      if (scores.some((score2) => score2 < 0)) return true;
      if (this.handIndex + 1 >= this.maxHands) return true;
      if (drawNoPenalty) return false;
      const necessary = this.playersN === 3 ? 4e4 : 3e4;
      const order = this.players.map((_, seat) => seat).sort((left, right) => scores[right] - scores[left] || left - right);
      const topSeat = order[0];
      const topMeets = scores[topSeat] >= necessary;
      const lastSeat = this.juNum === this.playersN - 1;
      if (this.roundWind < this.regularWinds || this.roundWind === this.regularWinds && !lastSeat) return false;
      if (this.roundWind === this.regularWinds) {
        if (dealerContinues) return topSeat === this.dealerSeat && topMeets;
        return topMeets;
      }
      if (multiRonDealerContinuation) return false;
      if (topMeets) return true;
      return lastSeat && !dealerContinues;
    }
    async finishHand(gameOver, dealerContinues, scores, { draw: draw2 = false } = {}) {
      this.scores = scores.slice();
      this.handIndex += 1;
      if (draw2 || dealerContinues) {
        this.honba += 1;
      } else {
        this.honba = 0;
      }
      if (!dealerContinues) {
        this.juNum += 1;
        this.dealerSeat = this.nextSeat(this.dealerSeat);
        if (this.juNum >= this.playersN) {
          this.juNum = 0;
          this.roundWind += 1;
        }
      }
      if (gameOver) {
        this.matchOver = true;
        this.finished = true;
        return;
      }
      await this._d(this.T.hand);
    }
    /** 重置为一局全新东风战（分数归位、局号/本场/庄家清零）。
     *  注意：终局【不】走这里——真实服终局后引擎就停了，新一场是重新匹配出来的新房间、
     *  由 20403 链路 new 一个 GameEngine（见 finishHand 的注释）。此方法仅留给外部复用。 */
    resetMatch() {
      this.scores = new Array(this.playersN).fill(this.startScore);
      this.handIndex = 0;
      this.juNum = 0;
      this.roundWind = 1;
      this.honba = 0;
      this.renchanCount = 0;
      this.dealerSeat = 0;
    }
    // ================= AI =================
    aiTurn(seat, drew, can, cantPlays = []) {
      const p = this.players[seat];
      if (can.includes(PlayAction.Hu)) return { action: PlayAction.Hu, card: p.drawnTile };
      const danger = this.dangerKinds(seat);
      if (can.includes(PlayAction.BaBei)) {
        const north = this.northInHand(p);
        if (north != null) return { action: PlayAction.BaBei, card: north };
      }
      if (can.includes(PlayAction.Riichi)) {
        const decision = this.riichiDecision(p, danger);
        if (decision) return decision;
      }
      if (can.includes(PlayAction.AnGang) && this.aiWantsKan(p, danger)) {
        return { action: PlayAction.AnGang, card: this.concealedQuadTile(p) };
      }
      if (can.includes(PlayAction.PengGang) && this.aiWantsKan(p, danger)) {
        return { action: PlayAction.PengGang, card: this.addedKanTile(p) };
      }
      const currentShanten = this.currentShanten(p);
      const fold = this.aiShouldFold(p, currentShanten, danger);
      const best = this.bestDiscard(p, {
        forbiddenKinds: new Set(cantPlays.map((value) => Math.floor(value / 10))),
        dangerKinds: danger,
        dangerWeight: fold ? 22 : currentShanten <= 1 ? 4 : 8,
        maxShantenLoss: fold ? currentShanten >= 3 ? 2 : 1 : 0,
        shantenLossPenalty: fold ? 90 : 260,
        forced: p.riichi && p.riichiTurn !== this.xunNum ? p.drawnTile : null
      });
      return { action: PlayAction.Normal, card: best.discardId };
    }
    dangerKinds(seat) {
      const threats = this.players.filter((player) => player.seat !== seat).map((player) => ({
        player,
        openMelds: player.melds.filter((meld) => meld.type !== "ankan" && meld.type !== "babei").length,
        level: player.riichi ? 1 : player.melds.filter((meld) => meld.type !== "ankan" && meld.type !== "babei").length >= 2 ? 0.55 : 0
      })).filter((threat) => threat.level > 0);
      if (!threats.length) return null;
      const visible = this.visibleCounts();
      const riskByKind = /* @__PURE__ */ new Map();
      const safe = /* @__PURE__ */ new Set();
      const risky = /* @__PURE__ */ new Set();
      for (let suit = 1; suit <= 4; suit++) {
        const maxRank = suit === 4 ? 7 : 9;
        for (let rank = 1; rank <= maxRank; rank++) {
          const kind = suit * 10 + rank;
          const idx = tileIndex(tileId(suit, rank, 1));
          let risk = 0;
          for (const { player, level } of threats) {
            if (player.discardKinds.has(kind)) continue;
            let threatRisk;
            if (suit === 4) {
              const shown = visible[idx] || 0;
              threatRisk = shown >= 3 ? 0 : shown === 2 ? 4 : shown === 1 ? 9 : 14;
            } else {
              threatRisk = rank === 1 || rank === 9 ? 8 : rank === 2 || rank === 8 ? 12 : rank === 3 || rank === 7 ? 15 : 19;
              const sujiSafe = [rank - 3, rank + 3].some((otherRank) => otherRank >= 1 && otherRank <= 9 && player.discardKinds.has(suit * 10 + otherRank));
              if (sujiSafe) threatRisk *= 0.48;
              const leftWall = rank > 1 && visible[idx - 1] >= 4;
              const rightWall = rank < 9 && visible[idx + 1] >= 4;
              if (leftWall || rightWall) threatRisk *= 0.55;
              if (rank === 1 && rightWall || rank === 9 && leftWall) threatRisk = 0;
            }
            risk = Math.max(risk, threatRisk * level);
          }
          riskByKind.set(kind, risk);
          if (risk === 0) safe.add(kind);
          else if (risk >= 12) risky.add(kind);
        }
      }
      return { threats: threats.length, safe, risky, riskByKind };
    }
    aiShouldFold(p, shanten, danger) {
      if (!danger) return false;
      const ranks = this.players.map((player) => player.score).sort((a, b) => b - a);
      const leading = p.score === ranks[0];
      const allLast = this.isAllLast();
      if (allLast && !leading) return shanten >= 3;
      if (allLast && leading) return shanten >= 1;
      const dora = p.hand.filter((tile) => this.doraKinds().has(kindOf2(tile)) || this.akaSet.has(tile)).length;
      if (shanten >= 3) return true;
      if (shanten === 2 && dora < 2) return true;
      return shanten === 1 && danger.threats > 1 && dora === 0;
    }
    riichiDecision(p, danger) {
      const discardKinds = this.formalTenpaiDiscards(p);
      let best = null;
      const remainOf = this.remainOfFor(p);
      for (const kind of discardKinds) {
        const card = p.hand.find((tile) => kindOf2(tile) === kind && !this.akaSet.has(tile)) ?? p.hand.find((tile) => kindOf2(tile) === kind);
        const hand = p.hand.slice();
        hand.splice(hand.indexOf(card), 1);
        const waits = handWaits(hand, p.melds, remainOf);
        let damaYaku = false;
        for (const wait of waits.waits) {
          if (calcWin(hand, p.melds, this.akaSet, this.winOpts(p, true, wait)).hasYaku) {
            damaYaku = true;
            break;
          }
        }
        const candidate = { card, ukeire: waits.ukeire, waitCount: waits.waitKinds.length, damaYaku };
        if (!best || candidate.ukeire > best.ukeire || candidate.ukeire === best.ukeire && candidate.waitCount > best.waitCount || candidate.ukeire === best.ukeire && candidate.waitCount === best.waitCount && candidate.card < best.card) best = candidate;
      }
      if (!best) return null;
      const scores = this.players.map((player) => player.score);
      const leading = p.score === Math.max(...scores);
      const lead = p.score - Math.max(...scores.filter((_, seat) => seat !== p.seat));
      const badWait = best.ukeire <= 2 || best.waitCount === 1 && best.ukeire <= 3;
      if (best.damaYaku && (danger && badWait || this.isAllLast() && leading && lead >= 8e3)) {
        return { action: PlayAction.Normal, card: best.card };
      }
      if (best.ukeire <= 0 && best.damaYaku) return { action: PlayAction.Normal, card: best.card };
      return { action: PlayAction.Riichi, card: best.card };
    }
    aiWantsKan(p, danger = null) {
      const scores = this.players.map((player) => player.score);
      const leading = p.score === Math.max(...scores);
      if (danger || this.isAllLast() && leading) return false;
      if (p.riichi) return true;
      const shanten = this.currentShanten(p);
      const dora = p.hand.filter((tile) => this.doraKinds().has(kindOf2(tile)) || this.akaSet.has(tile)).length;
      return shanten >= 2 || dora >= 2 || p.seat === this.dealerSeat && shanten >= 1;
    }
    aiClaim(seat, discarderSeat, card, can) {
      const p = this.players[seat];
      if (can.includes(PlayAction.Hu)) return { action: PlayAction.Hu };
      const current = this.currentShanten(p);
      const danger = this.dangerKinds(seat);
      if (this.aiShouldFold(p, current, danger)) return null;
      if (can.includes(PlayAction.MingGang)) {
        const after = this.shantenAfterClaim(p, card, "pon");
        if (after <= current && this.worthOpening(p, card, "kan") && this.aiWantsKan(p, danger)) {
          return { action: PlayAction.MingGang, otherCards: this.previewTiles(p, card, 3) };
        }
      }
      if (can.includes(PlayAction.Peng)) {
        const after = this.shantenAfterClaim(p, card, "pon");
        if (after < current && this.worthOpening(p, card, "pon")) {
          return { action: PlayAction.Peng, otherCards: this.previewTiles(p, card, 2) };
        }
      }
      if (can.includes(PlayAction.Chi)) {
        let best = null;
        for (const option of this.chiOptions(p, card)) {
          const after = this.shantenAfterClaim(p, card, "chi", option);
          const candidate = { option, after };
          if (!best || candidate.after < best.after || candidate.after === best.after && candidate.option.join() < best.option.join()) best = candidate;
        }
        if (best && best.after < current && this.worthOpening(p, card, "chi", best.option)) {
          return { action: PlayAction.Chi, otherCards: best.option };
        }
      }
      return null;
    }
    currentShanten(p) {
      return handShanten(p.hand, p.melds);
    }
    isYakuhaiKind(p, kind) {
      const { suit, rank } = decodeId(tileId(Math.floor(kind / 10), kind % 10, 1));
      return suit === 4 && (rank >= 5 || rank === this.roundWind || rank === this.seatWindOf(p.seat));
    }
    hasOpenYakuRoute(p, card, claimKind, used = []) {
      const proposedType = claimKind === "chi" ? "chi" : claimKind === "kan" ? "kan" : "pon";
      const claimTiles = claimKind === "chi" ? used : this.previewTiles(p, card, claimKind === "kan" ? 3 : 2);
      const hand = p.hand.filter((tile) => !claimTiles.includes(tile));
      const proposed = { type: proposedType, tiles: [...claimTiles, card] };
      const melds = realMelds(p.melds).concat([proposed]);
      const tiles = hand.concat(melds.flatMap((meld) => meld.tiles));
      const tripletKinds = new Set(melds.filter((meld) => meld.type === "pon" || meld.type === "kan" || meld.type === "ankan").map((meld) => kindOf2(meld.tiles[0])));
      if (claimKind !== "chi" && this.isYakuhaiKind(p, kindOf2(card))) return true;
      if ([...tripletKinds].some((kind) => this.isYakuhaiKind(p, kind))) return true;
      const decoded = tiles.map(decodeId);
      if (decoded.every(({ suit, rank }) => suit !== 4 && rank >= 2 && rank <= 8)) return true;
      const suits = new Set(decoded.filter(({ suit }) => suit !== 4).map(({ suit }) => suit));
      if (suits.size <= 1) return true;
      if (melds.every((meld) => meld.type !== "chi")) {
        const counts = /* @__PURE__ */ new Map();
        for (const tile of hand) counts.set(kindOf2(tile), (counts.get(kindOf2(tile)) || 0) + 1);
        const pairOrTriplet = [...counts.values()].filter((count) => count >= 2).length;
        if (pairOrTriplet + melds.length >= 4) return true;
      }
      return false;
    }
    worthOpening(p, card, kind, used = []) {
      if (!this.hasOpenYakuRoute(p, card, kind, used)) return false;
      const current = this.currentShanten(p);
      if (kind === "pon" && this.isYakuhaiKind(p, kindOf2(card))) return true;
      const doraKinds = this.doraKinds();
      const dora = p.hand.filter((tile) => doraKinds.has(kindOf2(tile)) || this.akaSet.has(tile)).length;
      return current <= 2 || dora >= 2;
    }
    shantenAfterClaim(p, card, kind, chiTiles = null) {
      const hand = p.hand.slice();
      let meld;
      if (kind === "pon") {
        const used = [];
        for (let i = 0; i < 2; i++) {
          const idx = hand.findIndex((t) => kindOf2(t) === kindOf2(card));
          if (idx >= 0) used.push(hand.splice(idx, 1)[0]);
        }
        if (used.length < 2) return 99;
        meld = { type: "pon", tiles: [...used, card] };
      } else {
        if (!chiTiles) return 99;
        for (const t of chiTiles) {
          const i = hand.indexOf(t);
          if (i >= 0) hand.splice(i, 1);
        }
        meld = { type: "chi", tiles: [...chiTiles, card] };
      }
      const action2 = kind === "chi" ? PlayAction.Chi : PlayAction.Peng;
      const forbiddenKinds = this.kuikaeKinds(action2, meld.tiles, card);
      try {
        return chooseDiscard(hand, p.melds.concat([meld]), {
          doraKinds: this.doraKinds(),
          akaSet: this.akaSet,
          forbiddenKinds
        }).shanten;
      } catch {
        return 99;
      }
    }
    previewTiles(p, card, n) {
      const out = [];
      const seen = /* @__PURE__ */ new Set();
      for (const t of p.hand) {
        if (kindOf2(t) === kindOf2(card) && !seen.has(t)) {
          out.push(t);
          seen.add(t);
        }
        if (out.length >= n) break;
      }
      return out;
    }
    // ================= 人类输入 =================
    // 注意竞态：awaitTurn 先 emit(NtfSendCard) 再 await waitHuman('draw') 设置 _pending。
    // 客户端在收到 NtfSendCard 的瞬间就可能调用 submitDraw，此时 _pending 尚未就绪，
    // 直接调用会成 no-op 导致引擎永久等待。因此 submitDraw/submitClaim 在未就绪时
    // 缓存请求，waitHuman 进入等待时立即消费缓冲，避免死锁。
    setInternalState(values) {
      for (const [key, value] of Object.entries(values || {})) {
        const state = Number(key);
        if (Number.isInteger(state) && state >= 0 && state <= 5) this.internalState[state] = !!value;
      }
    }
    setHumanAutoplay(enabled) {
      this.autoHuman = !!enabled;
      if (!this.autoHuman || !this._pending) return;
      const pending = this._pending;
      this.resolveHumanPending(pending, this.timeoutHumanAction(pending.kind));
    }
    automaticHumanAction(kind) {
      const expected = kind === "draw" ? this._expectedDraw : this._expectedClaim;
      if (!expected) return null;
      if (expected.actions.includes(PlayAction.Hu) && this.internalState[1]) return { action: PlayAction.Hu };
      if (kind === "claim") return this.internalState[2] ? { action: PlayAction.Guo, otherCards: [] } : null;
      const player = this.players[expected.seat];
      if (expected.actions.includes(PlayAction.AnGang) && player.riichi && this.internalState[4]) {
        return { action: PlayAction.AnGang, card: this.concealedQuadTile(player) };
      }
      if (expected.actions.includes(PlayAction.BaBei) && player.riichi && this.internalState[5]) {
        return { action: PlayAction.BaBei, card: this.northInHand(player) };
      }
      if (this.internalState[3] && expected.drew && player.drawnTile != null) {
        return { action: PlayAction.Normal, card: player.drawnTile };
      }
      return null;
    }
    timeoutHumanAction(kind) {
      if (kind === "claim") return { action: PlayAction.Guo, otherCards: [] };
      const expected = this._expectedDraw;
      const player = this.players[expected.seat];
      if (expected.drew && player.drawnTile != null) return { action: PlayAction.Normal, card: player.drawnTile };
      const forbiddenKinds = new Set((expected.cantPlays || []).map((value) => Math.floor(value / 10)));
      return { action: PlayAction.Normal, card: this.bestDiscard(player, { forbiddenKinds }).discardId };
    }
    resolveHumanPending(pending, payload) {
      if (this._pending !== pending) return;
      if (pending.timer) clearTimeout(pending.timer);
      const player = this.players[0];
      const elapsed = (Date.now() - pending.startedAt) / 1e3;
      const timeBank = Number.isFinite(player.timeBank) ? player.timeBank : this.extraTime;
      player.timeBank = Math.max(0, timeBank - Math.max(0, elapsed - this.baseTime));
      if (pending.kind === "draw") this._expectedDraw = null;
      else this._expectedClaim = null;
      this._pending = null;
      pending.resolve(payload || {});
    }
    waitHuman(kind) {
      return new Promise((resolve) => {
        const pending = { kind, resolve, startedAt: Date.now(), timer: null };
        this._pending = pending;
        const buffered = kind === "draw" ? this._bufferedDraw : this._bufferedClaim;
        if (buffered != null) {
          if (kind === "draw") this._bufferedDraw = null;
          else this._bufferedClaim = null;
          this.resolveHumanPending(pending, buffered);
          return;
        }
        if (this.autoHuman) {
          const payload = this.automaticHumanAction(kind) || this.timeoutHumanAction(kind);
          queueMicrotask(() => this.resolveHumanPending(pending, payload));
          return;
        }
        const player = this.players[0];
        const timeoutMs = Math.max(0, this.baseTime + player.timeBank) * 1e3;
        pending.timer = setTimeout(() => {
          const payload = this.timeoutHumanAction(kind);
          this.resolveHumanPending(pending, payload);
        }, timeoutMs);
        if (this.automaticHumanAction(kind)) {
          queueMicrotask(() => {
            if (this._pending !== pending) return;
            const automatic = this.automaticHumanAction(kind);
            if (automatic) this.resolveHumanPending(pending, automatic);
          });
        }
      });
    }
    submitDraw(payload) {
      const result = this.validateTurnPayload(payload);
      if (result !== Result.Succ) return result;
      this._expectedDraw = null;
      this._processing = true;
      if (this._pending && this._pending.kind === "draw") {
        this.resolveHumanPending(this._pending, payload || {});
      } else {
        this._bufferedDraw = payload || {};
      }
      return Result.Succ;
    }
    submitClaim(payload) {
      const result = this.validateClaimPayload(payload);
      if (result !== Result.Succ) return result;
      this._expectedClaim = null;
      this._processing = true;
      if (this._pending && this._pending.kind === "claim") {
        this.resolveHumanPending(this._pending, payload || {});
      } else {
        this._bufferedClaim = payload || {};
      }
      return Result.Succ;
    }
    cancelPending() {
      this._expectedDraw = null;
      this._expectedClaim = null;
      this._bufferedDraw = null;
      this._bufferedClaim = null;
      if (!this._pending) return;
      if (this._pending.timer) clearTimeout(this._pending.timer);
      const resolve = this._pending.resolve;
      this._pending = null;
      resolve({});
    }
    // 调试快照
    snapshot() {
      return {
        ju: this.juNum,
        honba: this.honba,
        dealer: this.dealerSeat,
        remain: this.remain,
        dora: this.doraIndicators.map(tileName),
        players: this.players.map((p) => ({
          seat: p.seat,
          score: p.score,
          riichi: p.riichi,
          hand: p.hand.map(tileName).join(" "),
          melds: p.melds.map((m) => m.type + ":" + m.tiles.map(tileName).join("")).join(" ")
        }))
      };
    }
  };
  function mulberry32(a) {
    return function() {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // mockjs/pb.mjs
  var import_light = __toESM(require_light(), 1);

  // mockjs/riichi_desc.mjs
  var riichiDesc = { "nested": { "riichi": { "options": { "optimize_for": "SPEED", "go_package": "gitlab.gg.com/riichi_mahjong/proto/go/client/game_logic/riichi", "csharp_namespace": "Com.Framework.Protocol" }, "nested": { "CardType": { "values": { "None": 0, "Wan": 1, "Tong": 2, "Tiao": 3, "Zi": 4, "Hua": 5 } }, "Result": { "values": { "Succ": 0, "Fail_InternalError": 1, "Fail_InvalidParam": 2, "Fail_InvalidSequence": 3, "Fail_ActionNotInCanPlayActions": 101, "Fail_CardInCantPlays": 102, "Fail_RiichiPlayCardWrong": 103, "Fail_CardNotInHand": 104, "Fail_CardNotMatchAction": 105, "Fail_ActionNotInCanQiangActions": 201, "Fail_InvalidOtherCards": 202 } }, "Wind": { "values": { "East": 0, "South": 1, "West": 2, "North": 3 } }, "RiichiMsg": { "values": { "ENone": 0, "EReqPrepare": 1, "ERspPrepare": 2, "EReqPlayCard": 3, "ERspPlayCard": 4, "EReqQiangCard": 5, "ERspQiangCard": 6, "EReqSetInternalState": 7, "ERspSetInternalState": 8, "EReqCloseOfflineTip": 9, "ERspCloseOfflineTip": 10, "EReqClickUI": 11, "ERspClickUI": 12, "ENtfToPrepare": 1001, "ENtfPrepare": 1002, "ENtfGameStart": 1003, "ENtfSendCard": 1004, "ENtfPlayCard": 1005, "ENtfQiangCard": 1006, "ENtfQiangCardEnd": 1007, "ENtfGameStop": 1008, "ENtfOfflineTip": 1009, "EGmBegin": 5e4, "EGmReqStopGame": 50001, "EGmRspStopGame": 50002, "EGmReqInitCard": 50003, "EGmRspInitCard": 50004, "EGmReqSetRobotConfig": 50005, "EGmRspSetRobotConfig": 50006, "EGmEnd": 6e4 } }, "PlayAction": { "values": { "Normal": 0, "Guo": 1, "Chi": 2, "Peng": 3, "MingGang": 4, "PengGang": 5, "AnGang": 6, "Riichi": 7, "Hu": 8, "JiuZhongJiuLiuJu": 9, "BaBei": 10 } }, "FanFuType": { "values": { "NoFanFu": 0, "FanFuNormal": 1 } }, "YiType": { "values": { "NoYi": 0, "RedBao": 101, "Bao": 102, "LiBao": 103, "BaBeiBao": 104, "LiZhi": 1101, "YiFa": 1102, "MengQianQingZiMoHu": 1103, "PingHu": 1104, "YiBeiKou": 1105, "DuanYaoJiu": 1301, "YiPaiZiFeng": 1302, "YiPaiChangFeng": 1303, "YiPaiSanYuanBai": 1304, "YiPaiSanYuanFa": 1305, "YiPaiSanYuanZhong": 1306, "LingShangKaiHua": 1307, "HaiDiLaoYue": 1308, "HeDiMoYu": 1309, "QiangGang": 1310, "YiPaiBeiFeng": 1311, "ShuangLiZi": 2101, "QiDuiZi": 2102, "HunQuanDaiYaoJiu": 2201, "YiQiTongGuan": 2202, "SanSeTongShun": 2203, "SanSeTongKe": 2301, "SanAnKe": 2302, "SanGangZi": 2303, "DuiDuiHu": 2304, "HunLaoTou": 2305, "XiaoSanYuan": 2306, "ErBeiKou": 3101, "ChunQuanDaiYaoJiu": 3201, "HunYiSe": 3202, "LiuJuManGuan": 5301, "QingYiSe": 6201, "TianHu": 91101, "DiHu": 91102, "GuoShiWuShuang": 91103, "JiuLianBaoDeng": 91104, "SiAnKe": 91105, "SiGangZi": 91301, "QingLaoTou": 91302, "ZiYiSe": 91303, "XiaoSiXi": 91304, "DaSanYuan": 91305, "LvYiSe": 91306, "GuoShiWuShuangShiSanMian": 92101, "ChunZhengJiuLianBaoDeng": 92102, "SiAnKeDanQi": 92103, "DaSiXi": 92301 } }, "LiuJuType": { "values": { "HuangPai": 0, "SiFengLianDa": 1, "SiGang": 2, "JiuZhongJiuPai": 3, "SiJiaLiZhi": 4 } }, "ManType": { "values": { "NoMan": 0, "ManGuan": 1, "TiaoMan": 2, "BeiMan": 3, "SanBeiMan": 4, "YiMan": 5 } }, "InternalStateType": { "values": { "LiPai": 0, "HuPai": 1, "PengGangChi": 2, "MoQie": 3, "LiZhiGang": 4, "LiZhiBoBei": 5 } }, "ZhenTingType": { "values": { "ZhenTingType_RiichiFuriten": 0, "ZhenTingType_TemporaryFuriten": 1, "ZhenTingType_SelfFuriten": 2 } }, "ClickUIType": { "values": { "ClickUITypeUnknown": 0, "ClickUITypeNoYiTip": 1 } }, "EnumItemRewardLevel": { "values": { "enumItemRewardLevelNo": 0, "enumItemRewardLevelOneHan": 1, "enumItemRewardLevelTwoHan": 2, "enumItemRewardLevelThreeHan": 3, "enumItemRewardLevelFourHan": 4, "enumItemRewardLevelMangan": 5, "enumItemRewardLevelJumpFullHan": 6, "enumItemRewardLevelDoubleFullHan": 7, "enumItemRewardLevelTripleFullHan": 8, "enumItemRewardLevelYakuman": 9, "enumItemRewardLevelDoubleYakuman": 10 } }, "TingInfo": { "fields": { "play": { "type": "int32", "id": 1 }, "ting": { "type": "int32", "id": 2 }, "hasYiWhenMo": { "type": "bool", "id": 3 }, "yiManChance": { "type": "int32", "id": 4 }, "fanFuTypeWhenMo": { "type": "int32", "id": 5 }, "hasYiWhenRong": { "type": "bool", "id": 6 }, "manType": { "type": "ManType", "id": 7 } } }, "YiFan": { "fields": { "yiType": { "type": "int32", "id": 1 }, "fan": { "type": "int32", "id": 2 }, "isYiMan": { "type": "bool", "id": 3 }, "isFuLuMinus": { "type": "bool", "id": 4 } } }, "ToPrepareUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "userID": { "type": "uint64", "id": 2 } } }, "NtfToPrepare": { "fields": { "userInfos": { "rule": "repeated", "type": "ToPrepareUserInfo", "id": 1 } } }, "PrepareUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 } } }, "NtfPrepare": { "fields": { "seat": { "type": "int32", "id": 1 }, "userInfos": { "rule": "repeated", "type": "PrepareUserInfo", "id": 2 } } }, "GameStartUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "score": { "type": "int64", "id": 2 }, "initScore": { "type": "int64", "id": 3 }, "handCards": { "rule": "repeated", "type": "int32", "id": 4 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 5 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 6 }, "xunNum": { "type": "int32", "id": 7 } } }, "NtfGameStart": { "fields": { "changWind": { "type": "int32", "id": 1 }, "juNum": { "type": "int32", "id": 2 }, "benChangNum": { "type": "int32", "id": 3 }, "zhuangSeat": { "type": "int32", "id": 4 }, "baoPreCard": { "type": "int32", "id": 6 }, "remainDuiCardNum": { "type": "int32", "id": 7 }, "userInfos": { "rule": "repeated", "type": "GameStartUserInfo", "id": 9 }, "leftTimer": { "type": "int32", "id": 11 }, "defaultMinTimeout": { "type": "int32", "id": 12 }, "riichiBangNum": { "type": "int32", "id": 13 }, "isAllLast": { "type": "bool", "id": 14 }, "gameID": { "type": "string", "id": 15 }, "duiCardsStrEncode": { "type": "string", "id": 16 }, "duiCardsStrSaltEncode": { "type": "string", "id": 17 }, "ServerRedundantTimeOut": { "type": "int32", "id": 23 }, "FirstGameStartRedundantTimeOut": { "type": "int32", "id": 24 } } }, "SendCardUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "card": { "type": "int32", "id": 2 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 3 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 4 }, "leftTimer": { "type": "int32", "id": 5 }, "isZhenTing": { "type": "bool", "id": 6 }, "xunNum": { "type": "int32", "id": 7 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 8 } } }, "NtfSendCard": { "fields": { "seat": { "type": "int32", "id": 1 }, "baoPreCard": { "type": "int32", "id": 3 }, "userInfos": { "rule": "repeated", "type": "SendCardUserInfo", "id": 4 } } }, "PlayCardUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "canQiangActions": { "rule": "repeated", "type": "int32", "id": 2 }, "isZhenTing": { "type": "bool", "id": 6 }, "leftTimer": { "type": "int32", "id": 7 }, "canAnGangNoNumCardsAfterRiichi": { "rule": "repeated", "type": "int32", "id": 8 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 9 } } }, "NtfPlayCard": { "fields": { "seat": { "type": "int32", "id": 1 }, "card": { "type": "int32", "id": 2 }, "action": { "type": "int32", "id": 3 }, "isMoQie": { "type": "bool", "id": 5 }, "userInfos": { "rule": "repeated", "type": "PlayCardUserInfo", "id": 6 } } }, "QiangCardUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 } } }, "NtfQiangCard": { "fields": { "seat": { "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 3 }, "userInfos": { "rule": "repeated", "type": "QiangCardUserInfo", "id": 4 } } }, "QiangCardEndUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 2 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 3 }, "isZhenTing": { "type": "bool", "id": 4 }, "cantPlays": { "rule": "repeated", "type": "int32", "id": 5 }, "leftTimer": { "type": "int32", "id": 6 }, "xunNum": { "type": "int32", "id": 7 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 8 } } }, "NtfQiangCardEnd": { "fields": { "seats": { "rule": "repeated", "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 3 }, "userInfos": { "rule": "repeated", "type": "QiangCardEndUserInfo", "id": 4 } } }, "GameStopUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "score": { "type": "int64", "id": 2 }, "handCards": { "rule": "repeated", "type": "int32", "id": 3 }, "changeScore": { "type": "int64", "id": 4 }, "yiFans": { "rule": "repeated", "type": "YiFan", "id": 5 }, "baoFan": { "type": "int32", "id": 6 }, "liBaoFan": { "type": "int32", "id": 7 }, "redBaoFan": { "type": "int32", "id": 8 }, "fu": { "type": "int32", "id": 9 }, "totalFan": { "type": "int32", "id": 10 }, "isYiMan": { "type": "bool", "id": 11 }, "jingSuanScore": { "type": "float", "id": 12 }, "changePT": { "type": "int64", "id": 13 }, "rank": { "type": "int32", "id": 14 }, "doorCardsInfos": { "rule": "repeated", "type": "DoorCardsInfo", "id": 15 }, "tings": { "rule": "repeated", "type": "int32", "id": 16 }, "manType": { "type": "int32", "id": 17 }, "alreadyRiichi": { "type": "bool", "id": 18 }, "baBeiCards": { "rule": "repeated", "type": "int32", "id": 19 }, "baBeiFan": { "type": "int32", "id": 20 }, "yiFanChangeDian": { "type": "int64", "id": 21 }, "isBaoPai": { "type": "bool", "id": 22 }, "jieBi": { "type": "int64", "id": 23 }, "matchingScore": { "type": "int32", "id": 24 }, "isMatchingAward": { "type": "bool", "id": 25 }, "lianZhuang": { "type": "int32", "id": 26 }, "maxFan": { "type": "int32", "id": 27 }, "realJieBi": { "type": "int64", "id": 28 }, "finalBi": { "type": "int64", "id": 29 }, "level": { "type": "int64", "id": 103 }, "loveValue": { "type": "int64", "id": 104 }, "oldLevel": { "type": "int64", "id": 105 }, "oldLoveValue": { "type": "int64", "id": 106 }, "ptLevel": { "type": "int32", "id": 107 }, "ptPoint": { "type": "int32", "id": 108 }, "oldPTLevel": { "type": "int32", "id": 109 }, "oldPTPoint": { "type": "int32", "id": 110 }, "itemRewardLevel": { "type": "int32", "id": 111 }, "itemRewards": { "rule": "repeated", "type": "ItemReward", "id": 112 } } }, "ItemReward": { "fields": { "itemId": { "type": "int64", "id": 1 }, "itemCount": { "type": "int64", "id": 2 } } }, "NtfGameStop": { "fields": { "huSeats": { "rule": "repeated", "type": "int32", "id": 1 }, "huCardSeat": { "type": "int32", "id": 2 }, "huCard": { "type": "int32", "id": 3 }, "liBaoPreCards": { "rule": "repeated", "type": "int32", "id": 4 }, "isFinal": { "type": "bool", "id": 5 }, "userInfos": { "rule": "repeated", "type": "GameStopUserInfo", "id": 6 }, "baoPreCards": { "rule": "repeated", "type": "int32", "id": 7 }, "liuJuManGuanSeats": { "rule": "repeated", "type": "int32", "id": 8 }, "liuJuType": { "type": "int32", "id": 9 }, "liuJuSeat": { "type": "int32", "id": 10 }, "duiCards": { "rule": "repeated", "type": "int32", "id": 11 }, "duiCardsStr": { "type": "string", "id": 12 }, "duiCardsStrSalt": { "type": "string", "id": 13 }, "stopType": { "type": "int32", "id": 14 }, "winningStreak": { "type": "int32", "id": 15 } } }, "ReqPrepare": { "fields": {} }, "RspPrepare": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqPlayCard": { "fields": { "card": { "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "isTimeout": { "type": "bool", "id": 3 } } }, "RspPlayCard": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqQiangCard": { "fields": { "action": { "type": "int32", "id": 1 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 2 }, "isTimeout": { "type": "bool", "id": 3 } } }, "RspQiangCard": { "fields": { "result": { "type": "int32", "id": 1 } } }, "DoorCardsInfo": { "fields": { "cards": { "rule": "repeated", "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "qiangSeat": { "type": "int32", "id": 3 } } }, "Offline2OnlineUserInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "handCardsNum": { "type": "int32", "id": 2 }, "doorCardsInfos": { "rule": "repeated", "type": "DoorCardsInfo", "id": 3 }, "handCards": { "rule": "repeated", "type": "int32", "id": 4 }, "playedCards": { "rule": "repeated", "type": "int32", "id": 5 }, "PlayedCardsOtherTake": { "rule": "repeated", "type": "int32", "id": 6 }, "riichiTagCard": { "type": "int32", "id": 7 }, "alreadyRiichi": { "type": "bool", "id": 8 }, "tingInfos": { "rule": "repeated", "type": "TingInfo", "id": 9 }, "score": { "type": "int64", "id": 10 }, "canPlayActions": { "rule": "repeated", "type": "int32", "id": 11 }, "isZhenTing": { "type": "bool", "id": 12 }, "moQieMap": { "keyType": "int32", "type": "bool", "id": 14 }, "leftTimer": { "type": "int32", "id": 15 }, "cantPlays": { "rule": "repeated", "type": "int32", "id": 16 }, "changeScore": { "type": "int64", "id": 17 }, "baBeiCards": { "rule": "repeated", "type": "int32", "id": 18 }, "internalState": { "keyType": "int32", "type": "int32", "id": 19 }, "initScore": { "type": "int64", "id": 20 }, "canAnGangNoNumCardsAfterRiichi": { "rule": "repeated", "type": "int32", "id": 21 }, "DefaultMinTimeout": { "type": "int32", "id": 22 }, "ServerRedundantTimeOut": { "type": "int32", "id": 23 }, "zhenTingTypes": { "rule": "repeated", "type": "int32", "id": 24 }, "zhenTingTypesGuo": { "rule": "repeated", "type": "int32", "id": 25 } } }, "QiangInfo": { "fields": { "seat": { "type": "int32", "id": 1 }, "action": { "type": "int32", "id": 2 }, "otherCards": { "rule": "repeated", "type": "int32", "id": 3 } } }, "Offline2OnlineGameScene": { "fields": { "seat": { "type": "int32", "id": 1 }, "changWind": { "type": "int32", "id": 2 }, "juNum": { "type": "int32", "id": 3 }, "benChangNum": { "type": "int32", "id": 4 }, "zhuangSeat": { "type": "int32", "id": 5 }, "openBaoPreCards": { "rule": "repeated", "type": "int32", "id": 6 }, "remainDuiCardNum": { "type": "int32", "id": 7 }, "currentSeat": { "type": "int32", "id": 8 }, "currentPlayCard": { "type": "int32", "id": 9 }, "currentAction": { "type": "int32", "id": 10 }, "canQiangActions": { "rule": "repeated", "type": "int32", "id": 11 }, "qiangInfos": { "rule": "repeated", "type": "QiangInfo", "id": 12 }, "offline2OnlineUserInfos": { "rule": "repeated", "type": "Offline2OnlineUserInfo", "id": 13 }, "currentPlayEndTime": { "type": "int64", "id": 14 }, "currentQiangEndTime": { "type": "int64", "id": 15 }, "defaultMinTimeout": { "type": "int32", "id": 16 }, "ServerRedundantTimeOut": { "type": "int32", "id": 25 }, "riichiBangNum": { "type": "int32", "id": 17 }, "gameID": { "type": "string", "id": 18 }, "preSeat": { "type": "int32", "id": 19 }, "prePlayCard": { "type": "int32", "id": 20 }, "preAction": { "type": "int32", "id": 21 }, "preQiangInfos": { "rule": "repeated", "type": "QiangInfo", "id": 22 }, "duiCardsStrEncode": { "type": "string", "id": 23 }, "duiCardsStrSaltEncode": { "type": "string", "id": 24 }, "MapFriendPoll": { "keyType": "int32", "type": "bool", "id": 26 }, "FriendOutTime": { "type": "int64", "id": 27 } } }, "NtfOfflineToolTip": { "fields": { "isTempBlock": { "type": "bool", "id": 1 } } }, "SendBackOnlineReq": { "fields": {} }, "SendBackOnlineRsp": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqSetInternalState": { "fields": { "InternalState": { "keyType": "int32", "type": "int32", "id": 1 } } }, "RspSetInternalState": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqCloseOfflineTip": { "fields": {} }, "RspCloseOfflineTip": { "fields": { "result": { "type": "int32", "id": 1 } } }, "ReqClickUI": { "fields": { "tp": { "type": "int32", "id": 1 } } }, "RspClickUI": { "fields": { "result": { "type": "int32", "id": 1 } } }, "GmReqStopGame": { "fields": {} }, "GmRspStopGame": { "fields": {} }, "GmReqInitCard": { "fields": { "cardId": { "type": "int32", "id": 1 }, "isZimo": { "type": "bool", "id": 2 }, "isForbidRobotHu": { "type": "bool", "id": 3 } } }, "GmRspInitCard": { "fields": {} }, "GmReqSetRobotConfig": { "fields": { "robotSpeedLevel": { "type": "int32", "id": 1 } }, "nested": { "RobotSpeed": { "values": { "Normal": 0, "HalfTime": 1, "Fast": 2 } } } }, "GmRspSetRobotConfig": { "fields": {} }, "KRiichiMsg": { "fields": { "msgType": { "type": "RiichiMsg", "id": 1 }, "time": { "type": "int64", "id": 3 }, "payload": { "type": "bytes", "id": 100 } } } } } } };
  var riichi_desc_default = riichiDesc;

  // mockjs/pb.mjs
  var root = import_light.default.Root.fromJSON(riichi_desc_default);
  function encodeMsg(typeName, obj) {
    const T = root.lookupType("riichi." + typeName);
    const err = T.verify(obj);
    if (err) throw new Error("protobuf verify " + typeName + ": " + err);
    const msg = T.fromObject(obj);
    const buf = T.encode(msg).finish();
    return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  }
  function decodeMsg(typeName, buf) {
    const T = root.lookupType("riichi." + typeName);
    const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    const m = T.decode(u8);
    return T.toObject(m, { defaults: true, arrays: true, objects: true, enums: Number });
  }

  // mockjs/shop.mjs
  var shop_exports = {};
  __export(shop_exports, {
    SHOP_ERROR: () => SHOP_ERROR,
    SHOP_TYPE: () => SHOP_TYPE,
    purchase: () => purchase,
    refreshShop: () => refreshShop,
    synchronizeShop: () => synchronizeShop
  });

  // mockjs/economy_catalog.mjs
  var ECONOMY_CATALOG = {
    "source": "StreamingAssets/Bundles/WebGL/commonconfigs_d005e1531b1cf360239da815293e48c6.bundle",
    "sha256": "ed720b8300fcf05a69e59a524562f6d67220697239bcebfe86a2e35a70b0e581",
    "shopTypes": {
      "GROCERY": 2,
      "COIN": 5,
      "RECRUIT": 1,
      "HONOR": 7
    },
    "protocolSource": "Build/mj-h5.data.unityweb",
    "protocolSha256": "2384b9ca86cda9a3a4594dcf3eecba377041b1dffc46949b273ad01c1af4c7fd",
    "defaults": {
      "coinId": 60001,
      "currencyIds": [
        60001,
        60002,
        60008,
        60009,
        60010,
        60011,
        60012
      ],
      "rank": {
        "level": 17,
        "point": 2300
      }
    },
    "grocery": [
      {
        "id": 60007,
        "type": 6,
        "tokenType": 0,
        "price": 500,
        "buyType": 0,
        "limit": 0,
        "sort": 60002
      },
      {
        "id": 60008,
        "type": 6,
        "tokenType": 1,
        "price": 50,
        "buyType": 2,
        "limit": 1,
        "sort": 60001
      }
    ],
    "recruit": [
      {
        "id": 1,
        "type": 26,
        "price": 130,
        "sort": 26001,
        "gears": []
      },
      {
        "id": 3,
        "type": 26,
        "price": 130,
        "sort": 26002,
        "gears": []
      },
      {
        "id": 4,
        "type": 26,
        "price": 130,
        "sort": 26003,
        "gears": []
      },
      {
        "id": 5,
        "type": 26,
        "price": 130,
        "sort": 26004,
        "gears": []
      },
      {
        "id": 6,
        "type": 26,
        "price": 260,
        "sort": 26005,
        "gears": []
      },
      {
        "id": 7,
        "type": 26,
        "price": 260,
        "sort": 26007,
        "gears": []
      },
      {
        "id": 8,
        "type": 26,
        "price": 260,
        "sort": 26008,
        "gears": []
      },
      {
        "id": 9,
        "type": 26,
        "price": 260,
        "sort": 26006,
        "gears": []
      },
      {
        "id": 10,
        "type": 26,
        "price": 260,
        "sort": 26009,
        "gears": []
      },
      {
        "id": 80001,
        "type": 8,
        "price": 1,
        "sort": 8001,
        "gears": []
      },
      {
        "id": 80002,
        "type": 8,
        "price": 1,
        "sort": 8002,
        "gears": []
      },
      {
        "id": 80003,
        "type": 8,
        "price": 1,
        "sort": 8003,
        "gears": []
      },
      {
        "id": 80004,
        "type": 8,
        "price": 1,
        "sort": 8004,
        "gears": []
      },
      {
        "id": 80005,
        "type": 8,
        "price": 1,
        "sort": 8005,
        "gears": []
      },
      {
        "id": 80006,
        "type": 8,
        "price": 1,
        "sort": 8006,
        "gears": []
      },
      {
        "id": 80009,
        "type": 8,
        "price": 15,
        "sort": 2,
        "gears": []
      },
      {
        "id": 80008,
        "type": 8,
        "price": 5,
        "sort": 1,
        "gears": []
      },
      {
        "id": 140002,
        "type": 14,
        "price": 50,
        "sort": 14001,
        "gears": []
      },
      {
        "id": 140003,
        "type": 14,
        "price": 50,
        "sort": 14002,
        "gears": []
      },
      {
        "id": 140004,
        "type": 14,
        "price": 50,
        "sort": 14003,
        "gears": []
      },
      {
        "id": 140005,
        "type": 14,
        "price": 50,
        "sort": 14004,
        "gears": []
      },
      {
        "id": 140006,
        "type": 14,
        "price": 50,
        "sort": 14005,
        "gears": []
      },
      {
        "id": 140007,
        "type": 14,
        "price": 50,
        "sort": 14006,
        "gears": []
      },
      {
        "id": 140008,
        "type": 14,
        "price": 50,
        "sort": 14007,
        "gears": []
      },
      {
        "id": 150003,
        "type": 15,
        "price": 50,
        "sort": 15001,
        "gears": []
      },
      {
        "id": 150005,
        "type": 15,
        "price": 50,
        "sort": 15002,
        "gears": []
      },
      {
        "id": 150006,
        "type": 15,
        "price": 50,
        "sort": 15003,
        "gears": []
      },
      {
        "id": 150007,
        "type": 15,
        "price": 50,
        "sort": 15004,
        "gears": []
      },
      {
        "id": 170002,
        "type": 17,
        "price": 50,
        "sort": 17001,
        "gears": []
      },
      {
        "id": 170003,
        "type": 17,
        "price": 50,
        "sort": 17002,
        "gears": []
      }
    ],
    "honor": [
      {
        "id": 150007,
        "type": 15,
        "price": 600,
        "buyType": 1,
        "limit": 0,
        "sort": 150001,
        "gears": []
      },
      {
        "id": 140002,
        "type": 14,
        "price": 150,
        "buyType": 1,
        "limit": 0,
        "sort": 140001,
        "gears": []
      },
      {
        "id": 140003,
        "type": 14,
        "price": 150,
        "buyType": 1,
        "limit": 0,
        "sort": 140002,
        "gears": []
      },
      {
        "id": 70018,
        "type": 7,
        "price": 10,
        "buyType": 2,
        "limit": 5,
        "sort": 70015,
        "gears": []
      },
      {
        "id": 70017,
        "type": 7,
        "price": 15,
        "buyType": 2,
        "limit": 5,
        "sort": 70014,
        "gears": []
      },
      {
        "id": 70016,
        "type": 7,
        "price": 15,
        "buyType": 2,
        "limit": 5,
        "sort": 70013,
        "gears": []
      },
      {
        "id": 70015,
        "type": 7,
        "price": 20,
        "buyType": 2,
        "limit": 5,
        "sort": 70012,
        "gears": []
      },
      {
        "id": 70014,
        "type": 7,
        "price": 20,
        "buyType": 2,
        "limit": 5,
        "sort": 70011,
        "gears": []
      },
      {
        "id": 70020,
        "type": 7,
        "price": 50,
        "buyType": 2,
        "limit": 3,
        "sort": 70010,
        "gears": []
      },
      {
        "id": 70013,
        "type": 7,
        "price": 50,
        "buyType": 2,
        "limit": 3,
        "sort": 70009,
        "gears": []
      },
      {
        "id": 70012,
        "type": 7,
        "price": 50,
        "buyType": 2,
        "limit": 3,
        "sort": 70008,
        "gears": []
      },
      {
        "id": 70011,
        "type": 7,
        "price": 50,
        "buyType": 2,
        "limit": 3,
        "sort": 70007,
        "gears": []
      },
      {
        "id": 70024,
        "type": 7,
        "price": 100,
        "buyType": 2,
        "limit": 2,
        "sort": 70006,
        "gears": []
      },
      {
        "id": 70010,
        "type": 7,
        "price": 100,
        "buyType": 2,
        "limit": 2,
        "sort": 70005,
        "gears": []
      },
      {
        "id": 70009,
        "type": 7,
        "price": 100,
        "buyType": 2,
        "limit": 2,
        "sort": 70004,
        "gears": []
      },
      {
        "id": 70008,
        "type": 7,
        "price": 100,
        "buyType": 2,
        "limit": 2,
        "sort": 70003,
        "gears": []
      },
      {
        "id": 70019,
        "type": 7,
        "price": 150,
        "buyType": 2,
        "limit": 1,
        "sort": 70002,
        "gears": []
      },
      {
        "id": 70023,
        "type": 7,
        "price": 150,
        "buyType": 2,
        "limit": 1,
        "sort": 70001,
        "gears": []
      }
    ],
    "coinSlots": [
      {
        "id": 1,
        "type": 7,
        "rarity": 1,
        "count": 1
      },
      {
        "id": 2,
        "type": 7,
        "rarity": 2,
        "count": 1
      },
      {
        "id": 3,
        "type": 7,
        "rarity": 3,
        "count": 2
      },
      {
        "id": 4,
        "type": 7,
        "rarity": 3,
        "count": 2
      },
      {
        "id": 5,
        "type": 7,
        "rarity": 4,
        "count": 2
      },
      {
        "id": 6,
        "type": 7,
        "rarity": 4,
        "count": 2
      },
      {
        "id": 7,
        "type": 8,
        "rarity": 0,
        "count": 1
      },
      {
        "id": 8,
        "type": 8,
        "rarity": 0,
        "count": 1
      }
    ],
    "refresh": [
      {
        "count": 1,
        "tokenType": 0,
        "price": 5e3
      },
      {
        "count": 2,
        "tokenType": 1,
        "price": 10
      },
      {
        "count": 3,
        "tokenType": 1,
        "price": 20
      },
      {
        "count": 4,
        "tokenType": 1,
        "price": 40
      },
      {
        "count": 5,
        "tokenType": 1,
        "price": 80
      },
      {
        "count": 6,
        "tokenType": 1,
        "price": 80
      },
      {
        "count": 7,
        "tokenType": 1,
        "price": 80
      }
    ],
    "gifts": [
      {
        "id": 70023,
        "type": 7,
        "name": 21021,
        "rarity": 1,
        "price": 0
      },
      {
        "id": 70019,
        "type": 7,
        "name": 21024,
        "rarity": 1,
        "price": 0
      },
      {
        "id": 70008,
        "type": 7,
        "name": 21027,
        "rarity": 2,
        "price": 0
      },
      {
        "id": 70009,
        "type": 7,
        "name": 21030,
        "rarity": 2,
        "price": 0
      },
      {
        "id": 70010,
        "type": 7,
        "name": 21033,
        "rarity": 2,
        "price": 0
      },
      {
        "id": 70024,
        "type": 7,
        "name": 21036,
        "rarity": 2,
        "price": 0
      },
      {
        "id": 70011,
        "type": 7,
        "name": 21039,
        "rarity": 3,
        "price": 75e3
      },
      {
        "id": 70012,
        "type": 7,
        "name": 21042,
        "rarity": 3,
        "price": 75e3
      },
      {
        "id": 70013,
        "type": 7,
        "name": 21045,
        "rarity": 3,
        "price": 75e3
      },
      {
        "id": 70020,
        "type": 7,
        "name": 21048,
        "rarity": 3,
        "price": 75e3
      },
      {
        "id": 70014,
        "type": 7,
        "name": 21051,
        "rarity": 4,
        "price": 23e3
      },
      {
        "id": 70015,
        "type": 7,
        "name": 21054,
        "rarity": 4,
        "price": 23e3
      },
      {
        "id": 70016,
        "type": 7,
        "name": 21057,
        "rarity": 4,
        "price": 2e4
      },
      {
        "id": 70017,
        "type": 7,
        "name": 21060,
        "rarity": 4,
        "price": 2e4
      },
      {
        "id": 70018,
        "type": 7,
        "name": 21063,
        "rarity": 4,
        "price": 15e3
      },
      {
        "id": 71001,
        "type": 7,
        "name": 21001,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71002,
        "type": 7,
        "name": 21003,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71003,
        "type": 7,
        "name": 21005,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71021,
        "type": 7,
        "name": 21007,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71022,
        "type": 7,
        "name": 21009,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71004,
        "type": 7,
        "name": 21013,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71005,
        "type": 7,
        "name": 21015,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71006,
        "type": 7,
        "name": 21017,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71007,
        "type": 7,
        "name": 21019,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 71023,
        "type": 7,
        "name": 21021,
        "rarity": 1,
        "price": 15e4
      },
      {
        "id": 71019,
        "type": 7,
        "name": 21024,
        "rarity": 1,
        "price": 15e4
      },
      {
        "id": 71008,
        "type": 7,
        "name": 21027,
        "rarity": 2,
        "price": 1e5
      },
      {
        "id": 71009,
        "type": 7,
        "name": 21030,
        "rarity": 2,
        "price": 1e5
      },
      {
        "id": 71010,
        "type": 7,
        "name": 21033,
        "rarity": 2,
        "price": 1e5
      },
      {
        "id": 71024,
        "type": 7,
        "name": 21036,
        "rarity": 2,
        "price": 1e5
      },
      {
        "id": 71011,
        "type": 7,
        "name": 21039,
        "rarity": 3,
        "price": 0
      },
      {
        "id": 71012,
        "type": 7,
        "name": 21042,
        "rarity": 3,
        "price": 0
      },
      {
        "id": 71013,
        "type": 7,
        "name": 21045,
        "rarity": 3,
        "price": 0
      },
      {
        "id": 71020,
        "type": 7,
        "name": 21048,
        "rarity": 3,
        "price": 0
      },
      {
        "id": 71014,
        "type": 7,
        "name": 21051,
        "rarity": 4,
        "price": 0
      },
      {
        "id": 71015,
        "type": 7,
        "name": 21054,
        "rarity": 4,
        "price": 0
      },
      {
        "id": 71016,
        "type": 7,
        "name": 21057,
        "rarity": 4,
        "price": 0
      },
      {
        "id": 71017,
        "type": 7,
        "name": 21060,
        "rarity": 4,
        "price": 0
      },
      {
        "id": 71018,
        "type": 7,
        "name": 21063,
        "rarity": 4,
        "price": 0
      }
    ],
    "materials": [
      {
        "id": 80001,
        "type": 8,
        "name": 22001,
        "rarity": 3,
        "price": 5e4
      },
      {
        "id": 80002,
        "type": 8,
        "name": 22003,
        "rarity": 3,
        "price": 5e4
      },
      {
        "id": 80003,
        "type": 8,
        "name": 22005,
        "rarity": 3,
        "price": 5e4
      },
      {
        "id": 80004,
        "type": 8,
        "name": 22007,
        "rarity": 3,
        "price": 5e4
      },
      {
        "id": 80005,
        "type": 8,
        "name": 22009,
        "rarity": 3,
        "price": 5e4
      },
      {
        "id": 80006,
        "type": 8,
        "name": 22011,
        "rarity": 3,
        "price": 5e4
      },
      {
        "id": 80007,
        "type": 8,
        "name": 20029,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 80009,
        "type": 8,
        "name": 22013,
        "rarity": 0,
        "price": 0
      },
      {
        "id": 80008,
        "type": 8,
        "name": 22015,
        "rarity": 1,
        "price": 0
      }
    ],
    "dojos": [
      {
        "id": 1,
        "name": 1800,
        "minRank": 1,
        "maxRank": 13,
        "entryCurrency": 60001,
        "entryBalance": 0,
        "feeCurrency": 60001,
        "fee": 0,
        "rewardCurrency": 60001,
        "rewardRate": 0
      },
      {
        "id": 2,
        "name": 1801,
        "minRank": 11,
        "maxRank": 16,
        "entryCurrency": 60001,
        "entryBalance": 3e3,
        "feeCurrency": 60001,
        "fee": 500,
        "rewardCurrency": 60001,
        "rewardRate": 50
      },
      {
        "id": 3,
        "name": 1802,
        "minRank": 14,
        "maxRank": 22,
        "entryCurrency": 60001,
        "entryBalance": 5e3,
        "feeCurrency": 60001,
        "fee": 1e3,
        "rewardCurrency": 60001,
        "rewardRate": 100
      },
      {
        "id": 4,
        "name": 1803,
        "minRank": 17,
        "maxRank": 22,
        "entryCurrency": 60001,
        "entryBalance": 1e4,
        "feeCurrency": 60001,
        "fee": 2e3,
        "rewardCurrency": 60001,
        "rewardRate": 200
      }
    ],
    "yonmaRanks": [
      {
        "id": 1,
        "room": 1,
        "name": 122,
        "initial": 0,
        "up": 40,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 2,
        "room": 1,
        "name": 1848,
        "initial": 0,
        "up": 40,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 3,
        "room": 1,
        "name": 1849,
        "initial": 0,
        "up": 40,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 4,
        "room": 1,
        "name": 1850,
        "initial": 0,
        "up": 40,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 5,
        "room": 1,
        "name": 1851,
        "initial": 0,
        "up": 50,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 6,
        "room": 1,
        "name": 1852,
        "initial": 0,
        "up": 60,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 7,
        "room": 1,
        "name": 1853,
        "initial": 0,
        "up": 70,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 8,
        "room": 1,
        "name": 1854,
        "initial": 0,
        "up": 80,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 9,
        "room": 1,
        "name": 1855,
        "initial": 0,
        "up": 100,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 10,
        "room": 1,
        "name": 1856,
        "initial": 140,
        "up": 280,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 11,
        "room": 2,
        "name": 125,
        "initial": 200,
        "up": 400,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 12,
        "room": 2,
        "name": 127,
        "initial": 400,
        "up": 800,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 13,
        "room": 2,
        "name": 128,
        "initial": 600,
        "up": 1200,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 14,
        "room": 3,
        "name": 129,
        "initial": 1e3,
        "up": 2e3,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 15,
        "room": 3,
        "name": 130,
        "initial": 1400,
        "up": 2800,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 16,
        "room": 3,
        "name": 131,
        "initial": 1800,
        "up": 3600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 17,
        "room": 4,
        "name": 132,
        "initial": 2300,
        "up": 4600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 18,
        "room": 4,
        "name": 133,
        "initial": 2800,
        "up": 5600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 19,
        "room": 4,
        "name": 134,
        "initial": 3300,
        "up": 6600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 20,
        "room": 4,
        "name": 135,
        "initial": 3800,
        "up": 7600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 21,
        "room": 4,
        "name": 1857,
        "initial": 7600,
        "up": 8600,
        "canDecrease": 0,
        "inherit": 1,
        "special": 0,
        "down": 8500
      },
      {
        "id": 22,
        "room": 4,
        "name": 1857,
        "initial": 50,
        "up": 100,
        "canDecrease": 1,
        "inherit": 0,
        "special": 1,
        "down": 0
      }
    ],
    "sanmaRanks": [
      {
        "id": 1,
        "room": 1,
        "name": 122,
        "initial": 0,
        "up": 30,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 2,
        "room": 1,
        "name": 1848,
        "initial": 0,
        "up": 30,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 3,
        "room": 1,
        "name": 1849,
        "initial": 0,
        "up": 30,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 4,
        "room": 1,
        "name": 1850,
        "initial": 0,
        "up": 30,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 5,
        "room": 1,
        "name": 1851,
        "initial": 0,
        "up": 40,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 6,
        "room": 1,
        "name": 1852,
        "initial": 0,
        "up": 50,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 7,
        "room": 1,
        "name": 1853,
        "initial": 0,
        "up": 60,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 8,
        "room": 1,
        "name": 1854,
        "initial": 0,
        "up": 70,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 9,
        "room": 1,
        "name": 1855,
        "initial": 0,
        "up": 80,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 10,
        "room": 1,
        "name": 1856,
        "initial": 140,
        "up": 240,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 11,
        "room": 2,
        "name": 125,
        "initial": 200,
        "up": 400,
        "canDecrease": 0,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 12,
        "room": 2,
        "name": 127,
        "initial": 400,
        "up": 800,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 13,
        "room": 2,
        "name": 128,
        "initial": 600,
        "up": 1200,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 14,
        "room": 3,
        "name": 129,
        "initial": 1e3,
        "up": 2e3,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 15,
        "room": 3,
        "name": 130,
        "initial": 1400,
        "up": 2800,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 16,
        "room": 3,
        "name": 131,
        "initial": 1800,
        "up": 3600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 17,
        "room": 4,
        "name": 132,
        "initial": 2300,
        "up": 4600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 18,
        "room": 4,
        "name": 133,
        "initial": 2800,
        "up": 5600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 19,
        "room": 4,
        "name": 134,
        "initial": 3300,
        "up": 6600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 20,
        "room": 4,
        "name": 135,
        "initial": 3800,
        "up": 7600,
        "canDecrease": 1,
        "inherit": 0,
        "special": 0,
        "down": 0
      },
      {
        "id": 21,
        "room": 4,
        "name": 1857,
        "initial": 7600,
        "up": 8600,
        "canDecrease": 0,
        "inherit": 1,
        "special": 0,
        "down": 8500
      },
      {
        "id": 22,
        "room": 4,
        "name": 1857,
        "initial": 50,
        "up": 100,
        "canDecrease": 1,
        "inherit": 0,
        "special": 1,
        "down": 0
      }
    ],
    "rankPoints": [
      {
        "id": 1,
        "room": 1,
        "rank": 1,
        "name": 122,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 10,
        "east4_4": 0,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 15,
        "half4_4": 0,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 2,
        "room": 1,
        "rank": 2,
        "name": 1848,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 10,
        "east4_4": 0,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 15,
        "half4_4": 0,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 3,
        "room": 1,
        "rank": 3,
        "name": 1849,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 10,
        "east4_4": 0,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 15,
        "half4_4": 0,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 4,
        "room": 1,
        "rank": 4,
        "name": 1850,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 5,
        "east4_4": 0,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 10,
        "half4_4": 0,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 5,
        "room": 1,
        "rank": 5,
        "name": 1851,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 5,
        "east4_4": 0,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 10,
        "half4_4": 0,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 6,
        "room": 1,
        "rank": 6,
        "name": 1852,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 0,
        "east4_4": 0,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 0,
        "half4_4": 0,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 7,
        "room": 1,
        "rank": 7,
        "name": 1853,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": 0,
        "east4_4": -5,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": 0,
        "half4_4": -5,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 8,
        "room": 1,
        "rank": 8,
        "name": 1854,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": -5,
        "east4_4": -10,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": -5,
        "half4_4": -15,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": 0,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": 0
      },
      {
        "id": 9,
        "room": 1,
        "rank": 9,
        "name": 1855,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": -10,
        "east4_4": -15,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": -15,
        "half4_4": -20,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": -10,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": -15
      },
      {
        "id": 10,
        "room": 1,
        "rank": 10,
        "name": 1856,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": -10,
        "east4_4": -20,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": -15,
        "half4_4": -30,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": -15,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": -20
      },
      {
        "id": 11,
        "room": 1,
        "rank": 11,
        "name": 125,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": -20,
        "east4_4": -30,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": -30,
        "half4_4": -45,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": -25,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": -40
      },
      {
        "id": 12,
        "room": 1,
        "rank": 12,
        "name": 127,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": -20,
        "east4_4": -40,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": -30,
        "half4_4": -60,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": -30,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": -45
      },
      {
        "id": 13,
        "room": 1,
        "rank": 13,
        "name": 128,
        "east1_4": 40,
        "east2_4": 20,
        "east3_4": -30,
        "east4_4": -60,
        "half1_4": 60,
        "half2_4": 30,
        "half3_4": -45,
        "half4_4": -90,
        "east1_3": 30,
        "east2_3": 0,
        "east3_3": -35,
        "half1_3": 45,
        "half2_3": 0,
        "half3_3": -55
      },
      {
        "id": 14,
        "room": 2,
        "rank": 11,
        "name": 125,
        "east1_4": 70,
        "east2_4": 35,
        "east3_4": -20,
        "east4_4": -30,
        "half1_4": 105,
        "half2_4": 55,
        "half3_4": -30,
        "half4_4": -45,
        "east1_3": 50,
        "east2_3": 0,
        "east3_3": -25,
        "half1_3": 75,
        "half2_3": 0,
        "half3_3": -35
      },
      {
        "id": 15,
        "room": 2,
        "rank": 12,
        "name": 127,
        "east1_4": 70,
        "east2_4": 35,
        "east3_4": -20,
        "east4_4": -40,
        "half1_4": 105,
        "half2_4": 55,
        "half3_4": -30,
        "half4_4": -60,
        "east1_3": 50,
        "east2_3": 0,
        "east3_3": -30,
        "half1_3": 75,
        "half2_3": 0,
        "half3_3": -45
      },
      {
        "id": 16,
        "room": 2,
        "rank": 13,
        "name": 128,
        "east1_4": 70,
        "east2_4": 35,
        "east3_4": -30,
        "east4_4": -60,
        "half1_4": 105,
        "half2_4": 55,
        "half3_4": -45,
        "half4_4": -90,
        "east1_3": 50,
        "east2_3": 0,
        "east3_3": -35,
        "half1_3": 75,
        "half2_3": 0,
        "half3_3": -50
      },
      {
        "id": 17,
        "room": 2,
        "rank": 14,
        "name": 129,
        "east1_4": 70,
        "east2_4": 35,
        "east3_4": -40,
        "east4_4": -100,
        "half1_4": 105,
        "half2_4": 55,
        "half3_4": -60,
        "half4_4": -150,
        "east1_3": 50,
        "east2_3": 0,
        "east3_3": -50,
        "half1_3": 75,
        "half2_3": 0,
        "half3_3": -75
      },
      {
        "id": 18,
        "room": 2,
        "rank": 15,
        "name": 130,
        "east1_4": 70,
        "east2_4": 35,
        "east3_4": -45,
        "east4_4": -105,
        "half1_4": 105,
        "half2_4": 55,
        "half3_4": -70,
        "half4_4": -160,
        "east1_3": 50,
        "east2_3": 0,
        "east3_3": -60,
        "half1_3": 75,
        "half2_3": 0,
        "half3_3": -90
      },
      {
        "id": 19,
        "room": 2,
        "rank": 16,
        "name": 131,
        "east1_4": 70,
        "east2_4": 35,
        "east3_4": -50,
        "east4_4": -110,
        "half1_4": 105,
        "half2_4": 55,
        "half3_4": -75,
        "half4_4": -165,
        "east1_3": 50,
        "east2_3": 0,
        "east3_3": -70,
        "half1_3": 75,
        "half2_3": 0,
        "half3_3": -105
      },
      {
        "id": 20,
        "room": 3,
        "rank": 14,
        "name": 129,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -40,
        "east4_4": -100,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -60,
        "half4_4": -150,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -60,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -90
      },
      {
        "id": 21,
        "room": 3,
        "rank": 15,
        "name": 130,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -45,
        "east4_4": -105,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -65,
        "half4_4": -155,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -70,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -105
      },
      {
        "id": 22,
        "room": 3,
        "rank": 16,
        "name": 131,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -50,
        "east4_4": -110,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -75,
        "half4_4": -165,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -80,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -120
      },
      {
        "id": 23,
        "room": 3,
        "rank": 17,
        "name": 132,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -55,
        "east4_4": -140,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -85,
        "half4_4": -210,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -90,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -135
      },
      {
        "id": 24,
        "room": 3,
        "rank": 18,
        "name": 133,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -60,
        "east4_4": -150,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -90,
        "half4_4": -225,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -100,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -150
      },
      {
        "id": 25,
        "room": 3,
        "rank": 19,
        "name": 134,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -65,
        "east4_4": -160,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -100,
        "half4_4": -240,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -110,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -165
      },
      {
        "id": 26,
        "room": 3,
        "rank": 20,
        "name": 135,
        "east1_4": 130,
        "east2_4": 50,
        "east3_4": -70,
        "east4_4": -170,
        "half1_4": 195,
        "half2_4": 75,
        "half3_4": -105,
        "half4_4": -255,
        "east1_3": 90,
        "east2_3": 0,
        "east3_3": -120,
        "half1_3": 135,
        "half2_3": 0,
        "half3_3": -180
      },
      {
        "id": 27,
        "room": 3,
        "rank": 21,
        "name": 1857,
        "east1_4": 6,
        "east2_4": 0,
        "east3_4": -4,
        "east4_4": -8,
        "half1_4": 9,
        "half2_4": 0,
        "half3_4": -6,
        "half4_4": -12,
        "east1_3": 4,
        "east2_3": 0,
        "east3_3": -4,
        "half1_3": 6,
        "half2_3": 0,
        "half3_3": -6
      },
      {
        "id": 28,
        "room": 3,
        "rank": 22,
        "name": 3108,
        "east1_4": 6,
        "east2_4": 0,
        "east3_4": -4,
        "east4_4": -8,
        "half1_4": 9,
        "half2_4": 0,
        "half3_4": -6,
        "half4_4": -12,
        "east1_3": 3,
        "east2_3": 0,
        "east3_3": -6,
        "half1_3": 5,
        "half2_3": 0,
        "half3_3": -9
      },
      {
        "id": 29,
        "room": 4,
        "rank": 17,
        "name": 132,
        "east1_4": 200,
        "east2_4": 65,
        "east3_4": -85,
        "east4_4": -185,
        "half1_4": 300,
        "half2_4": 100,
        "half3_4": -130,
        "half4_4": -280,
        "east1_3": 160,
        "east2_3": 0,
        "east3_3": -150,
        "half1_3": 240,
        "half2_3": 0,
        "half3_3": -225
      },
      {
        "id": 30,
        "room": 4,
        "rank": 18,
        "name": 133,
        "east1_4": 200,
        "east2_4": 65,
        "east3_4": -90,
        "east4_4": -190,
        "half1_4": 300,
        "half2_4": 100,
        "half3_4": -135,
        "half4_4": -285,
        "east1_3": 160,
        "east2_3": 0,
        "east3_3": -160,
        "half1_3": 240,
        "half2_3": 0,
        "half3_3": -240
      },
      {
        "id": 31,
        "room": 4,
        "rank": 19,
        "name": 134,
        "east1_4": 200,
        "east2_4": 65,
        "east3_4": -95,
        "east4_4": -200,
        "half1_4": 300,
        "half2_4": 100,
        "half3_4": -140,
        "half4_4": -300,
        "east1_3": 160,
        "east2_3": 0,
        "east3_3": -170,
        "half1_3": 240,
        "half2_3": 0,
        "half3_3": -255
      },
      {
        "id": 32,
        "room": 4,
        "rank": 20,
        "name": 135,
        "east1_4": 200,
        "east2_4": 65,
        "east3_4": -100,
        "east4_4": -220,
        "half1_4": 300,
        "half2_4": 100,
        "half3_4": -150,
        "half4_4": -330,
        "east1_3": 160,
        "east2_3": 0,
        "east3_3": -180,
        "half1_3": 240,
        "half2_3": 0,
        "half3_3": -270
      },
      {
        "id": 33,
        "room": 4,
        "rank": 21,
        "name": 1857,
        "east1_4": 8,
        "east2_4": 2,
        "east3_4": -4,
        "east4_4": -8,
        "half1_4": 12,
        "half2_4": 3,
        "half3_4": -6,
        "half4_4": -12,
        "east1_3": 6,
        "east2_3": 0,
        "east3_3": -4,
        "half1_3": 9,
        "half2_3": 0,
        "half3_3": -6
      },
      {
        "id": 34,
        "room": 4,
        "rank": 22,
        "name": 3108,
        "east1_4": 8,
        "east2_4": 2,
        "east3_4": -4,
        "east4_4": -8,
        "half1_4": 12,
        "half2_4": 3,
        "half3_4": -6,
        "half4_4": -12,
        "east1_3": 5,
        "east2_3": 0,
        "east3_3": -6,
        "half1_3": 8,
        "half2_3": 0,
        "half3_3": -9
      }
    ]
  };

  // mockjs/shop.mjs
  var SHOP_TYPE = Object.freeze(ECONOMY_CATALOG.shopTypes);
  var SHOP_ERROR = Object.freeze({ INVALID: 1, INSUFFICIENT: 2010, LIMIT: 2011, NOT_FOUND: 2012 });
  var TOKEN_IDS = [60002, 60001, 60009, 60010, 60011, 60012];
  var DAY = 86400;
  var OFFSET = 8 * 3600;
  var P = () => globalThis.__mj.proto;
  var dayStart = (now) => Math.floor((now + OFFSET) / DAY) * DAY - OFFSET;
  var monthStart = (now) => {
    const date = new Date((now + OFFSET) * 1e3);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1) / 1e3 - OFFSET;
  };
  var equal = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
  var positive = (value) => Number.isSafeInteger(value) && value > 0;
  function decodeMap(row, field) {
    const result = /* @__PURE__ */ new Map();
    for (const [number, wire, bytes] of P().parse(row)) {
      if (number !== field || wire !== 2) continue;
      const entry = P().dict(bytes);
      result.set(entry[1], entry[2] || new Uint8Array());
    }
    return result;
  }
  function stockFor(user, now, refreshCount) {
    let seed = (dayStart(now) / DAY ^ refreshCount * 2654435761 ^ user.uid) >>> 0;
    const used = /* @__PURE__ */ new Set();
    return ECONOMY_CATALOG.coinSlots.map((slot) => {
      const pool = (slot.type === 7 ? ECONOMY_CATALOG.gifts : ECONOMY_CATALOG.materials).filter((item2) => item2.price > 0 && (!slot.rarity || item2.rarity === slot.rarity) && !used.has(item2.id));
      if (!pool.length) throw new Error("\u96C0\u5E01\u5546\u5E97\u914D\u7F6E\u4E0D\u8DB3\u4EE5\u751F\u6210\u5546\u54C1");
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      const item = pool[(seed >>> 0) % pool.length];
      used.add(item.id);
      return { id: item.id, type: slot.type, rarity: slot.rarity, count: slot.count, price: item.price };
    });
  }
  function normalizeLimits(map, catalog, countField, start, now) {
    for (const item of catalog) {
      const bytes = map.get(item.id);
      if (!bytes || item.buyType !== 2 || Number(P().get(bytes, 4) || 0) >= start) continue;
      map.set(item.id, P().setVarint(P().setVarint(bytes, countField, 0), 4, now));
    }
  }
  function readState(user, now) {
    const row = user.row(30, "0") || new Uint8Array();
    const d = P().dict(row);
    const state = {
      row,
      lastRefresh: Number(d[2] || 0),
      // 对照 GetRefreshShopCount/FreeRefreshShopCount：f4 为总次数，f6 为免费额度。
      refreshCount: Number(d[4] || 0),
      freeAllowance: Number(d[6] || 0),
      items: P().parse(row).filter(([n, w]) => n === 1 && w === 2).map(([, , bytes]) => {
        const item = P().dict(bytes);
        return { id: item[1], type: item[2], rarity: item[3] || 0, count: item[4] || 0, price: item[5] || 0 };
      }),
      grocery: decodeMap(row, 5),
      honor: decodeMap(row, 8)
    };
    if (!state.items.length || state.lastRefresh < dayStart(now)) {
      state.lastRefresh = now;
      state.refreshCount = 0;
      state.freeAllowance = 1;
      state.items = stockFor(user, now, 0);
    }
    normalizeLimits(state.grocery, ECONOMY_CATALOG.grocery, 3, dayStart(now), now);
    normalizeLimits(state.honor, ECONOMY_CATALOG.honor, 2, monthStart(now), now);
    return state;
  }
  function encodeState(state) {
    const w = P().W();
    for (const field of P().parse(state.row)) {
      if (![1, 2, 4, 5, 6, 8].includes(field[0])) P().reencode(w, ...field);
    }
    for (const item of state.items) {
      w.s(1, P().W().v(1, item.id).v(2, item.type).v(3, item.rarity).v(4, item.count).v(5, item.price).bytes());
    }
    w.v(2, state.lastRefresh).v(4, state.refreshCount).v(6, state.freeAllowance);
    for (const [field, map] of [[5, state.grocery], [8, state.honor]]) {
      for (const [id, bytes] of map) w.s(field, P().W().v(1, id).s(2, bytes).bytes());
    }
    return w.bytes();
  }
  function synchronizeShop(user, now = Math.floor(Date.now() / 1e3)) {
    const state = readState(user, now);
    const bytes = encodeState(state);
    return equal(state.row, bytes) ? null : { 30: [user.setRow(30, "0", bytes)] };
  }
  function uniqueReward(user, item) {
    if (item.type === 26) {
      if (user.row(26, item.id)) return { error: SHOP_ERROR.LIMIT };
      const template2 = new user.constructor(P().b64decode(globalThis.__mj.data.userdataB64), user.uid);
      const bytes2 = template2.row(26, item.id);
      return bytes2 ? { dtype: 26, key: String(item.id), bytes: bytes2 } : { error: SHOP_ERROR.NOT_FOUND };
    }
    if (![14, 15, 17].includes(item.type)) return { error: SHOP_ERROR.NOT_FOUND };
    const row = user.row(item.type, "0") || new Uint8Array();
    const owned = decodeMap(row, 1);
    if (owned.has(item.id)) return { error: SHOP_ERROR.LIMIT };
    const template = new user.constructor(P().b64decode(globalThis.__mj.data.userdataB64), user.uid);
    const original = decodeMap(template.row(item.type, "0") || new Uint8Array(), 1).get(item.id);
    if (!original) return { error: SHOP_ERROR.NOT_FOUND };
    const bytes = P().W().raw(row).s(1, P().W().v(1, item.id).s(2, original).bytes()).bytes();
    return { dtype: item.type, key: "0", bytes };
  }
  function purchase(user, request, now = Math.floor(Date.now() / 1e3)) {
    const { shopType, itemId, quantity, exchangeCount, gearIndex = 0 } = request;
    if (!positive(itemId) || !positive(quantity) || quantity > 2147483647 || exchangeCount !== 1 || gearIndex !== 0) {
      return { error: SHOP_ERROR.INVALID };
    }
    const state = readState(user, now);
    let item, currency, limitMap, countField;
    if (shopType === SHOP_TYPE.COIN) {
      item = state.items.find((entry) => entry.id === itemId);
      currency = 60001;
    } else if (shopType === SHOP_TYPE.GROCERY) {
      item = ECONOMY_CATALOG.grocery.find((entry) => entry.id === itemId);
      currency = item && TOKEN_IDS[item.tokenType];
      limitMap = state.grocery;
      countField = 3;
    } else if (shopType === SHOP_TYPE.RECRUIT) {
      item = ECONOMY_CATALOG.recruit.find((entry) => entry.id === itemId);
      currency = 60009;
    } else if (shopType === SHOP_TYPE.HONOR) {
      item = ECONOMY_CATALOG.honor.find((entry) => entry.id === itemId);
      currency = 60012;
      limitMap = state.honor;
      countField = 2;
    }
    if (!item || !currency || !positive(item.price)) return { error: SHOP_ERROR.NOT_FOUND };
    const oldLimit = limitMap?.get(itemId) || new Uint8Array();
    const bought = Number(oldLimit.length ? P().get(oldLimit, countField) || 0 : 0);
    if (shopType === SHOP_TYPE.COIN && quantity > item.count || item.limit > 0 && bought + quantity > item.limit) {
      return { error: SHOP_ERROR.LIMIT };
    }
    const cost = item.price * quantity;
    if (!Number.isSafeInteger(cost)) return { error: SHOP_ERROR.INVALID };
    if (user.inventoryCount(6, currency) < cost) return { error: SHOP_ERROR.INSUFFICIENT };
    const stackable = [6, 7, 8].includes(item.type);
    const unique = stackable ? null : uniqueReward(user, item);
    if (unique?.error) return unique;
    if (!stackable && quantity !== 1) return { error: SHOP_ERROR.LIMIT };
    if (shopType === SHOP_TYPE.COIN) item.count -= quantity;
    if (limitMap) {
      let bytes = P().setVarint(oldLimit, 1, item.id);
      bytes = P().setVarint(bytes, countField, bought + quantity);
      bytes = P().setVarint(bytes, countField === 3 ? 2 : 3, item.buyType);
      limitMap.set(item.id, P().setVarint(bytes, 4, now));
    }
    const shopBytes = encodeState(state);
    const deltas = [{ dtype: 6, id: currency, count: -cost }];
    if (stackable) deltas.push({ dtype: item.type, id: item.id, count: quantity });
    let changes;
    try {
      changes = user.changeInventory(deltas) || {};
    } catch (error) {
      if (error instanceof RangeError) return { error: SHOP_ERROR.INVALID };
      throw error;
    }
    if (unique) changes[unique.dtype] = [user.setRow(unique.dtype, unique.key, unique.bytes)];
    changes[30] = [user.setRow(30, "0", shopBytes)];
    return { error: 0, changes, itemId, quantity, rewards: [[item.id, quantity]] };
  }
  function refreshShop(user, now = Math.floor(Date.now() / 1e3)) {
    const state = readState(user, now);
    const free = state.refreshCount < state.freeAllowance;
    const index = Math.max(0, state.refreshCount - state.freeAllowance);
    const offer = ECONOMY_CATALOG.refresh[Math.min(index, ECONOMY_CATALOG.refresh.length - 1)];
    const currency = offer.tokenType === 0 ? 60001 : 60002;
    const cost = free ? 0 : offer.price;
    if (user.inventoryCount(6, currency) < cost) return { error: SHOP_ERROR.INSUFFICIENT };
    state.refreshCount += 1;
    state.lastRefresh = now;
    state.items = stockFor(user, now, state.refreshCount);
    const bytes = encodeState(state);
    const changes = user.changeInventory([{ dtype: 6, id: currency, count: -cost }]) || {};
    changes[30] = [user.setRow(30, "0", bytes)];
    return { error: 0, changes };
  }

  // mockjs/sichuan_hand.mjs
  function buildSichuanWall() {
    const tiles = [];
    for (let suit = 1; suit <= 3; suit += 1) {
      for (let rank = 1; rank <= 9; rank += 1) {
        for (let copy = 1; copy <= 4; copy += 1) tiles.push(tileId(suit, rank, copy));
      }
    }
    return tiles;
  }
  function sichuanKind(id) {
    if (!Number.isSafeInteger(id)) throw new RangeError("\u56DB\u5DDD\u5B9E\u4F53\u724C ID \u5FC5\u987B\u662F\u6574\u6570");
    const { suit, rank, copy } = decodeId(id);
    if (suit < 1 || suit > 3 || rank < 1 || rank > 9 || copy < 1 || copy > 4) {
      throw new RangeError(`\u65E0\u6548\u7684\u666E\u901A\u56DB\u5DDD\u5B9E\u4F53\u724C\uFF1A${id}`);
    }
    return (suit - 1) * 9 + rank - 1;
  }
  function inspectHolding(hand, melds, missingSuit) {
    if (![1, 2, 3].includes(missingSuit)) throw new RangeError("\u5FC5\u987B\u660E\u786E\u6307\u5B9A\u4E07/\u7B52/\u6761\u4E2D\u7684\u5B9A\u7F3A\u82B1\u8272");
    if (!Array.isArray(hand) || !Array.isArray(melds) || melds.length > 4 || hand.length > 14) {
      throw new RangeError("\u56DB\u5DDD\u624B\u724C\u6216\u526F\u9732\u7ED3\u6784\u65E0\u6548");
    }
    const used = /* @__PURE__ */ new Set();
    const counts = Array(27).fill(0);
    const allCounts = Array(27).fill(0);
    let hasMissing = false;
    function add2(id) {
      const kind = sichuanKind(id);
      if (used.has(id)) throw new RangeError(`\u91CD\u590D\u5B9E\u4F53\u724C\uFF1A${id}`);
      used.add(id);
      allCounts[kind] += 1;
      if (Math.floor(kind / 9) + 1 === missingSuit) hasMissing = true;
      return kind;
    }
    for (const id of hand) counts[add2(id)] += 1;
    const fixedGroups = [];
    for (const meld of melds) {
      const length = meld?.type === "pon" ? 3 : ["kan", "ankan"].includes(meld?.type) ? 4 : 0;
      if (!length || !Array.isArray(meld.tiles) || meld.tiles.length !== length) {
        throw new RangeError("\u56DB\u5DDD\u4EC5\u652F\u6301\u4E09\u5F20\u78B0\u6216\u56DB\u5F20\u6760\uFF0C\u4E0D\u80FD\u5403");
      }
      const kinds = [];
      for (const id of meld.tiles) kinds.push(add2(id));
      if (!kinds.every((kind) => kind === kinds[0])) throw new RangeError("\u78B0\u6760\u5FC5\u987B\u662F\u540C\u4E00\u79CD\u724C");
      fixedGroups.push({ type: length === 4 ? "quad" : "triplet", kind: kinds[0], open: meld.type !== "ankan" });
    }
    return { counts, allCounts, used, hasMissing, fixedGroups };
  }
  function analyzeSichuanHand(hand, { melds = [], missingSuit } = {}) {
    const { counts, hasMissing, fixedGroups } = inspectHolding(hand, melds, missingSuit);
    if (hasMissing || hand.length !== 14 - 3 * melds.length) return [];
    const shapes = [];
    if (!melds.length && counts.every((count) => count % 2 === 0)) {
      const pairs = [];
      const quadKinds = [];
      for (let kind = 0; kind < counts.length; kind += 1) {
        for (let pair = 0; pair < counts[kind] / 2; pair += 1) pairs.push(kind);
        if (counts[kind] === 4) quadKinds.push(kind);
      }
      shapes.push({ type: "sevenPairs", pairs, quadKinds });
    }
    const groups = [];
    const required = 4 - melds.length;
    function split(pair) {
      const kind = counts.findIndex((count) => count > 0);
      if (kind === -1) {
        if (groups.length === required) {
          shapes.push({ type: "standard", pair, groups: [...fixedGroups, ...groups].map((group) => ({ ...group })) });
        }
        return;
      }
      if (groups.length >= required) return;
      if (counts[kind] >= 3) {
        counts[kind] -= 3;
        groups.push({ type: "triplet", kind, open: false });
        split(pair);
        groups.pop();
        counts[kind] += 3;
      }
      if (kind % 9 <= 6 && counts[kind + 1] > 0 && counts[kind + 2] > 0) {
        counts[kind] -= 1;
        counts[kind + 1] -= 1;
        counts[kind + 2] -= 1;
        groups.push({ type: "sequence", kind, open: false });
        split(pair);
        groups.pop();
        counts[kind] += 1;
        counts[kind + 1] += 1;
        counts[kind + 2] += 1;
      }
    }
    for (let pair = 0; pair < counts.length; pair += 1) {
      if (counts[pair] < 2) continue;
      counts[pair] -= 2;
      split(pair);
      counts[pair] += 2;
    }
    return shapes;
  }
  function sichuanWaitKinds(hand, { melds = [], missingSuit } = {}) {
    const { allCounts, used, hasMissing } = inspectHolding(hand, melds, missingSuit);
    if (hasMissing || hand.length !== 13 - 3 * melds.length) return [];
    const waits = [];
    for (let kind = 0; kind < 27; kind += 1) {
      const suit = Math.floor(kind / 9) + 1;
      if (suit === missingSuit || allCounts[kind] >= 4) continue;
      const rank = kind % 9 + 1;
      let copy = 1;
      while (used.has(tileId(suit, rank, copy))) copy += 1;
      const id = tileId(suit, rank, copy);
      if (analyzeSichuanHand([...hand, id], { melds, missingSuit }).length) waits.push(kind);
    }
    return waits;
  }
  function legalSichuanDiscards(hand, missingSuit) {
    inspectHolding(hand, [], missingSuit);
    const missing = hand.filter((id) => decodeId(id).suit === missingSuit);
    return missing.length ? missing : hand.slice();
  }

  // mockjs/sichuan_catalog.mjs
  var SICHUAN_CATALOG = {
    "source": "StreamingAssets/Bundles/WebGL/commonconfigs_d005e1531b1cf360239da815293e48c6.bundle",
    "sha256": "ed720b8300fcf05a69e59a524562f6d67220697239bcebfe86a2e35a70b0e581",
    "schemaSource": "Build/mj-h5.data.unityweb",
    "schemaSha256": "2384b9ca86cda9a3a4594dcf3eecba377041b1dffc46949b273ad01c1af4c7fd",
    "languageAsset": "LanguageTbUISC",
    "multiplierFormat": {
      "id": 1549,
      "text": "X{0}\u500D"
    },
    "formula": {
      "id": 2159,
      "text": "\u756A\u578B1 x \u756A\u578B2 x ... x \u5E95\u5206"
    },
    "games": {
      "5021": {
        "name": "\u8840\u6D41\u9EBB\u5C06",
        "rules": [
          {
            "ruleId": 502101,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2088,
            "contentId": 2089,
            "title": "\u7528\u724C",
            "content": "\xB71-9\u4E07\u30011-9\u7B52\u30011-9\u6761\uFF0C\u5171108\u5F20\u724C\n\xB7\u53EF\u4EE5\u78B0\uFF0C\u6760\uFF0C\u4E0D\u80FD\u5403"
          },
          {
            "ruleId": 502102,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2090,
            "contentId": 2091,
            "title": "\u80E1\u724C\u89C4\u5219",
            "content": "\xB7\u5141\u8BB8\u4E00\u70AE\u591A\u54CD\n\xB7\u6BCF\u4E2A\u73A9\u5BB6\u53EF\u591A\u6B21\u80E1\u724C\uFF0C\u76F4\u81F3\u6478\u5B8C\u6240\u6709\u624B\u724C\uFF0C\u80E1\u724C\u65F6\u76F4\u63A5\u7ED3\u7B97"
          },
          {
            "ruleId": 502103,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2092,
            "contentId": 2093,
            "title": "\u5B9A\u7F3A",
            "content": "\xB7\u80E1\u724C\u65F6\uFF0C\u624B\u724C\u4E2D\u4E0D\u80FD\u8D85\u8FC72\u95E8\u82B1\u8272\n\xB7\u9009\u62E9\u4E00\u95E8\u82B1\u8272\u505A\u4E3A\u7F3A\u724C\uFF0C\u6478\u5230\u8FD9\u95E8\u82B1\u8272\u7684\u724C\u4E00\u5B9A\u8981\u6253\u51FA\u3002\u5BF9\u5C40\u4E2D\u4E0D\u53EF\u66F4\u6539\u7F3A"
          },
          {
            "ruleId": 502104,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2040,
            "contentId": 2095,
            "title": "\u6362\u4E09\u5F20",
            "content": "\xB7\u53D1\u5B8C\u624B\u724C\u540E\uFF0C\u6BCF\u4F4D\u73A9\u5BB6\u9009\u62E93\u5F20\u540C\u82B1\u8272\u7684\u724C\uFF0C\u968F\u673A\u4E0E\u5176\u4ED61\u4F4D\u73A9\u5BB6\u4EA4\u6362"
          },
          {
            "ruleId": 502105,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2096,
            "contentId": 2097,
            "title": "\u6760\u724C",
            "content": "\xB7\u3010\u522E\u98CE\u3011\u660E\u6760\uFF0C\u6536\u53D6\u653E\u6760\u80052\u500D\u5E95\u5206\n\xB7\u3010\u8865\u6760\u3011\u6536\u53D6\u5176\u4ED6\u73A9\u5BB61\u500D\u5E95\u5206\n\xB7\u3010\u4E0B\u96E8\u3011\u6697\u6760\uFF0C\u6536\u53D6\u5176\u4ED6\u73A9\u5BB62\u500D\u5E95\u5206\n\xB7\u82E5\u53EF\u660E\u6760\u60C5\u51B5\u4E0B\uFF0C\u5148\u78B0\u518D\u8865\u6760\u4E0D\u6536\u53D6\u5E95\u5206"
          },
          {
            "ruleId": 502106,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2087,
            "contentId": 2098,
            "title": "\u547C\u53EB\u8F6C\u79FB",
            "content": "\xB7\u73A9\u5BB6\u6760\u4E0A\u70AE\uFF0C\u9700\u5C06\u6760\u724C\u6240\u5E94\u5206\u6570\u8F6C\u7ED9\u80E1\u724C\u73A9\u5BB6\n\xB7\u6760\u4E0A\u70AE\u81F4\u4E00\u70AE\u591A\u54CD\uFF0C\u4E0D\u89E6\u53D1\u547C\u53EB\u8F6C\u79FB"
          },
          {
            "ruleId": 502107,
            "gameType": 5021,
            "tab": 1,
            "titleId": 2099,
            "contentId": 2100,
            "title": "\u5BF9\u5C40\u7ED3\u675F",
            "content": "\xB7\u6478\u5B8C\u6240\u6709\u624B\u724C\u65F6\uFF0C\u672A\u542C\u724C\u3001\u82B1\u732A\u73A9\u5BB6\u9700\u8981\u63A5\u53D7\u989D\u5916\u60E9\u7F5A\n\xB7\u3010\u9000\u7A0E\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u672A\u542C\u724C\u73A9\u5BB6\uFF0C\u9000\u56DE\u5168\u90E8\u6760\u724C\u6240\u5F97\n\xB7\u3010\u67E5\u5927\u53EB\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u672A\u542C\u724C\u73A9\u5BB6\u8D54\u7ED9\u542C\u724C\u672A\u80E1\u724C\u73A9\u5BB6\u6700\u5927\u53EF\u80FD\u500D\u6570\uFF08\u4E0D\u5305\u542B\u81EA\u6478\u500D\u6570\uFF09\n\xB7\u3010\u67E5\u82B1\u732A\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u624B\u724C\u4E0A\u82E5\u6709\u7F3A\u724C\u7684\u73A9\u5BB6\u4E3A\u82B1\u732A\uFF0C\u82B1\u732A\u73A9\u5BB6\u8D54\u7ED9\u5176\u4ED6\u73A9\u5BB6\u6BCF\u4EBA16\u500D\uFF08\u82E5\u5168\u7A0B\u6253\u7F3A\u724C\uFF0C\u65E0\u9700\u8D54\u4ED8\uFF09"
          },
          {
            "ruleId": 502108,
            "gameType": 5021,
            "tab": 1,
            "titleId": 3157,
            "contentId": 3158,
            "title": "\u8840\u6D41\u5C01\u9876",
            "content": "\xB7\u514D\u8D39\u573A\uFF1A5120\u500D\n\xB7\u5176\u5B83\u573A\uFF1A10240\u500D"
          }
        ],
        "yaku": [
          {
            "yiType": 502110011,
            "gameType": 5021,
            "calcYiType": 1001,
            "endId": 2103,
            "languageId": 2103,
            "describeId": 2104,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              221,
              231,
              241,
              251,
              251,
              251,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_ph.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 1,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u5E73\u80E1",
            "description": "\u75314\u4E2A\u523B\u5B50\u6216\u987A\u5B50\u52A0\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502100071,
            "gameType": 5021,
            "calcYiType": 7,
            "endId": 2266,
            "languageId": 2153,
            "describeId": 2154,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6839",
            "description": "4\u5F20\u4E00\u6837\u7684\u724C\u4E3A1\u6839\uFF0C\u6BCF\u67091\u6839\uFF0C\u5219\u80E1\u724C\u65F6\u989D\u5916x2\u3002"
          },
          {
            "yiType": 502100081,
            "gameType": 5021,
            "calcYiType": 8,
            "endId": 2267,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502100071
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502100091,
            "gameType": 5021,
            "calcYiType": 9,
            "endId": 2268,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 3,
            "exceptYis": [
              502100071,
              502100081
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502100101,
            "gameType": 5021,
            "calcYiType": 10,
            "endId": 2269,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 3,
            "exceptYis": [
              502100071,
              502100081,
              502100091
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502100041,
            "gameType": 5021,
            "calcYiType": 4,
            "endId": 2155,
            "languageId": 2155,
            "describeId": 2156,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502100042
            ],
            "name": "\u81EA\u6478",
            "description": "\u81EA\u6478\u80E1\u724C\u3002"
          },
          {
            "yiType": 502100061,
            "gameType": 5021,
            "calcYiType": 6,
            "endId": 2149,
            "languageId": 2149,
            "describeId": 2150,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_gskh.png",
            "isOpen": 1,
            "priority": 2,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6760\u4E0A\u5F00\u82B1",
            "description": "\u6760\u724C\u540E\uFF0C\u8865\u5F20\u81EA\u6478\u80E1\u724C\u3002"
          },
          {
            "yiType": 502100031,
            "gameType": 5021,
            "calcYiType": 3,
            "endId": 2151,
            "languageId": 2151,
            "describeId": 2152,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qgh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              1,
              2
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u62A2\u6760\u80E1",
            "description": "\u80E1\u5176\u4ED6\u4EBA\u8865\u6760\u7684\u90A3\u5F20\u724C\u3002"
          },
          {
            "yiType": 502100051,
            "gameType": 5021,
            "calcYiType": 5,
            "endId": 2147,
            "languageId": 2147,
            "describeId": 2148,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_hdly.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6D77\u5E95\u635E\u6708",
            "description": "\u6478\u5230\u724C\u5899\u4E2D\u7684\u6700\u540E1\u5F20\u724C\u80E1\u724C\u3002"
          },
          {
            "yiType": 502110031,
            "gameType": 5021,
            "calcYiType": 1003,
            "endId": 2105,
            "languageId": 2105,
            "describeId": 2106,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              211,
              211,
              211,
              0,
              231,
              231,
              231,
              0,
              241,
              241,
              241,
              0,
              261,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_pph.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502110121
            ],
            "name": "\u78B0\u78B0\u80E1",
            "description": "\u75314\u4E2A\u523B\u5B50\uFF08\u6216\u6760\u724C\uFF09\u548C\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502100121,
            "gameType": 5021,
            "calcYiType": 12,
            "endId": 2107,
            "languageId": 2107,
            "describeId": 2108,
            "yiTypeShow": [
              121,
              131,
              141,
              151,
              161,
              171,
              221,
              221,
              221,
              231,
              241,
              251,
              261,
              0,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dyj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u65AD\u5E7A\u4E5D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u624B\u4E2D\u6CA1\u67091\u30019\u5E8F\u6570\u724C\u3002"
          },
          {
            "yiType": 502110101,
            "gameType": 5021,
            "calcYiType": 1010,
            "endId": 2107,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dyj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502110011,
              502110111,
              502110121,
              502100121
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502100131,
            "gameType": 5021,
            "calcYiType": 13,
            "endId": 2109,
            "languageId": 2109,
            "describeId": 2110,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              171,
              171,
              171,
              181,
              181,
              181,
              191,
              0,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qys.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6E05\u4E00\u8272",
            "description": "\u5168\u90E8\u7531\u4E07/\u7B52/\u6761\u4E2D\u7684\u67D0\u4E00\u79CD\u82B1\u8272\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502110111,
            "gameType": 5021,
            "calcYiType": 1011,
            "endId": 2109,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qys.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502110011,
              502110101,
              502110121,
              502100131
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502130011,
            "gameType": 5021,
            "calcYiType": 3001,
            "endId": 2111,
            "languageId": 2111,
            "describeId": 2112,
            "yiTypeShow": [
              121,
              121,
              161,
              161,
              221,
              221,
              241,
              241,
              251,
              251,
              271,
              271,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502130011,
              502100071
            ],
            "name": "\u4E03\u5BF9",
            "description": "\u7531\u4E03\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502110041,
            "gameType": 5021,
            "calcYiType": 1004,
            "endId": 2113,
            "languageId": 2113,
            "describeId": 2114,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              211,
              211,
              211,
              0,
              231,
              231,
              231,
              0,
              241,
              241,
              241,
              0,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502110121,
              502110031
            ],
            "name": "\u91D1\u94A9\u9493",
            "description": "\u80E1\u724C\u65F6\u5176\u4ED6\u724C\u90FD\u88AB\u78B0\u724C\u3001\u6760\u724C\u3002\u624B\u4E2D\u53EA\u5269\u4E00\u5F20\u724C\u5355\u9493\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3002"
          },
          {
            "yiType": 502100141,
            "gameType": 5021,
            "calcYiType": 14,
            "endId": 2115,
            "languageId": 2115,
            "describeId": 2116,
            "yiTypeShow": [
              111,
              121,
              131,
              191,
              191,
              191,
              211,
              221,
              231,
              271,
              281,
              291,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_yj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u5E7A\u4E5D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u6BCF\u4E00\u4E2A\u523B\u5B50\u3001\u987A\u5B50\u5C06\u90FD\u5305\u542B1\u30019\u5E8F\u6570\u724C\u3002"
          },
          {
            "yiType": 502110121,
            "gameType": 5021,
            "calcYiType": 1012,
            "endId": 2115,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_yj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502100141
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502110051,
            "gameType": 5021,
            "calcYiType": 1005,
            "endId": 2117,
            "languageId": 2117,
            "describeId": 2118,
            "yiTypeShow": [
              131,
              131,
              131,
              0,
              151,
              151,
              151,
              0,
              161,
              161,
              161,
              0,
              181,
              181,
              181,
              0,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qp.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502110121,
              502110031,
              502100131
            ],
            "name": "\u6E05\u78B0",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u78B0\u78B0\u80E1\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u6E05\u4E00\u8272\u3002"
          },
          {
            "yiType": 502130031,
            "gameType": 5021,
            "calcYiType": 3003,
            "endId": 2119,
            "languageId": 2119,
            "describeId": 2120,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              171,
              171,
              191,
              191,
              231,
              231,
              251,
              251,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_lqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502130011,
              502100071,
              502130051
            ],
            "name": "\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67091\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u4E0D\u8BA11\u6839\u3002"
          },
          {
            "yiType": 502110061,
            "gameType": 5021,
            "calcYiType": 1006,
            "endId": 2121,
            "languageId": 2121,
            "describeId": 2122,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              151,
              151,
              151,
              0,
              181,
              181,
              181,
              0,
              221,
              221,
              221,
              0,
              251,
              251
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502110121,
              502110031,
              502100121
            ],
            "name": "\u5C06\u5BF9",
            "description": "\u624B\u724C\u5168\u90E8\u662F2\u30015\u30018\u7684\u78B0\u78B0\u80E1\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502130041,
            "gameType": 5021,
            "calcYiType": 3004,
            "endId": 2123,
            "languageId": 2123,
            "describeId": 2124,
            "yiTypeShow": [
              111,
              111,
              131,
              131,
              141,
              141,
              151,
              151,
              161,
              161,
              171,
              171,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502130011,
              502100131
            ],
            "name": "\u6E05\u4E03\u5BF9",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u4E03\u5BF9\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u4E03\u5BF9\u3002"
          },
          {
            "yiType": 502110071,
            "gameType": 5021,
            "calcYiType": 1007,
            "endId": 2125,
            "languageId": 2125,
            "describeId": 2126,
            "yiTypeShow": [
              111,
              111,
              111,
              0,
              131,
              131,
              131,
              0,
              141,
              141,
              141,
              0,
              151,
              151,
              151,
              0,
              161,
              0,
              161
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qjgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502110011,
              502110051,
              502110101,
              502110111,
              502110121,
              502110041,
              502110031,
              502100131
            ],
            "name": "\u6E05\u91D1\u94A9\u9493",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u91D1\u94A9\u9493\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u6E05\u78B0\u3002"
          },
          {
            "yiType": 502130051,
            "gameType": 5021,
            "calcYiType": 3005,
            "endId": 2127,
            "languageId": 2127,
            "describeId": 2128,
            "yiTypeShow": [
              121,
              121,
              151,
              151,
              181,
              181,
              221,
              221,
              251,
              251,
              281,
              281,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502130011,
              502100121,
              502130031
            ],
            "name": "\u5C06\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502130061,
            "gameType": 5021,
            "calcYiType": 3006,
            "endId": 2129,
            "languageId": 2129,
            "describeId": 2130,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              211,
              211,
              211,
              211,
              231,
              231,
              261,
              261,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_slqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502130011,
              502130031,
              502100071,
              502100081
            ],
            "name": "\u53CC\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67092\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u9F99\u4E03\u5BF9\u3001\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502100021,
            "gameType": 5021,
            "calcYiType": 2,
            "endId": 2131,
            "languageId": 2131,
            "describeId": 2132,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502100041,
              502100042,
              502100111
            ],
            "name": "\u5730\u80E1",
            "description": "\u975E\u5E84\u5BB6\u7B2C\u4E00\u8F6E\u6478\u724C\u5C31\u80E1\u724C\uFF0C\u4E3A\u5730\u80E1\u3002"
          },
          {
            "yiType": 502100011,
            "gameType": 5021,
            "calcYiType": 1,
            "endId": 2133,
            "languageId": 2133,
            "describeId": 2134,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_th.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502100041,
              502100042,
              502100111
            ],
            "name": "\u5929\u80E1",
            "description": "\u5E84\u5BB6\u53D1\u5B8C\u724C\u540E\u7ACB\u5373\u80E1\u724C\uFF0C\u4E3A\u5929\u80E1\u3002"
          },
          {
            "yiType": 502130071,
            "gameType": 5021,
            "calcYiType": 3007,
            "endId": 2135,
            "languageId": 2135,
            "describeId": 2136,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              131,
              131,
              151,
              151,
              171,
              171,
              181,
              181,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502130041,
              502130011,
              502130031,
              502100071,
              502100131
            ],
            "name": "\u6E05\u9F99\u4E03\u5BF9",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u9F99\u4E03\u5BF9\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u9F99\u4E03\u5BF9\u3001\u4E03\u5BF9\u3001\u6E05\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502130081,
            "gameType": 5021,
            "calcYiType": 3008,
            "endId": 2137,
            "languageId": 2137,
            "describeId": 2138,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              211,
              211,
              211,
              211,
              261,
              261,
              261,
              261,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_sanlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502130011,
              502130031,
              502130061,
              502100071,
              502100081,
              502100091
            ],
            "name": "\u4E09\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67093\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502130091,
            "gameType": 5021,
            "calcYiType": 3009,
            "endId": 2139,
            "languageId": 2139,
            "describeId": 2140,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              151,
              151,
              151,
              151,
              221,
              221,
              251,
              251,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jslqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502130011,
              502130031,
              502130051,
              502130061,
              502100121,
              502100071,
              502100081
            ],
            "name": "\u5C06\u53CC\u9F99\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u53CC\u9F99\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u65AD\u5E7A\u4E5D\u3001\u6839\u3002"
          },
          {
            "yiType": 502110081,
            "gameType": 5021,
            "calcYiType": 1008,
            "endId": 2141,
            "languageId": 2141,
            "describeId": 2142,
            "yiTypeShow": [
              111,
              111,
              111,
              111,
              0,
              161,
              161,
              161,
              161,
              0,
              221,
              221,
              221,
              221,
              0,
              271,
              271,
              271,
              271,
              0,
              281,
              0,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_sblh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502110121,
              502110041,
              502110031,
              502100071,
              502100081,
              502100091,
              502100101
            ],
            "name": "\u5341\u516B\u7F57\u6C49",
            "description": "\u91D1\u94A9\u9493\uFF0C\u4E14\u80E1\u724C\u65F6\u67094\u4E2A\u6760\u724C\u3002\n\u4E0D\u8BA14\u6839\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3002"
          },
          {
            "yiType": 502130101,
            "gameType": 5021,
            "calcYiType": 3010,
            "endId": 2143,
            "languageId": 2143,
            "describeId": 2144,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              151,
              151,
              151,
              151,
              221,
              221,
              221,
              221,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jshlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 126,
            "sizeType": 1,
            "exceptYis": [
              502130011,
              502130031,
              502130051,
              502130061,
              502130081,
              502130091,
              502100121,
              502100071,
              502100081,
              502100091
            ],
            "name": "\u5C06\u4E09\u9F99\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u4E09\u9F99\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u5C06\u53CC\u9F99\u4E03\u5BF9\u3001\u4E09\u9F99\u4E03\u5BF9\u3001\u6839\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502110091,
            "gameType": 5021,
            "calcYiType": 1009,
            "endId": 2145,
            "languageId": 2145,
            "describeId": 2146,
            "yiTypeShow": [
              111,
              111,
              111,
              111,
              0,
              121,
              121,
              121,
              121,
              0,
              161,
              161,
              161,
              161,
              0,
              171,
              171,
              171,
              171,
              0,
              181,
              0,
              181
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qsblh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 256,
            "sizeType": 1,
            "exceptYis": [
              502110011,
              502110101,
              502110111,
              502110121,
              502110041,
              502110031,
              502100071,
              502100081,
              502100091,
              502100101,
              502100131,
              502110051,
              502110071,
              502110081
            ],
            "name": "\u6E05\u5341\u516B\u7F57\u6C49",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u5341\u516B\u7F57\u6C49\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u5341\u516B\u7F57\u6C49\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u6E05\u4E00\u8272\u3001\u6E05\u78B0\u30014\u6839\u3002"
          }
        ],
        "rooms": [
          {
            "id": 502101,
            "gameType": 5021,
            "nameId": 1782,
            "name": "\u514D\u8D39\u573A",
            "ruleTags": [
              0,
              3
            ],
            "moneyNeedMin": 0,
            "moneyNeedMax": 1700,
            "moneyCost": 0,
            "moneyBase": 30,
            "topBei": 128,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 38
          },
          {
            "id": 502102,
            "gameType": 5021,
            "nameId": 1800,
            "name": "\u542F\u822A",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 850,
            "moneyNeedMax": 6e4,
            "moneyCost": 100,
            "moneyBase": 150,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 3
          },
          {
            "id": 502103,
            "gameType": 5021,
            "nameId": 1801,
            "name": "\u9010\u68A6",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 4e3,
            "moneyNeedMax": 25e4,
            "moneyCost": 350,
            "moneyBase": 400,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 4
          },
          {
            "id": 502104,
            "gameType": 5021,
            "nameId": 1802,
            "name": "\u4E58\u98CE",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 15e3,
            "moneyNeedMax": 0,
            "moneyCost": 1250,
            "moneyBase": 1250,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 5
          },
          {
            "id": 502105,
            "gameType": 5021,
            "nameId": 2037,
            "name": "\u51CC\u9704",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 33e3,
            "moneyNeedMax": 0,
            "moneyCost": 5e3,
            "moneyBase": 5e3,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 6
          },
          {
            "id": 502106,
            "gameType": 5021,
            "nameId": 2038,
            "name": "\u94F8\u661F",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 83e3,
            "moneyNeedMax": 0,
            "moneyCost": 15e3,
            "moneyBase": 12500,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 7
          },
          {
            "id": 502107,
            "gameType": 5021,
            "nameId": 1803,
            "name": "\u5FA1\u9F99",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 25e4,
            "moneyNeedMax": 0,
            "moneyCost": 4e4,
            "moneyBase": 3e4,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 8
          },
          {
            "id": 502108,
            "gameType": 5021,
            "nameId": 1800,
            "name": "\u542F\u822A",
            "ruleTags": [
              1
            ],
            "moneyNeedMin": 850,
            "moneyNeedMax": 6e4,
            "moneyCost": 160,
            "moneyBase": 150,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 9
          },
          {
            "id": 502109,
            "gameType": 5021,
            "nameId": 1801,
            "name": "\u9010\u68A6",
            "ruleTags": [
              1
            ],
            "moneyNeedMin": 4e3,
            "moneyNeedMax": 25e4,
            "moneyCost": 625,
            "moneyBase": 600,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 10
          }
        ]
      },
      "5022": {
        "name": "\u8840\u6218\u9EBB\u5C06",
        "rules": [
          {
            "ruleId": 502201,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2088,
            "contentId": 2089,
            "title": "\u7528\u724C",
            "content": "\xB71-9\u4E07\u30011-9\u7B52\u30011-9\u6761\uFF0C\u5171108\u5F20\u724C\n\xB7\u53EF\u4EE5\u78B0\uFF0C\u6760\uFF0C\u4E0D\u80FD\u5403"
          },
          {
            "ruleId": 502202,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2090,
            "contentId": 2094,
            "title": "\u80E1\u724C\u89C4\u5219",
            "content": "\xB7\u5141\u8BB8\u4E00\u70AE\u591A\u54CD\n\xB7\u4E00\u4E2A\u73A9\u5BB6\u80E1\u724C\u540E\uFF0C\u724C\u5C40\u7EE7\u7EED\uFF0C\u76F4\u81F3\u6709\u4E09\u4E2A\u4EBA\u90FD\u80E1\u724C\u6216\u6478\u5B8C\u6240\u6709\u624B\u724C\uFF0C\u5BF9\u5C40\u7ED3\u675F"
          },
          {
            "ruleId": 502203,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2092,
            "contentId": 2093,
            "title": "\u5B9A\u7F3A",
            "content": "\xB7\u80E1\u724C\u65F6\uFF0C\u624B\u724C\u4E2D\u4E0D\u80FD\u8D85\u8FC72\u95E8\u82B1\u8272\n\xB7\u9009\u62E9\u4E00\u95E8\u82B1\u8272\u505A\u4E3A\u7F3A\u724C\uFF0C\u6478\u5230\u8FD9\u95E8\u82B1\u8272\u7684\u724C\u4E00\u5B9A\u8981\u6253\u51FA\u3002\u5BF9\u5C40\u4E2D\u4E0D\u53EF\u66F4\u6539\u7F3A"
          },
          {
            "ruleId": 502204,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2040,
            "contentId": 2095,
            "title": "\u6362\u4E09\u5F20",
            "content": "\xB7\u53D1\u5B8C\u624B\u724C\u540E\uFF0C\u6BCF\u4F4D\u73A9\u5BB6\u9009\u62E93\u5F20\u540C\u82B1\u8272\u7684\u724C\uFF0C\u968F\u673A\u4E0E\u5176\u4ED61\u4F4D\u73A9\u5BB6\u4EA4\u6362"
          },
          {
            "ruleId": 502205,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2096,
            "contentId": 2097,
            "title": "\u6760\u724C",
            "content": "\xB7\u3010\u522E\u98CE\u3011\u660E\u6760\uFF0C\u6536\u53D6\u653E\u6760\u80052\u500D\u5E95\u5206\n\xB7\u3010\u8865\u6760\u3011\u6536\u53D6\u5176\u4ED6\u73A9\u5BB61\u500D\u5E95\u5206\n\xB7\u3010\u4E0B\u96E8\u3011\u6697\u6760\uFF0C\u6536\u53D6\u5176\u4ED6\u73A9\u5BB62\u500D\u5E95\u5206\n\xB7\u82E5\u53EF\u660E\u6760\u60C5\u51B5\u4E0B\uFF0C\u5148\u78B0\u518D\u8865\u6760\u4E0D\u6536\u53D6\u5E95\u5206"
          },
          {
            "ruleId": 502206,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2087,
            "contentId": 2098,
            "title": "\u547C\u53EB\u8F6C\u79FB",
            "content": "\xB7\u73A9\u5BB6\u6760\u4E0A\u70AE\uFF0C\u9700\u5C06\u6760\u724C\u6240\u5E94\u5206\u6570\u8F6C\u7ED9\u80E1\u724C\u73A9\u5BB6\n\xB7\u6760\u4E0A\u70AE\u81F4\u4E00\u70AE\u591A\u54CD\uFF0C\u4E0D\u89E6\u53D1\u547C\u53EB\u8F6C\u79FB"
          },
          {
            "ruleId": 502207,
            "gameType": 5022,
            "tab": 1,
            "titleId": 2099,
            "contentId": 2100,
            "title": "\u5BF9\u5C40\u7ED3\u675F",
            "content": "\xB7\u6478\u5B8C\u6240\u6709\u624B\u724C\u65F6\uFF0C\u672A\u542C\u724C\u3001\u82B1\u732A\u73A9\u5BB6\u9700\u8981\u63A5\u53D7\u989D\u5916\u60E9\u7F5A\n\xB7\u3010\u9000\u7A0E\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u672A\u542C\u724C\u73A9\u5BB6\uFF0C\u9000\u56DE\u5168\u90E8\u6760\u724C\u6240\u5F97\n\xB7\u3010\u67E5\u5927\u53EB\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u672A\u542C\u724C\u73A9\u5BB6\u8D54\u7ED9\u542C\u724C\u672A\u80E1\u724C\u73A9\u5BB6\u6700\u5927\u53EF\u80FD\u500D\u6570\uFF08\u4E0D\u5305\u542B\u81EA\u6478\u500D\u6570\uFF09\n\xB7\u3010\u67E5\u82B1\u732A\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u624B\u724C\u4E0A\u82E5\u6709\u7F3A\u724C\u7684\u73A9\u5BB6\u4E3A\u82B1\u732A\uFF0C\u82B1\u732A\u73A9\u5BB6\u8D54\u7ED9\u5176\u4ED6\u73A9\u5BB6\u6BCF\u4EBA16\u500D\uFF08\u82E5\u5168\u7A0B\u6253\u7F3A\u724C\uFF0C\u65E0\u9700\u8D54\u4ED8\uFF09"
          },
          {
            "ruleId": 502208,
            "gameType": 5022,
            "tab": 1,
            "titleId": 3159,
            "contentId": 3160,
            "title": "\u8840\u6218\u5C01\u9876",
            "content": "\u6362\u4E09\u5F20\uFF1A\n\xB7\u514D\u8D39~\u9010\u68A6\u573A\uFF1A128\u500D\n\xB7\u5176\u5B83\u573A\uFF1A256\u500D\n\n\u4E0D\u6362\u4E09\u5F20\uFF1A256\u500D"
          }
        ],
        "yaku": [
          {
            "yiType": 502210011,
            "gameType": 5022,
            "calcYiType": 1001,
            "endId": 2103,
            "languageId": 2103,
            "describeId": 2104,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              221,
              231,
              241,
              251,
              251,
              251,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_ph.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 1,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u5E73\u80E1",
            "description": "\u75314\u4E2A\u523B\u5B50\u6216\u987A\u5B50\u52A0\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502200071,
            "gameType": 5022,
            "calcYiType": 7,
            "endId": 2266,
            "languageId": 2153,
            "describeId": 2154,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6839",
            "description": "4\u5F20\u4E00\u6837\u7684\u724C\u4E3A1\u6839\uFF0C\u6BCF\u67091\u6839\uFF0C\u5219\u80E1\u724C\u65F6\u989D\u5916x2\u3002"
          },
          {
            "yiType": 502200081,
            "gameType": 5022,
            "calcYiType": 8,
            "endId": 2267,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502200071
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502200091,
            "gameType": 5022,
            "calcYiType": 9,
            "endId": 2268,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 3,
            "exceptYis": [
              502200071,
              502200081
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502200101,
            "gameType": 5022,
            "calcYiType": 10,
            "endId": 2269,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 3,
            "exceptYis": [
              502200071,
              502200081,
              502200091
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502200041,
            "gameType": 5022,
            "calcYiType": 4,
            "endId": 2155,
            "languageId": 2155,
            "describeId": 2156,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502200041
            ],
            "name": "\u81EA\u6478",
            "description": "\u81EA\u6478\u80E1\u724C\u3002"
          },
          {
            "yiType": 502200061,
            "gameType": 5022,
            "calcYiType": 6,
            "endId": 2149,
            "languageId": 2149,
            "describeId": 2150,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_gskh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6760\u4E0A\u5F00\u82B1",
            "description": "\u6760\u724C\u540E\uFF0C\u8865\u5F20\u81EA\u6478\u80E1\u724C\u3002"
          },
          {
            "yiType": 502200031,
            "gameType": 5022,
            "calcYiType": 3,
            "endId": 2151,
            "languageId": 2151,
            "describeId": 2152,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qgh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              1,
              2
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u62A2\u6760\u80E1",
            "description": "\u80E1\u5176\u4ED6\u4EBA\u8865\u6760\u7684\u90A3\u5F20\u724C\u3002"
          },
          {
            "yiType": 502200051,
            "gameType": 5022,
            "calcYiType": 5,
            "endId": 2147,
            "languageId": 2147,
            "describeId": 2148,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_hdly.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6D77\u5E95\u635E\u6708",
            "description": "\u6478\u5230\u724C\u5899\u4E2D\u7684\u6700\u540E1\u5F20\u724C\u80E1\u724C\u3002"
          },
          {
            "yiType": 502210031,
            "gameType": 5022,
            "calcYiType": 1003,
            "endId": 2105,
            "languageId": 2105,
            "describeId": 2106,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              211,
              211,
              211,
              0,
              231,
              231,
              231,
              0,
              241,
              241,
              241,
              0,
              261,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_pph.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502210121
            ],
            "name": "\u78B0\u78B0\u80E1",
            "description": "\u75314\u4E2A\u523B\u5B50\uFF08\u6216\u6760\u724C\uFF09\u548C\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502200121,
            "gameType": 5022,
            "calcYiType": 12,
            "endId": 2107,
            "languageId": 2107,
            "describeId": 2108,
            "yiTypeShow": [
              121,
              131,
              141,
              151,
              161,
              171,
              221,
              221,
              221,
              231,
              241,
              251,
              261,
              0,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dyj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u65AD\u5E7A\u4E5D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u624B\u4E2D\u6CA1\u67091\u30019\u5E8F\u6570\u724C\u3002"
          },
          {
            "yiType": 502210101,
            "gameType": 5022,
            "calcYiType": 1010,
            "endId": 2107,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dyj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502210011,
              502210111,
              502210121,
              502200121
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502200131,
            "gameType": 5022,
            "calcYiType": 13,
            "endId": 2109,
            "languageId": 2109,
            "describeId": 2110,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              171,
              171,
              171,
              181,
              181,
              181,
              191,
              0,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qys.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6E05\u4E00\u8272",
            "description": "\u5168\u90E8\u7531\u4E07/\u7B52/\u6761\u4E2D\u7684\u67D0\u4E00\u79CD\u82B1\u8272\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502210111,
            "gameType": 5022,
            "calcYiType": 1011,
            "endId": 2109,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qys.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502210011,
              502210101,
              502210121,
              502200131
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502230011,
            "gameType": 5022,
            "calcYiType": 3001,
            "endId": 2111,
            "languageId": 2111,
            "describeId": 2112,
            "yiTypeShow": [
              121,
              121,
              161,
              161,
              221,
              221,
              241,
              241,
              251,
              251,
              271,
              271,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502230011,
              502200071
            ],
            "name": "\u4E03\u5BF9",
            "description": "\u7531\u4E03\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502210041,
            "gameType": 5022,
            "calcYiType": 1004,
            "endId": 2113,
            "languageId": 2113,
            "describeId": 2114,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              211,
              211,
              211,
              0,
              231,
              231,
              231,
              0,
              241,
              241,
              241,
              0,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502210121,
              502210031
            ],
            "name": "\u91D1\u94A9\u9493",
            "description": "\u80E1\u724C\u65F6\u5176\u4ED6\u724C\u90FD\u88AB\u78B0\u724C\u3001\u6760\u724C\u3002\u624B\u4E2D\u53EA\u5269\u4E00\u5F20\u724C\u5355\u9493\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3002"
          },
          {
            "yiType": 502200141,
            "gameType": 5022,
            "calcYiType": 14,
            "endId": 2115,
            "languageId": 2115,
            "describeId": 2116,
            "yiTypeShow": [
              111,
              121,
              131,
              191,
              191,
              191,
              211,
              221,
              231,
              271,
              281,
              291,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_yj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u5E7A\u4E5D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u6BCF\u4E00\u4E2A\u523B\u5B50\u3001\u987A\u5B50\u5C06\u90FD\u5305\u542B1\u30019\u5E8F\u6570\u724C\u3002"
          },
          {
            "yiType": 502210121,
            "gameType": 5022,
            "calcYiType": 1012,
            "endId": 2115,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_yj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502200141
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502210051,
            "gameType": 5022,
            "calcYiType": 1005,
            "endId": 2117,
            "languageId": 2117,
            "describeId": 2118,
            "yiTypeShow": [
              131,
              131,
              131,
              0,
              151,
              151,
              151,
              0,
              161,
              161,
              161,
              0,
              181,
              181,
              181,
              0,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qp.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502210121,
              502210031,
              502200131
            ],
            "name": "\u6E05\u78B0",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u78B0\u78B0\u80E1\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u6E05\u4E00\u8272\u3002"
          },
          {
            "yiType": 502230031,
            "gameType": 5022,
            "calcYiType": 3003,
            "endId": 2119,
            "languageId": 2119,
            "describeId": 2120,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              171,
              171,
              191,
              191,
              231,
              231,
              251,
              251,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_lqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502230011,
              502200071,
              502230051
            ],
            "name": "\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67091\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u4E0D\u8BA11\u6839\u3002"
          },
          {
            "yiType": 502210061,
            "gameType": 5022,
            "calcYiType": 1006,
            "endId": 2121,
            "languageId": 2121,
            "describeId": 2122,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              151,
              151,
              151,
              0,
              181,
              181,
              181,
              0,
              221,
              221,
              221,
              0,
              251,
              251
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502210121,
              502210031,
              502200121
            ],
            "name": "\u5C06\u5BF9",
            "description": "\u624B\u724C\u5168\u90E8\u662F2\u30015\u30018\u7684\u78B0\u78B0\u80E1\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502230041,
            "gameType": 5022,
            "calcYiType": 3004,
            "endId": 2123,
            "languageId": 2123,
            "describeId": 2124,
            "yiTypeShow": [
              111,
              111,
              131,
              131,
              141,
              141,
              151,
              151,
              161,
              161,
              171,
              171,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502230011,
              502200131
            ],
            "name": "\u6E05\u4E03\u5BF9",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u4E03\u5BF9\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u4E03\u5BF9\u3002"
          },
          {
            "yiType": 502210071,
            "gameType": 5022,
            "calcYiType": 1007,
            "endId": 2125,
            "languageId": 2125,
            "describeId": 2126,
            "yiTypeShow": [
              111,
              111,
              111,
              0,
              131,
              131,
              131,
              0,
              141,
              141,
              141,
              0,
              151,
              151,
              151,
              0,
              161,
              0,
              161
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qjgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502210011,
              502210051,
              502210101,
              502210111,
              502210121,
              502210041,
              502210031,
              502200131
            ],
            "name": "\u6E05\u91D1\u94A9\u9493",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u91D1\u94A9\u9493\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u6E05\u78B0\u3002"
          },
          {
            "yiType": 502230051,
            "gameType": 5022,
            "calcYiType": 3005,
            "endId": 2127,
            "languageId": 2127,
            "describeId": 2128,
            "yiTypeShow": [
              121,
              121,
              151,
              151,
              181,
              181,
              221,
              221,
              251,
              251,
              281,
              281,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502230011,
              502200121,
              502230031
            ],
            "name": "\u5C06\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502230061,
            "gameType": 5022,
            "calcYiType": 3006,
            "endId": 2129,
            "languageId": 2129,
            "describeId": 2130,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              211,
              211,
              211,
              211,
              231,
              231,
              261,
              261,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_slqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502230011,
              502230031,
              502200071,
              502200081
            ],
            "name": "\u53CC\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67092\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u9F99\u4E03\u5BF9\u3001\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502200021,
            "gameType": 5022,
            "calcYiType": 2,
            "endId": 2131,
            "languageId": 2131,
            "describeId": 2132,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502200041,
              502200042,
              502100111
            ],
            "name": "\u5730\u80E1",
            "description": "\u975E\u5E84\u5BB6\u7B2C\u4E00\u8F6E\u6478\u724C\u5C31\u80E1\u724C\uFF0C\u4E3A\u5730\u80E1\u3002"
          },
          {
            "yiType": 502200011,
            "gameType": 5022,
            "calcYiType": 1,
            "endId": 2133,
            "languageId": 2133,
            "describeId": 2134,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_th.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502200041,
              502200042,
              502100111
            ],
            "name": "\u5929\u80E1",
            "description": "\u5E84\u5BB6\u53D1\u5B8C\u724C\u540E\u7ACB\u5373\u80E1\u724C\uFF0C\u4E3A\u5929\u80E1\u3002"
          },
          {
            "yiType": 502230071,
            "gameType": 5022,
            "calcYiType": 3007,
            "endId": 2135,
            "languageId": 2135,
            "describeId": 2136,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              131,
              131,
              151,
              151,
              171,
              171,
              181,
              181,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502230041,
              502230011,
              502230031,
              502200071,
              502200131
            ],
            "name": "\u6E05\u9F99\u4E03\u5BF9",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u9F99\u4E03\u5BF9\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u9F99\u4E03\u5BF9\u3001\u4E03\u5BF9\u3001\u6E05\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502230081,
            "gameType": 5022,
            "calcYiType": 3008,
            "endId": 2137,
            "languageId": 2137,
            "describeId": 2138,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              211,
              211,
              211,
              211,
              261,
              261,
              261,
              261,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_sanlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502230011,
              502230031,
              502230061,
              502200071,
              502200081,
              502200091
            ],
            "name": "\u4E09\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67093\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502230091,
            "gameType": 5022,
            "calcYiType": 3009,
            "endId": 2139,
            "languageId": 2139,
            "describeId": 2140,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              151,
              151,
              151,
              151,
              221,
              221,
              251,
              251,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jslqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502230011,
              502230031,
              502230051,
              502230061,
              502200121,
              502200071,
              502200081
            ],
            "name": "\u5C06\u53CC\u9F99\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u53CC\u9F99\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u65AD\u5E7A\u4E5D\u3001\u6839\u3002"
          },
          {
            "yiType": 502210081,
            "gameType": 5022,
            "calcYiType": 1008,
            "endId": 2141,
            "languageId": 2141,
            "describeId": 2142,
            "yiTypeShow": [
              111,
              111,
              111,
              111,
              0,
              161,
              161,
              161,
              161,
              0,
              221,
              221,
              221,
              221,
              0,
              271,
              271,
              271,
              271,
              0,
              281,
              0,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_sblh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502210121,
              502210041,
              502210031,
              502200071,
              502200081,
              502200091,
              502200101
            ],
            "name": "\u5341\u516B\u7F57\u6C49",
            "description": "\u91D1\u94A9\u9493\uFF0C\u4E14\u80E1\u724C\u65F6\u67094\u4E2A\u6760\u724C\u3002\n\u4E0D\u8BA14\u6839\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3002"
          },
          {
            "yiType": 502230101,
            "gameType": 5022,
            "calcYiType": 3010,
            "endId": 2143,
            "languageId": 2143,
            "describeId": 2144,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              151,
              151,
              151,
              151,
              221,
              221,
              221,
              221,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jshlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 126,
            "sizeType": 1,
            "exceptYis": [
              502230011,
              502230031,
              502230051,
              502230061,
              502230081,
              502230091,
              502200121,
              502200071,
              502200081,
              502200091
            ],
            "name": "\u5C06\u4E09\u9F99\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u4E09\u9F99\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u5C06\u53CC\u9F99\u4E03\u5BF9\u3001\u4E09\u9F99\u4E03\u5BF9\u3001\u6839\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502210091,
            "gameType": 5022,
            "calcYiType": 1009,
            "endId": 2145,
            "languageId": 2145,
            "describeId": 2146,
            "yiTypeShow": [
              111,
              111,
              111,
              111,
              0,
              121,
              121,
              121,
              121,
              0,
              161,
              161,
              161,
              161,
              0,
              171,
              171,
              171,
              171,
              0,
              181,
              0,
              181
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qsblh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 256,
            "sizeType": 1,
            "exceptYis": [
              502210011,
              502210101,
              502210111,
              502210121,
              502210041,
              502210031,
              502200071,
              502200081,
              502200091,
              502200101,
              502200131,
              502210051,
              502210071,
              502210081
            ],
            "name": "\u6E05\u5341\u516B\u7F57\u6C49",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u5341\u516B\u7F57\u6C49\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u5341\u516B\u7F57\u6C49\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u6E05\u4E00\u8272\u3001\u6E05\u78B0\u30014\u6839\u3002"
          }
        ],
        "rooms": [
          {
            "id": 502201,
            "gameType": 5022,
            "nameId": 1782,
            "name": "\u514D\u8D39\u573A",
            "ruleTags": [
              0,
              3
            ],
            "moneyNeedMin": 0,
            "moneyNeedMax": 1700,
            "moneyCost": 0,
            "moneyBase": 30,
            "topBei": 128,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 39
          },
          {
            "id": 502202,
            "gameType": 5022,
            "nameId": 1800,
            "name": "\u542F\u822A",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 850,
            "moneyNeedMax": 4e4,
            "moneyCost": 100,
            "moneyBase": 150,
            "topBei": 128,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 12
          },
          {
            "id": 502203,
            "gameType": 5022,
            "nameId": 1801,
            "name": "\u9010\u68A6",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 2e3,
            "moneyNeedMax": 125e3,
            "moneyCost": 350,
            "moneyBase": 400,
            "topBei": 128,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 13
          },
          {
            "id": 502204,
            "gameType": 5022,
            "nameId": 1802,
            "name": "\u4E58\u98CE",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 8e3,
            "moneyNeedMax": 0,
            "moneyCost": 1250,
            "moneyBase": 1250,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 14
          },
          {
            "id": 502205,
            "gameType": 5022,
            "nameId": 2037,
            "name": "\u51CC\u9704",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 21e3,
            "moneyNeedMax": 0,
            "moneyCost": 3750,
            "moneyBase": 3750,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 15
          },
          {
            "id": 502206,
            "gameType": 5022,
            "nameId": 2038,
            "name": "\u94F8\u661F",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 62e3,
            "moneyNeedMax": 0,
            "moneyCost": 15e3,
            "moneyBase": 12500,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 16
          },
          {
            "id": 502207,
            "gameType": 5022,
            "nameId": 1803,
            "name": "\u5FA1\u9F99",
            "ruleTags": [
              0
            ],
            "moneyNeedMin": 167e3,
            "moneyNeedMax": 0,
            "moneyCost": 4e4,
            "moneyBase": 33500,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 17
          },
          {
            "id": 502208,
            "gameType": 5022,
            "nameId": 1800,
            "name": "\u542F\u822A",
            "ruleTags": [
              1
            ],
            "moneyNeedMin": 850,
            "moneyNeedMax": 6e4,
            "moneyCost": 80,
            "moneyBase": 150,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 18
          },
          {
            "id": 502209,
            "gameType": 5022,
            "nameId": 1801,
            "name": "\u9010\u68A6",
            "ruleTags": [
              1
            ],
            "moneyNeedMin": 2e3,
            "moneyNeedMax": 125e3,
            "moneyCost": 500,
            "moneyBase": 600,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 19
          }
        ]
      },
      "5023": {
        "name": "\u7EA2\u4E2D\u8840\u6D41",
        "rules": [
          {
            "ruleId": 502301,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2088,
            "contentId": 2749,
            "title": "\u7528\u724C",
            "content": "\xB71-9\u4E07\u30011-9\u7B52\u30011-9\u6761\uFF0C6\u5F20\u8D56\u5B50\u724C\uFF0C\u5171114\u5F20\u724C\n\xB7\u8D56\u5B50\u724C\uFF1A\u589E\u52A06\u5F20\u7EA2\u4E2D\u8D56\u5B50\uFF0C\u4F5C\u4E3A\u4E07\u80FD\u724C\uFF0C\u53EF\u4EE3\u66FF\u5176\u4ED6\u4EFB\u610F\u57FA\u7840\u724C\n\xB7\u53EF\u4EE5\u78B0\uFF0C\u6760\uFF0C\u4E0D\u80FD\u5403"
          },
          {
            "ruleId": 502302,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2090,
            "contentId": 2750,
            "title": "\u80E1\u724C\u89C4\u5219",
            "content": "\xB7\u5141\u8BB8\u4E00\u70AE\u591A\u54CD\n\xB7\u6BCF\u4E2A\u73A9\u5BB6\u53EF\u591A\u6B21\u80E1\u724C\uFF0C\u76F4\u81F3\u6478\u5B8C\u6240\u6709\u624B\u724C\uFF0C\u80E1\u724C\u65F6\u76F4\u63A5\u7ED3\u7B97\n\xB7\u7EA2\u4E2D\u8D56\u5B50\u4E0D\u80FD\u505A\u5C06\u724C\u5355\u540A\u80E1\u724C\n\xB7\u80E1\u724C\u4E0D\u6539\u53D8\u884C\u724C\u987A\u5E8F\uFF0C\u5403\u80E1\u540E\u4E3A\u70B9\u70AE\u73A9\u5BB6\u7684\u4E0B\u5BB6\u6478\u724C"
          },
          {
            "ruleId": 502303,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2092,
            "contentId": 2093,
            "title": "\u5B9A\u7F3A",
            "content": "\xB7\u80E1\u724C\u65F6\uFF0C\u624B\u724C\u4E2D\u4E0D\u80FD\u8D85\u8FC72\u95E8\u82B1\u8272\n\xB7\u9009\u62E9\u4E00\u95E8\u82B1\u8272\u505A\u4E3A\u7F3A\u724C\uFF0C\u6478\u5230\u8FD9\u95E8\u82B1\u8272\u7684\u724C\u4E00\u5B9A\u8981\u6253\u51FA\u3002\u5BF9\u5C40\u4E2D\u4E0D\u53EF\u66F4\u6539\u7F3A"
          },
          {
            "ruleId": 502304,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2040,
            "contentId": 2751,
            "title": "\u6362\u4E09\u5F20",
            "content": "\xB7\u53D1\u5B8C\u624B\u724C\u540E\uFF0C\u73A9\u5BB6\u987B\u9009\u62E93\u5F20\u624B\u724C\uFF0C\u968F\u673A\u4E0E\u5176\u4ED61\u4F4D\u73A9\u5BB6\u4EA4\u6362"
          },
          {
            "ruleId": 502305,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2096,
            "contentId": 2752,
            "title": "\u6760\u724C",
            "content": "\xB7\u3010\u522E\u98CE\u3011\u660E\u6760\uFF0C\u6536\u53D6\u653E\u6760\u80052\u500D\u5E95\u5206\n\xB7\u3010\u8865\u6760\u3011\u6536\u53D6\u5176\u4ED6\u73A9\u5BB61\u500D\u5E95\u5206\n\xB7\u3010\u4E0B\u96E8\u3011\u6697\u6760\uFF0C\u6536\u53D6\u5176\u4ED6\u73A9\u5BB62\u500D\u5E95\u5206\n\xB7\u82E5\u53EF\u660E\u6760\u60C5\u51B5\u4E0B\uFF0C\u5148\u78B0\u518D\u8865\u6760\u4E0D\u6536\u53D6\u5E95\u5206\n\xB7\u7EA2\u4E2D\u8D56\u5B50\u6253\u51FA\u7B97\u6760\u724C(\u4E0D\u6536\u53D6\u5E95\u5206)\uFF0C\u7B97\u4F5C\u7EA2\u4E2D\u6760\uFF0C\u53EF\u4EE5\u89E6\u53D1\u6760\u4E0A\u5F00\u82B1\u548C\u6760\u4E0A\u70AE\uFF0C\u4E0D\u89E6\u53D1\u62A2\u6760\u80E1"
          },
          {
            "ruleId": 502306,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2087,
            "contentId": 2098,
            "title": "\u547C\u53EB\u8F6C\u79FB",
            "content": "\xB7\u73A9\u5BB6\u6760\u4E0A\u70AE\uFF0C\u9700\u5C06\u6760\u724C\u6240\u5E94\u5206\u6570\u8F6C\u7ED9\u80E1\u724C\u73A9\u5BB6\n\xB7\u6760\u4E0A\u70AE\u81F4\u4E00\u70AE\u591A\u54CD\uFF0C\u4E0D\u89E6\u53D1\u547C\u53EB\u8F6C\u79FB"
          },
          {
            "ruleId": 502307,
            "gameType": 5023,
            "tab": 1,
            "titleId": 2099,
            "contentId": 2100,
            "title": "\u5BF9\u5C40\u7ED3\u675F",
            "content": "\xB7\u6478\u5B8C\u6240\u6709\u624B\u724C\u65F6\uFF0C\u672A\u542C\u724C\u3001\u82B1\u732A\u73A9\u5BB6\u9700\u8981\u63A5\u53D7\u989D\u5916\u60E9\u7F5A\n\xB7\u3010\u9000\u7A0E\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u672A\u542C\u724C\u73A9\u5BB6\uFF0C\u9000\u56DE\u5168\u90E8\u6760\u724C\u6240\u5F97\n\xB7\u3010\u67E5\u5927\u53EB\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u672A\u542C\u724C\u73A9\u5BB6\u8D54\u7ED9\u542C\u724C\u672A\u80E1\u724C\u73A9\u5BB6\u6700\u5927\u53EF\u80FD\u500D\u6570\uFF08\u4E0D\u5305\u542B\u81EA\u6478\u500D\u6570\uFF09\n\xB7\u3010\u67E5\u82B1\u732A\u3011\u5BF9\u5C40\u7ED3\u675F\u65F6\uFF0C\u624B\u724C\u4E0A\u82E5\u6709\u7F3A\u724C\u7684\u73A9\u5BB6\u4E3A\u82B1\u732A\uFF0C\u82B1\u732A\u73A9\u5BB6\u8D54\u7ED9\u5176\u4ED6\u73A9\u5BB6\u6BCF\u4EBA16\u500D\uFF08\u82E5\u5168\u7A0B\u6253\u7F3A\u724C\uFF0C\u65E0\u9700\u8D54\u4ED8\uFF09"
          }
        ],
        "yaku": [
          {
            "yiType": 502310011,
            "gameType": 5023,
            "calcYiType": 1001,
            "endId": 2103,
            "languageId": 2103,
            "describeId": 2104,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              221,
              231,
              241,
              251,
              251,
              251,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_ph.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 1,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u5E73\u80E1",
            "description": "\u75314\u4E2A\u523B\u5B50\u6216\u987A\u5B50\u52A0\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502300071,
            "gameType": 5023,
            "calcYiType": 7,
            "endId": 2266,
            "languageId": 2153,
            "describeId": 2154,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6839",
            "description": "4\u5F20\u4E00\u6837\u7684\u724C\u4E3A1\u6839\uFF0C\u6BCF\u67091\u6839\uFF0C\u5219\u80E1\u724C\u65F6\u989D\u5916x2\u3002"
          },
          {
            "yiType": 502300081,
            "gameType": 5023,
            "calcYiType": 8,
            "endId": 2267,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502300071
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300091,
            "gameType": 5023,
            "calcYiType": 9,
            "endId": 2268,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 3,
            "exceptYis": [
              502300071,
              502300081
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300101,
            "gameType": 5023,
            "calcYiType": 10,
            "endId": 2269,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 3,
            "exceptYis": [
              502300071,
              502300081,
              502300091
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300041,
            "gameType": 5023,
            "calcYiType": 4,
            "endId": 2155,
            "languageId": 2155,
            "describeId": 2156,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502300041
            ],
            "name": "\u81EA\u6478",
            "description": "\u81EA\u6478\u80E1\u724C\u3002"
          },
          {
            "yiType": 502300061,
            "gameType": 5023,
            "calcYiType": 6,
            "endId": 2149,
            "languageId": 2149,
            "describeId": 2150,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_gskh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6760\u4E0A\u5F00\u82B1",
            "description": "\u6760\u724C\u540E\uFF0C\u8865\u5F20\u81EA\u6478\u80E1\u724C\u3002"
          },
          {
            "yiType": 502300031,
            "gameType": 5023,
            "calcYiType": 3,
            "endId": 2151,
            "languageId": 2151,
            "describeId": 2152,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qgh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              1,
              2
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u62A2\u6760\u80E1",
            "description": "\u80E1\u5176\u4ED6\u4EBA\u8865\u6760\u7684\u90A3\u5F20\u724C\u3002"
          },
          {
            "yiType": 502300231,
            "gameType": 5023,
            "calcYiType": 23,
            "endId": 2741,
            "languageId": 2741,
            "describeId": 2742,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_gsp.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              1,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6760\u4E0A\u70AE",
            "description": "\u6760\u724C\u540E\uFF0C\u6253\u51FA\u7684\u724C\u9020\u6210\u5176\u4ED6\u73A9\u5BB6\u70B9\u70AE\u80E1\u724C\u3002"
          },
          {
            "yiType": 502300241,
            "gameType": 5023,
            "calcYiType": 24,
            "endId": 2743,
            "languageId": 2743,
            "describeId": 2744,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u7EA2\u4E2D\u6760",
            "description": "\u6253\u51FA\u7EA2\u4E2D\uFF0C\u7B97\u4F5C\u6760\u3002"
          },
          {
            "yiType": 502300251,
            "gameType": 5023,
            "calcYiType": 25,
            "endId": 2743,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502300241
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300261,
            "gameType": 5023,
            "calcYiType": 26,
            "endId": 2743,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 6,
            "sizeType": 3,
            "exceptYis": [
              502300241,
              502300251
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300271,
            "gameType": 5023,
            "calcYiType": 27,
            "endId": 2743,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 3,
            "exceptYis": [
              502300241,
              502300251,
              502300261
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300281,
            "gameType": 5023,
            "calcYiType": 28,
            "endId": 2743,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 10,
            "sizeType": 3,
            "exceptYis": [
              502300241,
              502300251,
              502300261,
              502300271
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300291,
            "gameType": 5023,
            "calcYiType": 29,
            "endId": 2743,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 12,
            "sizeType": 3,
            "exceptYis": [
              502300241,
              502300251,
              502300261,
              502300271,
              502300281
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502300051,
            "gameType": 5023,
            "calcYiType": 5,
            "endId": 2147,
            "languageId": 2147,
            "describeId": 2148,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_hdly.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6D77\u5E95\u635E\u6708",
            "description": "\u6478\u5230\u724C\u5899\u4E2D\u7684\u6700\u540E1\u5F20\u724C\u80E1\u724C\u3002"
          },
          {
            "yiType": 502310031,
            "gameType": 5023,
            "calcYiType": 1003,
            "endId": 2105,
            "languageId": 2105,
            "describeId": 2106,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              211,
              211,
              211,
              0,
              231,
              231,
              231,
              0,
              241,
              241,
              241,
              0,
              261,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_pph.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121
            ],
            "name": "\u78B0\u78B0\u80E1",
            "description": "\u75314\u4E2A\u523B\u5B50\uFF08\u6216\u6760\u724C\uFF09\u548C\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502300121,
            "gameType": 5023,
            "calcYiType": 12,
            "endId": 2107,
            "languageId": 2107,
            "describeId": 2108,
            "yiTypeShow": [
              121,
              131,
              141,
              151,
              161,
              171,
              221,
              221,
              221,
              231,
              241,
              251,
              261,
              0,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dyj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u65AD\u5E7A\u4E5D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u624B\u4E2D\u6CA1\u67091\u30019\u5E8F\u6570\u724C\u3002"
          },
          {
            "yiType": 502310101,
            "gameType": 5023,
            "calcYiType": 1010,
            "endId": 2107,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dyj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310111,
              502310121,
              502300121
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502310131,
            "gameType": 5023,
            "calcYiType": 1013,
            "endId": 2717,
            "languageId": 2717,
            "describeId": 2718,
            "yiTypeShow": [
              121,
              131,
              141,
              151,
              161,
              171,
              241,
              251,
              261,
              271,
              281,
              291,
              211,
              0,
              211
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_ll.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121
            ],
            "name": "\u8FDE\u516D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u6709\u4E00\u79CD\u82B1\u82726\u5F20\u76F8\u8FDE\u63A5\u7684\u724C\u3002"
          },
          {
            "yiType": 502310141,
            "gameType": 5023,
            "calcYiType": 1014,
            "endId": 2719,
            "languageId": 2719,
            "describeId": 2720,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              221,
              221,
              221,
              0,
              231,
              241,
              251,
              0,
              277,
              277,
              277,
              0,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_stk.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 2,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121
            ],
            "name": "\u53CC\u540C\u523B",
            "description": "\u80E1\u724C\u65F6\uFF0C\u67092\u4E2A\u70B9\u6570\u76F8\u540C\u7684\u523B\u5B50\u3002"
          },
          {
            "yiType": 502300131,
            "gameType": 5023,
            "calcYiType": 13,
            "endId": 2109,
            "languageId": 2109,
            "describeId": 2110,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              171,
              171,
              171,
              181,
              181,
              181,
              191,
              0,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qys.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u6E05\u4E00\u8272",
            "description": "\u5168\u90E8\u7531\u4E07/\u7B52/\u6761\u4E2D\u7684\u67D0\u4E00\u79CD\u82B1\u8272\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502310111,
            "gameType": 5023,
            "calcYiType": 1011,
            "endId": 2109,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qys.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310121,
              502300131
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502330011,
            "gameType": 5023,
            "calcYiType": 3001,
            "endId": 2111,
            "languageId": 2111,
            "describeId": 2112,
            "yiTypeShow": [
              121,
              121,
              161,
              161,
              221,
              221,
              241,
              241,
              251,
              251,
              271,
              271,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502330011,
              502300071
            ],
            "name": "\u4E03\u5BF9",
            "description": "\u7531\u4E03\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\u3002"
          },
          {
            "yiType": 502310041,
            "gameType": 5023,
            "calcYiType": 1004,
            "endId": 2113,
            "languageId": 2113,
            "describeId": 2114,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              211,
              211,
              211,
              0,
              231,
              231,
              231,
              0,
              241,
              241,
              241,
              0,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031
            ],
            "name": "\u91D1\u94A9\u9493",
            "description": "\u80E1\u724C\u65F6\u5176\u4ED6\u724C\u90FD\u88AB\u78B0\u724C\u3001\u6760\u724C\u3002\u624B\u4E2D\u53EA\u5269\u4E00\u5F20\u724C\u5355\u9493\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3002"
          },
          {
            "yiType": 502300141,
            "gameType": 5023,
            "calcYiType": 14,
            "endId": 2115,
            "languageId": 2115,
            "describeId": 2116,
            "yiTypeShow": [
              111,
              121,
              131,
              191,
              191,
              191,
              211,
              221,
              231,
              271,
              281,
              291,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_yj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [],
            "name": "\u5E7A\u4E5D",
            "description": "\u80E1\u724C\u65F6\uFF0C\u6BCF\u4E00\u4E2A\u523B\u5B50\u3001\u987A\u5B50\u5C06\u90FD\u5305\u542B1\u30019\u5E8F\u6570\u724C\u3002"
          },
          {
            "yiType": 502310121,
            "gameType": 5023,
            "calcYiType": 1012,
            "endId": 2115,
            "languageId": 0,
            "describeId": 0,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_yj.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 0,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502300141
            ],
            "name": "",
            "description": ""
          },
          {
            "yiType": 502310151,
            "gameType": 5023,
            "calcYiType": 1015,
            "endId": 2721,
            "languageId": 2721,
            "describeId": 2722,
            "yiTypeShow": [
              121,
              121,
              121,
              161,
              161,
              161,
              171,
              171,
              171,
              231,
              241,
              251,
              291,
              0,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_sak.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121
            ],
            "name": "\u4E09\u6697\u523B",
            "description": "\u80E1\u724C\u65F6\uFF0C\u624B\u724C\u4E2D\u67093\u4E2A\u6697\u523B\u6216\u6697\u6760\u3002"
          },
          {
            "yiType": 502310161,
            "gameType": 5023,
            "calcYiType": 1016,
            "endId": 2723,
            "languageId": 2723,
            "describeId": 2724,
            "yiTypeShow": [
              111,
              121,
              131,
              141,
              151,
              161,
              171,
              181,
              191,
              221,
              231,
              241,
              251,
              0,
              251
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_ytl.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310131
            ],
            "name": "\u4E00\u6761\u9F99",
            "description": "\u80E1\u724C\u65F6\uFF0C\u6709\u4E00\u79CD\u82B1\u82721-9\u76F8\u8FDE\u63A5\u7684\u5E8F\u6570\u724C\u3002\n\u4E0D\u8BA1\u8FDE\u516D\u3002"
          },
          {
            "yiType": 502310171,
            "gameType": 5023,
            "calcYiType": 1017,
            "endId": 2725,
            "languageId": 2725,
            "describeId": 2726,
            "yiTypeShow": [
              151,
              151,
              151,
              0,
              161,
              161,
              161,
              0,
              171,
              171,
              171,
              0,
              211,
              221,
              231,
              0,
              261,
              261
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_slk.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 4,
            "sizeType": 3,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121
            ],
            "name": "\u4E09\u8FDE\u523B",
            "description": "\u80E1\u724C\u65F6\uFF0C\u6709\u4E00\u79CD\u82B1\u82723\u526F\u4F9D\u6B21\u9012\u589E\u4E00\u4F4D\u6570\u5B57\u7684\u523B\u5B50\u3002"
          },
          {
            "yiType": 502310051,
            "gameType": 5023,
            "calcYiType": 1005,
            "endId": 2117,
            "languageId": 2117,
            "describeId": 2118,
            "yiTypeShow": [
              131,
              131,
              131,
              0,
              151,
              151,
              151,
              0,
              161,
              161,
              161,
              0,
              181,
              181,
              181,
              0,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_qp.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031,
              502300131
            ],
            "name": "\u6E05\u78B0",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u78B0\u78B0\u80E1\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u6E05\u4E00\u8272\u3002"
          },
          {
            "yiType": 502330031,
            "gameType": 5023,
            "calcYiType": 3003,
            "endId": 2119,
            "languageId": 2119,
            "describeId": 2120,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              171,
              171,
              191,
              191,
              231,
              231,
              251,
              251,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_lqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502330011,
              502300071,
              502330051
            ],
            "name": "\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67091\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u4E0D\u8BA11\u6839\u3002"
          },
          {
            "yiType": 502310061,
            "gameType": 5023,
            "calcYiType": 1006,
            "endId": 2121,
            "languageId": 2121,
            "describeId": 2122,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              151,
              151,
              151,
              0,
              181,
              181,
              181,
              0,
              221,
              221,
              221,
              0,
              251,
              251
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031,
              502300121
            ],
            "name": "\u5C06\u5BF9",
            "description": "\u624B\u724C\u5168\u90E8\u662F2\u30015\u30018\u7684\u78B0\u78B0\u80E1\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502310181,
            "gameType": 5023,
            "calcYiType": 1018,
            "endId": 2727,
            "languageId": 2727,
            "describeId": 2728,
            "yiTypeShow": [
              121,
              121,
              121,
              0,
              141,
              141,
              141,
              0,
              161,
              161,
              161,
              0,
              181,
              181,
              181,
              0,
              221,
              221
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qsk.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031,
              502300121
            ],
            "name": "\u5168\u53CC\u523B",
            "description": "\u75312\u30014\u30016\u30018\u5E8F\u6570\u724C\u7684\u523B\u5B50\u3001\u5C06\u724C\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502310191,
            "gameType": 5023,
            "calcYiType": 1019,
            "endId": 2729,
            "languageId": 2729,
            "describeId": 2730,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              0,
              131,
              131,
              131,
              131,
              0,
              251,
              251,
              251,
              251,
              0,
              261,
              271,
              281,
              0,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_sejc.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 8,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502300071,
              502300081,
              502300091,
              502300101
            ],
            "name": "\u5341\u4E8C\u91D1\u9497",
            "description": "\u80E1\u724C\u65F6\uFF0C\u67093\u4E2A\u6760\u724C\u3002\n\u4E0D\u8BA1\u6839\u3002"
          },
          {
            "yiType": 502330041,
            "gameType": 5023,
            "calcYiType": 3004,
            "endId": 2123,
            "languageId": 2123,
            "describeId": 2124,
            "yiTypeShow": [
              111,
              111,
              131,
              131,
              141,
              141,
              151,
              151,
              161,
              161,
              171,
              171,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502330011,
              502300131
            ],
            "name": "\u6E05\u4E03\u5BF9",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u4E03\u5BF9\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u4E03\u5BF9\u3002"
          },
          {
            "yiType": 502310071,
            "gameType": 5023,
            "calcYiType": 1007,
            "endId": 2125,
            "languageId": 2125,
            "describeId": 2126,
            "yiTypeShow": [
              111,
              111,
              111,
              0,
              131,
              131,
              131,
              0,
              141,
              141,
              141,
              0,
              151,
              151,
              151,
              0,
              161,
              0,
              161
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qjgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310051,
              502310101,
              502310111,
              502310121,
              502310041,
              502310031,
              502300131
            ],
            "name": "\u6E05\u91D1\u94A9\u9493",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u91D1\u94A9\u9493\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u6E05\u78B0\u3002"
          },
          {
            "yiType": 502310201,
            "gameType": 5023,
            "calcYiType": 1020,
            "endId": 2731,
            "languageId": 2731,
            "describeId": 2732,
            "yiTypeShow": [
              161,
              161,
              161,
              0,
              171,
              171,
              171,
              0,
              181,
              181,
              181,
              0,
              191,
              191,
              191,
              0,
              211,
              211
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_silk.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031,
              502310171
            ],
            "name": "\u56DB\u8FDE\u523B",
            "description": "\u4E00\u79CD\u82B1\u82724\u526F\u4F9D\u6B21\u9012\u589E\u4E00\u4F4D\u6570\u7684\u523B\u5B50\u3002\n\u4E0D\u8BA1\u4E09\u8FDE\u523B\u3001\u78B0\u78B0\u80E1\u3002"
          },
          {
            "yiType": 502310211,
            "gameType": 5023,
            "calcYiType": 1021,
            "endId": 2733,
            "languageId": 2733,
            "describeId": 2734,
            "yiTypeShow": [
              111,
              111,
              111,
              121,
              121,
              121,
              171,
              171,
              171,
              181,
              181,
              181,
              211,
              0,
              211
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_siak.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031,
              502310151
            ],
            "name": "\u56DB\u6697\u523B",
            "description": "\u80E1\u724C\u65F6\uFF0C\u624B\u724C\u4E2D\u67094\u4E2A\u6697\u523B\u6216\u6697\u6760\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u4E09\u6697\u523B\u3002"
          },
          {
            "yiType": 502330051,
            "gameType": 5023,
            "calcYiType": 3005,
            "endId": 2127,
            "languageId": 2127,
            "describeId": 2128,
            "yiTypeShow": [
              121,
              121,
              151,
              151,
              181,
              181,
              221,
              221,
              251,
              251,
              281,
              281,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502330011,
              502300121,
              502330031
            ],
            "name": "\u5C06\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502310221,
            "gameType": 5023,
            "calcYiType": 1022,
            "endId": 2735,
            "languageId": 2735,
            "describeId": 2736,
            "yiTypeShow": [
              111,
              111,
              111,
              0,
              141,
              141,
              141,
              0,
              171,
              171,
              171,
              0,
              221,
              221,
              221,
              0,
              450,
              0,
              450
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_hzjgd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310031,
              502310041
            ],
            "name": "\u7EA2\u4E2D\u91D1\u94A9\u9493",
            "description": "\u80E1\u724C\u65F6\u5176\u4ED6\u724C\u90FD\u88AB\u78B0\u724C\u3001\u6760\u724C\uFF0C\u624B\u724C\u4E2D\u53EA\u5269\u4E0B\u4E00\u5F20\u7EA2\u4E2D\u5355\u9493\u80E1\u724C\u3002\n\u4E0D\u8BA1\u78B0\u78B0\u80E1\u3001\u91D1\u94A9\u9493\u3002"
          },
          {
            "yiType": 502330061,
            "gameType": 5023,
            "calcYiType": 3006,
            "endId": 2129,
            "languageId": 2129,
            "describeId": 2130,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              211,
              211,
              211,
              211,
              231,
              231,
              261,
              261,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_slqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 16,
            "sizeType": 2,
            "exceptYis": [
              502330011,
              502330031,
              502300071,
              502300081
            ],
            "name": "\u53CC\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67092\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u9F99\u4E03\u5BF9\u3001\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502300021,
            "gameType": 5023,
            "calcYiType": 2,
            "endId": 2131,
            "languageId": 2131,
            "describeId": 2132,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_dh.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502300041,
              502300042,
              502100111
            ],
            "name": "\u5730\u80E1",
            "description": "\u975E\u5E84\u5BB6\u7B2C\u4E00\u8F6E\u6478\u724C\u5C31\u80E1\u724C\uFF0C\u4E3A\u5730\u80E1\u3002"
          },
          {
            "yiType": 502300011,
            "gameType": 5023,
            "calcYiType": 1,
            "endId": 2133,
            "languageId": 2133,
            "describeId": 2134,
            "yiTypeShow": [],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_th.png",
            "isOpen": 1,
            "priority": 1,
            "ruleOpen": 1,
            "cantHuTypes": [
              2,
              3
            ],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502300041,
              502300042,
              502100111
            ],
            "name": "\u5929\u80E1",
            "description": "\u5E84\u5BB6\u53D1\u5B8C\u724C\u540E\u7ACB\u5373\u80E1\u724C\uFF0C\u4E3A\u5929\u80E1\u3002"
          },
          {
            "yiType": 502330071,
            "gameType": 5023,
            "calcYiType": 3007,
            "endId": 2135,
            "languageId": 2135,
            "describeId": 2136,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              131,
              131,
              151,
              151,
              171,
              171,
              181,
              181,
              191,
              191
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502330041,
              502330011,
              502330031,
              502300071,
              502300131
            ],
            "name": "\u6E05\u9F99\u4E03\u5BF9",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u9F99\u4E03\u5BF9\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3001\u9F99\u4E03\u5BF9\u3001\u4E03\u5BF9\u3001\u6E05\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502330081,
            "gameType": 5023,
            "calcYiType": 3008,
            "endId": 2137,
            "languageId": 2137,
            "describeId": 2138,
            "yiTypeShow": [
              161,
              161,
              161,
              161,
              211,
              211,
              211,
              211,
              261,
              261,
              261,
              261,
              291,
              291
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_sanlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502330011,
              502330031,
              502330061,
              502300071,
              502300081,
              502300091
            ],
            "name": "\u4E09\u9F99\u4E03\u5BF9",
            "description": "\u75317\u4E2A\u5BF9\u5B50\u7EC4\u6210\u7684\u80E1\u724C\uFF0C\u4E14\u624B\u4E0A\u67093\u7EC44\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u4E0D\u80FD\u6760\u6216\u78B0\u51FA\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u6839\u3002"
          },
          {
            "yiType": 502310231,
            "gameType": 5023,
            "calcYiType": 1023,
            "endId": 2737,
            "languageId": 2737,
            "describeId": 2738,
            "yiTypeShow": [
              111,
              121,
              131,
              111,
              121,
              131,
              171,
              181,
              191,
              171,
              181,
              191,
              151,
              151
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_ysslh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 32,
            "sizeType": 1,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502300131
            ],
            "name": "\u4E00\u8272\u53CC\u9F99\u4F1A",
            "description": "\u4E00\u79CD\u82B1\u8272\u7684\u4E24\u4E2A\u8001\u5C11\u526F\uFF0C5\u4E3A\u5C06\u724C\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u6E05\u4E00\u8272\u3002"
          },
          {
            "yiType": 502330091,
            "gameType": 5023,
            "calcYiType": 3009,
            "endId": 2139,
            "languageId": 2139,
            "describeId": 2140,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              151,
              151,
              151,
              151,
              221,
              221,
              251,
              251,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jslqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502330011,
              502330031,
              502330051,
              502330061,
              502300121,
              502300071,
              502300081
            ],
            "name": "\u5C06\u53CC\u9F99\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u53CC\u9F99\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u65AD\u5E7A\u4E5D\u3001\u6839\u3002"
          },
          {
            "yiType": 502310241,
            "gameType": 5023,
            "calcYiType": 1024,
            "endId": 2739,
            "languageId": 2739,
            "describeId": 2740,
            "yiTypeShow": [
              111,
              111,
              111,
              121,
              131,
              141,
              151,
              161,
              171,
              181,
              191,
              191,
              191,
              0,
              171
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jlbd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502300131
            ],
            "name": "\u4E5D\u83B2\u5B9D\u706F",
            "description": "\u95E8\u6E05\u4E0B\u7531\u4E00\u79CD\u82B1\u8272\u5E8F\u6570\u724C\u5B50\u7EC4\u6210\u7684\u7279\u5B9A\u724C\u578B\uFF0C\u89C1\u540C\u82B1\u8272\u4EFB\u4F551\u5F20\u5E8F\u6570\u724C\u5373\u6210\u80E1\u724C\u3002\n\u4E0D\u8BA1\u6E05\u4E00\u8272\u3002"
          },
          {
            "yiType": 502310081,
            "gameType": 5023,
            "calcYiType": 1008,
            "endId": 2141,
            "languageId": 2141,
            "describeId": 2747,
            "yiTypeShow": [
              111,
              111,
              111,
              111,
              0,
              161,
              161,
              161,
              161,
              0,
              221,
              221,
              221,
              221,
              0,
              271,
              271,
              271,
              271,
              0,
              281,
              0,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/co/ui/common/image/win/ui_settlement_img_sblh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 64,
            "sizeType": 1,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310041,
              502310031,
              502300071,
              502300081,
              502300091,
              502300101,
              502310191
            ],
            "name": "\u5341\u516B\u7F57\u6C49",
            "description": "\u91D1\u94A9\u9493\uFF0C\u4E14\u80E1\u724C\u65F6\u67094\u4E2A\u6760\u724C\u3002\n\u4E0D\u8BA14\u6839\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u5341\u4E8C\u91D1\u9497\u3002"
          },
          {
            "yiType": 502330101,
            "gameType": 5023,
            "calcYiType": 3010,
            "endId": 2143,
            "languageId": 2143,
            "describeId": 2144,
            "yiTypeShow": [
              121,
              121,
              121,
              121,
              151,
              151,
              151,
              151,
              221,
              221,
              221,
              221,
              281,
              281
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_jshlqd.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 126,
            "sizeType": 1,
            "exceptYis": [
              502330011,
              502330031,
              502330051,
              502330061,
              502330081,
              502330091,
              502300121,
              502300071,
              502300081,
              502300091
            ],
            "name": "\u5C06\u4E09\u9F99\u4E03\u5BF9",
            "description": "\u5168\u90E8\u662F\u5E8F\u6570\u724C2\u30015\u30018\u7EC4\u6210\u7684\u4E09\u9F99\u4E03\u5BF9\u3002\n\u4E0D\u8BA1\u4E03\u5BF9\u3001\u5C06\u4E03\u5BF9\u3001\u9F99\u4E03\u5BF9\u3001\u53CC\u9F99\u4E03\u5BF9\u3001\u5C06\u53CC\u9F99\u4E03\u5BF9\u3001\u4E09\u9F99\u4E03\u5BF9\u3001\u6839\u3001\u65AD\u5E7A\u4E5D\u3002"
          },
          {
            "yiType": 502310091,
            "gameType": 5023,
            "calcYiType": 1009,
            "endId": 2145,
            "languageId": 2145,
            "describeId": 2748,
            "yiTypeShow": [
              111,
              111,
              111,
              111,
              0,
              121,
              121,
              121,
              121,
              0,
              161,
              161,
              161,
              161,
              0,
              171,
              171,
              171,
              171,
              0,
              181,
              0,
              181
            ],
            "picturePath": "Assets/ArtAB/mjab/sic/ui/sicingame/image/win/ui_settlement_img_qsblh.png",
            "isOpen": 1,
            "priority": 0,
            "ruleOpen": 1,
            "cantHuTypes": [],
            "beiType": 2,
            "bei": 256,
            "sizeType": 1,
            "exceptYis": [
              502310011,
              502310101,
              502310111,
              502310121,
              502310041,
              502310031,
              502300071,
              502300081,
              502300091,
              502300101,
              502300131,
              502310051,
              502310071,
              502310081,
              502310191
            ],
            "name": "\u6E05\u5341\u516B\u7F57\u6C49",
            "description": "\u7531\u6E05\u4E00\u8272\u548C\u5341\u516B\u7F57\u6C49\u7EC4\u6210\u7684\u80E1\u724C\u3002\n\u4E0D\u8BA1\u5341\u516B\u7F57\u6C49\u3001\u91D1\u94A9\u9493\u3001\u78B0\u78B0\u80E1\u3001\u6E05\u4E00\u8272\u3001\u6E05\u78B0\u30014\u6839\u3001\u5341\u4E8C\u91D1\u9497\u3002"
          }
        ],
        "rooms": [
          {
            "id": 502301,
            "gameType": 5023,
            "nameId": 1782,
            "name": "\u514D\u8D39\u573A",
            "ruleTags": [
              2
            ],
            "moneyNeedMin": 0,
            "moneyNeedMax": 0,
            "moneyCost": 0,
            "moneyBase": 1,
            "topBei": 0,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 40
          },
          {
            "id": 502302,
            "gameType": 5023,
            "nameId": 1800,
            "name": "\u542F\u822A",
            "ruleTags": [
              2
            ],
            "moneyNeedMin": 850,
            "moneyNeedMax": 42e3,
            "moneyCost": 100,
            "moneyBase": 20,
            "topBei": 128,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 21
          },
          {
            "id": 502303,
            "gameType": 5023,
            "nameId": 1801,
            "name": "\u9010\u68A6",
            "ruleTags": [
              2
            ],
            "moneyNeedMin": 850,
            "moneyNeedMax": 125e3,
            "moneyCost": 200,
            "moneyBase": 100,
            "topBei": 128,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 22
          },
          {
            "id": 502304,
            "gameType": 5023,
            "nameId": 1802,
            "name": "\u4E58\u98CE",
            "ruleTags": [
              2
            ],
            "moneyNeedMin": 12500,
            "moneyNeedMax": 835e3,
            "moneyCost": 1500,
            "moneyBase": 600,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 23
          },
          {
            "id": 502305,
            "gameType": 5023,
            "nameId": 2037,
            "name": "\u51CC\u9704",
            "ruleTags": [
              2
            ],
            "moneyNeedMin": 125e3,
            "moneyNeedMax": 625e4,
            "moneyCost": 7500,
            "moneyBase": 3e3,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 24
          },
          {
            "id": 502306,
            "gameType": 5023,
            "nameId": 1803,
            "name": "\u5FA1\u9F99",
            "ruleTags": [
              2
            ],
            "moneyNeedMin": 42e4,
            "moneyNeedMax": 0,
            "moneyCost": 42e3,
            "moneyBase": 15e3,
            "topBei": 256,
            "superDoubleLimit": 0,
            "noRobot": 0,
            "lockId": 25
          }
        ]
      }
    }
  };

  // mockjs/sichuan_score.mjs
  var catalogs = new Map([5021, 5022].map((gameType) => [
    gameType,
    new Map(SICHUAN_CATALOG.games[gameType].yaku.map((item) => [item.calcYiType, item]))
  ]));
  function checkRules(gameType, topBei) {
    if (!catalogs.has(gameType)) throw new RangeError("\u6B64\u8BA1\u5206\u5668\u4EC5\u652F\u6301\u666E\u901A\u8840\u6218/\u8840\u6D41\uFF0C\u4E0D\u652F\u6301\u7EA2\u4E2D\u8D56\u5B50");
    if (![128, 256].includes(topBei)) throw new RangeError("\u5FC5\u987B\u7531\u623F\u95F4\u89C4\u5219\u660E\u786E\u6307\u5B9A\u5408\u6CD5\u5C01\u9876\u500D\u6570");
  }
  function yaku(gameType, calcYiType) {
    const rule = catalogs.get(gameType).get(calcYiType);
    if (!rule || rule.beiType !== 2) throw new Error(`\u672A\u6838\u9A8C\u7684\u56DB\u5DDD\u756A\u578B ${calcYiType}`);
    return { yiType: rule.yiType, name: rule.name, bei: rule.bei };
  }
  var terminal = (kind) => kind % 9 === 0 || kind % 9 === 8;
  function shapeYaku(shape, melds, kinds, rootCount) {
    const pure = new Set(kinds.map((kind) => Math.floor(kind / 9))).size === 1;
    const simple = kinds.every((kind) => !terminal(kind));
    const jiang = kinds.every((kind) => [1, 4, 7].includes(kind % 9));
    const ids = [];
    let includedPure = false;
    let consumedRoots = 0;
    if (shape.type === "sevenPairs") {
      const dragons = shape.quadKinds.length;
      consumedRoots = dragons;
      if (jiang) {
        ids.push(dragons === 3 ? 3010 : dragons === 2 ? 3009 : 3005);
      } else if (pure && dragons <= 1) {
        ids.push(dragons ? 3007 : 3004);
        includedPure = true;
      } else {
        ids.push([3001, 3003, 3006, 3008][dragons]);
      }
    } else {
      const triplets = shape.groups.every((group) => group.type !== "sequence");
      const singleWait = melds.length === 4;
      const fourKongs = singleWait && shape.groups.every((group) => group.type === "quad");
      if (fourKongs) {
        ids.push(pure ? 1009 : 1008);
        includedPure = pure;
        consumedRoots = 4;
        if (jiang) ids.push(1006);
      } else if (singleWait) {
        ids.push(pure ? 1007 : 1004);
        includedPure = pure;
        if (jiang) ids.push(1006);
      } else if (triplets) {
        ids.push(pure ? 1005 : jiang ? 1006 : 1003);
        includedPure = pure;
      }
      if (terminal(shape.pair) && shape.groups.every((group) => group.type === "sequence" ? group.kind % 9 === 0 || group.kind % 9 === 6 : terminal(group.kind))) ids.push(14);
    }
    if (pure && !includedPure) ids.push(13);
    if (simple && !jiang) ids.push(12);
    if (!ids.length) ids.push(1001);
    const countedRoots = rootCount - consumedRoots;
    if (countedRoots > 0) ids.push(6 + countedRoots);
    return { ids, countedRoots };
  }
  function scoreSichuanHand(hand, {
    melds = [],
    missingSuit,
    gameType = 5022,
    topBei,
    winType = "ron",
    afterKong = false,
    lastTile = false,
    opening = null
  } = {}) {
    checkRules(gameType, topBei);
    if (!["ron", "tsumo", "robKong"].includes(winType) || ![null, "heaven", "earth"].includes(opening) || typeof afterKong !== "boolean" || typeof lastTile !== "boolean") throw new RangeError("\u65E0\u6548\u7684\u56DB\u5DDD\u548C\u724C\u60C5\u5883");
    if ((afterKong || lastTile || opening) && winType !== "tsumo") throw new RangeError("\u81EA\u6478\u60C5\u5883\u4E0D\u80FD\u7528\u4E8E\u8363\u548C\u6216\u62A2\u6760");
    if (opening && (afterKong || lastTile || melds.length)) throw new RangeError("\u5929\u80E1/\u5730\u80E1\u4E0D\u80FD\u4E0E\u6760\u3001\u6D77\u5E95\u6216\u5DF2\u6709\u526F\u9732\u6DF7\u7528");
    const shapes = analyzeSichuanHand(hand, { melds, missingSuit });
    if (afterKong && !melds.some((meld) => ["kan", "ankan"].includes(meld.type))) throw new RangeError("\u6760\u4E0A\u5F00\u82B1\u5FC5\u987B\u6709\u5B9E\u9645\u6760\u724C");
    if (!shapes.length) return null;
    const kinds = [...hand, ...melds.flatMap((meld) => meld.tiles)].map(sichuanKind);
    const counts = Array(27).fill(0);
    for (const kind of kinds) counts[kind] += 1;
    const rootCount = counts.filter((count) => count === 4).length;
    let best = null;
    for (const shape of shapes) {
      const { ids, countedRoots } = shapeYaku(shape, melds, kinds, rootCount);
      if (opening) ids.push(opening === "heaven" ? 1 : 2);
      else if (winType === "tsumo") ids.push(4);
      if (afterKong) ids.push(6);
      if (lastTile) ids.push(5);
      if (winType === "robKong") ids.push(3);
      const items = ids.map((id) => yaku(gameType, id));
      if (countedRoots) {
        const item = items.find((entry) => entry.yiType === yaku(gameType, 6 + countedRoots).yiType);
        item.name = countedRoots === 1 ? "\u6839" : `${countedRoots}\u6839`;
      }
      const rawBei = items.reduce((total, item) => total * item.bei, 1);
      if (!Number.isSafeInteger(rawBei)) throw new RangeError("\u56DB\u5DDD\u500D\u6570\u6EA2\u51FA");
      const result = {
        gameType,
        winType,
        rawBei,
        bei: Math.min(rawBei, topBei),
        capped: rawBei > topBei,
        rootCount,
        countedRoots,
        yaku: items,
        shape
      };
      if (!best || rawBei > best.rawBei) best = result;
    }
    return best;
  }
  function maxSichuanReadyScore(hand, { melds = [], missingSuit, gameType = 5022, topBei } = {}) {
    checkRules(gameType, topBei);
    const waits = sichuanWaitKinds(hand, { melds, missingSuit });
    const used = /* @__PURE__ */ new Set([...hand, ...melds.flatMap((meld) => meld.tiles)]);
    let best = null;
    for (const kind of waits) {
      let copy = 1;
      const suit = Math.floor(kind / 9) + 1;
      const rank = kind % 9 + 1;
      while (used.has(tileId(suit, rank, copy))) copy += 1;
      const score2 = scoreSichuanHand([...hand, tileId(suit, rank, copy)], { melds, missingSuit, gameType, topBei });
      if (score2 && (!best || score2.rawBei > best.rawBei)) best = { ...score2, waitKind: kind };
    }
    return best;
  }
  function seatsAndBase(activeSeats2, seat, baseScore) {
    if (!Array.isArray(activeSeats2) || activeSeats2.length < 2 || activeSeats2.length > 4 || new Set(activeSeats2).size !== activeSeats2.length || !activeSeats2.includes(seat) || ![...activeSeats2].every((value) => Number.isInteger(value) && value >= 0 && value < 4)) throw new RangeError("\u65E0\u6548\u7684\u5728\u5C40\u5EA7\u4F4D");
    if (!Number.isSafeInteger(baseScore) || baseScore <= 0) throw new RangeError("\u5E95\u5206\u5FC5\u987B\u4E3A\u5B89\u5168\u6B63\u6574\u6570");
  }
  function payments(payers, receiver, units, baseScore) {
    const amount = units * baseScore;
    if (!Number.isSafeInteger(amount) || !Number.isSafeInteger(amount * payers.length)) throw new RangeError("\u652F\u4ED8\u91D1\u989D\u6EA2\u51FA");
    const delta = [0, 0, 0, 0];
    const transfers = payers.map((from) => ({ from, to: receiver, amount }));
    for (const transfer of transfers) {
      delta[transfer.from] -= transfer.amount;
      delta[transfer.to] += transfer.amount;
    }
    return { delta, transfers };
  }
  function sichuanWinPayments({ winner, loser = null, activeSeats: activeSeats2, bei, baseScore }) {
    seatsAndBase(activeSeats2, winner, baseScore);
    if (!Number.isSafeInteger(bei) || bei <= 0) throw new RangeError("\u548C\u724C\u500D\u6570\u5FC5\u987B\u4E3A\u5B89\u5168\u6B63\u6574\u6570");
    if (loser !== null && (!activeSeats2.includes(loser) || loser === winner)) throw new RangeError("\u65E0\u6548\u7684\u653E\u94F3\u5EA7\u4F4D");
    return payments(loser === null ? activeSeats2.filter((seat) => seat !== winner) : [loser], winner, bei, baseScore);
  }
  function sichuanKongPayments({ seat, kind, from = null, activeSeats: activeSeats2, baseScore, waived = false }) {
    seatsAndBase(activeSeats2, seat, baseScore);
    if (!["exposed", "added", "concealed"].includes(kind) || typeof waived !== "boolean") throw new RangeError("\u65E0\u6548\u7684\u6760\u7C7B\u578B");
    if (waived && kind !== "added") throw new RangeError("\u5148\u78B0\u540E\u8865\u514D\u6760\u8D39\u53EA\u80FD\u7528\u4E8E\u8865\u6760");
    if (kind === "exposed" ? !activeSeats2.includes(from) || from === seat : from !== null) throw new RangeError("\u65E0\u6548\u7684\u653E\u6760\u5EA7\u4F4D");
    if (waived) return { delta: [0, 0, 0, 0], transfers: [] };
    return payments(
      kind === "exposed" ? [from] : activeSeats2.filter((value) => value !== seat),
      seat,
      kind === "added" ? 1 : 2,
      baseScore
    );
  }

  // mockjs/sichuan_settlement.mjs
  function settleSichuanDraw(players, kongs, { gameType = 5022, topBei, baseScore }) {
    if (!Array.isArray(players) || players.length !== 4 || !Array.isArray(kongs) || ![128, 256].includes(topBei) || !Number.isSafeInteger(baseScore) || baseScore <= 0) {
      throw new RangeError("\u65E0\u6548\u7684\u56DB\u5DDD\u8352\u724C\u6E05\u7B97\u53C2\u6570");
    }
    const used = /* @__PURE__ */ new Set();
    const status = Array.from(players, (player) => {
      if (!player || typeof player.won !== "boolean" || typeof player.allDiscardsMissing !== "boolean" || !Number.isSafeInteger(player.discardCount) || player.discardCount < 0) throw new RangeError("\u65E0\u6548\u7684\u73A9\u5BB6\u6E05\u7B97\u8BB0\u5F55");
      analyzeSichuanHand(player.hand, player);
      for (const tile of [...player.hand, ...player.melds.flatMap((meld) => meld.tiles)]) {
        if (used.has(tile)) throw new RangeError("\u73A9\u5BB6\u4E4B\u95F4\u91CD\u590D\u5B9E\u4F53\u724C");
        used.add(tile);
      }
      if (player.won) return { type: "won", bei: 0 };
      if (player.hand.length !== 13 - 3 * player.melds.length) throw new RangeError("\u8352\u724C\u65F6\u624B\u724C\u5F20\u6570\u4E0D\u7B26");
      const flower = player.hand.some((tile) => Math.floor(sichuanKind(tile) / 9) + 1 === player.missingSuit);
      if (flower) return { type: "flower", bei: 0, exempt: player.discardCount > 0 && player.allDiscardsMissing };
      const score2 = maxSichuanReadyScore(player.hand, { melds: player.melds, missingSuit: player.missingSuit, gameType, topBei });
      return { type: score2 ? "ready" : "notReady", bei: score2?.bei ?? 0 };
    });
    const delta = [0, 0, 0, 0];
    const transfers = [];
    const add2 = (from, to, amount, reason, kongIndex = null) => {
      if (![from, to].every((seat) => Number.isInteger(seat) && seat >= 0 && seat < 4) || from === to || !Number.isSafeInteger(amount) || amount <= 0) throw new RangeError("\u65E0\u6548\u7684\u6E05\u7B97\u8F6C\u8D26");
      if (!Number.isSafeInteger(delta[from] - amount) || !Number.isSafeInteger(delta[to] + amount)) throw new RangeError("\u6E05\u7B97\u6EA2\u51FA");
      delta[from] -= amount;
      delta[to] += amount;
      transfers.push({ from, to, amount, reason, kongIndex });
    };
    for (const [index, kong] of kongs.entries()) {
      if (!kong || !Number.isInteger(kong.seat) || !status[kong.seat] || typeof kong.transferred !== "boolean" || !Array.isArray(kong.transfers)) throw new RangeError("\u65E0\u6548\u7684\u6760\u8D39\u8BB0\u5F55");
      const payers = /* @__PURE__ */ new Set();
      for (const transfer of kong.transfers) {
        if (!transfer || transfer.to !== kong.seat || !Number.isInteger(transfer.from) || !status[transfer.from] || transfer.from === kong.seat || payers.has(transfer.from) || !Number.isSafeInteger(transfer.amount) || transfer.amount <= 0) throw new RangeError("\u65E0\u6548\u7684\u539F\u59CB\u6760\u8D39");
        payers.add(transfer.from);
        if (!kong.transferred && ["notReady", "flower"].includes(status[kong.seat].type)) {
          add2(kong.seat, transfer.from, transfer.amount, "refund", index);
        }
      }
    }
    for (let from = 0; from < 4; from += 1) {
      for (let to = 0; to < 4; to += 1) {
        if (from === to) continue;
        if (status[from].type === "flower" && !status[from].exempt && status[to].type !== "flower") {
          add2(from, to, 16 * baseScore, "flower");
        } else if (status[from].type === "notReady" && status[to].type === "ready") {
          add2(from, to, status[to].bei * baseScore, "ready");
        }
      }
    }
    return { status, delta, transfers };
  }

  // mockjs/sichuan_ai.mjs
  function countsOf2(hand, missingSuit = 0) {
    const counts = Array(34).fill(0);
    for (const id of hand) {
      const kind = sichuanKind(id);
      if (Math.floor(kind / 9) + 1 !== missingSuit) counts[kind] += 1;
    }
    return counts;
  }
  function estimate(counts, meldCount) {
    const usable = counts.reduce((sum, count) => sum + count, 0);
    let result = Math.max(stdShanten(counts, meldCount), 13 - 3 * meldCount - usable);
    if (!meldCount) {
      const pairs = counts.reduce((sum, count) => sum + Math.floor(count / 2), 0);
      const singles = counts.filter((count) => count % 2 === 1).length;
      result = Math.min(result, 13 - 2 * pairs - Math.min(7 - pairs, singles));
    }
    return result;
  }
  function checkHolding(hand, melds, missingSuit) {
    analyzeSichuanHand(hand, { melds, missingSuit });
    if (![13 - 3 * melds.length, 14 - 3 * melds.length].includes(hand.length)) throw new RangeError("AI\u624B\u724C\u5F20\u6570\u4E0E\u9762\u5B50\u6570\u4E0D\u7B26");
    if (melds.some((meld) => meld.tiles.some((id) => Math.floor(sichuanKind(id) / 9) + 1 === missingSuit))) {
      throw new RangeError("AI\u526F\u9732\u4E0D\u80FD\u542B\u5B9A\u7F3A\u82B1\u8272");
    }
  }
  function sichuanShanten(hand, { melds = [], missingSuit } = {}) {
    checkHolding(hand, melds, missingSuit);
    const shanten = estimate(countsOf2(hand, missingSuit), melds.length);
    if (shanten === 0) {
      const candidates = hand.length === 13 - 3 * melds.length ? [hand] : [...new Map(legalSichuanDiscards(hand, missingSuit).map((id) => [sichuanKind(id), id])).values()].map((id) => hand.filter((tile) => tile !== id));
      if (!candidates.some((tiles) => sichuanWaitKinds(tiles, { melds, missingSuit }).length)) return 1;
    }
    return shanten;
  }
  function checkInitialHand(hand) {
    legalSichuanDiscards(hand, 1);
    if (![13, 14].includes(hand.length)) throw new RangeError("\u6362\u724C/\u5B9A\u7F3A\u9700\u8981\u5B8C\u6574\u8D77\u624B\u724C");
  }
  function chooseSichuanMissingSuit(hand) {
    checkInitialHand(hand);
    const suits = [1, 2, 3].map((suit) => ({
      suit,
      count: hand.filter((id) => Math.floor(sichuanKind(id) / 9) + 1 === suit).length,
      shanten: estimate(countsOf2(hand, suit), 0)
    }));
    suits.sort((a, b) => a.count - b.count || a.shanten - b.shanten || a.suit - b.suit);
    return suits[0].suit;
  }
  function chooseSichuanExchange(hand) {
    checkInitialHand(hand);
    const suits = [1, 2, 3].map((suit) => hand.filter((id) => Math.floor(sichuanKind(id) / 9) + 1 === suit).sort((a, b) => a - b)).filter((tiles) => tiles.length >= 3);
    const smallest = Math.min(...suits.map((tiles) => tiles.length));
    let best = null;
    for (const tiles of suits.filter((tiles2) => tiles2.length === smallest)) {
      for (let a = 0; a < tiles.length - 2; a += 1) {
        for (let b = a + 1; b < tiles.length - 1; b += 1) {
          for (let c = b + 1; c < tiles.length; c += 1) {
            const selected = [tiles[a], tiles[b], tiles[c]];
            const retained = hand.filter((id) => !selected.includes(id));
            const shanten = estimate(countsOf2(retained), 0);
            if (!best || shanten < best.shanten) best = { tiles: selected, shanten };
          }
        }
      }
    }
    return best.tiles;
  }
  function knownTiles(hand, melds, visibleTiles) {
    if (!Array.isArray(visibleTiles) || visibleTiles.length > 108) throw new RangeError("\u65E0\u6548\u7684\u516C\u5F00\u5B9E\u4F53\u724C\u5217\u8868");
    const seen = /* @__PURE__ */ new Set();
    const counts = Array(27).fill(0);
    for (const id of [...hand, ...melds.flatMap((meld) => meld.tiles), ...visibleTiles]) {
      const kind = sichuanKind(id);
      if (seen.has(id)) throw new RangeError("AI\u53EF\u89C1\u4FE1\u606F\u4E2D\u51FA\u73B0\u91CD\u590D\u5B9E\u4F53\u724C");
      seen.add(id);
      counts[kind] += 1;
    }
    return { seen, counts };
  }
  function improvements(hand, melds, missingSuit, shanten, known) {
    const waits = [];
    let ukeire = 0;
    for (let kind = 0; kind < 27; kind += 1) {
      if (Math.floor(kind / 9) + 1 === missingSuit || known.counts[kind] === 4) continue;
      const suit = Math.floor(kind / 9) + 1;
      const rank = kind % 9 + 1;
      let copy = 1;
      while (known.seen.has(tileId(suit, rank, copy))) copy += 1;
      const drawn = [...hand, tileId(suit, rank, copy)];
      const improves = shanten === 0 ? analyzeSichuanHand(drawn, { melds, missingSuit }).length > 0 : sichuanShanten(drawn, { melds, missingSuit }) < shanten;
      if (improves) {
        waits.push(kind);
        ukeire += 4 - known.counts[kind];
      }
    }
    return { waits, ukeire };
  }
  function chooseSichuanDiscard({ hand, melds = [], missingSuit, visibleTiles = [] }) {
    checkHolding(hand, melds, missingSuit);
    if (hand.length !== 14 - 3 * melds.length) throw new RangeError("\u5F53\u524D\u4E0D\u662F\u53EF\u51FA\u724C\u5F20\u6570");
    const known = knownTiles(hand, melds, visibleTiles);
    const legal = legalSichuanDiscards(hand, missingSuit).sort((a, b) => a - b);
    const byKind = /* @__PURE__ */ new Map();
    for (const tile of legal) if (!byKind.has(sichuanKind(tile))) byKind.set(sichuanKind(tile), tile);
    const choices = [...byKind.values()].map((tile) => {
      const remaining = hand.filter((id) => id !== tile);
      return { tile, remaining, shanten: sichuanShanten(remaining, { melds, missingSuit }) };
    });
    const bestShanten = Math.min(...choices.map((choice) => choice.shanten));
    let best = null;
    for (const choice of choices.filter((entry) => entry.shanten === bestShanten)) {
      const { waits, ukeire } = improvements(choice.remaining, melds, missingSuit, choice.shanten, known);
      if (!best || ukeire > best.ukeire) best = { tile: choice.tile, shanten: choice.shanten, waits, ukeire };
    }
    return best;
  }
  function chooseSichuanClaim({ hand, melds = [], missingSuit, visibleTiles = [] }, { tile, canHu = false, canPon = false, canKong = false }) {
    checkHolding(hand, melds, missingSuit);
    if (hand.length !== 13 - 3 * melds.length) throw new RangeError("\u5F53\u524D\u4E0D\u662F\u53EF\u54CD\u5E94\u53EB\u724C\u7684\u5F20\u6570");
    if (![canHu, canPon, canKong].every((value) => typeof value === "boolean")) throw new RangeError("\u65E0\u6548\u7684\u6743\u5A01\u52A8\u4F5C\u9009\u9879");
    const kind = sichuanKind(tile);
    if (hand.includes(tile) || melds.some((meld) => meld.tiles.includes(tile))) throw new RangeError("\u53EB\u724C\u4E0D\u80FD\u5DF2\u5728\u672C\u4EBA\u624B\u4E2D");
    const publicTiles = visibleTiles.includes(tile) ? visibleTiles : [...visibleTiles, tile];
    knownTiles(hand, melds, publicTiles);
    if (canHu) {
      if (!analyzeSichuanHand([...hand, tile], { melds, missingSuit }).length) throw new RangeError("\u80E1\u724C\u9009\u9879\u4E0E\u5B9E\u4F53\u624B\u724C\u4E0D\u7B26");
      return { type: "hu", tiles: [] };
    }
    const matching = hand.filter((id) => sichuanKind(id) === kind).sort((a, b) => a - b);
    if ((canPon || canKong) && Math.floor(kind / 9) + 1 === missingSuit) throw new RangeError("\u4E0D\u80FD\u78B0\u6760\u5B9A\u7F3A\u82B1\u8272");
    if (canPon && matching.length < 2 || canKong && matching.length !== 3) throw new RangeError("\u78B0\u6760\u9009\u9879\u4E0E\u5B9E\u4F53\u624B\u724C\u4E0D\u7B26");
    const before = sichuanShanten(hand, { melds, missingSuit });
    if (canKong) {
      const nextMelds = [...melds, { type: "kan", tiles: [...matching, tile] }];
      if (sichuanShanten(hand.filter((id) => !matching.includes(id)), { melds: nextMelds, missingSuit }) <= before) {
        return { type: "kan", tiles: matching };
      }
    }
    if (canPon) {
      const ownTiles = matching.slice(0, 2);
      const nextMelds = [...melds, { type: "pon", tiles: [...ownTiles, tile] }];
      const after = chooseSichuanDiscard({
        hand: hand.filter((id) => !ownTiles.includes(id)),
        melds: nextMelds,
        missingSuit,
        visibleTiles: publicTiles.filter((id) => id !== tile)
      });
      if (after.shanten < before) return { type: "pon", tiles: ownTiles };
    }
    return { type: "pass", tiles: [] };
  }

  // mockjs/sichuan_engine.mjs
  var clone = (value) => structuredClone(value);
  var suitOf = (tile) => Math.floor(sichuanKind(tile) / 9) + 1;
  var exited = (state, seat) => state.rules.gameType === 5022 && state.players[seat].won;
  var activeSeats = (state) => [0, 1, 2, 3].filter((seat) => !exited(state, seat));
  var action = (type, tiles = []) => ({ type, tiles });
  var actionTypes = (options) => [...new Set(options.map((option) => option.type))];
  function sameAction(a, b) {
    if (a.type !== b.type || a.tiles.length !== b.tiles.length) return false;
    const other = [...b.tiles].sort((x, y) => x - y);
    return [...a.tiles].sort((x, y) => x - y).every((tile, index) => tile === other[index]);
  }
  function seededRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 1831565813;
      let t = Math.imul(value ^ value >>> 15, 1 | value);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function emit(state, type, details = {}) {
    state.events.push({ index: state.events.length, type, ...clone(details) });
  }
  function setPhase(state, phase, turn = null) {
    state.phase = phase;
    state.turn = turn;
    state.windowId += 1;
  }
  function turnInfo(state, seat) {
    const options = ownOptions(state, seat);
    const legal = new Set(options.filter((option) => option.type === "discard").map((option) => option.tiles[0]));
    return { actionTypes: actionTypes(options), cantPlays: state.players[seat].hand.filter((tile) => !legal.has(tile)) };
  }
  function score(state, seat, tile = null, winType = "ron") {
    const player = state.players[seat];
    let opening = null;
    if (winType === "tsumo" && !state.interrupted && player.discardCount === 0 && !player.melds.length) {
      if (seat === state.dealer && player.drawCount === 0) opening = "heaven";
      else if (seat !== state.dealer && player.drawCount === 1) opening = "earth";
    }
    return scoreSichuanHand(tile === null ? player.hand : [...player.hand, tile], {
      melds: player.melds,
      missingSuit: player.missingSuit,
      gameType: state.rules.gameType,
      topBei: state.rules.topBei,
      winType,
      opening,
      afterKong: winType === "tsumo" && state.turnSource === "kong",
      lastTile: winType === "tsumo" && state.wall.length === 0
    });
  }
  var locked = (state, seat) => state.rules.gameType === 5021 && state.players[seat].won;
  function waitKey(hand, player, melds = player.melds) {
    return sichuanWaitKinds(hand, { melds, missingSuit: player.missingSuit }).join(",");
  }
  function lockedKongKeepsWaits(player, before, remove, meld) {
    const after = waitKey(player.hand.filter((tile) => !remove.includes(tile)), player, meld);
    return after !== "" && after === before;
  }
  function ownOptions(state, seat) {
    const player = state.players[seat];
    const isLocked = locked(state, seat);
    const options = isLocked ? [action("discard", [state.drawnTile])] : legalSichuanDiscards(player.hand, player.missingSuit).map((tile) => action("discard", [tile]));
    if (state.turnSource !== "pon" && score(state, seat, null, "tsumo")) options.push(action("hu"));
    if (state.turnSource === "pon" || !state.wall.length) return options;
    const groups = /* @__PURE__ */ new Map();
    for (const tile of player.hand) {
      if (suitOf(tile) === player.missingSuit) continue;
      const kind = sichuanKind(tile);
      if (!groups.has(kind)) groups.set(kind, []);
      groups.get(kind).push(tile);
    }
    const before = isLocked ? waitKey(player.hand.filter((tile) => tile !== state.drawnTile), player) : null;
    const allowed = (tiles, melds) => !isLocked || tiles.includes(state.drawnTile) && lockedKongKeepsWaits(player, before, tiles, melds);
    for (const tiles of groups.values()) {
      if (tiles.length === 4 && allowed(tiles, [...player.melds, { type: "ankan", tiles }])) options.push(action("ankan", tiles));
    }
    for (const meld of player.melds.filter((item) => item.type === "pon")) {
      const tiles = groups.get(sichuanKind(meld.tiles[0]));
      if (tiles?.length === 1 && allowed(tiles, player.melds.map((item) => item === meld ? { ...item, type: "kan", tiles: [...item.tiles, ...tiles] } : item))) options.push(action("kakan", tiles));
    }
    return options;
  }
  function optionsFor(state, seat) {
    if (!Number.isInteger(seat) || seat < 0 || seat > 3) throw new RangeError("\u65E0\u6548\u5EA7\u4F4D");
    const player = state.players[seat];
    if (state.phase === "ended" || exited(state, seat)) return [];
    if (state.phase === "exchange") {
      if (state.exchanges[seat] !== null) return [];
      const options = [];
      for (let suit = 1; suit <= 3; suit += 1) {
        const tiles = player.hand.filter((tile) => suitOf(tile) === suit);
        for (let a = 0; a < tiles.length - 2; a += 1) {
          for (let b = a + 1; b < tiles.length - 1; b += 1) {
            for (let c = b + 1; c < tiles.length; c += 1) options.push(action("exchange", [tiles[a], tiles[b], tiles[c]]));
          }
        }
      }
      return options;
    }
    if (state.phase === "missing") return player.missingSuit === null ? [1, 2, 3].map((suit) => action("missing", [suit])) : [];
    if (state.phase === "turn") return state.turn === seat ? ownOptions(state, seat) : [];
    const pending = state.pending;
    return pending?.offers[seat] && pending.responses[seat] === null ? pending.offers[seat].options : [];
  }
  function applyTransfers(state, transfers, reason) {
    const applied = [];
    for (const transfer of transfers) {
      const { from, to } = transfer;
      let { amount } = transfer;
      if (!Number.isSafeInteger(amount) || amount <= 0 || from === to || !state.players[from] || !state.players[to]) throw new RangeError("\u65E0\u6548\u79EF\u5206\u8F6C\u79FB");
      if (state.rules.lossCap !== null) amount = Math.min(amount, Math.max(0, state.rules.lossCap + state.scores[from]));
      if (!amount) continue;
      if (!Number.isSafeInteger(state.scores[from] - amount) || !Number.isSafeInteger(state.scores[to] + amount)) throw new RangeError("\u79EF\u5206\u6EA2\u51FA");
      state.scores[from] -= amount;
      state.scores[to] += amount;
      state.transfers.push({ ...transfer, amount, reason });
      applied.push({ ...transfer, amount });
    }
    return applied;
  }
  function deltaOf(transfers) {
    const delta = [0, 0, 0, 0];
    for (const { from, to, amount } of transfers) {
      delta[from] -= amount;
      delta[to] += amount;
    }
    return delta;
  }
  function finish(state, reason) {
    state.pending = null;
    if (reason === "wall") {
      const settlement = settleSichuanDraw(state.players, state.kongs, state.rules);
      const transfers = settlement.transfers.flatMap((transfer) => applyTransfers(state, [transfer], transfer.reason));
      state.settlement = { ...settlement, transfers, delta: deltaOf(transfers) };
    }
    setPhase(state, "ended");
    state.endReason = reason;
    emit(state, "end", { reason, scores: state.scores, settlement: state.settlement });
  }
  function draw(state, seat, source = "draw", kongIndex = null) {
    if (!state.wall.length) return finish(state, "wall");
    const player = state.players[seat];
    const tile = source === "kong" ? state.wall.pop() : state.wall.shift();
    player.hand.push(tile);
    player.drawCount += 1;
    player.passBei = 0;
    state.turnSource = source;
    state.lastKong = kongIndex;
    state.drawnTile = tile;
    setPhase(state, "turn", seat);
    emit(state, "draw", { seat, tile, source, remaining: state.wall.length, actionTypes: actionTypes(ownOptions(state, seat)) });
  }
  function nextDraw(state, from) {
    if (activeSeats(state).length <= 1) return finish(state, "threeWinners");
    for (let step = 1; step < 4; step += 1) {
      const seat = (from + step) % 4;
      if (!exited(state, seat)) return draw(state, seat);
    }
    throw new Error("\u6CA1\u6709\u4E0B\u4E00\u884C\u52A8\u8005");
  }
  function commitKong(state, seat, kind, tiles, from = null, meldIndex = null) {
    const player = state.players[seat];
    let waived = false;
    if (kind === "added") {
      const meld = player.melds[meldIndex];
      waived = meld.waiveAdded;
      meld.type = "kan";
      meld.tiles.push(...tiles);
      meld.kongKind = kind;
    } else {
      player.melds.push({ type: kind === "concealed" ? "ankan" : "kan", kongKind: kind, tiles: [...tiles], from, waiveAdded: false });
    }
    player.hand = player.hand.filter((tile) => !tiles.includes(tile));
    const payment = sichuanKongPayments({ seat, kind, from, activeSeats: activeSeats(state), baseScore: state.rules.baseScore, waived });
    const transfers = applyTransfers(state, payment.transfers, "kong");
    state.kongs.push({ seat, kind, transfers, transferred: false });
    state.pending = null;
    state.interrupted = true;
    emit(state, "kong", { seat, kind, tiles, from, waived, delta: deltaOf(transfers), scores: state.scores, baseScore: state.rules.baseScore });
    draw(state, seat, "kong", state.kongs.length - 1);
  }
  function win(state, winners, from = null) {
    const pending = state.pending;
    const active = activeSeats(state);
    const winType = from === null ? "tsumo" : pending.kind === "added" ? "robKong" : "ron";
    const tile = from === null ? state.drawnTile : pending.tile;
    if (winType === "robKong") {
      state.players[from].hand = state.players[from].hand.filter((id) => id !== tile);
      state.robbedTiles.push(tile);
    }
    const results = [];
    for (const seat of winners) {
      const player = state.players[seat];
      const result = from === null ? score(state, seat, null, winType) : pending.offers[seat].score;
      const payment = sichuanWinPayments({ winner: seat, loser: from, activeSeats: active, bei: result.bei, baseScore: state.rules.baseScore });
      const transfers = applyTransfers(state, payment.transfers, "win");
      if (from === null && state.rules.gameType === 5021) player.hand = player.hand.filter((id) => id !== tile);
      player.won = true;
      player.win = { tile, from, score: result };
      player.wins.push({ tile, from, score: result });
      state.winners.push(seat);
      results.push({ seat, tile, from, score: result, delta: deltaOf(transfers), scores: [...state.scores] });
    }
    let callTransfer = null;
    if (from !== null && pending.kind === "discard") {
      state.players[from].river[pending.riverIndex].winners = [...winners];
      if (winners.length === 1 && pending.kongIndex !== null) {
        const kong = state.kongs[pending.kongIndex];
        const amount = kong.transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
        if (amount > 0 && !kong.transferred) {
          const [applied] = applyTransfers(state, [{ from, to: winners[0], amount }], "callTransfer");
          kong.transferred = true;
          if (applied) callTransfer = { from, to: winners[0], amount: applied.amount, scores: [...state.scores] };
        }
      }
    }
    state.pending = null;
    state.interrupted = true;
    emit(state, "win", { results, winType, callTransfer, baseScore: state.rules.baseScore });
    nextDraw(state, from === null ? winners[0] : from);
  }
  function resolveClaims(state) {
    const pending = state.pending;
    if (pending.offers.some((offer, seat) => offer !== null && pending.responses[seat] === null)) return;
    const seats4 = [1, 2, 3].map((step) => (pending.from + step) % 4);
    const winners = seats4.filter((seat) => pending.responses[seat]?.type === "hu");
    if (winners.length) return win(state, winners, pending.from);
    if (pending.kind === "added") return commitKong(state, pending.from, "added", [pending.tile], null, pending.meldIndex);
    const caller = seats4.find((seat) => ["pon", "kan"].includes(pending.responses[seat]?.type));
    if (caller !== void 0) {
      const chosen = pending.responses[caller];
      const player = state.players[caller];
      state.players[pending.from].river[pending.riverIndex].claimed = true;
      const tiles = [...chosen.tiles, pending.tile];
      if (chosen.type === "kan") return commitKong(state, caller, "exposed", tiles, pending.from);
      player.hand = player.hand.filter((tile) => !chosen.tiles.includes(tile));
      player.melds.push({
        type: "pon",
        tiles,
        from: pending.from,
        waiveAdded: pending.offers[caller].options.some((option) => option.type === "kan")
      });
      state.pending = null;
      state.interrupted = true;
      state.turnSource = "pon";
      state.lastKong = null;
      state.drawnTile = null;
      setPhase(state, "turn", caller);
      emit(state, "pon", { seat: caller, from: pending.from, tiles, tile: pending.tile, ...turnInfo(state, caller) });
      return;
    }
    state.pending = null;
    emit(state, "claimPassed", { from: pending.from, tile: pending.tile });
    nextDraw(state, pending.from);
  }
  function openClaims(state, pending) {
    pending.offers = [null, null, null, null];
    pending.responses = [null, null, null, null];
    for (const seat of activeSeats(state)) {
      if (seat === pending.from) continue;
      const player = state.players[seat];
      const options = [action("pass")];
      const result = score(state, seat, pending.tile, pending.kind === "added" ? "robKong" : "ron");
      if (result && result.bei > player.passBei) options.push(action("hu"));
      const matching = player.hand.filter((tile) => sichuanKind(tile) === sichuanKind(pending.tile));
      if (pending.kind === "discard" && state.wall.length && suitOf(pending.tile) !== player.missingSuit) {
        if (locked(state, seat)) {
          const tiles = [...matching, pending.tile];
          if (matching.length === 3 && lockedKongKeepsWaits(
            player,
            waitKey(player.hand, player),
            matching,
            [...player.melds, { type: "kan", tiles }]
          )) options.push(action("kan", matching));
        } else {
          for (let a = 0; a < matching.length - 1; a += 1) {
            for (let b = a + 1; b < matching.length; b += 1) options.push(action("pon", [matching[a], matching[b]]));
          }
          if (matching.length === 3) options.push(action("kan", matching));
        }
      }
      if (options.length > 1) pending.offers[seat] = { options, score: result };
    }
    state.pending = pending;
    setPhase(state, "claim");
    emit(state, "claimWindow", {
      kind: pending.kind,
      from: pending.from,
      tile: pending.tile,
      actionTypes: pending.offers.map((offer) => offer === null ? [] : actionTypes(offer.options))
    });
    resolveClaims(state);
  }
  function applyAction(state, seat, chosen) {
    const player = state.players[seat];
    if (state.phase === "exchange") {
      state.exchanges[seat] = [...chosen.tiles];
      if (state.exchanges.every((tiles) => tiles !== null)) {
        for (let target = 0; target < 4; target += 1) {
          const source = (target - state.exchangeOffset + 4) % 4;
          state.players[target].hand = state.players[target].hand.filter((tile2) => !state.exchanges[target].includes(tile2)).concat(state.exchanges[source]);
        }
        if (!state.players[state.dealer].hand.includes(state.drawnTile)) state.drawnTile = state.players[state.dealer].hand.at(-1);
        emit(state, "exchange", { offset: state.exchangeOffset, selections: state.exchanges });
        setPhase(state, "missing");
      }
      return;
    }
    if (state.phase === "missing") {
      player.missingSuit = chosen.tiles[0];
      if (state.players.every((entry) => entry.missingSuit !== null)) {
        setPhase(state, "turn", state.dealer);
        emit(state, "missing", { suits: state.players.map((entry) => entry.missingSuit) });
      }
      return;
    }
    if (state.phase === "claim") {
      const offer = state.pending.offers[seat];
      if (chosen.type !== "hu" && offer.options.some((option) => option.type === "hu")) player.passBei = Math.max(player.passBei, offer.score.bei);
      state.pending.responses[seat] = clone(chosen);
      emit(state, "claimResponse", { seat, action: chosen.type, tiles: chosen.tiles });
      resolveClaims(state);
      return;
    }
    if (chosen.type === "hu") return win(state, [seat]);
    if (chosen.type === "ankan") return commitKong(state, seat, "concealed", chosen.tiles);
    if (chosen.type === "kakan") {
      const tile2 = chosen.tiles[0];
      const meldIndex = player.melds.findIndex((meld) => meld.type === "pon" && sichuanKind(meld.tiles[0]) === sichuanKind(tile2));
      openClaims(state, { kind: "added", from: seat, tile: tile2, meldIndex });
      return;
    }
    const tile = chosen.tiles[0];
    const declinedWin = state.turnSource === "pon" ? null : score(state, seat, null, "tsumo");
    if (declinedWin) player.passBei = Math.max(player.passBei, declinedWin.bei);
    player.hand = player.hand.filter((id) => id !== tile);
    player.discardCount += 1;
    player.allDiscardsMissing && (player.allDiscardsMissing = suitOf(tile) === player.missingSuit);
    player.river.push({ tile, claimed: false, winners: [] });
    emit(state, "discard", {
      seat,
      tile,
      isMoQie: ["draw", "kong"].includes(state.turnSource) && state.drawnTile === tile
    });
    openClaims(state, {
      kind: "discard",
      from: seat,
      tile,
      riverIndex: player.river.length - 1,
      kongIndex: state.turnSource === "kong" ? state.lastKong : null
    });
  }
  var _state;
  var SichuanEngine = class {
    constructor({ gameType = 5022, seed = 1, dealer = 0, exchange = true, topBei = 128, baseScore = 1, wall = null } = {}) {
      __privateAdd(this, _state);
      if (![5021, 5022].includes(gameType) || !Number.isSafeInteger(seed) || !Number.isInteger(dealer) || dealer < 0 || dealer > 3 || typeof exchange !== "boolean" || ![128, 256].includes(topBei) || !exchange && topBei !== 256 || !Number.isSafeInteger(baseScore) || baseScore <= 0 || baseScore > Math.floor(Number.MAX_SAFE_INTEGER / (256 * 1024))) throw new RangeError("\u65E0\u6548\u7684\u56DB\u5DDD\u623F\u95F4\u89C4\u5219");
      const rng = seededRandom(seed);
      const source = wall === null ? shuffle(buildSichuanWall(), rng) : [...wall];
      if (source.length !== 108 || new Set(source).size !== 108) throw new RangeError("\u724C\u5C71\u5FC5\u987B\u5305\u542B108\u5F20\u552F\u4E00\u5B9E\u4F53\u724C");
      source.forEach(sichuanKind);
      const players = Array.from({ length: 4 }, () => ({
        hand: source.splice(0, 13),
        melds: [],
        river: [],
        missingSuit: null,
        won: false,
        win: null,
        wins: [],
        passBei: 0,
        drawCount: 0,
        discardCount: 0,
        allDiscardsMissing: true
      }));
      const drawnTile = source.shift();
      players[dealer].hand.push(drawnTile);
      const lossCap = gameType === 5021 ? 40 * topBei * baseScore : null;
      __privateSet(this, _state, {
        rules: { gameType, topBei, baseScore, exchange, lossCap },
        seed,
        dealer,
        players,
        wall: source,
        phase: exchange ? "exchange" : "missing",
        windowId: 1,
        turn: null,
        turnSource: "initial",
        drawnTile,
        exchanges: [null, null, null, null],
        exchangeOffset: 1 + Math.floor(rng() * 3),
        interrupted: false,
        pending: null,
        lastKong: null,
        kongs: [],
        robbedTiles: [],
        scores: [0, 0, 0, 0],
        transfers: [],
        winners: [],
        endReason: null,
        settlement: null,
        events: []
      });
      emit(__privateGet(this, _state), "start", { dealer, remaining: source.length });
    }
    get phase() {
      return __privateGet(this, _state).phase;
    }
    get windowId() {
      return __privateGet(this, _state).windowId;
    }
    snapshot() {
      return clone(__privateGet(this, _state));
    }
    legalActions(seat) {
      return clone(optionsFor(__privateGet(this, _state), seat));
    }
    submit(seat, chosen, windowId) {
      if (windowId !== __privateGet(this, _state).windowId || !Number.isSafeInteger(windowId)) return { ok: false, error: "staleWindow" };
      if (!Number.isInteger(seat) || seat < 0 || seat > 3 || !chosen || typeof chosen !== "object" || Object.keys(chosen).some((key) => !["type", "tiles"].includes(key)) || !Array.isArray(chosen.tiles) || chosen.tiles.length > 4 || !chosen.tiles.every(Number.isSafeInteger) || new Set(chosen.tiles).size !== chosen.tiles.length) return { ok: false, error: "invalidAction" };
      const legal = optionsFor(__privateGet(this, _state), seat).find((option) => sameAction(option, chosen));
      if (!legal) return { ok: false, error: "illegalAction" };
      const next = clone(__privateGet(this, _state));
      applyAction(next, seat, legal);
      __privateSet(this, _state, next);
      return { ok: true, windowId: next.windowId };
    }
    view(seat) {
      optionsFor(__privateGet(this, _state), seat);
      const state = __privateGet(this, _state);
      const player = state.players[seat];
      const own = /* @__PURE__ */ new Set([...player.hand, ...player.melds.flatMap((meld) => meld.tiles)]);
      const visible = new Set(state.robbedTiles);
      for (const [other, entry] of state.players.entries()) {
        for (const discard of entry.river) if (!discard.claimed) visible.add(discard.tile);
        for (const record of entry.wins) visible.add(record.tile);
        if (other !== seat) {
          for (const meld of entry.melds) if (meld.type !== "ankan" || state.phase === "ended") for (const tile of meld.tiles) visible.add(tile);
          if (state.phase === "ended") for (const tile of entry.hand) visible.add(tile);
        }
      }
      return clone({
        seat,
        phase: state.phase,
        windowId: state.windowId,
        turn: state.turn,
        hand: player.hand,
        melds: player.melds,
        missingSuit: player.missingSuit,
        visibleTiles: [...visible].filter((tile) => !own.has(tile)),
        remaining: state.wall.length,
        scores: state.scores,
        winners: state.winners,
        endReason: state.endReason,
        missingSuits: state.players.map((entry) => state.phase === "missing" ? null : entry.missingSuit),
        handCounts: state.players.map((entry) => entry.hand.length),
        claimTile: state.pending?.tile ?? null,
        options: optionsFor(state, seat)
      });
    }
    chooseAction(seat) {
      const view = this.view(seat);
      if (!view.options.length) return null;
      if (view.phase === "exchange") return action("exchange", chooseSichuanExchange(view.hand));
      if (view.phase === "missing") return action("missing", [chooseSichuanMissingSuit(view.hand)]);
      if (view.phase === "claim") {
        const has = (type) => view.options.some((option) => option.type === type);
        return chooseSichuanClaim(view, { tile: view.claimTile, canHu: has("hu"), canPon: has("pon"), canKong: has("kan") });
      }
      if (view.options.some((option) => option.type === "hu")) return action("hu");
      const kong = view.options.find((option) => ["ankan", "kakan"].includes(option.type));
      if (kong) return kong;
      const discards = view.options.filter((option) => option.type === "discard");
      return discards.length === 1 ? discards[0] : action("discard", [chooseSichuanDiscard(view).tile]);
    }
  };
  _state = new WeakMap();

  // mockjs/sichuan_session.mjs
  var DEFAULT_TIMEOUTS = Object.freeze({ prepare: 2e4, exchange: 2e4, missing: 15e3, turn: 15e3, claim: 1e4 });
  var failed = (error) => ({ ok: false, error });
  var _engine, _status, _humanSeat, _timeouts, _aiDelay, _clock, _jobs, _deadline, _prepareDeadline, _connectionId, _connected, _autoplay, _onUpdate, _onFinish, _onError, _result, _SichuanSession_instances, authorize_fn, call_fn, notify_fn, cancel_fn, cancelAll_fn, begin_fn, schedule_fn, timeoutAction_fn, refresh_fn;
  var SichuanSession = class {
    constructor({
      humanSeat = 0,
      aiDelayMs = 350,
      timeoutsMs = {},
      clock = {},
      onUpdate = () => {
      },
      onFinish = () => {
      },
      onError = () => {
      },
      ...rules
    } = {}) {
      __privateAdd(this, _SichuanSession_instances);
      __privateAdd(this, _engine);
      __privateAdd(this, _status, "idle");
      __privateAdd(this, _humanSeat);
      __privateAdd(this, _timeouts);
      __privateAdd(this, _aiDelay);
      __privateAdd(this, _clock);
      __privateAdd(this, _jobs, /* @__PURE__ */ new Map());
      __privateAdd(this, _deadline, null);
      __privateAdd(this, _prepareDeadline, null);
      __privateAdd(this, _connectionId, 1);
      __privateAdd(this, _connected, true);
      __privateAdd(this, _autoplay, false);
      __privateAdd(this, _onUpdate);
      __privateAdd(this, _onFinish);
      __privateAdd(this, _onError);
      __privateAdd(this, _result, null);
      if (!Number.isInteger(humanSeat) || humanSeat < 0 || humanSeat > 3 || !Number.isSafeInteger(aiDelayMs) || aiDelayMs < 0 || aiDelayMs > 6e4 || !timeoutsMs || typeof timeoutsMs !== "object" || Array.isArray(timeoutsMs) || Object.keys(timeoutsMs).some((phase) => !Object.hasOwn(DEFAULT_TIMEOUTS, phase))) {
        throw new RangeError("\u65E0\u6548\u7684\u8840\u6218\u4F1A\u8BDD\u914D\u7F6E");
      }
      __privateSet(this, _timeouts, { ...DEFAULT_TIMEOUTS, ...timeoutsMs });
      if (Object.values(__privateGet(this, _timeouts)).some((time) => !Number.isSafeInteger(time) || time <= 0 || time > 36e5)) {
        throw new RangeError("\u65E0\u6548\u7684\u8840\u6218\u8D85\u65F6\u65F6\u95F4");
      }
      if (![onUpdate, onFinish, onError].every((callback) => typeof callback === "function")) throw new TypeError("\u65E0\u6548\u7684\u4F1A\u8BDD\u56DE\u8C03");
      __privateSet(this, _clock, {
        now: clock.now ?? (() => Date.now()),
        setTimeout: clock.setTimeout ?? ((callback, delay) => setTimeout(callback, delay)),
        clearTimeout: clock.clearTimeout ?? ((timer) => clearTimeout(timer))
      });
      if (!Object.values(__privateGet(this, _clock)).every((fn) => typeof fn === "function")) throw new TypeError("\u65E0\u6548\u7684\u4F1A\u8BDD\u65F6\u949F");
      __privateSet(this, _engine, new SichuanEngine(rules));
      __privateSet(this, _humanSeat, humanSeat);
      __privateSet(this, _aiDelay, aiDelayMs);
      __privateSet(this, _onUpdate, onUpdate);
      __privateSet(this, _onFinish, onFinish);
      __privateSet(this, _onError, onError);
    }
    get status() {
      return __privateGet(this, _status);
    }
    get matchOver() {
      return __privateGet(this, _status) === "ended";
    }
    get stopped() {
      return __privateGet(this, _status) === "stopped" || __privateGet(this, _status) === "failed";
    }
    get result() {
      return structuredClone(__privateGet(this, _result));
    }
    get timeoutsMs() {
      return { ...__privateGet(this, _timeouts) };
    }
    /** 仅供服务端诊断及最终的协议适配，不得直接广播这个快照。 */
    snapshot() {
      return __privateGet(this, _engine).snapshot();
    }
    view() {
      const game = __privateGet(this, _engine).view(__privateGet(this, _humanSeat));
      const playing = __privateGet(this, _status) === "playing";
      const expiresAt = __privateGet(this, _status) === "preparing" ? __privateGet(this, _prepareDeadline) : playing && game.options.length && __privateGet(this, _deadline)?.windowId === game.windowId ? __privateGet(this, _deadline).expiresAt : null;
      return {
        ...game,
        options: playing ? game.options : [],
        status: __privateGet(this, _status),
        connectionId: __privateGet(this, _connectionId),
        connected: __privateGet(this, _connected),
        autoplay: __privateGet(this, _autoplay) || !__privateGet(this, _connected),
        expiresAt,
        remainingMs: expiresAt === null ? 0 : Math.max(0, expiresAt - __privateGet(this, _clock).now())
      };
    }
    start() {
      if (__privateGet(this, _status) !== "idle") return failed("alreadyStarted");
      __privateSet(this, _status, "preparing");
      __privateSet(this, _prepareDeadline, __privateGet(this, _clock).now() + __privateGet(this, _timeouts).prepare);
      __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, "prepare");
      return { ok: true };
    }
    prepare(connectionId) {
      const denied = __privateMethod(this, _SichuanSession_instances, authorize_fn).call(this, connectionId);
      if (denied) return denied;
      if (__privateGet(this, _status) !== "preparing") return failed("invalidPhase");
      __privateMethod(this, _SichuanSession_instances, begin_fn).call(this);
      return { ok: true };
    }
    submit(chosen, { connectionId, windowId } = {}) {
      const denied = __privateMethod(this, _SichuanSession_instances, authorize_fn).call(this, connectionId);
      if (denied) return denied;
      if (__privateGet(this, _status) !== "playing") return failed("invalidPhase");
      if (__privateGet(this, _autoplay)) return failed("autoplay");
      if (windowId !== __privateGet(this, _engine).windowId) return failed("staleWindow");
      if (__privateGet(this, _deadline)?.windowId === windowId && __privateGet(this, _clock).now() >= __privateGet(this, _deadline).expiresAt) return failed("expiredWindow");
      const result = __privateGet(this, _engine).submit(__privateGet(this, _humanSeat), chosen, windowId);
      if (result.ok) __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, "action");
      return result;
    }
    setAutoplay(enabled, connectionId) {
      const denied = __privateMethod(this, _SichuanSession_instances, authorize_fn).call(this, connectionId);
      if (denied) return denied;
      if (typeof enabled !== "boolean") return failed("invalidAutoplay");
      __privateSet(this, _autoplay, enabled);
      __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, "autoplay");
      return { ok: true };
    }
    /** 旧 socket 的迟到 close 不能让新连接进入托管。 */
    detach(connectionId) {
      if (connectionId !== __privateGet(this, _connectionId) || !__privateGet(this, _connected)) return failed("staleConnection");
      if (this.stopped || this.matchOver) return failed("inactiveSession");
      __privateSet(this, _connected, false);
      __privateSet(this, _connectionId, __privateGet(this, _connectionId) + 1);
      __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, "detach");
      return { ok: true };
    }
    /** 同进程换连接：窗口及截止时间保留；主动托管与断线托管分开。 */
    attach() {
      if (this.stopped || this.matchOver || __privateGet(this, _status) === "idle") return failed("inactiveSession");
      __privateSet(this, _connectionId, __privateGet(this, _connectionId) + 1);
      __privateSet(this, _connected, true);
      __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, "attach");
      return { ok: true, view: this.view() };
    }
    stop() {
      if (this.stopped || this.matchOver) return;
      __privateSet(this, _status, "stopped");
      __privateMethod(this, _SichuanSession_instances, cancelAll_fn).call(this);
      __privateMethod(this, _SichuanSession_instances, notify_fn).call(this, "stop");
    }
  };
  _engine = new WeakMap();
  _status = new WeakMap();
  _humanSeat = new WeakMap();
  _timeouts = new WeakMap();
  _aiDelay = new WeakMap();
  _clock = new WeakMap();
  _jobs = new WeakMap();
  _deadline = new WeakMap();
  _prepareDeadline = new WeakMap();
  _connectionId = new WeakMap();
  _connected = new WeakMap();
  _autoplay = new WeakMap();
  _onUpdate = new WeakMap();
  _onFinish = new WeakMap();
  _onError = new WeakMap();
  _result = new WeakMap();
  _SichuanSession_instances = new WeakSet();
  authorize_fn = function(connectionId) {
    if (!__privateGet(this, _connected) || connectionId !== __privateGet(this, _connectionId)) return failed("staleConnection");
    if (this.stopped || this.matchOver || __privateGet(this, _status) === "idle") return failed("inactiveSession");
    return null;
  };
  call_fn = function(callback, value) {
    try {
      callback(value);
    } catch (error) {
      try {
        __privateGet(this, _onError).call(this, error);
      } catch {
      }
    }
  };
  notify_fn = function(reason) {
    __privateMethod(this, _SichuanSession_instances, call_fn).call(this, __privateGet(this, _onUpdate), { reason, view: this.view() });
  };
  cancel_fn = function(seat) {
    const job = __privateGet(this, _jobs).get(seat);
    if (job) {
      __privateGet(this, _jobs).delete(seat);
      __privateGet(this, _clock).clearTimeout(job.timer);
    }
  };
  cancelAll_fn = function() {
    for (const seat of __privateGet(this, _jobs).keys()) __privateMethod(this, _SichuanSession_instances, cancel_fn).call(this, seat);
  };
  begin_fn = function() {
    __privateMethod(this, _SichuanSession_instances, cancelAll_fn).call(this);
    __privateSet(this, _status, "playing");
    __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, "start");
  };
  schedule_fn = function(seat, key, due, callback) {
    const previous = __privateGet(this, _jobs).get(seat);
    if (previous?.key === key && previous.due === due) return;
    __privateMethod(this, _SichuanSession_instances, cancel_fn).call(this, seat);
    const job = { key, due, timer: null };
    __privateGet(this, _jobs).set(seat, job);
    job.timer = __privateGet(this, _clock).setTimeout(() => {
      if (__privateGet(this, _jobs).get(seat) !== job || this.stopped || this.matchOver) return;
      __privateGet(this, _jobs).delete(seat);
      try {
        callback();
      } catch (error) {
        __privateSet(this, _status, "failed");
        __privateMethod(this, _SichuanSession_instances, cancelAll_fn).call(this);
        __privateMethod(this, _SichuanSession_instances, call_fn).call(this, __privateGet(this, _onError), error);
      }
    }, Math.max(0, due - __privateGet(this, _clock).now()));
  };
  timeoutAction_fn = function() {
    const view = __privateGet(this, _engine).view(__privateGet(this, _humanSeat));
    if (view.phase === "claim") return { type: "pass", tiles: [] };
    if (view.phase === "turn") {
      const drawnTile = __privateGet(this, _engine).snapshot().drawnTile;
      const drawnDiscard = view.options.find((option) => option.type === "discard" && option.tiles[0] === drawnTile);
      return drawnDiscard ?? { type: "discard", tiles: [chooseSichuanDiscard(view).tile] };
    }
    return __privateGet(this, _engine).chooseAction(__privateGet(this, _humanSeat));
  };
  refresh_fn = function(reason) {
    if (this.stopped || this.matchOver || __privateGet(this, _status) === "idle") return;
    const now = __privateGet(this, _clock).now();
    if (__privateGet(this, _status) === "preparing") {
      const automatic = !__privateGet(this, _connected) || __privateGet(this, _autoplay);
      const due = automatic ? now : __privateGet(this, _prepareDeadline);
      __privateMethod(this, _SichuanSession_instances, schedule_fn).call(this, -1, `prepare:${__privateGet(this, _connectionId)}:${automatic}`, due, () => __privateMethod(this, _SichuanSession_instances, begin_fn).call(this));
      __privateMethod(this, _SichuanSession_instances, notify_fn).call(this, reason);
      return;
    }
    if (__privateGet(this, _engine).phase === "ended") {
      __privateMethod(this, _SichuanSession_instances, cancelAll_fn).call(this);
      __privateSet(this, _status, "ended");
      const state = __privateGet(this, _engine).snapshot();
      __privateSet(this, _result, {
        gameType: state.rules.gameType,
        seed: state.seed,
        rules: state.rules,
        scores: state.scores,
        winners: state.winners,
        reason: state.endReason
      });
      __privateMethod(this, _SichuanSession_instances, notify_fn).call(this, "finish");
      __privateMethod(this, _SichuanSession_instances, call_fn).call(this, __privateGet(this, _onFinish), this.result);
      return;
    }
    const windowId = __privateGet(this, _engine).windowId;
    const ownOptions2 = __privateGet(this, _engine).legalActions(__privateGet(this, _humanSeat));
    if (ownOptions2.length && __privateGet(this, _deadline)?.windowId !== windowId) {
      __privateSet(this, _deadline, { windowId, expiresAt: now + __privateGet(this, _timeouts)[__privateGet(this, _engine).phase] });
    }
    for (let seat = 0; seat < 4; seat += 1) {
      if (!__privateGet(this, _engine).legalActions(seat).length) {
        __privateMethod(this, _SichuanSession_instances, cancel_fn).call(this, seat);
        continue;
      }
      const automatic = seat !== __privateGet(this, _humanSeat) || __privateGet(this, _autoplay) || !__privateGet(this, _connected);
      const key = `${windowId}:${automatic}:${__privateGet(this, _connectionId)}`;
      const delay = __privateGet(this, _connected) ? __privateGet(this, _aiDelay) : 0;
      const previous = __privateGet(this, _jobs).get(seat);
      const due = automatic ? previous?.key === key ? previous.due : now + delay : __privateGet(this, _deadline).expiresAt;
      __privateMethod(this, _SichuanSession_instances, schedule_fn).call(this, seat, key, due, () => {
        if (__privateGet(this, _engine).windowId !== windowId) return;
        const chosen = automatic ? __privateGet(this, _engine).chooseAction(seat) : __privateMethod(this, _SichuanSession_instances, timeoutAction_fn).call(this);
        const result = __privateGet(this, _engine).submit(seat, chosen, windowId);
        if (!result.ok) throw new Error(`\u8840\u6218\u81EA\u52A8\u52A8\u4F5C\u88AB\u62D2\u7EDD seat=${seat} window=${windowId} error=${result.error}`);
        __privateMethod(this, _SichuanSession_instances, refresh_fn).call(this, automatic ? "ai" : "timeout");
      });
    }
    __privateMethod(this, _SichuanSession_instances, notify_fn).call(this, reason);
  };

  // mockjs/majiang_pb.mjs
  var import_light2 = __toESM(require_light(), 1);

  // mockjs/majiang_desc.mjs
  var MAJIANG_DESCRIPTOR = {
    "nested": {
      "majiang": {
        "options": {
          "optimize_for": "SPEED",
          "go_package": "gitlab.gg.com/riichi_mahjong/proto/go/client/game_logic/majiang",
          "csharp_namespace": "Com.Framework.Protocol.Majiang"
        },
        "nested": {
          "MoneyLogUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "bei": {
                "type": "int32",
                "id": 2
              },
              "money": {
                "type": "int64",
                "id": 3
              },
              "finalMoney": {
                "type": "int64",
                "id": 4
              },
              "fengDing": {
                "type": "bool",
                "id": 5
              },
              "yiTypes": {
                "rule": "repeated",
                "type": "int32",
                "id": 6
              },
              "noMoney": {
                "type": "bool",
                "id": 7
              },
              "sysMoney": {
                "type": "int64",
                "id": 8
              }
            }
          },
          "MoneyLog": {
            "fields": {
              "type": {
                "type": "int32",
                "id": 1
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.MoneyLogUserInfo",
                "id": 2
              }
            }
          },
          "TingInfo": {
            "fields": {
              "play": {
                "type": "int32",
                "id": 1
              },
              "ting": {
                "type": "int32",
                "id": 2
              },
              "maxBei": {
                "type": "int32",
                "id": 5
              }
            }
          },
          "ToPrepareUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "userID": {
                "type": "uint64",
                "id": 2
              }
            }
          },
          "NtfToPrepare": {
            "fields": {
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.ToPrepareUserInfo",
                "id": 1
              }
            }
          },
          "PrepareUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "NtfPrepare": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.PrepareUserInfo",
                "id": 2
              }
            }
          },
          "GameStartUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "score": {
                "type": "int64",
                "id": 2
              },
              "handCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 4
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 5
              },
              "canPlayActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 6
              },
              "changeCardSuggest": {
                "rule": "repeated",
                "type": "int32",
                "id": 7
              },
              "dingQueSuggest": {
                "type": "int32",
                "id": 8
              },
              "huaCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 9
              },
              "chuPai2Timeout": {
                "type": "int32",
                "id": 10
              }
            }
          },
          "NtfGameStart": {
            "fields": {
              "changWind": {
                "type": "int32",
                "id": 1
              },
              "juNum": {
                "type": "int32",
                "id": 2
              },
              "zhuangSeat": {
                "type": "int32",
                "id": 3
              },
              "remainDuiCardNum": {
                "type": "int32",
                "id": 4
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.GameStartUserInfo",
                "id": 5
              },
              "gameID": {
                "type": "string",
                "id": 6
              },
              "guiPreCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 7
              },
              "guiCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 8
              },
              "changeCardType": {
                "type": "int32",
                "id": 9
              },
              "baseScore": {
                "type": "int64",
                "id": 10
              },
              "topBei": {
                "type": "int32",
                "id": 11
              },
              "huanZhangTimeout": {
                "type": "int32",
                "id": 12
              },
              "dingQueTimeout": {
                "type": "int32",
                "id": 13
              },
              "chuPai1Timeout": {
                "type": "int32",
                "id": 14
              },
              "qiangPaiTimeout": {
                "type": "int32",
                "id": 15
              },
              "poChan1Timeout": {
                "type": "int32",
                "id": 16
              },
              "poChan2Timeout": {
                "type": "int32",
                "id": 17
              },
              "changeCardRule": {
                "type": "int32",
                "id": 18
              },
              "hasDingQue": {
                "type": "bool",
                "id": 19
              },
              "scoreType": {
                "type": "int32",
                "id": 20
              },
              "touzi1": {
                "type": "int32",
                "id": 21
              },
              "touzi2": {
                "type": "int32",
                "id": 22
              },
              "hasQuePaiBianShen": {
                "type": "bool",
                "id": 23
              },
              "totalJuNum": {
                "type": "int32",
                "id": 24
              },
              "specialCardNumMap": {
                "keyType": "int32",
                "type": "int32",
                "id": 25
              },
              "jieSuanRule": {
                "type": "int32",
                "id": 26
              },
              "isMingPai": {
                "type": "bool",
                "id": 27
              }
            }
          },
          "SendCardUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "card": {
                "type": "int32",
                "id": 2
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 3
              },
              "canPlayActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 4
              },
              "chuPai2Timeout": {
                "type": "int32",
                "id": 5
              },
              "isDianGangHuaDianPao": {
                "type": "bool",
                "id": 6
              }
            }
          },
          "NtfSendCard": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.SendCardUserInfo",
                "id": 2
              },
              "remainDuiCardNum": {
                "type": "int32",
                "id": 3
              }
            }
          },
          "PlayCardUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "canQiangActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 2
              },
              "canGangNoNumCardsAfterRiichiHu": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              }
            }
          },
          "NtfPlayCard": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "card": {
                "type": "int32",
                "id": 2
              },
              "action": {
                "type": "int32",
                "id": 3
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.PlayCardUserInfo",
                "id": 4
              },
              "isMoQie": {
                "type": "bool",
                "id": 5
              },
              "moneyLogs": {
                "rule": "repeated",
                "type": ".majiang.MoneyLog",
                "id": 6
              },
              "isFinish": {
                "type": "bool",
                "id": 7
              }
            }
          },
          "QiangCardUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "NtfQiangCard": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "action": {
                "type": "int32",
                "id": 2
              },
              "otherCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.QiangCardUserInfo",
                "id": 4
              }
            }
          },
          "QiangCardEndUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 2
              },
              "canPlayActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              },
              "cantPlays": {
                "rule": "repeated",
                "type": "int32",
                "id": 4
              },
              "chuPai2Timeout": {
                "type": "int32",
                "id": 5
              },
              "canGangNoNumCardsAfterRiichiHu": {
                "rule": "repeated",
                "type": "int32",
                "id": 6
              }
            }
          },
          "NtfQiangCardEnd": {
            "fields": {
              "seats": {
                "rule": "repeated",
                "type": "int32",
                "id": 1
              },
              "action": {
                "type": "int32",
                "id": 2
              },
              "otherCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.QiangCardEndUserInfo",
                "id": 4
              },
              "moneyLogs": {
                "rule": "repeated",
                "type": ".majiang.MoneyLog",
                "id": 6
              },
              "isFinish": {
                "type": "bool",
                "id": 7
              }
            }
          },
          "SingleMa": {
            "fields": {
              "card": {
                "type": "int32",
                "id": 1
              },
              "seat": {
                "type": "int32",
                "id": 2
              }
            }
          },
          "HuInfo": {
            "fields": {
              "huCard": {
                "type": "int32",
                "id": 1
              },
              "huType": {
                "type": "int32",
                "id": 2
              }
            }
          },
          "OneGameHistory": {
            "fields": {
              "changeScore": {
                "type": "int64",
                "id": 2
              }
            }
          },
          "GameStopUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "score": {
                "type": "int64",
                "id": 2
              },
              "handCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              },
              "changeScore": {
                "type": "int64",
                "id": 4
              },
              "totalBei": {
                "type": "int32",
                "id": 5
              },
              "rank": {
                "type": "int32",
                "id": 6
              },
              "doorCardsInfos": {
                "rule": "repeated",
                "type": ".majiang.DoorCardsInfo",
                "id": 7
              },
              "alreadyRiichi": {
                "type": "bool",
                "id": 9
              },
              "oldPTLevel": {
                "type": "int32",
                "id": 10
              },
              "oldPTPoint": {
                "type": "int32",
                "id": 11
              },
              "newPTLevel": {
                "type": "int32",
                "id": 12
              },
              "newPTPoint": {
                "type": "int32",
                "id": 13
              },
              "changePT": {
                "type": "int64",
                "id": 14
              },
              "maiMa": {
                "rule": "repeated",
                "type": ".majiang.SingleMa",
                "id": 16
              },
              "baseBei": {
                "type": "int32",
                "id": 17
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 18
              },
              "isFinish": {
                "type": "bool",
                "id": 19
              },
              "poChanStatus": {
                "type": "int32",
                "id": 20
              },
              "huInfos": {
                "rule": "repeated",
                "type": ".majiang.HuInfo",
                "id": 21
              },
              "isExit": {
                "type": "bool",
                "id": 22
              },
              "oldLoveLevel": {
                "type": "int32",
                "id": 23
              },
              "oldLovePoint": {
                "type": "int32",
                "id": 24
              },
              "newLoveLevel": {
                "type": "int32",
                "id": 25
              },
              "newLovePoint": {
                "type": "int32",
                "id": 26
              },
              "changeLove": {
                "type": "int64",
                "id": 27
              },
              "isTianMingHuaZHu": {
                "type": "bool",
                "id": 28
              },
              "histories": {
                "rule": "repeated",
                "type": ".majiang.OneGameHistory",
                "id": 29
              }
            }
          },
          "NtfGameStop": {
            "fields": {
              "huSeats": {
                "rule": "repeated",
                "type": "int32",
                "id": 1
              },
              "huCardSeat": {
                "type": "int32",
                "id": 2
              },
              "huCard": {
                "type": "int32",
                "id": 3
              },
              "isFinal": {
                "type": "bool",
                "id": 4
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.GameStopUserInfo",
                "id": 5
              },
              "stopType": {
                "type": "int32",
                "id": 7
              },
              "moneyLogs": {
                "rule": "repeated",
                "type": ".majiang.MoneyLog",
                "id": 8
              },
              "winningStreak": {
                "type": "int32",
                "id": 9
              }
            }
          },
          "ChangeCardUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "cards": {
                "rule": "repeated",
                "type": "int32",
                "id": 2
              }
            }
          },
          "NtfChangeCard": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "cardNum": {
                "type": "int32",
                "id": 2
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.ChangeCardUserInfo",
                "id": 3
              }
            }
          },
          "ChangeCardEndUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "cards": {
                "rule": "repeated",
                "type": "int32",
                "id": 2
              },
              "getCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              },
              "dingQueSuggest": {
                "type": "int32",
                "id": 4
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 5
              },
              "canPlayActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 6
              },
              "chuPai2Timeout": {
                "type": "int32",
                "id": 7
              }
            }
          },
          "NtfChangeCardEnd": {
            "fields": {
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.ChangeCardEndUserInfo",
                "id": 1
              }
            }
          },
          "DingQueUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "dingQue": {
                "type": "int32",
                "id": 2
              }
            }
          },
          "NtfDingQue": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.DingQueUserInfo",
                "id": 2
              }
            }
          },
          "DingQueEndUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "dingQue": {
                "type": "int32",
                "id": 2
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 3
              },
              "canPlayActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 4
              },
              "chuPai2Timeout": {
                "type": "int32",
                "id": 5
              },
              "quePaiBianShen": {
                "rule": "repeated",
                "type": "int32",
                "id": 6
              },
              "moCard": {
                "type": "int32",
                "id": 7
              }
            }
          },
          "NtfDingQueEnd": {
            "fields": {
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.DingQueEndUserInfo",
                "id": 1
              }
            }
          },
          "PoChanUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "NtfPoChanChange": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "poChanStatus": {
                "type": "int32",
                "id": 2
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.PoChanUserInfo",
                "id": 3
              },
              "finalMoney": {
                "type": "int64",
                "id": 4
              },
              "isFinish": {
                "type": "bool",
                "id": 5
              }
            }
          },
          "ExitUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "NtfExit": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.ExitUserInfo",
                "id": 2
              }
            }
          },
          "TuoGuanUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "NtfTuoGuanChange": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "tuoGuanStatus": {
                "type": "int32",
                "id": 2
              },
              "userInfos": {
                "rule": "repeated",
                "type": ".majiang.TuoGuanUserInfo",
                "id": 3
              }
            }
          },
          "ReqPrepare": {
            "fields": {}
          },
          "RspPrepare": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqPlayCard": {
            "fields": {
              "card": {
                "type": "int32",
                "id": 1
              },
              "action": {
                "type": "int32",
                "id": 2
              },
              "isTimeout": {
                "type": "bool",
                "id": 3
              },
              "isChuPai1Timeout": {
                "type": "bool",
                "id": 4
              }
            }
          },
          "RspPlayCard": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqQiangCard": {
            "fields": {
              "action": {
                "type": "int32",
                "id": 1
              },
              "otherCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 2
              },
              "isTimeout": {
                "type": "bool",
                "id": 3
              }
            }
          },
          "RspQiangCard": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqChangeCard": {
            "fields": {
              "cards": {
                "rule": "repeated",
                "type": "int32",
                "id": 1
              }
            }
          },
          "RspChangeCard": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqDingQue": {
            "fields": {
              "dingQue": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "RspDingQue": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqPoChanChange": {
            "fields": {
              "poChanStatus": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "RspPoChanChange": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqExit": {
            "fields": {}
          },
          "RspExit": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqTuoGuanChange": {
            "fields": {
              "tuoGuanStatus": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "RspTuoGuanChange": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "ReqSetInternalState": {
            "fields": {
              "InternalState": {
                "keyType": "int32",
                "type": "int32",
                "id": 1
              }
            }
          },
          "RspSetInternalState": {
            "fields": {
              "result": {
                "type": "int32",
                "id": 1
              }
            }
          },
          "DoorCardsInfo": {
            "fields": {
              "cards": {
                "rule": "repeated",
                "type": "int32",
                "id": 1
              },
              "action": {
                "type": "int32",
                "id": 2
              },
              "qiangSeat": {
                "type": "int32",
                "id": 3
              }
            }
          },
          "Offline2OnlineUserInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "handCardsNum": {
                "type": "int32",
                "id": 2
              },
              "doorCardsInfos": {
                "rule": "repeated",
                "type": ".majiang.DoorCardsInfo",
                "id": 3
              },
              "handCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 4
              },
              "playedCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 5
              },
              "PlayedCardsOtherTake": {
                "rule": "repeated",
                "type": "int32",
                "id": 6
              },
              "alreadyRiichi": {
                "type": "bool",
                "id": 7
              },
              "tingInfos": {
                "rule": "repeated",
                "type": ".majiang.TingInfo",
                "id": 8
              },
              "canPlayActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 9
              },
              "cantPlays": {
                "rule": "repeated",
                "type": "int32",
                "id": 10
              },
              "changeScore": {
                "type": "int64",
                "id": 11
              },
              "canQiangActions": {
                "rule": "repeated",
                "type": "int32",
                "id": 12
              },
              "score": {
                "type": "int64",
                "id": 13
              },
              "huaCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 15
              },
              "huInfos": {
                "rule": "repeated",
                "type": ".majiang.HuInfo",
                "id": 16
              },
              "dingQue": {
                "type": "int32",
                "id": 17
              },
              "canGangNoNumCardsAfterRiichiHu": {
                "rule": "repeated",
                "type": "int32",
                "id": 18
              },
              "moQieMap": {
                "keyType": "int32",
                "type": "bool",
                "id": 19
              },
              "chuPai2Timeout": {
                "type": "int32",
                "id": 20
              },
              "poChanStatus": {
                "type": "int32",
                "id": 21
              },
              "timeoutStartTime": {
                "type": "int64",
                "id": 22
              },
              "tuoGuanStatus": {
                "type": "int32",
                "id": 23
              },
              "internalState": {
                "keyType": "int32",
                "type": "int32",
                "id": 24
              },
              "changeCardSuggest": {
                "rule": "repeated",
                "type": "int32",
                "id": 26
              },
              "dingQueSuggest": {
                "type": "int32",
                "id": 27
              },
              "isFinish": {
                "type": "bool",
                "id": 28
              },
              "histories": {
                "rule": "repeated",
                "type": ".majiang.OneGameHistory",
                "id": 29
              },
              "isDianGangHuaDianPao": {
                "type": "bool",
                "id": 30
              }
            }
          },
          "QiangInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "action": {
                "type": "int32",
                "id": 2
              },
              "otherCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 3
              }
            }
          },
          "ChangeCardInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "cards": {
                "rule": "repeated",
                "type": "int32",
                "id": 2
              },
              "cardNum": {
                "type": "int32",
                "id": 3
              }
            }
          },
          "DingQueInfo": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "dingQue": {
                "type": "int32",
                "id": 2
              }
            }
          },
          "Offline2OnlineGameScene": {
            "fields": {
              "seat": {
                "type": "int32",
                "id": 1
              },
              "changWind": {
                "type": "int32",
                "id": 2
              },
              "juNum": {
                "type": "int32",
                "id": 3
              },
              "zhuangSeat": {
                "type": "int32",
                "id": 4
              },
              "remainDuiCardNum": {
                "type": "int32",
                "id": 5
              },
              "currentSeat": {
                "type": "int32",
                "id": 6
              },
              "currentPlayCard": {
                "type": "int32",
                "id": 7
              },
              "currentAction": {
                "type": "int32",
                "id": 8
              },
              "qiangInfos": {
                "rule": "repeated",
                "type": ".majiang.QiangInfo",
                "id": 10
              },
              "offline2OnlineUserInfos": {
                "rule": "repeated",
                "type": ".majiang.Offline2OnlineUserInfo",
                "id": 11
              },
              "gameID": {
                "type": "string",
                "id": 12
              },
              "preSeat": {
                "type": "int32",
                "id": 13
              },
              "prePlayCard": {
                "type": "int32",
                "id": 14
              },
              "preAction": {
                "type": "int32",
                "id": 15
              },
              "preQiangInfos": {
                "rule": "repeated",
                "type": ".majiang.QiangInfo",
                "id": 16
              },
              "baseScore": {
                "type": "int64",
                "id": 17
              },
              "topBei": {
                "type": "int32",
                "id": 18
              },
              "moneyLogs": {
                "rule": "repeated",
                "type": ".majiang.MoneyLog",
                "id": 19
              },
              "huanZhangTimeout": {
                "type": "int32",
                "id": 22
              },
              "dingQueTimeout": {
                "type": "int32",
                "id": 23
              },
              "chuPai1Timeout": {
                "type": "int32",
                "id": 24
              },
              "qiangPaiTimeout": {
                "type": "int32",
                "id": 25
              },
              "poChan1Timeout": {
                "type": "int32",
                "id": 26
              },
              "poChan2Timeout": {
                "type": "int32",
                "id": 27
              },
              "changeCardType": {
                "type": "int32",
                "id": 28
              },
              "changeCardRule": {
                "type": "int32",
                "id": 29
              },
              "changeCardInfos": {
                "rule": "repeated",
                "type": ".majiang.ChangeCardInfo",
                "id": 30
              },
              "hasDingQue": {
                "type": "bool",
                "id": 31
              },
              "dingQueInfos": {
                "rule": "repeated",
                "type": ".majiang.DingQueInfo",
                "id": 32
              },
              "touzi1": {
                "type": "int32",
                "id": 33
              },
              "touzi2": {
                "type": "int32",
                "id": 34
              },
              "scoreType": {
                "type": "int32",
                "id": 35
              },
              "hasQuePaiBianShen": {
                "type": "bool",
                "id": 36
              },
              "totalJuNum": {
                "type": "int32",
                "id": 37
              },
              "guiPreCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 38
              },
              "guiCards": {
                "rule": "repeated",
                "type": "int32",
                "id": 39
              },
              "specialCardNumMap": {
                "keyType": "int32",
                "type": "int32",
                "id": 40
              },
              "jieSuanRule": {
                "type": "int32",
                "id": 41
              }
            }
          },
          "GmReqStopGame": {
            "fields": {}
          },
          "GmRspStopGame": {
            "fields": {}
          },
          "GmReqInitCard": {
            "fields": {
              "cardId": {
                "type": "int32",
                "id": 1
              },
              "isZimo": {
                "type": "bool",
                "id": 2
              },
              "isForbidRobotHu": {
                "type": "bool",
                "id": 3
              },
              "duiCardNum": {
                "type": "int32",
                "id": 4
              }
            }
          },
          "GmRspInitCard": {
            "fields": {}
          },
          "GmReqSetRobotConfig": {
            "fields": {
              "robotSpeedLevel": {
                "type": "int32",
                "id": 1
              }
            },
            "nested": {
              "RobotSpeed": {
                "values": {
                  "Normal": 0,
                  "HalfTime": 1,
                  "Fast": 2
                }
              }
            }
          },
          "GmRspSetRobotConfig": {
            "fields": {}
          },
          "OneGameRecordStep": {
            "fields": {
              "ntfToPrepare": {
                "type": ".majiang.NtfToPrepare",
                "id": 1
              },
              "ntfPrepare": {
                "type": ".majiang.NtfPrepare",
                "id": 2
              },
              "ntfGameStart": {
                "type": ".majiang.NtfGameStart",
                "id": 3
              },
              "ntfSendCard": {
                "type": ".majiang.NtfSendCard",
                "id": 4
              },
              "ntfPlayCard": {
                "type": ".majiang.NtfPlayCard",
                "id": 5
              },
              "ntfQiangCard": {
                "type": ".majiang.NtfQiangCard",
                "id": 6
              },
              "ntfQiangCardEnd": {
                "type": ".majiang.NtfQiangCardEnd",
                "id": 7
              },
              "ntfGameStop": {
                "type": ".majiang.NtfGameStop",
                "id": 8
              },
              "ntfChangeCard": {
                "type": ".majiang.NtfChangeCard",
                "id": 9
              },
              "ntfChangeCardEnd": {
                "type": ".majiang.NtfChangeCardEnd",
                "id": 10
              },
              "ntfDingQue": {
                "type": ".majiang.NtfDingQue",
                "id": 11
              },
              "ntfDingQueEnd": {
                "type": ".majiang.NtfDingQueEnd",
                "id": 12
              },
              "ntfPoChanChange": {
                "type": ".majiang.NtfPoChanChange",
                "id": 13
              },
              "ntfExit": {
                "type": ".majiang.NtfExit",
                "id": 14
              },
              "ntfTuoGuanChange": {
                "type": ".majiang.NtfTuoGuanChange",
                "id": 15
              },
              "stepType": {
                "type": "int32",
                "id": 101
              },
              "time": {
                "type": "int64",
                "id": 102
              }
            }
          },
          "CardType": {
            "values": {
              "None": 0,
              "Wan": 1,
              "Tong": 2,
              "Tiao": 3,
              "Zi": 4,
              "Hua": 5,
              "Te": 6
            }
          },
          "Result": {
            "values": {
              "Succ": 0,
              "Fail_InternalError": 1,
              "Fail_InvalidParam": 2,
              "Fail_InvalidSequence": 3,
              "Fail_ActionNotInCanPlayActions": 101,
              "Fail_CardInCantPlays": 102,
              "Fail_RiichiPlayCardWrong": 103,
              "Fail_CardNotInHand": 104,
              "Fail_CardNotMatchAction": 105,
              "Fail_ActionNotInCanQiangActions": 201,
              "Fail_InvalidOtherCards": 202,
              "Fail_InvalidChangeCards": 301,
              "Fail_InvalidDingQue": 401
            }
          },
          "Wind": {
            "values": {
              "East": 0,
              "South": 1,
              "West": 2,
              "North": 3
            }
          },
          "MaJiangMsg": {
            "values": {
              "ENone": 0,
              "EReqPrepare": 1,
              "ERspPrepare": 2,
              "EReqPlayCard": 3,
              "ERspPlayCard": 4,
              "EReqQiangCard": 5,
              "ERspQiangCard": 6,
              "EReqChangeCard": 7,
              "ERspChangeCard": 8,
              "EReqDingQue": 9,
              "ERspDingQue": 10,
              "EReqPoChanChange": 11,
              "ERspPoChanChange": 12,
              "EReqExit": 13,
              "ERspExit": 14,
              "EReqTuoGuanChange": 15,
              "ERspTuoGuanChange": 16,
              "EReqSetInternalState": 17,
              "ERspSetInternalState": 18,
              "ENtfToPrepare": 1001,
              "ENtfPrepare": 1002,
              "ENtfGameStart": 1003,
              "ENtfSendCard": 1004,
              "ENtfPlayCard": 1005,
              "ENtfQiangCard": 1006,
              "ENtfQiangCardEnd": 1007,
              "ENtfGameStop": 1008,
              "ENtfChangeCard": 1009,
              "ENtfChangeCardEnd": 1010,
              "ENtfDingQue": 1011,
              "ENtfDingQueEnd": 1012,
              "ENtfPoChanChange": 1013,
              "ENtfExit": 1014,
              "ENtfTuoGuanChange": 1015,
              "EGmBegin": 5e4,
              "EGmReqStopGame": 50001,
              "EGmRspStopGame": 50002,
              "EGmReqInitCard": 50003,
              "EGmRspInitCard": 50004,
              "EGmReqSetRobotConfig": 50005,
              "EGmRspSetRobotConfig": 50006,
              "EGmEnd": 6e4
            }
          },
          "PlayAction": {
            "values": {
              "Normal": 0,
              "Guo": 1,
              "Chi": 2,
              "Peng": 3,
              "MingGang": 4,
              "PengGang": 5,
              "AnGang": 6,
              "Riichi": 7,
              "Hu": 8
            }
          },
          "GuiPlayRule": {
            "values": {
              "GuiPlayRule_No": 0,
              "GuiPlayRule_Gang": 1
            }
          },
          "MoneyLogType": {
            "values": {
              "MoneyLogType_None": 0,
              "MoneyLogType_MingGang": 1,
              "MoneyLogType_PengGang": 2,
              "MoneyLogType_AnGang": 3,
              "MoneyLogType_Mo": 4,
              "MoneyLogType_Rong": 5,
              "MoneyLogType_MaiMa": 6,
              "MoneyLogType_ZhaNiao": 7,
              "MoneyLogType_ChaHuaZhu": 8,
              "MoneyLogType_ChaDaJiao": 9,
              "MoneyLogType_TuiShui": 10,
              "MoneyLogType_HuJiaoZhuanYi": 11
            }
          },
          "ChangeCardRule": {
            "values": {
              "ChangeCardRule_No": 0,
              "ChangeCardRule_HuanSanZhang": 1,
              "ChangeCardRule_RenYiHuan": 2,
              "ChangeCardRule_HuanSanZhang2": 3
            }
          },
          "ChangeCardType": {
            "values": {
              "ChangeCardType_No": 0,
              "ChangeCardType_Shun": 1,
              "ChangeCardType_Ni": 2,
              "ChangeCardType_Dui": 3
            }
          },
          "HuType": {
            "values": {
              "HuType_None": 0,
              "HuType_Mo": 1,
              "HuType_Rong": 2,
              "HuType_QiangGang": 3
            }
          },
          "PoChanStatus": {
            "values": {
              "PoChanStatus_No": 0,
              "PoChanStatus_DaiBuDou": 1,
              "PoChanStatus_RenShu": 2,
              "PoChanStatus_BuDouZhong": 3
            }
          },
          "InternalStateType": {
            "values": {
              "InternalStateType_None": 0,
              "InternalStateType_Que": 1,
              "InternalStateType_Gang": 2,
              "InternalStateType_Hu": 3
            }
          }
        }
      }
    }
  };

  // mockjs/majiang_pb.mjs
  var root2 = import_light2.default.Root.fromJSON(MAJIANG_DESCRIPTOR).resolveAll();
  var namespace = root2.lookup("majiang");
  var types = new Map(Object.entries(namespace.nested).filter(([, value]) => value instanceof import_light2.default.Type));
  var MaJiangMsg = Object.freeze({ ...root2.lookupEnum("majiang.MaJiangMsg").values });
  var MaJiangAction = Object.freeze({ ...root2.lookupEnum("majiang.PlayAction").values });
  var MaJiangResult = Object.freeze({ ...root2.lookupEnum("majiang.Result").values });
  var messageNames = new Map(Object.entries(MaJiangMsg).filter(([name, id]) => id > 0 && id < 5e4 && /^E(?:Req|Rsp|Ntf)/.test(name)).map(([name, id]) => [id, name.slice(1)]));
  var envelope = new import_light2.default.Type("GameServerLogicData").add(new import_light2.default.Field("cmd", 1, "int32")).add(new import_light2.default.Field("extraLogicData", 2, "bytes", "repeated")).add(new import_light2.default.Field("gameNumber", 3, "int64")).add(new import_light2.default.Field("serialized", 100, "bytes"));
  new import_light2.default.Root().add(envelope).resolveAll();
  function typeOf(name) {
    if (!types.has(name)) throw new Error(`\u672A\u77E5\u5730\u65B9\u9EBB\u5C06\u6D88\u606F\uFF1A${name}`);
    return types.get(name);
  }
  function verifyValues(type, value) {
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(type.fields, key)) throw new TypeError(`protobuf ${type.name}: \u672A\u77E5\u5B57\u6BB5 ${key}`);
      const field = type.fields[key];
      const values = field.repeated ? value[key] : field.map ? Object.values(value[key] || {}) : [value[key]];
      for (const item of values) {
        if (item == null) continue;
        if (field.resolvedType instanceof import_light2.default.Type) {
          verifyValues(field.resolvedType, item);
        } else if (typeof item === "number" && /^(?:u?int|sint|s?fixed)(?:32|64)$/.test(field.type)) {
          const signed = !/^(?:uint|fixed)/.test(field.type);
          const valid = Number.isSafeInteger(item) && (field.type.endsWith("64") ? signed || item >= 0 : item >= (signed ? -2147483648 : 0) && item <= (signed ? 2147483647 : 4294967295));
          if (!valid) throw new RangeError(`protobuf ${type.name}.${key}: \u6574\u6570\u8D85\u51FA\u5B89\u5168\u8303\u56F4`);
        }
      }
    }
  }
  function encode(type, value) {
    const error = type.verify(value);
    if (error) throw new TypeError(`protobuf ${type.name}: ${error}`);
    verifyValues(type, value);
    return type.encode(type.fromObject(value)).finish();
  }
  function decode(type, bytes) {
    if (!(bytes instanceof Uint8Array)) throw new TypeError("protobuf\u8F93\u5165\u5FC5\u987B\u662F\u5B57\u8282\u6570\u7EC4");
    return type.toObject(type.decode(bytes), { defaults: true, arrays: true, objects: true, enums: Number, longs: String });
  }
  function encodeMaJiang(name, value) {
    return encode(typeOf(name), value);
  }
  function decodeMaJiang(name, bytes) {
    return decode(typeOf(name), bytes);
  }
  function majiangMessageName(cmd) {
    if (!Number.isInteger(cmd) || !messageNames.has(cmd)) throw new RangeError(`\u672A\u652F\u6301\u7684\u5730\u65B9\u9EBB\u5C06\u4E8B\u4EF6\uFF1A${cmd}`);
    return messageNames.get(cmd);
  }
  function encodeMaJiangEnvelope(cmd, payload, { gameNumber = 0 } = {}) {
    const name = majiangMessageName(cmd);
    return encode(envelope, { cmd, gameNumber, serialized: encodeMaJiang(name, payload) });
  }
  function decodeMaJiangEnvelope(bytes) {
    const { cmd, gameNumber, serialized, extraLogicData } = decode(envelope, bytes);
    const name = majiangMessageName(cmd);
    return { cmd, name, gameNumber, payload: decodeMaJiang(name, serialized), extraLogicData };
  }

  // mockjs/sichuan_opening_notifications.mjs
  var seats = [0, 1, 2, 3];
  var seconds = (milliseconds) => Math.ceil(milliseconds / 1e3);
  var playActions = {
    discard: MaJiangAction.Normal,
    ankan: MaJiangAction.AnGang,
    kakan: MaJiangAction.PengGang,
    hu: MaJiangAction.Hu
  };
  var exchangeTypes = { 1: 2, 2: 3, 3: 1 };
  function frame(name, payload) {
    const cmd = MaJiangMsg[`E${name}`];
    return { name, cmd, payload, bytes: encodeMaJiangEnvelope(cmd, payload) };
  }
  var _session, _context, _status2, _exchanges, _missing, _complete, _SichuanOpeningNotifications_instances, start_fn;
  var SichuanOpeningNotifications = class {
    constructor(session, { gameID, userIds, initialScores, scoreType } = {}) {
      __privateAdd(this, _SichuanOpeningNotifications_instances);
      __privateAdd(this, _session);
      __privateAdd(this, _context);
      __privateAdd(this, _status2, "idle");
      __privateAdd(this, _exchanges, [null, null, null, null]);
      __privateAdd(this, _missing, [null, null, null, null]);
      __privateAdd(this, _complete, false);
      if (!(session instanceof SichuanSession) || session.status !== "idle") throw new TypeError("\u5F00\u5C40\u6295\u5F71\u5FC5\u987B\u5728\u4F1A\u8BDD\u542F\u52A8\u524D\u521B\u5EFA");
      if (typeof gameID !== "string" || !gameID.trim() || gameID.length > 128 || !Array.isArray(userIds) || userIds.length !== 4 || new Set(userIds).size !== 4 || userIds.some((id) => !Number.isSafeInteger(id) || id <= 0) || !Array.isArray(initialScores) || initialScores.length !== 4 || initialScores.some((score2) => !Number.isSafeInteger(score2) || score2 < 0) || !Number.isInteger(scoreType) || scoreType < 0 || scoreType > 2147483647) {
        throw new RangeError("\u65E0\u6548\u7684\u5F00\u5C40\u684C\u9762\u8D44\u6599");
      }
      __privateSet(this, _session, session);
      __privateSet(this, _context, structuredClone({ gameID, userIds, initialScores, scoreType }));
    }
    get complete() {
      return __privateGet(this, _complete);
    }
    read() {
      const view = __privateGet(this, _session).view();
      if (__privateGet(this, _complete) || ["idle", "stopped", "failed", "ended"].includes(view.status)) return [];
      if (view.status === "preparing") {
        if (__privateGet(this, _status2) === "preparing") return [];
        const result = frame("NtfToPrepare", { userInfos: seats.map((seat) => ({ seat, userID: __privateGet(this, _context).userIds[seat] })) });
        __privateSet(this, _status2, "preparing");
        return [result];
      }
      if (__privateGet(this, _status2) === "idle") throw new Error("\u5F00\u5C40\u6295\u5F71\u9057\u6F0F\u51C6\u5907\u901A\u77E5");
      const state = __privateGet(this, _session).snapshot();
      const changedExchanges = seats.filter((seat) => __privateGet(this, _exchanges)[seat] === null && state.exchanges[seat] !== null);
      const changedMissing = seats.filter((seat) => __privateGet(this, _missing)[seat] === null && state.players[seat].missingSuit !== null);
      const starting = __privateGet(this, _status2) === "preparing";
      if (starting && (changedExchanges.length || changedMissing.length) || changedExchanges.length + changedMissing.length > 1 || !["exchange", "missing", "turn"].includes(state.phase) || state.players.some((player) => player.discardCount || player.drawCount || player.melds.length)) {
        throw new Error("\u5F00\u5C40\u6295\u5F71\u9057\u6F0F\u72B6\u6001\u66F4\u65B0\uFF0C\u7981\u6B62\u7528\u5F53\u524D\u624B\u724C\u8865\u9020\u5386\u53F2\u901A\u77E5");
      }
      const frames = [];
      if (starting) {
        for (const seat of seats) frames.push(frame("NtfPrepare", { seat, userInfos: seats.map((entry) => ({ seat: entry })) }));
        frames.push(__privateMethod(this, _SichuanOpeningNotifications_instances, start_fn).call(this, state, view));
      }
      for (const seat of changedExchanges) {
        frames.push(frame("NtfChangeCard", {
          seat,
          cardNum: 3,
          userInfos: seats.map((entry) => ({ seat: entry, cards: entry === seat && entry === view.seat ? state.exchanges[entry] : [] }))
        }));
        if (state.exchanges.every((cards) => cards !== null)) {
          frames.push(frame("NtfChangeCardEnd", { userInfos: seats.map((entry) => ({
            seat: entry,
            // 原34283按数组下标取玩家，再逐张移出/加入手牌；他家用等量背牌维持手牌数。
            cards: entry === view.seat ? state.exchanges[entry] : [0, 0, 0],
            getCards: entry === view.seat ? state.exchanges[(entry - state.exchangeOffset + 4) % 4] : [0, 0, 0],
            dingQueSuggest: entry === view.seat ? chooseSichuanMissingSuit(view.hand) : 0,
            canPlayActions: [],
            chuPai2Timeout: 0
          })) }));
        }
      }
      for (const seat of changedMissing) {
        frames.push(frame("NtfDingQue", {
          seat,
          userInfos: seats.map((entry) => ({
            seat: entry,
            dingQue: entry === seat && entry === view.seat ? state.players[entry].missingSuit : 0
          }))
        }));
        if (state.players.every((player) => player.missingSuit !== null)) {
          frames.push(frame("NtfDingQueEnd", { userInfos: seats.map((entry) => ({
            seat: entry,
            dingQue: state.players[entry].missingSuit,
            canPlayActions: entry === view.seat && state.turn === entry ? [...new Set(view.options.map((option) => playActions[option.type]))] : [],
            chuPai2Timeout: 0
            // 庄家第14张已在开局手牌中；此时不是再次摸牌，不发NtfSendCard。
          })) }));
        }
      }
      __privateSet(this, _status2, view.status);
      __privateSet(this, _exchanges, structuredClone(state.exchanges));
      __privateSet(this, _missing, state.players.map((player) => player.missingSuit));
      __privateSet(this, _complete, state.phase === "turn");
      return frames;
    }
  };
  _session = new WeakMap();
  _context = new WeakMap();
  _status2 = new WeakMap();
  _exchanges = new WeakMap();
  _missing = new WeakMap();
  _complete = new WeakMap();
  _SichuanOpeningNotifications_instances = new WeakSet();
  start_fn = function(state, view) {
    const { gameID, initialScores, scoreType } = __privateGet(this, _context);
    const timeouts = __privateGet(this, _session).timeoutsMs;
    return frame("NtfGameStart", {
      changWind: 0,
      juNum: 0,
      zhuangSeat: state.dealer,
      totalJuNum: 1,
      remainDuiCardNum: view.remaining,
      gameID,
      baseScore: state.rules.baseScore,
      topBei: state.rules.topBei,
      scoreType,
      hasDingQue: true,
      isMingPai: false,
      changeCardRule: state.rules.exchange ? 1 : 0,
      changeCardType: state.rules.exchange ? exchangeTypes[state.exchangeOffset] : 0,
      huanZhangTimeout: seconds(timeouts.exchange),
      dingQueTimeout: seconds(timeouts.missing),
      chuPai1Timeout: seconds(timeouts.turn),
      qiangPaiTimeout: seconds(timeouts.claim),
      // 仅用于发牌演出；不额外消耗引擎随机数或影响牌山。
      touzi1: (state.seed >>> 0) % 6 + 1,
      touzi2: (state.seed >>> 3) % 6 + 1,
      userInfos: seats.map((seat) => ({
        seat,
        score: initialScores[seat],
        handCards: seat === view.seat ? view.hand : Array(view.handCounts[seat]).fill(0),
        changeCardSuggest: seat === view.seat && state.rules.exchange ? chooseSichuanExchange(view.hand) : [],
        dingQueSuggest: seat === view.seat && !state.rules.exchange ? chooseSichuanMissingSuit(view.hand) : 0,
        canPlayActions: [],
        chuPai2Timeout: 0
      }))
    });
  };

  // mockjs/sichuan_turn_notifications.mjs
  var seats2 = [0, 1, 2, 3];
  var turnActions = { discard: MaJiangAction.Normal, ankan: MaJiangAction.AnGang, kakan: MaJiangAction.PengGang, hu: MaJiangAction.Hu };
  var claimActions = { pass: MaJiangAction.Guo, pon: MaJiangAction.Peng, kan: MaJiangAction.MingGang, hu: MaJiangAction.Hu };
  function checkSeat(seat) {
    if (!Number.isInteger(seat) || !seats2.includes(seat)) throw new RangeError("\u65E0\u6548\u7684\u901A\u77E5\u5EA7\u4F4D");
  }
  function checkEvent(event, type) {
    if (!event || event.type !== type || !Number.isSafeInteger(event.index) || event.index < 0) {
      throw new TypeError(`\u9700\u8981\u6709\u6548\u7684\u56DB\u5DDD${type}\u4E8B\u4EF6`);
    }
    sichuanKind(event.tile);
  }
  function actions(types2, mapping) {
    if (!Array.isArray(types2) || new Set(types2).size !== types2.length || types2.some((type) => typeof type !== "string" || !Object.hasOwn(mapping, type))) {
      throw new TypeError("\u65E0\u6548\u7684\u56DB\u5DDD\u4E8B\u4EF6\u52A8\u4F5C\u5019\u9009");
    }
    return types2.map((type) => mapping[type]);
  }
  function frame2(eventIndex, name, payload) {
    const cmd = MaJiangMsg[`E${name}`];
    return { eventIndex, name, cmd, payload, bytes: encodeMaJiangEnvelope(cmd, payload) };
  }
  function buildSichuanDrawNotification(event, humanSeat) {
    checkEvent(event, "draw");
    checkSeat(event.seat);
    checkSeat(humanSeat);
    if (!["draw", "kong"].includes(event.source) || !Number.isInteger(event.remaining) || event.remaining < 0 || event.remaining > 54) throw new RangeError("\u65E0\u6548\u7684\u56DB\u5DDD\u6478\u724C\u4E8B\u4EF6");
    const canPlayActions = actions(event.actionTypes, turnActions);
    if (!event.actionTypes.includes("discard")) throw new TypeError("\u6478\u724C\u4E8B\u4EF6\u7F3A\u5C11\u51FA\u724C\u5019\u9009");
    return frame2(event.index, "NtfSendCard", {
      seat: event.seat,
      remainDuiCardNum: event.remaining,
      // 原34255按数组下标处理四座位，仅为NtfSendCard.seat增加一张牌。
      userInfos: seats2.map((seat) => ({
        seat,
        card: seat === event.seat && seat === humanSeat ? event.tile : 0,
        canPlayActions: seat === event.seat && seat === humanSeat ? [...canPlayActions] : [],
        tingInfos: [],
        chuPai2Timeout: 0,
        isDianGangHuaDianPao: false
      }))
      // chuPai1Timeout已由开局通知给出；chuPai2Timeout为附加时间，不能再填一次基础时间。
    });
  }
  function buildSichuanDiscardNotification(event, claimWindow, humanSeat) {
    checkEvent(event, "discard");
    checkEvent(claimWindow, "claimWindow");
    checkSeat(event.seat);
    checkSeat(humanSeat);
    if (typeof event.isMoQie !== "boolean" || claimWindow.kind !== "discard" || claimWindow.index !== event.index + 1 || claimWindow.from !== event.seat || claimWindow.tile !== event.tile || !Array.isArray(claimWindow.actionTypes) || claimWindow.actionTypes.length !== 4) throw new TypeError("\u51FA\u724C\u4E8B\u4EF6\u4E0E\u62A2\u724C\u7A97\u53E3\u4E0D\u5339\u914D");
    const candidates = claimWindow.actionTypes.map((types2) => {
      const result = actions(types2, claimActions);
      if (types2.length && (!types2.includes("pass") || types2.length < 2)) throw new TypeError("\u65E0\u6548\u7684\u62A2\u724C\u7A97\u53E3\u5019\u9009");
      return result;
    });
    if (candidates[event.seat].length) throw new TypeError("\u51FA\u724C\u8005\u4E0D\u80FD\u62A2\u81EA\u5DF1\u7684\u724C");
    return frame2(event.index, "NtfPlayCard", {
      seat: event.seat,
      card: event.tile,
      action: MaJiangAction.Normal,
      isMoQie: event.isMoQie,
      // 原34272同样按数组下标更新动作，并从开局qiangPaiTimeout建立基础截止时间。
      userInfos: seats2.map((seat) => ({
        seat,
        canQiangActions: seat === humanSeat ? [...candidates[seat]] : [],
        canGangNoNumCardsAfterRiichiHu: []
      })),
      moneyLogs: [],
      isFinish: false
      // 可胡只是候选，不是已胡；不得在有人响应前标记完成或预扣分数。
    });
  }

  // mockjs/sichuan_notifications.mjs
  var seats3 = [0, 1, 2, 3];
  var turnActions2 = { discard: MaJiangAction.Normal, hu: MaJiangAction.Hu, ankan: MaJiangAction.AnGang, kakan: MaJiangAction.PengGang };
  var claimActions2 = { pass: MaJiangAction.Guo, hu: MaJiangAction.Hu, pon: MaJiangAction.Peng, kan: MaJiangAction.MingGang };
  var kongTypes = { exposed: 1, added: 2, concealed: 3 };
  var settlementTypes = { flower: 8, ready: 9, refund: 10, callTransfer: 11 };
  var clone2 = (value) => structuredClone(value);
  function frame3(event, name, payload) {
    const cmd = MaJiangMsg[`E${name}`];
    return { eventIndex: event.index, name, cmd, payload, bytes: encodeMaJiangEnvelope(cmd, payload) };
  }
  function add(a, b) {
    const result = a + b;
    if (!Number.isSafeInteger(result)) throw new RangeError("\u56DB\u5DDD\u663E\u793A\u79EF\u5206\u8D85\u51FA\u5B89\u5168\u8303\u56F4");
    return result;
  }
  function moneyLog(type, delta, scores, initialScores, baseScore, score2 = null) {
    if (delta.length !== 4 || scores.length !== 4 || delta.reduce((sum, value) => sum + value, 0) !== 0) {
      throw new Error("\u56DB\u5DDD\u79EF\u5206\u65E5\u5FD7\u4E0D\u5B88\u6052");
    }
    return { type, userInfos: seats3.map((seat) => ({
      seat,
      money: delta[seat],
      finalMoney: add(initialScores[seat], scores[seat]),
      bei: delta[seat] / baseScore,
      fengDing: delta[seat] !== 0 && Boolean(score2?.capped),
      yiTypes: delta[seat] !== 0 && score2 ? score2.yaku.map((item) => item.yiType) : [],
      noMoney: false,
      sysMoney: 0
    })) };
  }
  function transferDelta(transfer) {
    const delta = [0, 0, 0, 0];
    delta[transfer.from] = -transfer.amount;
    delta[transfer.to] = transfer.amount;
    return delta;
  }
  function endUsers(humanSeat, caller = null, event = null) {
    return seats3.map((seat) => ({
      seat,
      tingInfos: [],
      canPlayActions: seat === humanSeat && seat === caller ? event.actionTypes.map((type) => turnActions2[type]) : [],
      cantPlays: seat === humanSeat && seat === caller ? [...event.cantPlays] : [],
      chuPai2Timeout: 0,
      canGangNoNumCardsAfterRiichiHu: []
    }));
  }
  function claimEnd(event, humanSeat, {
    winners = [],
    action: action2 = MaJiangAction.Guo,
    otherCards = [],
    moneyLogs = [],
    caller = null,
    isFinish = action2 === MaJiangAction.Hu
  } = {}) {
    return frame3(event, "NtfQiangCardEnd", {
      seats: winners,
      action: action2,
      otherCards,
      userInfos: endUsers(humanSeat, caller, event),
      moneyLogs,
      isFinish
    });
  }
  function play(event, humanSeat, { seat, card, action: action2, moneyLogs = [], isFinish = false, canQiang = [] }) {
    return frame3(event, "NtfPlayCard", {
      seat,
      card,
      action: action2,
      isMoQie: false,
      moneyLogs,
      isFinish,
      userInfos: seats3.map((entry) => ({
        seat: entry,
        canQiangActions: entry === humanSeat ? [...canQiang] : [],
        canGangNoNumCardsAfterRiichiHu: []
      }))
    });
  }
  var _session2, _opening, _initialScores, _humanSeat2, _cursor, _pending, _scores, _ended;
  var SichuanNotifications = class {
    constructor(session, context) {
      __privateAdd(this, _session2);
      __privateAdd(this, _opening);
      __privateAdd(this, _initialScores);
      __privateAdd(this, _humanSeat2);
      __privateAdd(this, _cursor, null);
      __privateAdd(this, _pending, null);
      __privateAdd(this, _scores, [0, 0, 0, 0]);
      __privateAdd(this, _ended, false);
      __privateSet(this, _opening, new SichuanOpeningNotifications(session, context));
      __privateSet(this, _session2, session);
      __privateSet(this, _initialScores, [...context.initialScores]);
      __privateSet(this, _humanSeat2, session.view().seat);
    }
    get complete() {
      return __privateGet(this, _ended);
    }
    read() {
      const status = __privateGet(this, _session2).status;
      if (__privateGet(this, _ended) || ["idle", "stopped", "failed"].includes(status)) return [];
      if (!__privateGet(this, _opening).complete) {
        const frames2 = __privateGet(this, _opening).read();
        if (__privateGet(this, _opening).complete) __privateSet(this, _cursor, __privateGet(this, _session2).snapshot().events.length);
        return frames2;
      }
      const state = __privateGet(this, _session2).snapshot();
      const frames = [];
      let pending = clone2(__privateGet(this, _pending));
      let scores = [...__privateGet(this, _scores)];
      let ended = false;
      const humanSeat = __privateGet(this, _humanSeat2);
      for (let index = __privateGet(this, _cursor); index < state.events.length; index += 1) {
        const event = state.events[index];
        if (event.index !== index || ended) throw new Error("\u56DB\u5DDD\u4E8B\u4EF6\u7D22\u5F15\u6216\u7EC8\u5C40\u987A\u5E8F\u9519\u8BEF");
        switch (event.type) {
          case "discard": {
            if (pending) throw new Error("\u62A2\u724C\u88C1\u51B3\u5C1A\u672A\u5B8C\u6210\uFF0C\u4E0D\u80FD\u7EE7\u7EED\u51FA\u724C");
            pending = state.events[++index];
            frames.push(buildSichuanDiscardNotification(event, pending, humanSeat));
            break;
          }
          case "claimWindow": {
            if (pending || event.kind !== "added") throw new Error("\u7F3A\u5C11\u56DB\u5DDD\u51FA\u724C\u4E8B\u4EF6");
            if (event.actionTypes.some((types2) => types2.length)) {
              const own = event.actionTypes[humanSeat];
              if (own.length && (!own.includes("pass") || own.some((type) => !["pass", "hu"].includes(type)))) {
                throw new Error("\u62A2\u8865\u6760\u53EA\u80FD\u9009\u62E9\u80E1\u6216\u8FC7");
              }
              frames.push(play(event, humanSeat, {
                seat: event.from,
                card: event.tile,
                action: MaJiangAction.PengGang,
                canQiang: own.map((type) => claimActions2[type])
              }));
              pending = { ...event, announced: true };
            } else pending = event;
            break;
          }
          case "claimResponse": {
            if (!pending || !pending.actionTypes[event.seat]?.includes(event.action)) throw new Error("\u7F3A\u5C11\u6709\u6548\u7684\u62A2\u724C\u7A97\u53E3");
            frames.push(frame3(event, "NtfQiangCard", {
              seat: event.seat,
              action: claimActions2[event.action],
              otherCards: event.seat === humanSeat ? [...event.tiles] : [],
              userInfos: seats3.map((seat) => ({ seat }))
            }));
            break;
          }
          case "claimPassed": {
            if (!pending || pending.kind !== "discard" || pending.from !== event.from || pending.tile !== event.tile) {
              throw new Error("\u8FC7\u724C\u88C1\u51B3\u4E0E\u62A2\u724C\u7A97\u53E3\u4E0D\u5339\u914D");
            }
            frames.push(claimEnd(event, humanSeat));
            pending = null;
            break;
          }
          case "pon": {
            if (!pending || pending.kind !== "discard" || pending.from !== event.from || pending.tile !== event.tile) {
              throw new Error("\u78B0\u724C\u88C1\u51B3\u4E0E\u62A2\u724C\u7A97\u53E3\u4E0D\u5339\u914D");
            }
            frames.push(claimEnd(event, humanSeat, {
              winners: [event.seat],
              action: MaJiangAction.Peng,
              otherCards: event.tiles.filter((tile) => tile !== event.tile),
              caller: event.seat
            }));
            pending = null;
            break;
          }
          case "kong": {
            const logs = event.delta.some(Boolean) ? [moneyLog(kongTypes[event.kind], event.delta, event.scores, __privateGet(this, _initialScores), event.baseScore)] : [];
            if (event.kind === "exposed") {
              if (!pending || pending.kind !== "discard" || event.from !== pending.from || !event.tiles.includes(pending.tile)) {
                throw new Error("\u660E\u6760\u88C1\u51B3\u4E0E\u62A2\u724C\u7A97\u53E3\u4E0D\u5339\u914D");
              }
              frames.push(claimEnd(event, humanSeat, {
                winners: [event.seat],
                action: MaJiangAction.MingGang,
                otherCards: event.tiles.filter((tile) => tile !== pending.tile),
                moneyLogs: logs
              }));
            } else if (event.kind === "added" && pending?.announced) {
              if (pending.from !== event.seat || event.tiles[0] !== pending.tile) throw new Error("\u8865\u6760\u88C1\u51B3\u4E0E\u62A2\u6760\u7A97\u53E3\u4E0D\u5339\u914D");
              frames.push(claimEnd(event, humanSeat, { moneyLogs: logs }));
            } else if (event.kind === "concealed" && pending === null || event.kind === "added" && pending?.kind === "added") {
              frames.push(play(event, humanSeat, {
                seat: event.seat,
                card: event.kind === "concealed" && event.seat !== humanSeat ? 0 : event.tiles[0],
                action: event.kind === "concealed" ? MaJiangAction.AnGang : MaJiangAction.PengGang,
                moneyLogs: logs
              }));
              frames.push(claimEnd(event, humanSeat));
            } else throw new Error("\u65E0\u6548\u7684\u56DB\u5DDD\u6760\u724C\u4E8B\u4EF6");
            scores = [...event.scores];
            pending = null;
            break;
          }
          case "win": {
            const tsumo = event.winType === "tsumo";
            const isFinish = state.rules.gameType === 5022;
            if (tsumo ? pending !== null : pending === null) throw new Error("\u80E1\u724C\u88C1\u51B3\u4E0E\u62A2\u724C\u7A97\u53E3\u4E0D\u5339\u914D");
            const logs = event.results.map((result) => moneyLog(
              tsumo ? 4 : 5,
              result.delta,
              result.scores,
              __privateGet(this, _initialScores),
              event.baseScore,
              result.score
            ));
            scores = [...event.results.at(-1).scores];
            if (event.callTransfer) {
              logs.push(moneyLog(
                11,
                transferDelta(event.callTransfer),
                event.callTransfer.scores,
                __privateGet(this, _initialScores),
                event.baseScore
              ));
              scores = [...event.callTransfer.scores];
            }
            if (tsumo) {
              const result = event.results[0];
              frames.push(play(event, humanSeat, {
                seat: result.seat,
                card: result.tile,
                action: MaJiangAction.Hu,
                moneyLogs: logs,
                isFinish
              }));
            } else frames.push(claimEnd(event, humanSeat, {
              winners: event.results.map((result) => result.seat),
              action: MaJiangAction.Hu,
              moneyLogs: logs,
              isFinish
            }));
            pending = null;
            break;
          }
          case "draw": {
            if (pending) throw new Error("\u62A2\u724C\u88C1\u51B3\u5C1A\u672A\u5B8C\u6210\uFF0C\u4E0D\u80FD\u7EE7\u7EED\u6478\u724C");
            frames.push(buildSichuanDrawNotification(event, humanSeat));
            break;
          }
          case "end": {
            if (pending || state.phase !== "ended" || index !== state.events.length - 1) throw new Error("\u7F3A\u5C11\u5B8C\u6574\u7684\u56DB\u5DDD\u7EC8\u5C40\u72B6\u6001");
            const logs = [];
            for (const transfer of event.settlement?.transfers ?? []) {
              const delta = transferDelta(transfer);
              scores = scores.map((score2, seat) => add(score2, delta[seat]));
              logs.push(moneyLog(settlementTypes[transfer.reason], delta, scores, __privateGet(this, _initialScores), state.rules.baseScore));
            }
            if (scores.some((value, seat) => value !== event.scores[seat])) throw new Error("\u56DB\u5DDD\u4E0B\u884C\u7ED3\u7B97\u4E0E\u6743\u5A01\u5206\u6570\u4E0D\u7B26");
            const lastWin = event.reason === "threeWinners" ? state.events[index - 1] : null;
            if (lastWin && lastWin.type !== "win") throw new Error("\u4E09\u5BB6\u80E1\u724C\u7EC8\u5C40\u7F3A\u5C11\u6700\u540E\u88C1\u51B3");
            const latest = lastWin?.results[0];
            frames.push(frame3(event, "NtfGameStop", {
              huSeats: lastWin?.results.map((result) => result.seat) ?? [],
              huCardSeat: latest ? latest.from ?? latest.seat : 0,
              huCard: latest?.tile ?? 0,
              isFinal: true,
              stopType: 0,
              moneyLogs: logs,
              userInfos: state.players.map((player, seat) => ({
                seat,
                score: add(__privateGet(this, _initialScores)[seat], scores[seat]),
                changeScore: scores[seat],
                totalBei: scores[seat] / state.rules.baseScore,
                // 原34272已将自摸张移出暗手并单独展示；终局不能再次放回手牌区。
                handCards: player.hand.filter((tile) => !(player.win?.from === null && tile === player.win.tile)),
                isFinish: player.won && state.rules.gameType === 5022,
                doorCardsInfos: player.melds.map((meld) => ({
                  cards: [...meld.tiles],
                  action: meld.type === "pon" ? MaJiangAction.Peng : meld.type === "ankan" ? MaJiangAction.AnGang : meld.kongKind === "added" ? MaJiangAction.PengGang : MaJiangAction.MingGang,
                  qiangSeat: meld.from ?? seat
                })),
                huInfos: player.wins.map((record) => ({
                  huCard: record.tile,
                  huType: record.from === null ? 1 : record.score.winType === "robKong" ? 3 : 2
                }))
              }))
            }));
            ended = true;
            break;
          }
          default:
            throw new Error(`\u672A\u9002\u914D\u7684\u56DB\u5DDD\u4E8B\u4EF6\uFF1A${event.type}`);
        }
      }
      __privateSet(this, _cursor, state.events.length);
      __privateSet(this, _pending, pending);
      __privateSet(this, _scores, scores);
      __privateSet(this, _ended, ended);
      return frames;
    }
  };
  _session2 = new WeakMap();
  _opening = new WeakMap();
  _initialScores = new WeakMap();
  _humanSeat2 = new WeakMap();
  _cursor = new WeakMap();
  _pending = new WeakMap();
  _scores = new WeakMap();
  _ended = new WeakMap();

  // mockjs/sichuan_requests.mjs
  var requests = /* @__PURE__ */ new Map([
    ["ReqPrepare", MaJiangMsg.ERspPrepare],
    ["ReqPlayCard", MaJiangMsg.ERspPlayCard],
    ["ReqQiangCard", MaJiangMsg.ERspQiangCard],
    ["ReqChangeCard", MaJiangMsg.ERspChangeCard],
    ["ReqDingQue", MaJiangMsg.ERspDingQue],
    ["ReqPoChanChange", MaJiangMsg.ERspPoChanChange],
    ["ReqExit", MaJiangMsg.ERspExit],
    ["ReqTuoGuanChange", MaJiangMsg.ERspTuoGuanChange],
    ["ReqSetInternalState", MaJiangMsg.ERspSetInternalState]
  ]);
  var sameTiles = (a, b) => a.length === b.length && new Set(a).size === a.length && a.every((tile) => b.includes(tile));
  function selectAction(view, name, payload) {
    const options = view.options;
    const find = (type, tiles) => options.find((option) => option.type === type && sameTiles(tiles, option.tiles));
    if (name === "ReqChangeCard") {
      return {
        chosen: view.phase === "exchange" && find("exchange", payload.cards),
        result: MaJiangResult.Fail_InvalidChangeCards
      };
    }
    if (name === "ReqDingQue") {
      return {
        chosen: view.phase === "missing" && find("missing", [payload.dingQue]),
        result: MaJiangResult.Fail_InvalidDingQue
      };
    }
    if (name === "ReqQiangCard") {
      if (view.phase !== "claim") return { result: MaJiangResult.Fail_InvalidSequence };
      const type = { [MaJiangAction.Guo]: "pass", [MaJiangAction.Peng]: "pon", [MaJiangAction.MingGang]: "kan", [MaJiangAction.Hu]: "hu" }[payload.action];
      if (!type || !options.some((option) => option.type === type)) return { result: MaJiangResult.Fail_ActionNotInCanQiangActions };
      return { chosen: find(type, payload.otherCards), result: MaJiangResult.Fail_InvalidOtherCards };
    }
    if (name === "ReqPlayCard") {
      if (view.phase !== "turn") return { result: MaJiangResult.Fail_InvalidSequence };
      const type = { [MaJiangAction.Normal]: "discard", [MaJiangAction.PengGang]: "kakan", [MaJiangAction.AnGang]: "ankan", [MaJiangAction.Hu]: "hu" }[payload.action];
      if (!type || !options.some((option) => option.type === type)) return { result: MaJiangResult.Fail_ActionNotInCanPlayActions };
      if (type === "hu") {
        return {
          chosen: (payload.card === 0 || view.hand.includes(payload.card)) && find("hu", []),
          result: MaJiangResult.Fail_CardNotInHand
        };
      }
      if (!view.hand.includes(payload.card)) return { result: MaJiangResult.Fail_CardNotInHand };
      const chosen = options.find((option) => option.type === type && option.tiles.includes(payload.card));
      return { chosen, result: type === "discard" ? MaJiangResult.Fail_CardInCantPlays : MaJiangResult.Fail_CardNotMatchAction };
    }
    return { result: MaJiangResult.Fail_InvalidParam };
  }
  function handleSichuanRequest(session, bytes, { connectionId, windowId } = {}) {
    let request;
    try {
      request = decodeMaJiangEnvelope(bytes);
    } catch {
      return { ok: false, error: "malformedRequest", response: null };
    }
    const responseCmd = requests.get(request.name);
    if (responseCmd === void 0) return { ok: false, error: "notARequest", response: null };
    const reply = (result, error = null) => ({
      ok: result === MaJiangResult.Succ,
      error,
      response: encodeMaJiangEnvelope(responseCmd, { result })
    });
    if (request.extraLogicData.length) return reply(MaJiangResult.Fail_InvalidParam, "unsupportedExtraLogic");
    const view = session.view();
    if (!view.connected || connectionId !== view.connectionId || !["preparing", "playing"].includes(view.status)) return reply(MaJiangResult.Fail_InvalidSequence, "inactiveConnection");
    if (request.name === "ReqPrepare") {
      const outcome2 = session.prepare(connectionId);
      return reply(outcome2.ok ? MaJiangResult.Succ : MaJiangResult.Fail_InvalidSequence, outcome2.error);
    }
    if (!["ReqPlayCard", "ReqQiangCard", "ReqChangeCard", "ReqDingQue"].includes(request.name)) {
      return reply(MaJiangResult.Fail_InvalidParam, "unsupportedRequest");
    }
    if (view.status !== "playing" || !Number.isSafeInteger(windowId) || windowId !== view.windowId) {
      return reply(MaJiangResult.Fail_InvalidSequence, "staleWindow");
    }
    const selection = selectAction(view, request.name, request.payload);
    if (!selection.chosen) return reply(selection.result, "illegalAction");
    const outcome = session.submit(structuredClone(selection.chosen), { connectionId, windowId });
    return reply(outcome.ok ? MaJiangResult.Succ : MaJiangResult.Fail_InvalidSequence, outcome.error);
  }

  // mockjs/sichuan_table.mjs
  var SICHUAN_PLAYABLE_GAME_TYPES = Object.freeze([5021, 5022]);
  var SCORE_TYPE_MONEY = 1;
  var REPLY_CACHE = 64;
  function sichuanRoom(gameType, roomId) {
    const game = SICHUAN_CATALOG.games[String(gameType)];
    if (!game) return null;
    const room = game.rooms.find((item) => item.id === roomId);
    return room ? structuredClone(room) : null;
  }
  function sichuanRoomRules(room) {
    const exchange = !room.ruleTags.includes(1);
    return { gameType: room.gameType, exchange, topBei: room.topBei === 128 && exchange ? 128 : 256, baseScore: room.moneyBase };
  }
  var _session3, _notifications, _onFrame, _onSettle, _log, _replies, _buffer, _settled, _failed, _exited, _SichuanTable_instances, flush_fn, fail_fn, settle_fn, dispatch_fn;
  var SichuanTable = class {
    constructor({
      room,
      seed,
      userIds,
      initialScores,
      gameID,
      aiDelayMs = 350,
      timeoutsMs = {},
      clock,
      onFrame,
      onSettle = () => {
      },
      log = () => {
      }
    }) {
      __privateAdd(this, _SichuanTable_instances);
      __privateAdd(this, _session3);
      __privateAdd(this, _notifications);
      __privateAdd(this, _onFrame);
      __privateAdd(this, _onSettle);
      __privateAdd(this, _log);
      __privateAdd(this, _replies, /* @__PURE__ */ new Map());
      __privateAdd(this, _buffer, null);
      __privateAdd(this, _settled, false);
      __privateAdd(this, _failed, false);
      __privateAdd(this, _exited, false);
      if (!SICHUAN_PLAYABLE_GAME_TYPES.includes(room?.gameType)) throw new RangeError("\u5C1A\u672A\u5B9E\u73B0\u7684\u56DB\u5DDD\u73A9\u6CD5");
      if (typeof onFrame !== "function" || typeof onSettle !== "function") throw new TypeError("\u65E0\u6548\u7684\u56DB\u5DDD\u724C\u684C\u56DE\u8C03");
      __privateSet(this, _onFrame, onFrame);
      __privateSet(this, _onSettle, onSettle);
      __privateSet(this, _log, log);
      this.room = structuredClone(room);
      __privateSet(this, _session3, new SichuanSession({
        seed: seed >>> 0,
        ...sichuanRoomRules(room),
        aiDelayMs,
        timeoutsMs,
        clock,
        onUpdate: () => __privateMethod(this, _SichuanTable_instances, flush_fn).call(this),
        onFinish: (result) => __privateMethod(this, _SichuanTable_instances, settle_fn).call(this, result.scores[0], "finish"),
        onError: (error) => __privateMethod(this, _SichuanTable_instances, fail_fn).call(this, error)
      }));
      __privateSet(this, _notifications, new SichuanNotifications(
        __privateGet(this, _session3),
        { gameID, userIds, initialScores, scoreType: SCORE_TYPE_MONEY }
      ));
    }
    get matchOver() {
      return __privateGet(this, _settled) || __privateGet(this, _failed) || __privateGet(this, _session3).matchOver || __privateGet(this, _session3).stopped;
    }
    get session() {
      return __privateGet(this, _session3);
    }
    start() {
      return __privateGet(this, _session3).start();
    }
    /** 上行入口。seq 来自外层可信请求序号；同号同包返回缓存，异包拒绝。 */
    handleClient(bytes, seq = 0) {
      const key = seq ? `${__privateGet(this, _session3).view().connectionId}:${seq}` : null;
      const signature = Array.from(bytes).join(",");
      if (key && __privateGet(this, _replies).has(key)) {
        const cached = __privateGet(this, _replies).get(key);
        return cached.signature === signature ? { response: cached.response, frames: [] } : { response: null, frames: [] };
      }
      __privateSet(this, _buffer, []);
      let outcome;
      try {
        outcome = __privateMethod(this, _SichuanTable_instances, dispatch_fn).call(this, bytes);
      } finally {
        var frames = __privateGet(this, _buffer);
        __privateSet(this, _buffer, null);
      }
      if (key && outcome.response) {
        __privateGet(this, _replies).set(key, { signature, response: outcome.response });
        if (__privateGet(this, _replies).size > REPLY_CACHE) __privateGet(this, _replies).delete(__privateGet(this, _replies).keys().next().value);
      }
      if (outcome.error) __privateGet(this, _log).call(this, `[sichuan] \u8BF7\u6C42\u88AB\u62D2\u7EDD\uFF1A${outcome.error}`);
      return { response: outcome.response, frames: frames.map((frame4) => [frame4.cmd, frame4.bytes]) };
    }
    get exited() {
      return __privateGet(this, _exited);
    }
    /** 断线：真人席交给AI；会话继续推进，事件仍由外层缓存。 */
    detach() {
      const view = __privateGet(this, _session3).view();
      return __privateGet(this, _session3).detach(view.connectionId);
    }
    attach() {
      __privateGet(this, _replies).clear();
      return __privateGet(this, _session3).attach();
    }
    /**
     * 离桌：胡牌后或终局结算本人冻结分数；未胡就离桌按当前已发生的即时收付结算，
     * 不再继续承担后续支付（本地单机约定，避免未完成牌局吞掉已发生的输赢）。
     */
    leave() {
      if (!__privateGet(this, _settled) && !__privateGet(this, _failed) && __privateGet(this, _session3).status !== "idle") {
        const state = __privateGet(this, _session3).snapshot();
        __privateMethod(this, _SichuanTable_instances, settle_fn).call(this, state.scores[__privateGet(this, _session3).view().seat], "leave");
      }
      __privateGet(this, _session3).stop();
    }
    stop() {
      __privateGet(this, _session3).stop();
    }
  };
  _session3 = new WeakMap();
  _notifications = new WeakMap();
  _onFrame = new WeakMap();
  _onSettle = new WeakMap();
  _log = new WeakMap();
  _replies = new WeakMap();
  _buffer = new WeakMap();
  _settled = new WeakMap();
  _failed = new WeakMap();
  _exited = new WeakMap();
  _SichuanTable_instances = new WeakSet();
  flush_fn = function() {
    if (__privateGet(this, _failed)) return;
    let frames;
    try {
      frames = __privateGet(this, _notifications).read();
    } catch (error) {
      __privateMethod(this, _SichuanTable_instances, fail_fn).call(this, error);
      return;
    }
    for (const frame4 of frames) {
      if (__privateGet(this, _buffer)) __privateGet(this, _buffer).push(frame4);
      else __privateGet(this, _onFrame).call(this, frame4.cmd, frame4.bytes);
    }
  };
  fail_fn = function(error) {
    if (__privateGet(this, _failed)) return;
    __privateSet(this, _failed, true);
    __privateGet(this, _log).call(this, `[sichuan] \u724C\u5C40\u5F02\u5E38\u7EC8\u6B62\uFF1A${error?.message ?? error}`);
    __privateGet(this, _session3).stop();
  };
  settle_fn = function(delta, reason) {
    if (__privateGet(this, _settled) || __privateGet(this, _failed)) return;
    __privateSet(this, _settled, true);
    __privateGet(this, _onSettle).call(this, { delta, reason, room: this.room, result: __privateGet(this, _session3).result });
  };
  dispatch_fn = function(bytes) {
    let request;
    try {
      request = decodeMaJiangEnvelope(bytes);
    } catch {
      return { error: "malformedRequest", response: null };
    }
    const view = __privateGet(this, _session3).view();
    const reply = (cmd, result, error = null, extra = []) => ({
      error,
      response: encodeMaJiangEnvelope(cmd, { result }),
      extra
    });
    if (request.name === "ReqTuoGuanChange") {
      if (request.extraLogicData.length) return reply(MaJiangMsg.ERspTuoGuanChange, MaJiangResult.Fail_InvalidParam, "unsupportedExtraLogic");
      const enabled = request.payload.tuoGuanStatus !== 0;
      const outcome = __privateGet(this, _session3).setAutoplay(enabled, view.connectionId);
      if (!outcome.ok) return reply(MaJiangMsg.ERspTuoGuanChange, MaJiangResult.Fail_InvalidSequence, outcome.error);
      __privateGet(this, _buffer).push({ cmd: MaJiangMsg.ENtfTuoGuanChange, bytes: encodeMaJiangEnvelope(
        MaJiangMsg.ENtfTuoGuanChange,
        { seat: view.seat, tuoGuanStatus: enabled ? 1 : 0, userInfos: [] }
      ) });
      return reply(MaJiangMsg.ERspTuoGuanChange, MaJiangResult.Succ);
    }
    if (request.name === "ReqExit") {
      const state = __privateGet(this, _session3).snapshot();
      const frozen = state.rules.gameType === 5022 && state.players[view.seat].won;
      if (request.extraLogicData.length || !(frozen || __privateGet(this, _session3).matchOver)) {
        return reply(MaJiangMsg.ERspExit, MaJiangResult.Fail_InvalidSequence, "exitBeforeWin");
      }
      __privateSet(this, _exited, true);
      __privateGet(this, _buffer).push({ cmd: MaJiangMsg.ENtfExit, bytes: encodeMaJiangEnvelope(MaJiangMsg.ENtfExit, { seat: view.seat, userInfos: [] }) });
      __privateMethod(this, _SichuanTable_instances, settle_fn).call(this, state.scores[view.seat], "exit");
      return reply(MaJiangMsg.ERspExit, MaJiangResult.Succ);
    }
    return handleSichuanRequest(__privateGet(this, _session3), bytes, { connectionId: view.connectionId, windowId: view.windowId });
  };

  // mockjs/browser_entry.mjs
  var MSG_NAME = {
    1: "ReqPrepare",
    2: "RspPrepare",
    3: "ReqPlayCard",
    4: "RspPlayCard",
    5: "ReqQiangCard",
    6: "RspQiangCard",
    7: "ReqSetInternalState",
    8: "RspSetInternalState",
    9: "ReqCloseOfflineTip",
    10: "RspCloseOfflineTip",
    11: "ReqClickUI",
    12: "RspClickUI",
    1001: "NtfToPrepare",
    1002: "NtfPrepare",
    1003: "NtfGameStart",
    1004: "NtfSendCard",
    1005: "NtfPlayCard",
    1006: "NtfQiangCard",
    1007: "NtfQiangCardEnd",
    1008: "NtfGameStop",
    1009: "NtfOfflineToolTip"
  };
  var RiichiSession = class {
    constructor(opts = {}) {
      this.opts = {
        players: opts.players != null ? opts.players : 4,
        akaCount: opts.akaCount != null ? opts.akaCount : 1,
        startScore: opts.startScore != null ? opts.startScore : opts.players === 3 ? 35e3 : 25e3,
        matchLength: opts.matchLength === "hanchan" ? "hanchan" : "east",
        maxHands: opts.maxHands != null ? opts.maxHands : opts.matchLength === "hanchan" ? 64 : 32,
        // AI 思考延迟倍率。0 = 瞬间（自测用），1 = 正常观感
        speed: opts.speed != null ? opts.speed : 1,
        seed: opts.seed,
        baseTime: opts.baseTime != null ? opts.baseTime : 5,
        extraTime: opts.extraTime != null ? opts.extraTime : 20,
        internalState: { ...opts.internalState || {} },
        autoHuman: opts.autoHuman != null ? opts.autoHuman : false,
        // 座位 -> 真实 userID，必须与 20408/20014 下发的牌桌 uid 完全一致
        uids: opts.uids || null
      };
      this.onFrame = opts.onFrame || (() => {
      });
      this.onFinish = opts.onFinish || (() => {
      });
      this.onFinalResult = opts.onFinalResult || (() => null);
      this.onSettingsChange = opts.onSettingsChange || (() => {
      });
      this.log = opts.log || (() => {
      });
      this.clientInternalState = {};
      this.engine = null;
      this.stopped = false;
      this.matchOver = false;
    }
    /** 新连接尚未同步自动操作开关，不得继承旧页面的授权；不改存档或计时。 */
    resetClientSettings() {
      this.clientInternalState = {};
      if (this.engine) this.engine.setInternalState({ 1: false, 2: false, 3: false, 4: false, 5: false });
    }
    /** 编码并回推一个服务端事件 */
    send(ev, payload) {
      if (this.stopped) return;
      const name = MSG_NAME[ev];
      if (!name) {
        this.log("[riichi] \u672A\u77E5\u4E8B\u4EF6\u53F7 " + ev);
        return;
      }
      let bytes;
      try {
        bytes = encodeMsg(name, payload);
      } catch (e) {
        this.log("[riichi] \u7F16\u7801\u5931\u8D25 " + name + ": " + e.message);
        return;
      }
      this.onFrame(ev, bytes);
    }
    /** 惰性创建引擎。一场（东风战）打完 = 本会话结束：引擎停、matchOver 置位，
     *  之后【绝不】在同一会话里重建引擎——新一场必须由客户端重新走 20403 匹配，
     *  server.js 的 20403 handler 会 stop 旧 session 并 new 一个新的 RiichiSession。 */
    ensureEngine() {
      if (this.matchOver) return null;
      if (this.engine) return this.engine;
      const o = this.opts;
      const seed = o.seed != null ? o.seed : Math.random() * 2147483647 | 0;
      const eng = new GameEngine({
        players: o.players,
        akaCount: o.akaCount,
        startScore: o.startScore,
        matchLength: o.matchLength,
        maxHands: o.maxHands,
        speed: o.speed,
        seed,
        baseTime: o.baseTime,
        extraTime: o.extraTime,
        internalState: this.clientInternalState,
        uids: o.uids,
        autoHuman: o.autoHuman,
        onFinalResult: (scores, engine) => this.onFinalResult(scores, engine),
        // false=0号位真人，true=AI代打（测试用）
        emit: (ev, payload) => this.send(ev, payload),
        onFinish: (scores) => {
          this.matchOver = true;
          this.onFinish(scores.slice(), eng);
          this.log("[riichi] \u7EC8\u5C40\uFF0C\u5F15\u64CE\u505C\u6B62\uFF1B\u7B49\u5BA2\u6237\u7AEF 20102 \u6536\u573A\u6216 20403 \u91CD\u65B0\u5339\u914D");
        }
      });
      this.engine = eng;
      this.log("[riichi] \u65B0\u5BF9\u5C40 players=" + o.players + " seed=" + seed + " maxHands=" + o.maxHands);
      eng.start().catch((e) => this.log("[riichi] \u5F15\u64CE\u5F02\u5E38: " + (e && e.stack || e)));
      return eng;
    }
    /** 处理一条客户端上行的内层消息 */
    handleClient(msgType, innerBytes) {
      if (this.matchOver) {
        if (!this._mutedLogged) {
          this._mutedLogged = true;
          this.log("[riichi] \u7EC8\u5C40\u540E\u5FFD\u7565\u5BA2\u6237\u7AEF\u4E0A\u884C\uFF08\u5BF9\u9F50\u771F\u5B9E\u670D\uFF1A\u96F6\u54CD\u5E94\uFF09\uFF0C\u7B49 20102/20403");
        }
        return;
      }
      const name = MSG_NAME[msgType];
      let payload = {};
      if (name && innerBytes && innerBytes.length) {
        try {
          payload = decodeMsg(name, innerBytes);
        } catch (e) {
          this.log("[riichi] \u89E3\u7801\u5931\u8D25 mt=" + msgType + ": " + e.message);
        }
      }
      switch (msgType) {
        case RiichiMsg.EReqPrepare: {
          const e = this.ensureEngine();
          if (!e) return;
          this.send(RiichiMsg.ERspPrepare, { result: 0 });
          e.submitPrepare();
          break;
        }
        case RiichiMsg.EReqPlayCard: {
          const e = this.ensureEngine();
          if (!e) return;
          const result = e.submitDraw(payload);
          this.send(RiichiMsg.ERspPlayCard, { result });
          break;
        }
        case RiichiMsg.EReqQiangCard: {
          const e = this.ensureEngine();
          if (!e) return;
          const result = e.submitClaim(payload);
          this.send(RiichiMsg.ERspQiangCard, { result });
          break;
        }
        case RiichiMsg.EReqSetInternalState: {
          const values = payload.InternalState || payload.internalState || {};
          this.opts.internalState = { ...this.opts.internalState, ...values };
          this.clientInternalState = { ...this.clientInternalState, ...values };
          if (this.engine) this.engine.setInternalState(values);
          this.onSettingsChange({ ...this.opts.internalState });
          this.send(RiichiMsg.ERspSetInternalState, { result: 0 });
          break;
        }
        case RiichiMsg.EReqCloseOfflineTip:
          this.send(RiichiMsg.ERspCloseOfflineTip, { result: 0 });
          break;
        case RiichiMsg.EReqClickUI:
          this.send(RiichiMsg.ERspClickUI, { result: 0 });
          break;
        default:
          this.log("[riichi] \u672A\u5904\u7406\u7684\u5BA2\u6237\u7AEF\u6D88\u606F mt=" + msgType);
      }
    }
    /** 连接断开：让引擎自然停下并不再回推 */
    stop() {
      this.stopped = true;
      const eng = this.engine;
      this.engine = null;
      if (!eng) return;
      eng.emit = () => {
      };
      eng.finished = true;
      eng.handEnded = true;
      try {
        eng.submitPrepare();
      } catch (e) {
      }
      try {
        eng.cancelPending();
      } catch (e) {
      }
    }
  };
  var _g = typeof window !== "undefined" ? window : globalThis;
  var _MJ = _g.__mj || (_g.__mj = {});
  _MJ.shop = shop_exports;
  _MJ.sichuan = { SichuanTable, SICHUAN_PLAYABLE_GAME_TYPES, sichuanRoom, MaJiangMsg };
  _MJ.riichi = {
    RiichiSession,
    GameEngine,
    MSG_NAME,
    encodeMsg,
    decodeMsg,
    RiichiMsg,
    PlayAction,
    ManType,
    LiuJuType,
    YiType,
    tileName,
    decodeId,
    tileId
  };
})();
