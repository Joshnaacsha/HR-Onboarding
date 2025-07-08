import { sendMail } from "../utils/mailer";

export const acknowledgeNode = async (state: any) => {
  const { name, role, taEmail } = state;

  if (!taEmail) {
    console.error("❌ TA email missing from state");
    return { ...state, error: "TA email not found" };
  }

  const subject = `Onboarding Started: ${name}`;
  const text = `Hi,\n\nThe onboarding process for ${name} (${role}) has been initiated.\n\nRegards,\nHR Bot`;

  await sendMail({
    to: taEmail,
    subject,
    text,
  });

  return {
    ...state,
    currentStep: "acknowledged",
  };
};
