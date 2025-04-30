import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { useCreateMeetingMutation } from "@/state/api";

interface CreateMeetingFormProps {
  courseId: string;
}

export default function CreateMeetingForm({ courseId }: CreateMeetingFormProps) {
  const t = useTranslations("Meetings");
  const { user } = useUser();
  const [createMeeting] = useCreateMeetingMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMeeting({
        courseId,
        title: formData.title,
        description: formData.description,
        scheduledStartTime: formData.startTime,
        scheduledEndTime: formData.endTime,
        meetUrl: "" // URL будет сгенерирован на сервере
      }).unwrap();
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder={t("meetingTitle")}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <Textarea
        placeholder={t("description")}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Input
        type="datetime-local"
        value={formData.startTime}
        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
      />
      <Input
        type="datetime-local"
        value={formData.endTime}
        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
      />
      <Button type="submit">{t("createMeeting")}</Button>
    </form>
  );
}