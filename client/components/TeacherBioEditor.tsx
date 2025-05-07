"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserMutation } from "@/state/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const TeacherBioEditor: React.FC = () => {
  const { user } = useUser();
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser] = useUpdateUserMutation();
  const t = useTranslations('ProfilePage');

  // Load bio from Clerk user data when component mounts
  useEffect(() => {
    if (user?.unsafeMetadata?.bio) {
      setBio(user.unsafeMetadata.bio as string);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateUser({
        userId: user.id,
        unsafeMetadata: {
          bio: bio,
          // Preserve any other existing unsafeMetadata
          ...(user.unsafeMetadata as object || {})
        }
      }).unwrap();
      
      toast.success("bioUpdated");
      setIsEditing(false);
    } catch (error) {
      toast.error("bioUpdateError");
      console.error("Failed to update bio:", error);
    }
  };

  const handleCancel = () => {
    // Reset to original bio
    setBio(user?.unsafeMetadata?.bio as string || "");
    setIsEditing(false);
  };

  return (
    <div className="mt-6 p-4 bg-customgreys-darkGrey rounded-md">
      <h2 className="text-xl font-medium mb-2">{"teacherBio"}</h2>
      
      {isEditing ? (
        <>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={"enterBio"}
            className="min-h-[150px] mb-4"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              variant="default"
            >
              {"save"}
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
            >
              {"cancel"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 min-h-[80px] whitespace-pre-wrap">
            {bio ? bio : <span className="text-gray-500">{"noBio"}</span>}
          </div>
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            {bio ? "editBio" : "addBio"}
          </Button>
        </>
      )}
    </div>
  );
};

export default TeacherBioEditor;