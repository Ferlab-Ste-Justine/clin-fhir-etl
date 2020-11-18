import dotenv from 'dotenv';
dotenv.config();
import { GoogleSheetLoader } from "./loader/GoogleSheetLoader";
import { AppLogger, initLoggers } from './log/Logger';
import { ELASTIC_SEARCH_HOST } from './data/Constants';
import { ElasticSearch } from './network/ElasticSearch';

const start = async () => {
    try {
        initLoggers();
        AppLogger.of("main").info("Loading data from Google Sheet");
        const data = await GoogleSheetLoader.load();
        AppLogger.of("main").info(`Exporting the data to ElasticSearch host: ${ELASTIC_SEARCH_HOST}`);
        ElasticSearch.upload(data);
    } catch (error) {
        AppLogger.of("main").error(error);
    }
};


start();