import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { fetchAllAccounts, makeDeposit, clearDepositStatus, PendingAccountRequest,ApproveAccounts,rejectAccounts  } from "../store/slices/adminSlice";
import toast from 'react-hot-toast';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table';


const Admin = () => {
  const { allAccounts, loading, error, depositSuccess,pendingAccounts } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  const [depositAccountId, setDepositAccountId] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDesc, setDepositDesc] = useState("");
 

  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, [dispatch]);

  useEffect(()=>{
    dispatch(PendingAccountRequest())
  },[dispatch])

  

  useEffect(() => {
    if (depositSuccess) {
      toast.success("Deposit successful!");
      setDepositAccountId(null);
      setDepositAmount("");
      setDepositDesc("");
      dispatch(clearDepositStatus());
      dispatch(fetchAllAccounts());
    }
  }, [depositSuccess, dispatch]);

  const handleDeposit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (depositAccountId && depositAmount) {
      dispatch(
        makeDeposit({
          to_account_id: depositAccountId,
          amount: parseFloat(depositAmount),
          description: depositDesc,
        })
      );
    }
  }, [depositAccountId, depositAmount, depositDesc, dispatch]);

 
  const handleApprove=(id:number)=>{
    dispatch(ApproveAccounts({id}))
    toast.success('Account approved')
    
  }

  const handleReject=(id:number)=>{
    dispatch(rejectAccounts({id}))
    toast.success("rejected account request")
  }
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      header: 'Account Number',
      accessorKey: 'account_number',
      cell: (info) => <span className="font-mono font-bold text-gray-900 tracking-tight">{info.getValue() as string}</span>,
    },
    {
      header: 'Type',
      accessorKey: 'account_type',
      cell: (info) => <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{info.getValue() as string}</span>,
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      cell: (info) => <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-mono font-medium border border-blue-100">{info.getValue() as string}</span>,
    },
    {
  header: 'Balance',
  accessorKey: 'balance',
  cell: (info) => {
    const raw = info.getValue();
    const num = raw !== undefined && raw !== null ? Number(raw) : null;
    return (
      <span className="font-extrabold text-gray-900">
        {num !== null &&  !isNaN(num)? `$${num.toFixed(2)}` : '—'}
      </span>
    );
  },
},
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const acc = row.original;
        if (depositAccountId === acc.id) {
          return (
            <form onSubmit={handleDeposit} className="flex flex-col space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100 animate-in fade-in zoom-in duration-200 min-w-[200px]">
              <input
                type="number"
                step="0.01"
                placeholder="Amount ($)"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold"
              />
              <input
                type="text"
                placeholder="Description (Optional)"
                value={depositDesc}
                onChange={(e) => setDepositDesc(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <div className="flex space-x-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1.5 rounded-lg text-xs w-full font-semibold transition-colors shadow-sm"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setDepositAccountId(null)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-2 py-1.5 rounded-lg text-xs w-full font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          );
        }
        return (
          <button
            onClick={() => setDepositAccountId(acc.id)}
            className="bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 border border-gray-200 hover:border-indigo-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            Make Deposit
          </button>
        );
      }
    }
  ], [depositAccountId, depositAmount, depositDesc, loading, handleDeposit]);

  const table = useReactTable({
    data: allAccounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user accounts and transactions</p>
      </div>
<div className="flex space-x-4">
<div className="space-y-4 w-2/3">
        <h2 className="text-lg font-semibold text-gray-800 px-1">All Active Accounts</h2>
        {loading && allAccounts.length === 0 ? (
          <div className="flex justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 animate-pulse font-medium">Loading accounts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600 text-sm">{error}</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {allAccounts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No accounts found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {pendingAccounts.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-gray-200 ">
          <h2 className="text-lg font-semibold text-gray-800 px-1">Pending Account Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingAccounts.map((p) => (
              <div key={p.id} className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-orange-400 "></div>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-2">Pending Review</p>
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">User ID:</span> {p.user_id}</p>
                <p className="text-sm text-gray-600 mt-1"><span className="font-semibold text-gray-900">Type:</span> <span className="uppercase">{p.account_type}</span></p>
               <button className="p-2 border-2 rounded-sm bg-slate-600 text-white hover:bg-slate-700 mt-2" onClick={() => handleApprove(p.id)}>Approve</button>
              <button className="p-2 border-2 rounded-sm bg-slate-600 text-white hover:bg-slate-700 mt-2" onClick={() => handleReject(p.id)}>Reject</button>

              </div>
            ))}
          </div>
        </div>
      )}
</div>
      
    </div>
  );
};

export default Admin;
