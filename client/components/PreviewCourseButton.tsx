import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface PreviewCourseButtonProps {
  courseId: string;
}

export default function PreviewCourseButton({ courseId }: PreviewCourseButtonProps) {
  const router = useRouter();

  const handlePreview = () => {
    router.push(`/teacher/courses/${courseId}/preview`);
  };

  return (
    <Button 
      onClick={handlePreview}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Eye className="h-4 w-4" />
      Предпросмотр
    </Button>
  );
}