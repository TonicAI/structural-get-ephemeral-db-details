# Get Ephemeral Database Details

A GitHub Action to retrieve ephemeral database connection details from Tonic Structural after a data generation has completed.

## Inputs

### `structural-url`
**Optional** The Structural API URL (e.g., `https://your-instance.tonic.ai`), defaults to `https://app.tonic.ai`.

### `structural-api-key`
**Required** Your Structural API key.

### `job-id`
**Required** The ID of the Structural job that has an associated ephemeral database.

## Outputs

### Connection Details

### `hostname`
The database hostname for connection.

### `port`
The database port for connection.

### `database-name`
The database name for connection.

### `database-username`
The database username for connection.

### `database-password`
The database password for connection.

### `database-type`
The type of database (e.g., MySql, Postgres).

### Ephemeral Database Metadata

### `database-entity-id`
The ID of the database entity in Ephemeral.

### `entity-name`
The name of the ephemeral database entity.

### `status`
The current status of the database.

### `raw-response`
The full JSON response from the API.

## Example Usage

```yaml
name: Get Ephemeral Database Connection
on: [push]

jobs:
  get-db-connection:
    runs-on: ubuntu-latest
    steps:
      - name: Get Ephemeral Database Details
        id: get-db
        uses: yourusername/ephemeral-get-db-details@v1
        with:
          structural-url: ${{ secrets.STRUCTURAL_API_URL }}
          structural-api-key: ${{ secrets.STRUCTURAL_API_KEY }}
          job-id: ${{ needs.generate-job.outputs.job-id }}

      - name: Connect to Database
        run: |
          echo "Database: ${{ steps.get-db.outputs.ephemeral-database-name }}"
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

This will compile the action into a single file in the `dist` folder using `@vercel/ncc`.

## Publishing

Before publishing, make sure to:
1. Build the action: `npm run package`
2. Commit the `dist` folder to the repository
3. Tag your release: `git tag -a v1 -m "Release v1"`
4. Push the tag: `git push origin v1`