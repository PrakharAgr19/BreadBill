import Cashier from '../Models/Cashier.js';

const checkCashier = async (req, res, next) => {
    try {
        const cashier = await Cashier.exists({ _id: req.user.id });
        
        if(!cashier) return res.json({ error: 'Cashier is allowed to access this information'})

        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Authentication did not happen" })
    }
}

export default checkCashier