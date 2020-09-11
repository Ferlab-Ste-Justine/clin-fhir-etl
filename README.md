# CLIN FHIR ETL

clin-fhir-et is a typescript application that reads FHIR data from a Google Sheet and upload it to a FHIR server.

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
3. Create an `.env` file at the root of the project
    ```bash
    touch .env
    ```
4. Set your **FHIR server url**, **Google Sheet ID** and the **GOOGLE API KEY *(that you copied earlier)***
    ```
    FHIR_SERVER_HOST=...
    GOOGLE_API_KEY=...
    GOOGLE_SHEET_ID=...
    ```
5. Start the application with 
    ```
    yarn start
    ```
    or
    ```
    npm run start
    ```

## License
APACHE V2