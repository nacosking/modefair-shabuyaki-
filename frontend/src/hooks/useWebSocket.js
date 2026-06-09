import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

/**
 * useWebSocket — connects to the Spring STOMP broker and subscribes to topics.
 *
 * @param {Object} subscriptions  Map of topic → handler: { '/topic/tables': (msg) => {} }
 * @param {boolean} enabled       Set false to skip connecting (e.g. non-admin pages)
 */
export default function useWebSocket(subscriptions = {}, enabled = true) {
  const clientRef      = useRef(null);
  const subsRef        = useRef(subscriptions);
  const subscriptionsActive = useRef([]);

  // Keep handler refs fresh without reconnecting
  useEffect(() => {
    subsRef.current = subscriptions;
  });

  const connect = useCallback(() => {
    if (clientRef.current?.active) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000,
      onConnect: () => {
        console.log('[WS] Connected');
        // Subscribe to all registered topics
        subscriptionsActive.current = Object.keys(subsRef.current).map((topic) =>
          client.subscribe(topic, (message) => {
            try {
              const payload = JSON.parse(message.body);
              subsRef.current[topic]?.(payload);
            } catch (e) {
              console.error('[WS] Failed to parse message:', e);
            }
          })
        );
      },
      onDisconnect: () => console.log('[WS] Disconnected'),
      onStompError: (frame) => console.error('[WS] STOMP error:', frame),
    });

    client.activate();
    clientRef.current = client;
  }, []);

  const disconnect = useCallback(() => {
    subscriptionsActive.current.forEach((sub) => {
      try { sub.unsubscribe(); } catch (_) {}
    });
    subscriptionsActive.current = [];
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
    }
    clientRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    connect();
    return () => disconnect();
  }, [enabled, connect, disconnect]);

  return { disconnect };
}
