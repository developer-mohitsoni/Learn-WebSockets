import type { RedisClientType } from "redis";
import { createClient } from "redis";

export class RedisSubscriptionManager {
	private static instance: RedisSubscriptionManager;
	private subscriber: RedisClientType;
	public publisher: RedisClientType;
	private subscriptions: Map<string, string[]>;
	private reverseSubscriptions: Map<
		string,
		{ [userId: string]: { userId: string; ws: WebSocket } }
	>;

	private constructor() {
		this.subscriber = createClient();
		this.publisher = createClient();
		//TODO: add reconnection and buffering logic here?
		this.publisher.connect();
		this.subscriber.connect();
		this.subscriptions = new Map<string, string[]>();
		this.reverseSubscriptions = new Map<
			string,
			{ [userId: string]: { userId: string; ws: WebSocket } }
		>();
	}

	static getInstance() {
		if (!RedisSubscriptionManager.instance) {
			RedisSubscriptionManager.instance = new RedisSubscriptionManager();
		}
		return RedisSubscriptionManager.instance;
	}

	subscribe(userId: string, room: string, ws: WebSocket) {
		this.subscriptions.set(userId, [
			...(this.subscriptions.get(userId) || []),
			room,
		]);

		this.reverseSubscriptions.set(room, {
			...(this.reverseSubscriptions.get(room) || {}),
			[userId]: { userId: userId, ws },
		});

		if (Object.keys(this.reverseSubscriptions.get(room) || {})?.length === 1) {
			console.log(`subscribing message from ${room}`);
			// This is the first subscriber to this room
			this.subscriber.subscribe(room, (payload) => {
				try {
					// const parsedPayload = JSON.parse(payload);
					const subscribers = this.reverseSubscriptions.get(room) || {};
					for (const { ws } of Object.values(subscribers)) {
						ws.send(payload);
					}
				} catch (e) {
					console.error("erroneous payload found?");
				}
			});
		}
	}

	unsubscribe(userId: string, room: string) {
		this.subscriptions.set(
			userId,
			this.subscriptions.get(userId)?.filter((x) => x !== room) || [],
		);
		if (this.subscriptions.get(userId)?.length === 0) {
			this.subscriptions.delete(userId);
		}
		delete this.reverseSubscriptions.get(room)?.[userId];
		if (
			!this.reverseSubscriptions.get(room) ||
			Object.keys(this.reverseSubscriptions.get(room) || {}).length === 0
		) {
			console.log(`unsubscribing from ${room}`);
			this.subscriber.unsubscribe(room);
			this.reverseSubscriptions.delete(room);
		}
	}

	async addChatMessage(room: string, message: string) {
		this.publish(room, {
			type: "message",
			payload: {
				message,
			},
		});
	}

	publish(
		room: string,
		message: { type: string; payload: { message: string } },
	) {
		console.log(`publishing message to ${room}`);
		this.publisher.publish(room, JSON.stringify(message));
	}
}
