import { type NextPage } from "next";
import TimersList from "../components/TimersList";
import Layout from "../components/Layout";
import PlusButton from "../components/PlusButton";
import { useSession } from "next-auth/react";
import Notify from "../components/Nofity";
import Loading from "../components/Loading";

const Home: NextPage = () => {
  const session = useSession();

  if (session.status === "loading") return <Loading />;

  return (
    <Layout title="Timers">
      {session.data?.user ? (
        <>
          <TimersList />
          <PlusButton />
        </>
      ) : (
        <Notify>Sign In to Manage your timers</Notify>
      )}
    </Layout>
  );
};

export default Home;
