import { Metadata } from "next";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "SCANUE-V - Update Password",
};

const UpdatePassword = () => {
  return (
    <div>
      <UpdatePasswordForm />
    </div>
  );
};

export default UpdatePassword;
