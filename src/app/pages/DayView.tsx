

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, PlaySquare, BookOpen, Lightbulb, Clock, Loader2 } from "lucide-react";
import { getPlan, getDayExplanation } from "../utils/api";

export function DayView() {
  const { id, dayNumber } = useParams();
  const [day, setDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([]);
  const [explanations, setExplanations] = useState<any[]>([]);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    if (id && dayNumber) {
      // Fetch day data
      getPlan(id)
        .then((data) => {
          const selectedDay = data.day_wise_plan.find(
            (d: any) => d.day === parseInt(dayNumber)
          );
          setDay({
            ...selectedDay,
            subject: data.subject,
            totalDays: data.day_wise_plan.length,
            study_method: data.study_method,
            youtube_recs: data.youtube_recs,
          });
          setCheckedTasks(new Array(selectedDay?.tasks?.length || 0).fill(false));
        })
        .finally(() => setLoading(false));

      // Fetch AI explanation separately
      setLoadingExplanation(true);
      getDayExplanation(id, dayNumber)
        .then((data) => setExplanations(data.explanations || []))
        .catch(() => setExplanations([]))
        .finally(() => setLoadingExplanation(false));
    }
  }, [id, dayNumber]);

  const toggleTask = (index: number) => {
    setCheckedTasks(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const completedCount = checkedTasks.filter(Boolean).length;

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <p className="text-slate-500">Loading day plan...</p>
    </div>
  );

  if (!day) return (
    <div className="flex items-center justify-center p-12">
      <p className="text-slate-500">Day not found.</p>
    </div>
  );

  const currentDay = parseInt(dayNumber || "1");

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div>
        <Link
          to={`/plan/${id}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Full Plan
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
              {day.subject} • Day {day.day} of {day.totalDays}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Day {day.day}: {day.date}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {day.hours} hours • {day.study_method}
            </p>
          </div>

          {/* Prev / Next Day Navigation */}
          <div className="flex items-center gap-2">
            {currentDay > 1 && (
              <Link
                to={`/plan/${id}/day/${currentDay - 1}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Day {currentDay - 1}
              </Link>
            )}
            {currentDay < day.totalDays && (
              <Link
                to={`/plan/${id}/day/${currentDay + 1}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Day {currentDay + 1}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-slate-700">Today's Progress</p>
          <p className="text-sm font-bold text-indigo-600">{completedCount}/{checkedTasks.length} tasks done</p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: checkedTasks.length > 0 ? `${(completedCount / checkedTasks.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* ── TOPIC EXPLANATIONS (NEW) ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Topic Explanations
        </h2>

        {loadingExplanation ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">AI is generating topic explanations...</p>
            <p className="text-slate-400 text-xs mt-1">This takes about 5 seconds</p>
          </div>
        ) : explanations.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
            No explanations available.
          </div>
        ) : (
          explanations.map((exp: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Topic Header */}
              <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900">{exp.topic}</h3>
              </div>

              <div className="p-6 space-y-5">
                {/* What is it */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    What is it?
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{exp.what_is_it}</p>
                </div>

                {/* Key Concepts */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Key Concepts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.key_concepts?.map((concept: string, j: number) => (
                      <span key={j} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Example */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Example
                  </p>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <p className="text-sm text-green-400 leading-relaxed font-mono whitespace-pre-wrap">{exp.example}</p>
                  </div>
                </div>

                {/* Common Mistakes */}
                <div>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
                    Common Mistakes to Avoid
                  </p>
                  <ul className="space-y-2">
                    {exp.common_mistakes?.map((mistake: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✕</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Tip */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Exam Tip</p>
                    <p className="text-sm text-amber-800">{exp.exam_tips}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── ORIGINAL GRID (left sidebar + task checklist) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">

          {/* Topics */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
              Today's Topics
            </h3>
            <div className="space-y-2">
              {day.topics?.map((topic: string, i: number) => (
                <div key={i} className="flex items-center px-3 py-2 bg-indigo-50 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-indigo-800">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-bold text-amber-900 flex items-center mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600 mr-2" />
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2"><span className="mt-1">•</span>Take a 10 min break every hour to stay focused.</li>
              <li className="flex items-start gap-2"><span className="mt-1">•</span>Write down key formulas or concepts as you study.</li>
              <li className="flex items-start gap-2"><span className="mt-1">•</span>After watching a video, try to explain it in your own words.</li>
              <li className="flex items-start gap-2"><span className="mt-1">•</span>Practice problems are more important than re-reading notes.</li>
            </ul>
          </div>

          {/* Video Recommendations */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <PlaySquare className="w-5 h-5 text-red-500 mr-2" />
              Video Recommendations
            </h3>
            <div className="space-y-4">
              {day.youtube_recs?.map((rec: any, i: number) => (
                
                 <a key={i}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                    <PlaySquare className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{rec.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.channel} • {rec.duration}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Task Checklist */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Task Checklist</h3>
              <p className="text-sm text-slate-500 mt-1">Check off tasks as you complete them</p>
            </div>

            <div className="divide-y divide-slate-100">
              {day.tasks?.map((task: string, i: number) => (
                <div
                  key={i}
                  onClick={() => toggleTask(i)}
                  className="flex items-start gap-4 px-6 py-5 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    checkedTasks[i] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'
                  }`}>
                    {checkedTasks[i] && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm leading-relaxed transition-all ${
                    checkedTasks[i] ? 'line-through text-slate-400' : 'text-slate-700'
                  }`}>
                    {task}
                  </span>
                </div>
              ))}
            </div>

            {/* Completion Message */}
            {completedCount === checkedTasks.length && checkedTasks.length > 0 && (
              <div className="px-6 py-5 bg-green-50 border-t border-green-100 text-center">
                <p className="text-green-700 font-semibold">🎉 All tasks completed for today!</p>
                {currentDay < day.totalDays && (
                  <Link
                    to={`/plan/${id}/day/${currentDay + 1}`}
                    className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Move to Day {currentDay + 1}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}