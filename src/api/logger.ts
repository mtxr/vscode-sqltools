class Logger {
    static packageName: string = '';
    static packageVersion: string = '';
    static logging: boolean = false;

    get packageName() {
        return Logger.packageName;
    }
    get packageVersion() {
        return Logger.packageVersion;
    }
    get logging() {
        return Logger.logging;
    }
    set packageName(val: string) {
        Logger.packageName = val;
    }
    set packageVersion(val: string) {
        Logger.packageVersion = val;
    }
    set logging(val: boolean) {
        Logger.logging = val;
    }

    static debug(message: string) {
        if (!Logger.isLogging()) return;
        console.log(`${Logger.packageName} (${Logger.packageVersion}): ` + (message));
    }

    static setLogging(param: boolean) {
        Logger.logging = param;
        Log('Logging is active');
        return Logger;
    }

    static isLogging() {
        return Logger.logging;
    }

    static setPackageName(param: string) {
        Logger.packageName = param;
        return Logger;
    }

    static getPackageName() {
        return Logger.packageName;
    }

    static setPackageVersion(param: string) {
        Logger.packageVersion = param;
        return Logger;
    }

    static getPackageVersion() {
        return Logger.packageVersion;
    }
}

let Log = (message: string) => Logger.debug(message);

export {
    Logger,
    Log
}
