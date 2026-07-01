import React, {useEffect, useState, useRef} from "react";
import i18n from "i18n";
import {withTranslation} from "react-i18next";
import {Row, Col, Input, Avatar, List, Divider, Skeleton, Radio, Typography} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {predict} from "../services/ollama.services";
import {fetchFileContents, buildSystemPrompt, MODES, MODE_LABELS} from "../services/prompt.services";
import FileExplorer from "../components/FileExplorer";

const {Search} = Input;
const avatarComp = <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${1}`}/>

const HomePage = () => {
    const [state, setState] = useState({response: "", data: [], loading: false, searchText: ""});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mode, setMode] = useState(MODES.WSO2_MI);
    const [projectPath, setProjectPath] = useState(window.runConfig.REFERENCE_PROJECT_PATH || '');
    const endOfListRef = useRef(null);

    useEffect(() => {
        setState({...state, loading: false,});
    }, []);


    useEffect(() => {
        if (endOfListRef.current) {
            endOfListRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [state.data, state.response]);

    const fetchResponse = async (searchText) => {
        const model = "gpt-oss:120b";//"codegemma:7b"

        let referenceFiles = [];
        if (selectedFiles.length > 0) {
            referenceFiles = await fetchFileContents(selectedFiles, projectPath);
        }
        const systemPrompt = buildSystemPrompt(mode, referenceFiles);

        const res = await predict(model, searchText || "no response", systemPrompt);
        if (!res.ok) {
            throw new Error(`Error fetching response: ${res.statusText}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = "";
        let lastResponse = "";

        while (true) {
            const {value, done} = await reader.read();
            if (done) {
                const item = {title: searchText || "Search Text", content: lastResponse};
                lastResponse = "";
                setState((prev) => ({
                    ...prev,
                    searchText: "",
                    loading: false,
                    response: "",
                    data: [...prev.data, item]
                }));
                break;
            }
            buffer += decoder.decode(value, {stream: true});

            // Split by newline because Ollama sends JSON lines
            const lines = buffer.split("\n");

            // Keep last partial line in buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (line.trim() === "") {
                    continue;
                }

                try {
                    const json = JSON.parse(line);
                    const chunk = json.response || (json.message && json.message.content) || "";
                    if (chunk) {
                        lastResponse += chunk;
                        setState((prev) => ({...prev, loading: true, response: lastResponse}))
                    }
                } catch (err) {
                    console.error("Error parsing line:", line);
                }
            }
        }
    };

    const onSearch = (value) => {
        setState({...state, loading: true, searchText: value});
        fetchResponse(value);
    }

    return (
        <Row gutter={[8, 8]}>
            <Col span={4}>
                <div style={{marginBottom: 8, padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 6}}>
                    <Typography.Text strong
                                     style={{fontSize: 12, display: 'block', marginBottom: 6}}>Mode</Typography.Text>
                    <Radio.Group
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        size="small"
                    >
                        <Radio.Button value={MODES.WSO2_MI}
                                      style={{fontSize: 11}}>{MODE_LABELS[MODES.WSO2_MI]}</Radio.Button>
                        <Radio.Button value={MODES.GENERAL}
                                      style={{fontSize: 11}}>{MODE_LABELS[MODES.GENERAL]}</Radio.Button>
                    </Radio.Group>
                </div>
                <div style={{padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 6}}>
                    <Typography.Text strong style={{fontSize: 12, display: 'block', marginBottom: 6}}>Reference
                        Files</Typography.Text>
                    <FileExplorer
                        selectedFiles={selectedFiles}
                        onSelectedFilesChange={setSelectedFiles}
                        projectPath={projectPath}
                        onProjectPathChange={setProjectPath}
                    />
                </div>
            </Col>
            <Col span={20}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <Search
                            placeholder={selectedFiles.length > 0
                                ? `Ask with ${selectedFiles.length} reference file(s)...`
                                : i18n.t("inputSearchText")}
                            value={state.searchText}
                            onChange={(e) => setState({...state, searchText: e.target.value})}
                            enterButton={i18n.t("ask")}
                            size="large"
                            loading={state.loading}
                            onSearch={onSearch}
                        />
                    </Col>
                    <Col span={24}>
                        <div
                            id="scrollableDiv"
                            style={{
                                height: "calc(80vh - 120px)",
                                overflow: 'auto',
                                padding: '16px',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                            }}
                        >
                            <InfiniteScroll
                                dataLength={state.data.length}
                                next={() => null}
                                hasMore={state.loading}
                                loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                                endMessage={state.loading ? null :
                                    <Divider plain>It is all, nothing more</Divider>}
                                scrollableTarget="scrollableDiv"
                            >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={!state.response ? state.data :
                                        [...state.data, {
                                            title: "",
                                            content: state.response
                                        }]}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={avatarComp}
                                                title={item.title}
                                                description={<pre style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word'
                                                }}>{item.content}</pre>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </InfiniteScroll>
                            {/* Scroll target */}
                            <div ref={endOfListRef}/>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default withTranslation()(HomePage);
