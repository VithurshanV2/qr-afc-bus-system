import jwt from 'jsonwebtoken';

// Authenticate users via JWT stored in cookies
const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. Please log in to continue' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode?.id) {
            return res.status(401).json({ success: false, message: 'Invalid token. Please log in again' });
        }

        req.userId = tokenDecode.id;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export default userAuth;