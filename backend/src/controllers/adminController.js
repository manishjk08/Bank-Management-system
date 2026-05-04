import userModels from "../models/userModels.js";
import auditModel from "../models/auditModel.js";
import transactionModel from "../models/transactionModel.js";

const getAllUser =async (req,res)=>{
try{
    const result=await userModels.getAll()
    res.json({users:result.rows})
}catch(err){
    console.error(err);
    res.status(500).json({error:'Server error'})
}
};

const getAllTransactions=async(req,res)=>{
    try {
        const result=await transactionModel.getAll()
        res.json({transaction:result.rows})
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Server error'})
    }
}
const getAuditlog=async(req,res)=>{
    try {
        const result =await auditModel.getAll()
        res.json({audit_log:result.rows})
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Server error'})
    }
}
export {getAllUser,getAllTransactions,getAuditlog}