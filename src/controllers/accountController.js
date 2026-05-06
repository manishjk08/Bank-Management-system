import pool from '../config/db.js';
import accountModel from '../models/accountModels.js';

// GET /api/account/
const getMyAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.findByUserID(req.user.id)
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/accounts/:id 
const getAccountById = async (req, res) => {
  try {
    const account = await accountModel.findByIdAndUserId(req.params.id, req.user.id);

    if (!account) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    res.json({account});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};
//POST api/account/new create new accounts

const createNewAccount=async(req,res)=>{
  
  const {account_type}=req.body;
  if(!account_type|| !['savings','current','fixed_deposit'].includes(account_type)){
    return res.status(400).json({error :'account_type is required and must be either savings,current or fixed_deposit'})
  }
 try {
  const newrequest= await accountModel.requestNewAccount(req.user.id,account_type,'pending');
  res.status(201).json({request:newrequest})
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error.' });
 }
}


// GET all accounts /api/accounts 
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.getAll();
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

export { getMyAccounts, getAccountById, getAllAccounts, createNewAccount };