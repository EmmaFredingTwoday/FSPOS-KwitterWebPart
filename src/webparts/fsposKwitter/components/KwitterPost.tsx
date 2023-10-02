// import React from "react";
// import { getSP } from '../pnpjsConfig';
// import { Icon } from '@fluentui/react/lib/Icon';
// import dayjs from 'dayjs';  
// import styles from './FsposKwitter.module.scss';

// interface IKwitterPostProps {
//   showAll: boolean;
//   items: any[];
//   handleItemUpdate: (updatedItem: any) => void;
//   currentUser: any;
//   popularThreshold?: number;
// }

// const KwitterPost: React.FC<IKwitterPostProps> = ({ showAll, items, handleItemUpdate, currentUser, popularThreshold = 30 }) => {
//   const currentUserId = currentUser.loginName;
//   const _sp = React.useRef(getSP());

//   const updateLikedBy = async (item: any, updatedLikes: number, updatedLikedByArray: string[]) => {
//     await _sp.current.web.lists.getByTitle('Taylor Kwitter 14').items.getById(item.Id).update({
//       Likes: updatedLikes,
//       Likedby: JSON.stringify(updatedLikedByArray)
//     });
//   };

//   const onLike = async (item: any) => {
//     const likedByArray = item.Likedby ? JSON.parse(item.Likedby) : [];
//     let updatedLikes = item.Likes;
//     let updatedLikedByArray = [...likedByArray]; // clone the array

//     if (likedByArray.includes(currentUserId)) {
//       // If the user has already liked the post
//       updatedLikes -= 1;
//       updatedLikedByArray = updatedLikedByArray.filter(id => id !== currentUserId);
//     } else {
//       // If the user hasn't liked the post yet
//       updatedLikes += 1;
//       updatedLikedByArray.push(currentUserId);
//     }

//     await updateLikedBy(item, updatedLikes, updatedLikedByArray);
//     const updatedItem = { ...item, Likedby: JSON.stringify(updatedLikedByArray), Likes: updatedLikes };
//     handleItemUpdate(updatedItem);
//   };

//   const getSeparatedPosts = (items: any[], threshold: number) => {
//     console.log("Get seperated posts", items, threshold)
//     const popularPosts = items.filter(item => item.Likes > threshold).slice(0, 3);
//     // was using includes but I think I have to update some tsconfig for that here...
//     const regularPosts = items.filter(item => popularPosts.indexOf(item) === -1);
//     return {
//       popularPosts,
//       regularPosts
//     };
//   };

//   const { popularPosts, regularPosts } = getSeparatedPosts(items, popularThreshold);

//   return (
//     <div>
//       <section>
//         {/* Render popular posts */}
//         {popularPosts.map((item: any) => (
//           <div className={styles["tweet-wrap"]} key={item.Id}>
//             <div className={styles["tweet-header"]}>
//               <img src={item.logo} alt="" className={styles.avator} />
//               <div className="tweet-header-info">
//                 {item.Title} <span>@{item.atTag}</span> <span>. { dayjs(item.Created).format("YYYY-MM-DD HH:mm")} </span>
//                 <p>{item.Text}</p>
//               </div>
//             </div>
//             <div className={styles["tweet-info-counts"]}>
//               <Icon iconName="Like" onClick={() => onLike(item)} />
//               <div className={styles.likes}>{item.Likes}</div>
//               <Icon iconName="hashtag" />
//               <div>This was liked by {item.Likedby}</div>
//             </div>
//           </div>
//         ))}
//         {/* Render regular posts */}
//         {regularPosts.map((item: any) => (
//             <div className={styles["tweet-wrap"]} key={item.Id}>
//               <div className={styles["tweet-header"]}>
//                 <img src={item.logo} alt="" className={styles.avator} />
//                 <div className="tweet-header-info">
//                   {item.Title} <span>@{item.atTag}</span> <span>. { dayjs(item.Created).format("YYYY-MM-DD HH:mm")} </span>
//                   <p>{item.Text}</p>
//                 </div>
//               </div>
//               <div className={styles["tweet-info-counts"]}>
//                 <Icon iconName="Like" onClick={() => onLike(item)} />
//                 <div className={styles.likes}>{item.Likes}</div>
//                 <Icon iconName="hashtag" />
//                 <div>This was liked by {item.Likedby}</div>
//               </div>
//             </div>
//         ))}
//       </section>
//     </div>
//   );
// }

// export default KwitterPost;

import React, { useState } from "react";
import { getSP } from '../pnpjsConfig';
import { Icon } from '@fluentui/react/lib/Icon';
import dayjs from 'dayjs';  
import styles from './FsposKwitter.module.scss';

interface IKwitterPostProps {
  showAll: boolean;
  items: any[];
  handleItemUpdate: (updatedItem: any) => void;
  currentUser: any;
  popularThreshold?: number;
}

const KwitterPost: React.FC<IKwitterPostProps> = ({ showAll, items, handleItemUpdate, currentUser, popularThreshold = 30 }) => {
  const currentUserId = currentUser.loginName;
  const _sp = React.useRef(getSP());

  const [currentFilter, setCurrentFilter] = useState(''); // New state for filter

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

    await updateLikedBy(item, updatedLikes, updatedLikedByArray);
    const updatedItem = { ...item, Likedby: JSON.stringify(updatedLikedByArray), Likes: updatedLikes };
    handleItemUpdate(updatedItem);
  };

  const getSeparatedPosts = (items: any[], threshold: number) => {
    console.log("Get seperated posts", items, threshold)
    const popularPosts = items.filter(item => item.Likes > threshold).slice(0, 3);
    // was using includes but I think I have to update some tsconfig for that here...
    const regularPosts = items.filter(item => popularPosts.indexOf(item) === -1);
    return {
      popularPosts,
      regularPosts
    };
  };

  const filterItemsByHashtag = (items: any[]) => {
    if (!currentFilter) return items;
    return items.filter(item => {
      const hashtags = item.hashtag ? JSON.parse(item.hashtag) : [];
      return hashtags.includes(currentFilter);
    });
  };

  const renderHashtags = (hashtagString: string) => {
    const hashtags = hashtagString ? JSON.parse(hashtagString) : [];
    return hashtags.map((hashtag : any, index : any) => (
      <span key={index} onClick={() => setCurrentFilter(hashtag)} className={styles.hashtag}>#{hashtag}</span>
    ));
  };

  const { popularPosts, regularPosts } = getSeparatedPosts(filterItemsByHashtag(items), popularThreshold);

  return (
    <div>
      {currentFilter && (
        <div>
          Filtering by: #{currentFilter}
          <button onClick={() => setCurrentFilter('')}>Clear Filter</button>
        </div>
      )}
      <section>
        {/* Render popular posts */}
        {popularPosts.map((item: any) => (
          <div className={styles["tweet-wrap"]} key={item.Id}>
              <div className={styles["tweet-header"]}>
                <img src={item.logo} alt="" className={styles.avator} />
                <div className="tweet-header-info">
                  {item.Title} <span>@{item.atTag}</span> <span>. { dayjs(item.Created).format("YYYY-MM-DD HH:mm")} </span>
                  <p>{item.Text}</p>
                </div>
              </div>
            <div className={styles["tweet-info-counts"]}>
              {renderHashtags(item.hashtag)}
              <Icon iconName="Like" onClick={() => onLike(item)} />
              <div className={styles.likes}>{item.Likes}</div>
              <Icon iconName="hashtag" />
              <div>This was liked by {item.Likedby}</div>
            </div>
          </div>
        ))}
        {/* Render regular posts */}
        {regularPosts.map((item: any) => (
          <div className={styles["tweet-wrap"]} key={item.Id}>
              <div className={styles["tweet-header"]}>
                <img src={item.logo} alt="" className={styles.avator} />
                <div className="tweet-header-info">
                  {item.Title} <span>@{item.atTag}</span> <span>. { dayjs(item.Created).format("YYYY-MM-DD HH:mm")} </span>
                  <p>{item.Text}</p>
                </div>
              </div>
            <div className={styles["tweet-info-counts"]}>
              {renderHashtags(item.hashtag)}
              <Icon iconName="Like" onClick={() => onLike(item)} />
              <div className={styles.likes}>{item.Likes}</div>
              <Icon iconName="hashtag" />
              <div>This was liked by {item.Likedby}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default KwitterPost;
