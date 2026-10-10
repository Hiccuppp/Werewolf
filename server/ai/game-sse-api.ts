import { subscribeGameEvents } from './game-event-stream.ts';

/**
 * SSE boundary for live observers.
 * Keeps transport concerns outside the game engine.
 */
export function createGameEventSSE(gameId: string): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const unsubscribe = subscribeGameEvents(gameId, send);
      send({ type: 'connected', gameId });

      return () => unsubscribe?.();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
