const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

function getXmlFiles(dir, baseDir) {
    let results = [];
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const relativePath = path.relative(baseDir, fullPath);
            if (['.git', '.idea', '.vscode', 'target', 'docker', 'deployment', 'node_modules'].includes(item)) {
                continue;
            }
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                results = results.concat(getXmlFiles(fullPath, baseDir));
            } else if (item.endsWith('.xml') && !item.startsWith('pom')) {
                results.push({
                    key: relativePath,
                    title: item,
                    path: relativePath,
                    isLeaf: true,
                    size: stat.size,
                });
            }
        }
    } catch (e) { /* skip unreadable dirs */ }
    return results;
}

function buildTree(files) {
    const root = [];
    const map = {};

    for (const file of files) {
        const parts = file.path.split(path.sep);
        let currentLevel = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const currentPath = parts.slice(0, i + 1).join('/');
            if (!map[currentPath]) {
                const node = {
                    key: currentPath,
                    title: part,
                    path: currentPath,
                };
                if (i === parts.length - 1) {
                    node.isLeaf = true;
                    node.size = file.size;
                } else {
                    node.children = [];
                }
                map[currentPath] = node;
                currentLevel.push(node);
            }
            if (map[currentPath].children) {
                currentLevel = map[currentPath].children;
            }
        }
    }
    return root;
}

module.exports = function (app) {
    app.use(
        '/ollama-api',
        createProxyMiddleware({
            target: 'https://ollama.com',
            changeOrigin: true,
            pathRewrite: { '^/ollama-api': '/api' },
        })
    );

    app.get('/wso2mi/tree', (req, res) => {
        const root = req.query.root;
        if (!root) {
            return res.status(400).json({ error: 'root parameter required' });
        }
        try {
            if (!fs.existsSync(root)) {
                return res.status(404).json({ error: 'directory not found' });
            }
            const files = getXmlFiles(root, root);
            const tree = buildTree(files);
            res.json({ tree, totalFiles: files.length, root });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/wso2mi/browse', (req, res) => {
        const dir = req.query.path || '/';
        try {
            const items = fs.readdirSync(dir);
            const dirs = [];
            for (const item of items) {
                if (item.startsWith('.')) {continue;}
                try {
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        dirs.push({ name: item, path: fullPath });
                    }
                } catch (e) { /* skip */ }
            }
            dirs.sort((a, b) => a.name.localeCompare(b.name));
            res.json({ current: dir, parent: path.dirname(dir), dirs });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/wso2mi/file', (req, res) => {
        const filePath = req.query.path;
        const root = req.query.root;
        if (!filePath || !root) {
            return res.status(400).json({ error: 'path and root parameters required' });
        }
        const fullPath = path.join(root, filePath);
        if (!fullPath.startsWith(root)) {
            return res.status(403).json({ error: 'access denied' });
        }
        try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            res.json({ path: filePath, content });
        } catch (err) {
            res.status(404).json({ error: 'file not found' });
        }
    });

    app.get('/wso2mi/files', (req, res) => {
        const paths = req.query.paths;
        const root = req.query.root;
        if (!paths || !root) {
            return res.status(400).json({ error: 'paths and root parameters required' });
        }
        const pathList = Array.isArray(paths) ? paths : paths.split(',');
        const files = [];
        for (const p of pathList) {
            const fullPath = path.join(root, p.trim());
            if (!fullPath.startsWith(root)) {
                continue;
            }
            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                files.push({ path: p.trim(), content });
            } catch (e) { /* skip unreadable */ }
        }
        res.json({ files });
    });
};
