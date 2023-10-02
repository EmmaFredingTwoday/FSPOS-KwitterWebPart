export interface IKwitterDialogProps {
    onSave: (header: string, content: string, hashtags: any) => Promise<void>;
    onClose: () => Promise<void>;
}