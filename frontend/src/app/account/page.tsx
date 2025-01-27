import { Metadata } from "next";
import AccountInfo from "@/components/AccountInfo";

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
