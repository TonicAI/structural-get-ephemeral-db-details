const core = require('@actions/core');
const https = require('https');
const { version } = require('./package.json');

async function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getEphemeralConnectionSettings(apiHost, apiKey, jobId) {
  const url = new URL(`/api/job/${jobId}/ephemeral_database_info`, apiHost);
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: 'GET',
    headers: {
      'Authorization': `apikey ${apiKey}`,
      'User-Agent': 'Tonic-Github-Action',
      'X-GitHub-Action': 'structural-get-ephemeral-db-details',
      'X-GitHub-Action-Version': version
    }
  };

  const response = await makeRequest(options);
  if (response.statusCode >= 400) {
    throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.body)}`);
  }

  return response.body;
}

async function run() {
  try {
    const apiHost = core.getInput('structural-url');
    const apiKey = core.getInput('structural-api-key');
    const jobId = core.getInput('job-id');

    core.info(`Obtaining ephemeral database connection settings for database linked to job ID: ${jobId}`);
    const ephemeralSettings = await getEphemeralConnectionSettings(apiHost, apiKey, jobId);
    core.info('Ephemeral database connection settings retrieved');

    // Set connection details outputs
    core.setOutput('hostname', ephemeralSettings.hostname || '');
    core.setOutput('port', ephemeralSettings.port ? ephemeralSettings.port.toString() : '');
    core.setOutput('database-name', ephemeralSettings.databaseName || '');
    core.setOutput('database-username', ephemeralSettings.databaseUserName || '');
    core.setOutput('database-password', ephemeralSettings.databasePassword || '');
    core.setOutput('database-type', ephemeralSettings.databaseType || '');

    // Set ephemeral database metadata outputs
    core.setOutput('ephemeral-database-name', ephemeralSettings.name || '');
    core.setOutput('ephemeral-entity-id', ephemeralSettings.databaseEntityId || '');
    core.setOutput('status', ephemeralSettings.status || '');
    // Set raw response
    core.setOutput('raw-response', JSON.stringify(ephemeralSettings));

    core.info('Ephemeral database connection details set as outputs successfully');

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
