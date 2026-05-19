// import { BookOpen } from "lucide-react";
// import { Link } from "react-router";
// import { mockPlan } from "../utils/mockData";

// export function Plans() {
//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Saved Plans</h1>
//           <p className="text-slate-500 mt-1">Manage and review all your study schedules.</p>
//         </div>
//         <Link
//           to="/create"
//           className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//         >
//           Create New Plan
//         </Link>
//       </div>

//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="grid grid-cols-1 divide-y divide-slate-200">
//           <div className="p-6 hover:bg-slate-50 transition-colors">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div className="flex items-start">
//                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg mr-4">
//                   <BookOpen className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <Link to={`/plan/${mockPlan.id}`} className="hover:text-indigo-600 transition-colors">
//                     <h3 className="text-lg font-bold text-slate-900">{mockPlan.subject}</h3>
//                   </Link>
//                   <p className="text-sm text-slate-500 mt-1">
//                     Created 2 days ago • {mockPlan.days_left} Days • {mockPlan.hours_per_day} Hours/Day
//                   </p>
//                 </div>
//               </div>
//               <Link 
//                 to={`/plan/${mockPlan.id}`}
//                 className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
//               >
//                 View Plan
//               </Link>
//             </div>
//           </div>
          
//           <div className="p-6 hover:bg-slate-50 transition-colors">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div className="flex items-start">
//                 <div className="p-3 bg-slate-100 text-slate-600 rounded-lg mr-4">
//                   <BookOpen className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <Link to="#" className="hover:text-indigo-600 transition-colors">
//                     <h3 className="text-lg font-bold text-slate-900">Operating Systems</h3>
//                   </Link>
//                   <p className="text-sm text-slate-500 mt-1">
//                     Created 1 week ago • 3 Days • 8 Hours/Day
//                   </p>
//                 </div>
//               </div>
//               <Link 
//                 to="#"
//                 className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
//               >
//                 View Plan
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BookOpen, Trash2, ArrowRight, PlusCircle } from "lucide-react";
import { getPlans, deletePlan } from "../utils/api";

export function Plans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    await deletePlan(id);
    setPlans(plans.filter(p => p.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <p className="text-slate-500">Loading plans...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Study Plans</h1>
          <p className="text-slate-500 mt-1">All your AI generated study plans in one place.</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Plan
        </Link>
      </div>

      {/* Empty State */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No plans yet</h3>
          <p className="text-slate-500 text-sm mb-6">Generate your first AI study plan to get started.</p>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create First Plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
                  AI Generated
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.subject}</h3>
                <p className="text-sm text-slate-500">
                  {plan.daysLeft} days • {plan.hoursPerDay} hrs/day
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Created {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6">
                <Link
                  to={`/plan/${plan.id}`}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View Plan
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}