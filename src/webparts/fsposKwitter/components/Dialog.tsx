import React, { useState } from 'react';
import { IKwitterDialogProps } from './IDialogProps';
import {
    TextField, 
    DefaultButton, PrimaryButton,
    DialogFooter, DialogContent
} from '@fluentui/react/lib';
import { getSP } from '../pnpjsConfig';
import { Logger, LogLevel } from "@pnp/logging";

const KwitterDialogContent: React.FC<IKwitterDialogProps> = (props) => {
    const [header] = useState('');
    const [content, setContent] = useState('');
    const [hashtagString, setHashtagString] = useState('');

    return (
        <div>
            <DialogContent title="Skriv nytt inlägg" onDismiss={props.onClose}>
                <div>
                    <TextField
                        label="Innehåll"
                        rows={10}
                        multiline
                        onChange={(e, newValue) => setContent(newValue || '')}
                        value={content}
                    />
                    <TextField
                        label="Hashtags (comma separated)"
                        onChange={(e, newValue) => setHashtagString(newValue || '')}
                        value={hashtagString}
                        placeholder="e.g. #fun, #sunnyday"
                    />
                </div>
                <DialogFooter>
                    <DefaultButton text="Cancel" title="Cancel" onClick={props.onClose} />
                    <PrimaryButton
                        text="Skapa inlägg"
                        title="Skapa inlägg"
                        onClick={async () => {
                            await props.onSave(header, content, hashtagString);
                        }}
                    />
                </DialogFooter>
            </DialogContent>
        </div>
    );
}

const KwitterDialog = ({ onSave, onClose }: IKwitterDialogProps) => {
    const _sp = getSP();
    const LOG_SOURCE = "🅿PnPjsExample";

    const _saveToList = async (header: string, content: string, hashtagString: string) => {
        try {
            const hashtagsArray = hashtagString.split(',').map(tag => tag.trim().replace(/^#/, ''));
            
            await _sp.web.lists.getByTitle('Taylor Kwitter 14').items.add({
                Title: "Loomis",
                Text: content || "Unknown",
                Likes: 0,
                hashtag: JSON.stringify(hashtagsArray),
            });
        } catch (err) {
            Logger.write(`${LOG_SOURCE} (_saveToList) - ${JSON.stringify(err)} - `, LogLevel.Error);
        }
        await onSave(header, content, hashtagString);
    }
    
    return (
        <KwitterDialogContent
            onSave={_saveToList}
            onClose={onClose}
        />
    ); 
}

export default KwitterDialog;
