import type { Adapter, Message } from "@iobroker/adapter-core";
import { ServiceManager } from "./services/ServiceManager.js";

export class HAServices {
    private readonly adapter: Adapter;
    private readonly serviceManager: ServiceManager;

    public constructor(adapter: Adapter) {
        this.adapter = adapter;
        this.serviceManager = new ServiceManager(adapter);
    }

    /**
     * Initialisiert den Adapter.
     */
    public async initialize(): Promise<void> {
        this.adapter.log.debug("Initializing HA Services...");

        await this.createObjects();
        await this.serviceManager.initialize();

        this.adapter.log.info("HA Services initialized.");
    }

    /**
     * Gibt alle Ressourcen frei.
     */
    public async destroy(): Promise<void> {
        await this.serviceManager.destroy();
    }

    /**
     * Verarbeitet Nachrichten aus sendTo().
     */
    public async handleMessage(message: Message): Promise<unknown> {
        switch (message.command) {
            case "callService":
                return this.serviceManager.callService(message.message);

            case "notify":
                return this.serviceManager.notify(message.message);

            case "getState":
                return this.serviceManager.getState(message.message);

            case "fireEvent":
                return this.serviceManager.fireEvent(message.message);

            case "ping":
                return this.serviceManager.ping();

            default:
                throw new Error(`Unknown command: ${message.command}`);
        }
    }

    /**
     * Erstellt die Standardobjekte des Adapters.
     */
    private async createObjects(): Promise<void> {
        await this.adapter.extendObjectAsync("info.connection", {
            type: "state",
            common: {
                name: "Connection",
                type: "boolean",
                role: "indicator.connected",
                read: true,
                write: false,
                def: false,
            },
            native: {},
        });

        await this.adapter.setStateAsync("info.connection", {
            val: false,
            ack: true,
        });
    }
}
