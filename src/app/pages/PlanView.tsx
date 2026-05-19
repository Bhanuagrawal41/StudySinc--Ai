



import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Target,
  BrainCircuit,
  PlaySquare,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { getPlan } from "../utils/api";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function PlanView() {
  const { id } = useParams();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPlan(id)
        .then(setPlan)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Loading plan...</p>
      </div>
    );

  if (!plan)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500">Plan not found.</p>
      </div>
    );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
              AI Generated Plan
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {plan.subject}
            </h1>

            <p className="text-slate-600 mt-2 flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {plan.day_wise_plan?.length} Days •{" "}
              {plan.day_wise_plan?.[0]?.hours} Hours/Day
            </p>
          </div>

          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <Target className="w-5 h-5 text-indigo-600 mr-2" />
              Strategy
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed">
              {plan.strategy}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <BrainCircuit className="w-5 h-5 text-indigo-600 mr-2" />
              Priority Topics
            </h3>

            <ul className="space-y-2">
              {plan.priority_topics?.map((topic: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start text-sm text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <PlaySquare className="w-5 h-5 text-red-600 mr-2" />
              Recommended Resources
            </h3>

            <div className="space-y-4">
              {plan.youtube_recs?.map((rec: any, i: number) => (
                <a key={i} href="#" className="block group">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {rec.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {rec.channel} • {rec.duration}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                Day-wise Schedule
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Method: {plan.study_method}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {plan.day_wise_plan?.map((day: any) => (
                <Link
                 to={`/plan/${id}/day/${day.day}`}
                  key={day.day}
                  className="p-6 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Day {day.day}: {day.date}
                      </h4>

                      <p className="text-sm text-indigo-600 font-medium mt-0.5">
                        {day.topics.join(", ")}
                      </p>
                    </div>

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                      {day.hours}h total
                    </span>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-indigo-100">
                    {day.tasks.map((task: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start group cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-300 mr-3 mt-0.5 group-hover:text-indigo-400 transition-colors flex-shrink-0" />

                        <span className="text-sm text-slate-600">
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}