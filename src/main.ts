import { Adapter, AdapterOptions } from "@iobroker/adapter-core";
import { HAServices } from "./HAServices.js";

class HAServicesAdapter extends Adapter {
    private haServices!: HAServices;

    public constructor(options: Partial<AdapterOptions> = {}) {
        super({
            ...options,
            name: "ha-services",
        });

        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("message", this.onMessage.bind(this));
    }

    private async onReady(): Promise<void> {
        this.log.info("Starting ioBroker.ha-services");

        this.haServices = new HAServices(this);

        try {
            await this.haServices.initialize();

            this.setState("info.connection", true, true);

            this.log.info("Adapter started successfully");
        } catch (error) {
            this.setState("info.connection", false, true);

            this.log.error(
                error instanceof Error ? error.message : String(error),
            );
        }
    }

    private async onUnload(callback: () => void): Promise<void> {
        try {
            if (this.haServices) {
                await this.haServices.destroy();
            }

            callback();
        } catch {
            callback();
        }
    }

    private onStateChange(
        id: string,
        state: ioBroker.State | null | undefined,
    ): void {
        if (!state) {
            return;
        }

        this.log.silly(`State changed: ${id} = ${JSON.stringify(state.val)}`);
    }

    private onObjectChange(
        id: string,
        obj: ioBroker.Object | null | undefined,
    ): void {
        this.log.silly(`Object changed: ${id}`);

        if (!obj) {
            return;
        }
    }

    private async onMessage(obj: ioBroker.Message): Promise<void> {
        if (!obj.command) {
            return;
        }

        const response = await this.haServices.handleMessage(obj);

        if (obj.callback) {
            this.sendTo(obj.from, obj.command, response, obj.callback);
        }
    }
}

if (require.main !== module) {
    module.exports = (options: Partial<AdapterOptions>) =>
        new HAServicesAdapter(options);
} else {
    (() => new HAServicesAdapter())();
}
