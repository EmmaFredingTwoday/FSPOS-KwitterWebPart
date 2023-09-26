import * as React from "react";
import { IKwitterItem, IResponseItem  } from './Interfaces';
import { Logger, LogLevel } from "@pnp/logging";
import { Caching } from "@pnp/queryable";
import { SPFI, spfi } from "@pnp/sp";
import { getSP } from '../pnpjsConfig';

import { Icon } from '@fluentui/react/lib/Icon';
import dayjs from 'dayjs';

//const IconTest = () => <Icon iconName="Like" />;
  
import styles from './FsposKwitter.module.scss';

export interface IKwitterPostState {
    items: IKwitterItem[];
    filterItems: IKwitterItem[];
}

export interface IKwitterPost {
    showAll: boolean;
}


export default class KwitterPost extends React.Component<IKwitterPost, IKwitterPostState> {
   
    private LOG_SOURCE = "🅿PnPjsExample";
    private _sp: SPFI;  

    constructor(props:IKwitterPost){
        super(props);
    
        //Set initial state
        this.state = {
          items: [],
          filterItems: []
        }
        this._sp = getSP();
      }
    
    public render(): React.ReactElement<IKwitterPost> {
        
    this._readAllKwitterItems();
    return (
            <div>
                <section>
                    {this.state.items.map((item) => {
                        const shortDateFormat = dayjs(item.Created).format("YYYY-MM-DD HH:mm")
                        return( <div className={styles["tweet-wrap"]}>
                                    <div className={styles["tweet-header"]}>
                                    <img src={item.logo} alt="" className={styles.avator} />
                                    <div className="tweet-header-info">
                                            {item.Title} <span>@{item.atTag}</span> <span>. {shortDateFormat} </span>
                                            <p>{item.content}</p>                        
                                    </div>
                                    </div>
                                        <div className={styles["tweet-info-counts"]}>                 
                                            <Icon iconName="Like"/>
                                            <div className={styles.likes}>{item.likes}</div>
                                            <Icon iconName="hashtag" />
                                        </div>                                     
                                </div>
                            )    
                        })
                    }
                </section>    
            </div>
            );
        }

  private _readAllKwitterItems = async(): Promise<void> => {
    try{
      const spCache = spfi(this._sp).using(Caching({store:"session"}));

      const response: IKwitterItem[] = await spCache.web.lists
        .getById('61ed2056-88b9-47e1-b25b-170a2fd278b8')
        .items
        .select("Id", "Title", "content", "logo", "Created","likes","atTag")
        .orderBy("Created", false)();

      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IKwitterItem[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id,
          Title: item.Title,
          content: item.content,
          logo: item.logo,
          Created: item.Created,
          likes: item.likes,
          atTag: item.atTag
        };
      });

      
      //const filterItems = items.filter(item => item.atTag.match("Loomis"));
      //console.log("Show all " + filterItems)
      if(this.props.showAll){
        this.setState({items});
      }
      else{
        //Show all items
        this.setState({ items });
      }
    } 
      catch(err){
      Logger.write(`${this.LOG_SOURCE} (_readAllKwitterItems) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  }

}