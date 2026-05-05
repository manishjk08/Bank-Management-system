import userModels from "../models/userModels.js";
import auditModel from "../models/auditModel.js";
import transactionModel from "../models/transactionModel.js";
import accountModel from "../models/accountModels.js";

const getAllUser = async (req, res) => {
    try {
        const result = await userModels.getAll()
        res.json({ users: result.rows })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const result = await transactionModel.getAll()
        res.json({ transaction: result.rows })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' })
    }
}
const getAuditlog = async (req, res) => {
    try {
        const result = await auditModel.getAll()
        res.json({ audit_log: result.rows })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' })
    }
}
const approveAccount = async (req, res) => {
    const { request_id } = req.body
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const request = await accountModel.getRequestByIdForUpdate(request_id, client)

        if (!request) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "request not found" })
        }
        if (request.status === 'APPROVED') {
            return res.status(400).json({ error: 'Already approved' });
        }
        const account_number = 'ACC' + Date.now();

        const newAccount = await accountModel.createAccount(user_id, account_number, account_type, client)
        await accountModel.updateRequestStatus(request_id, 'APPROVED', client)
        await client.query('COMMIT');

        res.json({ message: 'Account approved', account: newAccount });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
    finally {
        client.release();
    }
}

export { getAllUser, getAllTransactions, getAuditlog, approveAccount }