import { useEffect } from "react";

export function UserInfo({ userInfo }) {
  useEffect(() => {
    console.log(userInfo);
  }, []);
  return (
    <section>
      <section>
        <h1>Profile</h1>
      </section>
      <nav>
        <ul>
          <ol>Personal Info</ol>
        </ul>
      </nav>
      <section>
        <div>
          {userInfo.imgUrl ===
          "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" ? (
            <img src={userInfo.imgUrl} />
          ) : (
            <img src={userInfo.imgUrl} />
          )}
        </div>
      </section>
    </section>
  );
}
