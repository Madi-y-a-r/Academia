"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useGetCourseQuery, 
  useGetCourseMeetingsQuery,
  useJoinMeetingMutation
} from '@/state/api';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { toast } from 'sonner';

const StudentCourseMeetingsPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const { data: course, isLoading: isLoadingCourse } = useGetCourseQuery(courseId);
  const { data: meetingsData, isLoading: isLoadingMeetings } = useGetCourseMeetingsQuery(courseId);
  const meetings = meetingsData || [];
  
  const [joinMeeting, { isLoading: isJoining }] = useJoinMeetingMutation();
  
  const handleJoinMeeting = async (meetingId: string) => {
    try {
      const result = await joinMeeting(meetingId).unwrap();
      // Открываем ссылку на встречу в новой вкладке
      window.open(result.meetUrl, '_blank');
    } catch (error) {
      toast.error('Не удалось присоединиться к встрече');
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };
  
  const isUpcoming = (startTime: string) => {
    try {
      return isFuture(parseISO(startTime));
    } catch (e) {
      return false;
    }
  };
  
  const isOngoing = (startTime: string, endTime: string) => {
    try {
      const now = new Date();
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      return isPast(start) && isFuture(end);
    } catch (e) {
      return false;
    }
  };
  
  const ongoingMeetings = meetings.filter(m => isOngoing(m.scheduledStartTime, m.scheduledEndTime));
  const upcomingMeetings = meetings.filter(m => isUpcoming(m.scheduledStartTime));
  const pastMeetings = meetings.filter(m => 
    !isOngoing(m.scheduledStartTime, m.scheduledEndTime) && !isUpcoming(m.scheduledStartTime)
  );

  if (isLoadingCourse || isLoadingMeetings) {
    return <div className="container mx-auto p-6">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course?.title} - Встречи</h1>
        <p className="text-muted-foreground">
          На этой странице отображаются все запланированные и прошедшие встречи для данного курса
        </p>
      </div>
      
      {/* Текущие встречи */}
      {ongoingMeetings.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Идущие прямо сейчас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingMeetings.map(meeting => (
              <Card key={meeting.meetingId} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {meeting.description || 'Нет описания'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Начало: {formatDate(meeting.scheduledStartTime)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Окончание: {formatDate(meeting.scheduledEndTime)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Участников: {meeting.participants?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleJoinMeeting(meeting.meetingId)}
                    disabled={isJoining}
                  >
                    Присоединиться сейчас
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Предстоящие встречи */}
      {upcomingMeetings.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Предстоящие встречи</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMeetings.map(meeting => (
              <Card key={meeting.meetingId}>
                <CardHeader>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {meeting.description || 'Нет описания'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Начало: {formatDate(meeting.scheduledStartTime)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Окончание: {formatDate(meeting.scheduledEndTime)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Участников: {meeting.participants?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleJoinMeeting(meeting.meetingId)}
                    disabled={isJoining}
                  >
                    Присоединиться
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Прошедшие встречи */}
      {pastMeetings.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Прошедшие встречи</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastMeetings.map(meeting => (
              <Card key={meeting.meetingId} className="opacity-75">
                <CardHeader>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {meeting.description || 'Нет описания'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Начало: {formatDate(meeting.scheduledStartTime)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Окончание: {formatDate(meeting.scheduledEndTime)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Участников: {meeting.participants?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {meetings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Нет запланированных встреч</p>
        </div>
      )}
    </div>
  );
};

export default StudentCourseMeetingsPage;