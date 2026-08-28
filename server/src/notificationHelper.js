import { Notification } from "./models.js";

export const createNotification = async ({
  type,
  title,
  message,
  link,
}) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      link,
    });
  } catch (error) {
    console.error(
      "Failed to create notification:",
      error.message
    );
  }
};