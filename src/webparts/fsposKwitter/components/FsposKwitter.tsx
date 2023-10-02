import * as React from 'react';
import type { IFsposKwitterProps } from './IFsposKwitterProps';
import KwitterPost from './KwitterPost';
import ShowDialog from './ShowDialog';
import { IKwitterItem } from './Interfaces';
import { Logger, LogLevel } from "@pnp/logging";
import { getSP } from '../pnpjsConfig';

const FsposKwitter: React.FC<IFsposKwitterProps> = ({ currentUser, ...props }) => {
  const [items, setItems] = React.useState<any>([]);
  const [testListData, setTestListData] = React.useState<any[]>([]);
  const _sp = React.useRef(getSP());

  const _loadBy = async () => {
    const fetchedData = await _sp.current.web.lists.getByTitle('Test List').items();
    setTestListData(fetchedData);
  };

  const _readAllKwitterItems = async () => {
    try {
      console.log("READ KWITTER")
      const response: IKwitterItem[] = await _sp.current.web.lists
        .getByTitle('Taylor Kwitter 14')
        .items(); 
      setItems(response);
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
    _loadBy().catch(console.error);
  }, []);

  return (
    <section>
      {
        testListData.map((item: any) => (
          <div key={item.Id}>
            <h1>{item.Title}</h1>
            <p>{item.Body}</p>
            <button onClick={() => handleItemUpdate(item)}>
              Update
            </button>
          </div>
        ))
      }
      <ShowDialog onClose={() => console.log("Closed")} onSave={() => console.log("Saved")} updatePosts={_readAllKwitterItems} />
      <KwitterPost showAll={props.showAll} items={items} handleItemUpdate={handleItemUpdate} currentUser={currentUser} />
    </section>
  );
};

export default FsposKwitter;
