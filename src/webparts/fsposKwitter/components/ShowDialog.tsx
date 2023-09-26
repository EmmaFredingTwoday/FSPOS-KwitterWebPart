import * as React from 'react';
//import styles from './FsposKwitter.module.scss';
import { IKwitterDialogProps } from './IDialogProps';
import { PrimaryButton } from '@fluentui/react/lib';
//import { IFile, IResponseItem, IImageItem, IImageFile } from "./interfaces";
//import { Logger, LogLevel } from "@pnp/logging";
//import { Caching } from "@pnp/queryable";
//import { SPFI, spfi } from "@pnp/sp";
//import { getSP } from '../pnpjsConfig';
import  TaskDialog from './Dialog'
export interface IKwitterDialogState {
  items: [];
  errors: string[];
 // images: IImageFile[];
}


export default class ShowDialog extends React.Component<IKwitterDialogProps, IKwitterDialogState> {
  //ivate LIST_NAME = "Loomis_intranet";
  //private IMAGE_LIST_NAME: "Images1";
  //private DOCUMENT_NAME = "Documents";
  //private _sp: SPFI;  

  constructor(props: IKwitterDialogProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      errors: [],
      //images: []
    };
    //this._sp = getSP();
  }

  public render(): React.ReactElement<IKwitterDialogProps> {  
   // this._readListItems();  
   // this. _readImages(); 

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
      async (header, content) => {},
      async () => alert('You closed the dialog!')
    );
   // await this._readListItems().then();
    taskDialog.show();  
  }

 /* private _readListItems = async (): Promise<void> => {
    try{
      const spCache = spfi(this._sp).using(Caching({store:"session"}));

      const response: IResponseItem[] = await spCache.web.lists
        .getByTitle(this.LIST_NAME)
        .items
        .select("Id", "Title", "Content", "Author0", "Date","imageLink")
        .orderBy("Created", false)();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id || 123,
          Title: item.Title || "Unknown",
          Content: item.Content || "Unknown",
          Author0: item.Author0 || "Unknown",
          Date: item.Date || "Unknown",
          imageLink: item.imageLink || "Unknown",
          Created: item.Created
        };
      });
      this.setState({ items });
    } 
      catch(err){
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

  private _readImages = async (): Promise<void> => {
    try{
      const spCache = spfi(this._sp).using(Caching({store:"session"}));

      const response: IImageItem[] = await spCache.web.lists
        .getById('eb5302f6-c3c9-4375-8db8-46b85e2a7862')
        .items
        .select()();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const images: IImageFile[] = response.map((item: IImageItem) => {
        return {
          Id: item.Id || 123,
          LinkJson: item.exampleImage|| "Unknown"
        };
      });
      this.setState({ images });

      } 	
      catch(err){
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }  */
}