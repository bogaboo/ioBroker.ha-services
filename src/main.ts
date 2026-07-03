import * as utils from "@iobroker/adapter-core";

class HAServices extends utils.Adapter {

    constructor(options: Partial<utils.AdapterOptions> = {}) {

        super({
            ...options,
            name: "ha-services"
        });

        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.on("message", this.onMessage.bind(this));
    }

    private async onReady(): Promise<void> {

        this.log.info("HA Services Adapter gestartet");

        await this.setState("info.connection", false, true);

    }

    private async onUnload(callback: () => void): Promise<void> {

        callback();

    }

    private async onMessage(obj: ioBroker.Message): Promise<void> {

        if (!obj.command) {
            return;
        }

        this.log.debug(`Command: ${obj.command}`);

    }

}

if (require.main !== module) {

    module.exports = (options: Partial<utils.AdapterOptions>) =>
        new HAServices(options);

} else {

    (() => new HAServices())();

}
