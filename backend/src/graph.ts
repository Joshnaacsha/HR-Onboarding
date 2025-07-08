import { START, END, StateGraph } from "@langchain/langgraph";
import { graphState } from "./graphState";
import { acknowledgeNode } from "./nodes/acknowledge";
import { generateIdNode } from "./nodes/generateId";
import { updateSheetNode } from "./nodes/updateSheet";

// ✨ Add more nodes here as you build them
// import { updateSheetNode } from "./nodes/updateSheet";
// import { generateIdNode } from "./nodes/generateId";
// ...

const graph = new StateGraph(graphState)
  .addNode("acknowledge", acknowledgeNode)
  .addNode("generateId", generateIdNode)
  .addNode("updateSheet", updateSheetNode)

  // 🔁 Entry → Acknowledge
  .addEdge(START, "acknowledge")
  .addEdge("acknowledge", "generateId")
  .addEdge("generateId", "updateSheet")
  .addEdge("updateSheet", END);

const compiledGraph = graph.compile();
export { compiledGraph };
