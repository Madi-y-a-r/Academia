import { Request, Response } from "express";
import { clerkClient } from "../index";

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const userData = req.body;
  try {
    // Prepare metadata updates
    const metadataUpdate: any = {};

    // Handle publicMetadata updates
    if (userData.publicMetadata) {
      metadataUpdate.publicMetadata = userData.publicMetadata;
    }

    // Handle privateMetadata updates
    if (userData.privateMetadata) {
      metadataUpdate.privateMetadata = userData.privateMetadata;
    }

    // Handle unsafeMetadata updates
    if (userData.unsafeMetadata) {
      metadataUpdate.unsafeMetadata = userData.unsafeMetadata;
    }

    // Update user metadata
    const user = await clerkClient.users.updateUserMetadata(userId, metadataUpdate);

    res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
};