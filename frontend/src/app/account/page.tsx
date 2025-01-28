import AccountInfo from "@/components/AccountInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SCANUE-V Account Information",
};

const Account = () => {
  return (
    <div>
      <AccountInfo />
    </div>
  );
};

export default Account;
