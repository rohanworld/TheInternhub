
import { app } from '@/utils/firebase';
import {z} from 'zod';

export const InternshipType = z.object({
    // id: z.string(),
    title: z.string().min(5,{message: 'Title must be at least 5 characters long'}),
    description: z.string().optional(),
    questionImageURL: z.string().optional(),
    category : z.string().optional(),
    location : z.string().optional(),
    stipend : z.string().optional(),
    duration : z.string().optional(),
    applyBy : z.string().optional(),
    anonymity: z.boolean().optional(),

});