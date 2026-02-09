import mongoose, { Schema, Document } from "mongoose";

export interface IAudioMessage extends Document {
    title: string;
    speaker: string;
    audioUrl: string;
    duration: number;
    category: string;
    plays: number;
    createdAt: Date;
}

const AudioMessageSchema = new Schema<IAudioMessage>({
    title: { type: String, required: true },
    speaker: { type: String, required: true },
    audioUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    category: { type: String, required: true },
    plays: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AudioMessage || mongoose.model<IAudioMessage>("AudioMessage", AudioMessageSchema);
