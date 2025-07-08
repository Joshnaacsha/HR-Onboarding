// src/nodes/generateId.ts

export const generateIdNode = async (state: any) => {
  const { name } = state;

  // Extract initials from name
  const initials = name
    .split(" ")
    .map((part: any[]) => part[0])
    .join("")
    .toUpperCase();

  // Timestamp suffix (YYMMDD + random 2 digits)
  const now = new Date();
  const dateStr = now
    .toISOString()
    .slice(2, 10) // "25-07-08"
    .replace(/-/g, ""); // "250708"

  const rand = Math.floor(Math.random() * 90 + 10); // 2-digit random number

  const empId = `EMP-${initials}-${dateStr}${rand}`;

  console.log("🆔 Generated Employee ID:", empId);

  return {
    ...state,
    empId,
  };
};
