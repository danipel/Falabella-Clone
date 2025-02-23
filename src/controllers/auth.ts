import { Request, Response } from "express";
import { User } from "../entities/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

// Clave secreta para firmar los tokens
const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response): Promise<any> => {
    // Validar email y password
    await body("email").isEmail().run(req);
    await body("password").notEmpty().run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const user = await User.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Comparar contraseña con la almacenada en la BD
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generar JWT
        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            JWT_SECRET,
            { expiresIn: "2h" } // Token expira en 2 horas
        );

        return res.json({ token });
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ message: error.message });
        }
        
    }
};

// Funcion para crear usuario
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, lastname, email, id_type, id_number, phone, password } = req.body;

        // Verificar que todos los campos estén presentes
        if (!name || !lastname || !email || !id_type || !id_number || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Verificar si el email ya está registrado
        const existingUserEmail = await User.findOne({ where: { email } });
        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // Verificar si el telefono ya está registrado
        const existingUserPhone = await User.findOne({ where: { phone } });
        if (existingUserPhone) {
            return res.status(400).json({ message: "Phone already exists" });
        }

        // Hashear la contraseña
        const hashed_password = await bcrypt.hash(password, 10);

        // Crear y guardar usuario
        const user = User.create({
            name,
            lastname,
            email,
            id_type,
            id_number,
            phone,
            password: hashed_password
        });

        await user.save();

        // Retornamos datos del usuario
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

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error instanceof Error ? error.message : error });
    }
};
