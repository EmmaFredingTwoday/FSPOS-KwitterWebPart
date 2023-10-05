import * as React from 'react';
import type { IFsposKwitterProps } from './IFsposKwitterProps';
import KwitterPost from './KwitterPost';
import ShowDialog from './ShowDialog';
import { IKwitterItem } from './Interfaces';
import { Logger, LogLevel } from "@pnp/logging";
import { getSP } from '../pnpjsConfig';

const FsposKwitter: React.FC<IFsposKwitterProps> = ({ currentUser, ...props }) => {
  const [items, setItems] = React.useState<any>([]);
  const _sp = React.useRef(getSP());

  const _readAllKwitterItems = async () => {
    try {
      const response: IKwitterItem[] = await _sp.current.web.lists
        .getByTitle(props.listName)
        .items
        .orderBy("Created", false)(); 
      setItems(response);
      console.log(response);
    } catch (err) {
      Logger.write(`(_readAllKwitterItems) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  };

  const handleItemUpdate = (updatedItem: any) => {
    const newItems = items.map((item : any) => item.Id === updatedItem.Id ? updatedItem : item);
    setItems(newItems);
  };

  React.useEffect(() => {
    _readAllKwitterItems().catch(console.error);
  }, []);

  if(props.showButton === true){
    return (
      <section>
        <ShowDialog onClose={() => console.log("Closed")} onSave={() => console.log("Saved")} updatePosts={_readAllKwitterItems} currentUser={currentUser} list={props.listName}/>
        <KwitterPost showAll={props.showAll} items={items} handleItemUpdate={handleItemUpdate} currentUser={currentUser} list={props.listName} />
      </section>
    );
  }else{
  return (
      <section>
        <KwitterPost showAll={props.showAll} items={items} handleItemUpdate={handleItemUpdate} currentUser={currentUser} list={props.listName} />
      </section>
    );
  }
};

export default FsposKwitter;
