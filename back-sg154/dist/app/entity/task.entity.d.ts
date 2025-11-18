export declare class Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}
