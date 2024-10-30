"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Avatar_1 = require("../../../controller/Avatar");
const router = (0, express_1.Router)();
router.get("/", Avatar_1.AvatarController.getAll);
exports.default = router;
