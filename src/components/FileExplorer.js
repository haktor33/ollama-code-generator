import React, {useState} from 'react';
import {Tree, Spin, Empty, Typography, Modal, Button, Tag, Input} from 'antd';
import {FolderOpenOutlined, FolderOutlined, ArrowLeftOutlined} from '@ant-design/icons';

const {Text} = Typography;

const FileExplorer = ({selectedFiles, onSelectedFilesChange, projectPath, onProjectPathChange}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [totalFiles, setTotalFiles] = useState(0);

    const [browseOpen, setBrowseOpen] = useState(false);
    const [browseDirs, setBrowseDirs] = useState([]);
    const [browseCurrentPath, setBrowseCurrentPath] = useState('');
    const [browseParent, setBrowseParent] = useState('');
    const [browseLoading, setBrowseLoading] = useState(false);

    const fetchTree = async (rootPath) => {
        setLoading(true);
        setLoaded(false);
        try {
            const res = await fetch(`/wso2mi/tree?root=${encodeURIComponent(rootPath)}`);
            const data = await res.json();
            setTreeData(data.tree || []);
            setTotalFiles(data.totalFiles || 0);
            setLoaded(true);
        } catch (err) {
            console.error('Failed to fetch file tree:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setModalOpen(true);
        fetchTree(projectPath);
    };

    const onCheck = (checked) => {
        setCheckedKeys(checked);
    };

    const handleOk = () => {
        const leafKeys = checkedKeys.filter(key => key.endsWith('.xml'));
        onSelectedFilesChange(leafKeys);
        setModalOpen(false);
    };

    const handleRemoveFile = (filePath) => {
        const updated = selectedFiles.filter(f => f !== filePath);
        onSelectedFilesChange(updated);
        setCheckedKeys(prev => prev.filter(k => k !== filePath));
    };

    const fetchBrowse = async (dirPath) => {
        setBrowseLoading(true);
        try {
            const res = await fetch(`/wso2mi/browse?path=${encodeURIComponent(dirPath)}`);
            const data = await res.json();
            setBrowseDirs(data.dirs || []);
            setBrowseCurrentPath(data.current);
            setBrowseParent(data.parent);
        } catch (err) {
            console.error('Failed to browse:', err);
        } finally {
            setBrowseLoading(false);
        }
    };

    const openBrowse = () => {
        setBrowseOpen(true);
        fetchBrowse(projectPath || '/');
    };

    const selectBrowseDir = (dirPath) => {
        onProjectPathChange(dirPath);
        setBrowseOpen(false);
        setLoaded(false);
        setTreeData([]);
        setCheckedKeys([]);
        onSelectedFilesChange([]);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) {return `${bytes}B`;}
        return `${(bytes / 1024).toFixed(1)}KB`;
    };

    const renderTitle = (node) => {
        if (node.isLeaf) {
            return (
                <span>
                    {node.title}
                    <Text type="secondary" style={{fontSize: 11, marginLeft: 6}}>
                        {formatSize(node.size)}
                    </Text>
                </span>
            );
        }
        return <span>{node.title}</span>;
    };

    const processTreeData = (nodes) => {
        return nodes.map(node => ({
            ...node,
            title: renderTitle(node),
            children: node.children ? processTreeData(node.children) : undefined,
        }));
    };

    const getFileName = (p) => p.split('/').pop();

    return (
        <div>
            <Button
                icon={<FolderOpenOutlined/>}
                onClick={openModal}
                size="small"
                block
                style={{marginBottom: 8, fontSize: 12}}
            >
                Select Files
            </Button>

            {selectedFiles.length > 0 && (
                <div style={{maxHeight: 'calc(80vh - 200px)', overflow: 'auto'}}>
                    {selectedFiles.map(file => (
                        <Tag
                            key={file}
                            closable
                            onClose={() => handleRemoveFile(file)}
                            style={{display: 'block', marginBottom: 4, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                            title={file}
                        >
                            {getFileName(file)}
                        </Tag>
                    ))}
                </div>
            )}

            <Modal
                title={`WSO2 MI Files (${totalFiles})`}
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                okText="Apply"
                cancelText="Cancel"
                width={700}
                styles={{body: {maxHeight: '60vh', overflow: 'auto'}}}
            >
                <div style={{marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center'}}>
                    <Input
                        value={projectPath}
                        size="small"
                        readOnly
                        style={{fontSize: 12, flex: 1}}
                        addonBefore={<Text style={{fontSize: 11}}>Path</Text>}
                    />
                    <Button size="small" icon={<FolderOutlined/>} onClick={openBrowse}>
                        Browse
                    </Button>
                </div>
                {loading ? (
                    <Spin style={{display: 'block', textAlign: 'center', padding: 32}}/>
                ) : !treeData.length && loaded ? (
                    <Empty description="No XML files found in this directory" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                ) : loaded ? (
                    <Tree
                        checkable
                        checkedKeys={checkedKeys}
                        onCheck={onCheck}
                        treeData={processTreeData(treeData)}
                        defaultExpandedKeys={[]}
                        showLine={{showLeafIcon: false}}
                        style={{fontSize: 12}}
                    />
                ) : null}
            </Modal>

            <Modal
                title={null}
                open={browseOpen}
                onCancel={() => setBrowseOpen(false)}
                width={600}
                footer={
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text type="secondary" style={{fontSize: 12}}>
                            {browseDirs.length} folder(s)
                        </Text>
                        <div style={{display: 'flex', gap: 8}}>
                            <Button onClick={() => setBrowseOpen(false)}>Cancel</Button>
                            <Button type="primary" onClick={() => selectBrowseDir(browseCurrentPath)}>
                                Select This Folder
                            </Button>
                        </div>
                    </div>
                }
            >
                {/* Toolbar */}
                <div style={{
                    display: 'flex', gap: 6, alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 8
                }}>
                    <Button
                        size="small"
                        icon={<ArrowLeftOutlined/>}
                        disabled={browseCurrentPath === browseParent}
                        onClick={() => fetchBrowse(browseParent)}
                        title="Go up"
                    />
                    <Button
                        size="small"
                        icon={<FolderOpenOutlined/>}
                        onClick={() => fetchBrowse('/')}
                        title="Go to root"
                    />
                </div>

                {/* Breadcrumb path */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2,
                    marginBottom: 8, padding: '6px 8px',
                    background: '#fafafa', borderRadius: 4, border: '1px solid #f0f0f0'
                }}>
                    {browseCurrentPath.split('/').filter(Boolean).map((seg, i, arr) => {
                        const segPath = '/' + arr.slice(0, i + 1).join('/');
                        return (
                            <span key={segPath} style={{display: 'inline-flex', alignItems: 'center'}}>
                                {i > 0 && <span style={{margin: '0 2px', color: '#999'}}>/</span>}
                                <span
                                    onClick={() => fetchBrowse(segPath)}
                                    style={{
                                        cursor: 'pointer', fontSize: 12, color: '#1677ff',
                                        padding: '1px 4px', borderRadius: 3,
                                    }}
                                    onMouseEnter={e => e.target.style.background = '#e6f4ff'}
                                    onMouseLeave={e => e.target.style.background = 'transparent'}
                                >
                                    {seg}
                                </span>
                            </span>
                        );
                    })}
                    {!browseCurrentPath || browseCurrentPath === '/' ? (
                        <Text type="secondary" style={{fontSize: 12}}>/</Text>
                    ) : null}
                </div>

                {/* Directory listing */}
                <div style={{maxHeight: '45vh', overflow: 'auto'}}>
                    {browseLoading ? (
                        <Spin style={{display: 'block', textAlign: 'center', padding: 32}}/>
                    ) : browseDirs.length === 0 ? (
                        <Empty description="No subdirectories" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                    ) : (
                        <div>
                            {browseDirs.map(item => (
                                <div
                                    key={item.path}
                                    onClick={() => fetchBrowse(item.path)}
                                    style={{
                                        display: 'flex', alignItems: 'center', padding: '6px 10px',
                                        cursor: 'pointer', borderRadius: 4, transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <FolderOutlined style={{fontSize: 16, color: '#faad14', marginRight: 10}}/>
                                    <Text style={{fontSize: 13}}>{item.name}</Text>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default FileExplorer;
