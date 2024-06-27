"use client";
import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { InputBox } from "@/components/InputBox";
import { SubHeading } from "@/components/SubHeading";
import Heading from "@/components/Heading";
import { Button } from "@/components/Button";
import { BottomWarning } from "@/components/ButtonWarning";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useRouter();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your infromation to create an account"} />

          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="sarvesh@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post(
                  "https://paytm-pied.vercel.app/api/v1/user/signIn",
                  {
                    email: username,

                    password,
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate.push("/dashboard");
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign Uo"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
