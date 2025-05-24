import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// register a new user
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({ name, email, password: hashedPassword });

        return res.status(201).json({ success: true, message: 'User registered', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}