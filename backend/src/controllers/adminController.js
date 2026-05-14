import userModels from "../models/userModels.js";
import auditModel from "../models/auditModel.js";
import transactionModel from "../models/transactionModel.js";
import accountModel from "../models/accountModels.js";
import pool from "../config/db.js";
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
const getAllPendingAccounts=async(req,res)=>{
    try {
        const result=await accountModel.getAllRequest()
        res.json({accounts:result})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Failed to get allAccounts"})
    }
}
const approveAccount = async (req, res) => {
    const { request_id } = req.params
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const request = await accountModel.getRequestByIdForUpdate(request_id, client)

        if (!request) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "request not found" })
        }
        if (request.status === 'completed') {
            return res.status(400).json({ error: 'Already approved' });
        }
        const account_number = 'ACC' + Date.now();

        const newAccount = await accountModel.createAccount({user_id:request.user_id, account_number, account_type:request.account_type, client})
        await accountModel.updateRequestStatus(request_id, 'completed', client)
        await client.query('COMMIT');
        await auditModel.log(req.user.id, 'Account approved','account',request.user_id,client)
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

   const rejectAccount = async (req, res) => {
    const { request_id } = req.params;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const request = await accountModel.getRequestByIdForUpdate(request_id, client);

        if (!request) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Request not found" });
        }

        if (request.status === "failed") {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "Already rejected" });
        }

        if (request.status === "approved") {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "Cannot reject approved request" });
        }

        await accountModel.updateRequestStatus(request_id, "failed", client);

        await client.query("COMMIT");
        await auditModel.log(req.user.id, 'Account rejected','account',request.user_id,client)
        return res.json({
            message: "Account rejected due to insufficient documents"
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        return res.status(500).json({ error: "Server error." });
    } finally {
        client.release();
    }
};
  

export { getAllUser, getAllTransactions, getAuditlog, approveAccount, rejectAccount,getAllPendingAccounts }