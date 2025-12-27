import { motion } from 'framer-motion';
import { memo } from 'react';
import { strengths } from '../data';
import { Zap, CheckCircle } from 'lucide-react';

const Strengths = memo(() => {
    return (
        <section id="strengths" className="relative py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Zap size={24} className="text-neutral-900 dark:text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">Strengths</h2>
                </div>

                <div className="space-y-4">
                    {strengths.map((strength, idx) => (
                        <motion.div
                            key={strength}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ x: 6 }}
                            className="p-5 bg-[#1C1C1E]/30 border border-white/5 rounded-2xl hover:bg-[#1C1C1E]/50 hover:border-white/10 transition-all duration-300 group flex items-start gap-4"
                        >
                            <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                {strength}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
});

Strengths.displayName = 'Strengths';

export default Strengths;
