'use client';

import { useCallback } from 'react';

import { ExamList } from '@/components/dashboard/ExamList';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { ExamStatus } from '@/types';

// Mock exam data type - matches the existing ExamList interface
interface ExamListItem {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  status: ExamStatus;
  created_at: string;
  submissionCount: number;
  averageScore: number | null;
  total_points: number;
}

interface RealTimeExamListProps {
  userId: string;
  className?: string;
  limit?: number; // Number of exams to show
}

// Mock data for demonstration - this would be replaced with actual API calls
const generateMockExams = (): ExamListItem[] => {
  const subjects = ['math', 'science', 'language', 'history'];
  const gradeLevels = ['elementary', 'middle', 'high'];
  const statuses = [
    ExamStatus.COMPLETED,
    ExamStatus.PROCESSING,
    ExamStatus.DRAFT,
    ExamStatus.ERROR,
  ];

  return Array.from(
    { length: Math.floor(Math.random() * 10) + 5 },
    (_, index) => ({
      id: `exam-${index + 1}`,
      title: [
        'Mathematics Final Exam',
        'Physics Quiz Chapter 3',
        'English Literature Essay',
        'History Assessment - WWI',
        'Biology Lab Report',
        'Chemistry Midterm',
        'Spanish Vocabulary Test',
        'Geography Quiz',
        'Art History Essay',
        'Computer Science Project',
      ][index % 10],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      grade_level: gradeLevels[Math.floor(Math.random() * gradeLevels.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      submissionCount: Math.floor(Math.random() * 30),
      averageScore: Math.random() > 0.3 ? Math.random() * 100 : null,
      total_points: Math.floor(Math.random() * 100) + 50,
    })
  );
};

export function RealTimeExamList({
  userId,
  className,
  limit = 10,
}: RealTimeExamListProps) {
  // Function to fetch exam data - this would typically call your API
  const fetchExams = useCallback(async (): Promise<ExamListItem[]> => {
    // TODO: Replace with actual API call
    // Example: const response = await fetch(`/api/exams?userId=${userId}&limit=${limit}`);
    // return response.json();

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    const exams = generateMockExams();
    return exams.slice(0, limit);
  }, [userId, limit]);

  // Use real-time data hook with faster refresh for exams (they might be processing)
  const [examState, examActions] = useRealTimeData(fetchExams, {
    interval: 15000, // 15 seconds for exam list
    enabled: true,
  });

  const { data: exams, loading, error, isRefreshing, lastUpdated } = examState;

  return (
    <div className={className}>
      {/* Real-time indicator */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Exams</h2>
        <RefreshIndicator
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
          error={error}
          enabled={true}
          onRefresh={examActions.refresh}
          onToggle={examActions.toggle}
        />
      </div>

      {/* Exam List */}
      <ExamList exams={exams || []} loading={loading} className="mb-0" />

      {/* Processing indicator for exams that are being processed */}
      {exams && exams.some((exam) => exam.status === ExamStatus.PROCESSING) && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center">
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
            <p className="text-sm font-medium text-amber-800">
              {
                exams.filter((exam) => exam.status === ExamStatus.PROCESSING)
                  .length
              }{' '}
              exam(s) currently processing
            </p>
          </div>
          <p className="mt-1 text-xs text-amber-700">
            Status will update automatically when processing completes
          </p>
        </div>
      )}
    </div>
  );
}
