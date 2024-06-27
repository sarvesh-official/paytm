"use client";

import { Button } from "@/components/Button";
import { BottomWarning } from "@/components/ButtonWarning";
import Heading from "@/components/Heading";
import { InputBox } from "@/components/InputBox";
import { SubHeading } from "@/components/SubHeading";
import { useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

dotenv.config();

const page = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  return (
    <div className="bg-slate-300 h-screen flex justify-center text-black">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Doe"
            label={"Last Name"}
          />
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
              label={"Sign up"}
              onClick={() => {
                const res = axios
                  .post(`https://paytm-pied.vercel.app/api/v1/user/signUp`, {
                    email: username,
                    password,
                    firstName,
                    lastName,
                  })
                  .then((res) => {
                    toast("Sign Up Successfull");
                    localStorage.setItem("token", res.data.token);
                    router.push("/dashboard");
                  });
              }}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
