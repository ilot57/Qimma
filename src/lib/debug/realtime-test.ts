// Debug script to test real-time data fetching
export async function testDashboardStatsAPI(userId: string) {
  console.log('🔍 Testing dashboard stats API...');

  try {
    // Simulate the same mock function as in useRealTimeData
    const start = Date.now();
    console.log('⏳ Starting fetch...');

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const mockData = {
      totalExams: Math.floor(Math.random() * 20) + 10,
      completedExams: Math.floor(Math.random() * 15) + 5,
      processingExams: Math.floor(Math.random() * 5),
      errorExams: Math.floor(Math.random() * 2),
      creditsRemaining: Math.floor(Math.random() * 100) + 50,
      averageScore: Math.random() * 100,
      recentActivity: [],
    };

    const end = Date.now();
    console.log(`✅ Fetch completed in ${end - start}ms`);
    console.log('📊 Mock data:', mockData);

    return mockData;
  } catch (error) {
    console.error('❌ Error during fetch:', error);
    throw error;
  }
}

export async function testExamListAPI(userId: string) {
  console.log('🔍 Testing exam list API...');

  try {
    const start = Date.now();
    console.log('⏳ Starting fetch...');

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

    const mockExams = Array.from({ length: 8 }, (_, i) => ({
      id: `exam-${i + 1}`,
      name: `Exam ${i + 1}`,
      subject: ['Math', 'Science', 'English', 'History'][
        Math.floor(Math.random() * 4)
      ],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: ['completed', 'processing', 'pending'][
        Math.floor(Math.random() * 3)
      ] as any,
      submissions: Math.floor(Math.random() * 30) + 5,
      averageScore: Math.floor(Math.random() * 40) + 60,
    }));

    const end = Date.now();
    console.log(`✅ Fetch completed in ${end - start}ms`);
    console.log('📋 Mock exams:', mockExams.length, 'items');

    return mockExams;
  } catch (error) {
    console.error('❌ Error during fetch:', error);
    throw error;
  }
}
