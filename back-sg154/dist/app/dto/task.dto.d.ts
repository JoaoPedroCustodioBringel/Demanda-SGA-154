export declare class CreateTaskDto {
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    dueDate?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
}
