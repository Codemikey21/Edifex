<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function getConversations(): JsonResponse
    {
        $user = auth('api')->user();

        $conversations = Conversation::with([
                'lastMessage.sender:id,name,avatar',
                'client:id,name,avatar',
                'worker:id,name,avatar',
            ])
            ->where('client_id', $user->id)
            ->orWhere('worker_id', $user->id)
            ->orderBy('last_message_at', 'desc')
            ->paginate(20);

        return response()->json($conversations);
    }

    public function getMessages(int $conversationId): JsonResponse
    {
        $user = auth('api')->user();

        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($q) use ($user) {
                $q->where('client_id', $user->id)
                  ->orWhere('worker_id', $user->id);
            })
            ->firstOrFail();

        $messages = Message::with(['sender:id,name,avatar'])
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        // Marcar mensajes como leídos
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'conversation_id' => 'required|integer|exists:conversations,id',
            'content'         => 'required_without:file_url|nullable|string|max:5000',
            'type'            => 'nullable|in:text,image,file,system',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();

        $conversation = Conversation::where('id', $request->conversation_id)
            ->where(function ($q) use ($user) {
                $q->where('client_id', $user->id)
                  ->orWhere('worker_id', $user->id);
            })
            ->firstOrFail();

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $user->id,
            'content'         => $request->content,
            'type'            => $request->type ?? 'text',
        ]);

        $message->load('sender:id,name,avatar');

        $conversation->update(['last_message_at' => now()]);

        // Broadcast via WebSocket
        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'message' => 'Mensaje enviado',
            'data'    => $message,
        ], 201);
    }

    public function createConversation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'worker_id' => 'required|integer|exists:users,id',
            'job_id'    => 'nullable|integer|exists:service_jobs,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();

        $conversation = Conversation::firstOrCreate([
            'client_id' => $user->id,
            'worker_id' => $request->worker_id,
            'job_id'    => $request->job_id,
        ]);

        return response()->json([
            'message' => 'Conversación creada',
            'data'    => $conversation->load(['client:id,name,avatar', 'worker:id,name,avatar']),
        ], 201);
    }
}
