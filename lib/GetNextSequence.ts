import { Counter } from "@/models/counter";

export const getNextSequence = async(name:string): Promise<number> => {
    const updatedCounter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return updatedCounter.sequence_value;
}