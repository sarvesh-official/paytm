"use client";
import { Appbar } from "@/components/AppBar";
import { Balance } from "@/components/Balance";
import { Users } from "@/components/Users";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/signin");
    } else {
      setToken(storedToken);
    }
    if (token) {
      axios
        .get("https://paytm-pied.vercel.app/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => setValue(res.data.balance));
    }
  }, [token]);
  return (
    <div className="">
      <Appbar />
      <div className="m-8">
        <Balance value={value} />
        <Users />
      </div>
    </div>
  );
};

export default page;
