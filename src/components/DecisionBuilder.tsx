/**
 * Decision Builder — Title, description, options, criteria, and scores matrix.
 */

"use client";

import { useDecision } from "./DecisionProvider";
import { Plus, Trash2, Info } from "lucide-react";
import type { CriterionType } from "@/lib/types";

export function DecisionBuilder() {
  const {
    decision,
    updateTitle,
    updateDescription,
    addOption,
    updateOption,
    removeOption,
    addCriterion,
    updateCriterion,
    removeCriterion,
    updateScore,
  } = useDecision();

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <section aria-labelledby="decision-heading">
        <h2 id="decision-heading" className="text-lg font-semibold text-gray-900 mb-3">
          Decision Details
        </h2>
        <div className="space-y-3">
          <div>
            <label htmlFor="decision-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="decision-title"
              type="text"
              value={decision.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="What are you deciding?"
            />
          </div>
          <div>
            <label htmlFor="decision-desc" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="decision-desc"
              value={decision.description || ""}
              onChange={(e) => updateDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Brief context about this decision..."
            />
          </div>
        </div>
      </section>

      {/* Options */}
      <section aria-labelledby="options-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="options-heading" className="text-lg font-semibold text-gray-900">
            Options
          </h2>
          <button
            onClick={addOption}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Add option"
          >
            <Plus className="h-4 w-4" />
            Add Option
          </button>
        </div>
        <div className="space-y-2">
          {decision.options.map((opt, index) => (
            <div key={opt.id} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-medium text-gray-400">
                {String.fromCharCode(65 + index)}
              </span>
              <input
                type="text"
                value={opt.name}
                onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                aria-label={`Option ${index + 1} name`}
              />
              {decision.options.length > 2 && (
                <button
                  onClick={() => removeOption(opt.id)}
                  className="rounded-md p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  aria-label={`Remove option ${opt.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Criteria */}
      <section aria-labelledby="criteria-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 id="criteria-heading" className="text-lg font-semibold text-gray-900">
              Criteria
            </h2>
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                <p className="font-medium mb-1">Benefit vs Cost:</p>
                <p><strong>Benefit:</strong> Higher score = better (e.g., quality, speed)</p>
                <p><strong>Cost:</strong> Lower score = better (e.g., price, risk). Scores are inverted internally.</p>
                <p className="mt-1">Weights are normalized to sum to 100%.</p>
              </div>
            </div>
          </div>
          <button
            onClick={addCriterion}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Add criterion"
          >
            <Plus className="h-4 w-4" />
            Add Criterion
          </button>
        </div>
        <div className="space-y-2">
          {decision.criteria.map((crit) => (
            <div key={crit.id} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                value={crit.name}
                onChange={(e) => updateCriterion(crit.id, { name: e.target.value })}
                className="flex-1 min-w-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Criterion name"
                aria-label={`Criterion name: ${crit.name}`}
              />
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-500 w-12 text-right" htmlFor={`weight-${crit.id}`}>
                  Weight
                </label>
                <input
                  id={`weight-${crit.id}`}
                  type="number"
                  min={0}
                  max={100}
                  value={crit.weight}
                  onChange={(e) =>
                    updateCriterion(crit.id, {
                      weight: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                    })
                  }
                  className="w-16 rounded-md border border-gray-300 px-2 py-2 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={`Weight for ${crit.name}`}
                />
              </div>
              <select
                value={crit.type}
                onChange={(e) =>
                  updateCriterion(crit.id, { type: e.target.value as CriterionType })
                }
                className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`Type for ${crit.name}`}
              >
                <option value="benefit">Benefit ↑</option>
                <option value="cost">Cost ↓</option>
              </select>
              {decision.criteria.length > 1 && (
                <button
                  onClick={() => removeCriterion(crit.id)}
                  className="rounded-md p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  aria-label={`Remove criterion ${crit.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Scores Matrix */}
      <section aria-labelledby="scores-heading">
        <h2 id="scores-heading" className="text-lg font-semibold text-gray-900 mb-3">
          Scores Matrix
          <span className="text-sm font-normal text-gray-500 ml-2">(0–10 per cell)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse" role="grid" aria-label="Scores matrix">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 border-b border-gray-200">
                  Option / Criterion
                </th>
                {decision.criteria.map((crit) => (
                  <th
                    key={crit.id}
                    className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 border-b border-gray-200"
                  >
                    <div>{crit.name}</div>
                    <span className={`text-[10px] font-normal ${crit.type === "cost" ? "text-orange-600" : "text-green-600"}`}>
                      {crit.type === "cost" ? "↓ cost" : "↑ benefit"}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decision.options.map((opt) => (
                <tr key={opt.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                    {opt.name}
                  </td>
                  {decision.criteria.map((crit) => (
                    <td key={crit.id} className="px-3 py-2 text-center border-b border-gray-100">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={decision.scores[opt.id]?.[crit.id] ?? 0}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v)) {
                            updateScore(opt.id, crit.id, Math.max(0, Math.min(10, v)));
                          }
                        }}
                        className="w-14 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        aria-label={`Score for ${opt.name} on ${crit.name}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
