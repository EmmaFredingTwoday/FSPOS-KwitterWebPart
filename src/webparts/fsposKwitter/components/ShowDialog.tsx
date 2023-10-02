import * as React from 'react';
import { PrimaryButton } from '@fluentui/react/lib';
import  TaskDialog from './Dialog'
export interface IKwitterDialogState {
  items: [];
  errors: string[];
}

export interface IKwitterDialogProps {
  updatePosts: () => void;
  onClose: () => void;
  onSave: () => void;
  items?: any[];
  errors?: string[];
}



export default class ShowDialog extends React.Component<IKwitterDialogProps> {
  constructor(props: IKwitterDialogProps) {
    super(props);
    this.state = {
      items: [],
      errors: [],
    };
  }

  public render(): React.ReactElement<IKwitterDialogProps> {  
    return (
      <section>
          <div style={{textAlign: 'center', marginTop: '10px', marginBottom: '30px'}}>
            <PrimaryButton text='Skriv inlägg' onClick={this._createTask} />
          </div>   
      </section>
    );
  }

  private _createTask = async (): Promise<void> => {
    const taskDialog = new TaskDialog(      
        async (header, content) => {
            this.props.updatePosts();
        },
        async () => alert('You closed the dialog!')
    );
    try {
      await taskDialog.show();
    } catch (error) {
        console.error("Error showing the dialog:", error);
    }
}
}