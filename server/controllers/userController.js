import { getUserById } from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const id = req.userId;

        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};