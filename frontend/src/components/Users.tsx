"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const Users = () => {
  // Replace with backend call
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios
      .get(`https://paytm-pied.vercel.app/api/v1/user/bulk?filter=${input}`)
      .then((res) => {
        setUsers(res.data.users);
      });
  }, [input]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

function User({ user }) {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName.toUpperCase()[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>{user.firstName + " " + user.lastName}</div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={() => {
            router.push(`/send?to=${user._id}&name=${user.firstName}`);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
