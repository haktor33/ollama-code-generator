export const MODES = {
    WSO2_MI: 'wso2mi',
    GENERAL: 'general',
};

export const MODE_LABELS = {
    [MODES.WSO2_MI]: 'WSO2 MI 4.5.0',
    [MODES.GENERAL]: 'General',
};

const WSO2_MI_BASE_PROMPT = `You are a WSO2 Micro Integrator 4.5.0 expert.
You ONLY generate WSO2 MI XML configurations: APIs, sequences, templates, endpoints, local-entries.
NEVER generate code in any other language or framework unless explicitly asked.

Key rules:
- Use synapse XML namespace: xmlns="http://ws.apache.org/ns/synapse"
- API context paths follow pattern: /{module}-rest/{domain} (e.g. /om-rest/order, /bss-rest/accountManagement)
- API resources have inSequence, outSequence, faultSequence structure
- Sequences reference fault sequences via onError or faultSequence key (e.g. conf:sequences/faultSequences/{module}.esb-faultSeq.xml)
- Use property mediators for payload storage before endpoint calls
- Use call mediator for synchronous endpoint invocations
- Use payloadFactory for JSON transformations
- Use xslt for XML transformations via conf:transformations/
- Token retrieval pattern: save payload → GET token endpoint → set Authorization header → restore payload → call target
- i2iRestEnabled switch pattern: check get-property('env','i2iRestEnabled') for REST vs SOAP routing
- Naming: {module}-{entityName} for APIs, {module}-{action}{Entity}Seq for sequences
- Generate complete, production-ready XML that can be directly deployed
- Always include proper error handling`;

export const fetchFileContents = async (filePaths, rootPath) => {
    if (!filePaths || filePaths.length === 0) {
        return [];
    }
    const params = filePaths.map(p => `paths=${encodeURIComponent(p)}`).join('&');
    const res = await fetch(`/wso2mi/files?root=${encodeURIComponent(rootPath)}&${params}`);
    const data = await res.json();
    return data.files || [];
};

export const buildSystemPrompt = (mode, referenceFiles) => {
    if (mode === MODES.GENERAL) {
        return null;
    }

    let prompt = WSO2_MI_BASE_PROMPT;

    if (referenceFiles && referenceFiles.length > 0) {
        prompt += `

## Reference Code from Existing Project (follow these patterns EXACTLY):
`;
        for (const file of referenceFiles) {
            prompt += `
### File: ${file.path}
\`\`\`xml
${file.content}
\`\`\`
`;
        }

        prompt += `
## Additional Instructions:
- Follow the EXACT same XML structure, naming conventions, and patterns as the reference files above.
- Use the same namespace declarations and attribute styles.
- Use the same error handling patterns (faultSequence references).
- Use the same property naming and mediator patterns.
- Use the same i2iRestEnabled switch pattern where applicable.`;
    }

    return prompt;
};
