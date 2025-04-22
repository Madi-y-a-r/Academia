import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/state/api';

interface Resource {
  title: string;
  url: string;
  description?: string;
}

interface ChapterContentEditorProps {
  courseId: string;
  sectionId: string;
  chapterId: string;
  initialTeacherNotes?: string;
  initialResources?: Resource[];
  onSave: () => void;
}

const ChapterContentEditor = ({
  courseId,
  sectionId,
  chapterId,
  initialTeacherNotes = '',
  initialResources = [],
  onSave,
}: ChapterContentEditorProps) => {
  const [teacherNotes, setTeacherNotes] = useState(initialTeacherNotes);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [newResource, setNewResource] = useState<Resource>({ title: '', url: '', description: '' });
  const { toast } = useToast();
  const [updateChapter] = api.useUpdateChapterMutation();

  const handleAddResource = () => {
    if (!newResource.title || !newResource.url) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и URL ресурса',
        variant: 'destructive',
      });
      return;
    }

    setResources([...resources, newResource]);
    setNewResource({ title: '', url: '', description: '' });
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateChapter({
        courseId,
        sectionId,
        chapterId,
        teacherNotes,
        resources,
      }).unwrap();

      toast({
        title: 'Успешно',
        description: 'Контент раздела сохранен',
      });
      onSave();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить контент',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Заметки преподавателя</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            placeholder="Введите заметки для этого раздела..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дополнительные материалы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{resource.title}</h4>
                  {resource.description && (
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  )}
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {resource.url}
                  </a>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveResource(index)}
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">Добавить новый ресурс</h4>
            <Input
              placeholder="Название ресурса"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            />
            <Input
              placeholder="URL ресурса"
              value={newResource.url}
              onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
            />
            <Textarea
              placeholder="Описание ресурса (необязательно)"
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
            />
            <Button onClick={handleAddResource}>Добавить ресурс</Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Сохранить изменения
      </Button>
    </div>
  );
};

export default ChapterContentEditor; 