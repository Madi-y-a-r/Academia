"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { setRole } from "@/app/[locale]/(dashboard)/teacher/_actions";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function ChangeRoleButton() {
  const t = useTranslations("Auth");
  const { user } = useUser();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(user?.publicMetadata?.userType || 'student');
  const router = useRouter();
  const handleRoleChange = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('id', user.id);
      const newRole = currentRole === 'teacher' ? 'student' : 'teacher';
      formData.append('userType', newRole);
      
      await setRole(formData);
      setCurrentRole(newRole);
      
      router.push(`/${locale}/${newRole}/courses`);
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleRoleChange}
      disabled={isLoading}
      className="bg-primary-700 hover:bg-primary-600"
    >
      {isLoading ? t("updating") : currentRole === 'teacher' ? t("changeToStudent") : t("changeToTeacher")}
    </Button>
  );
} 