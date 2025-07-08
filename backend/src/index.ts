import { compiledGraph } from './graph';
import { getInitialOnboardingState } from './gmail';

console.log("🚀 HR onboarding backend started");

async function run() {
  const state = await getInitialOnboardingState();

  if (!state) {
    console.log("⏳ No onboarding run triggered.");
    return;
  }

  const result = await compiledGraph.invoke(state);
  console.log("✅ Final Graph Output:", result);
}

run();
