# CLIN FHIR ETL

clin-fhir-etl is a typescript application that reads data from a Google Sheet and upload it to a FHIR server.

This project requires a Google Developer account.

## Installation & Usage

### Google Developper Api Key

With the api v4, Google requires anyone reading (or writing) data from Google Sheets to be authenticated.

You need a Google Developer account to use this application.

1. Go to https://console.developers.google.com and login
2. On the sidebar, click on "Credentials"
3. Click on "CREATE CREDENTIALS" button, then select "API KEY"
4. Copy the API KEY

### Project

1. Clone this repository

   ```bash
   git clone git@github.com:Ferlab-Ste-Justine/clin-fhir-etl.git
   ```

2. Install the dependencies (with `yarn` or `npm`)
   ```bash
   yarn
   ```
   or
   ```
   npm install
   ```
3. Create an `.env` file in the `app/` folder (`.env.development` is an example)
   ```bash
   cd app && touch .env
   ```
4. Set your **FHIR server url**, **Google Sheet ID** and the **GOOGLE API KEY _(that you copied earlier)_**

   ```
   FHIR_SERVER_HOST=...
   GOOGLE_API_KEY=...
   GOOGLE_SHEET_ID=...
   AUTH_REQUIRED=false
   ```

   **IMPORTANT**
   If you're going to upload the data to a remote FHIR host(like in QA), you need to set these additional environement variables for authentication

   ```
   FHIR_AUTH_URL=Auth server url (ex, https://auth.qa.cqdg.ferlab.bio)
   FHIR_AUTH_CLIN_REALM=KEYCLOAK CLIN REALM
   FHIR_AUTH_CLIENT_ID=CLIENT ID IN KEYCLOAK
   FHIR_AUTH_CLIENT_SECRET=CLIENT SECRET IN KEYCLOAK
   ```

   and change AUTH_REQUIRED to `true`

   ```
   AUTH_REQUIRED=true
   ```

5. Export data to fhir with
   `yarn start:fhir`
   or
   `npm run start:fhir`

6. Export data to elasticsearch
   `yarn start:elastic`
   or
   `npm run start:elastic`

### Docker

You can also run the applicaiton with docker. You will need the `.env` as seen in [steps 3 and 4](#project)

```bash
docker-compose up
```

## License

APACHE V2
