"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_1 = require("../../../controller/Admin");
const router = (0, express_1.Router)();
router.post("/avatar", Admin_1.AdminController.createAvatar);
exports.default = router;
