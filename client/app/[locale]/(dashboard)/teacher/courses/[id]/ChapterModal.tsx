import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChapterFormData, chapterSchema } from "@/lib/schemas";
import { addChapter, closeChapterModal, editChapter } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const ChapterModal = () => {
  const t =useTranslations("TeacherCoursesPage.Chapter")
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      video: "",
      teacherNotes: "",
      resources: [],
    },
  });

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
        teacherNotes: chapter.teacherNotes || "",
        resources: chapter.resources || [],
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: "",
        teacherNotes: "",
        resources: [],
      });
    }
  }, [chapter, methods]);

  const onClose = () => {
    dispatch(closeChapterModal());
  };

  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;

    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
      teacherNotes: data.teacherNotes,
      resources: data.resources,
    };

    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }

    toast.success(
      t("success")
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">{t("Add/Edit Chapter")}</h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="chapter-modal__form"
          >
            <CustomFormField
              name="title"
              label={t("Chapter Title")}
              placeholder={t("Write chapter title here")}
            />

            <CustomFormField
              name="content"
              label={t("Chapter Content")}
              type="textarea"
              placeholder={t("Write chapter content here")}
            />

            <CustomFormField
              name="teacherNotes"
              label={t("Teacher Notes")}
              type="textarea"
              placeholder={t("Add notes for students here")}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("Additional Resources")}</h3>
              {methods.watch("resources")?.map((_, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <CustomFormField
                    name={`resources.${index}.title`}
                    label={t("Resource Title")}
                    placeholder={t("Enter resource title")}
                  />
                  <CustomFormField
                    name={`resources.${index}.url`}
                    label={t("Resource URL")}
                    placeholder={t("Enter resource URL")}
                  />
                  <CustomFormField
                    name={`resources.${index}.description`}
                    label={t("Resource Description")}
                    type="textarea"
                    placeholder={t("Enter resource description")}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const resources = methods.getValues("resources") || [];
                      methods.setValue(
                        "resources",
                        resources.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    {t("Remove Resource")}
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const resources = methods.getValues("resources") || [];
                  methods.setValue("resources", [
                    ...resources,
                    { title: "", url: "", description: "" },
                  ]);
                }}
              >
                {t("Add Resource")}
              </Button>
            </div>

            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    {t("Chapter Video")}
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="border-none bg-customgreys-darkGrey py-2 cursor-pointer"
                      />
                      {typeof value === "string" && value && (
                        <div className="my-2 text-sm text-gray-600">
                          {t("Current video:")} {value.split("/").pop()}
                        </div>
                      )}
                      {value instanceof File && (
                        <div className="my-2 text-sm text-gray-600">
                          {t("Selected file:")} {value.name}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="chapter-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("Cancel")}
              </Button>
              <Button type="submit" className="bg-primary-700">
                {t("Save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;