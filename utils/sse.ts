import EventSource from "react-native-sse";
import { getToken } from "./secureStore";

type NotificationHandler = (data: any) => void;

const createSSEConnection = async (
  userId: string,
  onNotification: NotificationHandler
): Promise<EventSource> => {
  const token = await getToken("accessToken");
  console.log("Retrieved Token:", token);

  if (!token) {
    throw new Error("Access token is missing");
  }

  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/sse?userId=${userId}`;
  console.log("Connecting to SSE URL:", url);

  const sse = new EventSource(url, {
    headers: {
      "Content-Type": "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
  });

  sse.addEventListener("open", () => {
    console.log("SSE connection opened");
  });

  sse.addEventListener("message", (event: any) => {
    if (event.data) {
      console.log("SSE Event Data:", event.data);
      const data = JSON.parse(event.data);

      // Check the event type
      if (data.event === "notification") {
        onNotification(data.payload); // Pass the payload to the handler
      }

      onNotification(data.payload);
    }
  });

  sse.addEventListener("error", (event: any) => {
    console.error("SSE Error:", event);
  });

  sse.addEventListener("close", () => {
    console.log("SSE connection closed");
  });

  return sse;
};

export default createSSEConnection;
