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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_db_1 = require("../database/config.db");
const corsConfig_1 = require("../middlewares/corsConfig");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = process.env.PORT;
        this.PTRA_CNN = process.env.PTRA_CNN;
        this.paths = {
            auth: '/api/auth',
            user: '/api/user'
        };
        this.ptraConnection();
        this.middlewares();
        this.routes();
    }
    //Ptra DB connection
    ptraConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.PTRA_CNN) {
                process.exit(1);
            }
            yield (0, config_db_1.dbConnection)(this.PTRA_CNN);
        });
    }
    //Midlewares
    middlewares() {
        //CORS
        this.app.use((0, cors_1.default)(corsConfig_1.options));
        //carpeta publica
        this.app.use(express_1.default.static('public'));
        //lectura Parseo Json
        this.app.use(express_1.default.json());
        //Cookie parser
        this.app.use((0, cookie_parser_1.default)());
    }
    //rutas
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.user, require('../routes/user.routes'));
    }
    listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Escuchando el puerto ${this.PORT}`);
        });
    }
}
exports.Server = Server;
