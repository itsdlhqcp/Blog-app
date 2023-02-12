import Categories from "components/categories";
import List from "components/list/index";
import {
  getPosts,
  getCount,
  getListUsernameAndPhotoURL,
} from "services/firebase/firebase";
import { useEffect, useState } from "react";

export default function Home() {
  const [list, setList] = useState(false);

  const isObjectEmpty = (objectName) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  useEffect(() => {
    async function getPostsData() {
      try {
        // Get doc with all of the username and photoURL
        const listUsersData = await getListUsernameAndPhotoURL();

        // Get doc with count of likes of all posts
        const count = await getCount();

        // Get posts
        const postsData = await getPosts();
        let finalList = postsData.map((post) => {
          console.log(post.authorUid);
          // Get short date
          const date = new Date(post.date);
          const options = { month: "short", day: "numeric" };

          return {
            ...post,
            username: listUsersData[post.authorUid].username,
            photoURL: listUsersData[post.authorUid].photoURL,
            date: date.toLocaleDateString(undefined, options),
            likes: count[post.id],
          };
        });

        console.log(finalList);
        // set List with definitve data to render in List component
        setList(finalList);
      } catch (error) {
        console.error(error);
      }
    }
    getPostsData();
  }, []);

  useEffect(() => {
    console.log(list);
  });
  return (
    <div>
      <Categories></Categories>
      {list === false ? (
        <div>Loading</div>
      ) : isObjectEmpty(list) ? (
        <div></div>
      ) : (
        <List list={list}></List>
      )}
    </div>
  );
}
