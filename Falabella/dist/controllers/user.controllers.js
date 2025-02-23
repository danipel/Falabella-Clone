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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_profile = void 0;
const user_1 = require("../entities/user");
const get_user_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId; // Obtenemos el `userId` del token
        const user = yield user_1.User.findOneBy({ user_id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            id: user.user_id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : error });
    }
});
exports.get_user_profile = get_user_profile;
