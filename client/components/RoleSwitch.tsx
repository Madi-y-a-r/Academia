"use client"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function RoleSwitch() {
  const t = useTranslations("Auth");
  const { signUp } = useSignUp();
  const [isTeacher, setIsTeacher] = useState(false);

  const handleRoleChange = async (checked: boolean) => {
    setIsTeacher(checked);
    try {
      if (signUp?.createdSessionId) {
        await signUp.update({
          unsafeMetadata: {
            userType: checked ? "teacher" : "student"
          }
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2 my-4">
      <Switch
        id="role-switch"
        checked={isTeacher}
        onCheckedChange={handleRoleChange}
      />
      <Label htmlFor="role-switch" className="text-white">
        {isTeacher ? t("registerAsTeacher") : t("registerAsStudent")}
      </Label>
    </div>
  );
} 