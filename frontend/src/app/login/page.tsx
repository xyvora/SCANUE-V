import LoginForm from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SCANUE-V - Log In",
};

const Login = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;
