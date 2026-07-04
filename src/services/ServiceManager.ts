import type { Adapter } from "@iobroker/adapter-core";
import { HAClient } from "../client/HAClient.js";
import type {
    CallServiceRequest,
    FireEventRequest,
    GetStateRequest,
    NotifyRequest,
} from "../types/ha.js";

export class ServiceManager {
    private readonly adapter: Adapter;
    private readonly client: HAClient;

    public constructor(adapter: Adapter) {
        this.adapter = adapter;
        this.client = new HAClient(adapter);
    }

    public async initialize(): Promise<void> {
        await this.client.initialize();
    }

    public async destroy(): Promise<void> {
        await this.client.destroy();
    }

    public async ping(): Promise<boolean> {
        return this.client.ping();
    }

    public async callService(
        request: CallServiceRequest,
    ): Promise<unknown> {
        return this.client.callService(
            request.domain,
            request.service,
            request.serviceData ?? {},
            request.target,
        );
    }

    public async notify(request: NotifyRequest): Promise<unknown> {
        return this.client.notify(
            request.message,
            request.title,
            request.target,
            request.data,
        );
    }

    public async getState(
        request: GetStateRequest,
    ): Promise<unknown> {
        return this.client.getState(request.entityId);
    }

    public async fireEvent(
        request: FireEventRequest,
    ): Promise<unknown> {
        return this.client.fireEvent(
            request.eventType,
            request.eventData ?? {},
        );
    }
}
