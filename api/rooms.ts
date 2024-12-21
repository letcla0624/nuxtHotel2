import type { GetResult, RoomResult } from "./types";

const baseURL = process.env.BASE_URL;

// 取得房型
export async function getRooms() {
  const res = await $fetch<GetResult<RoomResult[]>>("/rooms/", {
    method: "GET",
    baseURL,
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });

  return res.result;
}

// 取得詳細房型
export async function getRoomById(roomId: string) {
  const res = await $fetch<GetResult<RoomResult>>(`/rooms/${roomId}`, {
    method: "GET",
    baseURL,
    onResponseError({ response }) {
      const { message } = response._data;
      console.error("Error:", message);
    },
  });

  return res.result;
}
