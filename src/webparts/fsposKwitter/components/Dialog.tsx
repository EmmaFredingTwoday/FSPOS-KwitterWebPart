import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import styles from './FsposKwitter.module.scss';
import { IKwitterDialogProps } from './IDialogProps';
import { IKwitterDialogState } from './IDialogState';
import { IItemAddResult } from '@pnp/sp/items';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import {
    TextField,
    DefaultButton,
    PrimaryButton,
    DialogFooter,
    DialogContent
} from '@fluentui/react/lib';
import { SPFI, spfi } from "@pnp/sp";
import { getSP } from '../pnpjsConfig';
import { Logger, LogLevel } from "@pnp/logging";
import { Caching } from "@pnp/queryable";

class KwitterDialogContent extends React.Component<IKwitterDialogProps, IKwitterDialogState> {

    constructor(props: IKwitterDialogProps) {
        super(props);

        this.state = {
            header: '',
            content:'',
            author:''
        };        
    }
    
    public render(): JSX.Element {
        return (<div>
            <DialogContent
                title="Skriv nytt inlägg"
                onDismiss={this.props.onClose}
                >
            <div>
                <div>
                    <TextField label="#"
                        onChange={this._onheaderChange}
                        value={this.state.header} />
                    <TextField label="Innehåll"
                        rows={10}
                        multiline={true}
                        onChange={this._onContentChange}
                        value={this.state.content} />                    
                </div>
            </div>

            <DialogFooter>
                <DefaultButton text="Cancel"
                        title="Cancel" onClick={this.props.onClose} />
                <PrimaryButton text="Skapa inlägg"
                        title="Skapa inlägg" onClick={async () => { await this.props.onSave(this.state.header!, this.state.content!); }} />
            </DialogFooter>
        </DialogContent>
    </div>);
    }

    private _onheaderChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({ header: newValue });
    }

    private _onContentChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({ content: newValue });
    }
}

export default class KwitterDialog extends BaseDialog {
    private _sp: SPFI; 
    private LOG_SOURCE = "🅿PnPjsExample";
    /**
     * Constructor for the dialog window
     */
    constructor(
        public onSave: (header: string, content: string) => Promise<void>,
        public onClose: () => Promise<void>) {
        super({isBlocking: true});        
        this._sp = getSP();
    }
  
    public render(): void {
        ReactDOM.render(<KwitterDialogContent
                onSave={this._saveToList}
                onClose={this._close}
            />,
            this.domElement);
    }
  
    public getConfig(): IDialogConfiguration {
      return {
        isBlocking: true
      };
    }

    protected onAfterClose(): void {
        ReactDOM.unmountComponentAtNode(this.domElement);
    }

    private _saveToList = async (header: string, content: string): Promise<void> => {
        try{
            const spCache = spfi(this._sp).using(Caching({store:"session"}));
              const iar:IItemAddResult = await spCache.web.lists.getById('61ed2056-88b9-47e1-b25b-170a2fd278b8').items.add({
                  Title: "Loomis",
                  hashtag: header || "Unknown",
                  content: content || "Unknown",
                  atTag: "Loomis",
                  likes: 0,
                })
                console.log(iar);
            } 	
            catch(err){
            Logger.write(`${this.LOG_SOURCE} (_saveToList) - ${JSON.stringify(err)} - `, LogLevel.Error);
        }        
        await this.onSave(header, content);
        await this.close();
    }
  
    private _close = async (): Promise<void> => {
        await this.close();
        await this.onClose();
    }
}