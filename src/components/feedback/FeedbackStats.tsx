
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { Feedback } from '@/types';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface FeedbackStatsProps {
  totalFeedback: number;
  averageRating: number;
  positiveFeedback: number;
  negativeFeedback: number;
  suggestionFeedback: number;
  requireFollowUp: number;
  filteredFeedback: Feedback[];
}

export const FeedbackStats: React.FC<FeedbackStatsProps> = ({
  totalFeedback,
  averageRating,
  positiveFeedback,
  negativeFeedback,
  suggestionFeedback,
  requireFollowUp,
  filteredFeedback,
}) => {
  // Prepare data for pie chart
  const typeData = [
    { name: 'Positive', value: positiveFeedback, color: '#22c55e' },
    { name: 'Negative', value: negativeFeedback, color: '#ef4444' },
    { name: 'Suggestion', value: suggestionFeedback, color: '#3b82f6' },
  ];

  // Calculate ratings distribution
  const ratings = filteredFeedback.reduce((acc, fb) => {
    acc[fb.rating - 1]++;
    return acc;
  }, [0, 0, 0, 0, 0]);

  const ratingsData = [
    { name: '1 Star', value: ratings[0] },
    { name: '2 Stars', value: ratings[1] },
    { name: '3 Stars', value: ratings[2] },
    { name: '4 Stars', value: ratings[3] },
    { name: '5 Stars', value: ratings[4] },
  ];

  // Check if we have any data to show
  const hasData = totalFeedback > 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Feedback</CardDescription>
            <CardTitle className="text-3xl">{totalFeedback}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              All-time feedback count
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {averageRating.toFixed(1)}
              <Star className="h-5 w-5 ml-1 text-amber-400 fill-amber-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Based on {totalFeedback} ratings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Positive</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">{positiveFeedback}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Negative</CardDescription>
            <CardTitle className="text-3xl text-red-500">{negativeFeedback}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm flex items-center">
              <ThumbsDown className="h-4 w-4 mr-1" />
              {totalFeedback > 0 ? Math.round((negativeFeedback / totalFeedback) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Needs Follow-up</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{requireFollowUp}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Pending resolution
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ratings Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Ratings Distribution</CardTitle>
            <CardDescription>Breakdown of ratings by star count</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {hasData ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ratingsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b">
                      <Cell fill="#ef4444" />
                      <Cell fill="#f97316" />
                      <Cell fill="#facc15" />
                      <Cell fill="#65a30d" />
                      <Cell fill="#22c55e" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Type Distribution</CardTitle>
            <CardDescription>Breakdown by feedback category</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {hasData ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
