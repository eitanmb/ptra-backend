"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { response } = require("express");
const User = require("../models/Users.model");
const isAdmin = (req, res = response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.uid);
    if (user.rol !== "ADMIN") {
        res.status(400).json({
            ok: false,
            msg: ('No tiene privilegios de administrador')
        });
    }
    else {
        next();
    }
});
module.exports = isAdmin;
