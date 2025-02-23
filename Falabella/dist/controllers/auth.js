"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const user_1 = require("../entities/user");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
// Clave secreta para firmar los tokens
const JWT_SECRET = process.env.JWT_SECRET;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validar email y password
    yield (0, express_validator_1.body)("email").isEmail().run(req);
    yield (0, express_validator_1.body)("password").notEmpty().run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Buscar usuario en la base de datos
        const user = yield user_1.User.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Comparar contraseña con la almacenada en la BD
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generar JWT
        const token = jwt.sign({ userId: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: "2h" } // Token expira en 2 horas
        );
        return res.json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.login = login;
// Funcion para crear usuario
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastname, email, id_type, id_number, phone, password } = req.body;
        // 🔹 Verificar que todos los campos estén presentes
        if (!name || !lastname || !email || !id_type || !id_number || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // 🔹 Verificar si el email ya está registrado
        const existingUserEmail = yield user_1.User.findOne({ where: { email } });
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // 🔹 Verificar si el telefono ya está registrado
        const existingUserPhone = yield user_1.User.findOne({ where: { phone } });
        if (existingUserPhone) {
            return res.status(400).json({ message: "Phone already exists" });
        }
        // 🔹 Hashear la contraseña
        const hashed_password = yield bcrypt.hash(password, 10);
        // 🔹 Crear y guardar usuario
        const user = user_1.User.create({
            name,
            lastname,
            email,
            id_type,
            id_number,
            phone,
            password: hashed_password
        });
        yield user.save();
        // 🔹 Retornamos datos del usuario
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.user_id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                id_type: user.id_type,
                id_number: user.id_number,
                phone: user.phone
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error", error: error instanceof Error ? error.message : error });
    }
});
exports.register = register;
