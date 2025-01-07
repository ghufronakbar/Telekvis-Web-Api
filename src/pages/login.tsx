import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import Image from "next/image";
import axiosInstance from "@/config/axiosInstance";
import { AuthResponse, ResErr, ResOk } from "@/models/Api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import toast from "@/helper/toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      toast.loading();
      const { data } = await axiosInstance.post<ResOk<AuthResponse>>(
        "/account/login",
        { email, password }
      );
      Cookies.set("accessToken", data.data.accessToken);
      toast.success("Berhasil login");
      router.push("/dashboard");
    } catch (error) {
      const err = error as ResErr;
      toast.error(err.response?.data.message);
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Box
        className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] max-w-[400px] bg-white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <form onSubmit={onSubmit} className="w-full">
          <Stack gap="4" align="flex-start" className="w-full">
            <Image
              src="/logo.png"
              alt="Logo"
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
            <Field label="Email">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-100 px-2"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-100 px-2"
              />
            </Field>
            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
      <Toaster />
    </div>
  );
};

export default LoginPage;
