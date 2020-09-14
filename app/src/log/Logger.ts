import chalk from "chalk";

export interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

class ConsoleLogger implements Logger {
    constructor(private readonly namespace: string) {}

    info(message: string): void {
        console.log(`${chalk.cyan(chalk.bold(this.namespace))} ${chalk.blue(message)}`); 
    }
    warn(message: string): void {
        console.log(`${chalk.yellow(chalk.bold(this.namespace))} ${chalk.yellow(message)}`); 
    }
    error(message: string): void {
        console.log(`${chalk.red(chalk.bold(this.namespace))} ${chalk.red(message)}`); 
    }
}

export enum LoggerType {
    CONSOLE,
    FILE,
    OUTPUT
}

export type LoggerEntry = {
    type: LoggerType;
    name: string;
    alias?: string;
}

export class AppLogger {
    private static readonly loggers: { [key: string]: Logger } = {};

    public static init(...types: LoggerEntry[]): void {
        types.forEach(entry => {
            const logger = this.createLogger(entry);
            this.loggers[entry.name] = logger;
            if(entry.alias != null) {
                this.loggers[entry.alias] = logger;
            }
        });
    }

    private static createLogger(entry: LoggerEntry): Logger {
        switch (entry.type) {
        case LoggerType.CONSOLE:
            return new ConsoleLogger(entry.name);

        default:
            throw new Error();
        }
    }

    public static of(namespace: string): Logger {
        return this.loggers[namespace];
    }
}

export const initLoggers = () : void => {
    AppLogger.init({
        name: "Main",
        alias: "main",
        type: LoggerType.CONSOLE
    },{
        name:	"FHIR Api",
        alias: "api",
        type: LoggerType.CONSOLE
    },{
        name: "Network",
        alias: "net",
        type: LoggerType.CONSOLE
    });
};