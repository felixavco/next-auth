import { PrismaClient, User } from "@prisma/client";
import { NextPageContext } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
interface Props {
  users: User[];
}

export default function Component({ users }: Props) {
  const { data: session, status } = useSession();

  const printUsers = (user: User) => (
    <div id={user.id}>{user.name}</div>
  )

  if (session) {
    return (
      <>
        Signed in as ${session.user?.email}
        <br />
        {users.length ? (users.map(printUsers)) : null}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <h1>Not signed in</h1>
      <h3>{status}</h3>
      <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getStaticProps() {
  let users: User[] = [];
  const prisma = new PrismaClient()
  try {
    users = await prisma.user.findMany()

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }

  return {
    props: { users }
  }
}