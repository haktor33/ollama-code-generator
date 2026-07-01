const {usageType, OLLAMA_LOCAL_HOST, OLLAMA_CLOUD_HOST, OLLAMA_API_KEY} = window.runConfig;

const OLLAMA_HOST = usageType === 'local' ? OLLAMA_LOCAL_HOST : OLLAMA_CLOUD_HOST;
const isCloud = usageType === 'cloud';

export const predict = (model, prompt, systemPrompt) => {
    const body = isCloud
        ? {
            model: model || "codegemma:2b",
            messages: [
                ...(systemPrompt ? [{role: "system", content: systemPrompt}] : []),
                {role: "user", content: prompt},
            ],
            stream: true,
        }
        : {
            model: model || "codegemma:2b",
            system: systemPrompt || undefined,
            prompt: prompt,
            stream: true,
        };

    return fetch(OLLAMA_HOST, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OLLAMA_API_KEY}`
        },
    });
}
