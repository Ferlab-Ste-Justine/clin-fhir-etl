import dotenv from 'dotenv';
dotenv.config();
import {GoogleSheetLoader} from "./loader/GoogleSheetLoader";
import {Network} from "./network/Network";
import { AppLogger, initLoggers } from './log/Logger';
import { FHIR_SERVER_HOST } from './data/Constants';

const start = async () => {
    try {
        initLoggers();
        AppLogger.of("main").info("Loading data from Google Sheet");
        const data = await GoogleSheetLoader.load();
        AppLogger.of("main").info(`Uploading data to FHIR service ${FHIR_SERVER_HOST}`);
        const network = new Network(data);
        network.upload();
    } catch (error) {
        AppLogger.of("main").error(error);
    }
};


start();