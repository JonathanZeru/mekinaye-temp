"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/users";
exports.ids = ["pages/api/users"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./src/pages/api/users/index.ts":
/*!**************************************!*\
  !*** ./src/pages/api/users/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const users = await prisma.user.findMany();\n            res.status(200).json(users);\n        } catch (error) {\n            res.status(500).json({\n                error: \"Failed to fetch users\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3VzZXJzL2luZGV4LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUM4QztBQUU5QyxNQUFNQyxTQUFTLElBQUlELHdEQUFZQTtBQUNoQixlQUFlRSxRQUFRQyxHQUFtQixFQUFFQyxHQUFvQixFQUFFO0lBRS9FLElBQUlELElBQUlFLE1BQU0sS0FBSyxPQUFPO1FBQ3hCLElBQUk7WUFDRixNQUFNQyxRQUFRLE1BQU1MLE9BQU9NLElBQUksQ0FBQ0MsUUFBUTtZQUN4Q0osSUFBSUssTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQ0o7UUFDdkIsRUFBRSxPQUFPSyxPQUFPO1lBQ2RQLElBQUlLLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBd0I7UUFDeEQ7SUFDRixPQUFPO1FBQ0xQLElBQUlRLFNBQVMsQ0FBQyxTQUFTO1lBQUM7U0FBTTtRQUM5QlIsSUFBSUssTUFBTSxDQUFDLEtBQUtJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRVYsSUFBSUUsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN4RCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dpdGgtbmV4dGpzLXByaXNtYS8uL3NyYy9wYWdlcy9hcGkvdXNlcnMvaW5kZXgudHM/MTMwNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCc7XHJcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcclxuXHJcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xyXG5cclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0dFVCcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZE1hbnkoKTtcclxuICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24odXNlcnMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCB1c2VycycgfSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydHRVQnXSk7XHJcbiAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInVzZXJzIiwidXNlciIsImZpbmRNYW55Iiwic3RhdHVzIiwianNvbiIsImVycm9yIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/users/index.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/users/index.ts"));
module.exports = __webpack_exports__;

})();