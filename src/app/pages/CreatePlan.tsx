import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { generatePlan } from "../utils/api";

export function CreatePlan() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    const form = e.target as HTMLFormElement;

    try {
      const plan = await generatePlan({
        subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
        days:    (form.elements.namedItem('days') as HTMLInputElement).value,
        hours:   (form.elements.namedItem('hours') as HTMLInputElement).value,
        level:   (form.elements.namedItem('level') as HTMLSelectElement).value,
        syllabus:(form.elements.namedItem('syllabus') as HTMLTextAreaElement).value,
      });
      navigate(`/plan/${plan.id}`);
    } catch (err) {
      setError((err as Error).message || "Failed to generate plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Generate Study Plan</h1>
        <p className="text-slate-500 mt-2">
          Let AI analyze your syllabus and create an optimized study schedule to maximize your exam readiness.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
              Subject Name
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="e.g., Data Structures & Algorithms"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="days" className="block text-sm font-medium text-slate-700">
                Days Until Exam
              </label>
              <input
                type="number"
                id="days"
                name="days"
                required
                min="1"
                max="90"
                placeholder="e.g., 5"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hours" className="block text-sm font-medium text-slate-700">
                Hours Per Day
              </label>
              <input
                type="number"
                id="hours"
                name="hours"
                required
                min="1"
                max="24"
                placeholder="e.g., 6"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="level" className="block text-sm font-medium text-slate-700">
              Current Understanding Level
            </label>
            <select
              id="level"
              name="level"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all bg-white"
            >
              <option>Starting from scratch (Crash Course)</option>
              <option>Know the basics, need practice</option>
              <option>Confident, need quick review & mocks</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="syllabus" className="block text-sm font-medium text-slate-700">
              Syllabus / Topics to Cover
            </label>
            <textarea
              id="syllabus"
              name="syllabus"
              rows={4}
              required
              placeholder="Paste your syllabus topics here..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all resize-y"
            />
            <p className="text-xs text-slate-500">
              Tip: The more detailed the syllabus, the better the AI can prioritize high-weight topics.
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Study Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Crafting your plan...</h3>
            <p className="text-sm text-slate-500">Analyzing syllabus and optimizing schedule based on priority topics.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}