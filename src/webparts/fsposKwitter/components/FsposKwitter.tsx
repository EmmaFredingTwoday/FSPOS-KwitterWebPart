import * as React from 'react';
import type { IFsposKwitterProps} from './IFsposKwitterProps';
import  KwitterPost from './KwitterPost';
import ShowDialog from './ShowDialog';

export default class FsposKwitter extends React.Component<IFsposKwitterProps, {}> {  
 
   public render(): React.ReactElement<IFsposKwitterProps> {
   console.log(this.props.showAll)
    return (
      <section>
      <ShowDialog onClose={this._close} onSave={this._save}/>
      <KwitterPost showAll={this.props.showAll}/>
      </section>
    );
  }  

  private _close = async (): Promise<void> => {
   // await this.close();
   // await this.onClose();
  }

  private _save = async (): Promise<void> => {
  }
}
