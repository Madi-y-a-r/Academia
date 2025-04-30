"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  useGetCoursesQuery,
  useGetCourseMeetingsQuery,
  useCreateMeetingMutation,
  useDeleteMeetingMutation
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Clock, Calendar, Users, Video, Trash2, Plus, ExternalLink } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { format, parseISO } from 'date-fns';
import { useUser } from '@clerk/nextjs';

const MeetingsPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    meetUrl: ''
  });

  // Получаем курсы учителя
  const { data: coursesData } = useGetCoursesQuery({});
  const courses = coursesData || [];
  
  // Получаем встречи для выбранного курса
  const { data: meetingsData, isLoading, refetch } = useGetCourseMeetingsQuery(
    selectedCourseId, 
    { skip: !selectedCourseId }
  );
  const meetings = meetingsData || [];

  // Мутации
  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  const [deleteMeeting, { isLoading: isDeleting }] = useDeleteMeetingMutation();

  // Обработчики событий
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error('Выберите курс');
      return;
    }

    try {
      await createMeeting({
        courseId: selectedCourseId,
        ...newMeeting
      }).unwrap();
      toast.success('Встреча успешно создана');
      setIsCreateDialogOpen(false);
      refetch();
      setNewMeeting({
        title: '',
        description: '',
        scheduledStartTime: '',
        scheduledEndTime: '',
        meetUrl: ''
      });
    } catch (error) {
      toast.error('Ошибка при создании встречи');
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту встречу?')) {
      try {
        await deleteMeeting(meetingId).unwrap();
        toast.success('Встреча удалена');
        refetch();
      } catch (error) {
        toast.error('Ошибка при удалении встречи');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление встречами</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Создать встречу
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="course-select" className="mb-2 block">Выберите курс</Label>
        <Select 
          value={selectedCourseId} 
          onValueChange={setSelectedCourseId}
        >
          <SelectTrigger className="w-full md:w-80" id="course-select">
            <SelectValue placeholder="Выберите курс" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.courseId} value={course.courseId}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourseId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Загрузка встреч...</p>
          ) : meetings.length > 0 ? (
            meetings.map(meeting => (
              <Card key={meeting.meetingId} className="overflow-hidden">
                <CardHeader className="bg-muted">
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {meeting.description || 'Нет описания'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
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
                    <div className="flex items-center text-sm">
                      <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                      <a 
                        href={meeting.meetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        Ссылка на встречу <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/teacher/meetings/${meeting.meetingId}`)}
                  >
                    Подробнее
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteMeeting(meeting.meetingId)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>Для этого курса пока нет встреч.</p>
          )}
        </div>
      )}

      {/* Диалог создания встречи */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Создать новую встречу</DialogTitle>
            <DialogDescription>
              Введите детали предстоящей встречи. После создания вы сможете поделиться ссылкой с учениками.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateMeeting}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meetUrl">URL встречи (Google Meet)</Label>
                <Input
                  id="meetUrl"
                  placeholder="https://meet.google.com/..."
                  value={newMeeting.meetUrl}
                  onChange={(e) => setNewMeeting({...newMeeting, meetUrl: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-time">Время начала</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={newMeeting.scheduledStartTime}
                  onChange={(e) => setNewMeeting({...newMeeting, scheduledStartTime: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-time">Время окончания</Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={newMeeting.scheduledEndTime}
                  onChange={(e) => setNewMeeting({...newMeeting, scheduledEndTime: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Создание...' : 'Создать встречу'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingsPage;