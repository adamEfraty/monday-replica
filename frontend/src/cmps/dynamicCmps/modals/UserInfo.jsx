import { useEffect } from "react"

export function UserInfo({userInfo}){
    useEffect(() => {
        console.log(userInfo)
    }, [])
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
                    <img src={userInfo.imgUrl} />
                </div>
            </section>
        </section>
    )
}