import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgramDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program?: {
    title?: string;
    department?: string;
    degreeType?: string;
    duration?: string;
    tuition?: string;
    description?: string;
    courses?: string[];
    outcomes?: string[];
    credits?: string;
  };
  onApply: (programTitle: string, departmentName: string) => void;
}

const JobDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  isOpen,
  onClose,
  program = {},
  onApply
}) => {
  // Safely get array fields with defaults
  const courses = program?.courses || [];
  const outcomes = program?.outcomes || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-2xl font-bold focus:outline-none z-10"
            aria-label="Close modal"
          >
            ×
          </button>

          <div className="p-8">
            {/* Header Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {program.title || "Program Title Not Available"}
              </h2>

              {/* Program Attributes */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {program.department && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {program.department}
                  </div>
                )}

                {program.duration && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {program.duration}
                  </div>
                )}

                {program.credits && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    {program.credits}
                  </div>
                )}

                {program.degreeType && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {program.degreeType}
                  </span>
                )}
              </div>

              {/* Tuition */}
              {program.tuition && (
                <div className="flex items-center text-blue-600 font-bold text-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {program.tuition}
                </div>
              )}
            </div>

            {/* Program Description Section */}
            {program.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Program Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  {program.description}
                </p>
              </div>
            )}

            {/* Courses Section */}
            {courses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Core Courses</h3>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Outcomes Section */}
            {outcomes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Outcomes</h3>
                <ul className="space-y-2">
                  {outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-gray-500 mr-2 mt-1">•</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <button
              onClick={() => onApply(program.title || "", program.department || "")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Apply for This Program
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JobDetailsModal;
