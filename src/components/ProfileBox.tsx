import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

export default function ProfileBox() {
  const { data, isLoading, refetch } = trpc.profile.get.useQuery();
  const updateN = trpc.profile.update.useMutation();
  const deleteA = trpc.profile.delete.useMutation();
  const [name1, setName1] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data && data.name) {
      setName1(data.name);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p className="text-align">Failed to fetch data</p>;

  const updateName = async () => {
    setIsUpdating(true);
    await updateN.mutateAsync({ name: name1 });
    refetch();
    alert("updated name");
    setIsUpdating(false);
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    await deleteA.mutateAsync();
    setIsDeleting(false);
    alert("You account deleted successfully");
    window.location.href = "/";
  };

  return (
    <div className="mt-16 flex w-screen justify-center">
      <div>
        <label className="input-group">
          <span>Name</span>
          <input
            type="text"
            placeholder="info@site.com"
            className="input-bordered input"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Email</span>
          <input
            type="text"
            className="input-bordered input"
            disabled
            value={data.email!}
          />
        </label>
        {isUpdating ? (
          <button className="loading btn" />
        ) : (
          <button onClick={updateName} className="btn-primary btn">
            Update
          </button>
        )}

        {isDeleting ? (
          <button className="loading btn-error btn mt-4" />
        ) : (
          <button className="btn-error btn mt-4" onClick={deleteAccount}>
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
