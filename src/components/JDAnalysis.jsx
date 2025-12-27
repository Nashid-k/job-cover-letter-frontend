import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement } from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

const JDAnalysis = ({ data }) => {
    const {
        overallMatch,
        categories,
        matchedSkills,
        missingSkills,
        additionalStrengths,
        insights
    } = data;

    // Radar Chart Data
    const radarData = {
        labels: ['Frontend', 'Backend', 'Database', 'Tools'],
        datasets: [
            {
                label: 'Skill Match %',
                data: [
                    categories?.frontend || 0,
                    categories?.backend || 0,
                    categories?.database || 0,
                    categories?.tools || 0
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
            }
        ]
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: 'rgb(156, 163, 175)',
                    backdropColor: 'transparent'
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)'
                },
                pointLabels: {
                    color: 'rgb(55, 65, 81)',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.r}% match`
                }
            }
        }
    };

    // Doughnut Chart Data
    const doughnutData = {
        labels: ['Match', 'Gap'],
        datasets: [
            {
                data: [overallMatch, 100 - overallMatch],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(229, 231, 235, 0.3)'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(229, 231, 235, 0.5)'
                ],
                borderWidth: 2
            }
        ]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '75%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed}%`
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="jd-analysis-container w-full my-4 p-5 rounded-2xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-white/10 shadow-xl"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-blue-500" size={24} />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Job Match Analysis</h3>
            </div>

            {/* Overall Match Score */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                    <div className="relative w-40 h-40 mx-auto">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-neutral-900 dark:text-white">{overallMatch}%</span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Overall Match</span>
                        </div>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="flex-1">
                    <div className="w-full max-w-xs mx-auto">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </div>
            </div>

            {/* Matched Skills */}
            {matchedSkills && matchedSkills.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="text-green-500" size={18} />
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Matched Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {matchedSkills.map((skill, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="skill-badge matched px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                            >
                                ✓ {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Missing Skills */}
            {missingSkills && missingSkills.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="text-red-500" size={18} />
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Skills to Develop</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="skill-badge missing px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                            >
                                ⚠ {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Strengths */}
            {additionalStrengths && additionalStrengths.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-blue-500" size={18} />
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Additional Strengths</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {additionalStrengths.map((skill, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="skill-badge additional px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                            >
                                ⭐ {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            {insights && (
                <div className="mt-6 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">💡 Insights</h4>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{insights}</p>
                </div>
            )}
        </motion.div>
    );
};

export default JDAnalysis;
