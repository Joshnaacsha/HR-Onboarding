import { Annotation } from "@langchain/langgraph";

export const graphState = {
  name: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  email: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  role: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  empId: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  welcomeMailDraft: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  status: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  error: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),

  taEmail: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
    default: () => "",
  }),
};
