const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        http.get(`${BASE_URL}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('--- Starting Workshop 03 Server Tests ---');
    let allPassed = true;

    // Test 1: GET /
    try {
        const res = await makeRequest('/');
        const passed = res.status === 200 && res.body.includes('Welcome');
        console.log(`[Test 1] GET / -> Status: ${res.status} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 1] GET / Failed:', e.message);
        allPassed = false;
    }

    // Test 2: GET /about
    try {
        const res = await makeRequest('/about');
        const passed = res.status === 200 && res.body.includes('About');
        console.log(`[Test 2] GET /about -> Status: ${res.status} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 2] GET /about Failed:', e.message);
        allPassed = false;
    }

    // Test 3: GET /contact
    try {
        const res = await makeRequest('/contact');
        const passed = res.status === 200 && res.body.includes('Contact');
        console.log(`[Test 3] GET /contact -> Status: ${res.status} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 3] GET /contact Failed:', e.message);
        allPassed = false;
    }

    // Test 4: Static CSS
    try {
        const res = await makeRequest('/styles/style.css');
        const passed = res.status === 200 && res.headers['content-type'].includes('text/css');
        console.log(`[Test 4] GET /styles/style.css -> Status: ${res.status} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 4] GET /styles/style.css Failed:', e.message);
        allPassed = false;
    }

    // Test 5: API /api/time
    try {
        const res = await makeRequest('/api/time');
        const json = JSON.parse(res.body);
        const passed = res.status === 200 && json.datetime && json.timestamp;
        console.log(`[Test 5] GET /api/time -> Status: ${res.status}, datetime: ${json.datetime} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 5] GET /api/time Failed:', e.message);
        allPassed = false;
    }

    // Test 6: API /api/info
    try {
        const res = await makeRequest('/api/info');
        const json = JSON.parse(res.body);
        const passed = res.status === 200 && json.name && json.nodeVersion;
        console.log(`[Test 6] GET /api/info -> Status: ${res.status}, name: ${json.name} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 6] GET /api/info Failed:', e.message);
        allPassed = false;
    }

    // Test 7: 404 handler
    try {
        const res = await makeRequest('/non-existent-route-123');
        const passed = res.status === 404 && res.body.includes('404');
        console.log(`[Test 7] GET /non-existent-route-123 -> Status: ${res.status} [${passed ? 'PASS' : 'FAIL'}]`);
        if (!passed) allPassed = false;
    } catch (e) {
        console.error('[Test 7] 404 Handler Failed:', e.message);
        allPassed = false;
    }

    console.log('--- Test Summary ---');
    if (allPassed) {
        console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.log('❌ SOME TESTS FAILED');
        process.exit(1);
    }
}

// Wait 500ms for server to spin up if run concurrently
setTimeout(runTests, 500);
