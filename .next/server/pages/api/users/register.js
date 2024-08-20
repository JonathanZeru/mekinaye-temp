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
exports.id = "pages/api/users/register";
exports.ids = ["pages/api/users/register"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "(api)/./src/pages/api/users/register.ts":
/*!*****************************************!*\
  !*** ./src/pages/api/users/register.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        const { firstName , lastName , email , password , status , userName , phoneNumber , type  } = req.body;\n        try {\n            const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().hash(password, 10);\n            const newUser = await prisma.user.create({\n                data: {\n                    firstName,\n                    lastName,\n                    email,\n                    password: hashedPassword,\n                    status,\n                    userName,\n                    phoneNumber,\n                    type\n                }\n            });\n            res.status(201).json({\n                message: \"Registration successful\",\n                data: newUser\n            });\n        } catch (error) {\n            console.error(\"Error occurred during user registration:\", error);\n            res.status(500).json({\n                error: \"Internal Server Errorrr\"\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3VzZXJzL3JlZ2lzdGVyLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQzhDO0FBQ2hCO0FBRTlCLE1BQU1FLFNBQVMsSUFBSUYsd0RBQVlBO0FBRWhCLGVBQWVHLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CLEVBQUU7SUFDL0UsSUFBSUQsSUFBSUUsTUFBTSxLQUFLLFFBQVE7UUFDekIsTUFBTSxFQUFFQyxVQUFTLEVBQUVDLFNBQVEsRUFBRUMsTUFBSyxFQUFFQyxTQUFRLEVBQUVDLE9BQU0sRUFBRUMsU0FBUSxFQUFFQyxZQUFXLEVBQUVDLEtBQUksRUFBRSxHQUFHVixJQUFJVyxJQUFJO1FBRTlGLElBQUk7WUFDRixNQUFNQyxpQkFBaUIsTUFBTWYsb0RBQVcsQ0FBQ1MsVUFBVTtZQUVuRCxNQUFNUSxVQUFVLE1BQU1oQixPQUFPaUIsSUFBSSxDQUFDQyxNQUFNLENBQUM7Z0JBQ3ZDQyxNQUFNO29CQUNKZDtvQkFDQUM7b0JBQ0FDO29CQUNBQyxVQUFVTTtvQkFDVkw7b0JBQ0FDO29CQUNBQztvQkFDQUM7Z0JBQ0Y7WUFDRjtZQUVBVCxJQUFJTSxNQUFNLENBQUMsS0FBS1csSUFBSSxDQUFDO2dCQUNuQkMsU0FBUztnQkFDVEYsTUFBTUg7WUFDUjtRQUNGLEVBQUUsT0FBT00sT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsNENBQTRDQTtZQUMxRG5CLElBQUlNLE1BQU0sQ0FBQyxLQUFLVyxJQUFJLENBQUM7Z0JBQUVFLE9BQU87WUFBMEI7UUFDMUQ7SUFDRixPQUFPO1FBQ0xuQixJQUFJcUIsU0FBUyxDQUFDLFNBQVM7WUFBQztTQUFPO1FBQy9CckIsSUFBSU0sTUFBTSxDQUFDLEtBQUtnQixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUV2QixJQUFJRSxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hELENBQUM7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2l0aC1uZXh0anMtcHJpc21hLy4vc3JjL3BhZ2VzL2FwaS91c2Vycy9yZWdpc3Rlci50cz82YTA3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJztcclxuXHJcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XHJcbiAgICBjb25zdCB7IGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsLCBwYXNzd29yZCwgc3RhdHVzLCB1c2VyTmFtZSwgcGhvbmVOdW1iZXIsIHR5cGUgfSA9IHJlcS5ib2R5O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwKTtcclxuXHJcbiAgICAgIGNvbnN0IG5ld1VzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5jcmVhdGUoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGZpcnN0TmFtZSxcclxuICAgICAgICAgIGxhc3ROYW1lLFxyXG4gICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgICBwYXNzd29yZDogaGFzaGVkUGFzc3dvcmQsXHJcbiAgICAgICAgICBzdGF0dXMsXHJcbiAgICAgICAgICB1c2VyTmFtZSxcclxuICAgICAgICAgIHBob25lTnVtYmVyLFxyXG4gICAgICAgICAgdHlwZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHtcclxuICAgICAgICBtZXNzYWdlOiAnUmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwnLFxyXG4gICAgICAgIGRhdGE6IG5ld1VzZXIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igb2NjdXJyZWQgZHVyaW5nIHVzZXIgcmVnaXN0cmF0aW9uOicsIGVycm9yKTtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcnJyJyB9KTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ1BPU1QnXSk7XHJcbiAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiYmNyeXB0IiwicHJpc21hIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZW1haWwiLCJwYXNzd29yZCIsInN0YXR1cyIsInVzZXJOYW1lIiwicGhvbmVOdW1iZXIiLCJ0eXBlIiwiYm9keSIsImhhc2hlZFBhc3N3b3JkIiwiaGFzaCIsIm5ld1VzZXIiLCJ1c2VyIiwiY3JlYXRlIiwiZGF0YSIsImpzb24iLCJtZXNzYWdlIiwiZXJyb3IiLCJjb25zb2xlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/users/register.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/users/register.ts"));
module.exports = __webpack_exports__;

})();