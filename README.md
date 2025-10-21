# Get Ephemeral database connection details

A GitHub action to retrieve Ephemeral database connection details from Tonic Structural. The action provides the identifier of the data generation job that produced the database.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `structural-url` | The URL to the Structural API. For example: `https://your-instance.tonic.ai` | No | `https://app.tonic.ai` |
| `structural-api-key` | Your Structural API key | Yes | - |
| `job-id` | The identifier of the Structural data generation job that produced the Ephemeral database | Yes | - |

## Outputs

### Connection details

- `hostname`: The database hostname for the connection.
- `port`: The database port for the connection.
- `database-name`: The database name for the connection.
- `database-username`: The database username for the connection.
- `database-password`: The database password for the connection.
- `database-type`: The type of database. For example: MySQL, PostgreSQL.

### Ephemeral database metadata

- `database-entity-id`: The identifier of the Ephemeral database.
- `entity-name`: The name of the Ephemeral database.
- `status`: The current status of the database.
- `raw-response`: The full JSON response from the API.

## Example usage

```yaml
name: Get Ephemeral database connection details
on: [push]

jobs:
  get-db-connection:
    runs-on: ubuntu-latest
    steps:
      - name: Get Ephemeral database connection details
        id: get-db
        uses: TonicAI/structural-get-ephemeral-db-details@v1
        with:
          structural-url: ${{ secrets.STRUCTURAL_API_URL }}
          structural-api-key: ${{ secrets.STRUCTURAL_API_KEY }}
          job-id: ${{ needs.generate-job.outputs.job-id }}

      - name: Connect to the database
        run: |
          echo "Database: ${{ steps.get-db.outputs.database-name }}"
          echo "Status: ${{ steps.get-db.outputs.status }}"
          echo "Host: ${{ steps.get-db.outputs.hostname }}:${{ steps.get-db.outputs.port }}"

          # Use the connection details with your database client
          mysql -h ${{ steps.get-db.outputs.hostname }} \
                -P ${{ steps.get-db.outputs.port }} \
                -u ${{ steps.get-db.outputs.database-username }} \
                -p${{ steps.get-db.outputs.database-password }} \
                ${{ steps.get-db.outputs.database-name }}
```

## Development

### Setup
```bash
npm install
```

### Build
```bash
npm run package
```

This uses `@vercel/ncc` to compile the action into a single file in the `dist` folder.

## Publish

Before you publish, make sure to:
1. Build the action: `npm run package`
2. Commit the `dist` folder to the repository
3. Tag your release: `git tag -a v1 -m "Release v1"`
4. Push the tag: `git push origin v1`
