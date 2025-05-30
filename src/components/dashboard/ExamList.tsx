'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import {
  ArrowUpDown,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExamStatus } from '@/types';

// Mock data type - matches the database schema
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

// Props interface
interface ExamListProps {
  exams?: ExamListItem[];
  loading?: boolean;
  className?: string;
}

// Sort configuration
type SortKey = 'title' | 'created_at' | 'status' | 'averageScore';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  order: SortOrder;
}

// Status configuration for badges and colors
const statusConfig = {
  [ExamStatus.DRAFT]: {
    label: 'Draft',
    variant: 'secondary' as const,
    badgeClass: undefined,
  },
  [ExamStatus.PROCESSING]: {
    label: 'Processing',
    variant: 'default' as const,
    badgeClass: undefined,
  },
  [ExamStatus.COMPLETED]: {
    label: 'Completed',
    variant: 'default' as const,
    badgeClass: 'bg-emerald-100 text-emerald-800',
  },
  [ExamStatus.ERROR]: {
    label: 'Error',
    variant: 'destructive' as const,
    badgeClass: undefined,
  },
};

// Mock data for development
const mockExams: ExamListItem[] = [
  {
    id: '1',
    title: 'Mathematics Final Exam',
    subject: 'math',
    grade_level: 'high',
    status: ExamStatus.COMPLETED,
    created_at: '2024-01-15T10:00:00Z',
    submissionCount: 25,
    averageScore: 78.5,
    total_points: 100,
  },
  {
    id: '2',
    title: 'Physics Quiz Chapter 3',
    subject: 'science',
    grade_level: 'high',
    status: ExamStatus.PROCESSING,
    created_at: '2024-01-14T14:30:00Z',
    submissionCount: 12,
    averageScore: null,
    total_points: 50,
  },
  {
    id: '3',
    title: 'English Literature Essay',
    subject: 'language',
    grade_level: 'middle',
    status: ExamStatus.DRAFT,
    created_at: '2024-01-13T09:15:00Z',
    submissionCount: 0,
    averageScore: null,
    total_points: 75,
  },
  {
    id: '4',
    title: 'History Assessment - WWI',
    subject: 'history',
    grade_level: 'high',
    status: ExamStatus.COMPLETED,
    created_at: '2024-01-12T16:45:00Z',
    submissionCount: 18,
    averageScore: 82.3,
    total_points: 100,
  },
  {
    id: '5',
    title: 'Biology Lab Report',
    subject: 'science',
    grade_level: 'middle',
    status: ExamStatus.ERROR,
    created_at: '2024-01-11T11:20:00Z',
    submissionCount: 8,
    averageScore: null,
    total_points: 60,
  },
];

export function ExamList({
  exams = mockExams,
  loading = false,
  className,
}: ExamListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'created_at',
    order: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sort function
  const handleSort = (key: SortKey) => {
    setSortConfig((prevConfig) => ({
      key,
      order:
        prevConfig.key === key && prevConfig.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Sort exams based on current config
  const sortedExams = [...exams].sort((a, b) => {
    const { key, order } = sortConfig;
    let aValue: any = a[key];
    let bValue: any = b[key];

    // Handle null values for averageScore
    if (key === 'averageScore') {
      aValue = aValue ?? -1;
      bValue = bValue ?? -1;
    }

    // Handle date strings
    if (key === 'created_at') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = sortedExams.slice(startIndex, endIndex);

  // Empty state
  if (!loading && exams.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-gray-900">
            No exams yet
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-gray-600">
            Get started by creating your first exam. It only takes a few minutes
            to set up.
          </p>
          <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
            Create your first exam
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Recent Exams</span>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{exams.length} total</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('title')}
                        className="flex h-auto items-center space-x-1 p-0 font-medium hover:bg-transparent"
                      >
                        <span>Exam Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('created_at')}
                        className="flex h-auto items-center space-x-1 p-0 font-medium hover:bg-transparent"
                      >
                        <span>Date Created</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('status')}
                        className="flex h-auto items-center space-x-1 p-0 font-medium hover:bg-transparent"
                      >
                        <span>Status</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('averageScore')}
                        className="flex h-auto items-center space-x-1 p-0 font-medium hover:bg-transparent"
                      >
                        <span>Average Score</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentExams.map((exam) => {
                    const statusInfo = statusConfig[exam.status];

                    return (
                      <TableRow key={exam.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">
                              {exam.title}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="capitalize">{exam.subject}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {exam.grade_level} School
                              </span>
                              <span>•</span>
                              <span>{exam.total_points} pts</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(exam.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusInfo.variant}
                            className={statusInfo.badgeClass}
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {exam.averageScore !== null ? (
                              <>
                                <p className="font-medium">
                                  {exam.averageScore.toFixed(1)}%
                                </p>
                                <p className="text-sm text-gray-600">
                                  {exam.submissionCount} submissions
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-400">
                                {exam.submissionCount > 0
                                  ? 'Processing...'
                                  : 'No submissions'}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>
                                View Submissions
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit Exam</DropdownMenuItem>
                              <DropdownMenuItem>
                                Download Results
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Archive Exam
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t bg-white px-6 py-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(endIndex, exams.length)} of {exams.length} results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, filteredPages) => (
                        <div key={page} className="flex items-center">
                          {index > 0 &&
                            filteredPages[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                          <Button
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[2.5rem]"
                          >
                            {page}
                          </Button>
                        </div>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
