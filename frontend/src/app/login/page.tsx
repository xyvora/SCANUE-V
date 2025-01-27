import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

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
