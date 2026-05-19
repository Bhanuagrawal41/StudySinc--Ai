// import { Link } from "react-router";
// import { Plus, ArrowRight, Clock, BookOpen, AlertCircle } from "lucide-react";
// import { mockPlan } from "../utils/mockData";

// export function Home() {
//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, John 👋</h1>
//           <p className="text-slate-500 mt-1">Here's an overview of your study progress.</p>
//         </div>
//         <Link
//           to="/create"
//           className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Create New Plan
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//           <div className="flex items-center justify-between pb-4">
//             <h3 className="font-semibold text-slate-700">Active Plans</h3>
//             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
//               <BookOpen className="w-5 h-5" />
//             </div>
//           </div>
//           <p className="text-3xl font-bold text-slate-900">2</p>
//           <p className="text-sm text-slate-500 mt-1">1 exam this week</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//           <div className="flex items-center justify-between pb-4">
//             <h3 className="font-semibold text-slate-700">Study Hours</h3>
//             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//               <Clock className="w-5 h-5" />
//             </div>
//           </div>
//           <p className="text-3xl font-bold text-slate-900">14.5</p>
//           <p className="text-sm text-slate-500 mt-1">Logged this week</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
//           <div className="flex items-center justify-between pb-4">
//             <h3 className="font-semibold text-slate-700">Urgent</h3>
//             <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
//               <AlertCircle className="w-5 h-5" />
//             </div>
//           </div>
//           <p className="text-lg font-bold text-slate-900">OS Midterm</p>
//           <p className="text-sm text-slate-500 mt-1">In 3 days</p>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Plans</h2>
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <ul className="divide-y divide-slate-200">
//             <li className="p-4 hover:bg-slate-50 transition-colors">
//               <Link to="/plan/plan-123" className="flex items-center justify-between">
//                 <div>
//                   <h4 className="font-semibold text-slate-900">{mockPlan.subject}</h4>
//                   <p className="text-sm text-slate-500 mt-1">
//                     {mockPlan.days_left} days left • {mockPlan.hours_per_day} hrs/day
//                   </p>
//                 </div>
//                 <ArrowRight className="w-5 h-5 text-slate-400" />
//               </Link>
//             </li>
//             <li className="p-4 hover:bg-slate-50 transition-colors">
//               <Link to="#" className="flex items-center justify-between">
//                 <div>
//                   <h4 className="font-semibold text-slate-900">Operating Systems</h4>
//                   <p className="text-sm text-slate-500 mt-1">
//                     3 days left • 8 hrs/day
//                   </p>
//                 </div>
//                 <ArrowRight className="w-5 h-5 text-slate-400" />
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, BookOpen, PlusCircle, Sparkles, Clock } from "lucide-react";
import { getPlans } from "../utils/api";

export function Home() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Study Planner</h1>
            <p className="mt-2 text-indigo-200 max-w-md">
              Generate personalized study plans powered by AI. Beat your exams with smart scheduling.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center px-5 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm w-fit"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate New Plan
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Total Plans</p>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{loading ? "..." : plans.length}</p>
          <p className="text-xs text-slate-400 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Latest Subject</p>
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-slate-900 truncate">
            {loading ? "..." : plans.length > 0 ? plans[0].subject : "None yet"}
          </p>
          <p className="text-xs text-slate-400 mt-1">Most recent plan</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Total Study Days</p>
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {loading ? "..." : plans.reduce((acc, p) => acc + (p.daysLeft || 0), 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Across all plans</p>
        </div>
      </div>

      {/* Recent Plans */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Plans</h2>
          <Link
            to="/plans"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-4">No plans yet. Create your first one!</p>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Plan
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {plans.slice(0, 5).map((plan) => (
              <li key={plan.id}>
                <Link
                  to={`/plan/${plan.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {plan.subject}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {plan.daysLeft} days • {plan.hoursPerDay} hrs/day • Created {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}