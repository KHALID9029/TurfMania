"use client"
import { useSession } from "next-auth/react"

export default function Dashboard(){

    const session = useSession();
    const userName = session.data?.user?.name;

    return (
    <>
      <div>
        This is {userName} Dashboard.
      </div>
    </>
  )
}