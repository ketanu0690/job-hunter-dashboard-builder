export const BrainStormIdea = (
  idea: string,
  source: string = "",
  format: string = "application/json"
) => {
  const rules = [
    "Base your niche suggestions on credible reasoning and detailed explanations.",
    "If multiple niches apply, list them all in order of relevance.",
    "Avoid vague or generic answers—be specific.",
    "Ensure each suggestion is unique and not a repeat from the reference list.",
    "If possible, suggest emerging or trending niches.",
  ];

  return `
Task: ${idea}
Persona: Act like a person who always explains things in detail and is ready to provide additional insights if needed.
Format: The response must be in the following format: ${format}
Context: You need to identify and provide the niche for the topic the user is searching for.
Rules:
${rules.map((rule, i) => `  ${i + 1}. ${rule}`).join("\n")}
Source: ${source}
Reference: Below is a list of niches that we already know; take them as a reference when suggesting new ones.
`;
};
