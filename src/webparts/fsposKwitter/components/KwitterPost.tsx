import React from "react";
import { getSP } from '../pnpjsConfig';
import { Icon } from '@fluentui/react/lib/Icon';
import dayjs from 'dayjs';  
import styles from './FsposKwitter.module.scss';

interface IKwitterPostProps {
  showAll: boolean;
  items: any[];
  handleItemUpdate: (updatedItem: any) => void;
  currentUser: any;
}

const KwitterPost: React.FC<IKwitterPostProps> = ({ showAll, items, handleItemUpdate, currentUser }) => {
  const currentUserId = currentUser.loginName;
  const _sp = React.useRef(getSP());

  const updateLikedBy = async (item: any, updatedLikes: number, updatedLikedByArray: string[]) => {
    await _sp.current.web.lists.getByTitle('Taylor Kwitter 14').items.getById(item.Id).update({
      Likes: updatedLikes,
      Likedby: JSON.stringify(updatedLikedByArray)
    });
  };

  const onLike = async (item: any) => {
    const likedByArray = item.Likedby ? JSON.parse(item.Likedby) : [];

    let updatedLikes = item.Likes;
    let updatedLikedByArray = [...likedByArray]; // clone the array

    if (likedByArray.includes(currentUserId)) {
      // If the user has already liked the post
      updatedLikes -= 1;
      updatedLikedByArray = updatedLikedByArray.filter(id => id !== currentUserId);
    } else {
      // If the user hasn't liked the post yet
      updatedLikes += 1;
      updatedLikedByArray.push(currentUserId);
    }

    try {
      // Update the backend
      await updateLikedBy(item, updatedLikes, updatedLikedByArray);

      // Update the frontend
      const updatedItem = { ...item, Likedby: JSON.stringify(updatedLikedByArray), Likes: updatedLikes };
      handleItemUpdate(updatedItem);
    } catch (error) {
    }
  };

  return (
    <div>
      <section>
        {items.map((item: any) => {
          const shortDateFormat = dayjs(item.Created).format("YYYY-MM-DD HH:mm");
          return (
            <div className={styles["tweet-wrap"]} key={item.Id}>
              <div className={styles["tweet-header"]}>
                <img src={item.logo} alt="" className={styles.avator} />
                <div className="tweet-header-info">
                  {item.Title} <span>@{item.atTag}</span> <span>. {shortDateFormat} </span>
                  <p>{item.Text}</p>
                </div>
              </div>
              <div className={styles["tweet-info-counts"]}>
                <Icon iconName="Like" onClick={() => onLike(item)} />
                <div className={styles.likes}>{item.Likes}</div>
                <Icon iconName="hashtag" />
                <div>This was liked by {item.Likedby}</div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default KwitterPost;
