import { Metadata } from "next";
import UpdatePasswordComponent from "@/components/UpdatePassword";

export const metadata: Metadata = {
  title: "SCANUE-V - Update Password",
};

const UpdatePassword = () => {
  return (
    <div>
      <UpdatePasswordComponent />
    </div>
  );
};

export default UpdatePassword;
