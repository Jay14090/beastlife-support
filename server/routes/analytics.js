import express from 'express';

const router = express.Router();

export const queriesStore = [];

router.get('/', (req, res) => {
  const totalCount = queriesStore.length;
  
  const categoryCounts = {};
  const sentimentCounts = {};
  const sourceCounts = {};
  const confidenceSums = {};

  queriesStore.forEach(q => {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    sentimentCounts[q.sentiment] = (sentimentCounts[q.sentiment] || 0) + 1;
    sourceCounts[q.source] = (sourceCounts[q.source] || 0) + 1;
    
    let confValue = 0;
    if (q.confidence === 'high') confValue = 3;
    else if (q.confidence === 'medium') confValue = 2;
    else if (q.confidence === 'low') confValue = 1;
    
    if (!confidenceSums[q.category]) {
      confidenceSums[q.category] = { total: 0, count: 0 };
    }
    confidenceSums[q.category].total += confValue;
    confidenceSums[q.category].count += 1;
  });

  const categoryBreakdown = Object.keys(categoryCounts).map(cat => ({
    category: cat,
    count: categoryCounts[cat],
    percentage: ((categoryCounts[cat] / totalCount) * 100).toFixed(1)
  }));

  const averageConfidence = Object.keys(confidenceSums).map(cat => {
    const avg = confidenceSums[cat].total / confidenceSums[cat].count;
    let label = 'low';
    if (avg >= 2.5) label = 'high';
    else if (avg >= 1.5) label = 'medium';
    
    return {
      category: cat,
      confidence: label
    };
  });

  res.json({
    totalCount,
    categoryBreakdown,
    sentimentBreakdown: sentimentCounts,
    sourceBreakdown: sourceCounts,
    averageConfidence
  });
});

export default router;
