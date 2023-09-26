export interface IKwitterDialogProps {
    onSave: (header: string, content: string) => Promise<void>;
    onClose: () => Promise<void>;
}