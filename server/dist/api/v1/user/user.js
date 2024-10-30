"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../../../controller/UserController");
const router = (0, express_1.Router)();
router.post("/metadata", UserController_1.UserController.postMetadata);
exports.default = router;
