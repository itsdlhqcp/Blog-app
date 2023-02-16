import Categories from "components/categories";
import List from "components/list/index";
import {
  getPosts,
  getCount,
  getListUsernameAndPhotoURL,
} from "services/firebase/firebase";
import { useEffect, useState } from "react";
import Loading from "components/loading";

export default function Latest() {
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
        let finalList = postsData
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          })
          .map((post) => {
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

        // set List with definitve data to render in List component
        setList(finalList);
      } catch (error) {
        console.error(error);
      }
    }
    getPostsData();
  }, []);

  return (
    <div>
      <Categories></Categories>
      {list === false ? (
        <Loading></Loading>
      ) : isObjectEmpty(list) ? (
        <div></div>
      ) : (
        <List list={list}></List>
      )}
    </div>
  );
}
