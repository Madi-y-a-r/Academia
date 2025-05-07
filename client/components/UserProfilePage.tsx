"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUpdateUserMutation } from "@/state/api";
import Header from "@/components/Header";
import Image from "next/image";

const UserProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  
  const [bio, setBio] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (user && isLoaded) {
      // Initialize bio from user metadata
      setBio((user.unsafeMetadata?.bio as string) || "");
    }
  }, [user, isLoaded]);
  
  const handleSaveBio = async () => {
    if (!user) return;
    
    try {
      await updateUser({
        userId: user.id,
        unsafeMetadata: {
          ...(user.unsafeMetadata as Record<string, unknown>),
          bio
        }
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };
  
  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Header 
        title="My Profile" 
        subtitle="View and manage your profile information" 
      />
      
      <div className="bg-customgreys-darkGrey rounded-lg p-6 mt-6">
        <div className="flex items-center mb-6">
          <div className="mr-4">
            {user?.imageUrl ? (
              <Image 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover"
                width={80}
                height={80}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-semibold">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.username || "User"}
            </h2>
            <p className="text-gray-400">{user?.emailAddresses?.[0]?.emailAddress || ""}</p>
            <p className="text-sm mt-1">
              Role: {(user?.publicMetadata?.userType as string) || "Student"}
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">Biography</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white"
                rows={5}
                placeholder="Tell us about yourself..."
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveBio}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setBio((user?.unsafeMetadata?.bio as string) || "");
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 p-4 rounded-md">
              {bio ? (
                <p className="whitespace-pre-wrap">{bio}</p>
              ) : (
                <p className="text-gray-400 italic">No biography added yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;