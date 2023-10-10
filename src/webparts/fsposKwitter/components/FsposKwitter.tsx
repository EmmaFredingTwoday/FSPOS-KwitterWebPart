import * as React from 'react';
import type { IFsposKwitterProps } from './IFsposKwitterProps';
import KwitterPost from './KwitterPost';
import ShowDialog from './ShowDialog';
import { IKwitterItem, IDDOption } from './Interfaces';
import { Logger, LogLevel } from "@pnp/logging";
import { getSP } from '../pnpjsConfig';

const FsposKwitter: React.FC<IFsposKwitterProps> = ({ currentUser, ...props }) => {
  const [items, setItems] = React.useState<any>([]);  
  const [dropdownOptions, setDropdownOptions] = React.useState<any>([]);
  const _sp = React.useRef(getSP());

  const _readAllKwitterItems = async () => {
    try {
      const response: IKwitterItem[] = await _sp.current.web.lists
        .getByTitle(props.listName)
        .items
        .orderBy("Created", false)(); 
      setItems(response);
      _getDropDownOptions(response);
    } catch (err) {
      Logger.write(`(_readAllKwitterItems) - ${JSON.stringify(err)} - `, LogLevel.Error);
    }
  };

  const _getDropDownOptions = async (items: IKwitterItem[]) => {
 
    const uniqueTitle = [...new Map(items.map(v => [v.Title, v])).values()]
    let ddOptions: IDDOption[] = [];
    uniqueTitle.forEach(item => {
      let value = {
        key: item.Title, id: item.Title
      }
      ddOptions.push(value)
    }) 
    setDropdownOptions(ddOptions);
    console.log("ddoptions "+  JSON.stringify(ddOptions));
    console.log("dropdownOptions " + dropdownOptions)
  };

  const handleItemUpdate = (updatedItem: any) => {
    const newItems = items.map((item : any) => item.Id === updatedItem.Id ? updatedItem : item);
    setItems(newItems);
  };

  React.useEffect(() => {
    _readAllKwitterItems().catch(console.error);
  }, []);

  return (
    <section>
      <ShowDialog onClose={() => console.log("Closed")} onSave={() => console.log("Saved")} updatePosts={_readAllKwitterItems} currentUser={currentUser} list={props.listName}/>
      <KwitterPost showAll={props.showAll} items={items} handleItemUpdate={handleItemUpdate} currentUser={currentUser} list={props.listName}/>
    </section>
  );
};

export default FsposKwitter;
